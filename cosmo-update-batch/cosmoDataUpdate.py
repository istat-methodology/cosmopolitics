# Version 0.3.0

import os
import sys
import urllib.request
import logging
import py7zr
import pandas as pd
import numpy as np
import datetime
import time
import json
import sqlite3
import shutil
from sqlite3 import Error

from dataclasses import dataclass
from pathlib import Path
from re import S

from dateutil.relativedelta import relativedelta

from azure.storage.file import FileService
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from opencensus.ext.azure.log_exporter import AzureLogHandler

from cosmoUtility import *

import multiprocessing as mp
from functools import partial


def is_application_insight_configured():
    return os.getenv('APPINSIGHTS_INSTRUMENTATIONKEY')!=None or os.getenv('APPLICATIONINSIGHTS_CONNECTION_STRING')!=None

SEP=","
DATA_EXTENTION=".dat"
CSV_EXTENTION=".csv"
PREFIX_FULL="full"
PREFIX_TRANSPORT="tr"
FLOW_IMPORT=1
FLOW_EXPORT=2
COLS_CLS_PRODUCTS=4

KEY_VAULT_NAME="statlab-key-vault"
SECRETNAME_ACCOUNTKEY="cosmostoragekey"

processing_day = datetime.datetime.today()

this_year=processing_day.year
this_month='%02d' %processing_day.month
annual_new_data=1 if( processing_day < datetime.datetime(processing_day.year , 3, 20)) else 0
annual_current_year=(datetime.datetime.strptime(str(processing_day.year), "%Y") - relativedelta(years=annual_new_data)- relativedelta(years=1)).year
annual_previous_year=(datetime.datetime.strptime(str(processing_day.year), "%Y") - relativedelta(years=annual_new_data)- relativedelta(years=2)).year

months_to_extract_48=48
months_to_extract_136=136
offset_month_to_extract=3
window_months_36=36
window_months_12=12

start_data_load_120= datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)- relativedelta(months=months_to_extract_136-1)
start_data_load_36= datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)- relativedelta(months=window_months_36-1)
start_data_load_48= datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)- relativedelta(months=months_to_extract_48-1)
start_data_load_12= datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)- relativedelta(months=window_months_12-1)

end_data_load=datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)

##### SET DATES FOR PAGES #####
start_data_PAGE_MAP=start_data_load_36
start_data_PAGE_TIME_SERIES=start_data_load_120
start_data_PAGE_GRAPH_EXTRA_UE=start_data_load_36
start_data_PAGE_GRAPH_INTRA_UE=start_data_load_36
start_data_PAGE_BASKET=start_data_load_36
months_extracted=months_to_extract_136

WORKING_FOLDER=os.environ['WORKING_FOLDER']
logging.basicConfig(level=logging.INFO,
    format='%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S')

logger = logging.getLogger(__name__)

if is_application_insight_configured():
    log_handler = AzureLogHandler()
    logger.addHandler(log_handler)
else:
    logger.warning('Application insights is not configured.')


#logger.info('Environment: ' + str(os.environ))

job_id=os.getenv('AZ_BATCH_JOB_ID','').replace(':','_')
DATA_FOLDER_PARENT=WORKING_FOLDER+os.sep+"data"+(('__' + job_id) if (job_id != '') else '')
DATA_FOLDER=DATA_FOLDER_PARENT+os.sep+str(this_year)+str(this_month)+os.sep
SQLITE_TMPDIR = DATA_FOLDER+os.sep+"tmpdb"
os.environ['SQLITE_TMPDIR'] = SQLITE_TMPDIR

DATA_FOLDER_MONTHLY=DATA_FOLDER+os.sep+"monthly"

DATA_FOLDER_ANNUAL=DATA_FOLDER+os.sep+"annual"
DATA_FOLDER_ANNUAL_DATS=DATA_FOLDER_ANNUAL+os.sep+"files"
DATA_FOLDER_ANNUAL_ZIPS=DATA_FOLDER_ANNUAL+os.sep+"zips"
DATA_FOLDER_ANNUAL_OUTPUT=DATA_FOLDER_ANNUAL+os.sep+"output"

#files name  OUTPUT const
ieinfo_filename=DATA_FOLDER_ANNUAL_OUTPUT+os.sep+"ieinfo.json"

IMPORT_SERIES_JSON=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"importseries.json"
EXPORT_SERIES_JSON=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"exportseries.json"

IMPORT_QUANTITY_JSON=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"importQuantity.json"
EXPORT_QUANTITY_JSON=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"exportQuantity.json"

IMPORT_VALUE_JSON=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"importValue.json"
EXPORT_VALUE_JSON=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"exportValue.json"

COMEXT_IMP_CSV=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"comext_imp.csv"
COMEXT_EXP_CSV=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"comext_exp.csv"

CPA_INTRA_CSV=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"cpa_intra.csv"
CPA_TRIM_CSV=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"cpa_trim.csv"

CPA2_PRODUCT_CODE_CSV=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"cpa2_products.csv"
CPA3_PRODUCT_CODE_CSV=DATA_FOLDER_MONTHLY+os.sep+"output"+os.sep+"cpa3_products.csv"

TR_EXTRA_UE_CSV=DATA_FOLDER_MONTHLY+os.sep+"tr"+os.sep+"tr_extra_ue.csv"
TR_PRODUCT_CODE_CSV=DATA_FOLDER_MONTHLY+os.sep+"tr"+os.sep+"tr_products_code.csv"

TR_EXTRA_UE_TRIMESTRALI_CSV=DATA_FOLDER_MONTHLY+os.sep+"tr"+os.sep+"tr_extra_ue_trim.csv"

ANNUAL_POPULATION_URL="https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/DEMO_GIND/?format=SDMX-CSV&i"
ANNUAL_POPULATION_CSV=DATA_FOLDER+os.sep+"DEMO_GIND.csv"

ANNUAL_INDUSTRIAL_PRODUCTION_URL="https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/STS_INPR_A/?format=SDMX-CSV&i"
ANNUAL_INDUSTRIAL_PRODUCTION_FILE_CSV=DATA_FOLDER+os.sep+"STS_INPR_A.csv"

ANNUAL_UNEMPLOYEMENT_URL="https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/UNE_RT_A/?format=SDMX-CSV&i"
ANNUAL_UNEMPLOYEMENT_FILE_CSV=DATA_FOLDER+os.sep+"UNE_RT_A.csv"

GENERAL_INFO_FILE=DATA_FOLDER+os.sep+"metadata.json"

SQLLITE_DB=DATA_FOLDER_MONTHLY+os.sep+PREFIX_FULL+os.sep+"commext.db"

## ogni 20 del mese scaricare il file annuale fullAAAAMM.7z con 52 al posto del mese (esempio file full201952.7z)
## data URL_COMEXT
URL_COMEXT_PRODUCTS="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2Fbulk_download%2FCOMEXT_DATA%2FPRODUCTS%2F"

URL_COMEXT_TR="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2Fbulk_download%2FCOMEXT_DATA%2FTRANSPORT_NSTR%2F"

URL_COMEXT_CLS_PRODUCTS="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2Fbulk_download%2FCOMEXT_METADATA%2FCLASSIFICATIONS_AND_RELATIONS%2FCLASSIFICATIONS%2FENGLISH%2FCN.txt"
CLS_PRODUCTS_FILE=DATA_FOLDER+os.sep+"cls_products.dat"

URL_CLS_NSTR="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2Fbulk_download%2FCOMEXT_METADATA%2FCLASSIFICATIONS_AND_RELATIONS%2FCLASSIFICATIONS%2FENGLISH%2FNSTR.txt"
CLS_NSTR_FILE=DATA_FOLDER+os.sep+"NSTR.txt"

URL_CLS_CPA="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2Fbulk_download%2FCOMEXT_METADATA%2FCLASSIFICATIONS_AND_RELATIONS%2FCLASSIFICATIONS%2FENGLISH%2FCPA21.txt"
CLS_PRODUCTS_CPA_FILE=DATA_FOLDER+os.sep+"cls_products_CPA21.txt"




def downloadAndExtractFile(param,extract_path):
    url_file=param[0]
    file_zip=param[1]
    count_downloaded=0
    count_extracted=0
    count_error=0
    
    logger.info('File: '+url_file)
    logger.info('File zip: '+file_zip)
    logger.info('extract path: '+extract_path)
    logger.info('Downloading....')  

    try:
        urllib.request.urlretrieve(url_file,file_zip)
        count_downloaded+= 1
        with py7zr.SevenZipFile(file_zip) as z:
            z.extractall(path=extract_path)
            count_extracted+= 1
    except BaseException as err:
        logger.error("Unexpected "+str(err)+" ; type: "+str(type(err)))
        count_error+= 1
    else:
        logger.info('File loaded and extracted: '+file_zip)  
        
    return (count_downloaded,count_extracted,count_error)   

def downloadAndExtractComextMonthlyDATAParallel(url_download,prefix_file,start_data,end_data):
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+prefix_file
    DATA_FOLDER_MONTHLY_DATS=DATA_FOLDER_WORKING+os.sep+"files"
    DATA_FOLDER_MONTHLY_ZIPS=DATA_FOLDER_WORKING+os.sep+"zips"
    createFolder(DATA_FOLDER_MONTHLY_DATS)
    createFolder(DATA_FOLDER_MONTHLY_ZIPS)

    logger.info('Path: '+DATA_FOLDER_WORKING)

    count_downloaded=0
    count_extracted=0
    count_error=0
    urls = []
    for current_month in month_iter(start_data.month, start_data.year, end_data.month, end_data.year):

        current_month_month=current_month[0]
        current_month_year=current_month[1]
        
        filenameZip=prefix_file+str(current_month_year)+str(current_month_month)+".7z"
        url_file=url_download+filenameZip
        fileMonthlyZip=DATA_FOLDER_MONTHLY_ZIPS+os.sep+filenameZip
        urls.append((url_file,fileMonthlyZip))
    
    #spark
    #spark = SparkSession.builder.getOrCreate()     
    #listing = spark.sparkContext.parallelize(urls)
    #ris=listing.map(lambda url: downloadAndExtractFile(url[0],url[1], DATA_FOLDER_MONTHLY_DATS)).collect()
    
    #mp
    logger.info("Number of processors: ", mp.cpu_count())
    pool = mp.Pool(mp.cpu_count())
    ris=pool.map(partial(downloadAndExtractFile,extract_path=DATA_FOLDER_MONTHLY_DATS),urls)
   
    count_downloaded,count_extracted,count_error=map(sum, zip(*ris))
        
    logger.info('Monthly files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error')

    return 'Monthly files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error '

def downloadAndExtractComextMonthlyDATA(url_download,prefix_file,start_data,end_data):
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+prefix_file
    DATA_FOLDER_MONTHLY_DATS=DATA_FOLDER_WORKING+os.sep+"files"
    DATA_FOLDER_MONTHLY_ZIPS=DATA_FOLDER_WORKING+os.sep+"zips"
    createFolder(DATA_FOLDER_MONTHLY_DATS)
    createFolder(DATA_FOLDER_MONTHLY_ZIPS)

    logger.info('Path: '+DATA_FOLDER_WORKING)

    count_downloaded=0
    count_extracted=0
    count_error=0
    for current_month in month_iter(start_data.month, start_data.year, end_data.month, end_data.year):

        current_month_month=current_month[0]
        current_month_year=current_month[1]

        logger.info(str(current_month_year)+" "+str(current_month_month))
        filenameZip=prefix_file+str(current_month_year)+str(current_month_month)+".7z"

        url_file=url_download+filenameZip
        fileMonthlyZip=DATA_FOLDER_MONTHLY_ZIPS+os.sep+filenameZip

        logger.info('File: '+url_file)
        logger.info('Downloading....')  

        try:
            urllib.request.urlretrieve(url_file,fileMonthlyZip)
            count_downloaded+= 1
            with py7zr.SevenZipFile(fileMonthlyZip) as z:
                z.extractall(path=DATA_FOLDER_MONTHLY_DATS)
                count_extracted+= 1
        except BaseException as err:
            logger.error("Unexpected "+str(err)+" ; type: "+str(type(err)))
            count_error+= 1
        else:
            logger.info('File loaded: '+filenameZip)  
        
    logger.info('Monthly files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error')

    return 'Monthly files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error '


def downloadAndExtractComextAnnualDATA():
    createFolder(DATA_FOLDER_ANNUAL_DATS)
    createFolder(DATA_FOLDER_ANNUAL_ZIPS)

    count_downloaded=0
    count_extracted=0
    count_error=0

    for current_year in [annual_previous_year,annual_current_year]:
        filenameZip="full"+str(current_year)+"52.7z"
        
        url_file=URL_COMEXT_PRODUCTS+filenameZip
        fileAnnualZip=DATA_FOLDER_ANNUAL_ZIPS+os.sep+filenameZip

        logger.info('File: '+url_file)
        logger.info('Downloading....')

        try:
            urllib.request.urlretrieve(url_file,fileAnnualZip)
            count_downloaded+= 1
            with py7zr.SevenZipFile(fileAnnualZip) as z:
                z.extractall(path=DATA_FOLDER_ANNUAL_DATS)
                count_extracted+= 1
        except BaseException as err:
            logger.error("Unexpected "+str(err)+" ; type: "+str(type(err)))
            count_error+= 1
        else:
            logger.info('File loaded: '+filenameZip)  
    
    logger.info('Annual files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error')
    
    return 'Annual files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error '

def downloadAndExtractComextAnnualDATAParallel():
    createFolder(DATA_FOLDER_ANNUAL_DATS)
    createFolder(DATA_FOLDER_ANNUAL_ZIPS)

    count_downloaded=0
    count_extracted=0
    count_error=0
    urls = []
    for current_year in [annual_previous_year,annual_current_year]:
        filenameZip="full"+str(current_year)+"52.7z"
        
        url_file=URL_COMEXT_PRODUCTS+filenameZip
        fileAnnualZip=DATA_FOLDER_ANNUAL_ZIPS+os.sep+filenameZip

        logger.info('File: '+url_file)
        logger.info('Downloading....')
        urls.append((url_file,fileAnnualZip))
    
    #spark version
    #spark = SparkSession.builder.getOrCreate()     
    #listing = spark.sparkContext.parallelize(urls)
    #ris=listing.map(lambda url: downloadAndExtractFile(url, DATA_FOLDER_ANNUAL_DATS)).collect()

    #mp<
    logger.info("Number of processors: ", mp.cpu_count())
    pool = mp.Pool(mp.cpu_count())
    
    ris=pool.map(partial(downloadAndExtractFile,extract_path=DATA_FOLDER_ANNUAL_DATS),urls)
    count_downloaded,count_extracted,count_error=map(sum, zip(*ris))
    
    
    logger.info('Annual files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error')
    
    return 'Annual files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error '


def downloadfile(url_file,filename):
    createFolder(os.path.dirname(filename))
    try:
        urllib.request.urlretrieve(url_file,filename)
    except BaseException as err:
        logger.error("Unexpected "+str(err)+" ; type: "+str(type(err)))
    else:
        logger.info('File loaded: '+filename)  
    return 'File loaded: '+filename


def getClsProduct(clsRow,codeProduct,position=(COLS_CLS_PRODUCTS-1)):
    if ((len(clsRow)>0) & (len(clsRow.columns)>=position)):
        return clsRow.iat[0,position]
    else:
        return codeProduct


def getClsProductByCode(cls_products, product,position=(COLS_CLS_PRODUCTS-1)):
    return getClsProduct(cls_products[cls_products[0]==product],product,position)


def getValueFromList(clsRow,code,position):
    if ((len(clsRow)>0) & (len(clsRow.columns)>=position)):
        return clsRow.iat[0,position]
    else:
        return code


def annualProcessing():
    logger.info('annualProcessing()')
    createFolder(DATA_FOLDER_ANNUAL_OUTPUT)
    ieinfo=[]
    current_filename=DATA_FOLDER_ANNUAL_DATS+os.sep+PREFIX_FULL+str(annual_current_year)+"52.dat"
    previous_filename=DATA_FOLDER_ANNUAL_DATS+os.sep+PREFIX_FULL+str(annual_previous_year)+"52.dat"

    logger.info('loading.. '+CLS_PRODUCTS_FILE)
    cls_products=pd.read_csv(CLS_PRODUCTS_FILE,sep="\t",low_memory=True,header=None,keep_default_na=False, na_values=[''] ,encoding="latin-1")
    logger.info('cls_products.head() ')
    logger.info(cls_products.head())

    logger.info('loading.. '+ANNUAL_POPULATION_CSV)
    #ANNUAL_POPULATION_CSV
    annual_population=pd.read_csv(ANNUAL_POPULATION_CSV,sep=",",keep_default_na=False, na_values=[''])
    # FIX Greece code EL in GR
    annual_population["geo"]=annual_population["geo"].replace(['EL'],'GR')
    
    logger.info('loading.. '+ANNUAL_INDUSTRIAL_PRODUCTION_FILE_CSV)
    #ANNUAL_INDUSTRIAL_PRODUCTION_FILE_CSV
    annual_industrial_production=pd.read_csv(ANNUAL_INDUSTRIAL_PRODUCTION_FILE_CSV,sep=",",keep_default_na=False, na_values=[''])
    # FIX Greece code EL in GR
    annual_industrial_production["geo"]=annual_industrial_production["geo"].replace(['EL'],'GR')

    logger.info('loading.. '+ANNUAL_UNEMPLOYEMENT_FILE_CSV)
    #ANNUAL_UNEMPLOYEMENT_FILE_CSV
    annual_unemployement=pd.read_csv(ANNUAL_UNEMPLOYEMENT_FILE_CSV,sep=",",keep_default_na=False, na_values=[''])
    # FIX Greece code EL in GR
    annual_unemployement["geo"]=annual_unemployement["geo"].replace(['EL'],'GR')
    
    logger.info('loading.. '+previous_filename)
    data_annual_previous_year =pd.read_csv(previous_filename,sep=",",low_memory=True,keep_default_na=False, na_values=[''])
    logger.info('loading.. '+current_filename)
    data_annual_current_year =pd.read_csv(current_filename,sep=",",low_memory=True,keep_default_na=False, na_values=[''])

    logger.info('previous_filename: '+previous_filename)
    logger.info('current_filename: '+current_filename)
    logger.info('data.head() ')
    logger.info(data_annual_current_year.head())

    countries=sorted(pd.unique(data_annual_current_year["DECLARANT_ISO"]))
    logger.info('countries: '+ ' '.join(countries))
    n_rows=3

    for country in countries:
        logger.info('country: '+country)
        ieinfo_country={}
        ieinfo_country["Country_Code"]=country

        # Main information
        minfo=[]

        summary_population={}
        summary_population["Year"]= "Population"

        summary_population[str(annual_previous_year)]=getValueFromList(annual_population[(annual_population["indic_de"]=="JAN") & (annual_population["geo"]==country) & (annual_population["TIME_PERIOD"]==annual_previous_year) ],np.int64(0),6).astype(np.int64)
        summary_population[str(annual_current_year)]=getValueFromList(annual_population[(annual_population["indic_de"]=="JAN") & (annual_population["geo"]==country) & (annual_population["TIME_PERIOD"]==annual_current_year) ],np.int64(0),6).astype(np.int64)
        minfo.append(summary_population)

        summary_industrial_production={}
        summary_industrial_production["Year"]= "Industrial Production"

        summary_industrial_production[str(annual_previous_year)]=getValueFromList(annual_industrial_production[(annual_industrial_production["nace_r2"]=="B-D") & (annual_industrial_production["s_adj"]=="CA") & (annual_industrial_production["unit"]=="I15") & (annual_industrial_production["geo"]==country) & (annual_industrial_production["TIME_PERIOD"]==annual_previous_year) ],"",9)
        summary_industrial_production[str(annual_current_year)]=getValueFromList(annual_industrial_production[(annual_industrial_production["nace_r2"]=="B-D") & (annual_industrial_production["s_adj"]=="CA") & (annual_industrial_production["unit"]=="I15") & (annual_industrial_production["geo"]==country) & (annual_industrial_production["TIME_PERIOD"]==annual_current_year) ],"",9)
        minfo.append(summary_industrial_production)

        summary_unemployement={}
        summary_unemployement["Year"]= "Unemployment"

        summary_unemployement[str(annual_previous_year)]=getValueFromList(annual_unemployement[(annual_unemployement["age"]=="Y15-74") & (annual_unemployement["geo"]==country) & (annual_unemployement["TIME_PERIOD"]==annual_previous_year) ],"",8)
        summary_unemployement[str(annual_current_year)]=getValueFromList(annual_unemployement[(annual_unemployement["age"]=="Y15-74") & (annual_unemployement["geo"]==country) & (annual_unemployement["TIME_PERIOD"]==annual_current_year) ],"",8)
        minfo.append(summary_unemployement)

        minfo_imp={}
        minfo_imp["Year"]="Import"
        minfo_imp[str(annual_previous_year)]=data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_IMPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum()
        minfo_imp[str(annual_current_year)]= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_IMPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum()
        minfo.append(minfo_imp)

        minfo_exp={}
        minfo_exp["Year"]="Export"
        minfo_exp[str(annual_previous_year)]=data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_EXPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum()
        minfo_exp[str( annual_current_year)]= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_EXPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum()
        minfo.append(minfo_exp)
        ieinfo_country["Main information"]=minfo
        # Main Import partner
        mips_j=[]
        logger.info('# Main Import partner')
        mips_previous= data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_IMPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PARTNER_ISO"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()
        mips_current= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_IMPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PARTNER_ISO"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()
     
        for index  in range(n_rows):
            mip_j={}
            mip_j["Main partner "+str(annual_previous_year)]= mips_previous.loc[index,"PARTNER_ISO"]
            mip_j["Total import "+str(annual_previous_year)]= mips_previous.loc[index,"VALUE_IN_EUROS"]
            mip_j["Main partner "+str(annual_current_year)]= mips_current.loc[index,"PARTNER_ISO"]
            mip_j["Total import "+str(annual_current_year)]= mips_current.loc[index,"VALUE_IN_EUROS"]
            mips_j.append(mip_j)

        ieinfo_country["Main Import Partners"]=mips_j
        # Main Export partner
        meps_j=[]
        meps_previous= data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_EXPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PARTNER_ISO"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()
        meps_current= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_EXPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PARTNER_ISO"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()
        logger.info(' Main Export Partners ...')
        for index2 in range(n_rows):
            mep_j={}
            mep_j["Main partner "+str(annual_previous_year)]= meps_previous.loc[index2,"PARTNER_ISO"]
            mep_j["Total export "+str(annual_previous_year)]= meps_previous.loc[index2,"VALUE_IN_EUROS"]
            mep_j["Main partner "+str(annual_current_year)]= meps_current.loc[index2,"PARTNER_ISO"]
            mep_j["Total export "+str(annual_current_year)]= meps_current.loc[index2,"VALUE_IN_EUROS"]
            meps_j.append(mep_j)

        ieinfo_country["Main Export Partners"]=meps_j
        logger.info('"Main Import Goods ...')
        # Main Import good
        migs_j=[]
        migs_previous= data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_IMPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()
        migs_current= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_IMPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()

        for index  in range(n_rows):
            previous_product=migs_previous.loc[index,"PRODUCT_NC"]
            current_product=migs_current.loc[index,"PRODUCT_NC"]
            mig_j={}
            mig_j["Main good "+str(annual_previous_year)]=getClsProduct(cls_products[(cls_products[0]==previous_product) & (pd.to_datetime(cls_products[1],errors='coerce', format="%d/%m/%y").dt.year.fillna(0)<=annual_previous_year) & (pd.to_datetime(cls_products[2],errors='coerce', format="%d/%m/%y").dt.year.fillna(2500)>=annual_previous_year) ],previous_product)
            mig_j["Total import "+str(annual_previous_year)]= migs_previous.loc[index,"VALUE_IN_EUROS"]
            mig_j["Main good "+str(annual_current_year)]=getClsProduct(cls_products[(cls_products[0]==current_product) & (pd.to_datetime(cls_products[1],errors='coerce', format="%d/%m/%y").dt.year.fillna(0)<=annual_current_year) & (pd.to_datetime(cls_products[2],errors='coerce', format="%d/%m/%y").dt.year.fillna(2500)>=annual_current_year) ],current_product)
            mig_j["Total import "+str(annual_current_year)]= migs_current.loc[index,"VALUE_IN_EUROS"]
            migs_j.append(mig_j)

        ieinfo_country["Main Import Goods"]=migs_j
        logger.info('Main Export Goods ...')    
        # Main Export partner
        megs_j=[]
        megs_previous= data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_EXPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()
        megs_current= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_EXPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index()

        for index in range(n_rows):
            previous_product=megs_previous.loc[index,"PRODUCT_NC"]
            current_product=megs_current.loc[index,"PRODUCT_NC"]
            meg_j={}
            meg_j["Main good "+str(annual_previous_year)]=getClsProduct(cls_products[(cls_products[0]==previous_product) & (pd.to_datetime(cls_products[1],errors='coerce', format="%d/%m/%y").dt.year.fillna(0)<=annual_previous_year) & (pd.to_datetime(cls_products[2],errors='coerce', format="%d/%m/%y").dt.year.fillna(2500)>=annual_previous_year) ],previous_product)
            meg_j["Total export "+str(annual_previous_year)]= megs_previous.loc[index,"VALUE_IN_EUROS"]
            meg_j["Main good "+str(annual_current_year)]=getClsProduct(cls_products[(cls_products[0]==current_product) & (pd.to_datetime(cls_products[1],errors='coerce', format="%d/%m/%y").dt.year.fillna(0)<=annual_current_year) & (pd.to_datetime(cls_products[2],errors='coerce', format="%d/%m/%y").dt.year.fillna(2500)>=annual_current_year) ],current_product)
            meg_j["Total export "+str(annual_current_year)]= megs_current.loc[index,"VALUE_IN_EUROS"]
            megs_j.append(meg_j)

        ieinfo_country["Main Export Goods"]=megs_j
        logger.info('annual file ...')    
        ieinfo.append(ieinfo_country)

    with open(ieinfo_filename, 'w') as f:
        json.dump(ieinfo, f, ensure_ascii=False, indent = 4,cls=NpEncoder)

    return 'Annual processing ok: file created '+ieinfo_filename


def createGeneralInfoOutput():
    createFolder(DATA_FOLDER)
    if os.getenv('AZ_BATCH_TASK_WORKING_DIR','') != '':
        os.symlink(DATA_FOLDER_PARENT, os.environ['AZ_BATCH_TASK_WORKING_DIR']+os.sep+'data')

    info_processing={}
    info_processing["processingDay"]=processing_day.strftime("%d-%m-%Y, %H:%M:%S")
    info_processing["annualCurrentYear"]=annual_current_year
    info_processing["annualPreviousYear"]=annual_previous_year
    info_processing["lastLoadedData"]=end_data_load.strftime("%m, %Y")
    info_processing["windowMonths"]=window_months_36

    info_processing["monthsToTxtract"]=months_extracted
    info_processing["offsetMonthToExtract"]=offset_month_to_extract
    info_processing["appVersion"]="1.0.0"

    time_map_start={}
    values={}
    values["timeSelected"]=str(this_year)+str(this_month)

    time_map_start["year"]= int(start_data_PAGE_MAP.strftime("%Y"))
    time_map_start["month"]= int(start_data_PAGE_MAP.strftime("%m"))
    values["timeStart"]= time_map_start
    time_map_end={}
    time_map_end["year"]= int(end_data_load.strftime("%Y"))
    time_map_end["month"]= int(end_data_load.strftime("%m"))
    values["timeEnd"]= time_map_end
    info_processing["map"]=values

    time_graph_start={}
    time_graphp_end={}
    values={}
    values["timeSelected"]=str(this_year)+str(this_month)
    time_graph_start["year"]= int(start_data_PAGE_GRAPH_EXTRA_UE.strftime("%Y"))
    time_graph_start["month"]=int( start_data_PAGE_GRAPH_EXTRA_UE.strftime("%m"))
    values["timeStart"]= time_graph_start
    time_graphp_end["year"]=int( end_data_load.strftime("%Y"))
    time_graphp_end["month"]= int(end_data_load.strftime("%m"))
    values["timeEnd"]= time_graphp_end
    info_processing["graph"]=values

    time_graphplus_start={}
    time_graphpplus_end={}
    values={}
    values["timeSelected"]=str(this_year)+str(this_month)
    time_graphplus_start["year"]= int(start_data_PAGE_GRAPH_INTRA_UE.strftime("%Y"))
    time_graphplus_start["month"]= int(start_data_PAGE_GRAPH_INTRA_UE.strftime("%m"))
    values["timeStart"]= time_graphplus_start
    time_graphpplus_end["year"]= int(end_data_load.strftime("%Y"))
    time_graphpplus_end["month"]=int( end_data_load.strftime("%m"))
    values["timeEnd"]= time_graphpplus_end
    info_processing["graphPlus"]=values

    time_trade_start={}
    values={}
    values["timeSelected"]=str(this_year)+str(this_month)
    time_trade_start["year"]= int(start_data_PAGE_BASKET.strftime("%Y"))
    time_trade_start["month"]= int(start_data_PAGE_BASKET.strftime("%m"))
    values["timeStart"]= time_trade_start
    time_trade_end={}
    time_trade_end["year"]= int(end_data_load.strftime("%Y"))
    time_trade_end["month"]= int(end_data_load.strftime("%m"))
    values["timeEnd"]= time_trade_end

    info_processing["trade"]=values

    with open(GENERAL_INFO_FILE, 'w') as f:
        json.dump(info_processing, f, ensure_ascii=False, indent = 1,cls=NpEncoder)
    
    return "Info general OK, created file: "+GENERAL_INFO_FILE


def createMonthlyFULLtable():
    createFolder(SQLITE_TMPDIR)
    DATA_FOLDER_MONTHLY_DATS=DATA_FOLDER_MONTHLY+os.sep+PREFIX_FULL+os.sep+"files"
    logger.info(SQLLITE_DB)
    conn = sqlite3.connect(SQLLITE_DB)
    cur = conn.cursor()
    logger.info('Creating table  comext_full ')
    cur.execute('DROP TABLE IF EXISTS comext_full;')
    cur.execute('CREATE TABLE comext_full (DECLARANT_ISO TEXT,PARTNER_ISO TEXT,PRODUCT_NC TEXT,PRODUCT_CPA2_1 TEXT,PRODUCT_BEC TEXT,FLOW INTEGER,PERIOD INTEGER, VALUE_IN_EUROS INTEGER, QUANTITY_IN_KG INTEGER,CPA2 TEXT,CPA23 TEXT,CPA3 TEXT,IS_PRODUCT INTEGER DEFAULT 0)' )

    logger.info('DATA_FOLDER_MONTHLY_DATS: '+DATA_FOLDER_MONTHLY_DATS)
    count=0
    index=0
    for filedat in os.scandir(DATA_FOLDER_MONTHLY_DATS):
        if filedat.is_file():
            comext_monthly_data=pd.read_csv(filedat,sep=",",low_memory=True,keep_default_na=False, na_values=[''])
            length= len(comext_monthly_data.index)
            count+=length
            index+=1
            logger.info(str(index)+ ') loaded rows:'+str(length)+' count:'+str(count)+'  file: '+filedat.name)
            comext_monthly_data[['DECLARANT_ISO','PARTNER_ISO', 'PRODUCT_NC','PRODUCT_CPA2_1','PRODUCT_BEC','FLOW','PERIOD','VALUE_IN_EUROS','QUANTITY_IN_KG']].to_sql('comext_full', conn, if_exists='append', index = False, chunksize = 10000)

    for row in cur.execute('SELECT count(*) FROM comext_full '):
        logger.info('from count:'+str(count))
        logger.info('from DB:'+str(row))

    logger.info('UPDATE TABLE comext_full A CPA2, CPA23 CPA3 TEXT')
    cur.execute('''UPDATE comext_full SET CPA2=substr(product_cpa2_1,1,2), CPA23=substr(product_cpa2_1,1,2)||' ', CPA3=substr(product_cpa2_1,1,3),IS_PRODUCT=1  WHERE length(product_nc)==8;''')
    conn.commit()
    if conn:
        conn.close()
    
    return "TABLE comext_full created!"


def monthlyProcessing():
    conn = sqlite3.connect(SQLLITE_DB)

    cur = conn.cursor()

    # Create table Series
    ## considero un 1 anno prima es 48 per 36 mesi
    filter_yyymm=str(start_data_PAGE_MAP.year-1)+str('%02d' %start_data_PAGE_MAP.month)
    logger.info('Creating Series table ')
    cur.execute('DROP TABLE IF EXISTS serie_per_mappa0;')
    cur.execute("Create table serie_per_mappa0 as select declarant_iso, period, flow, sum(value_in_euros) as value_in_euros from comext_full where product_nc= 'TOTAL' and period>="+filter_yyymm+" group by declarant_iso, period,flow;")
    cur.execute('DROP TABLE IF EXISTS serie_per_mappa;')
    cur.execute("Create table serie_per_mappa as select a.declarant_iso, a.period, a.flow, round(100.00*( (a.value_in_euros-b.value_in_euros)*1.0  / b.value_in_euros ),2) as tendenziale from serie_per_mappa0 a, serie_per_mappa0 b where a.flow=b.flow and a.declarant_iso=b.declarant_iso and a.period=(b.period+100);")
    conn.commit()

    #/* calcolo i valori per cpa */
    
    ## considero un 1 anno prima es 48 per 36 mesi
    filter_yyymm=str(start_data_PAGE_BASKET.year-1)+str('%02d' %start_data_PAGE_BASKET.month)
    logger.info('Creating aggr_cpa table ')
    cur.execute('DROP TABLE IF EXISTS aggr_cpa;')
    cur.execute("create table aggr_cpa as select declarant_iso, flow, cpa2, period, sum(value_in_euros) as val_cpa, sum(quantity_in_kg) as q_cpa  from comext_full  WHERE IS_PRODUCT==1 and period>="+filter_yyymm+" group by declarant_iso, flow, cpa2, period order by declarant_iso, flow, cpa2, period;")
    
    conn.commit()
    
    #/* calcolo il valore totale */
    logger.info('Creating aggr_tot table ')
    cur.execute('DROP TABLE IF EXISTS aggr_tot;')
    cur.execute("create table aggr_tot as select declarant_iso, flow, period, sum(val_cpa) as val_tot, sum(q_cpa) as q_tot from aggr_cpa group by declarant_iso, flow, period order by declarant_iso, flow, period;")
    conn.commit()
    
    #/* calcolo le quote */
    logger.info('Creating quote_cpa table ')
    cur.execute('DROP TABLE IF EXISTS quote_cpa;')
    cur.execute("create table quote_cpa as select a.declarant_iso, a.flow, a.cpa2, a.period, a.val_cpa, b.val_tot, a.q_cpa, b.q_tot, 100.0*a.val_cpa/b.val_tot as q_val_cpa, 100.0*a.q_cpa/b.q_tot as q_qua_cpa  from aggr_cpa a, aggr_tot b where a.declarant_iso=b.declarant_iso and a.flow=b.flow and a.period=b.period;")

    #/* calcolo le variazioni */
    logger.info('Creating variazioni table ')
    cur.execute('DROP TABLE IF EXISTS variazioni;')
    cur.execute("create table variazioni as select a.declarant_iso, a.flow, a.cpa2, a.period, a.val_cpa, round(100.0*(a.val_cpa-b.val_cpa)/b.val_cpa,2) as var_val_cpa, round(100.0*(a.q_val_cpa-b.q_val_cpa)/b.q_val_cpa,2) as var_val_basket, a.q_cpa, round(100.0*(a.q_cpa-b.q_cpa)/b.q_cpa,2) as var_q_cpa, round(100.0*(a.q_qua_cpa-b.q_qua_cpa)/b.q_qua_cpa,2) as var_qua_basket from quote_cpa a, quote_cpa b where a.declarant_iso=b.declarant_iso and a.flow=b.flow and a.cpa2=b.cpa2 and a.period=(b.period+100);")

    ## grafi in classificazione CPA e scambi tra paesi intra-UE

    #/* aggrego per cpa2 */
    logger.info('Creating table aggr_cpa2 ')
    cur.execute('DROP TABLE IF EXISTS aggr_cpa2;')
    cur.execute("create table aggr_cpa2 as select declarant_iso, partner_iso, flow, cpa23 as cpa, period, sum(value_in_euros) as val_cpa, sum(quantity_in_kg) as q_kg from comext_full  WHERE IS_PRODUCT==1 group by declarant_iso, partner_iso, flow, cpa23, period order by declarant_iso, partner_iso, flow, cpa23, period;")

    #/* aggrego per cpa3 */
    logger.info('Creating table aggr_cpa3 ')
    cur.execute('DROP TABLE IF EXISTS aggr_cpa3;')
    cur.execute("create table aggr_cpa3 as select declarant_iso, partner_iso, flow, cpa3 as cpa, period, sum(value_in_euros) as val_cpa, sum(quantity_in_kg) as q_kg from comext_full  WHERE IS_PRODUCT==1 group by declarant_iso, partner_iso, flow, cpa3, period order by declarant_iso, partner_iso, flow, cpa3, period;")

    #/* aggrego per cpa TOTAL 00 */
    logger.info('Creating table aggr_cpa_tot ')
    cur.execute('DROP TABLE IF EXISTS aggr_cpa_tot;')
    cur.execute("create table aggr_cpa_tot as select declarant_iso, partner_iso, flow, '00' as cpa, period, sum(value_in_euros) as val_cpa, sum(quantity_in_kg) as q_kg from comext_full WHERE product_nc= 'TOTAL' group by declarant_iso, partner_iso, flow,  cpa, period;")

    #/*  view */
    logger.info('Creating table base_grafi_cpa ')
    cur.execute('DROP TABLE IF EXISTS base_grafi_cpa;')
    cur.execute("create table base_grafi_cpa as select * from  aggr_cpa2 where (1* substr(cpa,1,2) >0 and 1* substr(cpa,1,2) <37) union select * from  aggr_cpa3 where (1* substr(cpa,1,3) >0 and 1* substr(cpa,1,3) <370) union  select * from aggr_cpa_tot;")

    #/*  create table WORLD for all partners * add ALL COUNTRIES AC
    logger.info('Creating table base_grafi_cpa_wo ')
    cur.execute('DROP TABLE IF EXISTS base_grafi_cpa_wo;')
    cur.execute("create table base_grafi_cpa_wo as select declarant_iso, 'AC' as partner_iso, flow, cpa, period, sum(val_cpa) as val_cpa,sum(q_kg) as q_kg from base_grafi_cpa group by declarant_iso, flow, cpa, period order by declarant_iso, flow, cpa, period; ")

    #/*  view */
    logger.info('Creating table variazioni_cpa ')
    cur.execute('DROP TABLE IF EXISTS variazioni_cpa;')
    cur.execute("create table variazioni_cpa as select a.declarant_iso, a.partner_iso, a.flow, a.cpa, a.period, a.val_cpa, round(100.00*((a.val_cpa-b.val_cpa)*1.00/b.val_cpa),2) as var_cpa, a.q_kg, round(100.00*(a.q_kg-b.q_kg)/b.q_kg,2)  as var_q_cpa  from base_grafi_cpa a, base_grafi_cpa b where a.declarant_iso=b.declarant_iso and a.partner_iso=b.partner_iso and a.flow=b.flow and a.cpa=b.cpa and a.period=(b.period+100) union all select a.declarant_iso, a.partner_iso,a.flow, a.cpa, a.period, a.val_cpa, 100*(a.val_cpa-b.val_cpa)/b.val_cpa as var_cpa, a.q_kg, 100*(a.q_kg-b.q_kg)/b.q_kg  as var_q_cpa from base_grafi_cpa_wo a, base_grafi_cpa_wo b where a.declarant_iso = b.declarant_iso 	and a.flow = b.flow and a.cpa = b.cpa and a.period =(b.period + 100) ; ")

    filter_yyymm=str(start_data_PAGE_GRAPH_INTRA_UE.year-1)+str('%02d' % start_data_PAGE_GRAPH_INTRA_UE.month)
    #/*  basi trimestrali */
    logger.info('Creating table per_trimestri  ')
    cur.execute('DROP TABLE IF EXISTS per_trimestri;')
    cur.execute("create table per_trimestri as select *, substr(period,1,4)||'T1' as trimestre from base_grafi_cpa where substr(period,5,2) in ('01', '02','03') and period >= "+filter_yyymm+" union select *, substr(period,1,4)||'T2' as trimestre from base_grafi_cpa where substr(period,5,2) in ('04', '05','06') and period >= "+filter_yyymm+" union select *, substr(period,1,4)||'T3' as trimestre from base_grafi_cpa where substr(period,5,2) in ('07', '08','09') and period > "+filter_yyymm+" union select *, substr(period,1,4)||'T4' as trimestre from base_grafi_cpa where substr(period,5,2) in ('10', '11','12') and period > "+filter_yyymm+"")

    #/*  basi trimestrali */
    logger.info('Creating table per_trimestri  ')
    cur.execute('DROP TABLE IF EXISTS base_grafi_cpa_trim;')
    cur.execute("create table base_grafi_cpa_trim as select declarant_iso, partner_iso, flow,  cpa, trimestre, sum(val_cpa) as val_cpa, sum(q_kg) as q_kg from per_trimestri group by declarant_iso, partner_iso, flow, cpa, trimestre;")

    logger.info('Creating END ')
    if conn:
        conn.close()
    
    return "Monthly processing on DB OK!"


def createMonthlyOutputTimeSeries():
    logger.info('createMonthlyOutputTimeSeries START')
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+"output"
    createFolder(DATA_FOLDER_WORKING)

    # import export series
    logger.info('import export series')
    iesFiles={}
    iesFiles[FLOW_IMPORT]=IMPORT_SERIES_JSON
    iesFiles[FLOW_EXPORT]=EXPORT_SERIES_JSON
    ieFlows={}

    conn = sqlite3.connect(SQLLITE_DB)
    serie = pd.read_sql_query("SELECT * from serie_per_mappa", conn)
    countries=sorted(pd.unique(serie["DECLARANT_ISO"]))
    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        ieSeries=[]
        for country  in countries:
            logger.debug('country: '+country)
            ieIseries_country={}
            ieIseries_country["country"]=country
            serie_country=serie[(serie["DECLARANT_ISO"]==country) & (serie["FLOW"]==flow)]
            for index, row in serie_country.iterrows():
                ieIseries_country[str(row["PERIOD"])]=row["tendenziale"]
            ieSeries.append(ieIseries_country)
        ieFlows[flow]=ieSeries

    if conn:
        conn.close()

    #print(iesFiles)

    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        logger.info('File '+iesFiles[flow])
        with open(iesFiles[flow], 'w') as f:
            json.dump(ieFlows[flow], f, ensure_ascii=False, indent = 4, cls=NpEncoder)

    return "TIME SERIES processing OK; files created: "+IMPORT_SERIES_JSON+" and "+EXPORT_SERIES_JSON


def createMonthlyOutputVQSTrade():
    logger.info('createMonthlyOutputVQSTrade START')
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+"output"
    createFolder(DATA_FOLDER_WORKING)
    iesVQSFiles={}
    iesVQSFiles[FLOW_IMPORT]=IMPORT_VALUE_JSON
    iesVQSFiles[FLOW_EXPORT]=EXPORT_VALUE_JSON
    ieVQSFlows={}

    cls_products_cpa=pd.read_csv(CLS_PRODUCTS_CPA_FILE, sep="\t", low_memory=True, header=None, keep_default_na=False, na_values=[''])
    logger.info('cls_products: '+CLS_PRODUCTS_FILE)

    conn = sqlite3.connect(SQLLITE_DB)
    variazioni = pd.read_sql_query("SELECT DECLARANT_ISO, FLOW,cpa2 as PRODUCT, PERIOD, var_val_basket var_basket FROM variazioni where (1* cpa2 >0 and 1* cpa2 <37)  order by PERIOD ASC;", conn)
    countries=sorted(pd.unique(variazioni["DECLARANT_ISO"]))

    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        logger.info('FLOW_IMPORT,FLOW_EXPORT: '+str(flow))
        ieVQS=[]

        for country  in countries:
            logger.info('country: '+country)
            ieVQS_country={}
            ieVQS_country["id"]=country
            dataVQSs=[]
            vqs_country=variazioni[(variazioni["DECLARANT_ISO"]==country) & (variazioni["FLOW"]==flow)]

            products_country=sorted(pd.unique(vqs_country["PRODUCT"]))
            for product  in products_country:
                logger.debug('product: '+product)
                dataVQS={}

                dataVQS["productID"]=product
                dataVQS["dataname"]=getClsProductByCode(cls_products_cpa, product,1)
                valuesVQS=[]
                vqs=vqs_country[vqs_country["PRODUCT"]==product].fillna('NA')
                for indexp, row_vqs in vqs.iterrows():
                    valuesVQS.append(row_vqs["var_basket"])

                dataVQS["value"]=valuesVQS
                dataVQSs.append(dataVQS)

            ieVQS_country["data"]=dataVQSs
            ieVQS.append(ieVQS_country)
        ieVQSFlows[flow]=ieVQS

    if conn:
        conn.close()

    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        logger.info('File '+iesVQSFiles[flow])
        with open(iesVQSFiles[flow], 'w') as f:
            json.dump(ieVQSFlows[flow], f, ensure_ascii=False, indent=1, cls=NpEncoder)

    return "VQS VALUE TRADE processing OK; files created: "+IMPORT_VALUE_JSON+" and "+EXPORT_VALUE_JSON


def createMonthlyOutputVQSTradeQuantity():
    logger.info('createMonthlyOutputVQSTrade START')
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+"output"
    createFolder(DATA_FOLDER_WORKING)
    iesVQSFiles={}
    iesVQSFiles[FLOW_IMPORT]=IMPORT_QUANTITY_JSON
    iesVQSFiles[FLOW_EXPORT]=EXPORT_QUANTITY_JSON
    ieVQSFlows={}

    cls_products_cpa=pd.read_csv(CLS_PRODUCTS_CPA_FILE, sep="\t", low_memory=True, header=None, keep_default_na=False, na_values=[''])
    logger.info('cls_products: '+CLS_PRODUCTS_FILE)

    conn = sqlite3.connect(SQLLITE_DB)
    variazioni = pd.read_sql_query("SELECT DECLARANT_ISO, FLOW,cpa2 as PRODUCT, PERIOD, var_qua_basket as var_basket FROM variazioni where (1* cpa2 >0 and 1* cpa2 <37)  order by PERIOD ASC;", conn)
    countries=sorted(pd.unique(variazioni["DECLARANT_ISO"]))

    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        logger.info('FLOW_IMPORT,FLOW_EXPORT: '+str(flow))
        ieVQS=[]

        for country  in countries:
            logger.info('country: '+country)
            ieVQS_country={}
            ieVQS_country["id"]=country
            dataVQSs=[]
            vqs_country=variazioni[(variazioni["DECLARANT_ISO"]==country) & (variazioni["FLOW"]==flow)]

            products_country=sorted(pd.unique(vqs_country["PRODUCT"]))
            for product  in products_country:
                logger.debug('product: '+product)
                dataVQS={}

                dataVQS["productID"]=product
                dataVQS["dataname"]=getClsProductByCode(cls_products_cpa, product,1)
                valuesVQS=[]
                vqs=vqs_country[vqs_country["PRODUCT"]==product].fillna('NA')
                for indexp, row_vqs in vqs.iterrows():
                    valuesVQS.append(row_vqs["var_basket"])

                dataVQS["value"]=valuesVQS
                dataVQSs.append(dataVQS)

            ieVQS_country["data"]=dataVQSs
            ieVQS.append(ieVQS_country)
        ieVQSFlows[flow]=ieVQS
    
    if conn:
        conn.close()

    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        logger.info('File '+iesVQSFiles[flow])
        with open(iesVQSFiles[flow], 'w') as f:
            json.dump(ieVQSFlows[flow], f, ensure_ascii=False, indent = 1, cls=NpEncoder)

    return "VQS QUANTITY TRADE processing OK; files created: "+IMPORT_QUANTITY_JSON+" and "+EXPORT_QUANTITY_JSON


def createOutputVariazioniQuoteCPA():
    # import export variazioni quote CPA
    logger.info('createOutputVariazioniQuoteCPA START')
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+"output"
    createFolder(DATA_FOLDER_WORKING)

    logger.info('import export variazioni quote CPA')
    iesVQSFiles={}
    iesVQSFiles[FLOW_IMPORT]=COMEXT_IMP_CSV
    iesVQSFiles[FLOW_EXPORT]=COMEXT_EXP_CSV

    conn = sqlite3.connect(SQLLITE_DB)

    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        variazioni = pd.read_sql_query("SELECT DECLARANT_ISO, PARTNER_ISO, FLOW, trim(cpa) as cpa, PERIOD, val_cpa, q_kg  FROM variazioni_cpa WHERE FLOW="+str(flow)+" and (length(trim(cpa))==2 or trim(cpa) in ('061','062') ) order by PERIOD ASC;", conn)
        variazioni.to_csv(iesVQSFiles[flow],sep=",",index=False)

    pd.read_sql_query("SELECT distinct trim(cpa) as PRODUCT FROM variazioni_cpa WHERE (length(trim(cpa))==2 or trim(cpa) in ('061','062') );", conn).to_csv(CPA2_PRODUCT_CODE_CSV,sep=",",index=False)

    if conn:
        conn.close()
    
    logger.info('createMonthlyOutput END')

    return "Variazioni quote CPA processing OK; files created: "+COMEXT_IMP_CSV+" and "+COMEXT_EXP_CSV


def createOutputGraphCPAIntraUE():
    logger.info('createOutputGraphCPAIntraUE START')
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+"output"
    createFolder(DATA_FOLDER_WORKING)

    # import export variazioni quote CPA
    logger.info('import export variazioni quote CPA INTRA')

    #  end_data_lclearoad=datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)
    #last_12_months=datetime.datetime.strptime(( str(end_data_load.year)+"-"+str(end_data_load.month)- relativedelta(months=12)), "%Y%m")

    filter_yyymm=str(start_data_PAGE_GRAPH_INTRA_UE.year-1)+str('%02d' %start_data_PAGE_GRAPH_INTRA_UE.month)
    logger.info('last_months: '+filter_yyymm)
    conn = sqlite3.connect(SQLLITE_DB)
    pd.read_sql_query("SELECT DECLARANT_ISO, PARTNER_ISO, FLOW, PRODUCT, PERIOD, VALUE_IN_EUROS  FROM (SELECT DECLARANT_ISO, PARTNER_ISO, FLOW, cpa as PRODUCT, PERIOD, val_cpa as VALUE_IN_EUROS  FROM base_grafi_cpa WHERE PERIOD>"+filter_yyymm+" and length(trim(cpa))==3 union SELECT DECLARANT_ISO, PARTNER_ISO, FLOW, 'TOT' as PRODUCT, PERIOD, val_cpa as VALUE_IN_EUROS  FROM base_grafi_cpa WHERE PERIOD>"+filter_yyymm+" and  trim(cpa)=='00')   order by PERIOD ASC;", conn).to_csv(CPA_INTRA_CSV,sep=",",index=False)
    pd.read_sql_query("SELECT distinct cpa as PRODUCT  FROM base_grafi_cpa WHERE PERIOD>"+filter_yyymm+" and length(trim(cpa))==3;", conn).to_csv(CPA3_PRODUCT_CODE_CSV,sep=",",index=False)       
    if conn:
        conn.close()
    
    logger.info('createMonthlyOutput END')

    return "CPA Graphic INTRA UE OK; files created: "+CPA_INTRA_CSV


def createOutputGraphicTrimestre():
    logger.info('createOutputGraphicTrimestre START')
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+"output"
    createFolder(DATA_FOLDER_WORKING)

    # import export variazioni quote CPA
    logger.info('import export variazioni quote CPA INTRA TRim')

    conn = sqlite3.connect(SQLLITE_DB)
    pd.read_sql_query("SELECT declarant_iso, partner_iso, flow,  cpa, trimestre,   val_cpa,   q_kg  FROM base_grafi_cpa_trim WHERE length(trim(cpa))==3 union SELECT declarant_iso, partner_iso, flow,  'TOT' as cpa, trimestre,   val_cpa,   q_kg  FROM base_grafi_cpa_trim WHERE trim(cpa)=='00' order by trimestre ASC;", conn).to_csv(CPA_TRIM_CSV,sep=",",index=False)
            
    if conn:
        conn.close()
    
    logger.info('createOutputGraphicTrimestre END')
    return "CPA Graphic INTRA TRIMESTRE UE OK; files created: "+CPA_TRIM_CSV


def createOutputGraphExtraUE():
    logger.info('createOutputGraphExtraUE START')

    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+PREFIX_TRANSPORT
    DATA_FOLDER_MONTHLY_DATS=DATA_FOLDER_WORKING+os.sep+"files"

    logger.info('Reading from '+DATA_FOLDER_MONTHLY_DATS)
    listDataframes=[]
    for f in os.listdir(DATA_FOLDER_MONTHLY_DATS):
        if f.endswith(DATA_EXTENTION):
            appo=pd.read_csv(DATA_FOLDER_MONTHLY_DATS+os.sep+f,sep=SEP,low_memory=False,keep_default_na=False, na_values=[''])
            listDataframes.append(appo)


    df=pd.concat(listDataframes,axis=0)
    #df=df[df["PRODUCT_NSTR"]!="TOT"]
    df=df[df["DECLARANT_ISO"]!="EU"]
    df=df[df["PARTNER_ISO"]!="EU"]
    df=df[["PRODUCT_NSTR","DECLARANT_ISO","PARTNER_ISO","PERIOD","TRANSPORT_MODE","FLOW",'VALUE_IN_EUROS', 'QUANTITY_IN_KG']]

    df.to_csv(TR_EXTRA_UE_CSV,sep=",",index=False)

    pd.DataFrame({'PRODUCT':df["PRODUCT_NSTR"].astype(str).unique()}).to_csv(TR_PRODUCT_CODE_CSV,sep=",",index=False)

    logger.info('tr_extra_ue file: '+TR_EXTRA_UE_CSV)
    logger.info('createOutputGraph END ')

    return "CPA Graphic EXTRE UE OK; files created: "+TR_EXTRA_UE_CSV


def createOutputGraphExtraUE_Trim():
    logger.info('createOutputGraphExtraUE TRIM START')

    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+PREFIX_TRANSPORT
    DATA_FOLDER_MONTHLY_DATS=DATA_FOLDER_WORKING+os.sep+"files"

    logger.info('Reading from '+DATA_FOLDER_MONTHLY_DATS)
    listDataframes=[]

    for f in os.listdir(DATA_FOLDER_MONTHLY_DATS):
        if f.endswith(DATA_EXTENTION):
            appo=pd.read_csv(DATA_FOLDER_MONTHLY_DATS+os.sep+f,sep=SEP,low_memory=False,keep_default_na=False, na_values=[''])
            listDataframes.append(appo)

    df=pd.concat(listDataframes,axis=0)
    #df=df[df["PRODUCT_NSTR"]!="TOT"]
    df=df[df["DECLARANT_ISO"]!="EU"]
    df=df[df["PARTNER_ISO"]!="EU"]
    df=df[["PRODUCT_NSTR","DECLARANT_ISO","PARTNER_ISO","PERIOD","TRANSPORT_MODE","FLOW",'VALUE_IN_EUROS', 'QUANTITY_IN_KG']]

    df['TRIMESTRE'] = df['PERIOD']
    df['TRIMESTRE'] = df['TRIMESTRE'].apply(lambda x: str(x)[0:4]+'T1' if str(x)[4: 6] in ['01','02','03']  else str(x)[0:4]+'T2' if str(x)[4: 6] in ['04','05','06'] else str(x)[0:4]+'T3' if str(x)[4: 6] in ['07','08','09'] else str(x)[0:4]+'T4' if str(x)[4: 6] in ['10','11','12'] else x)

    df_trim = df.groupby(["PRODUCT_NSTR","DECLARANT_ISO","PARTNER_ISO","TRIMESTRE","TRANSPORT_MODE","FLOW"])[["VALUE_IN_EUROS", "QUANTITY_IN_KG"]].sum().reset_index()

    df_trim.to_csv(TR_EXTRA_UE_TRIMESTRALI_CSV,sep=",",index=False)
    logger.info('tr_extra_ue TRIMESTRALI file: '+TR_EXTRA_UE_TRIMESTRALI_CSV)
    logger.info('createOutputGraph TRIM END ')
    return "CPA Graphic EXTRE UE OK; files created: "+TR_EXTRA_UE_TRIMESTRALI_CSV


def createClsNOTEmptyProducts(digit,cls,filename,filterValue,fileExistingProducts):
    logger.info('createCls START')

    cls_products_cpa=pd.read_csv(cls,sep="\t",low_memory=True,names=["id","descr"],keep_default_na=False, na_values=[''])
    logger.info('cls_products: '+cls)

    cls_products_cpa=cls_products_cpa[(cls_products_cpa["id"].str.len() == digit) & (cls_products_cpa["id"].str.isnumeric()) &  (pd.to_numeric(cls_products_cpa["id"].str.slice(stop=2), errors='coerce').fillna(999).astype(int) < filterValue)]
    if (fileExistingProducts):
        products=pd.read_csv(fileExistingProducts,sep=",",low_memory=True,dtype={'PRODUCT': str})
        cls_products_cpa= pd.merge(cls_products_cpa, products, left_on="id", right_on="PRODUCT")
        cls_products_cpa=cls_products_cpa[["id","descr"]]

    if (digit==2):
        #cls_products_cpa.insert(0,{"id":"00","descr":"All Products" })
        cls_products_cpa=pd.concat([pd.DataFrame({"id":"00","descr":"All Products" },index=[0]),cls_products_cpa]).reset_index(drop = True)
        cls_products_cpa=pd.concat([pd.DataFrame({"id":"061","descr":"Crude petroleum" },index=[0]),cls_products_cpa]).reset_index(drop = True)
        cls_products_cpa=pd.concat([pd.DataFrame({"id":"062","descr":"Natural gas, liquefied or in gaseous state" },index=[0]),cls_products_cpa]).reset_index(drop = True)
        cls_products_cpa = cls_products_cpa.sort_values('id')
        cls_products_cpa = cls_products_cpa.reset_index(drop=True)
    
    if (digit==3):
        #cls_products_cpa.append({"id":"TOT","descr":"All Products" })
        cls_products_cpa=pd.concat([cls_products_cpa,pd.DataFrame({"id":"TOT","descr":"All Products" },index=[0])]).reset_index(drop = True)
    
    CPA2_JSON_FILE=DATA_FOLDER+os.sep+"clsProducts"+filename+".json"

    cls_products_cpa.to_json(CPA2_JSON_FILE, orient='records',default_handler=None,lines=False,indent=1  )
    logger.info('cls_products created: '+CPA2_JSON_FILE)
    return 'cls_products created: '+CPA2_JSON_FILE


def copyFileToAzure(storage,folder,path_file_source):
    logger.info('copyFileToAzure START:'+ os.path.basename(path_file_source))

    storage_account_key = os.getenv('STORAGE_ACCOUNT_KEY', '')
    if storage_account_key == '':
        kvclient = SecretClient(vault_url=f"https://{KEY_VAULT_NAME}.vault.azure.net", credential=DefaultAzureCredential())
        storage_account_key = kvclient.get_secret(SECRETNAME_ACCOUNTKEY).value
        
    fileService=FileService(account_name=os.environ['STORAGE_ACCOUNT_NAME'],account_key=storage_account_key)
    fileService.create_file_from_path(storage,folder,os.path.basename(path_file_source),path_file_source)
    logger.info('copyFileToAzure END: '+os.path.basename(path_file_source))
    return 'copyFileToAzure END: '+os.path.basename(path_file_source)

def exportOutputs():
    logger.info('exportOutputs START')

    #JSON-SERVER
    OUTPUT_FOLDER=DATA_FOLDER+os.sep
    copyFileToAzure("istat-cosmo-data-json", "general", GENERAL_INFO_FILE)
    copyFileToAzure("istat-cosmo-data-json", "map", ieinfo_filename)
    copyFileToAzure("istat-cosmo-data-json", "map", IMPORT_SERIES_JSON)
    copyFileToAzure("istat-cosmo-data-json", "map", EXPORT_SERIES_JSON)

    copyFileToAzure("istat-cosmo-data-json", "trade", IMPORT_QUANTITY_JSON)
    copyFileToAzure("istat-cosmo-data-json", "trade", EXPORT_QUANTITY_JSON)
    copyFileToAzure("istat-cosmo-data-json", "trade", IMPORT_VALUE_JSON)
    copyFileToAzure("istat-cosmo-data-json", "trade", EXPORT_VALUE_JSON)

    copyFileToAzure("istat-cosmo-data-json", "classification", DATA_FOLDER+"clsProductsCPA.json")
    copyFileToAzure("istat-cosmo-data-json", "classification", DATA_FOLDER+"clsProductsGraphExtraNSTR.json")
    copyFileToAzure("istat-cosmo-data-json", "classification", DATA_FOLDER+"clsProductsGraphIntra.json")

    #R-SERVER
    copyFileToAzure("istat-cosmo-data-r", None, COMEXT_IMP_CSV)
    copyFileToAzure("istat-cosmo-data-r", None, COMEXT_EXP_CSV)

    #Python-SERVER
    copyFileToAzure("istat-cosmo-data-python", None, CPA_INTRA_CSV)
    copyFileToAzure("istat-cosmo-data-python", None, CPA_TRIM_CSV)
    copyFileToAzure("istat-cosmo-data-python", None, TR_EXTRA_UE_CSV)
    copyFileToAzure("istat-cosmo-data-python", None, TR_EXTRA_UE_TRIMESTRALI_CSV)

    logger.info('exportOutputs END')
    return 'exportOutputs END'


def refreshMicroservicesDATA():
    logger.info('refreshMicroservices DATA START')
    resultRefresh=""
    try:
        contents = urllib.request.urlopen("https://rdata.cosmo.statlab.it/load-comext",timeout=300).read()
        resultRefresh+="Refresh DATA R-SERVER OK<br/>\n"
        contents = urllib.request.urlopen("https://jsondata.cosmo.statlab.it/stop",timeout=300).read()
        resultRefresh+="Refresh DATA JSON-SERVER OK<br/>\n"
        contents = urllib.request.urlopen("https://pythondata.cosmo.statlab.it/refreshdata",timeout=500).read()
        resultRefresh+="Refresh DATA PYTHON-SERVER OK<br/>\n"
        time.sleep(30)
    except BaseException as e:
        resultRefresh+="ERRROR Refresh " + str(e)
    return (resultRefresh)


def checkUPMicroservices():
    logger.info('checkUPMicroservices START')
    resultCall=""
    try:
        call=urllib.request.urlopen("https://rdata.cosmo.statlab.it/hello",timeout=30).read()
        logger.info(str(call))
        resultCall+=" Check UP R-SERVER OK<br/>\n"
        call=urllib.request.urlopen("https://jsondata.cosmo.statlab.it/hello",timeout=30).read()
        logger.info(str(call))
        resultCall+=" Check UP JSON-SERVER OK<br/>\n"
        call=urllib.request.urlopen("https://pythondata.cosmo.statlab.it/hello",timeout=30).read()
        logger.info(str(call))
        resultCall+=" Check UP PYTHON-SERVER OK<br/>\n"
    except BaseException as e:
        resultCall+=" ERRROR Refresh: " + str(e)+"<br/>\n"
        logger.info(' ERRROR Refresh: ' + str(e)+"<br/>\n")

    logger.info('checkUPMicroservices END')

    return (resultCall)


def sendEmailRepo(report_text):
    logger.info('sendEmailRepo START')
    url_Email_service="https://prod-190.westeurope.logic.azure.com:443/workflows/52cafc0d0f2d4dd08ee290a5d367f109/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PFatjXjc32cpXZqX-KFBkn0a7ZKgT1q5iR2hI07NR4w"
    body_msg={"to":"framato@istat.it","subject":"Repo from cosmo update","body":report_text}

    req = urllib.request.Request(url_Email_service, method="POST")
    req.add_header('Content-Type', 'application/json')

    data = json.dumps(body_msg)
    data = data.encode()
    r = urllib.request.urlopen(req, data=data)
    logger.info('sendEmailRepo END')

    return 'sendEmailRepo END'


def deleteFolder(folder):
    logger.info('deleteFolder ... '+folder)
    shutil.rmtree(folder, ignore_errors=True)
    return "Folder removed: "+folder+"<br/>\n"

def getPassedTime(initial_time):
    return str(datetime.datetime.now()-initial_time)


def executeUpdate():
    error=False
    logger.info('executeUpdate ')
    start_time = datetime.datetime.now()
    logger.info('start time: '+start_time.strftime("%H:%M:%S"))
    repo='start time: '+start_time.strftime("%H:%M:%S")+'<br/>\n'

    try:
        
        repo+=createGeneralInfoOutput()
        repo+='<!-- 1 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        
        repo+=downloadAndExtractComextAnnualDATAParallel()  
        repo+='<!-- 2 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        
        repo+=downloadAndExtractComextMonthlyDATAParallel(URL_COMEXT_PRODUCTS, PREFIX_FULL,start_data_PAGE_TIME_SERIES,end_data_load)
        repo+='<!-- 3 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        
        repo+=downloadAndExtractComextMonthlyDATAParallel(URL_COMEXT_TR, PREFIX_TRANSPORT,start_data_PAGE_GRAPH_EXTRA_UE,end_data_load)
        repo+='<!-- 4 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        
        repo+=downloadfile(URL_COMEXT_CLS_PRODUCTS,CLS_PRODUCTS_FILE)
        repo+='<!-- 5 --><br/>\n'
         
        repo+=downloadfile(URL_CLS_CPA,CLS_PRODUCTS_CPA_FILE)
        repo+='<!-- 6 --><br/>\n'
        repo+=downloadfile(URL_CLS_NSTR,CLS_NSTR_FILE)
        repo+='<!-- 7 --><br/>\n'
        
        repo+=downloadfile(ANNUAL_POPULATION_URL,ANNUAL_POPULATION_CSV)
        repo+='<!-- 7.1 --><br/>\n'
        repo+=downloadfile(ANNUAL_INDUSTRIAL_PRODUCTION_URL,ANNUAL_INDUSTRIAL_PRODUCTION_FILE_CSV)
        repo+='<!-- 7.2 --><br/>\n'
        repo+=downloadfile(ANNUAL_UNEMPLOYEMENT_URL,ANNUAL_UNEMPLOYEMENT_FILE_CSV)
        repo+='<!-- 7.3 --><br/>\n'
        
        repo+=annualProcessing()
        repo+='<!-- 8 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        
        repo+=createMonthlyFULLtable()
        repo+='<!-- 9 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'

        repo+=monthlyProcessing()
        repo+='<!-- 10 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        repo+=createMonthlyOutputTimeSeries()
        repo+='<!-- 11 --><br/>\n'
        repo+=createMonthlyOutputVQSTrade()
        repo+='<!-- 12 --><br/>\n'
        repo+=createMonthlyOutputVQSTradeQuantity()
        repo+='<!-- 13 --><br/>\n'
        repo+=createOutputGraphCPAIntraUE()
        repo+='<!-- 14 --><br/>\n'

        repo+=createOutputGraphExtraUE()
        repo+='<!-- 15 --><br/>\n'
        repo+=createOutputGraphicTrimestre()
        repo+='<!-- 16 --><br/>\n'

        repo+=createOutputGraphExtraUE_Trim()
        repo+='<!-- 17 --><br/>\n'

        repo += createOutputVariazioniQuoteCPA()
        repo+='<!-- 18 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'

        repo+=createClsNOTEmptyProducts(2,CLS_PRODUCTS_CPA_FILE,"CPA",37,CPA2_PRODUCT_CODE_CSV)
        repo+='<!-- 19 --><br/>\n'
        repo+=createClsNOTEmptyProducts(3,CLS_PRODUCTS_CPA_FILE,"GraphIntra",37,CPA3_PRODUCT_CODE_CSV)
        repo+='<!-- 20 --><br/>\n'
        repo+=createClsNOTEmptyProducts(3,CLS_NSTR_FILE,"GraphExtraNSTR",999999,TR_PRODUCT_CODE_CSV)
        repo+='<!-- 21 --><br/>\n'
        repo+=exportOutputs()
        repo+='<!-- 22 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        repo+=deleteFolder(DATA_FOLDER)
        repo+='<!-- 23 --><br/>\n'
        
        repo+=refreshMicroservicesDATA()
        repo+='<!-- 24 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        
        repo+=checkUPMicroservices()
        repo+='<!-- 25 --><br/>\n'
        repo+='time: '+getPassedTime(start_time)+'<br/>\n'
        
    except BaseException as e:
        repo+="ERROR UPDATE  " + str(e)
        error=True
    
    finally:
        end_time = datetime.datetime.now()
        logger.info('end time: '+end_time.strftime("%H:%M:%S"))
        total_time=end_time-start_time
        logger.info('TOTAL time: '+str(total_time))
        repo+='end time: '+end_time.strftime("%H:%M:%S")+'<br/>\n'
        repo+='<br/>\n'
        repo+='TOTAL time: '+str(total_time)+'<br/>\n'
        repo+='<br/>\n'
        repo+=sendEmailRepo(repo)
        repo+='<br/>\n'
        logger.info('[cosmoUpdateData]: '+repo)
    
    return error    

if __name__ == '__main__':
    if executeUpdate(): 
        sys.exit(1)
