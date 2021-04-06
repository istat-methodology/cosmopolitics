
BEC <- function(flow,country_code,partner_code,year,month){
  
  d<-data_function_bec(flow,country_code,partner_code)

  for (i in 1:7)
{var_bec=i
assign(paste0("d",i),as.data.frame(d[[i]])) 
}
  rm(d)

treat <- which(d1$year == as.numeric(year))[[1]] + as.numeric(month) - 1


Date <- d1[,1]
dati_b <- data.frame(Date)
l<-dim(dati_b)[1]

dati_b$p1<-d1$VAR/d7$VAR*100
dati_b$p2<-d2$VAR/d7$VAR*100
dati_b$p3<-d3$VAR/d7$VAR*100
dati_b$p4<-d4$VAR/d7$VAR*100
dati_b$p5<-d5$VAR/d7$VAR*100
dati_b$p6<-d6$VAR/d7$VAR*100


d<-as.data.frame(dati_b[,c(1:7)])
d$Date <- dati_b$Date

bec <- c("FOOD AND BEVERAGES","INDUSTRIAL SUPPLIES","FUELS AND LUBRICANTS",
        "CAPITAL GOODS","TRANSPORT EQUIPMENT","CONSUMER GOODS")

ris<-list()
risT <-list()
for (i in 2:7)
{
  
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
  print(i)

  #smoothingSpline = smooth.spline(a,b, spar=0.35)
  #lines(smoothingSpline,col="red",lwd=2)
}

stats<-do.call("rbind", ris)
stats<-t(stats)
colnames(stats)<-c("FOOD AND BEVERAGES","INDUSTRIAL SUPPLIES","FUELS AND LUBRICANTS",
                        "CAPITAL GOODS","TRANSPORT EQUIPMENT","CONSUMER GOODS")

statsT<-do.call("rbind", risT)
statsT<-t(statsT)
colnames(statsT)<-c("FOOD AND BEVERAGES","INDUSTRIAL SUPPLIES","FUELS AND LUBRICANTS",
                   "CAPITAL GOODS","TRANSPORT EQUIPMENT","CONSUMER GOODS")

stats<- as.data.frame(stats)
statsT<- as.data.frame(statsT)


return(list("Pre_Date"=stats,"Post_Date"=statsT,"Plots"="d"))

}
