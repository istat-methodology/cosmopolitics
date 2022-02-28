################################################
#grafici serie tendenziali e serie originale

itsa<-function(flow,var_cpa,country_code,partner_code,dataType,tipo_var){
  
  tryCatch(
    expr = {
      
      #creo lista dei risultati per il return
      reslist<-list()
      #carico il dataset
      dati<-data_function(flow,var_cpa,country_code,partner_code,dataType,tipo_var)
      
      l<-length(dati$series)
      
      #se il dataset è vuoto genera codice di errore 00
      statusMain<-ifelse(length(dati$series)>0,"01","00")
      reslist[["statusMain"]]<-statusMain
      
      reslist[["diagMain"]]<-dati
      
      #se ci sono missing len_diff==1 non si possono fare i grafici successivi
      len_diff<-ifelse(sum(is.na(dati$series))>=1,1,0)
      len_diff<-as.numeric(len_diff)
      if (len_diff==0 & statusMain=="01") {
        ############################grafico acf
        acf_list<-list()
        acf<-acf(dati$series,plot = FALSE)
        acf_list[["lne_y"]]<-as.vector(acf[["acf"]])
        acf_list[["lne_x"]]<-as.vector(acf[["lag"]])
        
        conf_int_pos<-qnorm((1 + 0.95)/2)/sqrt(l-12)
        acf_list[["dsh_y_pos"]]<- rep(conf_int_pos,length(acf[["lag"]]))
        acf_list[["dsh_x_pos"]]<- as.vector(acf[["lag"]])
        acf_list[["dsh_y_neg"]]<- rep(-conf_int_pos,length(acf[["lag"]]))
        acf_list[["dsh_x_neg"]]<- as.vector(acf[["lag"]])
        
        reslist[["diagACF"]]<-acf_list
        reslist[["statusACF"]]<-c("01")
        
        ##############################grafico qq_norm
        qq<-qqnorm(dati$series, pch = 1, frame = FALSE, plot.it = FALSE)
        pnt_x<-qq[[1]]
        pnt_y<-qq[[2]]
        
        # Find 1st and 3rd quartile o data
        y <- quantile(dati$series, c(0.25, 0.75), type = 5)
        # Find the 1st and 3rd quartile of the normal distribution
        x <- qnorm( c(0.25, 0.75))
        # Now we can compute the intercept and slope of the line that passes through these points
        slope <- diff(y) / diff(x)
        int   <- y[1] - slope * x[1]
        
        lne_y<-int+(slope*pnt_x)
        lne_x<-pnt_x
        normal <- data.frame(pnt_x,pnt_y,lne_x,lne_y)
        
        reslist[["diagNorm"]]<-normal
        reslist[["statusNorm"]]<-c("01")
        
        # se ci sono NA nella serie, non posso fare i due grafici
        # inserisco status di errore 
      } else {reslist[["statusACF"]]<-c("00")
      reslist[["statusNorm"]]<-c("00")
      }
      return(reslist)
    },
    error = function(e){ 
      reslist<-list()
      reslist[["statusMain"]]<-c("00")
      reslist[["statusACF"]]<-c("00")
      reslist[["statusNorm"]]<-c("00")
      reslist[["error"]]<-e
      return(reslist)
    }
    
  )
  
}
