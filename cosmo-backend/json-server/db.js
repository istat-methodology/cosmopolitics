const fs=require("fs")

//classification
const flows = JSON.parse(fs.readFileSync("./data/classification/clsFlow.json"));
const products = JSON.parse(fs.readFileSync("./data/classification/clsProducts.json"));
const product3s = JSON.parse(fs.readFileSync("./data/classification/clsProducts3.json"));
const transports = JSON.parse(fs.readFileSync("./data/classification/clsTransport.json"));
const becs = JSON.parse(fs.readFileSync("./data/classification/clsBec.json"));
const partners = JSON.parse(fs.readFileSync("./data/classification/clsPartners.json"));
const productplus = JSON.parse(fs.readFileSync("./data/classification/clsProductplus.json"));

//general json
//service static
const countries = JSON.parse(fs.readFileSync("./data/general/countries.json"));
//service runtime server
const timeperiod = JSON.parse(fs.readFileSync("./data/general/timeperiod.json"));

//map json
//service static
const countriesBorders = JSON.parse(fs.readFileSync("./data/map/countriesBorders.json"));
//data 
//box 
const ieinfo = JSON.parse(fs.readFileSync("./data/map/ieinfo.json"));
//marker && features
const importseries = JSON.parse(fs.readFileSync("./data/map/importseries.json"));
const exportseries = JSON.parse(fs.readFileSync("./data/map/exportseries.json"));

//trade
const exportvqs = JSON.parse(fs.readFileSync("./data/trade/exportvqs.json"));
const importvqs = JSON.parse(fs.readFileSync("./data/trade/importvqs.json"));


//


// slider 
// input for start end date


module.exports = () => ({
  //map 
  //service country lat lon  
  //marker
  countries,
  //feature
  countriesBorders,
  
  //data
  //view box on country  
  ieinfo,
  //view marker and feature 
  //data 
  importseries,
  exportseries,
  //trade
  //data
  exportvqs,
  importvqs,
  //graph
  

  //classification
  flows,
  transports,
  products,
  product3s,
  becs,
  partners,
  productplus,
  
  // service slider select
  timeperiod
});
