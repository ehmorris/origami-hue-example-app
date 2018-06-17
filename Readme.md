### Origami Hue Example App

`Origami Hue Example App.origami` is an [Origami](https://origami.design/) prototype that turns a Hue light on and off.

Requests from the prototype to Hue have to go through a proxy, `index.js`, so they can be correctly formatted. Origami doesn’t yet have fine-grained control over request headers and methods.

The proxy in this repo uses Node and Express, and it expects a request body like this, which is what Origami sends:

```
{ '{
  "uri": "https://api.meethue.com/bridge/<whitelist-id>/lights/1/state",
  "method": "PUT",
  "headers": {
    "Authorization": "Bearer <access-token>",
    "Content-Type": "application/json"
  },
  "body": {
    "on": 1,
    "bri": 200
  }
}' : '' }
```

-----

#### Getting started

To run the server, run `yarn start` or `node index.js` from the project folder. The server should start at `http://localhost:3000`.

In the Origami prototype, make the following changes to send a real request:

* Edit the “Default Body” splitter patch to include your own whitelist id, access token, and light id.
* If you’re not running the proxy at `http://localhost:3000`, edit the “Proxy Host” splitter patch to your new proxy url.

![](https://i.imgur.com/hAS67Ru.png)

-----

#### Using with Origami Live

To run this Hue app from Origami Live, without being connected to a computer, the proxy server has to be run from a domain, rather than localhost.

Heroku is a free and easy way to do this, and this project will work from Heroku. Here’s an outline of the steps:

* Create a Heroku account and create a new app.
* Under the app’s settings tab, add the heroku/nodejs buildpack.
* Push the code to the new app via one of Heroku’s deployment methods. Connecting Heroku to [Dropbox](https://devcenter.heroku.com/articles/dropbox-sync) or [Github](https://devcenter.heroku.com/articles/github-integration) are easy options.
* Copy the Heroku domain e.g. `https://your-app.herokuapp.com` into the “Proxy Host” splitter patch.
* Load the prototype onto your phone, disconnect, and enjoy!

-----

### Getting an access token and whitelist id from Hue

Once you have a Hue developer account, you can create an app and [find the official documentation here](https://www.developers.meethue.com/documentation/remote-hue-api).

In short, you must take the following steps:

1. Navigate to a url like this, but with your own client id and app name. Login to your Hue account and approve access to your new Hue app. You’ll be redirected to your app’s callback url, with a query param containing a short code that you’ll use for the next step.

```
https://api.meethue.com/oauth2/auth?clientid=<your-client-id>&response_type=code&state=abc&deviceid=<your-device-id>&appid=<your-app-name>
```

2. Make a POST request to the following url, replacing the code with your own, and using an Authorization token that’s a base64 encoded string of your app’s id and secret e.g. `base64(clientid:clientsecret)`. You’ll receive a response containing an access token.

```
echo -n clientid:clientsecret | openssl base64
```

```
curl -X POST \
  'https://api.meethue.com/oauth2/token?code=<your-code>&grant_type=authorization_code' \
  -H 'Authorization: Basic <your-token>' \

```

3. Make a PUT request to the following url, replacing the access token with your own. Proceed immediatly to the next step.

```
curl -X PUT \
  https://api.meethue.com/bridge/0/config \
  -H 'Authorization: Bearer <your-access-token>' \
  -H 'Content-Type: application/json' \
  -d '{ "linkbutton": true }'
```

4. Make a POST request to the following url, replacing the access token and app name with your own. You’ll receive a response containing a whitelist id.

```
curl -X POST \
  https://api.meethue.com/bridge \
  -H 'Authorization: Bearer <your-access-token>' \
  -H 'Content-Type: application/json' \
  -d '{ "devicetype": "<your-app-name>" }'
  ```
