import getUrl from './libs/getUrl';
import Promisify from './libs/promisify';
import report from './libs/report';
import User from './libs/user';
import doLogin from './libs/doLogin';
import requestTasks from './libs/requestTasks';

const regeneratorRuntime = require('./libs/regenerator-runtime/runtime-module');

const DEFAULT_CONFIG = {
  showLoading: true,
  needAuthLogin: true,
  autoCatch: true
};

//promisify wx api
const wxlogin = Promisify(wx.login);
const requestPromise = Promisify(wx.request);

/**
 * 逻辑判断登录函数
 */
const request = async (url, data = {}, oriConfig = {}) => {
  oriConfig = { ...DEFAULT_CONFIG, ...oriConfig };
  const args = { url: getUrl(url), data, oriConfig };

  const user = User.get();

  if (oriConfig.needAuthLogin && !user.id) {
    await doLogin();
  }

  if (oriConfig.needWxCode) {
    const { code } = await wxlogin();
    args.data.code = code;
  }

  return doReqWithConfig(args);
};

//业务上的请求逻辑代码处理和封装
const doReqWithConfig = async args => {
  let requestTaskKey;

  const { url, data, oriConfig } = args;
  const { showLoading, contentType, autoCatch, loadingTxt, ...config } = oriConfig;

  if (showLoading) {
    loadingTxt ? wx.showLoading({title:loginTxt}) : wx.showLoading();
  }

  const requestTaskPromisify = requestPromise({
    url,
    data,
    method: config.method || 'POST',
    header: {
      Authorization: User.get().Authorization,
      'Content-Type': contentType || 'application/x-www-form-urlencoded'
    }
  })
    .then(async result => {
      console.log('result', result);

      const { statusCode, data: wrapData, errMsg } = result;
      const { code, data, msg, message } = wrapData || {};
      
      if (statusCode == 200 && code == 200) {
        return data;
      }
      //reLogin
      if ((code >= 10000 && code <= 10010)) {
        wx.showLoading({title:'重新登陆...'});
        await doLogin();
        return doReqWithConfig(args);
      }
      //other code
      return Promise.reject({
        code: code || statusCode,
        errMsg: msg || message || errMsg
      });
    })
    .catch(error => {
      console.log(error, 'error');

      let { errMsg = '', code } = error;

      //code=502 ，essMsg 可能为ok
      if (~errMsg.indexOf('request:ok')) {
        errMsg = '';
      }

      if (~errMsg.indexOf('interrupted') || ~errMsg.indexOf('abort')) return;

      report({ url, msg: errMsg, data: args, isShow: autoCatch, code });
    })
    .finally(e => {
      //complete delete requestTast
      showLoading && wx.hideToast();
      requestTasks.remove(requestTaskKey);
    });

  //方便使用requestTask.abort()A
  requestTaskKey = requestTasks.add(url, requestTaskPromisify.origin);

  return requestTaskPromisify;
};

module.exports = request;
