const puppeteer = require('puppeteer');
const isOnline = require('is-online');
const request = require('request-promise-native');

const logger = require('./logger');

const config = require('./config')

let online = false;

const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  })
}

const disconnect = async () => {
  await request.get(config.DISCONNECT_URL, {
    auth: {
      user: config.USERNAME,
      pass: config.PASSWORD
    },
  });
  return true;
}

const connect = async () => {
  await request.get(config.CONNECT_URL, {
    auth: {
      user: config.USERNAME,
      pass: config.PASSWORD
    },
  });
  return true;
}

const getIp = async () => {
  const { ip } = await request({
    url: 'https://api.ipify.org?format=json',
    json: true,
  });
  return ip;
}

const testIp = async () => {
  let online;
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  try {
    const response = await page.goto(config.TEST_URL, {timeout: 10000});
    
    response.status;

    online = true;
  } catch (err) {
    logger.error(`Can't open the test site: ${err.message}`);
    online = false;
  } finally {
    await browser.close();
    return online;
  }
}

const reloadOnce = async () => {
  let retryCount = 0;

  await disconnect();
  logger.info('Disconnected')

  await connect();
  logger.info('Trying to connect...');

  while(retryCount < 5) {
    const connected = await isOnline();
    if (connected) {
      break;
    }
    logger.info(`Rerty #${retryCount + 1} unsuccessfull, trying again`);
    retryCount++;
  }

  if (retryCount > 5) {
    logger.error(`Can't connect after ${retryCount+1} number of trying`);
    return false;
  }

  const ip = await getIp();
  logger.info(`Connected with ip: ${ip}`);
  const online = await testIp();
  if (online) { return true; }
  return false;
}

const reload = async () => {
  logger.info('Start reload cycle')
  try {
    while (!online) {
      online = await reloadOnce();
    }
    return logger.info('Done reload cycle')
  } catch (err) {
    return logger.error(`Reload cycle error: ${err.message}`)
  }
}

reload();
