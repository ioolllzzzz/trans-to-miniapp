const path = require("path");
const join = path.join
const chokidar = require('chokidar');
const config = require('./config')
const { clean, mkdir, mkFile, exists, log } = require('./utils')
const Trans = require('./trans')

const getArg = key => {
  const args = process.argv.slice(2)
  let ret = args.find(i => i.indexOf(key + ':') > -1)
  return ret && ret.split(':')[1]
}

const typeKey = getArg('t') || 'wx'
const iswatch = !!getArg('w')

const currConfig = config.configs[typeKey]
const inRoot = config.inputRoot // 'src'
const outDir = config.outputRoot // 'dist'
const outRoot = typeKey
const inPath = (filepath = '') => join(__dirname, '..', inRoot, filepath)
const outPath = (filepath = '') => join(__dirname, '..', outDir, outRoot, filepath)

// 实例化转换器
const _trans = new Trans({ inRoot, outRoot, transType: Trans.types[typeKey] })
// console.log(_trans, _trans.toType, _trans.suffix)

const watch = $ => {
  const watcher = chokidar.watch(inPath(), {
    // ignored: /(^|[\/\\])\../, 
    persistent: iswatch,
    usePolling: true,
  })

  let isfirst = true
  watcher
    .on('ready', () => {
      isfirst = false

      buildConfig()

      log(`Initial complete.`)
      console.timeEnd('completed in')
      if (iswatch) console.log('  watching... ')
    })
    .on('all', (event, path, stats) => {
      // "add" | "addDir" | "change" | "unlink" | "unlinkDir"
      let inSplit = join(`/${inRoot}/`)
      let outSplit = join(`/${outRoot}/`)
      let inTemp = path.split(inSplit)[1]
      let temp = outPath(inTemp)
      log(`${event} -> ${inSplit}${inTemp}  ==> ${outSplit}${temp.split(outSplit)[1]}`, isfirst)
      switch (event) {
        case 'addDir':
          mkdir(temp)
          break;
        case 'unlinkDir':
          clean(temp)
          break;

        case 'add':
        case 'change':
        case 'unlink':
          let toPath = _trans.toName(temp)
          if (event === 'unlink') clean(toPath)
          else _trans.toFile(path, toPath)
          break;
        default:
          console.error(`  unknow event type ${event}.`)
          break;
      }

    });
}

const buildConfig = $ => {
  // console.log('buildConfig curr: ', currConfig)
  let configDir = outPath(currConfig.filename)
  mkFile(configDir, JSON.stringify(currConfig), 'utf-8', (err) => {
    if (err) console.error('    build config[' + configDir + '] error: ', err)
  })
}

const build = async $ => {
  console.time('completed in')
  let outRootDirPath = join(__dirname, '..', outDir), outDirPath = outPath()
  let outRootDirExists = await exists(outRootDirPath)
  if (!outRootDirExists) mkdir(outRootDirPath)

  console.log('...cleaning')
  await clean(outDirPath)
  console.log('...cleaning done.')
  console.log('...transforming files')

  watch()
}

build()
