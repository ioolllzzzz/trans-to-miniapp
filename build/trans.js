/**
 * _prefix_begin_
 * _prefix_end_
 * example: _q_begin_  ...some code...  _q_end_
 * 共用时: _qtt_begin_  ...some code...  _qtt_end_  即 QQ小程序和字节跳动小程序共用
 * 
 * global variable replace $$
 * $$.|$$[ 全局变量使用
 * $$_ 全局变量对象无使用
 * example: $$. ==> wx.|qq.|...
 * $$_  ==> wx|qq|...
 */
const fs = require("fs");
const types = {
  // 微信小程序  wx.[apis]  .wxml  .wxss  wx:
  wx: 1,
  // QQ小程序  qq.[apis]  .qml  .qss  qq:
  qq: 2,
  // 字节跳动小程序  tt.[apis]  .ttml  .ttss  tt:
  tt: 3,
  // 百度小程序  swan.[apis]  .swan  .css  s-
  bd: 4
}

const replaceRgx = /_(\w*?)_begin_([\d\D]*?)_(\1)_end_/g
const dealFileRgx = /\.(json|js|\w*?ml|\w*?ss)$/
const dealFixRgx = /(\.)\w*?(ml|ss)$/
const dealImportRgx = /(?:import|include)[^'"]*?(['"])([\d\D]*?)\1/g
const globalVarRgx = /(\$\$)(\.|\[|_)/g

/**
 * Trans
 */
class Trans {
  constructor({ transType, inRoot, outRoot, encoding = 'utf-8' } = {}) {
    this._transType = transType || this.types.wx
    this._isbd = this._transType === this.types.bd
    this._inRoot = inRoot
    this._outRoot = outRoot
    this._encoding = encoding
  }
  get types() {
    return types
  }
  get typeImp() {
    let type = this.types
    return {
      [type.wx]: {
        prefix: 'wx',
        glb: 'wx'
      },
      [type.qq]: {
        prefix: 'q',
        glb: 'qq'
      },
      [type.tt]: {
        prefix: 'tt',
        glb: 'tt'
      },
      [type.bd]: {
        prefix: 'bd',
        glb: 'swan'
      }
    }
  }

  /**
   * 转换文件名
   * @param {String} filename 待转换的文件名
   */
  toName(filename) {
    let _ = this, imp = _.typeImp[_._transType]


    if (dealFixRgx.test(filename)) {
      // console.log('toName: ', filename, imp, _._transType)
      // 百度小程序特殊处理
      if (_._isbd) {
        return filename.replace('.wxml', '.swan').replace('.wxss', '.css')
      }
      // qq 暂不处理
      // else if (_._transType === _.types.qq) return filename.replace(dealFixRgx, `$1wx$2`)
      else return filename.replace(dealFixRgx, `$1${imp.prefix}$2`)
    } else return filename
  }

  /**
   * 转换文件
   * @param {String} inPath 源文件路径
   * @param {String} outPath 目标文件路径
   */
  toFile(inPath, outPath) {
    // 1. 相应格式(dealFileRgx匹配) 处理内容
    //   1.1 占位处理(存在占位符, 处理replaceRgx)
    //   1.2 全局变量处理($$. => wx.|qq.|tt.|swan.)
    //   // 1.3 引入内容处理(dealImportRgx匹配, 替换成对应后缀)
    //   1.3 页面内处理(wx: => wx:|qq:|tt:|s-), 引用路径处理
    // 2. 非指定处理格式文件直接拷贝
    let _ = this, imp = _.typeImp[_._transType]
    // console.log('toFile: ', inPath, outPath)
    if (dealFileRgx.test(inPath)) {
      // 1.
      fs.readFile(inPath, _._encoding, (err, data) => {
        if (err) console.error('    ' + inPath + ' read error: ', err)
        // console.log('deal content: ', inPath, /.*?\.js$/.test(inPath))
        // 1.1
        if (/_([wx|q|tt|bd])+?_begin_/g.test(data)) {
          data = data.replace(replaceRgx, ($0, matchFix, matchContent) => {
            // console.log('content replace: ', '$0 ', $0, ', matchFix ', matchFix, ', matchContent ' + matchContent)
            if (matchFix === imp.prefix || matchFix.includes(imp.prefix)) return matchContent
            else return ''
          })
        }
        // 1.2
        if (/\.js$/.test(inPath))
          data = data.replace(globalVarRgx, ($0, $1, $2) => imp.glb + ($2 === '_' ? '' : $2))

        // 1.3
        else if (inPath.includes('.wxml')) {
          data = data.replace(/wx:/g, _._isbd ? 's-' : (imp.glb + ':'))

          // 百度小程序
          //   处理 模版引入的路径
          //   模板 传数据是三层花括号
          //   控制属性(不需要被双大括号包裹)
          if (_._isbd)
            data = data
              .replace(dealImportRgx, ($0, $1, $2) => $0.replace($2, $2 + '.' + imp.glb))
              .replace(/template.*?data=['"]{{([\d\D]*?)}}/g, ($0, $1) => $0.replace($1, ' {' + $1 + '} '))
          // .replace(/s-(.*?)=['"]({{.*?}})['"]/g, ($0, $1) => $1.trim().includes(' ') ? $0 : $0.replace(/[{}]/g, ''))
        } 
        //  else if (inPath.includes('.wxss')) {
        // 处理 百度小程序的 css引用
        // if (_._isbd)
        //   data = data.replace(dealImportRgx, ($0, $1, $2) => $0.replace($2, $2 + '.css'))
        // }

        fs.writeFile(outPath, data, _._encoding, (err) => {
          if (err) console.error('    ' + outPath + ' write error: ', err)
        })
      })
    } else {
      // 2.
      fs.copyFile(inPath, outPath, (err) => {
        if (err) console.error('    ' + outPath + ' copy error: ', err)
      })
    }
  }
}
Trans.types = types
module.exports = Trans