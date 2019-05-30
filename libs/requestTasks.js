const requestObj = {};

module.exports = {
  add(key = 'x', obj) {
    const symbolKey = Symbol(key);

    requestObj[symbolKey] = obj;

    return symbolKey;
  },
  empty() {
    if (Object.keys(requestObj).length === 0) return 'ok';

    try {
      for (let [key, value] of requestObj) {
        requestObj[key].abort && requestObj[key].abort();
      }
      return 'ok';
    } catch (error) {
      return 'fail' + error;
    }
  },
  remove(key) {
    requestObj[key] && requestObj[key].abort && requestObj[key].abort();
  }
};
