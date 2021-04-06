create_aggr <- function(){
  
  for (flow in 1:2) {
  if (flow==1) {
    db <- fread(paste(basedirData,"imp.csv",sep="/"))
  } else if (flow==2) {
    db <- fread(paste(basedirData,"exp.csv",sep="/"))
  } 
  
  
  db<-as.data.frame(db)
  colnames(db)[1] <- "country_sh"
  colnames(db)[5] <- "bec3"
  colnames(db)[13] <- "VAR"
  
  
  
  db$year<-substring(db$PERIOD,1,4)
  db$month<-substring(db$PERIOD_LAB,1,3)
  db$month<-ifelse(db$month=="Jan",1,
                   ifelse(db$month=="Feb",2,
                          ifelse(db$month=="Mar",3,
                                 ifelse(db$month=="Apr",4,
                                        ifelse(db$month=="May",5,
                                               ifelse(db$month=="Jun",6,
                                                      ifelse(db$month=="Jul",7,
                                                             ifelse(db$month=="Aug",8,
                                                                    ifelse(db$month=="Sep",9,
                                                                           ifelse(db$month=="Oct",10,
                                                                                  ifelse(db$month=="Nov",11,12)))))))))))
  db$month<-as.numeric(db$month)
  db$year<-as.numeric(db$year)
  
  gc()
  
  
  #aggrego BEC alla prima cifra
  db$bec<-substring(db$bec3,1,1)
  db <- db[which(db$bec!=7),]
  db <- db[which(db$bec!="X"),]
  db$bec<-ifelse(db$bec=="T",7,db$bec)
  db$bec<-as.numeric(db$bec)
  db$VAR<-as.numeric(db$VAR)
  
  #ordino il dataset,divido per un milione 
  #rimuovo i dataframe di appoggio
  db<-db[order(db$year,db$month),]
  db$VAR <- db$VAR/1000000
  
  #a1 <- a1[which(a1$bec==VAR),]
  dati<-aggregate(db$VAR, by=list(db$country_sh,db$PARTNER,db$bec,db$year,db$month), FUN=sum)
  colnames(dati)<-c("country","PARTNER","bec","year","month","VAR")
  
  if (flow == 1) {
    write.csv(dati,paste(basedirData,"\\COMEXT_IMP.csv",sep="/"))
  } else if (flow==2){
    write.csv(dati,paste(basedirData,"\\COMEXT_EXP.csv",sep="/"))
  }
  gc()
  }
  return("files create ok")
}
