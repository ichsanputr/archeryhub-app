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

    console.log('1. Navigating to login page...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2' });

    console.log('2. Filling login form with archer demo account...');
    await page.type('input[type="email"]', 'archer@gmail.com');
    await page.type('input[type="password"]', '123456');

    console.log('3. Submitting login form...');
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {
      console.log('Navigation wait timeout or completed immediately');
    });
    await new Promise(r => setTimeout(r, 2000));
    console.log('Current URL after login:', page.url());

    // 4. Navigate to Archer Profile Page
    console.log('4. Navigating to archer profile...');
    await page.goto('http://localhost:3003/dashboard/archer/profile', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));

    const archerProfilePath = path.join(outputDir, 'archer-profile-setup.png');
    await page.screenshot({ path: archerProfilePath, fullPage: false });
    console.log(`Successfully saved authentic profile screenshot to: ${archerProfilePath}`);

    // 5. Also capture full page or section if needed
    console.log('Capture completed successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
