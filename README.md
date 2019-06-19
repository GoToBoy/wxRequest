#### 起源一次重构 & github 没有找到比较好的基于 request 的封装

#### 功能

- 封装 wx.request
- 全局 abort
- 封装小程序的 auth 体系（微信 code
- 封装 用户登录信息 在 getApp().userInfo

#### TODO

- wx.getStorageSync 有时候调用有问题，需 try catch 去 retry
- request 同一个请求，第一次展示 wx.showLoading 第二次可以调用 wx.showNavigationBarLoading
- wx.checkSession 的引入（有点苦力活了

#### 使用

```js
import $req from './request';

$req('xxurl', data, {
  method: 'GET', //method
  showLoading: false, //loading 弹窗
  needWxCode: false, //是否需要微信code
  needAuthLogin: true, //是否需要登录
  autoCatch: true //是否自动处理错误
}).then(data => {
  console.log(data);
});

//app.js 小程序隐藏时候取消所有未返回请求'
import requestTast from './libs/requestTasks';
App({
  //...
  onHide() {
    requestTast.empty();
  }
});
```

#### 注意事项

- 后端返回数据格式

```js
const result = { statusCode: 200, errMsg, data: { code: 200, data, msg } };
```

#### 同类参考

- [TypeScript 版本 weRequest](https://github.com/IvinWu/weRequest)
