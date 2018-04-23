const express = require('express');
const router = express.Router();
const pg = require('pg');
const env = require('dotenv').load();
const url = require('url');
const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
  user: auth[0],
  password: auth[1],
  database: params.pathname.split('/')[1],
  port: params.port
};

//ST_AsGeoJSON(wkb_geometry)

var query = "SELECT ST_AsGeoJSON(wkb_geometry) FROM parks;";

var pool = new pg.Pool(config);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Postgres JSON data */

router.get('/map', function(req, res, next) {
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
      res.render('map', {result:result});
    });
  });
});

router.post('/map', function(req, res, next) {

  var coordinates = req.body['lonlat[]'];

  let lon = Number(coordinates[0]);
  let lat = Number(coordinates[1]);

  let nearestQuery = "SELECT ST_AsGeoJSON(wkb_geometry) FROM parks ORDER BY wkb_geometry <-> ST_SetSRID(ST_MakePoint("+lon+","+lat+"), 4326) LIMIT 5;";

  pool.connect(function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log('connected to database again');
    client.query(nearestQuery, function(err, data) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.send(data);
    });
  });
});

module.exports = router;
