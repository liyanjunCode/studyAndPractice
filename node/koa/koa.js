const eventEmitter = require('events');
const http = require('http');
class Koa extends eventEmitter {
    constructor() {
        super();
        this.callbacks = [];
    }
    async handleResult (req, res) {

        this.handleCbs(req).then(() => {
            console.log("all end")
            res.end("111")
        })
    }
    handleCbs (req) {
        let idx = -1;
        let dispatch = (i) => {
            // if (i > this.callbacks.length - 1) { return Promise.reject("next is max") }
            idx = i;
            const fn = this.callbacks[i];
            try {
                return Promise.resolve(fn(req, () => dispatch(idx + 1)))
            } catch (err) {
                // Promise.reject(err)
            }

        }
        return dispatch(0);
        // return Promise.resolve(fn(req, () => dispatch(idx + 1)))
    }
    use (cb) {
        this.callbacks.push(cb)
    }
    listen (...args) {
        const server = http.createServer(this.handleResult.bind(this));
        server.listen(...args)
    }
}
module.exports = Koa