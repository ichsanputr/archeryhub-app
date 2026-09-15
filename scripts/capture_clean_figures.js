import puppeteer from 'puppeteer';

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1280, height: 900 } });
  const page = await browser.newPage();
  await page.goto('http://localhost:3003/blog/how-to-shoot-a-bow-beginners-guide-to-archery-form', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const figures = await page.$$('figure');
  console.log(`Found ${figures.length} figures on page`);
  for (let i = 0; i < figures.length; i++) {
    await figures[i].scrollIntoViewIfNeeded();
    await new Promise(r => setTimeout(r, 600));
    const path = `C:/Users/HP/.gemini/antigravity/brain/e12e5a12-596d-4d0f-ada6-902db9bfe9df/scratch/figure_rendered_${i + 1}.png`;
    await figures[i].screenshot({ path });
    console.log(`Saved figure_rendered_${i + 1}.png`);
  }
  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
