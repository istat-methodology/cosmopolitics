# POLIND BATCH
# mettiamo tutti i polind in batch per velocizzare front-end di ITSA

polind_batch<-function(){

#GMR <- read.csv(paste(basedir, "DB_GoogleMobility.csv", sep='/'))
#GMR <-DB_GoogleMobility

var<-c("Dates","Retail","Grocery_Pharmacy","Parks","Transit_Station","Workplaces","Residential")

#manca CIPRO!!!
reg<-c("AT", "BE", "BG", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR",
       "HU", "IE", "IT", "LT", "LU" ,"LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK")

######### BARBARA  ####################
### ciclo dei paesi ###################
polind_db<-list()
  
for (j in 1:27)
{  
  gmr<-subset(GMR,Country_Code==reg[j])
  gmr<-as.data.frame(gmr)
  db_stat<-subset(gmr,gmr$Region=="")
  db_stat<-db_stat[,4:10]
  db_stat[is.na(db_stat)]<-0
  colnames(db_stat)<-var 
  
PCAest <-prcomp(db_stat[,c(2:7)],scale=TRUE)

PC1 <- PCAest$x[,'PC1']

dates <- db_stat[,1];

#dev.new()
#plot(dates,PC1,type="h",ylim=c((min(PC1,na.rm=TRUE)),(max(PC1,na.rm=TRUE))),xlab="",ylab="Policy Indicator -PC1")

minI = min(PC1);
maxI = max(PC1);

PolInd = (PC1-minI)/(maxI-minI)

db_stat$PolInd <- PolInd

#library(zoo)
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

polind_db[[j]]<-dfM[,3]

}

polind_DB<-do.call("cbind", polind_db)
polind_DB<-data.frame(polind_DB)
colnames(polind_DB)<-reg
polind_DB$Date<-dfM[,4]
#write.csv(POLIND_DB,paste(basedirData,"POLIND_DB.csv",sep="/"))

return(polind_DB)    

}