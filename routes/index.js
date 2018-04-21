var express = require('express');
var router = express.Router();
var pg = require('pg');

const config = {
  user: 'sandeepsabu',
  database: 'postgis_test',
  password: 'Tranny9Whorus',
  port: 5432
};

// Setup connection
// var username = "sandeepsabu";
// var password = "Tranny9Whorus";
// var host = "localhost";
// var database = "postgis_test";
// var port = "5432";
// var conString = "postgres://"+host+"/"+database;

var query = "SELECT ST_AsGeoJSON(wkb_geometry) FROM parks;";

var pool = new pg.Pool(config);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Postgres JSON data */

router.get('/data', function(req, res, next) {
  pool.connect(function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log('connected to database');
    client.query(query, function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
});

/* GET map page. */

router.get('/map', function(req, res) {
  res.render('map')
});

module.exports = router;
