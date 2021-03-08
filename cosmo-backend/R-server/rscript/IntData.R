
####################################################################################
############## ELABORAZIONI PRELIMINARI SUI DATI ###################################

# carico i nomi dei BEC 
bec<-c("FOOD AND BEVERAGES","INDUSTRIAL SUPPLIES","FUELS AND LUBRICANTS",
       "CAPITAL GOODS","TRANSPORT EQUIPMENT","CONSUMER GOODS","TOTAL")

# subset per paese e partner
a1 <- db[which(db$country_sh==country),]

a0<-a1[,c(1,2,3)]
a2 <- a1 %>% select(starts_with(partner))
aa <- cbind(a0,a2)

#aggrego BEC alla prima cifra
b1<-rowSums(aa[,4:7])
b2<-rowSums(aa[,8:9])
b3<-rowSums(aa[,10:12])
b4<-rowSums(aa[,13:14])
b5<-rowSums(aa[,15:18])
b6<-rowSums(aa[,19:21])
b <- as.data.frame(cbind(b1,b2,b3,b4,b5,b6))
colnames(b)<-paste(partner,1:6,sep="")
aa1 <- cbind(a0,b,aa[,23])

#subset colonna della var oggetto di studio
#ordino il dataset,divido per un milione 
#rimuovo i dataframe di appoggio
dati<-aa1[order(aa1$year),]
dati<-dati[,c(4:10)]/1000000
dati<-subset(dati,select=c(VAR))
colnames(dati)<-c("VAR")
dati<-dati[which(dati$VAR!=0),]
rm(a0,a1,a2,aa,aa1,b,b1,b2,b3,b4,b5,b6)
gc()

#lunghezza db
l<-length(dati$VAR)

