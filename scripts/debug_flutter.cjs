const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=450,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure()?.errorText));

  console.log('Navigating to http://localhost:61271 ...');
  await page.goto('http://localhost:61271', { waitUntil: 'load', timeout: 20000 });
  
  // wait 10 seconds and log whatever happens
  for (let i = 1; i <= 10; i++) {
    await new Promise(r => setTimeout(r, 1000));
    console.log(`Waited ${i}s...`);
  }

  await page.screenshot({ path: './public/docs/flutter-debug.png' });
  await browser.close();
})();
