const fs = require("fs");
const exec = require("child_process").exec

/**
 * 清空目录/删除文件
 * !!!谨慎调用!!!
 * @param {String} path 要移除的目录路径
 */
const clean = path => {
  return new Promise((resolve, reject) => {
    console.log(`  ...cleaning ${path} `)
    if (path)
      exec('rm -rf ' + path, function (err) {
        if (err) resolve(false)
        else resolve(true)
      })
    else resolve(false)
  })
}

/**
 * 是否存在
 * @param {String} path 校验的路径
 */
const exists = path => {
  return new Promise(resolve => {
    if (path)
      fs.access(path, fs.constants.F_OK | fs.constants.R_OK, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    else resolve(false)
  });
}

/**
 * 生成目录文件夹
 * @param {String} dir 生成的目录
 */
const mkdir = async dir => {
  let hasDir = await exists(dir)
  if (!hasDir) fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) console.error('  mkdir ' + dir + ' error: ', err)
  })
}

const mkFile = fs.writeFile

/**
 * 自定输出
 * @param {String} txt 输出内容
 * @param {Boolean} oneline 是否输出在同一行
 */
const log = (txt, oneline = false) => {
  if (oneline) {
    process.stdout.write(txt)
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    // process.stdout.write("\n"); // end the line
  } else {
    console.dir.bind(console)(txt)
  }
}

module.exports = { clean, exists, mkdir, mkFile, log }
