const express = require("./express");
const app = express();
app.get("/a", (req, res, next) => {
    console.log('a')
    next()
}, (req, res, next) => {
    console.log('b')
    next()
})
app.post("/a", (req, res, next) => {
    console.log('a')
})
app.get("/b", (req, res) => {
    console.log('c')
    res.end('is b')
})
// , function () {
//     console.log(222)
//     res.end("is ok")
// }
app.listen(8080, () => {
    console.log("server is running")
})