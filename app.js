var todoList = require("./routes/todo-list");
var store = require("./modules/list-store").getStore();
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('dist'));
app.use(express.static('node_modules'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/todolist', function(req, res) {
  store.readFile("data/todolist.json", function(err, data) {
    if (err) {
      res.send('Could read file');
    } else {
      res.send(JSON.parse(data));
    }
  });
});

app.post('/todolist', function(req, res) {
  console.log(JSON.stringify(req.body, null, 2));
  store.writeFile("data/todolist.json", JSON.stringify(req.body, null, 2), function(err) {
    if (err) {
      res.send('Could not save file');
    } else {
      res.send('File saved sucessfuly');
    }
  });
});

app.listen(3001);
console.log("Server listening on port 3001");
