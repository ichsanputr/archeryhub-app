const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureCreateWizard() {
  const outputDir = path.join(__dirname, '../public/docs');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'ichsanfadhil67@gmail.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    // Disable tour in localStorage before navigating
    await page.evaluate(() => {
      localStorage.setItem('driverjs_tour_completed', 'true');
      localStorage.setItem('has_seen_tour', 'true');
    });

    console.log('Navigating to tournaments list...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Click Skip on onboarding if present
    try {
      const skipBtn = await page.$('.driver-popover-close-btn, button:has-text("Skip"), [aria-label="Close"]');
      if (skipBtn) await skipBtn.click();
    } catch (e) {}

    // 1. Capture Tournament List View (with Create Tournament CTA)
    const tournamentListPath = path.join(outputDir, 'tournament-list-view.png');
    await page.screenshot({ path: tournamentListPath, fullPage: false });
    console.log('Saved:', tournamentListPath);

    // 2. Click "+ Create Tournament" or navigate to create
    console.log('Navigating to create wizard...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/create', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));

    // 2. Capture Create Tournament - Package Tier Selection
    const tournamentCreatePackagesPath = path.join(outputDir, 'tournament-create-packages.png');
    await page.screenshot({ path: tournamentCreatePackagesPath, fullPage: false });
    console.log('Saved:', tournamentCreatePackagesPath);

    // 3. Scroll to Tournament General Info Form
    await page.evaluate(() => {
      window.scrollTo({ top: 550, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1000));
    const tournamentCreateInfoPath = path.join(outputDir, 'tournament-create-info.png');
    await page.screenshot({ path: tournamentCreateInfoPath, fullPage: false });
    console.log('Saved:', tournamentCreateInfoPath);

    // 4. Scroll to Venue & Dates Form
    await page.evaluate(() => {
      window.scrollTo({ top: 1150, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1000));
    const tournamentCreateDatesPath = path.join(outputDir, 'tournament-create-dates.png');
    await page.screenshot({ path: tournamentCreateDatesPath, fullPage: false });
    console.log('Saved:', tournamentCreateDatesPath);

    console.log('Done capturing create tournament wizard screenshots!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureCreateWizard();
