const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function capture() {
  const outputDir = path.join(__dirname, '../public/docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    const cleanPage = async () => {
      await page.evaluate(() => {
        document.querySelectorAll('.v-toast, [role="status"], .toast, .v-snackbar, .vue-notification-group, iframe').forEach(el => el.remove());
      });
    };

    // 1. Log in as Organizer
    console.log('Logging in as Organizer...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.type('input[type="email"]', 'ichsanfadhil67@gmail.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    // 1. Organizer Qualification Results Page
    console.log('Capturing Organizer Qualification Results (with category click)...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/qualification/results', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Click on BaseSelect trigger to open dropdown
    const selectTrigger = await page.$('.relative button, [aria-haspopup="listbox"], button.cursor-pointer');
    if (selectTrigger) {
      await selectTrigger.click();
      await new Promise(r => setTimeout(r, 500));
      // Click Recurve Men option
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('div, li, span, button'));
        const rec = els.find(el => el.textContent.trim() === 'Recurve Men 70m Umum' || el.textContent.trim().includes('Recurve Men'));
        if (rec) rec.click();
      });
      await new Promise(r => setTimeout(r, 1500));
    }
    await cleanPage();
    const resultsPath = path.join(outputDir, 'qualification-results-ranking.png');
    await page.screenshot({ path: resultsPath, fullPage: false });
    console.log(`Saved screenshot: ${resultsPath}`);

    // 2. Organizer Qualification Session Detail (Target Assignments & Scoring)
    console.log('Capturing Qualification Session Detail...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/qualification/session-soac-qual-1', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await cleanPage();
    const sessionPath = path.join(outputDir, 'qualification-session-matrix.png');
    await page.screenshot({ path: sessionPath, fullPage: false });
    console.log(`Saved screenshot: ${sessionPath}`);

    // 3. Organizer Qualification Sessions Overview (Lock & Finalize Controls)
    console.log('Capturing Qualification Sessions Overview...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/qualification', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await cleanPage();
    const overviewPath = path.join(outputDir, 'qualification-finalize-lock.png');
    await page.screenshot({ path: overviewPath, fullPage: false });
    console.log(`Saved screenshot: ${overviewPath}`);

    // 4. Log in as Archer & capture Event Leaderboard with Podium
    console.log('Logging in as Archer to capture Event Leaderboard...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.type('input[type="email"]', 'adam.pratama@example.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    await page.goto('http://localhost:3003/dashboard/archer/tournaments/t-soac-2026-full/leaderboard', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    // Click category dropdown if needed
    const archerSelectTrigger = await page.$('.relative button, [aria-haspopup="listbox"], button.cursor-pointer');
    if (archerSelectTrigger) {
      await archerSelectTrigger.click();
      await new Promise(r => setTimeout(r, 500));
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('div, li, span, button'));
        const rec = els.find(el => el.textContent.trim() === 'Recurve Men 70m Umum' || el.textContent.trim().includes('Recurve Men'));
        if (rec) rec.click();
      });
      await new Promise(r => setTimeout(r, 1500));
    }
    await cleanPage();
    const leaderboardPath = path.join(outputDir, 'qualification-leaderboard-podium.png');
    await page.screenshot({ path: leaderboardPath, fullPage: false });
    console.log(`Saved screenshot: ${leaderboardPath}`);

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
