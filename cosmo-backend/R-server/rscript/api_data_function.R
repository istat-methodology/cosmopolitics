
data_function<-function(flow,var_cpa,country_code,partner_code,dataType,tipo_var){
  
   if (flow==1) {
     dati <- COMEXT_IMP
   } else if (flow==2) {
     dati <- COMEXT_EXP
   }

  # utente seleziona un paese UE
  dati <- dati[which(dati$DECLARANT_ISO==country_code),]
  
  #utente seleziona un partner mondiale
  dati <- dati[which(dati$PARTNER_ISO==partner_code),]
  
  #seleziono la cpa
  dati <- dati[which(dati$cpa==var_cpa),]
  
  if (tipo_var==1) {
    dati <- dati[,c(5:6)]
  } else if (tipo_var==2) {
    dati <- dati[,c(5,7)]
  }
  colnames(dati)<-c("PERIOD","series")
  #tolgo le colonne che non servono alle successive elaborazioni
  
  
  #metto le date nel formato per l'ordinamento
  dati$year<-substring(dati$PERIOD,1,4)
  dati$month<-str_sub(dati$PERIOD,-2)
  dati$month<-as.numeric(dati$month)
  dati$year<-as.numeric(dati$year)
  dati$series<-as.numeric(dati$series)
  
  gc()
  
  #ordino il dataset
  dati<-dati[order(dati$year,dati$month),]
  
  #creo le date nel formato per l'output
  strdate = paste("01",paste(dati$month[1],dati$year[1],sep="/"),sep="/")
  enddate = paste("01",paste(dati$month[length(dati$month)],dati$year[length(dati$year)],sep="/"),sep="/")
  
  date = seq.Date(from =as.Date(strdate, "%d/%m/%Y"),
                  to=as.Date(enddate, "%d/%m/%Y"),by="month")
  dati$date <- date
  dati<-dati[,c("date","series")]
  
  #lunghezza db
  l<-length(dati$series)
  
  #### calcolo i tendenziali 1='Yearly variation series', "2=Raw data series"
if (dataType==1) {
  
  dati$tend<-dati$series
    for (i in 13:l)
  {
    dati$tend[i]<-dati$series[i]-dati$series[i-12]
  }
  dati$tend[c(1:12)]<-NA
  dati$series<-as.numeric(dati$tend)
  dati<-dati[,c(1,2)]
  
}

  gc()
  
  return(dati)
  
}
