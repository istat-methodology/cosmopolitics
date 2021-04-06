load_comext <- function(flow){
  
  
  if (flow==1) {
    if( !file.exists(FILE_COMEXT_IMP)) 
	{ print("unzipping file COMEXT_IMP...")
        unzip(paste(basedirData,"COMEXT_IMP.zip",sep="/"),exdir=basedirData)
	} 
    	db <- fread(paste(basedirData,"COMEXT_IMP.csv",sep="/"))
	print("loaded file COMEXT_IMP")
    
  } else if (flow==2) {
    if( !file.exists(FILE_COMEXT_EXP)) 
      { print("unzipping file COMEXT_EXP...")
      unzip(paste(basedirData,"COMEXT_EXP.zip",sep="/"),exdir=basedirData)
    	}
	db <- fread(paste(basedirData,"COMEXT_EXP.csv",sep="/"))
	print("loaded file COMEXT_EXP")
  } 
  
  return(db)
  
}
