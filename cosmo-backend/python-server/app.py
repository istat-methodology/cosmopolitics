import os
import pandas as pd
import numpy as np
import random
import math
from networkx.readwrite import json_graph
import json
import networkx as nx



DATA_AVAILABLE="data"+os.sep+"dataAvailable"
SEP=","
DATA_EXTENTION=".dat"
TIME_FTM=(2,2+6)
NTSR_PROD_FILE="data"+os.sep+"NSTR.txt"

def data_extraction(date):   
    return date[TIME_FTM[0]:TIME_FTM[1]]



def load_files_available(): 
    # reads DATA_AVAILABLE dir
    # DATA_EXTENTION separator
    N_dfs=0
    for f in os.listdir(DATA_AVAILABLE):
        if f.endswith(DATA_EXTENTION):
            print(f,data_extraction(f),"...loading")
            N_dfs+=1  
            if N_dfs==1:
                df=pd.read_csv(DATA_AVAILABLE+os.sep+f,sep=SEP)
                
                print ("\t","shape",df.shape)
                continue
            appo=pd.read_csv(DATA_AVAILABLE+os.sep+f,sep=SEP)        
            print ("\t","shape",appo.shape)
            df=df.append(appo)
            
            df=df[df["PRODUCT_NSTR"]!="TOT"]
            df=df[df["DECLARANT_ISO"]!="EU"]
            df=df[df["PARTNER_ISO"]!="EU"]
            
            
    return df

df_transport = load_files_available()      





def load_COMEXPLUS(): 
    print("COMEX-PLUS loading...")
    df_ITGS_plus=pd.read_csv("data/stima_comext_ITGS_201901_202012..csv",sep=",")

    df_ITGS_plus.head()
    df_ITGS_plus["product_NC"]=df_ITGS_plus["product_NC"].astype(str)

    df_CN=pd.read_csv("data/CN.txt",sep="\t")
    print(df_CN.info())


    df_CN.columns=["00","01","02","03","04","05","06"]


    #["product_NC"]#.apply(lambda x: CNcod2Prod[int(x)])
    #df_CN.set_index("00")
    #df_ITGS_plus
    df_ITGS_plus.columns=["PRODUCT_NC","DECLARANT_ISO","consign","PARTNER_ISO","FLOW","PERIOD","TRANSPORT_MODE","VALUE_IN_EUROS"]
    #df_ITGS_plus.to_csv("save.csv",sep=",")
    df_ITGS_plus["PRODUCT_NC"]=df_ITGS_plus["PRODUCT_NC"].astype("str")

    df=pd.merge(df_ITGS_plus,df_CN,left_on="PRODUCT_NC",right_on="00")[["PRODUCT_NC","04","DECLARANT_ISO","consign","PARTNER_ISO","FLOW","PERIOD","TRANSPORT_MODE","VALUE_IN_EUROS"]]

            
    df=df[df["PRODUCT_NC"]!="TOT"]
    df=df[df["DECLARANT_ISO"]!="EU"]
    df=df[df["PARTNER_ISO"]!="EU"]
    df[["PRODUCT_NC","04"]].drop_duplicates().to_csv("COMEXPLUS_PROD.csv",index=False)        
            
    return df

df_transportCOMEXPLUS = load_COMEXPLUS()      


#build dict mapping NTSR prod and viceversa
NTSR_prod=pd.read_csv(NTSR_PROD_FILE,"\t",index_col=0)#.to_dict()
NTSR_prod_dict=NTSR_prod.to_dict()
NTSR_prod_dict=NTSR_prod_dict['AGRICULTURAL PRODUCTS AND LIVE ANIMALS']
prod_NTSR_dict=NTSR_prod.reset_index()

prod_NTSR_dict=prod_NTSR_dict[prod_NTSR_dict['0'].str.len()==3]
prod_NTSR_dict=prod_NTSR_dict.set_index("AGRICULTURAL PRODUCTS AND LIVE ANIMALS").to_dict()["0"]




#tg_country paese di interesse di cui elimino un edge
#G_prod = b (Grafo delle importazioni)
#G_all = G  (Grafo delle importazioni)



def delete_link(G_prod, G_all, tg_country, country_del):

    deg_all = nx.out_degree_centrality(G_all)
    poss_root = nx.out_degree_centrality(G_prod)
    roots = { key: value for key, value in poss_root.items() if value == 0.0 }
    lista_roots = list(roots.keys())
    
    if country_del in lista_roots:
        lista_roots.remove(country_del)
    
    print("Lista:")
    print(lista_roots)
    #print(deg_all)
    
    Out_suggestions = {}
    
    for r in lista_roots:  
        print(r)
        
        if r in deg_all.keys():        
            try:
                path_actual = nx.shortest_path(G_prod, source=tg_country, target=r, weight="value")      
            except nx.NetworkXNoPath:
                path_actual ='No actual path'
                
            try:
                path_all = nx.shortest_path(G_all, source=tg_country, target=r, weight="value")
            except nx.NetworkXNoPath:
                path_all='No path'
            
            Out_suggestions[r]={
                "num_exportations":deg_all[r],
                "path_actual": path_actual,
                "path_all": path_all,
                }          
        else:
            print(r + " not present")
    
    return Out_suggestions




def estrai_tabella_per_grafo(tg_period,tg_perc,listaMezzi,flow,product,criterio,selezioneMezziEdges,DS_COMEX):
    if (DS_COMEX==True):
        df_transport_estrazione=df_transport
    else:
        df_transport_estrazione=df_transportCOMEXPLUS

    if tg_period is not None:
        df_transport_estrazione = df_transport_estrazione[df_transport_estrazione["PERIOD"]==tg_period]

    if listaMezzi is not None:    
        df_transport_estrazione=df_transport_estrazione[df_transport_estrazione["TRANSPORT_MODE"].isin(listaMezzi)]

    df_transport_estrazione=df_transport_estrazione[df_transport_estrazione["FLOW"]==flow]

    if product is not None:
        if (DS_COMEX==True):
            df_transport_estrazione=df_transport_estrazione[df_transport_estrazione["PRODUCT_NSTR"]==product]
        else:
            df_transport_estrazione=df_transport_estrazione[df_transport_estrazione["PRODUCT_NC"]==product]
    def build_query_mezzi(selezioneMezziEdges):
        listQuery=[]
        for edge in selezioneMezziEdges:#['edgesSelected']:

            From=edge["from"]
            To=edge["to"]
            exclude=str(edge["exclude"])


            listQuery.append("((DECLARANT_ISO == '"+From+"' & PARTNER_ISO == '"+To+"' & TRANSPORT_MODE in "+exclude+")|(DECLARANT_ISO == '"+To+"' & PARTNER_ISO == '"+From+"' & TRANSPORT_MODE in "+exclude+"))")
        return "not ("+("|".join(listQuery))+")"
    
    if (selezioneMezziEdges is not None):
        Query=build_query_mezzi(selezioneMezziEdges)

        df_transport_estrazione=df_transport_estrazione.query(Query)


    
    #aggrega
    if (DS_COMEX==True):
        df_transport_estrazione=df_transport_estrazione.groupby(["DECLARANT_ISO","PARTNER_ISO"]).sum().reset_index()[["DECLARANT_ISO","PARTNER_ISO","VALUE_IN_EUROS","QUANTITY_IN_KG"]]
    else:
        df_transport_estrazione=df_transport_estrazione.groupby(["DECLARANT_ISO","PARTNER_ISO"]).sum().reset_index()[["DECLARANT_ISO","PARTNER_ISO","VALUE_IN_EUROS"]]

    df_transport_estrazione=df_transport_estrazione.sort_values(criterio,ascending=False)

    #taglio sui nodi
    if tg_perc is not None:
        SUM = df_transport_estrazione[criterio].sum()     
        df_transport_estrazione = df_transport_estrazione[df_transport_estrazione[criterio].cumsum(skipna=False)/SUM*100<tg_perc] 
    
    return df_transport_estrazione

def makeGraph(tab4graph,pos_ini,weight_flag,flow,AnalisiFlag):
    

    def calc_metrics(Grafo,FlagWeight): 
        in_deg = nx.in_degree_centrality(Grafo)

        Metrics={
            "degree_centrality":nx.degree_centrality(Grafo),
            "density":nx.density(Grafo),
            "vulnerability":dict((k, (1-v)) for k, v in in_deg.items()),
            "degree_centrality":nx.out_degree_centrality(Grafo),
            "exportation strenght":nx.out_degree_centrality(Grafo),
            "hubness":nx.betweenness_centrality(Grafo)#, weight="value")
            }


        return Metrics 

    G = nx.DiGraph()
    if flow==1:
        print("import")
        country_from="PARTNER_ISO"
        country_to="DECLARANT_ISO"
        
    if flow==2:
        print("export")    
        country_from="DECLARANT_ISO"
        country_to="PARTNER_ISO"
    weight="VALUE_IN_EUROS"
    
    if weight_flag==True:
        Wsum=tab4graph[weight].sum()
        edges=[ (i,j,w/Wsum) for i,j,w in tab4graph.loc[:,[country_from,country_to,weight]].values]
    if weight_flag==False:
        edges=[ (i,j,1) for i,j,w in tab4graph.loc[:,[country_from,country_to,weight]].values]
        #G.add_edge(i,j)
    G.add_weighted_edges_from(edges)
    MetricG=calc_metrics(G,weight_flag)	

    import pickle
    with open ("G_dump.pkl","wb") as f:
        pickle.dump(G,f)


    GG=json_graph.node_link_data(G)
    Nodes=GG["nodes"]
    Links=GG["links"] 

    if pos_ini is None:
        pos_ini={}
        random.seed(8)
        for node in Nodes:
            x= random.uniform(0, 1)
            y= random.uniform(0, 1)
            pos_ini[node['id']]=np.array([x,y])
    try:
        coord = nx.spring_layout(G,k=5/math.sqrt(G.order()),pos=pos_ini)
        coord = nx.spring_layout(G,k=5/math.sqrt(G.order()),pos=coord) # stable solution
        #coord = nx.spring_layout(G,k=5/math.sqrt(G.order()),pos=coord) # stable solution
    except:
        return None,None,None
        


        
    nx.draw(G, pos=coord, with_labels = True)




    #########################################################
    df_coord = pd.DataFrame.from_dict(coord,orient='index')
    df_coord.columns = ['x', 'y']
    df = pd.DataFrame(GG["nodes"])
    df.columns=['label']
    df['id'] = np.arange(df.shape[0])
    df = df[['id', 'label']]    
    out = pd.merge(df, df_coord, left_on='label', right_index=True)

    dict_nodes = out.T.to_dict().values()
    dfe = pd.DataFrame(GG["links"])[["source" , "target"]]

    res = dfe.set_index('source').join(out[['label','id']].set_index('label'), on='source', how='left')
    res.columns=['target', 'source_id']
    res2 = res.set_index('target').join(out[['label','id']].set_index('label'), on='target', how='left')
    res2.columns=['from','to']
    res2.reset_index(drop=True, inplace=True)
    dict_edges= res2.T.to_dict().values()


    if AnalisiFlag is not None:
        print (AnalisiFlag)
        if len(AnalisiFlag)==1: #just one connection
            Analisi=delete_link(G, G_ALL, AnalisiFlag[0]["to"], AnalisiFlag[0]["from"])
            new_dict = { "nodes": list(dict_nodes), "edges": list(dict_edges),"metriche":MetricG,"Analisi":Analisi}
        else:
            new_dict = { "nodes": list(dict_nodes), "edges": list(dict_edges),"metriche":MetricG}
            
    else:
        new_dict = { "nodes": list(dict_nodes), "edges": list(dict_edges),"metriche":MetricG}
	
    JSON=json.dumps(new_dict) 

    
    return coord,JSON,G

def jsonpos2coord(jsonpos):
    coord={}
    for id,x,y in pd.DataFrame.from_dict(jsonpos["nodes"]) [["label","x","y"]].values:

        coord[id]=np.array([x,y])
    return coord    



# CREA GRAFO IMPORT ALL
tabALL4graph=estrai_tabella_per_grafo(None,None,None,1,None,"VALUE_IN_EUROS",None,True)
_,_,G_ALL=makeGraph(tabALL4graph,None,False,1,None)
print (tabALL4graph.head())

print (len(json_graph.node_link_data(G_ALL)["nodes"]))




from flask import Flask,request,Response
from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources=r'/*')

###########GRAPH METHOD#######################################################
#@app.route('/wordtradegraph/<tg_period>/<tg_perc>/<listaMezzi>/<criterio>/<product>/<flow>')
#def wordtradegraph(tg_period,tg_perc,listaMezzi,criterio,product,flow):

        
@app.route('/wordtradegraph', methods=['POST','GET'])
def wordtradegraph():
    DS_COMEX=True
    if request.method == 'POST':
        
        print ("Word Trade Graph method get ....")
        criterio="VALUE_IN_EUROS" #VALUE_IN_EUROS 	QUANTITY_IN_KG

        jReq=dict(request.json)

        tg_perc=int(jReq['tg_perc'])
        tg_period=int(jReq['tg_period'])

        pos=jReq['pos']
        if pos=="None":
            pos=None
        else:
            print ("pos-----",pos)
            print ("pos-----",type(pos))
            
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
            print(selezioneMezziEdges)
            print(type(selezioneMezziEdges))
        #--------------------
        
        

        tab4graph=estrai_tabella_per_grafo(tg_period,tg_perc,listaMezzi,flow,product,criterio,selezioneMezziEdges,DS_COMEX)

        AnalisiFlag=selezioneMezziEdges ########################################
        
        pos,JSON,G=makeGraph(tab4graph,pos,weight_flag,flow,AnalisiFlag)

        if pos is None:
            if JSON is None:
                return "Graph empty \n Increase the treshold"
        
        resp = Response(response=JSON,
                    status=200,
                    mimetype="application/json")

        return resp

    else:
        return str("only post")

    
    
    
    
@app.route('/wordtradegraphplus', methods=['POST','GET'])
def wordtradegraphplus():
    DS_COMEX=False
    if request.method == 'POST':
        
        print ("Word Trade Graph method get ....")
        criterio="VALUE_IN_EUROS" #VALUE_IN_EUROS 	QUANTITY_IN_KG

        jReq=dict(request.json)

        tg_perc=int(jReq['tg_perc'])
        tg_period=int(jReq['tg_period'])

        pos=jReq['pos']
        if pos=="None":
            pos=None
        else:
            print ("pos-----",pos)
            print ("pos-----",type(pos))
            
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
            print(selezioneMezziEdges)
            print(type(selezioneMezziEdges))
        #--------------------
        
        

        tab4graph=estrai_tabella_per_grafo(tg_period,tg_perc,listaMezzi,flow,product,criterio,selezioneMezziEdges,DS_COMEX)

        AnalisiFlag=selezioneMezziEdges ########################################
        
        pos,JSON,G=makeGraph(tab4graph,pos,weight_flag,flow,AnalisiFlag)

        if pos is None:
            if JSON is None:
                return "Graph empty \n Increase the treshold"
        
        resp = Response(response=JSON,
                    status=200,
                    mimetype="application/json")

        return resp

    else:
        return str("only post")

    
    
    
    
    
    

@app.route('/hello')
def hello():
     return str(' world')
    
   
     
if __name__ == '__main__':
    IP='0.0.0.0'
    port=5500
    app.run(host=IP, port=port)
