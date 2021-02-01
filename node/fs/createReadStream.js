const EventEmitter = require("events");
const fs = require("fs");
class ReadStream extends EventEmitter {
    constructor(path, options) {
        super();
        this.offset = 0;
        this.path = path;
        this.flowing = true;
        this.flags = options.flags || "r";
        this.encoding = options.encoding || null;
        this.mode = options.mode || 0o666;
        this.autoClose = options.autoClose || true;
        this.fd = options.fd || undefined;
        this.emitClose = options.emitClose || false;
        this.start = options.start || 0;
        this.end = options.end || Infinity;
        this.highWaterMark = options.highWaterMark || 64 * 1024;
        this.on("newListener", (type)=>{
            if(type == "data") {
               this.read();
            }
        })
        this.open();
    }
    open() {
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
            if(err){return console.log(err)}
            this.fd = fd;
            this.emit("open");
        });  
    }
    read() {
        if(typeof this.fd !== "number") {
            return this.once("open", this.read);
        }
        let newBuffer = Buffer.alloc(this.highWaterMark);
        
        fs.read(this.fd,newBuffer,0, this.highWaterMark, this.offset, (err, bytesRead, buffer)=>{
            if(err){return console.log(err);}
            if(bytesRead) {
                if(this.flowing) {
                    this.offset += bytesRead;
                    this.emit("data", newBuffer);  
                    this.read();
                } 
            } else {
                this.emit("end",this.fd)
                if(this.autoClose) {
                    fs.close(this.fd, (err) => {
                        if(err){return console.log(err)}
                        this.emit("close");
                    })
                }
            }   
        })
    }
    pause(){
        this.flowing = false;
    }
    resume(){
        this.flowing = true;
        this.read();
    }
}

function createReadStream(path,options){
    return new ReadStream(path,options)
}
module.exports = {createReadStream};