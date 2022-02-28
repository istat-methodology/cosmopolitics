
data_function<-function(flow,var_cpa,country_code,partner_code,dataType,tipo_var){
  
   if (flow==1) {
     dati <- COMEXT_IMP
   } else if (flow==2) {
     dati <- COMEXT_EXP
   }

  # utente seleziona un paese UE,partner mondiale,cpa
  dati <- subset(dati , DECLARANT_ISO==country_code 
                 & PARTNER_ISO==partner_code
                 & cpa==var_cpa)
  
  #utente seleziona se dati in valore o quantità
  if (tipo_var==1) {
    dati <- dati[,c(5:6)]   #dati in valore
  } else if (tipo_var==2) {
    dati <- dati[,c(5,7)]   #dati in qta
  }
  colnames(dati)<-c("PERIOD","series")
  
  if (length(dati$series)>0) {
  
  #metto le date nel formato per l'ordinamento
  dati$year<-substring(dati$PERIOD,1,4)
  dati$month<-str_sub(dati$PERIOD,-2)
  dati$month<-as.numeric(dati$month)
  dati$year<-as.numeric(dati$year)
  dati$series<-as.numeric(dati$series)
  
  gc()
  
  #ordino il dataset
  dati<-dati[order(dati$year,dati$month),]
  
  date<-paste(dati$year,dati$month,"01",sep="-")
  date<-as.Date(date)
  dati$date <- date
  
  gc()
  
  #creo le date per il confronto
  strdate = paste("01",paste(dati$month[1],dati$year[1],sep="/"),sep="/")
  enddate = paste("01",paste(dati$month[length(dati$month)],dati$year[length(dati$year)],sep="/"),sep="/")
  
  date_full = seq.Date(from =as.Date(strdate, "%d/%m/%Y"),
                       to=as.Date(enddate, "%d/%m/%Y"),by="month")
  
  #selezione sono le colonne necessarie
  dati<-dati[,c("date","series")]
  
  #confronto per mesi missing
  if (length(date)<length(date_full)) {
    db_full<-as.data.frame(date_full)
    colnames(db_full)<-c("date")
    dati <- dati %>% full_join(db_full)
  }
  
  #ordino il dataset
  dati<-dati[order(dati$date),]
  
  #lunghezza db
  l<-length(dati$series)
  
  #### calcolo i tendenziali 1='Yearly variation series', "2=Raw data series"
  if (dataType==1) {
    
    dati$tend<-dati$series
    for (i in 13:l)
    {
      dati$tend[i]<-dati$series[i]-dati$series[i-12]
    }
    #dati$tend[c(1:12)]<-NA
    dati$series<-as.numeric(dati$tend)
    dati<-dati[c(13:l),c(1,2)]
    
  }
  }
  return(dati)
  
}
