// 把普通函数变成promise函数
module.exports = api => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      const apiFunc = api(
        Object.assign({}, options, {
          success: resolve,
          fail: reject
        }),
        ...params
      );
      Promise.prototype.finally = function(callback) {
        const P = this.constructor;
        return this.then(
          value => P.resolve(callback()).then(() => value),
          reason =>
            P.resolve(callback()).then(() => {
              throw reason;
            })
        );
      };
      //如request 可以调用 requestTast.abort()
      Promise.prototype.origin = apiFunc;
    });
  };
};
