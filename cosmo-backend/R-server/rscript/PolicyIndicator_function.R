# Policy Indicator


PolInd <- function( region, subregion) {
                
                gmr<-subset(GMR,Country==region)
                gmr<-as.data.frame(gmr)
                gmr$Region<-ifelse(gmr$Region=="",region,gmr$Region)
                var<-c("Dates","Retail","Grocery_Pharmacy","Parks","Transit_Station","Workplaces","Residential")
                db_stat<-gmr[(gmr$Region==subregion),]
                db_stat<-db_stat[,4:10]
                db_stat[is.na(db_stat)]<-0
                colnames(db_stat)<-var        
                
                
                ######### BARBARA  ####################
                PCAest <-prcomp(db_stat[,c(2:7)],scale=TRUE)
                
                library(factoextra)
                library(ggplot2)
                # Results for Variables
                res.var <- get_pca_var(PCAest)
                #print(res.var$coord)          # Coordinates
                #print(res.var$contrib)        # Contributions to the PCs
                #print(res.var$cos2)           # Quality of representation 
                
                eig <- get_eig(PCAest)
                ExpVar <- as.data.frame(eig[2])
                
                colnames(ExpVar)<-c("variance_perc")
                ExpVar<-cbind( "row"=rownames(ExpVar),ExpVar)
                
                tab_res<-as.data.frame(res.var[c(1,4,3)])
                tab_res<-tab_res[c(1,7,13)]
                #View(tab_res)
                tab_var<-c("coordinates","contributions_PCs","quality")
                colnames(tab_res)<-tab_var
                
                #dev.new()
                #print(fviz_eig(PCAest))
                
                #dev.new()
                #print(fviz_pca_var(PCAest,
                #                   col.var = "contrib", # Color by contributions to the PC
                #                   gradient.cols = c("#00AFBB", "#E7B800", "#FC4E07"),
                #                   repel = TRUE     # Avoid text overlapping
                #) +   labs(title = paste(subregion,"Variables - PCA",sep=" ")))
                
                PC1 <- PCAest$x[,'PC1']
                
                dates <- db_stat[,1];
                
                #dev.new()
                #plot(dates,PC1,type="h",ylim=c((min(PC1,na.rm=TRUE)),(max(PC1,na.rm=TRUE))),xlab="",ylab="Policy Indicator -PC1")
                
                minI = min(PC1);
                maxI = max(PC1);
                
                PolInd = (PC1-minI)/(maxI-minI)
                
                smoothingSpline = smooth.spline(dates, PolInd, spar=0.35)
                DPolInd = data.frame(dates,PolInd,smoothingSpline$y)
                names(DPolInd) <- c('Date', 'PolInd', 'smooth')
                
                
                db_stat$PolInd <- PolInd
                
               
                x <- as.POSIXct(db_stat$Dates,format="%Y-%m-%d")
                mo <- strftime(x, "%m")
                yr <- strftime(x, "%Y")
                PolInd_M <- db_stat$PolInd
                dd <- data.frame(mo, yr, PolInd_M)
                dfM <- aggregate(PolInd_M ~ mo + yr, dd, FUN = mean)
               # fra dfM$Date <- as.yearmon(paste(dfM$yr, dfM$mo), "%Y %m")
                dfM$Date <- as.Date(as.yearmon(paste(dfM$yr, dfM$mo), "%Y %m"))
                
                
                smoothingSpline = smooth.spline(dfM$Date, dfM$PolInd_M, spar=0.35)
                MPolInd = data.frame(dfM$Date,dfM$PolInd_M,smoothingSpline$y)
                names(MPolInd) <- c('Date', 'MPolInd', 'smooth')
                
                
                PCAresult<- as.data.frame(tab_res)
                PCAresult<-cbind( "row"=rownames(PCAresult),PCAresult)
                
                reslist <-list("Variance"=ExpVar,"DPM_Index"=DPolInd,
                               "MPM_Index"=MPolInd,"PCAresult"=PCAresult)
                
                #names(ExpVar)<- c("Variance (%)")
                
                return(reslist)
                
        }

