const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureEliminationAndScorekeepers() {
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
    // --- DOC 1: ELIMINATION BRACKETS ---
    // ==========================================
    console.log('2. Navigating to Elimination Brackets list...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/elimination', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const elimOverviewPath = path.join(outputDir, 'elimination-brackets-overview.png');
    await page.screenshot({ path: elimOverviewPath, fullPage: false });
    console.log('Saved:', elimOverviewPath);

    // Click on the first bracket card or check for bracket link
    console.log('Clicking first bracket card...');
    const bracketCard = await page.$('a[href*="/elimination/"]');
    if (bracketCard) {
      await bracketCard.click();
      await new Promise(r => setTimeout(r, 2500));
      await page.evaluate(() => {
        document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
      });
      const bracketTreePath = path.join(outputDir, 'elimination-bracket-tree.png');
      await page.screenshot({ path: bracketTreePath, fullPage: false });
      console.log('Saved:', bracketTreePath);
    } else {
      // If no bracket yet, click create bracket
      console.log('Opening Create Bracket modal...');
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.innerText.includes('Buat Bagan') || b.innerText.includes('Create Bracket'));
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 1500));
      await page.evaluate(() => {
        document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
      });
      const bracketModalPath = path.join(outputDir, 'elimination-create-modal.png');
      await page.screenshot({ path: bracketModalPath, fullPage: false });
      console.log('Saved:', bracketModalPath);
    }

    // ==========================================
    // --- DOC 2: SCOREKEEPER CODES & MANAGEMENT ---
    // ==========================================
    console.log('3. Navigating to Scorekeepers Management...');
    await page.goto('http://localhost:3003/dashboard/organizer/scorekeepers', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const scorekeepersRosterPath = path.join(outputDir, 'scorekeeper-roster-overview.png');
    await page.screenshot({ path: scorekeepersRosterPath, fullPage: false });
    console.log('Saved:', scorekeepersRosterPath);

    // Open Add Scorekeeper / Generate Code Modal
    console.log('Opening Add Scorekeeper modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.innerText.includes('Tambah Scorekeeper') || b.innerText.includes('Add Scorekeeper'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const addScorekeeperModalPath = path.join(outputDir, 'scorekeeper-add-modal.png');
    await page.screenshot({ path: addScorekeeperModalPath, fullPage: false });
    console.log('Saved:', addScorekeeperModalPath);

    console.log('All elimination & scorekeeper screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureEliminationAndScorekeepers();
