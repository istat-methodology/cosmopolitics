

loadcomext <- function(flow){
  
  
  if (flow==1) {
    db <- fread(paste(basedirData,"COMEXT_IMP.csv",sep="/"), colClasses = list(numeric=4:5778))
  } else if (flow==2) {
    db <- fread(paste(basedirData,"COMEXT_EXP.csv",sep="/"), colClasses = list(numeric=4:5778))
  } 
  

  return(db)
  
}
