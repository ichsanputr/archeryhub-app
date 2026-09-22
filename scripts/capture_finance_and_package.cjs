const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureFinanceAndPackage() {
  const outputDir = path.join(__dirname, '../public/docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,960']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    console.log('1. Logging in as organizer...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'ichsanfadhil67@gmail.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    // ==========================================
    // --- DOC 1: BUY TOURNAMENT QUOTA ---
    // ==========================================
    console.log('2. Navigating to Package & Quota shop...');
    await page.goto('http://localhost:3003/dashboard/organizer/package', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    // 1. Package Tiers Overview
    const packageTiersPath = path.join(outputDir, 'package-tiers-pricing.png');
    await page.screenshot({ path: packageTiersPath, fullPage: false });
    console.log('Saved:', packageTiersPath);

    // 2. Billing & Purchase History (Scroll down)
    await page.evaluate(() => window.scrollBy(0, 600));
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });
    const packageHistoryPath = path.join(outputDir, 'package-billing-history.png');
    await page.screenshot({ path: packageHistoryPath, fullPage: false });
    console.log('Saved:', packageHistoryPath);

    // ==========================================
    // --- DOC 2: WALLET BALANCE & WITHDRAWAL ---
    // ==========================================
    console.log('3. Navigating to Balance & Wallet...');
    await page.goto('http://localhost:3003/dashboard/organizer/balance', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Fill security password verification
    console.log('Unlocking security verification on balance page...');
    const passInput = await page.$('input[type="password"]');
    if (passInput) {
      await passInput.type('123456');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 2000));
    }

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    // 1. Balance & Wallet Overview
    const walletOverviewPath = path.join(outputDir, 'wallet-balance-overview.png');
    await page.screenshot({ path: walletOverviewPath, fullPage: false });
    console.log('Saved:', walletOverviewPath);

    // 2. Open Withdrawal Request Form / Modal
    console.log('Clicking Request Withdrawal button...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Tarik Saldo') || b.innerText.includes('Tarik') || b.innerText.includes('Withdraw'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const withdrawalModalPath = path.join(outputDir, 'wallet-withdrawal-modal.png');
    await page.screenshot({ path: withdrawalModalPath, fullPage: false });
    console.log('Saved:', withdrawalModalPath);

    console.log('All finance & package screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureFinanceAndPackage();
