################################################
#grafici serie tendenziali e serie originale

#### calcolo i tendenziali
dati$tend<-dati$VAR
for (i in 13:l)
{
  dati$tend[i]<-dati$VAR[i]-dati$VAR[i-12]
}
dati$tend[c(1:12)]<-NA

#GRAFICI
dev.new()
#par(mar = rep(1, 2))
par(mfrow=c(2,1))
plot(dati$VAR, xlab = "Time", ylab = "Original data", 
     main = paste(FLOW,":",country,"-",partner,";",bec[VAR],"(mln. euro)",sep =" "))
abline(v=treat-1, lty=3)
lines(dati$VAR,col=3)
plot(dati$tend, xlab = "Time", ylab = "Yearly variation", 
     main = paste(FLOW,":",country,"-",partner,";",bec[VAR],"(mln. euro)",sep =" "))
abline(v=treat-1, lty=3)
lines(dati$tend,col=3)


