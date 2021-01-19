const http = require('http');
const fs = require("fs").promises;
const mime = require("mime");
const {program } = require("commander");
const chalk = require("chalk");
program.version('1.0.0');
program.option('-p, --port <type>')
.option('-h, --host <type>')
.option('-d, --dir <type>');
program.parse(process.args);
const options = program.opts();
console.log(options.port,options.host,options.dir );
class Serve {
    constructor(config) {
        this.port = config.port || 3000;
        this.host = this.host || "localhost"
        this.dirPath = config.dirPath
    }
    handleRes(res,req){
        console.log(res,req)
        req.end("chenggon")
    }
    start(){
       const server =  http.createServer(this.handleRes.bind(this))
       server.listen(this.port, this.host,(err,aa)=>{
        console.log("运行端口"+ this.port)
       })
    }
}
const serve = new Serve({});
serve.start()