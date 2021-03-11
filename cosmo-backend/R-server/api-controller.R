library(RestRserve)
library(jsonlite)
library(data.table)
library(factoextra)
library(plyr) 
library(dplyr)
library(ggplot2)
library(sandwich)
library(zoo)
library(its.analysis)
library(lmtest)
# Input che l'utente volendo puï¿½ impostare

#basedir=("C:\\Users\\ibuku\\git\\hack-backend\\R-server")

#setwd("/home/is2admin/hackathon/git/hack-backend/R-server")
#setwd("C:\\Users\\ibuku\\git\\hack-backend\\R-server")
#basedir = ("C:\\Users\\ibuku\\git\\hack-backend\\R-server\\rscript")
#basedirData=("C:\\Users\\ibuku\\git\\hack-backend\\R-server\\data")
basedir = ("/home/is2admin/hackathon/git/hack-backend/R-server/rscript")
basedirData=("/home/is2admin/hackathon/git/hack-backend/R-server/data")
FILE_Global_Mobility_Report=paste(basedirData,"Global_Mobility_Report.csv",sep="/")
FILE_DB_Mobility=paste(basedirData,"DB_GoogleMobility.csv",sep="/")

source(paste(basedir,"MobData_function.R",sep="/"))
source(paste(basedir,"DescSummary_function.R",sep="/"))
# PLOT MOBILITY COMPONENTS
# CARICO LA SOURCE
source(paste(basedir,"PlotMobComp_function.R",sep="/"))
# POLICY INDICATOR
# CARICO LA SOURCE
source(paste(basedir,"PolicyIndicator_function.R",sep="/"))
source(paste(basedir,"api_SummaryBec.R",sep="/"))
source(paste(basedir,"api_loadcomext_function.r",sep="/"))
source(paste(basedir,"api_data_function.R",sep="/"))
source(paste(basedir,"api_sa_function.r",sep="/"))
source(paste(basedir,"api_itsa.R",sep="/"))

#region="Italy"
#subregion="Italy"
#DescSummRes<-descSummary("Italy","Italy")
#PlotCompRes<-PlotMobComp("Italy","Italy")
#Indicator  <-PolInd("Italy","Italy")


#ResBEC   <- BEC(2,"IT","US",2020,2) 
# PARAM 2 - BEC - SPECIFICO O TOTALE
#SARES <- sa(2,1,"IT","US",2020,2)

#ITSA  <- itsa_diag(1,3,"IT","WO",1,1) 


##
## altri caricamenti fi funzioni
## source(".. ")
##
app = Application$new()

#db <- NULL
GMR<-loadData()
head(GMR)

COMEXT_IMP<-loadcomext("1")
COMEXT_EXP<-loadcomext("2")


app$add_get(
  path = "/load-data", 
  FUN = function(.req, .res) {
    downloadDataFile()
    GMR<-loadData()
    .res$set_body("Load data ok")
    .res$set_content_type("application/json")
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
  })

# http://localhost:5000/desc-summary?region=Italy&subregion=Italy
app$add_get(
  path = "/desc-summary", 
  FUN = function(.req, .res) {
    print("/desc-summary")
    stats<-descSummary(.req$get_param_query("region"),.req$get_param_query("subregion")) 
    print("/desc ok")
    .res$set_body(toJSON(stats))
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    #  .res$set_content_type("text/html")
  })

app$add_get(
  path = "/desc-summary-j", 
  FUN = function(.req, .res) {
    print("/desc-summary-j")
    stats<-descSummary(.req$get_param_query("region"),.req$get_param_query("subregion")) 
    print("/desc ok")
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    .res$set_body(stats)
    
    .res$set_content_type("application/json")
  })


# PLOT MOBILITY COMPONENTS
# DA FARE CON L'OUTPUT
# Da questa funzione esce un oggetto contenente 6 data-frame uguali in ciascuno sono 
# contenuti 3 vettori: Date: le date (asse x), Value (i valori della serie da plottare come
# linee che partono dallo zero fino al punto indicato), Smooth(y di una linea rossa leggermente
# più spessa) - I 6 grafici avranno i seguenti nomi:
# Frame 1: Region (parametro dinamico) Retail
# Frame 2: Region (parametro dinamico) Grocery and Pharmacy 
# Frame 3: Region (parametro dinamico) Parks
# Frame 4: Region (parametro dinamico) Transit Station 
# Frame 5: Region (parametro dinamico) Workplaces
# Frame 6: Region (parametro dinamico) Residential

# http://localhost:5000/mobility-components?region="Italy"&subregion="Italy"
app$add_get(
  path = "/mobility-components", 
  FUN = function(.req, .res) {
    print("/mobility-components")
    resp<-PlotMobComp(.req$get_param_query("region"),.req$get_param_query("subregion"))  
    print("/mobility ok")
    .res$set_body(resp)
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    .res$set_content_type("application/json")
  })

#POLICY INDICATOR
# Da qui otteniamo un oggetto con 4 dataframe
# 1- PCAresult --> da rappresentare in una tabella (questi dati sono alla base del plot con
# le coordinate figura 1)
# 2 -  ExpVar --> Variance Explained da rappresentare con un Scree Plot: un istogramma
#linea nera che unisce i punti centrali di ogni istogramma vedi figura 2
# 3 - DPolInd,MPolInd -> Indicatore di policy giornaliero e mensile da trattare come i
# dati del file precedente (componenti) - figure 3 e 4

# http://localhost:5000/policy-indicator?region="Italy"&subregion="Italy"
app$add_get(
  path = "/policy-indicator", 
  FUN = function(.req, .res) {
    print("/policy-indicator")
    resp<-PolInd(.req$get_param_query("region"),.req$get_param_query("subregion"))  
    
    .res$set_body( resp)
    .res$set_content_type("application/json")
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    #   .res$set_content_type("text/html")
  })

###############  FUNZIONI FEDERICO ###################
### CARICAMENTO DATI COMMERCIO ESTERO (I DATI AL MOMENTO
### SONO DIVISI TRA IMPORT ED EXPORT VERIFICARE SUCCESSIVAMENTE LA
### BASE DATI DEFINITIVA)

app$add_get(
  path = "/load-comext", 
  FUN = function(.req, .res) {
    COMEXT_IMP<-loadcomext("1")
    COMEXT_EXP<-loadcomext("2")
    #db<-loadcomext(.req$get_param_query("flow"))
    .res$set_body("Load data ok")
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    .res$set_content_type("application/json")
  })


# OUTPUT: 6 DATA FRAME - CON CIASCUNO VA COMPOSTO UN SUBPLOT
# IL CUI NOME DINAMICO E' COMPOSTO DA:
# TITOLO: "Flow sigla country- sigla partner, nome del bec % tot"
# Per i parametri vedi legenda. Per country e partner usa le stesse sigle che
# ha dato fabrizio a 2 cifre
# CIASCUN DATA FRAME SI COMPONE DI TRE COLONNE
# DATES - > X
# SCATTER CHART -> Y-GRAFICO SCATTER (VERDE)
# Line -> Line  Y-GRAFICO LINE (ROSSO)
# CI SONO POI DUE TABELLE STATS E STATST che rappresentano 
# statistiche descrittive per il periodo pre e dopo la 
# data di trattamento fissata con year e month

#flow=2
#country="IT"
#partner="US"
#year=2020
#month=3
#VAR=1


# http://localhost:5000/bec?flow=2&country=IT&partner=US&year=2020&month=3
app$add_get(
  path = "/bec", 
  FUN = function(.req, .res) {
    print("/bec")
    resp<-BEC(.req$get_param_query("flow"),.req$get_param_query("country"),
              .req$get_param_query("partner"),.req$get_param_query("year"),
              .req$get_param_query("month")) 
    print("/bec ok")
    .res$set_body(resp)
    
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    
    .res$set_content_type("application/json")
  })


# L'OUTPUT DI QUESTA FUNZIONE SONO DUE DATAFRAME CONTENENTI:
# DATE - ASSE X
# VETTORE DI VALORI DA RAPPRESENTARE PRIMA COME SCATTER E POI UNIRE 
# I PUNTI CON UNA LINEA.
# CIASCUN DATAFRAME COMPORRA' UN SUBPLOT DI UNA FIGURA UNICA
#(2,1,"IT","US",2020,2)
# http://localhost:5000/sa?flow=2&VAR=1&country=IT&partner=US&year=2020&month=2

#SARES <- sa(2,1,"IT","US",2020,2)

app$add_get(
  path = "/sa", 
  FUN = function(.req, .res) {
    print("/sa")
    resp<-sa(.req$get_param_query("flow"),.req$get_param_query("var"),
             .req$get_param_query("country"),.req$get_param_query("partner"),
             .req$get_param_query("year"),.req$get_param_query("month")) 
    
    .res$set_body(resp)
    print("/sa ok")
    
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    .res$set_content_type("application/json")
  })

#ITSA  <- itsa_diag(1,3,"IT","WO",1,1) 

# http://localhost:5000/itsa?flow=2&var=1&country=IT&partner=US&fcst=1&fcstpolind=0.1,0.3,0.4
#http://localhost:5000/itsa?flow=2&var=1&country=IT&partner=US&fcst=2&fcstpolind=0.1,0.3,0.4
app$add_get(
  path = "/itsa", 
  FUN = function(.req, .res) {
    print("/itssa")
    resp<-itsa_diag(.req$get_param_query("flow"),.req$get_param_query("var"),
                    .req$get_param_query("country"),.req$get_param_query("partner"),
                    .req$get_param_query("fcst"),.req$get_param_query("fcstpolind")) 
    
    .res$set_body(resp)
    print("/itsa ok")
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    .res$set_content_type("application/json")
  })

backend = BackendRserve$new()
backend$start(app, http_port = 5000)


