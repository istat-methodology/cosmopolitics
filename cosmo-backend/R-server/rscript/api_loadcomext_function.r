load_comext <- function(flow){
   
  if (flow==1) {
      db <- fread(paste(basedirData,"comext_imp.csv",sep="/"), 
                  colClasses=c("cpa"="character"))
	print("loaded file COMEXT_IMP")
    
  } else if (flow==2) {
      db <- fread(paste(basedirData,"comext_exp.csv",sep="/"), 
                  colClasses=c("cpa"="character"))
	print("loaded file COMEXT_EXP")
  } 
  
  return(db)
  
}
