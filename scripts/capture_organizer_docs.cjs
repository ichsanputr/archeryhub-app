const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureOrganizerDocs() {
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

    console.log('1. Navigating to login page for organizer...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2' });

    console.log('2. Logging in with organizer demo account...');
    await page.type('input[type="email"]', 'ichsanfadhil67@gmail.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {
      console.log('Navigation completed or timed out');
    });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Logged in URL:', page.url());

    // --- DOC 1: Organization Profile Setup ---
    console.log('3. Navigating to Organization Profile...');
    await page.goto('http://localhost:3003/dashboard/organizer/profile', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. General Profile Overview
    const orgProfileOverviewPath = path.join(outputDir, 'org-profile-overview.png');
    await page.screenshot({ path: orgProfileOverviewPath, fullPage: false });
    console.log('Saved:', orgProfileOverviewPath);

    // 2. Bank Information Tab
    console.log('Clicking Bank Tab...');
    const bankButtons = await page.$$('button');
    for (const btn of bankButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('Bank') || text.includes('Rekening')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    const orgProfileBankPath = path.join(outputDir, 'org-profile-bank.png');
    await page.screenshot({ path: orgProfileBankPath, fullPage: false });
    console.log('Saved:', orgProfileBankPath);

    // 3. Legality & SK Tab
    console.log('Clicking Legality Tab...');
    for (const btn of bankButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('Legal') || text.includes('Dokumen')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    const orgProfileLegalityPath = path.join(outputDir, 'org-profile-legality.png');
    await page.screenshot({ path: orgProfileLegalityPath, fullPage: false });
    console.log('Saved:', orgProfileLegalityPath);

    // --- DOC 2: Creating a Tournament Wizard ---
    console.log('4. Navigating to Create Tournament Wizard...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/create', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // 1. Quota Packages Grid (Top View)
    const tournamentCreatePackagesPath = path.join(outputDir, 'tournament-create-packages.png');
    await page.screenshot({ path: tournamentCreatePackagesPath, fullPage: false });
    console.log('Saved:', tournamentCreatePackagesPath);

    // 2. Scroll to Event Info & Timeline
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 1000));
    const tournamentCreateInfoPath = path.join(outputDir, 'tournament-create-info.png');
    await page.screenshot({ path: tournamentCreateInfoPath, fullPage: false });
    console.log('Saved:', tournamentCreateInfoPath);

    console.log('All organizer documentation screenshots captured successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureOrganizerDocs();
