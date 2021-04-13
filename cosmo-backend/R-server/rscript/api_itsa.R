######### ITSA ################################
# modello y=t+d+polind con dati tendenziali e 1 lag
# 1. Interrupted time series analysis per calcolo dell'effetto del covid-19 su export/import (mln. euro)
# 2. Tabella e grafici diagnostica del modello
# 3. Nowcast con utilizzo dei dati del policy indicator
# 4. Forecast con livello di restrizioni decise dall'utente
###############################################

itsa_diag <- function(flow,var_bec,country_code,partner_code,fcst,fcstpolind){
  
  #creo lista dei risultati per il return
  reslist<-list()
  
  #decido anno e mese di trattamento (123 = MARZO 2020)
  year  = 2020 
  month = 2    # FEBBRAIO

  #carico il dataset 
  dati<-data_function(flow,var_bec,country_code,partner_code)
  #dati<-dati[order(dati$year,dati$month),]
  
  treat <- which(dati$year == as.numeric(year))[[1]] + as.numeric(month) - 1
  reslist[["Treat_number"]]<-treat
  
  region = country_code
  subregion = country_code
  
  #lunghezza db
  l<-length(dati$VAR)
  ################################################################
  # richiamo i policy indicator
  col_polind<-POLIND_DB %>% select(starts_with(country_code))
  col_polind<-as_vector(col_polind)
  polind<-c(rep(0,(which(dati$date == POLIND_DB$Date[1]))),col_polind)
  
  
  #### calcolo i valori della serie tendenziale
  
  dati$tend<-dati$VAR
  for (i in 13:l)
  {
    dati$tend[i]<-dati$VAR[i]-dati$VAR[i-12]
  }
  dati$tend[c(1:12)]<-NA
  dati$polind <- polind[1:l]
  
  #imposta date per nowcast successivo
  ndate         <- which(POLIND_DB$Date == dati$date[length(dati$date)])
  ndate         <- ndate+1
  ncdate        <- POLIND_DB$Date[(ndate):length(POLIND_DB$Date)]
  nwcst         <- data.frame(ncdate)
  nwcst$polind  <- polind[(l+2):length(polind)]
  
##############################################
# INTERRUPTED TIME SERIES ANALYSIS
##############################################  
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
  
  n<-l-treat
 
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
    
    lm_tend_tp<-lm(tend~t+d+polind,data=d)
    
    lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, verbose=T))
    
    pred_tp <- predict(lm_tend_tp,type="response",d)
    d$pred_tp<-pred_tp
    
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
  
    reslist[[paste0("T",i)]]<-assign(paste0("djson",i),d[,c(7,4,8,9)])
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
  
  #rm(a,b)
  gc()

########################## Tabella covid effect
  # Covid Effect (mln. of Euro)
  coveff <- as.data.frame(stats_tpolind)
  reslist[["Covid_Estimation"]]<-coveff
  
  
###############################################################
#DIAGNOSTICA DEL MODELLO
#################################################
########################## tabella parametri modello e test
  beta_tpolind<-list()
  
  lm_tend_tp<-lm(tend~t+d+polind,data=dati)
  #lm_tend_tp<-lm(tend~t+d+td+polind+tpolind,data=dati)
  lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, 
                                                      verbose=T))
  
  beta_tpolind[[1]]<-lm_tend_tp_corr
  beta_tpolind <-do.call("rbind", beta_tpolind)
  beta_tpolind[,4]<-round(beta_tpolind[,4],digits = 3)
  
  #View(beta_tpolind)
  
  regmod <- as.data.frame(beta_tpolind)
  rownames(regmod)[rownames(regmod) == "t"] <- "Trend"
  rownames(regmod)[rownames(regmod) == "d"] <- "Covid Dummy"
  rownames(regmod)[rownames(regmod) == "polind"] <- "Mobility Policy Indicator"
  
  regmod<-cbind( "row"=rownames(regmod),regmod)
  colnames(regmod)<-c("row","estimate", "std_error", "t_value","pr_t")
  
  reslist[["Model"]]<-regmod
  
  ####################################################grafico residui
  res <- residuals(lm_tend_tp,type="response",dati)
  res_date<-dati$date[c(13:l)]
  res_line<-c(rep(0,length(res)))
  residual <- data.frame(res_date,res,res_line)
  
  reslist[["DIAG_RES"]]<-residual
 
  ############################grafico acf
  acf_list<-list()
  acf<-acf(dati$tend[c(13:l)],plot = FALSE)
  acf_list[["y_points"]]<-as.vector(acf[["acf"]])
  acf_list[["x_points"]]<-as.vector(acf[["lag"]])
  
  conf_int_pos<-qnorm((1 + 0.95)/2)/sqrt(l-13)
  acf_list[["yline_conf_int_pos"]]<- conf_int_pos
  acf_list[["yline_conf_int_neg"]]<- -conf_int_pos

  reslist[["DIAG_ACF"]]<-acf_list
  
  ##############################grafico qq_norm
  a<-qqnorm(dati$tend[c(13:l)], pch = 1, frame = FALSE, plot.it = FALSE)
  point_x<-a[[1]]
  point_y<-a[[2]]
  #qqline(dati$tend[c(13:l)], lwd = 2)
  # Find 1st and 3rd quartile for the Alto 1 data
  y <- quantile(dati$tend[c(13:l)], c(0.25, 0.75), type = 5)
  # Find the 1st and 3rd quartile of the normal distribution
  x <- qnorm( c(0.25, 0.75))
  # Now we can compute the intercept and slope of the line that passes through these points/
  slope <- diff(y) / diff(x)
  int   <- y[1] - slope * x[1]
  #abline(a = int, b = slope )
  line_y<-int+(slope*point_x)
  #plot(point_x,qq)
  normal <- data.frame(point_x,point_y,line_y)

  reslist[["DIAG_NORM"]]<-normal

  
##############################################à
########################## NOWCAST
  
  if (fcst==1) {
    
    d1<-subset(dati,select=c(t,d,tend,polind,date))
    nobs          = length(nwcst$polind)
    
    strdate = ncdate[1]
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
    
    nwcst$date <- ndate
    nwcst <- nwcst[,c(-1)]
    d1 <- rbind(d1,nwcst)
    
    lm_tend_tp<-lm(tend~t+d+polind,data=d1)
    
    lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, verbose=T))
    d1$nowcast  <- predict(lm_tend_tp,type="response",d1)
    
    ##########   aggiungo stima pred_tp_c
    
    trend<-c(1:(length(pred_tp_c)))
    beta<-lm(pred_tp_c~trend)
    coef<-beta$coefficients[2]
    c_new<-c(1:nobs)
    for (i in 1:nobs) {
      c_new[i]<-pred_tp_c[length(pred_tp_c)]+(coef*i)
    }
    d1$pred_tp_c<-c(pred_tp_c,c_new)
    
    #################
    colnames(d1)[6]<-"pred_tp"
    
    for (i in 1:nobs) {
      reslist[[paste0("NOW",i)]]<-assign(paste("djson",n+i,sep = ""),as.data.frame(d1[c(1:(h+i)),c(5,3,6,7)]))
    }
    
  } 

###########################################################  
########################## FORECAST
  else if (fcst==2)
  {
    # Input Esterno
    fcstpolind <-as.numeric(unlist(strsplit(fcstpolind,",")))
    #fcstpolind = c(0.1, 0.5, 0.4)
    
    d2<-subset(dati,select=c(t,d,tend,polind,date))
    nobsf      = length(nwcst$polind) + length(fcstpolind)
    
    strdate = ncdate[1]
    #strdate = d2$date[length(d2$date)]
    fdate = seq.Date(from =as.Date(strdate, "%d/%m/%Y"), 
                     length.out = nobsf,by="month")
    
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
    
    # L'utente deve inserire i parametri futuri del livello di restrizioni alla mobilità
    d2$forecast  <- predict(lm_tend_tp,type="response",d2)
    
    
    ##########   aggiungo stima pred_tp_c
    
    trend<-c(1:(length(pred_tp_c)))
    beta<-lm(pred_tp_c~trend)
    coef<-beta$coefficients[2]
    c_new<-c(1:nobsf)
    for (i in 1:nobsf) {
      c_new[i]<-pred_tp_c[length(pred_tp_c)]+(coef*i)
    }
    d2$pred_tp_c<-c(pred_tp_c,c_new)
    
    
    #################
    colnames(d2)[6]<-"pred_tp"
    
    for (i in 1:nobsf) {
      reslist[[paste0("FOR",i)]]<-assign(paste("djson",n+i,sep = ""),as.data.frame(d2[c(1:(h+i)),c(5,3,6,7)]))
    } 
  
  }
   
  return(reslist)    
  
}
