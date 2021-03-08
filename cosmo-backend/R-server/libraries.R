
checkAndInstall <- function(mypkg){
   if (! is.element(mypkg, installed.packages()[,1]))  install.packages(mypkg)

  } 

options(repos = "https://cran.mirror.garr.it/CRAN/")

print("Loading libraries...")

#install.packages("validate")
#install.packages("validatetools")
#install.packages("errorlocate")
#install.packages("univOutl")
#install.packages("simputation")
#install.packages("VIM")
#install.packages("rspa")
#install.packages("varhandle")
checkAndInstall("factoextra")
checkAndInstall("RestRserve")
checkAndInstall("jsonlite")
checkAndInstall("data.table")
checkAndInstall("plyr")
checkAndInstall("dplyr")
checkAndInstall("ggplot2")
checkAndInstall("sandwich")
checkAndInstall("zoo")
checkAndInstall("its.analysis")
checkAndInstall("lmtest")

print("Loading libraries...ok ")