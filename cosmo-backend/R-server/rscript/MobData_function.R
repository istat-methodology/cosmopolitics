 
  
downloadDataFile <- function() {
  print("downloading data file....")
    
  Global_Mobility_Report <- fread("https://www.gstatic.com/covid19/mobility/Global_Mobility_Report.csv")
  print("data fread ok")
  Global_Mobility_Report<-as.data.frame(Global_Mobility_Report)
  
  Global_Mobility_Report <- rename(Global_Mobility_Report,c("Country_Code"="country_region_code", "Country"="country_region",
                      "Region"="sub_region_1","Retail"="retail_and_recreation_percent_change_from_baseline",
                      "Grocery_Pharmacy"="grocery_and_pharmacy_percent_change_from_baseline",
                      "Parks"="parks_percent_change_from_baseline",
                      "Transit_Stations"= "transit_stations_percent_change_from_baseline",
                      "Workplace"="workplaces_percent_change_from_baseline",
                      "Residential"="residential_percent_change_from_baseline"))
  
  
  Global_Mobility_Report_sel <- Global_Mobility_Report  %>% select(Country_Code,Country,Region,date,Retail,Grocery_Pharmacy,Parks,
                        Transit_Stations,Workplace,Residential)
  
  write.csv(Global_Mobility_Report_sel,FILE_DB_Mobility, row.names = FALSE)
  print("downloading data file ok")
  return (true)
}

   

loadData <- function(){

  print("loading data file....")
  if( !file.exists(FILE_DB_Mobility)) {
    downloadDataFile()
  }

  GMR <- read.csv(FILE_DB_Mobility)
  GMR$date<-as.factor(GMR$date)
  print("loading data file ok!")
  return (GMR)
}

  