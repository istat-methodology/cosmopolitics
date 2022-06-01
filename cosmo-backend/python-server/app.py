import os
import pandas as pd
import numpy as np
import random
import math
from networkx.readwrite import json_graph
import json
import networkx as nx
import pickle
import logging
import logging.config
from opencensus.ext.azure.log_exporter import AzureLogHandler
import datetime

DATA_AVAILABLE="data"+os.sep+"dataAvailable"
SEP=","
DATA_EXTENTION=".dat"
NTSR_PROD_FILE="data"+os.sep+"NSTR.txt"
PROD_DIGITS=3 # numero di digits per classificazione Transporti
NODIMAX=70
INTRA_FILE="data/cpa_intra.csv"
EXTRA_FILE="data/tr_extra_ue.csv"
CPA_TRIM_FILE="data/cpa_trim.csv"
NSTR_TRIM_FILE="data/tr_extra_ue_trim.csv"

criterio="VALUE_IN_EUROS" #VALUE_IN_EUROS 	QUANTITY_IN_KG

def is_application_insight_configured():
    return os.getenv('APPINSIGHTS_INSTRUMENTATIONKEY')!=None or os.getenv('APPLICATIONINSIGHTS_CONNECTION_STRING')!=None

def ai_callback_function(envelope):
    if os.getenv('CLOUD_ROLE') != None:
        envelope.tags['ai.cloud.role'] = os.getenv('CLOUD_ROLE')

logging.basicConfig(level=logging.INFO,
    format='%(asctime)s.%(msecs)03d %(levelname)s %(module)s - %(funcName)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S')

logger = logging.getLogger(__name__)

if is_application_insight_configured():
    log_handler = AzureLogHandler()
    log_handler.add_telemetry_processor(ai_callback_function)
    logger.addHandler(log_handler)
else:
    logger.warning('Application insights is not configured.')

def load_cpa_trim():
    def funcTrim(x):
        return np.int32(x.replace("T","0"))

    logger.info("### load_CPA_trim START")
    df=pd.read_csv(CPA_TRIM_FILE,low_memory=False,converters={'trimestre': funcTrim},dtype={"cpa": object,"FLOW":np.int8} )
    df=df[["DECLARANT_ISO","PARTNER_ISO","FLOW","cpa","trimestre","val_cpa"]]
    df.columns=["DECLARANT_ISO","PARTNER_ISO","FLOW","PRODUCT","PERIOD","VALUE_IN_EUROS"]
    df=df[df.PRODUCT.apply(lambda x : len(x.strip())==PROD_DIGITS)]
    logger.info("### load_CPA_trim END")
    return df


def load_NSTR_trim():
    def funcTrim(x):
        return np.int32(x.replace("T","0"))
   
    logger.info("### load_NSTR_trim START..") 
    df=pd.read_csv(NSTR_TRIM_FILE,low_memory=False,converters={'TRIMESTRE': funcTrim},dtype={"PRODUCT_NSTR": object,"FLOW":np.int8} )
    print("************",df.columns)
    
    df=df[["DECLARANT_ISO","PARTNER_ISO","FLOW","PRODUCT_NSTR","TRANSPORT_MODE","TRIMESTRE","VALUE_IN_EUROS"]]
    df.columns=["DECLARANT_ISO","PARTNER_ISO","FLOW","PRODUCT","TRANSPORT_MODE","PERIOD","VALUE_IN_EUROS"]
    df=df[df.PRODUCT.apply(lambda x : len(x.strip())==PROD_DIGITS)]
    logger.info("### load_NSTR_trim END") 
    return df


def load_files_available(): 
    #EXTRA_FILE
    logger.info("### load_files_available EXTRA_FILE...") 
    df=pd.read_csv(EXTRA_FILE,sep=SEP,dtype={"PRODUCT_NSTR": object,"FLOW":np.int8,"PERIOD":np.int32,"TRANSPORT_MODE":np.int8} )
    df.columns=["PRODUCT","DECLARANT_ISO","PARTNER_ISO","PERIOD","TRANSPORT_MODE","FLOW",'VALUE_IN_EUROS', 'QUANTITY_IN_KG']
    
    #df['PERIOD']=pd.to_datetime(df['PERIOD'], format="%Y%m")
    
    #print(list(df["PERIOD"].unique()))
    #print (df.shape)
    #print(df.info())
    logger.info("### load_files_available EXTRA_FILE END") 
    return df

    # legge i file disponibili nella cartella data_avilable
    # in funzione dei mesi caricati si crea il dataset  
    # della finestra temporale presente nella cartella
    
    # reads DATA_AVAILABLE dir
    # DATA_EXTENTION separator
    '''
    listDataframes=[]
    for f in os.listdir(DATA_AVAILABLE):
        if f.endswith(DATA_EXTENTION):
            appo=pd.read_csv(DATA_AVAILABLE+os.sep+f,sep=SEP)
            listDataframes.append(appo)
            logger.info("shape: "+str(appo.shape))  
            
    df=pd.concat(listDataframes,axis=0)        
    df=df[df["PRODUCT_NSTR"]!="TOT"]
    df=df[df["DECLARANT_ISO"]!="EU"]
    df=df[df["PARTNER_ISO"]!="EU"]     
    df=df[["PRODUCT_NSTR","DECLARANT_ISO","PARTNER_ISO","PERIOD","TRANSPORT_MODE","FLOW",'VALUE_IN_EUROS', 'QUANTITY_IN_KG']]                  
    df.columns=["PRODUCT","DECLARANT_ISO","PARTNER_ISO","PERIOD","TRANSPORT_MODE","FLOW",'VALUE_IN_EUROS', 'QUANTITY_IN_KG']
    logger.info("### load_files_available exit") 
    return df
    '''
    

def load_file_intraEU(): 
    logger.info("###  load_file_intraEU START...")
    #df_transportIntra=pd.read_csv(INTRA_FILE,low_memory=False,dtype={"PRODUCT": object, "DECLARANT_ISO": object, "PARTNER_ISO": object,"FLOW":np.int8,"PERIOD":np.int16,"VALUE_IN_EUROS":np.int64} )
    df_transportIntra=pd.read_csv(INTRA_FILE,low_memory=False,dtype={"PRODUCT": object,"FLOW":np.int8,"PERIOD":np.int32,"TRANSPORT_MODE":np.int8} )
    '''
    df_transportIntra=pd.read_csv(INTRA_FILE,low_memory=False,usecols=["DECLARANT_ISO","PARTNER_ISO","FLOW","cpa"
                                                                                ,"PERIOD","val_cpa"])
    df_transportIntra.columns=["DECLARANT_ISO","PARTNER_ISO","FLOW","PRODUCT","PERIOD","VALUE_IN_EUROS"]
    df_transportIntra=df_transportIntra[df_transportIntra.PRODUCT.str.len()==3]
    '''
    
    #df_transportIntra['PERIOD']=pd.to_datetime(df_transportIntra['PERIOD'], format="%Y%m")
    


    #print(list(df_transportIntra["PERIOD"].unique()))
    #print (df_transportIntra.shape)
    #print(df_transportIntra.info())
    logger.info("###  load_file_intraEU END")
    return df_transportIntra

def estrai_tabella_per_grafo(tg_period,tg_perc,listaMezzi,flow,product,criterio,selezioneMezziEdges,df_transport_estrazione):
    print(df_transport_estrazione.info())
    #estraggo dalla tabella solo le informazioni richieste nei filtri richiesti al runtime
    logger.info("### estrai_tabella_per_grafo...") 
    logger.info("ESTRAGGO TABELLA COMEX") 
    
    #df_transport_estrazione=df_transport
    df_transport_estrazione=df_transport_estrazione[df_transport_estrazione["FLOW"]==flow]
    print("###",df_transport_estrazione.shape)
    print(df_transport_estrazione.head(5))
    if tg_period is not None:
        #tg_period=datetime.datetime.strptime(str(tg_period), '%Y%m')
        tg_period=np.int32(tg_period)
        df_transport_estrazione = df_transport_estrazione[df_transport_estrazione["PERIOD"]==tg_period]
    print("###",df_transport_estrazione.shape)
    #seleziona i mezzi nel grafo
    if listaMezzi is not None:    
        df_transport_estrazione=df_transport_estrazione[df_transport_estrazione["TRANSPORT_MODE"].isin(listaMezzi)]
    print("###",df_transport_estrazione.shape)
    
    if product is not None:
        #print("product:",product,type(product))
        df_transport_estrazione=df_transport_estrazione[df_transport_estrazione["PRODUCT"]==product]
    print("###",df_transport_estrazione.shape)

    #costruisce una query per eliminare i mezzi in un arco nel grafo
    def build_query_mezzi(selezioneMezziEdges):
        listQuery=[]
        for edge in selezioneMezziEdges:#['edgesSelected']:
            From=edge["from"]
            To=edge["to"]
            exclude=str(edge["exclude"])
            # gestione grafi senza mezzi di transporto
            print (exclude)
            if "-99" in exclude:
                print("###########################  no means of transport it'll exclude entire edges")
                listQuery.append("((DECLARANT_ISO == '"+From+"' & PARTNER_ISO == '"+To+"' )|(DECLARANT_ISO == '"+To+"' & PARTNER_ISO == '"+From+"' ))")
            else:
                listQuery.append("((DECLARANT_ISO == '"+From+"' & PARTNER_ISO == '"+To+"' & TRANSPORT_MODE in "+exclude+")|(DECLARANT_ISO == '"+To+"' & PARTNER_ISO == '"+From+"' & TRANSPORT_MODE in "+exclude+"))")
        return "not ("+("|".join(listQuery))+")"
    
    if (selezioneMezziEdges is not None):
        Query=build_query_mezzi(selezioneMezziEdges)
        logger.info("QUERY selezione MezziEdge:")
        df_transport_estrazione=df_transport_estrazione.query(Query)

    #aggrega indimendentemente dai mezzi o produtti ed ordina secondo il criterio scelto VALUE o QUANTITY 
    df_transport_estrazione=df_transport_estrazione.groupby(["DECLARANT_ISO","PARTNER_ISO"]).sum().reset_index()[["DECLARANT_ISO","PARTNER_ISO",criterio]]
    df_transport_estrazione=df_transport_estrazione.sort_values(criterio,ascending=False)    
    #taglio sui nodi 
    if tg_perc is not None:
        SUM = df_transport_estrazione[criterio].sum()     
        df_transport_estrazione = df_transport_estrazione[df_transport_estrazione[criterio].cumsum(skipna=False)/SUM*100<tg_perc] 
        logger.info("### estrai_tabella_per_grafo exit")     
    return df_transport_estrazione
def makeGraph(tab4graph,pos_ini,weight_flag,flow,AnalisiFlag): 
    # costruisce sulla base della tabella filtrata
    # il grafo con le relative metriche
    logger.info("### makeGraph... ")     

    def calc_metrics(Grafo,FlagWeight):
        logger.info("### metrics... ")     
        in_deg = nx.in_degree_centrality(Grafo)
        Metrics ={}
        vulner={}
        for k, v in in_deg.items():
            if v!=0:      
                vulner[k]=1-v
            else:
                vulner[k]=0            
            Metrics={
            "degree_centrality":nx.degree_centrality(Grafo), # DA NON USARE E POI COMMENTARE
            "density":nx.density(Grafo), #diffusione del prodotto
            "vulnerability":vulner,
            #"degree_centrality":nx.out_degree_centrality(Grafo),
            "exportation strenght":nx.out_degree_centrality(Grafo),
            "hubness":nx.closeness_centrality(Grafo.to_undirected())
            #"hubness":nx.betweenness_centrality(Grafo) #, weight="weight")
            }
        logger.info("### metrics... ")     
        return Metrics 



    G = nx.DiGraph()


    # assegno i ruoli da e a
    if flow==1:
        logger.info("FLOW: import")
        country_from="PARTNER_ISO"
        country_to="DECLARANT_ISO"
        
    if flow==2:
        logger.info("FLOW: export")    
        country_from="DECLARANT_ISO"
        country_to="PARTNER_ISO"

    # costruisco il grafo con edges e nodi
    # se il grafo è pesato
    # assegno il peso VALUE o QUANTITY in funzione del criterio scelto per ordinare il mercato
    # ed eseguire il taglio      
    if weight_flag==True:
        weight=criterio
        Wsum=tab4graph[weight].sum()
        edges=[ (i,j,w/Wsum) for i,j,w in tab4graph.loc[:,[country_from,country_to,weight]].values]
        #edges=[ (i,j,w) for i,j,w in tab4graph.loc[:,[country_from,country_to,weight]].values]
    if weight_flag==False:
        edges=[ (i,j,1) for i,j in tab4graph.loc[:,[country_from,country_to]].values]
    G.add_weighted_edges_from(edges)

    #Calcolo le metriche
    MetricG=calc_metrics(G,weight_flag)	
    

  #passo alla rappresentazione json del grafo
    GG=json_graph.node_link_data(G)
    Nodes=GG["nodes"]
    Links=GG["links"] 


    #if pos_ini is None: # keep ini_pos
    if True:
        k_layout=5
        pos_ini={}
        random.seed(8)
        for node in Nodes:
            x= random.uniform(0, 1)
            y= random.uniform(0, 1)
            pos_ini[node['id']]=np.array([x,y])
    else:
            k_layout=200
            logger.info("-- POSIZIONE DEI NODI PRECEDENTE ACQUISITA --")

    try:
        
        #logger.info(str(pos_ini))
        
        coord = nx.spring_layout(G,k=k_layout/math.sqrt(G.order()),pos=pos_ini)
        coord = nx.spring_layout(G,k=k_layout/math.sqrt(G.order()),pos=coord) # stable solution
        #coord = nx.spring_layout(G,k=5/math.sqrt(G.order()),pos=coord) # stable solution
    except:
        return None,None,None

    #########################################################
    df_coord = pd.DataFrame.from_dict(coord,orient='index')
    df_coord.columns = ['x', 'y']

    df = pd.DataFrame(GG["nodes"])
    df.columns=['label']
    df['id'] = np.arange(df.shape[0])
    df = df[['id', 'label']]    
    out = pd.merge(df, df_coord, left_on='label', right_index=True)
    dict_nodes = out.T.to_dict().values()
    
    dfe = pd.DataFrame(GG["links"])[["source" , "target","weight"]]
    res = dfe.set_index('source').join(out[['label','id']].set_index('label'), on='source', how='left')
    res.columns=['target', 'source_id',"weight"]
    res2 = res.set_index('target').join(out[['label','id']].set_index('label'), on='target', how='left')
    res2.columns=["weight",'from','to']
    res2.reset_index(drop=True, inplace=True)
    dict_edges= res2.T.to_dict().values()

    new_dict = { "nodes": list(dict_nodes), "edges": list(dict_edges),"metriche":MetricG}

    JSON=json.dumps(new_dict) 
    logger.info("### makeGraph exit")     
    return coord,JSON,G

def jsonpos2coord(jsonpos):
    logger.info("### jsonpos2coord... ")     
    coord={}
    for id,x,y in pd.DataFrame.from_dict(jsonpos["nodes"]) [["label","x","y"]].values:

        coord[id]=np.array([x,y])
    logger.info("### jsonpos2coord exit ")     
    return coord    
try:
    df_transport = load_files_available()  
    df_transportIntra = load_file_intraEU()      
    df_trimcpa = load_cpa_trim()
    df_trimNSTR = load_NSTR_trim()
except:
    #print("#############   FILE NON TROVATI")
    logger.info("### Files non trovati ")     

#prod_NTSR_dict=build_NTSR_dict()

from flask import Flask,request,Response
from flask_cors import CORS
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.trace.samplers import ProbabilitySampler

app = Flask(__name__)
CORS(app, resources=r'/*')

azure_exporter = AzureExporter()
azure_exporter.add_telemetry_processor(ai_callback_function)

if is_application_insight_configured():
    middleware = FlaskMiddleware(
        app,
        exporter=azure_exporter,
        sampler=ProbabilitySampler(rate=1.0),
    )


###########GRAPH METHOD#######################################################
#@app.route('/wordtradegraph/<tg_period>/<tg_perc>/<listaMezzi>/<criterio>/<product>/<flow>')
#def wordtradegraph(tg_period,tg_perc,listaMezzi,criterio,product,flow):
#@app.route('/wordtradegraphextra', methods=['POST','GET'])        
@app.route('/graphExtraMonth', methods=['POST','GET'])
def graphExtraMonth():
    logger.info("### graphExtraMonth...")
    if request.method == 'POST':        
        logger.info("Word Trade Graph method get EXTRA....")
        
        logger.info("criterio per costruire il grafo: "+criterio )
        jReq=dict(request.json)
        logger.info("------ jReq",jReq)
        tg_perc=int(jReq['tg_perc'])
        tg_period=int(jReq['tg_period'])
        pos=jReq['pos']
        if pos=="None":
            pos=None
        else:
            logger.info("Gestisci posizione dei nodi precedenti -----",pos)
            logger.info("pos-----",type(pos))            
            pos=jsonpos2coord(pos)

        #0:Unknown 1:Sea 2:Rail 3:Road 4Air 5:Post 7:Fixed Mechanism 8:Inland Waterway 9:Self Propulsion
        #listaMezzi=map(int,(jReq['listaMezzi']).split(","))#[0,1,2,3,4,5,7,8,9] 
        listaMezzi=jReq['listaMezzi']#[0,1,2,3,4,5,7,8,9]         
        flow=int(jReq['flow'])        
        product=str(jReq['product'])       
        weight_flag=bool(jReq['weight_flag'])       
        selezioneMezziEdges=jReq['selezioneMezziEdges']  
        if selezioneMezziEdges=="None":
            selezioneMezziEdges=None
        else:
            pass
            logger.info(selezioneMezziEdges)
            logger.info(type(selezioneMezziEdges))
        #--------------------
                
        tab4graph=estrai_tabella_per_grafo(tg_period,tg_perc,listaMezzi,flow,product,criterio,selezioneMezziEdges,df_transport)
        logger.info("tab4graph.shape: "+str(tab4graph.shape))

        #controllo se la dimensione del grafo è troppo grande
        #conto il numerp dei nodi
        #se sono maggiori di una soglia NODIMAX 
        #invio un messaggio al client
        NUM_NODI=len(set(tab4graph["DECLARANT_ISO"]).union(set(tab4graph["PARTNER_ISO"])))
        if NUM_NODI > NODIMAX:
            return json.dumps({"STATUS":"05"})                 
            #return json.dumps({"ERROR_MSG":"Graph is too wide  \n Decrease the treshold or change means of transport"}) 
            #return "Graph is too wide  \n Decrease the treshold"


        #AnalisiFlag=selezioneMezziEdges ########################################
        
        pos,JSON,G=makeGraph(tab4graph,pos,weight_flag,flow,None)

        if pos is None:
            if JSON is None:
                return json.dumps({"STATUS":"06"})     
                #return json.dumps({"ERROR_MSG":"Graph empty \n Increase the treshold or change means of transport"})                           
                #return "Graph empty \n Increase the treshold"       
        resp = Response(response=JSON,
                    status=200,
                    mimetype="application/json")
        logger.info("### wordtradegraph exit")
        return resp

    else:
        logger.info("### wordtradegraph exit")
        return str("only post")



@app.route('/graphIntraMonth', methods=['POST','GET'])
def graphIntraMonth():
    if request.method == 'POST':
        
        logger.info("Word Trade INTRA_EU Graph method get ....")

        
        logger.info("criterio per costruire il grafo:"+criterio )
        jReq=dict(request.json)
        logger.info("------ jReq",jReq)
        tg_perc=int(jReq['tg_perc'])
        tg_period=int(jReq['tg_period'])
        pos=jReq['pos']
        if pos=="None":
            pos=None
        else:
            logger.info("Gestisci posizione dei nodi precedenti -----")
            logger.info("pos-----",type(pos))            
            pos=jsonpos2coord(pos)

        #0:Unknown 1:Sea 2:Rail 3:Road 4Air 5:Post 7:Fixed Mechanism 8:Inland Waterway 9:Self Propulsion
        #listaMezzi=map(int,(jReq['listaMezzi']).split(","))#[0,1,2,3,4,5,7,8,9] 
        #listaMezzi=jReq['listaMezzi']#[0,1,2,3,4,5,7,8,9]         
        flow=int(jReq['flow'])        
        product=str(jReq['product'])       
        weight_flag=bool(jReq['weight_flag'])       

        #---------------------
        selezioneMezziEdges=jReq['selezioneMezziEdges']  
        if selezioneMezziEdges=="None":
            selezioneMezziEdges=None
        else:
            pass
            logger.info(selezioneMezziEdges)
            logger.info(type(selezioneMezziEdges))
        #--------------------

        tab4graph=estrai_tabella_per_grafo(tg_period,tg_perc,None,flow,product,criterio,selezioneMezziEdges,df_transportIntra)
        logger.info("tab4graph.shape"+str(tab4graph.shape))
        #AnalisiFlag=selezioneMezziEdges ########################################

        #controllo se la dimensione del grafo è troppo grande
        #conto il numerp dei nodi
        #se sono maggiori di una soglia NODIMAX 
        #invio un messaggio al client
        NUM_NODI=len(set(tab4graph["DECLARANT_ISO"]).union(set(tab4graph["PARTNER_ISO"])))
        if NUM_NODI > NODIMAX:
            return json.dumps({"STATUS":"05"})                 
            #return json.dumps({"ERROR_MSG":"Graph is too wide  \n Decrease the treshold or change means of transport"}) 
            #return "Graph is too wide  \n Decrease the treshold"


        pos,JSON,G=makeGraph(tab4graph,pos,weight_flag,flow,None)

        if pos is None:
            if JSON is None:
                return json.dumps({"STATUS":"06"})                 
                #return json.dumps({"ERROR_MSG":"Graph empty \n Increase the treshold or change means of transport"})                           
                #return "Graph empty \n Increase the treshold"       
        resp = Response(response=JSON,
                    status=200,
                    mimetype="application/json")
        logger.info("### graphIntraMonth intra EU exit")
        return resp

    else:
        logger.info("### graphIntraMonth intra EU exit")
        return str("only post")

@app.route('/graphIntraTrim', methods=['POST','GET'])
def graphIntraTrim():
    if request.method == 'POST':       
        logger.info("TRIMESTRAL Word Trade INTRA_EU Graph method get ....")
        logger.info("criterio per costruire il grafo:"+criterio )
        jReq=dict(request.json)
        logger.info("------ jReq",jReq)
        tg_perc=int(jReq['tg_perc'])
        tg_period=int(jReq['tg_period'])
        pos=jReq['pos']
        if pos=="None":
            pos=None
        else:
            logger.info("Gestisci posizione dei nodi precedenti -----")
            logger.info("pos-----",type(pos))            
            pos=jsonpos2coord(pos)

        flow=int(jReq['flow'])        
        product=str(jReq['product'])       
        weight_flag=bool(jReq['weight_flag'])       


        #---------------------
        selezioneMezziEdges=jReq['selezioneMezziEdges']  
        if selezioneMezziEdges=="None":
            selezioneMezziEdges=None
        else:
            pass
            logger.info(selezioneMezziEdges)
            logger.info(type(selezioneMezziEdges))
        #--------------------


        tab4graph=estrai_tabella_per_grafo(tg_period,tg_perc,None,flow,product,criterio,selezioneMezziEdges,df_trimcpa)
        logger.info("tab4graph.shape"+str(tab4graph.shape))
        NUM_NODI=len(set(tab4graph["DECLARANT_ISO"]).union(set(tab4graph["PARTNER_ISO"])))
        if NUM_NODI > NODIMAX:
            return json.dumps({"STATUS":"05"})                 
        

        pos,JSON,G=makeGraph(tab4graph,pos,weight_flag,flow,None)

        if pos is None:
            if JSON is None:
                return json.dumps({"STATUS":"06"})                 
                       
        resp = Response(response=JSON,
                    status=200,
                    mimetype="application/json")
        logger.info("### TRIMESTRAL CPA intra EU exit")
        return resp

    else:
        logger.info("### TRIMESTRAL CPA intra EU exit")
        return str("only post")

################################################


################################################

@app.route('/graphExtraTrim', methods=['POST','GET'])
def graphExtraTrim():
    if request.method == 'POST':       
        logger.info("TRIMESTRAL Word Trade EXTRA_EU Graph method get ....")
        logger.info("criterio per costruire il grafo:"+criterio )
        jReq=dict(request.json)
        logger.info("------ jReq",jReq)
        tg_perc=int(jReq['tg_perc'])
        tg_period=int(jReq['tg_period'])
        pos=jReq['pos']
        if pos=="None":
            pos=None
        else:
            logger.info("Gestisci posizione dei nodi precedenti -----")
            logger.info("pos-----",type(pos))            
            pos=jsonpos2coord(pos)
            
        #0:Unknown 1:Sea 2:Rail 3:Road 4Air 5:Post 7:Fixed Mechanism 8:Inland Waterway 9:Self Propulsion
        #listaMezzi=map(int,(jReq['listaMezzi']).split(","))#[0,1,2,3,4,5,7,8,9] 
        listaMezzi=jReq['listaMezzi']#[0,1,2,3,4,5,7,8,9]    
        flow=int(jReq['flow'])        
        product=str(jReq['product'])       
        weight_flag=bool(jReq['weight_flag'])       
        #---------------------
        selezioneMezziEdges=jReq['selezioneMezziEdges']  
        if selezioneMezziEdges=="None":
            selezioneMezziEdges=None
        else:
            pass
            logger.info(selezioneMezziEdges)
            logger.info(type(selezioneMezziEdges))
        #--------------------


                
        tab4graph=estrai_tabella_per_grafo(tg_period,tg_perc,listaMezzi,flow,product,criterio,selezioneMezziEdges,df_trimNSTR)
        logger.info("tab4graph.shape: "+str(tab4graph.shape))

        #controllo se la dimensione del grafo è troppo grande
        #conto il numerp dei nodi
        #se sono maggiori di una soglia NODIMAX 
        #invio un messaggio al client
        NUM_NODI=len(set(tab4graph["DECLARANT_ISO"]).union(set(tab4graph["PARTNER_ISO"])))
        if NUM_NODI > NODIMAX:
            return json.dumps({"STATUS":"05"})                 



        
        pos,JSON,G=makeGraph(tab4graph,pos,weight_flag,flow,None)

        if pos is None:
            if JSON is None:
                return json.dumps({"STATUS":"06"})     
  
        resp = Response(response=JSON,
                    status=200,
                    mimetype="application/json")
        logger.info("### graphExtraTrim exit")
        return resp

    else:
        logger.info("### graphExtraTrim exit")
        return str("only post")



################################################





@app.route('/refreshdata')
def refreshdata():
    
    try:
        global df_transport 
        df_transport = load_files_available()  
        global df_transportIntra 
        df_transportIntra = load_file_intraEU()    
        global df_trimcpa 
        df_trimcpa = load_cpa_trim()

        global df_trimNSTR
        df_trimNSTR = load_NSTR_trim()
        
        return str(' data refreshed')
    except BaseException as e:
        repo="ERROR load file  " + str(e)
        #print("#############   FILE NON TROVATI")
        logger.info(repo)  
        return str(repo)


@app.route('/hello')
def hello():
    return str('Version '+str(os.getenv('APP_VERSION')))
        
if __name__ == '__main__':
    IP='0.0.0.0'
    port=5500
    app.run(host=IP, port=port)
