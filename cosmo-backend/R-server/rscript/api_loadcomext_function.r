load_comext <- function(flow){
  
  
  if (flow==1) {
      db <- fread(paste(basedirData,"comext_imp.csv",sep="/"))
	print("loaded file COMEXT_IMP")
    
  } else if (flow==2) {
      db <- fread(paste(basedirData,"comext_exp.csv",sep="/"))
	print("loaded file COMEXT_EXP")
  } 
  
  return(db)
  
}
