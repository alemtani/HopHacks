var express = require('express');
var router = express.Router();

var utils = require('../lib/utils');

// Imports the Google Cloud Prediction Service Client library
const {PredictionServiceClient} = require('@google-cloud/aiplatform');

// Specifies the location of the api endpoint
const clientOptions = {
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
};

// Instantiates a client
const predictionServiceClient = new PredictionServiceClient(clientOptions);

const project = '929297422851';
const location = 'us-central1';
const endpointId = '8197378154558390272';

const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;

/* GET home page. */
router.get('/', async function(req, res, next) {
  const url = req.body.url;
  const domain = utils.get_domain(url);

  const scores = [];

  scores.push(utils.validate_ip(domain));
  scores.push(utils.get_length(url));
  scores.push(utils.validate_tinyurl(domain));
  scores.push(utils.contains_at(url));
  scores.push(utils.locate_redirect(url));
  scores.push(utils.contains_dash(url));
  scores.push(utils.count_dots(url));

  const httpsScore = utils.validate_https(url);

  const myPromise = new Promise((resolve, reject) => {
    if (httpsScore === -1) {
      utils.verify_whois(domain, function(scores) {
        resolve(scores);
      });
    } else {
      resolve([1, 1, 1]);
    }
  });

  myPromise
  .then(result => {
    scores.push(result[0]);
    scores.push(result[1]);
    scores.push(httpsScore);
    scores.push(0);
    scores.push(result[0]);
    scores.push(0);
    scores.push(result[2]);
    scores.push(result[0]);
  });

  const anchorsScore = await utils.get_anchors(url, domain);
  const iframeScore = await utils.get_iframe(url);

  scores[10] = anchorsScore;
  scores[12] = iframeScore;

  const instances = [scores, scores];

  const request = {
    endpoint,
    instances,
  };

  // Predict request
  try {
    const [response] = await predictionServiceClient.predict(request);
    const [prediction] = response.predictions[0];
    res.status(200).json({prediction});
  } catch {
    let total = 0;
    scores.forEach((score) => {
      total += score;
    });
    const prediction = total / scores.length;
    console.log(prediction);
    res.status(200).json({prediction});
  }
});

module.exports = router;
