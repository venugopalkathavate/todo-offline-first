// Get congif from .env
var stores = {
  fs: "fs",
  couchdb: "couchdb",
  mongodb: "mongodb"
};

module.exports.getStore = function functionName() {
  return require(
    './stores/' +
    stores[require('dotenv').config().STORE.toLowerCase()] +
    ".js"
  );
};
