
let buf1 = Buffer.alloc(9);
let buf2 = Buffer.from("艳军")
let buf3 =Buffer.from([97,98,99])

// buf2.copy(buf1)
// console.log(buf1.byteLength)
// buf3.copy(buf1,6,0,1)
// console.log(buf1.toString())
// Buffer.prototype.myCopy = function(target,targetStart=0,sourceStart=0, sourceEnd=this.length){
//     for(let i=sourceStart; i<sourceEnd;i++){    
//         target[targetStart++] = this[i];
//     }
// }
// buf2.myCopy(buf1)
// console.log(buf1.toString())
// buf3.myCopy(buf1,6,0,1)
// console.log(buf1.toString())
console.log(Buffer.concat([buf2,buf3]).toString())

Buffer.myConcat = function(bufList,len=bufList.reduce((prev,cur)=> prev+cur.length,0)){
    const targetBuf = Buffer.alloc(len);
    let offset = 0;
    bufList.forEach(buffer => {
        for(let i=0; i<buffer.length; i++){
            targetBuf[offset++] = buffer[i];
        }
    });
    return targetBuf;
}
console.log(Buffer.myConcat([buf2,buf3]).toString())

