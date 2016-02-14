var express = require('express');
var app = express();

app.use(express.static('dist'));
app.use(express.static('node_modules'));

app.get('/todolist', function(req, res) {
  	res.send('hello world');
});

app.listen(3000);
console.log("Server listening on port 3000");