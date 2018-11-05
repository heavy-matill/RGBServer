var express = require('express');
var router = express.Router();
var mqttController = require('../controllers/mqttController');
var socketApi = require('../controllers/socketController');
var io = socketApi.io;

/* GET home page. */
router.get('/', function(req, res, next) {
  mqttController.publish('presence','Hi there!');
  res.render('index', { title: 'Express' });
});

module.exports = router;
