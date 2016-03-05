var todoList = require("./routes/todo-list");
var storeService = require("./modules/list-store").getStore();
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
  storeService.fetch(req, res);
});

app.post('/todolist', function(req, res) {
  //console.log(req.body);
  storeService.save(req, res);
});

app.listen(3001);
console.log("Server listening on port 3001");
