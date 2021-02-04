const Layer = require("./layer");
const methods = require("methods");
function Route (path, handler) {
    this.stack = [];
    this.methods = {}
}
methods.forEach(method => {
    Route.prototype[method] = function (handlers) {
        // 路径没用， 主要是回掉函数
        handlers.forEach((handler, index) => {
            const layer = new Layer("/", handler);
            layer.method = method;
            this.methods[method] = true;
            this.stack.push(layer);
        });
    }
})

Route.prototype.dispatch = function (req, res, out) {
    let idx = 0;
    const next = (err) => {
        if (err) { return out(err); }
        if (idx >= this.stack.length) { return out() }
        const layer = this.stack[idx++];
        if (req.method.toLowerCase() === layer.method) {
            layer.handle_request(req, res, next);
        } else {
            next();
        }
    }
    next();
}
module.exports = Route