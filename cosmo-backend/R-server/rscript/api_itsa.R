######### ITSA ################################
# modello base y=t+d+td con dati tendenziali e 1 lag
# modello y=t+d+td+polind+tpolind con dati tendenziali e 1 lag
####GRAFICI PER TIMELAPSE
###############################################
#ITSA  <- itsa_diag(2,7,"IT","US",1,1) 
itsa_diag <- function(flow,var_bec,country_code,partner_code,fcst,fcstpolind){
  
  #decido anno e mese di trattamento (123 = MARZO 2020)
  year  = 2020 
  month = 3    # marzo
  #djsonfcst<-NA
  dati<-data_function(flow,var_bec,country_code,partner_code)
  #dati<-dati[order(dati$year,dati$month),]
  
  region = country_code
  subregion = country_code
  
  treat <- which(dati$year == as.numeric(year))[[1]] + as.numeric(month) - 1
  
  #lunghezza db
  l<-length(dati$VAR)
  ################################################################
  
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
  
  
  ndate         <- which(POLIND_DB$Date == dati$date[length(dati$date)])
  ncdate        <- POLIND_DB$Date[(ndate):length(POLIND_DB$Date)]
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
  
  reslist<-list()
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
    
    nwcst$date <- ndate
    nwcst <- nwcst[,c(-1)]
    d1 <- rbind(d1,nwcst)
    
    # Nowcast
    
    lm_tend_tp<-lm(tend~t+d+polind,data=d1)
    
    #lm_tend<-lm(tend~t+d+td,data=d)
    lm_tend_tp_corr<-coeftest(lm_tend_tp,vcov=NeweyWest(lm_tend_tp,lag = 1, prewhite = 0, adjust = TRUE, verbose=T))
    d1$nowcast  <- predict(lm_tend_tp,type="response",d1)
    
    #djsonfcst    <- as.data.frame(d1[,c(5,3,6)])
    
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
    
    
  } else if (fcst==2)
  {
    # Input Esterno
    fcstpolind <-as.numeric(unlist(strsplit(fcstpolind,",")))
    
    d2<-subset(dati,select=c(t,d,tend,polind,date))
    nobsf      = length(nwcst$polind) + length(fcstpolind)
    
    strdate = d2$date[length(d2$date)]
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
    
    d2$forecast  <- predict(lm_tend_tp,type="response",d2)
    # Mettere qui funzione di fcst ma chiedere parametri futuri
    # L'utente deve inserire i parametri futuri oppure vanno tutti 
    # zero ed 1 dobbiamo farlo costruire esternamente
    #djsonfcst    <- as.data.frame(d2[,c(5,3,6)])
    
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
  #  
  # else if (fcst==0) {
  #   djson = NA
  #   
  # }
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
    
    
    # Estimated Model Results
   regmod <- as.data.frame(beta_tpolind)
   rownames(regmod)[rownames(regmod) == "t"] <- "Trend"
   rownames(regmod)[rownames(regmod) == "d"] <- "Covid Dummy"
   rownames(regmod)[rownames(regmod) == "polind"] <- "Mobility Policy Indicator"
   
   regmod<-cbind( "row"=rownames(regmod),regmod)
   colnames(regmod)<-c("row","estimate", "std_error", "t_value","pr_t")
  
   
   reslist[["Model"]]<-regmod
   
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
   reslist[["Covid_Estimation"]]<-coveff
   
   ###############################################################
   #diagnostica
   
   #grafico residui
   res <- residuals(lm_tend_tp,type="response",d)
   res_date<-dati$date[c(13:l)]
   res_line<-c(rep(0,length(res)))
   residual <- data.frame(res_date,res,res_line)

   reslist[["DIAG_RES"]]<-residual
   # # 
   # #grafico actf
   # dev.new()
   # require(graphics)
   # acf<-acf(dati$tend)
   # plot(acf)
   # 
   #grafico qq_norm
   # dev.new()
   # a<-qqnorm(dati$tend[c(13:l)], pch = 1, frame = FALSE)
   # point_x<-a[[1]]
   # point_y<-a[[2]]
   # mean(point_y)
   # #qqline(dati$tend, lwd = 2)
   # # Find 1st and 3rd quartile for the Alto 1 data
   # y <- quantile(dati$tend[c(13:l)], c(0.25, 0.75), type = 5)
   # # Find the 1st and 3rd quartile of the normal distribution
   # x <- qnorm( c(0.25, 0.75))
   # # Now we can compute the intercept and slope of the line that passes
   # # through these points
   # slope <- diff(y) / diff(x)
   # int   <- y[1] - slope * x[1]
   # abline(a = int, b = slope )
   # 
   # qq_line<-c(1:(length(res)))
   # qq_line<-qq_line*slope
   # 
   # 
   # for (i in 1:(l-12)) {
   #   qq_line[i]<-x[1]+(slope*i)
   # }
   # 
   # 
   # normal <- data.frame(point_x,point_y,qq_line)
   # 
   # reslist[["DIAG_NORM"]]<-normal
   
  return(reslist)    
  #### OUTPUT BETA-POLIND STATS_TPOLIND DATI PER GRAFICO DINAMICO
  
}










