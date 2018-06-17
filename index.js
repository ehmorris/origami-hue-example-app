const express = require('express');
const bodyParser = require('body-parser');
const lodashGet = require('lodash.get');
const lodashSet = require('lodash.set');
const requestPromise = require('request-promise-native');
const app = express();

const transformBools = (object, keys) => {
  let mutatedObject = object;

  keys.forEach((key) => {
    const boolValue = lodashGet(mutatedObject, key);
    if (boolValue) {
      lodashSet(mutatedObject, key, Boolean(boolValue));
    }
  });

  return mutatedObject;
};

const parseBody = (bodyString) => {
  return JSON.parse(Object.keys(bodyString)[0]);
};

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.post('/', ({body: requestBody}, proxyResponse) => {
  const data = parseBody(requestBody);
  const transformedData = transformBools(data, ['body.on', 'json']);

  requestPromise(transformedData).then((response) => {
    proxyResponse.send(response);
  }).catch((error) => {
    proxyResponse.send(error);
  });
});

app.listen(3000);
