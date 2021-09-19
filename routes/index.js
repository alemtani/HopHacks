var express = require('express');
var router = express.Router();
// var axios = require('axios');

var utils = require('../lib/utils');

// Features we should use
// 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.12, 2.2, 2.6, 4.1, 4.2

/* GET home page. */
router.get('/', async function(req, res, next) {
  const url = 'https://amazon.com';
  const domain = utils.get_domain(url);
  const score = await utils.get_iframe(url);
  console.log(score);
  res.render('index', { title: 'Express' });
});

module.exports = router;
