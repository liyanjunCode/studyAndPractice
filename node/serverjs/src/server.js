const http = require('http');
const fs = require("fs/promises");
const { createReadStream,readFileSync } = require("fs");
const path = require("path");
const mime = require("mime");
const { program } = require("commander");
const chalk = require("chalk");
const url = require("url");
const ejs = require("ejs");
const util = require("util");
const zlib = require("zlib");
program.version('1.0.0');
program.option('-p, --port <type>')
    .option('-h, --host <type>')
    .option('-d, --dir <type>');
program.parse(process.args);
const options = program.opts();
const template = readFileSync(path.join(__dirname, "./public.ejs"));
class Serve {
    constructor(config) {
        this.port = config.port || 3000;
        this.host = this.host || "localhost"
        this.dirPath = config.dirPath
    }
    async handleRes (req, res) {
        const {pathname} = url.parse(req.url, true);
        let absFilePath=path.join(__dirname, pathname);
        console.log(absFilePath, "absFilePath")
        try {
            const status = await fs.stat(absFilePath);
            if (status.isFile()) {
                this.sendFile(req, res, status, absFilePath)
            } else {
                const filePath = path.join(absFilePath, "index.html");
                try {
                    const status = await fs.stat(filePath);
                    this.sendFile(req, res, status, filePath);
                }catch(err){
                    this.showList(req, res, status, absFilePath);
                }
            }
        }catch(err){
            this.sendError(req, res, absFilePath);
           
        }
    }
    async showList(req, res, status, absFilePath){
        const dirlist = await fs.readdir(absFilePath);
        let dirs = dirlist.map(item=>{
            return {
                name: item,
                path: `/public/${item}`
            }
        })
        let templateStr = await ejs.render(template, { dirs }, { async:true });
       
        res.end(templateStr);
    }
    sendError(req, res, absFilePath){
        res.statusCode = 404;
        res.end("not Found");
    }
    zgip(req, res){
        if(req.headers['accept-encoding'] && req.headers['accept-encoding'].includes("gzip")) {
            res.setHeader("Content-Encoding", "gzip");
            return zlib.createGzip();
        }
        return false;
    }
    sendFile (req, res, status, absFilePath) {
        res.statusCode = 200;
        const type = mime.getType(absFilePath);
        res.setHeader("Content-Type",type+";charset=utf-8");
        const zgips = this.zgip(req, res);
        if(zgips) {
            createReadStream(absFilePath).pipe(zgips).pipe(res);
        } else {
            createReadStream(absFilePath).pipe(res);
        }
        
    }
    start () {
        const server = http.createServer(this.handleRes.bind(this))
        server.listen(this.port, this.host, (err, aa) => {
            console.log("运行端口" + this.port)
        })
    }
}
module.exports = {
    Serve
}