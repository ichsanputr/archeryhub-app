import puppeteer from 'puppeteer';

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1280, height: 900 } });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003/blog/how-to-shoot-a-bow-beginners-guide-to-archery-form', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to Figure 1.3
  await page.evaluate(() => {
    window.scrollTo(0, 5200);
  });
  await new Promise(r => setTimeout(r, 1000));
  const shot = 'C:/Users/HP/.gemini/antigravity/brain/e12e5a12-596d-4d0f-ada6-902db9bfe9df/scratch/article_img3_bow_full.png';
  await page.screenshot({ path: shot });
  console.log('Saved shot 3 to', shot);
  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
