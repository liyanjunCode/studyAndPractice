function Layer (path, handler) {
    this.path = path;
    this.handler = handler
}
Layer.prototype.match = function (path) {
    if (this.route) {
        return path === this.path;
    }
    if (!this.route) {

        if (this.path == '/') {
            // 中间件的路径是/ 就是不管什么路径都执行
            return true;
        }
        // 不存在就是中间件， 中间件可能只写路径前一部分
        return path.startsWith(this.path + '/');
    }
    return false;
}
Layer.prototype.handle_request = function (req, res, next) {
    this.handler(req, res, next);
}

module.exports = Layer