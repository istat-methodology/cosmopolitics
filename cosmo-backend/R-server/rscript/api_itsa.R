######### ITSA ################################
# modello base y=t+d+td con dati tendenziali e 1 lag
# modello y=t+d+td+polind+tpolind con dati tendenziali e 1 lag
####GRAFICI PER TIMELAPSE
###############################################

itsa_diag <- function(flow,VAR,country,partner,fcst,fcstpolind ){
  
  #decido anno e mese di trattamento (123 = MARZO 2020)
  year  = 2020 
  month = 3    # marzo
  djsonfcst<-NA
  dati<-data_function(flow,VAR,country,partner)
  dati<-dati[order(dati$year,dati$month),]
  
  region = country
  subregion = country
  
  treat <- which(dati$year == as.numeric(year))[[1]] + as.numeric(month) - 1
  
  #lunghezza db
  l<-length(dati$VAR)
  ################################################################
  
  
  #CARICO I DATI DEL POLICY INDICATOR
  
  #GMR <- read.csv(paste(basedir, "DB_GoogleMobility.csv", sep='/'),row.names=1)
  gmr<-subset(GMR,Country_Code=country)
  gmr<-as.data.frame(gmr)
  gmr$Region<-ifelse(gmr$Region=="",region,gmr$Region)
  var<-c("Dates","Retail","Grocery_Pharmacy","Parks","Transit_Station","Workplaces","Residential")
  db_stat<-gmr[(gmr$Region==subregion),]
  db_stat<-db_stat[,4:10]
  db_stat[is.na(db_stat)]<-0
  colnames(db_stat)<-var        
  
  
  ######### BARBARA  ####################
  PCAest <-prcomp(db_stat[,c(2:7)],scale=TRUE)
  
  PC1 <- PCAest$x[,'PC1']
  
  dates <- db_stat[,1];
  
  #dev.new()
  #plot(dates,PC1,type="h",ylim=c((min(PC1,na.rm=TRUE)),(max(PC1,na.rm=TRUE))),xlab="",ylab="Policy Indicator -PC1")
  
  minI = min(PC1);
  maxI = max(PC1);
  
  PolInd = (PC1-minI)/(maxI-minI)
  
  db_stat$PolInd <- PolInd
  
 
  x <- as.POSIXct(db_stat$Dates,format="%Y-%m-%d")
  mo <- strftime(x, "%m")
  yr <- strftime(x, "%Y")
  PolInd_M <- db_stat$PolInd
  dd <- data.frame(mo, yr, PolInd_M)
  dfM <- aggregate(PolInd_M ~ mo + yr, dd, FUN = mean)
  strdate = paste("01",paste(dfM$mo[1],dfM$yr[1],sep="/"),sep="/")
  enddate = paste("01",paste(dfM$mo[length(dfM$mo)],dfM$yr[length(dfM$yr)],sep="/"),sep="/")
  DatePolindM = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
                         to=as.Date(enddate, "%d/%m/%Y"),by="month")
  
  dfM$Date <- DatePolindM
  rm(strdate,enddate,DatePolindM)
  gc()
  #polind ha dati piu recenti, 
  #lo allineo e aggiungo al tempo del dataset dati
  
  
  #strdate = paste("01",paste(db$month[1],db$year[1],sep="/"),sep="/")
  #enddate = paste("01",paste(db$month[length(db$month)],db$year[length(db$year)],sep="/"),sep="/")
  
  #date = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
  #                to=as.Date(enddate, "%d/%m/%Y"),by="month")
  
  
  # verificare bene dftime e sostituire con vettore di date
  #dfM$time<-c((treat-1):((treat-2)+length(dfM$PolInd_M)))
  
  #rm(strdate,enddate,DatePolindM)
  
  #dfMest<-dfM[which(dfM$time<=l),]
  #dati$polind<-c(rep(0,(l-length(dfM$PolInd_M))),dfM$PolInd_M)
  #dati$polind[c(1:12)]<-NA
  
  polind<-c(rep(0,(which(dati$date == dfM$Date[1]))),dfM$PolInd_M)
  
  
  #### calcolo i valori della serie tendenziale
  
  dati$tend<-dati$VAR
  for (i in 13:l)
  {
    dati$tend[i]<-dati$VAR[i]-dati$VAR[i-12]
  }
  dati$tend[c(1:12)]<-NA
  dati$polind <- polind[1:l]
  
  
  ndate         <- which(dfM$Date == dati$date[length(dati$date)])
  ncdate        <- dfM$Date[(ndate):length(dfM$Date)]
  nwcst         <- data.frame(ncdate)
  nwcst$polind  <- polind[(l+1):length(polind)]
  
  #creo trend lineare che inizia con zero e arriva a t-1, partendo dalla 13a osservazione
  dati$t<-NA
  dati$t[13:l]<-c(0:(l-13))
  
  #creo dummy trattamento partendo dalla 13a
  #slittando treat di 12 osservazioni meno 1 per tenere conto del lag
  dati$d<-c(rep(NA,12),c(rep(0,(l-12))))
  dati$d<-ifelse(dati$t>=treat-13,1,0)
  
  #interazioni
  dati$td<-c(rep(0,treat),c(1:(l-treat)))
  dati$td[c(1:12)]<-NA
  dati$tpolind<-dati$td*dati$polind
  dati$tpolind[c(1:12)]<-NA
  
  ############# GRAFICO STATICO EFFETTO GENERALE ED EFFETTO POLICY INDICATOR
  
  #modellI itsa  con e senza polind
  #lm_tend<-lm(tend~t+d+td,data=dati)
  #summary(lm_tend)
  #lm_tend_tp<-lm(tend~t+d+td+polind+tpolind,data=dati)
  #lm_tend_tp<-lm(tend~t+d+td+polind,data=dati)
  #summary(lm_tend_tp)
  
  #correggo standard error per autocorrelazione a un lag
  #lm_tend_corr<-coeftest(lm_tend,vcov=NeweyWest(lm_tend,lag = 1, prewhite = 0, adjust = TRUE, verbose=T))
  #lm_tend_corr
  #lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, verbose=T))
  #lm_tend_tp_corr
  
  #################################################################à
  ####### script per grafici timelapse
  ## più tabella risultati stima effetti
  # più tabella risultati coefficienti dei modelli (no output, serve a noi)
  
  #numero di grafici=mesi post trattamento
  
  n<-l-treat
  #dev.off()
  #dev.new()
  #par(mar = rep(2, 4))
  #par(mfrow=c(4,2))
  
  
  ris<-list()

  for (i in 1:n)
  {
    dd<-subset(dati,select=c(t,d,td,tend,polind,tpolind,date))
    h<-treat+i
    d<-dd[c(1:h),]
    a<-c(1:h)
    b<-d[,4]
    c<-data.frame(a,b)
    a<-c[,1]
    b<-c[,2]
    
    
    #lm_tend_tp<-lm(tend~t+d+td+polind+tpolind,data=d)
    # Provo ad eliminare td
    lm_tend_tp<-lm(tend~t+d+polind,data=d)
    
    
    #lm_tend<-lm(tend~t+d+td,data=d)
    
    lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, verbose=T))
    
    pred_tp <- predict(lm_tend_tp,type="response",d)
    d$pred_tp<-pred_tp
    
    #plot(a,b,type="n",ylab=flow, xlab="Time", xlim = c(l-50,l),
    #     main = paste(country,"-",partner,"@ T +",i,";",VAR,"(mln. euro)",sep =" "))
    #points(b,cex=1.5, col=35)
    #abline(v=treat-1, lty=3)
    #lines(pred_tp,col=2)
    
    
    
    
    # generate predictions under the counterfactual scenario and add it to the plot
    d$d<-0
    d$t<-c(1:h)
    d$td<-0
    d$polind<-0
    d$tpolind<-0
    pred_tp_c<- predict(lm_tend_tp,d,type="response")
    d$pred_tp_c<-pred_tp_c
    #lines(d$t,pred_tp_c,col=2,lty=2)
    
    ## stats
    yearly_var<-round(dd$tend[h],3)
    month_eff<-round(d$pred_tp[h]-d$pred_tp_c[h],3)
    ris[[i]]<-data.frame(yearly_var,month_eff)
    #print(i)
  
    
    assign(paste0("djson",i),d[,c(7,4,8,9)]) 

  }
  
 
  stats_tpolind <-do.call("rbind", ris)
  stats_tpolind<-t(stats_tpolind)
  
  cum_month_eff<-c(stats_tpolind[2,1],rep(0,n-1))
  cumul<-stats_tpolind[2,1]
  for (i in 2:n)
  {
    cum_month_eff[i]<-stats_tpolind[2,i]+cumul
    cumul<-cum_month_eff[i]
  }
  stats_tpolind<-rbind(stats_tpolind,cum_month_eff)
  #stats_tpolind<-rbind(stats_tpolind)
  
  var<-c("Yearly variation","Monthly Covid effect","Cumulative Covid effect")
  rownames(stats_tpolind)<-var
  colnames(stats_tpolind)<-paste("T",1:n,sep="")
  #View(stats_tpolind)
  
  rm(a,b)
  gc()
  
  
  
  # Mettere qui la funzione di nowcasting
  if (fcst==1) {
    
    d1<-subset(dati,select=c(t,d,tend,polind,date))
    nobs          = length(nwcst$polind)
    
    strdate = d1$date[length(d1$date)]
    ndate = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
                    length.out = nobs,by="month")
    
    
    seqnwcst      = seq(1,nobs,1)
    nwcst$t      = dati$t[length(dati$t)]+seqnwcst
    
    nwcst$d       = rep(1,nobs)
    
    #nwcst$tend = rep(NA,nobs)
    basetend = dati$tend[(length(dati$tend)-12):length(dati$tend)]
    ncstend = rep(NA,nobs)
    
    for (i in 1:nobs)
    {
      ncstend[i] = mean(basetend)
      basetend    = append(basetend[(i+1):(length(basetend))],ncstend[i])
      
    }
    nwcst$tend = ncstend
    
    #nwcst <- subset(nwcst,select=c(t,d,td,tend,polind,tpolind))
    #nwcst <- subset(nwcst,select=c(t,d,tend,polind))
    
    nwcst$date <- ndate
    nwcst <- nwcst[,c(-1)]
    d1 <- rbind(d1,nwcst)
    
    # Nowcast
    #lm_tend_tp<-lm(tend~t+d+td+polind+tpolind,data=d1)
    
    lm_tend_tp<-lm(tend~t+d+polind,data=d1)
    
    #lm_tend<-lm(tend~t+d+td,data=d)
    lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, verbose=T))
    d1$nowcast  <- predict(lm_tend_tp,type="response",d1)
    
    djsonfcst    <- as.data.frame(d1[,c(5,3,6)])
    
    #nowcast<-predict(lm_tend_tp,newdata=nwcst,se.fit=TRUE)
    #nowcast<- predict(lm_tend_tp,newdata=nwcst,type="response")
    
    # SECONDO TE PUO' AVERE SENSO QUESTA DISTRIBUZIONE FUTURA!! NOWCASTING?
    
  } else if (fcst==2)
  {
    # Import Esterno
    fcstpolind <-as.numeric(unlist(strsplit(fcstpolind,",")))
    
    d2<-subset(dati,select=c(t,d,tend,polind,date))
    nobsf      = length(nwcst$polind) + length(fcstpolind)
    
    strdate = d2$date[length(d2$date)]
    fdate = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
                     length.out = nobsf,by="month")
    
    #strdate = paste("01",paste(db$month[1],db$year[1],sep="/"),sep="/")
    #fdate = seq.Date(from =as.Date(dfM$Date[(ndate+1)], "%d/%m/%Y"),length.out=nobsf,by="month")
    fcst         <- data.frame(fdate)
    fcst$polind  <- c(nwcst$polind,fcstpolind)
    
    fcst$d       = rep(1,nobsf)
    seqfcst      = seq(1,nobsf,1)
    fcst$t       = dati$t[length(dati$t)]+seqfcst
    #fcst$td      = fcst$t*fcst$d
    #fcst$tpolind = fcst$polind*fcst$t
    
    basetend = dati$tend[(length(dati$tend)-12):length(dati$tend)]
    fcstend = rep(NA,nobsf)
    
    for (i in 1:nobsf)
    {
      fcstend[i] = mean(basetend)
      basetend    = append(basetend[(i+1):(length(basetend))],fcstend[i])
      
    }
    fcst$tend = fcstend
    
    fcst <- subset(fcst,select=c(t,d,tend,polind))
    
    fcst$date <- fdate
    
    d2 <- rbind(d2,fcst)
    
    d2$forecast  <- predict(lm_tend_tp,type="response",d2)
    # Mettere qui funzione di fcst ma chiedere parametri futuri
    # L'utente deve inserire i parametri futuri oppure vanno tutti 
    # zero ed 1 dobbiamo farlo costruire esternamente
    djsonfcst    <- as.data.frame(d2[,c(5,3,6)])
    
  }
  
  
  #################################################
    # beta del modello
    beta_tpolind<-list()
    
    lm_tend_tp<-lm(tend~t+d+polind,data=dati)
    #lm_tend_tp<-lm(tend~t+d+td+polind+tpolind,data=dati)
    lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, 
                                                        verbose=T))
    #lm_tend_corr
    
    beta_tpolind[[1]]<-lm_tend_tp_corr
    beta_tpolind <-do.call("rbind", beta_tpolind)
    beta_tpolind[,4]<-round(beta_tpolind[,4],digits = 3)
    
    #View(beta_tpolind)
    
    
    ###############################################################
    #diagnostica
    dati$t <- as.numeric(dati$t)
    a<-itsa.model(data=dati, time="t", depvar="tend", interrupt_var = "d", covariates ="polind",
                  alpha=0.05, no.plots = TRUE)
    
    # vedere questo errore
    b<-itsa.postest(model = a, alpha = 0.05,print = FALSE,no.plots=TRUE)
    
   # Estimated Model Results
   regmod <- as.data.frame(beta_tpolind)
   rownames(regmod)[rownames(regmod) == "t"] <- "trend"
   rownames(regmod)[rownames(regmod) == "d"] <- "Covid Dummy"
   rownames(regmod)[rownames(regmod) == "polind"] <- "Mobility Policy Indicator"
   
   regmod<-cbind( "row"=rownames(regmod),regmod)
   colnames(regmod)<-c("row","estimate", "std_error", "t_value","pr_t")
   
   # Covid Effect (mln. of Euro)
   coveff <- as.data.frame(stats_tpolind)
   names(coveff)[names(coveff) == "T1"] <- "Mar_2020"
   names(coveff)[names(coveff) == "T2"] <- "Apr_2020"
   names(coveff)[names(coveff) == "T3"] <- "May_2020"
   names(coveff)[names(coveff) == "T4"] <- "Jun_2020"
   names(coveff)[names(coveff) == "T5"] <- "Jul_2020"
   names(coveff)[names(coveff) == "T6"] <- "Aug_2020"
   names(coveff)[names(coveff) == "T7"] <- "Sep_2020"
   names(coveff)[names(coveff) == "T8"] <- "Opt_2020"
   names(coveff)[names(coveff) == "T9"] <- "Nov_2020"
   
   coveff<-cbind( "row"=rownames(coveff),coveff)

   reslist <-list("Model"=regmod,"Covid_Estimation"=coveff,
                  "T1"=djson1,"T2"=djson2,"T3"=djson3,"T4"=djson4,"T5"=djson5,
                  "T6"=djson6,"T7"=djson7,"T8"=djson8,"T9"=djson9,"Forecast"=djsonfcst)
   
   #rm(ris)
  return(reslist)    
  #### OUTPUT BETA-POLIND STATS_TPOLIND DATI PER GRAFICO DINAMICO
  
}










