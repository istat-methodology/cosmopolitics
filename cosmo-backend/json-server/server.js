let appInsights = require('applicationinsights');
appInsights.setup().start();
let client = appInsights.defaultClient;

let jsonServer = require("json-server");
let server = jsonServer.create();
let router = jsonServer.router(require("./db.js")());
let middlewares = jsonServer.defaults();

server.use(middlewares);
server.get('/hello',(req,res)=>{
  const args = process.env["APP_VERSION"];
  console.log(args);0
  res.json({"version":args});
  
});
server.get('/stop',(req,res)=>{
  res.json({"status":"OK"});
  setInterval(() => {
    process.exit(1);
  }, 500);
  
});
server.use(router);
server.listen(5300, function () {
  console.log("JSON Server is running");
});
