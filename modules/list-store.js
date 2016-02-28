// Get congif from .env
var config = require('dotenv').config();
var store = {};

// File System
if (config.STORE === "FS") {
  var fs = require("fs"),
    path = "./data/todolist.json";

  store = {
    save: function(req, res) {
      fs.writeFile(path, JSON.stringify(req.body, null, 2), function(err) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send('File saved sucessfuly');
        }
      });
    },
    fetch: function(req, res) {
      fs.readFile(path, function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).send("File cannot be read");
        } else {
          res.send(JSON.parse(data));
        }
      });
    }
  };
}

module.exports.getStore = function functionName() {
  return store;
};
