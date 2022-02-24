const fs = require("fs");

//classification
const flows = JSON.parse(fs.readFileSync("./data/classification/clsFlow.json"));

const products = JSON.parse(fs.readFileSync("./data/classification/clsProducts.json"));
const product3s = JSON.parse(fs.readFileSync("./data/classification/clsProducts3.json"));

/* change */
const becs = JSON.parse(fs.readFileSync("./data/classification/clsBec.json"));
/* to */
const productsCPA = JSON.parse(fs.readFileSync("./data/classification/clsProductsCPA.json"));

const productplus = JSON.parse(fs.readFileSync("./data/classification/clsProductplus.json"));


const productsIntra = JSON.parse(fs.readFileSync("./data/classification/clsProductsGraphIntra.json"));
const productsExtra = JSON.parse(fs.readFileSync("./data/classification/clsProductsGraphExtraNSTR.json"));



const transports = JSON.parse(fs.readFileSync("./data/classification/clsTransport.json"));
const partners = JSON.parse(fs.readFileSync("./data/classification/clsPartners.json"));

//general json
//service static
const countries = JSON.parse(fs.readFileSync("./data/general/countries.json"));

//service runtime server
// slider && select period 
// input for start end date
const metadata = JSON.parse(fs.readFileSync("./data/general/metadata.json"));

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
//data value
const exportValue = JSON.parse(fs.readFileSync("./data/trade/exportValue.json"));
const importValue = JSON.parse(fs.readFileSync("./data/trade/importValue.json"));
//data quantity
const exportQuantity = JSON.parse(fs.readFileSync("./data/trade/exportQuantity.json"));
const importQuantity = JSON.parse(fs.readFileSync("./data/trade/importQuantity.json"));



module.exports = () => ({
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
  exportValue,
  importValue,
  exportQuantity,
  importQuantity,
  
  
  //classification
  flows,  
  
  transports,

  products,
  product3s,
  productplus,
  becs,
  productsCPA,
  productsIntra,
  productsExtra,

  partners,
  // service slider select
  metadata
});
