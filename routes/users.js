var express = require('express');
var app = express();

/* GET users listing. */
app.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = app;
