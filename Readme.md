#### Origami Hue Example App

Run with `node index.js`.

Expects a request from Origami with a body like this:

``` json
{
  "options": {
    "host": "api.meethue.com",
    "path": "/bridge/<whitelist-id>/lights/1/state",
    "method": "PUT",
    "headers": {
      "Authorization": "Bearer <access-token>",
      "Content-Type": "application/json"
    }
  },

  "body": {
    "on": 1,
    "bri": 200
  }
}
```
