const puppeteer = require('puppeteer');
const path = require('path');

async function captureScorekeeperModal() {
  const outputDir = path.join(__dirname, '../public/docs');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('Logging in...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'ichsanfadhil67@gmail.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    console.log('Navigating to Scorekeepers...');
    await page.goto('http://localhost:3003/dashboard/organizer/scorekeepers', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Remove any toasts
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    console.log('Clicking Add Staff button...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Add Staff') || b.innerText.includes('Tambah Scorekeeper'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Remove any toasts inside modal
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const addModalPath = path.join(outputDir, 'scorekeeper-add-modal.png');
    await page.screenshot({ path: addModalPath, fullPage: false });
    console.log('Saved:', addModalPath);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await browser.close();
  }
}

captureScorekeeperModal();
