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
app.use((err, req, res, next) => {
    // console.log("中间件报错", err)
    next("998773")
})
app.listen(8080, () => {
    console.log("server is running")
})