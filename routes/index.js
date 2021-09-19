var express = require('express');
var router = express.Router();
// var axios = require('axios');

var utils = require('../lib/utils');

// Features we should use
// 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.12

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
