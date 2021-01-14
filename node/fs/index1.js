const path = require("path");
const {createReadStream} = require("./createReadStream.js");
const fsWrite = createReadStream(path.resolve(__dirname,"./1.text"), {
  flags:"r",
  encoding: "utf8",
  mode: 0o666,
  autoClose: true,
  highWaterMark: 1,
});
fsWrite.on("open", function(fd){
  console.log(fd, "open")
})
fsWrite.on("data",function(chunk) {
  console.log(chunk)
})
fsWrite.on("end",function(fd) {
  console.log(fd, "end")
})
fsWrite.on("close",function(fd) {
  console.log(fd, "关闭")
})