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

    // 1. Log in
    console.log('Navigating to /auth/login...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await page.type('input[type="email"]', 'ichsanfadhil67@gmail.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Logged in successfully!');

    const cleanPage = async () => {
      await page.evaluate(() => {
        document.querySelectorAll('.v-toast, [role="status"], .toast, .v-snackbar, .vue-notification-group').forEach(el => el.remove());
      });
    };

    // 1. Organizer Qualification Results & Ranking
    console.log('Capturing Organizer Qualification Results with Recurve Men selected...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/qualification/results', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // Select category dropdown - choose Recurve Men
    await page.evaluate(() => {
      // Find select or click dropdown
      const select = document.querySelector('select');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes('Recurve') || select.options[i].value.includes('rec')) {
            select.selectedIndex = i;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            break;
          }
        }
      }
    });
    await new Promise(r => setTimeout(r, 1500));
    await cleanPage();
    const resultsPath = path.join(outputDir, 'qualification-results-ranking.png');
    await page.screenshot({ path: resultsPath, fullPage: false });
    console.log(`Saved screenshot: ${resultsPath}`);

    // 2. Public Tournament Results / Leaderboard Tab
    console.log('Capturing Public Tournament Results Tab...');
    await page.goto('http://localhost:3003/tournaments/sleman-open-archery-championship-2026/results', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));
    await cleanPage();
    const publicPath = path.join(outputDir, 'qualification-public-leaderboard.png');
    await page.screenshot({ path: publicPath, fullPage: false });
    console.log(`Saved screenshot: ${publicPath}`);

    // 3. Organizer Qualification Sessions Overview (Lock & Finalize Controls)
    console.log('Capturing Qualification Sessions Overview...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/qualification', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await cleanPage();
    const overviewPath = path.join(outputDir, 'qualification-finalize-lock.png');
    await page.screenshot({ path: overviewPath, fullPage: false });
    console.log(`Saved screenshot: ${overviewPath}`);

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
