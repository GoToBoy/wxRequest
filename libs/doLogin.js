import Promisify from './libs/promisify';
import getUrl from './libs/getUrl';
import User from './libs/user';
import report from './libs/report';
import requestTasks from './libs/requestTasks';

const regeneratorRuntime = require('./libs/regenerator-runtime/runtime-module');

const tryLoginCounts = 4;
const LOGIN_API = 'auth/weixin/jscodeLogin'

let userLoginPromisify = null;
let reuqestTaskKey;


function doLogin() {
  
  console.log(userLoginPromisify, !!userLoginPromisify, +new Date());
  
  if (userLoginPromisify) return userLoginPromisify;

  const doTryLogin = (resolve)=>{
    if(doLogin.tryCounts ? doLogin.tryCounts <= tryLoginCounts : true){
      resolve(doLogin());
      doLogin.tryCounts = (doLogin.tryCounts||0) +1;
      return true;
    } else{
      return false;
    }
  }

  const doCatchError = (err,msg)=>{
    wx.showToast({ title: msg||'jscodeLogin登录失败', icon: 'none' });
    report({
      isShow: true,
      url: LOGIN_API,
      msg: JSON.stringify(err)
    });
  }

  userLoginPromisify = new Promise(resolve => {
    wx.login({
      success(r) {
        const wxReqInstance = wx.request({
          url: getUrl(LOGIN_API),
          data: { code: r.code },
          method: 'POST',
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success(result) {
            console.log('user result', result);

            const { data: wrapData, statusCode, errMsg } = result;
            const { data, code, msg, message } = wrapData || {};

            if (statusCode == 200 && code == 200) {
              User.set(data);
              return resolve(data);
            }

            report({
              isShow: true,
              url: 'user login',
              msg: msg || message || errMsg,
              code: code || statusCode
            });
          },
          fail(err) {
            !doTryLogin(resolve) && doCatchError(err)
          },
          complete() {
            requestTasks.remove(reuqestTaskKey);
          }
        });
        reuqestTaskKey = requestTasks.add('user/login', wxReqInstance);
      },
      fail(e){
        !doTryLogin(resolve) && doCatchError(e,'微信登陆失败～')
      }
    });
  })
};
