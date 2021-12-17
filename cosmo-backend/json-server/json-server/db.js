const countries = require("./countries");
const countriesBorders = require("./countriesBorders");
const ieinfo = require("./ieinfo");
const exportvqs = require("./exportvqs");
const importvqs = require("./importvqs");
const pythongraph = require("./pythongraph");
const timelapse = require("./timelapse");
const flows = require("./clsFlow");
const products = require("./clsProducts");
const product3s = require("./clsProducts3");
const transports = require("./clsTransport");
const expVar = require("./expvar");
const impVar = require("./impvar");
const importseries = require("./importseries");
const exportseries = require("./exportseries");
const becs = require("./clsBec");
const partners = require("./partners");
const productplus = require("./productplus");
// input for start end date
const timeperiod = require("./timeperiod");

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
