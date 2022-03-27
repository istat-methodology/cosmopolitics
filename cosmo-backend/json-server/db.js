const fs = require("fs");

//Global metadata (for application configuratio)
const metadata = JSON.parse(fs.readFileSync("./data/general/metadata.json"));

//Products
const productsCPA = JSON.parse(fs.readFileSync("./data/classification/clsProductsCPA.json"));
const productsIntra = JSON.parse(fs.readFileSync("./data/classification/clsProductsGraphIntra.json"));
const productsExtra = JSON.parse(fs.readFileSync("./data/classification/clsProductsGraphExtraNSTR.json"));
//const products = JSON.parse(fs.readFileSync("./data/classification/clsProducts.json"));
//const productplus = JSON.parse(fs.readFileSync("./data/classification/clsProductplus.json"));
//const product3s = JSON.parse(fs.readFileSync("./data/classification/clsProducts3.json"));
//const becs = JSON.parse(fs.readFileSync("./data/classification/clsBec.json"));

const transports = JSON.parse(fs.readFileSync("./data/classification/clsTransport.json"));
const partners = JSON.parse(fs.readFileSync("./data/classification/clsPartners.json"));

//Map
const countries = JSON.parse(fs.readFileSync("./data/general/countries.json"));
const countriesBorders = JSON.parse(fs.readFileSync("./data/map/countriesBorders.json"));
//structural info
const ieinfo = JSON.parse(fs.readFileSync("./data/map/ieinfo.json"));
//marker && features
const importseries = JSON.parse(fs.readFileSync("./data/map/importseries.json"));
const exportseries = JSON.parse(fs.readFileSync("./data/map/exportseries.json"));

//Trade
//data value
const exportValue = JSON.parse(fs.readFileSync("./data/trade/exportValue.json"));
const importValue = JSON.parse(fs.readFileSync("./data/trade/importValue.json"));
//data quantity
const exportQuantity = JSON.parse(fs.readFileSync("./data/trade/exportQuantity.json"));
const importQuantity = JSON.parse(fs.readFileSync("./data/trade/importQuantity.json"));

module.exports = () => ({
  // application setup
  metadata,
  //classifications
  transports,
  partners,
  productsCPA,
  productsIntra,
  productsExtra,
  //map
  countries,
  countriesBorders,  
  ieinfo,
  importseries,
  exportseries,
  //trade
  exportValue,
  importValue,
  exportQuantity,
  importQuantity
});
