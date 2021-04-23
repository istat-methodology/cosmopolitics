
data_function<-function(flow,var_bec,country_code,partner_code){
  
   if (flow==1) {
     dati <- COMEXT_IMP
   } else if (flow==2) {
     dati <- COMEXT_EXP
   }

  dati<-dati[,-1]
  # seleziono un country
  dati <- dati[which(dati$country==country_code),]
  dati$PARTNER<-ifelse(dati$PARTNER=="WORLD","WO",dati$PARTNER)
  
  #seleziono un partner
  dati <- dati[which(dati$PARTNER==partner_code),]
  
  #seleziono la bec
  dati <- dati[which(dati$bec==var_bec),]
  dati<-dati[order(dati$year,dati$month),]
  
  strdate = paste("01",paste(dati$month[1],min(dati$year),sep="/"),sep="/")
  enddate = paste("01",paste(dati$month[length(dati$month)],max(dati$year),sep="/"),sep="/")
  date = seq.Date(from =as.Date(strdate, "%d/%m/%Y"),
                  to=as.Date(enddate, "%d/%m/%Y"),by="month")

  
  dati$date <- date
  dati <- dati[,c(4:7)]



  #rm(a1)
  gc()

  return(dati)
  
}

data_function_bec<-function(flow,country_code,partner_code){
  
  if (flow==1) {
    db <- COMEXT_IMP
  } else if (flow==2) {
    db <- COMEXT_EXP
  }
  
  db<-db[,-1]
  db<-as.data.frame(db)
  
  #seleziono paese
  db <- db[which(db$country==country_code),]
  db$PARTNER<-ifelse(db$PARTNER=="WORLD","WO",db$PARTNER)

  #selezione un partner
  db <- db[which(db$PARTNER==partner_code),]

  for (i in 1:7)
  {
    var_bec=i
  d<- db[which(db$bec==var_bec),]

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
  
  }

  rm(db)
  gc()
  res<-list(d1,d2,d3,d4,d5,d6,d7)
  return(res)

}


lastdate<-function(){
  
  l_date<-ls()
  l_date<-POLIND_DB$Date[length(POLIND_DB$Date)]
  return(l_date)
  
}