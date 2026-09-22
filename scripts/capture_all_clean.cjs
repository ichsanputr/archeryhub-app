const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureAllCleanScreenshots() {
  const outputDir = path.join(__dirname, '../public/docs');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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

    // --- DOC 1: Organization Profile ---
    console.log('2. Navigating to Organizer Profile...');
    await page.goto('http://localhost:3003/dashboard/organizer/profile', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Screenshot 1: General Identity
    const orgProfileOverview = path.join(outputDir, 'org-profile-overview.png');
    await page.screenshot({ path: orgProfileOverview, fullPage: false });
    console.log('Saved:', orgProfileOverview);

    // Screenshot 2: Contact & Location Tab
    const tabButtons = await page.$$('button');
    for (const btn of tabButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes('Contact') || text.includes('Kontak')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    const orgProfileContact = path.join(outputDir, 'org-profile-contact.png');
    await page.screenshot({ path: orgProfileContact, fullPage: false });
    console.log('Saved:', orgProfileContact);

    // --- DOC 2: Create Tournament Wizard ---
    console.log('3. Navigating to Create Tournament Wizard...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/create', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2500));

    // Screenshot 1: Packages / Quota Tier Selector
    const tournamentPackages = path.join(outputDir, 'tournament-create-packages.png');
    await page.screenshot({ path: tournamentPackages, fullPage: false });
    console.log('Saved:', tournamentPackages);

    // Screenshot 2: Basic Info & Venue Form (Zoomed / Scrolled)
    await page.evaluate(() => window.scrollTo({ top: 580, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 1000));
    const tournamentInfo = path.join(outputDir, 'tournament-create-info.png');
    await page.screenshot({ path: tournamentInfo, fullPage: false });
    console.log('Saved:', tournamentInfo);

    // Screenshot 3: Timeline & Dates Form (Zoomed / Scrolled)
    await page.evaluate(() => window.scrollTo({ top: 1180, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 1000));
    const tournamentDates = path.join(outputDir, 'tournament-create-dates.png');
    await page.screenshot({ path: tournamentDates, fullPage: false });
    console.log('Saved:', tournamentDates);

    console.log('All clean screenshots generated successfully!');
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    await browser.close();
  }
}

captureAllCleanScreenshots();
