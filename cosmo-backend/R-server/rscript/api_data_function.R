
data_function<-function(flow,VAR,country,partner){
  #print("----------------------------------PIPPO 2 ----------------- ")
  #print(db)
  
   if (flow==1) {
     db <- COMEXT_IMP
   } else if (flow==2) {
     db <- COMEXT_EXP
   }  
   
  ##########################################.
  #operazioni preliminari sui dati
  # subset per paese e partner
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
  
  a1 <- db[which(db$country_sh==country),]
  a1$PARTNER<-ifelse(a1$PARTNER=="WORLD","WO",a1$PARTNER)
  
  #se voglio selezionare un solo partner
  a1 <- a1[which(a1$PARTNER==partner),]
  
  #aggrego BEC alla prima cifra
  a1$bec<-substring(a1$bec3,1,1)
  a1 <- a1[which(a1$bec!=7),]
  a1 <- a1[which(a1$bec!="X"),]
  a1$bec<-ifelse(a1$bec=="T",7,a1$bec)
  a1$bec<-as.numeric(a1$bec)
  a1$VAR<-as.numeric(a1$VAR)
  
  #ordino il dataset,divido per un milione 
  #rimuovo i dataframe di appoggio
  a1<-a1[order(a1$year,a1$month),]
  a1$VAR <- a1$VAR/1000000
  
  a1 <- a1[which(a1$bec==VAR),]
  dati<-aggregate(a1$VAR, by=list(a1$bec,a1$year,a1$month), FUN=sum)
  colnames(dati)<-c("bec","year","month","VAR")
  
  
  
  strdate = paste("01",paste(a1$month[1],min(a1$year),sep="/"),sep="/")
  enddate = paste("01",paste(a1$month[length(a1$month)],max(a1$year),sep="/"),sep="/")
  date = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
                  to=as.Date(enddate, "%d/%m/%Y"),by="month")
  
  dati<-dati[order(dati$year,dati$month),]
  dati$date <- date
  dati <- dati[,c(5,4,2,3)]
  
  
  
  rm(a1)
  gc()
  
  return(dati)
  
}

data_function_bec<-function(flow,country,partner){
  #print("----------------------------------PIPPO 2 ----------------- ")
  #print(db)
  
  if (flow==1) {
    db <- COMEXT_IMP
  } else if (flow==2) {
    db <- COMEXT_EXP
  }  
  
  ##########################################.
  #operazioni preliminari sui dati
  # subset per paese e partner
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
  
  a1 <- db[which(db$country_sh==country),]
  a1$PARTNER<-ifelse(a1$PARTNER=="WORLD","WO",a1$PARTNER)
  
  #se voglio selezionare un solo partner
  a1 <- a1[which(a1$PARTNER==partner),]
  
  #aggrego BEC alla prima cifra
  a1$bec<-substring(a1$bec3,1,1)
  a1 <- a1[which(a1$bec!=7),]
  a1 <- a1[which(a1$bec!="X"),]
  a1$bec<-ifelse(a1$bec=="T",7,a1$bec)
  a1$bec<-as.numeric(a1$bec)
  a1$VAR<-as.numeric(a1$VAR)
  
  #ordino il dataset,divido per un milione 
  #rimuovo i dataframe di appoggio
  a1<-a1[order(a1$year,a1$month),]
  a1$VAR <- a1$VAR/1000000
  

  
  for (i in 1:7)
  {
    VAR=i
  d<- a1[which(a1$bec==VAR),]
  
  d<-aggregate(d$VAR, by=list(d$bec,d$year,d$month), FUN=sum)
  
  colnames(d)<-c("BEC","year","month","VAR")
  strdate = paste("01",paste(d$month[1],min(d$year),sep="/"),sep="/")
  enddate = paste("01",paste(d$month[length(d$month)],max(d$year),sep="/"),sep="/")
  date = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
                  to=as.Date(enddate, "%d/%m/%Y"),by="month")
  
  d<-d[order(d$year,d$month),]
  d$date <- date
  d <- d[,c(5,4,2,3)]
 
  
 
  assign(paste0("d",i),d) 
  rm(d)
  rm(VAR)
  }
 
  rm(a1)
  gc()
  res<-list(d1,d2,d3,d4,d5,d6,d7)
  return(res)
  
}