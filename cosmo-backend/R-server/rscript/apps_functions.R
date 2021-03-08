
countries <- function(countr,nam){
  print(countr)
 print(nam)
  countries<-COUNTRIES$country
  if(!is.null(countr))  countries<-subset(countries,country==countr)
  if(!is.null(nam))  countries<-subset(countries,name==nam)
   countries <- as.data.frame(countries) %>% 
    select(country , coordinates, name) %>% 
    toJSON()
  return (countries)
}

  loadCountries <- function(){
  countries <- fromJSON(FILE_COUNTRY)
  return (countries)
}
