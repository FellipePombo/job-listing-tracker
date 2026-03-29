const { launchBrowser } = require('./utils/browser');
const { getParams } = require('./utils/input');
const scrapers = require('./config/sites');
const fs = require('fs');

const {
    loadParams,
    updateParams
  } = require('./utils/params');

(async () => {
  const browser = await launchBrowser();
  const page = await browser.newPage();

  const results = {};

  for (const site of scrapers) {
    try {
      console.log(`Running scraper: ${site.name}`);
      const oldParams = loadParams();
      const inputParams = await getParams();
      const params = updateParams(oldParams,inputParams);

      const data = await site.run(page, params);
      results[site.name] = data;

    } catch (err) {
      console.error(`Error in ${site.name}:`, err.message);
    }
  }

  fs.writeFileSync('./output/results.json', JSON.stringify(results, null, 2));

  await browser.close();
})();
