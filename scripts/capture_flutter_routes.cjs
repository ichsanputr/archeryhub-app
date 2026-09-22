const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=450,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  const routes = [
    { name: 'flutter-scorekeeper-login', url: 'http://localhost:61271/#/scorekeeper-login' },
    { name: 'flutter-login', url: 'http://localhost:61271/#/login' },
    { name: 'flutter-scorekeeper', url: 'http://localhost:61271/#/scorekeeper' }
  ];

  for (const r of routes) {
    try {
      console.log(`Navigating to ${r.url}...`);
      await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      // wait 5 seconds for flutter web engine to paint
      await new Promise(res => setTimeout(res, 5000));
      await page.screenshot({ path: `./public/docs/${r.name}.png` });
      console.log(`Saved screenshot to ./public/docs/${r.name}.png`);
    } catch (e) {
      console.error(`Error on ${r.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('All flutter captures completed.');
})();
