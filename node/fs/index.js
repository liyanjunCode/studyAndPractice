const fs = require("fs");
const paths = require("path")

function deleteFile (path) {
  if (fs.existsSync(path)) {
    if (fs.existsSync(path)) {
      fs.stat(path, function (err, stats) {
        if (!err) {
          if (stats.isDirectory()) {
            fs.readdir(path, (err, files) => {
              if (!files.length) {
                fs.rmdir(path, () => {
                  console.log('删除文件夹成功')
                })
              }
              if (files.length == '') { }
              files.forEach(item => {
                deleteFile(paths.join(path, item))
              })
            })
          } else {
            fs.unlink(path, () => {
              console.log("删除成功")
            })
          }
        } else {
          console.log(err)
        }
      })
    }
  } else {
    console.log("文件不存在")
    // fs.linkSync(__filename, "1.js")

  }
}
deleteFile("./a")