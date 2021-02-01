const Koa = require("./koa");

const app = new Koa();
app.use(async (ctx, next) => {
    console.log('1-start')
    await next();
    console.log('1-end')
})
app.use(async (ctx, next) => {
    console.log('2-start')
    await next();
    console.log('2-end')
})
app.on("error", (e) => {
    console.log(e, "error")
})
app.listen(8080, () => {
    console.log('启动成功11111')
})