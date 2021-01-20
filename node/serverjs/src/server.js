const http = require('http');
const fs = require("fs").promises;
const mime = require("mime");
const { program } = require("commander");
const chalk = require("chalk");
const url = require("url");
program.version('1.0.0');
program.option('-p, --port <type>')
    .option('-h, --host <type>')
    .option('-d, --dir <type>');
program.parse(process.args);
const options = program.opts();
console.log(URL, URLSearchParams, 88888);
class Serve {
    constructor(config) {
        this.port = config.port || 3000;
        this.host = this.host || "localhost"
        this.dirPath = config.dirPath
    }
    async handleRes (req, res) {
        const urls = url.parse(req.url, true);
        let absFilePath = __dirname + urls.pathname;
        const status = await fs.stat(path);
        if (status.isDirectory()) {
            absFilePath = path.join(absFilePath, "index.html")
        }
        this.sendFile(req, res, status, absFilePath)
    }
    sendFile (req, res, status, absFilePath) {
        res.end("chenggon")
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