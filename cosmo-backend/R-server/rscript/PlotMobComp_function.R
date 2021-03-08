PlotMobComp <- function(  region, subregion) {
  
  #### SE GMR ESISTE GIA' PERCHé abbiamo fatto operazioni precedenti con DB GIA' FILTRATO
  #### EVITARE RIGHE DA 4 A 15
  
  gmr<-subset(GMR,Country==region)
  gmr<-as.data.frame(gmr)
  gmr$Region<-ifelse(gmr$Region=="",region,gmr$Region)
  var<-c("Dates","Retail","Grocery_Pharmacy","Parks","Transit_Station","Workplaces","Residential")
  db_stat<-gmr[(gmr$Region==subregion),]
  db_stat<-db_stat[,4:10]
  db_stat[is.na(db_stat)]<-0
  colnames(db_stat)<-var

  dbr<-db_stat
  dbr[is.na(dbr)]<-0
  
  for (i in 2:7)
  {
    a<-dbr[,1]
    b<-dbr[,i]
    c<-data.frame(a,b)
    a<-c[,1]
    b<-c[,2]
    #print("i")
    #print(i)
    #print("a")
    #print(a)
    #print("b")
    #print(b)
    smoothingSpline = smooth.spline(a,b, spar=0.35)
    
    df = data.frame(a,b,smoothingSpline$y)
    names(df) <- c('Date', 'Values', 'Smooth')
    assign(paste('comp',(i-1),sep=""),df)
    
    rm(df)
    rm(smoothingSpline)
    #print(i)
  }
  
  reslist <-list("Retail"=comp1,"Grocery_Pharmacy"=comp2,
                 "Parks"=comp3,"Transit_Station"=comp4,
                 "Workplaces"=comp5,"Residential"=comp6)
  return(reslist)
  
  rm(dbr)
 
}