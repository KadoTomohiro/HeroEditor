'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTION');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Start server
server.listen(port, process.env.OPENSHIFT_NODEJS_IP || process.env.IP || undefined, function () {
  console.log('Express server listening on %d, in %s mode', port, app.get('env'));
});

const items = require('./helos.json');
let lastId = Math.max.apply(null, items.map(hero => hero.id));

app.get('/api/heroes', function (req, res) {
  let returnItem = items;

  if (req.query.name) {
    let regexp = new RegExp(req.query.name, 'i');
    returnItem = items.filter(hero => {
      return hero.name.match(regexp);
    });
  }

  res.status(200).json(returnItem);
});

app.get('/api/heroes/:id', function (req, res) {
  let id = req.params.id;

  let index = findHeroIndex(id);

  if (index === -1) {
    console.log('not found');
    res.status(404).send(`id:${id} is not found`);
  }

  res.status(200).json(items[index]);
});

app.post('/api/heroes', function (req, res) {

  let hero = req.body;

  hero.id = ++lastId;

  items.push(hero);
  res.status(200).json();
});

app.put('/api/heroes/:id', function (req, res) {
  let id = req.body.id;
  let hero = req.body;
  let index = findHeroIndex(id);
  items[index] = hero;
  res.status(200).json();
});

app.delete('/api/heroes/:id', function (req, res) {
  let id = req.params.id;

  let index = findHeroIndex(id);

  items.splice(index, 1);
  res.status(200).json();
});

function findHeroIndex(id) {

  return items.findIndex(hero => hero.id === +id);

}

exports = module.exports = app;