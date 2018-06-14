const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

const convertOnToBool = (object) => {
  let mutatedObject = object;
  mutatedObject.on = Boolean(mutatedObject.on);
  return JSON.stringify(mutatedObject);
};

app.use(bodyParser.urlencoded({
  extended: false,
}));

app.post('/', (request, response, next) => {
  const dataString = Object.keys(request.body)[0];
  const data = JSON.parse(dataString);
  const body = convertOnToBool(data.body);
  const proxiedRequest = https.request(data.options);

  console.log(`
    Sending: ${body}
         To: ${JSON.stringify(data.options)}`);

  proxiedRequest.write(body);

  proxiedRequest.end();

  next();
});

app.listen(3000);
