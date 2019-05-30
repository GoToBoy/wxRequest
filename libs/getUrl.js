const API = 'https://xxx.com'

module.exports = t =>
  void 0 === t
    ? ''
    : 'http' == t.substr(0, 4)
    ? t
    : t.length && '/' == t.charAt(0)
    ? API + t
    : API + '/' + t;
