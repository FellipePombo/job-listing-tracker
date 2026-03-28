const puppeteer = require('puppeteer');

async function launchBrowser() {
  return await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });
}

module.exports = { launchBrowser };
