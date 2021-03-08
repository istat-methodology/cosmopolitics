################################################
#grafici serie tendenziali e serie originale

sa<-function(flow,VAR,country,partner,year,month){
  
  #decido anno e mese di trattamento (123 = MARZO 2020)
  #year  = 2020 
  #month = 3    # marzo
   #print("----------------------------------PIPPO ----------------- ")

  dati<-data_function(flow,VAR,country,partner)
  dati<-dati[order(dati$year,dati$month),]

  treat <- which(dati$year == as.numeric(year))[[1]] +as.numeric(month) - 1
 
  ################################################################
  strdate = paste("01",paste(dati$month[1],dati$year[1],sep="/"),sep="/")
  enddate = paste("01",paste(dati$month[length(dati$month)],dati$year[length(dati$year)],sep="/"),sep="/")
  
  date = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
                  to=as.Date(enddate, "%d/%m/%Y"),by="month")
  
  #lunghezza db
  l<-length(dati$VAR)
  
#### calcolo i tendenziali
dati$tend<-dati$VAR
for (i in 13:l)
{
  dati$tend[i]<-dati$VAR[i]-dati$VAR[i-12]
}
dati$tend[c(1:12)]<-NA

dfor   <- data.frame(date,dati$VAR)
names(dfor) <- c('Date','Line')
dftend <- data.frame(date,dati$tend)
names(dftend) <- c('Date','Scatter_Line')


reslist <-list("Raw_Series"=dfor,"Yearly_Variation"=dftend)



return(reslist)
}