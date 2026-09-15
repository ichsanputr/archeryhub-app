import puppeteer from 'puppeteer';

async function capture() {
  const browser = await puppeteer.launch({ headless: 'new', defaultViewport: { width: 1280, height: 900 } });
  const page = await browser.newPage();

  console.log('Navigating to article...');
  await page.goto('http://localhost:3003/blog/how-to-shoot-a-bow-beginners-guide-to-archery-form', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  // Shot 1: Table of Contents & first H2 section
  await page.evaluate(() => window.scrollTo(0, 750));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/HP/.gemini/antigravity/brain/e12e5a12-596d-4d0f-ada6-902db9bfe9df/scratch/article_toc_and_h2.png' });
  console.log('Saved shot 1');

  // Shot 2: Steps section (H2 master + H3 sub-steps)
  await page.evaluate(() => window.scrollTo(0, 2000));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/HP/.gemini/antigravity/brain/e12e5a12-596d-4d0f-ada6-902db9bfe9df/scratch/article_steps_h3.png' });
  console.log('Saved shot 2');

  // Shot 3: Simplified Community Discussion & Sidebar
  await page.evaluate(() => window.scrollTo(0, 6800));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/HP/.gemini/antigravity/brain/e12e5a12-596d-4d0f-ada6-902db9bfe9df/scratch/article_discussion_simplified.png' });
  console.log('Saved shot 3');

  // Shot 4: Related Articles Cards
  await page.evaluate(() => window.scrollTo(0, 7600));
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Users/HP/.gemini/antigravity/brain/e12e5a12-596d-4d0f-ada6-902db9bfe9df/scratch/article_related_cards.png' });
  console.log('Saved shot 4');

  // Shot 5: Blog Index with 2026 dates
  await page.goto('http://localhost:3003/blog', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'C:/Users/HP/.gemini/antigravity/brain/e12e5a12-596d-4d0f-ada6-902db9bfe9df/scratch/blog_index_2026_dates.png' });
  console.log('Saved shot 5');

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
