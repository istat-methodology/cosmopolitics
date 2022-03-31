 library(RestRserve)
 library(jsonlite)
 library(data.table)
 library(stringr)
 library(stringi)
 library(dplyr)
 
 
# basedir = ("C:\\git\\cosmopolitics\\cosmo-backend\\R-server\\rscript")
# basedirData=("C:\\git\\cosmopolitics\\cosmo-backend\\R-server\\data")


basedir = ("./rscript")
basedirData=("./data")

source(paste(basedir,"api_loadcomext_function.r",sep="/"))
source(paste(basedir,"api_data_function.R",sep="/"))
source(paste(basedir,"api_itsa.R",sep="/"))


##
app = Application$new()

COMEXT_IMP<-load_comext("1")
COMEXT_EXP<-load_comext("2")

# flow<-1
# var_cpa<-"03"
# country_code<-"IT"
# partner_code<-"US"
# dataType<-1 #1 yearly variation, 2 raw data
# tipo_var<-1 #1==val_cpa; 2==q_kg

#### FUNZIONI

app$add_get(
  path = "/hello", 
  FUN = function(.req, .res) {
     
    .res$set_body(paste("version ",Sys.getenv("APP_VERSION")))
    .res$set_content_type("text/plain")
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
  })

### CARICAMENTO DATI COMMERCIO ESTERO 

app$add_get(
  path = "/load-comext", 
  FUN = function(.req, .res) {
    COMEXT_IMP <<- load_comext("1")
    COMEXT_EXP <<- load_comext("2")
    
    .res$set_body("Load data ok")
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")
    
    .res$set_content_type("application/json")
  })


### selezione dei dati in base ai filtri utente e visualizzazione serie
#ITSA  <- itsa(1,"03","IT","US",1,1) 
# http://localhost:5000/itsa?flow=1&var=03&country=IT&partner=US&dataType=1&tipovar=1
app$add_get(
    path = "/itsa", 
      FUN = function(.req, .res) {
        resp<-itsa(.req$get_param_query("flow"),.req$get_param_query("var"),
                 .req$get_param_query("country"),.req$get_param_query("partner"),
                 .req$get_param_query("dataType"),.req$get_param_query("tipovar"))
    .res$set_body(resp)
  
    .res$set_header("Access-Control-Allow-Origin", "*")
    .res$set_header("Access-Control-Allow-Methods","*")
    .res$set_header("Access-Control-Allow-Headers", "*")

    .res$set_content_type("application/json")
  })


backend = BackendRserve$new()
backend$start(app, http_port = 5000)
