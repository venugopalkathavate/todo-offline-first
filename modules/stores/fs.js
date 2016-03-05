var fs = require("fs"),
  path = "./data/todolist.json";

module.exports = {
  save: function(req, res) {
    console.log(req.body);
    fs.writeFile(path, JSON.stringify(req.body, null, 2), function(err) {
      if (err) {
        res.status(500).send(err);
      } else {
        console.log('File saved sucessfuly');
        res.send(req.body);
      }
    });
  },
  fetch: function(req, res) {
    fs.readFile(path, function(err, data) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send(JSON.parse(data));
      }
    });
  }
};
