const puppeteer = require('puppeteer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function createJWT(payload, secret = 'sajsn99_budibadu24') {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

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

    // 1. Archer Token
    const archerToken = createJWT({
      user_id: 'arc-adam-003',
      email: 'adam.pratama@example.com',
      name: 'Adam Pratama',
      avatar: '',
      role: 'archer',
      user_type: 'archer',
      exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7
    });

    await page.setCookie({
      name: 'auth_token',
      value: archerToken,
      domain: 'localhost',
      path: '/'
    });

    // Capture 1: Archer Profile Page
    console.log('Navigating to archer profile...');
    await page.goto('http://localhost:3003/dashboard/archer/profile', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const archerProfilePath = path.join(outputDir, 'archer-profile-setup.png');
    await page.screenshot({ path: archerProfilePath, fullPage: false });
    console.log(`Saved screenshot: ${archerProfilePath}`);

    // Capture 2: Scorekeeper Login / Portal
    console.log('Navigating to scorekeeper login...');
    await page.goto('http://localhost:3003/scorekeeper/login', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    
    const scorekeeperLoginPath = path.join(outputDir, 'scorekeeper-mobile-portal.png');
    await page.screenshot({ path: scorekeeperLoginPath, fullPage: false });
    console.log(`Saved screenshot: ${scorekeeperLoginPath}`);

  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capture();
