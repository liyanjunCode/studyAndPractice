
let buf1 = Buffer.alloc(9);
let buf2 = Buffer.from("艳军")
let buf3 =Buffer.from([97,98,99])

buf2.copy(buf1)
console.log(buf1.byteLength)
buf3.copy(buf1,6,0,1)
console.log(buf1.toString())
Buffer.prototype.myCopy = function(target,targetStart,sourceStart, sourceEnd){

}