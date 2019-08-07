//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = $$.getStorageSync('logs') || []
    logs.unshift(Date.now())
    $$.setStorageSync('logs', logs)

    // 登录
    $$.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        _wx_begin_
        console.log('wx.login',res)
        _wx_end_
        _q_begin_
        console.log('qq.login',res)
        _q_end_
      }
    })
    // 获取用户信息
    $$.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          $$.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})