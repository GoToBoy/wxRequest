import Promisify from './libs/promisify';
import getUrl from './libs/getUrl';
import User from './libs/user';
import report from './libs/report';
import requestTasks from './libs/requestTasks';

const regeneratorRuntime = require('./libs/regenerator-runtime/runtime-module');

let userLoginPromisify = null;
const LOGIN_API = 'auth/weixin/login'


module.exports = async function() {
  //并发请求登录时候 
  if (userLoginPromisify) return userLoginPromisify;

  const { code } = await Promisify(wx.login)();

  let reuqestTaskKey;

  userLoginPromisify = Promisify(wx.request)({
    url: getUrl(LOGIN_API),
    data: { code },
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(result => {
      console.log('user result', result);
      const { data: wrapData, statusCode, errMsg } = result;
      const { data, code, msg, message } = wrapData || {};

      if (statusCode == 200 && code == 200) {
        User.set(data);
        userLoginPromisify = Promise.resolve(data);
        return data;
      }

      report({
        isShow: true,
        url: 'user login',
        msg: msg || message || errMsg,
        code: code || statusCode
      });
    })
    .catch(error => {
      console.log(error, 'userlogin error');
    })
    .finally(() => {
      requestTasks.remove(reuqestTaskKey);
    });

  reuqestTaskKey = requestTasks.add('user/login', userLoginPromisify.origin);

  return userLoginPromisify;
};
