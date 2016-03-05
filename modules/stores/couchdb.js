var todo = require('nano')('http://localhost:5984/todo'),
  currentRev = null; // Holds the previous rev value which will need to be passed to next update.

module.exports = {
  save: function(req, res) {
    if (currentRev !== null) {
      req.body._rev = currentRev;
    }

    todo.insert(req.body, "todoList", function(err, body, header) {
      if (err) {
        console.log('[todo.insert] ', err.message);
        res.status(err.statusCode).send(err.description);
      }

      //console.log('You have inserted Todo list');
      //console.log("ERR: ", err);
      currentRev = body ? body.rev : null;
      console.log("Save, Current Revision: ",  currentRev, "\nBODY: ", body);
      res.send(body);
    });
  },
  fetch: function(req, res) {
    todo.get('todoList', function(err, body) {
      if (err) {
        console.log("Error: ", err);
        res.status(err.statusCode).send(err.description);
      }

      //console.log(body);
      currentRev = body ? body._rev : null;
      console.log("Fetch, Current Revision: ",  currentRev);
      res.send(body);
    });
  }
};
