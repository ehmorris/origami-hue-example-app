const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use((request, response, next) => {
  const host = request.query.host;
  const path = request.query.path;
  const headers = {
    'Authorization': request.query.authorization,
    'Content-Type': request.query.contentType,
  };

  const options = {
    host: host,
    path: path,
    method: 'PUT',
    headers: headers,
  };

  const proxiedRequest = https.request(options, (realResponse) => {
    let responseString = '';

    realResponse.on('data', (data) => {
      responseString += data;
    });

    realResponse.on('end', () => {
      console.log(responseString);
    });
  });

  let body = JSON.parse(Object.keys(request.body)[0]);
  body.on === 1 ? body.on = true : body.on = false;

  proxiedRequest.write(JSON.stringify(body));
  proxiedRequest.end();

  next();
});

app.post('/', (request, response) => {
  response.json({});
});

app.listen(3000);
