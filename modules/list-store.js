// Get congif from .env
var fs = require("fs");
//var db = the required db;

var dbstore = false;

module.exports.getStore = function functionName() {
  //return (dbstore === true) ? db : fs;
  return fs;
};
