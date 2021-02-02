const http = require('http');
const Router = require("./router");
const methods = require("methods");
function Express () {
}
methods.forEach(method => {
    Express.prototype[method] = function (path, ...handler) {
        this.lazy_route();
        this.router[method](path, handler);
    }
})
Express.prototype.listen = function (...args) {
    const app = http.createServer((req, res) => {
        const done = () => {
            res.end("not found")
        }
        this.router.handle(req, res, done);
    });
    app.listen(...args);
}
Express.prototype.lazy_route = function () {
    !this.router && (this.router = new Router());
}
Express.prototype.use = function () {
    this.lazy_route();
    this.router.use(...arguments);
}
function createServer () {
    return new Express();
}

module.exports = createServer