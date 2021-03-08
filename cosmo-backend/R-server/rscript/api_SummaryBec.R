
BEC <- function(flow,country,partner,year,month){
  
  #decido anno e mese di trattamento (123 = MARZO 2020)
  #year  = 2020 
  #month = 3    # marzo
 

 
  d<-data_function_bec(flow,country,partner)
  d1<-as.data.frame(d[[1]],)
  d2<-as.data.frame(d[[2]],)
  d3<-as.data.frame(d[[3]],)
  d4<-as.data.frame(d[[4]],)
  d5<-as.data.frame(d[[5]],)
  d6<-as.data.frame(d[[6]],)
  d7<-as.data.frame(d[[7]],)
 
  treat <- which(d1$year == as.numeric(year))[[1]] +as.numeric(month) - 1
  #a2 <- a1 %>% select(PARTNER==partner)
  
  #db$Var <- as.numeric(db$VAR)
  
  #a2 <- a1[which(a1$PARTNER==partner),c(1,3,5,7,13)]
  #a2$VAR <- as.numeric(a2$VAR)
  #a2$bec3 = as.factor(a2$bec3)
  
  
  ### tentativo no!
  
  #library(reshape2)
  #prova <-dcast(a2, VAR~ bec3)
  
 
  
  #a2 <- a1 %>% select(starts_with(partner))
  #aa <- cbind(a0,a2)
  #aggrego BEC alla prima cifra
  #b1<-rowSums(aa[,4:7])
  #b2<-rowSums(aa[,8:9])
  #b3<-rowSums(aa[,10:12])
  #b4<-rowSums(aa[,13:14])
  #b5<-rowSums(aa[,15:18])
  #b6<-rowSums(aa[,19:21])
  #b <- as.data.frame(cbind(b1,b2,b3,b4,b5,b6))
  #colnames(b)<-paste(partner,1:6,sep="")
  #aa1 <- cbind(a0,b,aa[,23])
  #dati_b<-dati_b[,c(4:10)]/1000000
  #dati_b<-dati_b[which(dati_b[,1]!=0),]
  #rm(a0,a1,a2,aa,aa1,b,b1,b2,b3,b4,b5,b6)
  #gc()
  #lunghezza db
  
  
  Date <- d1[,1]
  dati_b <- data.frame(Date)
  l<-dim(dati_b)[1]
  
  dati_b$p1<-d1$VAR/d7$VAR*100
  dati_b$p2<-d2$VAR/d7$VAR*100
  dati_b$p3<-d3$VAR/d7$VAR*100
  dati_b$p4<-d4$VAR/d7$VAR*100
  dati_b$p5<-d5$VAR/d7$VAR*100
  dati_b$p6<-d6$VAR/d7$VAR*100
  
  #dev.off()
  #dev.new()
  #par(mar = rep(2, 4))
  #par(mfrow=c(3,2))
  
  d<-as.data.frame(dati_b[,c(1:7)])
  d$Date <- dati_b$Date
  

  
  ris<-list()
  risT <-list()
  for (i in 2:7)
  {
    a<-d$Date
    b<-d[,i]
    c<-data.frame(a,b)
    a<-c[,1]
    b<-c[,2]
    
    #plot(a,b,ylab=flow, xlab="Time", 
    #     main = paste(country,"-",partner,",",bec[i],", %tot", sep =" "))
    #points(b,cex=0.9,col=3)
    #abline(v=treat-1, lty=3)
    
    
    min<-round(min(d[1:treat,i]),1)
    q1<-round(quantile((d[1:treat,i]),0.25),1)
    med<-round(median(d[1:treat,i]),1)
    avg<-round(mean(d[1:treat,i]),1)
    q3<-round(quantile((d[1:treat,i]),0.75),1)
    max<-round(max(d[1:treat,i]),1)
    
    minT<-round(min(d[(treat+1):l,i]),1)
    q1T<-round(quantile((d[(treat+1):l,i]),0.25),1)
    medT<-round(median(d[(treat+1):l,i]),1)
    avgT<-round(mean(d[(treat+1):l,i]),1)
    q3T<-round(quantile((d[(treat+1):l,i]),0.75),1)
    maxT<-round(max(d[(treat+1):l,i]),1)
    
    
    ris[[i]]<-data.frame(min,q1,med,avg,q3,max)
    risT[[i]]<-data.frame(minT,q1T,medT,avgT,q3T,maxT)
    #print(i)
    
    #smoothingSpline = smooth.spline(a,b, spar=0.35)
    #lines(smoothingSpline,col="red",lwd=2)
  }
  
  stats<-do.call("rbind", ris)
  stats<-t(stats)
  colnames(stats)<-c("FOOD_AND_BEVERAGES","INDUSTRIAL_SUPPLIES","FUELS_AND_LUBRICANTS",
                     "CAPITAL_GOODS","TRANSPORT_EQUIPMENT","CONSUMER_GOODS")
  
  statsT<-do.call("rbind", risT)
  statsT<-t(statsT)
  colnames(statsT)<-c("FOOD_AND_BEVERAGES","INDUSTRIAL_SUPPLIES","FUELS_AND_LUBRICANTS",
                      "CAPITAL_GOODS","TRANSPORT_EQUIPMENT","CONSUMER_GOODS")
  
  stats<- as.data.frame(stats)
  statsT<- as.data.frame(statsT)
  stats<-cbind( "row"=rownames(stats),stats)
  statsT<-cbind( "row"=rownames(statsT),statsT)
  
  colnames(d)<-c("FOOD_AND_BEVERAGES","INDUSTRIAL_SUPPLIES","FUELS_AND_LUBRICANTS",
                 "CAPITAL_GOODS","TRANSPORT_EQUIPMENT","CONSUMER_GOODS")
  
  reslist <-list("Pre_Date"=stats,"Post_Date"=statsT,
                 "Plots"=d)
  
  return(reslist)
  
}
