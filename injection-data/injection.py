from dataclasses import dataclass
import os
from pathlib import Path
import urllib.request
import logging.config
import py7zr
import pandas as pd
import numpy as np
import datetime
import json
import sqlite3

from sqlite3 import Error

from dateutil.rrule import rrule, MONTHLY
from dateutil.relativedelta import relativedelta



class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)



source_path =  os.path.dirname(__file__)
logging.config.fileConfig(source_path+os.sep+'logging.conf')

# create logger
logger = logging.getLogger('cosmoLog')

SEP=","
DATA_EXTENTION=".dat"
CSV_EXTENTION=".csv"
PREFIX_FULL="full"
PREFIX_TRANSPORT="tr"
FLOW_IMPORT=1
FLOW_EXPORT=2

processing_day = datetime.datetime.today()

this_year=processing_day.year
this_month='%02d' %processing_day.month
annual_new_data=1 if( processing_day < datetime.datetime(processing_day.year , 3, 20)) else 0 
annual_current_year=(datetime.datetime.strptime(str(processing_day.year), "%Y")  - relativedelta(years=annual_new_data)- relativedelta(years=1)).year
annual_previous_year=(datetime.datetime.strptime(str(processing_day.year), "%Y") - relativedelta(years=annual_new_data)- relativedelta(years=2)).year

months_to_extract=48
offset_month_to_extract=3
WORKING_FOLDER="d:/cosmopolitcs_data"

DATA_FOLDER=WORKING_FOLDER+os.sep+"data"+os.sep+str(this_year)+str(this_month)+os.sep

DATA_FOLDER_MONTHLY=DATA_FOLDER+os.sep+"monthly"


DATA_FOLDER_ANNUAL=DATA_FOLDER+os.sep+"annual"
DATA_FOLDER_ANNUAL_DATS=DATA_FOLDER_ANNUAL+os.sep+"files"
DATA_FOLDER_ANNUAL_ZIPS=DATA_FOLDER_ANNUAL+os.sep+"zips"
DATA_FOLDER_ANNUAL_OUTPUT=DATA_FOLDER_ANNUAL+os.sep+"output"

SQLLITE_DB=DATA_FOLDER_MONTHLY+os.sep+PREFIX_FULL+os.sep+"commext.db"


## ogni 20 del mese scaricare il file annuale fullAAAAMM.7z con 52 al posto del mese (esempio file full201952.7z)
## data URL_COMEXT
URL_COMEXT_PRODUCTS="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2FCOMEXT_DATA%2FPRODUCTS%2F"

URL_COMEXT_TR="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2FCOMEXT_DATA%2FTRANSPORT_NSTR%2F"

URL_COMEXT_CLS_PRODUCTS="https://ec.europa.eu/eurostat/estat-navtree-portlet-prod/BulkDownloadListing?sort=1&file=comext%2FCOMEXT_METADATA%2FCLASSIFICATIONS_AND_RELATIONS%2FENGLISH%2FCN.txt"
CLS_PRODUCTS_FILE=DATA_FOLDER+os.sep+"cls_products.dat"

conn = None
def create_connection():
    """ create a database connection to a database that resides
        in the memory
    """
    try:
        conn = sqlite3.connect(':memory:')
        print(sqlite3.version)
         
    except Error as e:
        print(e)
 
def close_connection():
    """ close a database connection to a database that resides
        in the memory
    """
    if conn:
        conn.close()



def month_iter(start_month, start_year, end_month, end_year):
    start = datetime.datetime(start_year, start_month, 1)
    end = datetime.datetime(end_year, end_month, 1)
    return (('%02d' %d.month, d.year) for d in rrule(MONTHLY, dtstart=start, until=end))

def createFolder(folder_path):
     if not os.path.exists(folder_path):
        os.makedirs(folder_path)


def downloadAndExtractComextMonthlyDATA(url_download,prefix_file):
  
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+prefix_file
    DATA_FOLDER_MONTHLY_DATS=DATA_FOLDER_WORKING+os.sep+"files"
    DATA_FOLDER_MONTHLY_ZIPS=DATA_FOLDER_WORKING+os.sep+"zips"
    createFolder(DATA_FOLDER_MONTHLY_DATS)
    createFolder(DATA_FOLDER_MONTHLY_ZIPS)


   
    logging.info('Path: '+DATA_FOLDER_WORKING) 

    start_loop_date= datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)- relativedelta(months=months_to_extract)
    end_loop_date=datetime.datetime.strptime(str(this_year)+"-"+str(this_month), "%Y-%m")- relativedelta(months=offset_month_to_extract)
    count_downloaded=0
    count_extracted=0
    count_error=0
    for current_month in month_iter(start_loop_date.month, start_loop_date.year, end_loop_date.month, end_loop_date.year):
        
        current_month_month=current_month[0]
        current_month_year=current_month[1]
      
        logging.info(str(current_month_year)+" "+str(current_month_month))
        filenameZip=prefix_file+str(current_month_year)+str(current_month_month)+".7z"
         
        url_file=url_download+filenameZip
        fileMonthlyZip=DATA_FOLDER_MONTHLY_ZIPS+os.sep+filenameZip
         

        logging.info('File: '+url_file) 
        logging.info('Dowloanding....')  # will not print anything
        try:
            urllib.request.urlretrieve(url_file,fileMonthlyZip)
            count_downloaded+= 1
            with py7zr.SevenZipFile(fileMonthlyZip) as z:
                z.extractall(path=DATA_FOLDER_MONTHLY_DATS)
                count_extracted+= 1
        except BaseException as err:
            logging.error(f"Unexpected {err=}, {type(err)=}")
            count_error+= 1
        else:
            logging.info('File loaded: '+filenameZip)  # will not print anything
    logging.info('Monthly files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error')
       
def downloadAndExtractComextAnnualDATA():
    
    createFolder(DATA_FOLDER_ANNUAL_DATS)
    createFolder(DATA_FOLDER_ANNUAL_ZIPS)
    
    count_downloaded=0
    count_extracted=0
    count_error=0
    for current_year in [annual_previous_year,annual_current_year]:
        
        filenameZip="full"+str(current_year)+"52.7z"
        filenameDat="full"+str(current_year)+"52.dat" 
        url_file=URL_COMEXT_PRODUCTS+filenameZip
        fileAnnualZip=DATA_FOLDER_ANNUAL_ZIPS+os.sep+filenameZip
        

        logging.info('File: '+url_file) 
        logging.info('Dowloanding....')  # will not print anything
        try:
            urllib.request.urlretrieve(url_file,fileAnnualZip)
            count_downloaded+= 1
            with py7zr.SevenZipFile(fileAnnualZip) as z:
                z.extractall(path=DATA_FOLDER_ANNUAL_DATS)
                count_extracted+= 1
        except BaseException as err:
            logging.error(f"Unexpected {err=}, {type(err)=}")
            count_error+= 1
        else:
            logging.info('File loaded: '+filenameZip)  # will not print anything
    logging.info('Annual files repo: '+str(count_downloaded)+' downloaded, '+str(count_extracted)+' extracted '+str(count_error)+' error')

def downloadfile(url_file,filename):
    try:
        urllib.request.urlretrieve(url_file,filename)
    except BaseException as err:
        logging.error(f"Unexpected {err=}, {type(err)=}")
    else:
        logging.info('File loaded: '+filename)  # will not print anything

def getClsProduct(clsRow,codeProduct,position):
    if (position < len(clsRow)):
        return clsRow.iat[0,4]
    else:
        return codeProduct
   
   
# output ieinfo
def annualProcessing():

    createFolder(DATA_FOLDER_ANNUAL_OUTPUT)
    ieinfo=[]
    current_filename=DATA_FOLDER_ANNUAL_DATS+os.sep+PREFIX_FULL+str(annual_current_year)+"52.dat"
    previous_filename=DATA_FOLDER_ANNUAL_DATS+os.sep+PREFIX_FULL+str(annual_previous_year)+"52.dat"
    ieinfo_filename=DATA_FOLDER_ANNUAL_OUTPUT+os.sep+"ieinfo.json"
    
    cls_products=pd.read_csv(CLS_PRODUCTS_FILE,sep="\t",low_memory=True,header=None)
    
     
    data_annual_previous_year =pd.read_csv(previous_filename,sep=",",low_memory=True)
    data_annual_current_year =pd.read_csv(current_filename,sep=",",low_memory=True)

    logging.info('previous_filename: '+previous_filename) 
    logging.info('current_filename: '+current_filename)  
    logging.info('data.head() ')  
    logging.info(data_annual_current_year.head())  
     
    countries=sorted(pd.unique(data_annual_current_year["DECLARANT_ISO"]))
    logging.info('countries: '+ ' '.join(countries)) 
    n_rows=3 
    for country  in countries:
        logging.info('country: '+country)   
        ieinfo_country={}
        ieinfo_country["Country_Code"]=country

        # Main information
        minfo=[]
        minfo_imp={}   
        minfo_imp["Year"]="Import*"
        minfo_imp[str(annual_previous_year)]=data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_IMPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum()
        minfo_imp[str(annual_current_year)]= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_IMPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum() 
        minfo.append(minfo_imp)
        
        minfo_exp={}  
        minfo_exp["Year"]="Export*"
        minfo_exp[str(annual_previous_year)]=data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_EXPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum()
        minfo_exp[str( annual_current_year)]= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_EXPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)]["VALUE_IN_EUROS"].sum() 
        minfo.append(minfo_exp)
        ieinfo_country["Main information"]=minfo
        # Main Import partner
        mips_j=[]
         
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
        
        for index2 in range(n_rows):
            mep_j={}
            mep_j["Main partner "+str(annual_previous_year)]= meps_previous.loc[index2,"PARTNER_ISO"]
            mep_j["Total export "+str(annual_previous_year)]= meps_previous.loc[index2,"VALUE_IN_EUROS"]
            mep_j["Main partner "+str(annual_current_year)]= meps_current.loc[index2,"PARTNER_ISO"]
            mep_j["Total export "+str(annual_current_year)]= meps_current.loc[index2,"VALUE_IN_EUROS"]
            meps_j.append(mep_j)
        ieinfo_country["Main Export Partners"]=meps_j

         # Main Import good
        migs_j=[]
        migs_previous= data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_IMPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index() 
        migs_current= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_IMPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index() 
        
        for index  in range(n_rows):  
            previous_product=migs_previous.loc[index,"PRODUCT_NC"]
            current_product=migs_current.loc[index,"PRODUCT_NC"]
            mig_j={}
            mig_j["Main good "+str(annual_previous_year)]=getClsProduct(cls_products[(cls_products[0]==previous_product) & (pd.to_datetime(cls_products[1],errors='coerce').dt.year.fillna(0)<=annual_previous_year) & (pd.to_datetime(cls_products[2],errors='coerce').dt.year.fillna(2500)>=annual_previous_year) ],previous_product,4)
            mig_j["Total import "+str(annual_previous_year)]= migs_previous.loc[index,"VALUE_IN_EUROS"]
            mig_j["Main good "+str(annual_current_year)]=getClsProduct(cls_products[(cls_products[0]==current_product) & (pd.to_datetime(cls_products[1],errors='coerce').dt.year.fillna(0)<=annual_current_year) & (pd.to_datetime(cls_products[2],errors='coerce').dt.year.fillna(2500)>=annual_current_year) ],current_product,4)
            mig_j["Total import "+str(annual_current_year)]= migs_current.loc[index,"VALUE_IN_EUROS"]
            migs_j.append(mig_j)
        ieinfo_country["Main Import Goods"]=migs_j
        # Main Export partner
        megs_j=[]
        megs_previous= data_annual_previous_year[(data_annual_previous_year["DECLARANT_ISO"]==country) & (data_annual_previous_year["FLOW"]==FLOW_EXPORT) & (data_annual_previous_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index() 
        megs_current= data_annual_current_year[(data_annual_current_year["DECLARANT_ISO"]==country) & (data_annual_current_year["FLOW"]==FLOW_EXPORT) & (data_annual_current_year["PRODUCT_NC"].str.strip().str.len() == 8)].groupby([ "PRODUCT_NC"])["VALUE_IN_EUROS"].sum().nlargest(3).reset_index() 
        
        for index in range(n_rows):
            previous_product=megs_previous.loc[index,"PRODUCT_NC"]
            current_product=megs_current.loc[index,"PRODUCT_NC"]
            meg_j={}
            meg_j["Main good "+str(annual_previous_year)]=getClsProduct(cls_products[(cls_products[0]==previous_product) & (pd.to_datetime(cls_products[1],errors='coerce').dt.year.fillna(0)<=annual_previous_year) & (pd.to_datetime(cls_products[2],errors='coerce').dt.year.fillna(2500)>=annual_previous_year) ],previous_product,4)
            meg_j["Total export "+str(annual_previous_year)]= megs_previous.loc[index,"VALUE_IN_EUROS"]
            meg_j["Main good "+str(annual_current_year)]=getClsProduct(cls_products[(cls_products[0]==current_product) & (pd.to_datetime(cls_products[1],errors='coerce').dt.year.fillna(0)<=annual_current_year) & (pd.to_datetime(cls_products[2],errors='coerce').dt.year.fillna(2500)>=annual_current_year) ],current_product,4)
            meg_j["Total export "+str(annual_current_year)]= megs_current.loc[index,"VALUE_IN_EUROS"]
            megs_j.append(meg_j)
        ieinfo_country["Main Export Goods"]=megs_j
    
        ieinfo.append(ieinfo_country)
     
    with open(ieinfo_filename, 'w') as f:
        json.dump(ieinfo, f, ensure_ascii=False, indent = 4,cls=NpEncoder)
  


def createMonthlyFULLtable():
    #conn = sqlite3.connect(':memory:')
    DATA_FOLDER_MONTHLY_DATS=DATA_FOLDER_MONTHLY+os.sep+PREFIX_FULL+os.sep+"files"
    print(SQLLITE_DB)
    conn = sqlite3.connect(SQLLITE_DB)
    logging.info('DATA_FOLDER_MONTHLY_DATS: '+DATA_FOLDER_MONTHLY_DATS)
    for filedat in os.scandir(DATA_FOLDER_MONTHLY_DATS):
        if filedat.is_file():
             
            comext_monthly_data=pd.read_csv(filedat,sep=",",low_memory=True)
            logging.info('loaded file: '+filedat.name)
            comext_monthly_data[['DECLARANT_ISO','PARTNER_ISO', 'PRODUCT_NC','PRODUCT_CPA2_1','PRODUCT_BEC','FLOW','PERIOD','VALUE_IN_EUROS']].to_sql('comext_full', conn, if_exists='append', index = False, chunksize = 10000)
    cur = conn.cursor()
    for row in cur.execute('SELECT count(*) FROM comext_full '):
        print(row)
    if conn:
        conn.close()
  
def monthlyProcessing():
    createMonthlyFULLtable()
    
    conn = sqlite3.connect(SQLLITE_DB)
    cur = conn.cursor()
    # Create table Series
    logging.info('Creating Series table ')
    cur.execute("Create table serie_per_mappa0 as select declarant_iso, period, flow, sum(value_in_euros) as value_in_euros from comext_full where product_nc= 'TOTAL' group by declarant_iso, period,flow;")
    cur.execute("Create table serie_per_mappa as select a.declarant_iso, a.period, a.flow, round(100.00*( (a.value_in_euros-b.value_in_euros)*1.0  / b.value_in_euros ),2) as tendenziale from serie_per_mappa0 a, serie_per_mappa0 b where a.flow=b.flow and a.declarant_iso=b.declarant_iso and a.period=(b.period+100);")
    
    #  basket products.
    logging.info('Creating basket products table ')
    cur.execute("create table comext_full_b as select *,substr(product_cpa2_1,1,2) as cpa2 from comext_full where length(product_nc)==8;")
    #/* calcolo i valori per cpa */
    logging.info('Creating aggr_cpa table ')
    cur.execute("create table aggr_cpa as select declarant_iso, flow, cpa2, period, sum(value_in_euros) as val_cpa from comext_full_b group by declarant_iso, flow, cpa2, period order by declarant_iso, flow, cpa2, period;")
    #/* calcolo il valore totale */
    logging.info('Creating aggr_tot table ')
    cur.execute("create table aggr_tot as select declarant_iso, flow, period, sum(val_cpa) as val_tot from aggr_cpa group by declarant_iso, flow, period order by declarant_iso, flow, period;")
    
    #/* calcolo le quote */
    logging.info('Creating quote_cpa table ')
    cur.execute("create table quote_cpa as select a.declarant_iso, a.flow, a.cpa2, a.period, a.val_cpa, b.val_tot, 100*a.val_cpa/b.val_tot as q_cpa from aggr_cpa a, aggr_tot b where a.declarant_iso=b.declarant_iso and a.flow=b.flow and a.period=b.period;")

    #/* calcolo le variazioni */
    logging.info('Creating variazioni table ')
    cur.execute("create table variazioni as select a.declarant_iso, a.flow, a.cpa2, a.period, b.val_cpa, a.val_cpa, 100*(a.val_cpa-b.val_cpa)/b.val_cpa as var_cpa, 100*(a.q_cpa-b.q_cpa)/b.q_cpa as var_basket from quote_cpa a, quote_cpa b where a.declarant_iso=b.declarant_iso and a.flow=b.flow and a.cpa2=b.cpa2 and a.period=(b.period+100);")
    logging.info('Creating END ')
    if conn:
        conn.close()


def createMonthlyOutput():
    DATA_FOLDER_WORKING=DATA_FOLDER_MONTHLY+os.sep+"output"
    createFolder(DATA_FOLDER_WORKING)
    # import export series
    iesFiles={}
    iesFiles[FLOW_IMPORT]=DATA_FOLDER_WORKING+os.sep+"importseries.json"
    iesFiles[FLOW_EXPORT]=DATA_FOLDER_WORKING+os.sep+"exportseries.json"
    ieFlows={}
    
    conn = sqlite3.connect(SQLLITE_DB)
    serie = pd.read_sql_query("SELECT * from serie_per_mappa", conn)
    countries=sorted(pd.unique(serie["DECLARANT_ISO"]))
    for flow in [FLOW_IMPORT,FLOW_EXPORT]:
        ieSeries=[]
        for country  in countries:
            logging.info('country: '+country)   
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
        logging.info('File '+iesFiles[flow])
        with open(iesFiles[flow], 'w') as f:
            json.dump(ieFlows[flow], f, ensure_ascii=False, indent = 4,cls=NpEncoder)


if __name__ == '__main__':

  #downloadAndExtractComextAnnualDATA()  
  #downloadAndExtractComextMonthlyDATA(URL_COMEXT_PRODUCTS, PREFIX_FULL)
  #downloadAndExtractComextMonthlyDATA(URL_COMEXT_TR, PREFIX_TRANSPORT)
  #downloadfile(URL_COMEXT_CLS_PRODUCTS,CLS_PRODUCTS_FILE)
   
  #annualProcessing()
  #monthlyProcessing()
  createMonthlyOutput()