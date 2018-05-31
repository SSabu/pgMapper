const express = require('express');
const app = express();
const pg = require('pg');
const env = require('dotenv').load();
const url = require('url');

// const config = {
//   user: 'sandeepsabu',
//   password: 'Spi9dlee6',
//   host: 'ssdbinstance.cs3dgspl0uzj.us-west-1.rds.amazonaws.com',
//   database: 'sfparks',
//   port: '5432'
// };

const config = "postgres://sandeepsabu:Spi9dlee6@ssdbinstance.cs3dgspl0uzj.us-west-1.rds.amazonaws.com:5432/sfparks";

var query = "SELECT ST_AsGeoJSON(wkb_geometry) FROM sfparks;";

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'SF Park Finder' });
});

/* GET Postgres JSON data */

app.get('/map', function(req, res, next) {
  pg.connect(config, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    console.log('connected to database');
    client.query(query, function(err, result) {
      done();
      if (err) {
        return console.error('error running query', err);
      }
      res.render('map', {title:'Click on map to locate nearby parks. Click refresh to reload parks.', result:result});
    });
  });
});

app.post('/map', function(req, res, next) {

  var coordinates = req.body['lonlat[]'];

  let lon = Number(coordinates[0]);
  let lat = Number(coordinates[1]);

  let nearestQuery = "SELECT ST_AsGeoJSON(wkb_geometry) FROM sfparks ORDER BY wkb_geometry <-> ST_SetSRID(ST_MakePoint("+lon+","+lat+"), 4326) LIMIT 5;";

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

module.exports = app;
