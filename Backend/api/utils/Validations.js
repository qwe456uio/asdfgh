var mongoose = require('mongoose');

module.exports.isString = function(str) {
  return typeof str === 'string';
};

module.exports.isNumber = function(num) {
  return !isNaN(num);
};

module.exports.isBoolean = function(bool) {
  return (
    bool === true ||
    bool === false ||
    toString.call(bool) === '[object Boolean]'
  );
};

module.exports.isObject = function(obj) {
  return typeof obj === 'object';
};

module.exports.isArray = function(arr) {
  return Array.isArray(arr);
};

module.exports.isObjectId = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports.matchesRegex = function(str, regex) {
  return regex.test(str);
};
module.exports.isValidDate = function (s) {
  var bits = s.split('/');
  var d = new Date(bits[2], bits[1] - 1, bits[0]);
  return d && (d.getMonth() + 1) == bits[1];
};
module.exports.isValidPassword = function(str) {
  return (str.length >= 8);
};