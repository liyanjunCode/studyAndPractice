const http = require('http');
function Express () {

}
Express.prototype.handler = function (req, res) {
    console.log(req, res)
}
Express.prototype.listen = function (...args) {
    const app = http.createServer(this.handler.bind(this));
    app.listen(...args);
}
function createServer () {
    return new Express()
}
module.exports = createServer