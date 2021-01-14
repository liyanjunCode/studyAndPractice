const EventEmitter = require("events");
const fs = require("fs");
class ReadStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.fd = null;
        this.path = path;
        this.flags = options.flags || "r";
        this.encoding = options.encoding || null;
        this.mode = options.mode || 0o666;
        this.autoClose = options.autoClose || true;
        this.fd = options.fd || null;
        this.emitClose = options.emitClose || false;
        this.start = options.start || 0;
        this.end = options.end || Infinity;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.open();
    }
    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if(err){return console.log(err)}
            this.fd = fd;
        })
    }
}

function createReadStream(path,options){
    return new ReadStream(path,options)
}
module.exports = {createReadStream};