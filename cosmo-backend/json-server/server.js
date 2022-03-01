var jsonServer = require("json-server");
var server = jsonServer.create();
var router = jsonServer.router(require("./db.js")());
var middlewares = jsonServer.defaults();

server.use(middlewares);
server.get('/hello',(req,res)=>{
  const args = env;
  console.log(args);
  res.json({"status":args});
  
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
