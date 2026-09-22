const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=400,850']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  try {
    console.log('Navigating to http://localhost:61271 ...');
    await page.goto('http://localhost:61271', { waitUntil: 'networkidle2', timeout: 15000 });
    console.log('Current URL:', page.url());
    console.log('Title:', await page.title());
    // wait a bit for flutter canvas / dom to settle
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: './public/docs/flutter-preview.png' });
    console.log('Screenshot saved to public/docs/flutter-preview.png');
  } catch (err) {
    console.error('Navigation error:', err);
  } finally {
    await browser.close();
  }
})();
