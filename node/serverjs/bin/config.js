const config = {
    port: {
        options: "-t --port <val>",
        des: "a  port fro serve",
        default: 3000
    },
    host: {
        options: "-h --host <val>",
        des: "a  host fro serve",
        default: 'localhost'
    },
    dirname: {
        options: "-d --dirname <val>",
        des: "a  dir fro serve",
        default: 'public'
    }
}
module.exports = {
    config
}