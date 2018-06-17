const express = require('express');
const bodyParser = require('body-parser');
const lodashGet = require('lodash.get');
const lodashSet = require('lodash.set');
const clone = require('clone');
const requestPromise = require('request-promise-native');
const app = express();

const transformBools = (object, keysToTransform) => {
  const transformedObject = clone(object);

  keysToTransform.forEach((key) => {
    const boolValue = lodashGet(transformedObject, key);
    if (boolValue) {
      lodashSet(transformedObject, key, Boolean(boolValue));
    }
  });

  return transformedObject;
};

const parseBody = (requestBody) => {
  const bodyString = Object.keys(requestBody)[0];
  return JSON.parse(bodyString);
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

app.listen(process.env.PORT || 3000);
