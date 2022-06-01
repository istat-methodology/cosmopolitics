let appInsights = require('applicationinsights');
appInsights.setup();
if (process.env.CLOUD_ROLE)
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = process.env.CLOUD_ROLE;
appInsights.start();
let client = appInsights.defaultClient;

let jsonServer = require("json-server");
let server = jsonServer.create();
let router = jsonServer.router(require("./db.js")());
let middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/hello',(req,res)=>{
  const appVersion = process.env["APP_VERSION"];
  res.json({"version":appVersion});
});

server.get('/stop',(req,res)=>{
  res.json({"status":"OK"});
  setInterval(() => {
    process.exit(1);
  }, 500);
  
});

server.use(router);

server.listen(5300, function () {
  console.log("JSON Server is running - CLOUD_ROLE=" + process.env.CLOUD_ROLE);
});
