# Rostelekomer

### Prerequisites

I don't know why, but some of the Rostelecom's IPs are always in ban on some sites.

This is the simple and messy script which partialy solves that problem, just reloading the connection until test site is online again. 

Supports only **TP-Link w740**

### Setup
1. Add index.js to `config` folder with something like this:
```javascript
const DOMAIN = 'http://192.168.0.1';

module.exports.DISCONNECT_URL = `${DOMAIN}/disconnect-get-url`;
module.exports.CONNECT_URL = `${DOMAIN}/connect-get-url`;
module.exports.TEST_URL = 'https://google.com/';
module.exports.USERNAME = 'admin';
module.exports.PASSWORD = 'admin';
```
2. Install dependencies: `npm install`
3. Run: `npm start`