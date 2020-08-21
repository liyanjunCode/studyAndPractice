const fs = require("fs");
const path = require("path");
const vm = require("vm");
class Moudle {
  constructor(id) {
    // 文件路径
    this.id = id;
    // 导出对象
    this.exports = {};
  }
}
Moudle.wraper = [
  '(function(moudle, req, __dirname, __filename){'
  ,
  '})'
]
// 用于加载文件
Moudle.extensions = {
  ".js" (moudle) {
    const content = fs.readFileSync(moudle.id, "utf-8");
    const funStr = Moudle.wraper[0] + content + Moudle.wraper[1];
    const fun = vm.runInThisContext(funStr)
    fun.call(moudle.exports, moudle, req, path.dirname(moudle.id), moudle.id);
  },
  ".json" (moudle) {
    const content = fs.readFileSync(moudle.id, "utf-8");
    moudle.exports = JSON.parse(content);
  }
}
// 查找文件路径
Moudle.resolveFileName = function (fileName) {
  // 相对路径转为绝对路径， 首先要处理带后缀的文件路径
  let absPath = path.join(__dirname, fileName);
  let isExist = fs.existsSync(absPath);
  let current = absPath;
  // 不存在， 就是按不带后缀的处理(无后缀地址)
  if (!isExist) {
    const keys = Object.keys(Moudle.extensions);
    for (let i = 0; i < keys.length; i++) {
      current = absPath + keys[i];
      isExist = fs.existsSync(current);
      if (isExist) {
        break;
      } else {
        current = null;
      }
    }
  }
  if (!current) {
    throw new Error("路径不存在")
  }
  return current
}
// 获取路径的扩展名， 区分调用是获取js的方法还是读取json的方法
Moudle.prototype.load = function (moudle) {
  const ext = path.extname(this.id);
  Moudle.extensions[ext](moudle);
}
// 用于缓存加载过的文件
Moudle.cache = {};
function req (fileName) {
  // 先查看js文件是否存在， 再查看json文件是否存在
  const current = Moudle.resolveFileName(fileName);
  if (Moudle.cache[current]) {
    return Moudle.cache[current].exports;
  }
  // 初始化moudle模块
  const moudle = new Moudle(current);
  Moudle.cache[current] = moudle;
  moudle.load(moudle);
  return moudle.exports
}
const a = req('a');
console.log(a)