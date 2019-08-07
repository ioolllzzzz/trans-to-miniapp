
const config = {
  "filename": "project.config.json",
  "description": "项目配置文件",
  "packOptions": {
    "ignore": []
  },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "postcss": true,
    "minified": true,
    "newFeature": true,
    "nodeModules": false,
    "autoAudits": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "sourcemapDisabled": true
  },
  "compileType": "miniprogram",
  "projectname": "trans-to-miniapp",
  "debugOptions": {
    "hidedInDevtools": []
  },
  "scripts": {},
  "simulatorType": "wechat",
  "simulatorPluginLibVersion": {},
  // "condition": {
  //   "search": {
  //     "current": -1,
  //     "list": []
  //   },
  //   "conversation": {
  //     "current": -1,
  //     "list": []
  //   },
  //   "plugin": {
  //     "current": -1,
  //     "list": []
  //   },
  //   "game": {
  //     "list": []
  //   },
  //   "miniprogram": {
  //     "current": -1,
  //     "list": []
  //   }
  // }
}

module.exports = {
  inputRoot: 'src',
  outputRoot: 'dist',

  configs: {
    wx: {
      ...config,
      "appid": "",
      "libVersion": "2.5.1"
    },
    qq: {
      ...config,
      "qqappid": "",
      "qqLibVersion": "1.2.3",
    },
    tt: {
      ...config,
      "appid": ""
    },
    bd: {
      "filename": "project.swan.json",
      "appid": "",
      "compilation-args": { "options": [], "selected": -1 },
      "editor": { "curPath": "", "expands": [], "paths": [], "recentlyFiles": [] },
      "host": "baiduboxapp",
      "minSwanVersion": "1.6.16",
      "setting": { "urlCheck": false },
      "swan": { "baiduboxapp": { "swanJsVersion": "3.30.40", "extensionJsVersion": "" } }
    }
  }
}