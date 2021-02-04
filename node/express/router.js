const url = require('url');
const Route = require("./route");
const Layer = require("./layer");
const methods = require("methods");
function Router () {
    this.stack = [];
}
Router.prototype.route = function (path) {
    const route = new Route();
    const layer = new Layer(path, route.dispatch.bind(route));
    // 最后会通过route区分是中间件还是路由处理，中间件没有routes
    layer.route = route;
    this.stack.push(layer);
    return route;
}
methods.forEach(method => {
    Router.prototype[method] = function (path, handlers) {
        let route = this.route(path);
        route[method](handlers);
    }
})

Router.prototype.handle = function (req, res, out) {
    const { pathname } = url.parse(req.url, true);
    let idx = 0;
    const next = (err) => {
        if (idx >= this.stack.length) { return out() }
        const layer = this.stack[idx++];
        // 因为是路由下处理函数数组的具体处理，
        // 所以需要处理中间件和处理函数的不同
        // 中间件有专门的错误处理函数
        if (err) {
            if (layer.route) {
                next(err)
            } else {
                console.log(111111111111)
                console.log(next, "next", err)
                layer.handle_error(err, req, res, next)
            }
        } else {
            if (layer.match(pathname)) {
                if (!layer.route) {
                    // 不存在 就是处理中间件,中间件没有route
                    layer.handle_request(req, res, next)
                } else {
                    // 方法type不正确就查找下一个
                    if (layer.route.methods[req.method.toLowerCase()]) {
                        // route 存在route是正常方法请求处理
                        layer.handle_request(req, res, next)
                    } else {
                        next();
                    }
                }
            } else {
                next();
            }
        }
    }
    next()
}
// 中间件只存在一个函数
Router.prototype.use = function (path, handler) {
    if (typeof path == "function") {
        handler = path;
        path = '/';
    }
    const layer = new Layer(path, handler);
    // 标识是中间件
    layer.route = undefined;
    this.stack.push(layer);
}
module.exports = Router