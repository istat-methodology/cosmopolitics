const fs=require("fs")

const countries = JSON.parse(fs.readFileSync("./data/countries.json"));
const countriesBorders = JSON.parse(fs.readFileSync("./data/countriesBorders.json"));
const ieinfo = JSON.parse(fs.readFileSync("./data/ieinfo.json"));
const exportvqs = JSON.parse(fs.readFileSync("./data/exportvqs.json"));
const importvqs = JSON.parse(fs.readFileSync("./data/importvqs.json"));
const pythongraph = JSON.parse(fs.readFileSync("./data/pythongraph.json"));
const timelapse = JSON.parse(fs.readFileSync("./data/timelapse.json"));
const flows = JSON.parse(fs.readFileSync("./data/clsFlow.json"));
const products = JSON.parse(fs.readFileSync("./data/clsProducts.json"));
const product3s = JSON.parse(fs.readFileSync("./data/clsProducts3.json"));
const transports = JSON.parse(fs.readFileSync("./data/clsTransport.json"));
const expVar = JSON.parse(fs.readFileSync("./data/expvar.json"));
const impVar = JSON.parse(fs.readFileSync("./data/impvar.json"));
const importseries = JSON.parse(fs.readFileSync("./data/importseries.json"));
const exportseries = JSON.parse(fs.readFileSync("./data/exportseries.json"));
const becs = JSON.parse(fs.readFileSync("./data/clsBec.json"));
const partners = JSON.parse(fs.readFileSync("./data/partners.json"));
const productplus = JSON.parse(fs.readFileSync("./data/productplus.json"));
// input for start end date
const timeperiod = JSON.parse(fs.readFileSync("./data/timeperiod.json"));

module.exports = () => ({
  countries,
  countriesBorders,
  ieinfo,
  exportvqs,
  importvqs,
  pythongraph,
  timelapse,
  flows,
  transports,
  products,
  product3s,
  expVar,
  impVar,
  importseries,
  exportseries,
  becs,
  partners,
  productplus,
  timeperiod
});
