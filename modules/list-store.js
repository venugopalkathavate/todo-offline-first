// Get congif from .env
module.exports.getStore = function functionName() {
  return require(
    './stores/' +
    require('dotenv').config().STORE.toLowerCase() +
    ".js"
  );
};
