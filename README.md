# trans-to-miniapp


>|标识|说明|—
>|:-:|-|-
>|**wx**|微信小程序|✔️
>|**q**|QQ小程序|✔️
>|**tt**|字节跳动小程序|✔️
>|**bd**|百度小程序|✔️
>|**a**|支付宝小程序|➖

---

### 相关说明
> - 开发目录在`src`
> - `npm i[nstall]` 安装依赖
> - `npm run [wx|qq|tt|bd]` 转换为对应的小程序代码
> - `npm run [wx|qq|tt|bd]:watch` 转换为对应小程序代码后监听`src`目录下文件变更 并*实时转换代码*
> - 不同小程序开发工具项目目录需指向`dist`下对应标识的目录
> - 小程序API使用时以 `$$.` 代替 `wx.|qq.|tt.|swan.`
> - `_wx_begin_ _wx_end_` 之类的占位 是区分不同小程序代码段的作用，不用理会代码异常报错(共用时: `_qtt_begin_  _qtt_end_ ` 即 QQ小程序和字节跳动小程序共用)
> - 书写样式时，全部使用**类名选择器**，尽量不要出现*标签选择器*，一定不要使用*ID选择器*和*属性选择器*
> - **input**标签一定是自闭合 `<input />` 而不是 ~~`<input></input>`~~
> - 不要出现*自定义标签*，会被某些小程序直接忽略
> - 动态事件绑定时，外层引号必须为双引号，如`<view bindtap="{{isTrue?'tap1':'tap2'}}">`

  ```html
  <!-- html -->
    <view>
      _wx_begin_
      <text>this is weapp</text>
      _wx_end__q_begin_
      <button>this is qqminiapp</button>
      _q_end_
    </view>

    <!-- 转换后 -->
    <!--  weapp: -->
      <view>
        <text>this is weapp</text>
      </view>
    <!--  qqminiapp: -->
      <view>
        <button>this is qqminiapp</button>
      </view>
  ```
  ```css
  /* css */
    .a{
      width: 100%;
      _wx_begin_
      height: 200%;
      _wx_end__q_begin_
      min-height: 180%;
      _q_end_
    }

    /* 转换后 */
    /*  weapp: */
      .a{
        width: 100%;
        height: 200%;
      }
    /*  qqminiapp: */
      .a{
        width: 100%;
        min-height: 180%;
      }
  ```
  ```js
  // js
    _wx_begin_
    $$.redirectTo(...)
    _wx_end__q_begin_
    $$.navigateTo(...)
    _q_end_

    // 转换后
    //  weapp:
      wx.redirectTo(...)
    //  qqminiapp:
      qq.navigateTo(...)

  ```
