ris<-list()

descSummary <- function(region, subregion) {
  
  #Global_Mobility_Report<- paste(basedir,read.csv("DB_GoogleMobility.csv"),sep="/")
 # region     = "Italy" # Paese Europeo da Scaricare
#  subregion  = "Italy" 
 
  #print("aaaa")
  gmr<-subset(GMR,Country==region)
  gmr<-as.data.frame(gmr)
  gmr$Region<-ifelse(gmr$Region=="",region,gmr$Region)
 # var<-c("Dates","Retail","Grocery_Pharmacy","Parks","Transit_Station","Workplaces","Residential")
  var<-c("Dates","Retail","Grocery_Pharmacy","Parks","Transit_Station","Workplaces","Residential")
  db_stat<-gmr[(gmr$Region==subregion),]
  db_stat<-db_stat[,4:10]
  db_stat[is.na(db_stat)]<-0
  colnames(db_stat)<-var
  ris<-list()
  #print("bb")
  print(db_stat[,2])
  for (i in 2:7)
  {
    min<-round(min(db_stat[,i]),1)
    q1<-round(quantile((db_stat[,i]),0.25),1)
    med<-round(median(db_stat[,i]),1)
    avg<-round(mean(db_stat[,i]),1)
    q3<-round(quantile((db_stat[,i]),0.75),1)
    max<-round(max(db_stat[,i]),1)
    
    ris[[i-1]]<-data.frame(min,q1,med,avg,q3,max)
    print(i)
  }
  
  stats<-do.call("rbind", ris)
  stats<-t(stats)
  colnames(stats)<-paste(subregion, var[2:7],sep =" ")
  colnames(stats)<- var[2:7]
 # View(stats)
  
  stats<- as.data.frame(stats)
  stats<-cbind( "row"=rownames(stats),stats)
  return(stats)
  }
  