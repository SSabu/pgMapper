var express = require('express');
var app = express();

/* GET users listing. */
app.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

app.listen(3000, ()=>console.log('Server running on port 3000'));

module.exports = app;
