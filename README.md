## 起源一次重构 & github 没有找到比较好的基于 request 的封装

## 使用

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

## 功能

- 封装 wx.request
- 全局 abort

## 注意事项

- 后端返回数据格式

```js
const result = { statusCode: 200, errMsg, data: { code: 200, data, msg } };
```

## TODO

- wx.getStorageSync 有时候调用有问题，需 try catch 去 retry
- request 同一个请求，第一次展示 wx.showLoading 第二次可以调用 wx.showNavigationBarLoading
