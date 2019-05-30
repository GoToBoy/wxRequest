const AUTH = 'BETA_USER'
//TODO:增加try catch retry事件，消
const Session = {
  get() {
    return wx.getStorageSync(AUTH) || null;
  },
  set(session) {
    wx.setStorageSync(AUTH, session);
  },
  clear() {
    wx.removeStorageSync(AUTH);
  }
};

module.exports = {
  get() {
    return Session.get() || {};
  },
  set(user) {
    //set global userinfo
    getApp && getApp().userInfo = user;

    Session.set(user);
  }
};
