const path = require("path");
const { setTimeout } = require("timers");
const {createReadStream} = require("./createReadStream.js");
const fsWrite = createReadStream(path.resolve(__dirname,"./1.text"), {
  flags:"r",
  encoding: "utf8",
  mode: 0o666,
  autoClose: true,
  highWaterMark: 5,
});
fsWrite.on("open", function(fd){
  console.log(fd, "open")
})
let num =true;
fsWrite.on("data",function(chunk) {
  console.log(chunk.toString(),"111")
  if(num) {
    num = false;
    fsWrite.pause();
    
  }
  
})
fsWrite.on("end",function(fd) {
  console.log(fd, "end")
})
fsWrite.on("close",function(fd) {
  console.log(fd, "关闭")
})
setTimeout(()=>{
  console.log("恢复--------------------------------------")
  fsWrite.resume()
}, 1000)