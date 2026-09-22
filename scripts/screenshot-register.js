import puppeteer from 'puppeteer';
import path from 'path';

async function capture() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  try {
    await page.goto('http://localhost:3003/tournaments/tournament-jogja-2026/register', {
      waitUntil: 'networkidle2',
      timeout: 15000
    });
    
    await page.waitForSelector('main', { timeout: 5000 }).catch(() => {});
    
    // Type name in full_name input
    const inputs = await page.$$('input');
    for (const inp of inputs) {
      await inp.type('Akun Ngekode');
      break;
    }
    
    // Click on Gender select trigger
    const triggers = await page.$$('.min-h-\\[44px\\]');
    if (triggers.length > 0) {
      await triggers[0].click();
      await new Promise(r => setTimeout(r, 300));
      
      const options = await page.$$('button');
      for (const opt of options) {
        const txt = await page.evaluate(el => el.textContent, opt);
        if (txt.trim() === 'Male') {
          await opt.click();
          break;
        }
      }
    }
    await new Promise(r => setTimeout(r, 400));
    
    // Click Continue to Categories
    const stepButtons = await page.$$('button');
    for (const btn of stepButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Continue to Categories')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // Click on Mixed Team category
    const allDivs = await page.$$('div');
    for (const div of allDivs) {
      const text = await page.evaluate(el => el.textContent, div);
      if (text.includes('Mixed (1M + 1F)')) {
        await div.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // Click + Add Female Partner
    const addBtns = await page.$$('button');
    for (const btn of addBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Female Partner') || text.includes('Teammate')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));

    // Click on "New Archer" tab in modal
    const modalTabs = await page.$$('button');
    for (const tab of modalTabs) {
      const text = await page.evaluate(el => el.textContent, tab);
      if (text.includes('New Archer')) {
        await tab.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 800));
    
    const screenshotPath = path.resolve('C:/Users/HP/.gemini/antigravity/brain/1b868962-d368-4da3-808e-b25497c71f96/register_preview.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log('Screenshot saved to:', screenshotPath);
  } catch (err) {
    console.error('Screenshot error:', err);
  } finally {
    await browser.close();
  }
}

capture();
