const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function capturePerfectScreenshots() {
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
    // --- STEP 2: CATEGORIES SETUP ---
    // ==========================================
    console.log('2. Navigating to Categories setup...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/categories', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Remove toasts & popups
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4, .v-popper').forEach(el => el.remove());
    });

    // 1. Categories List View
    const categoriesListPath = path.join(outputDir, 'tournament-categories-list.png');
    await page.screenshot({ path: categoriesListPath, fullPage: false });
    console.log('Saved:', categoriesListPath);

    // 2. Open Add Category Modal
    console.log('Opening Add Category modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.innerText.includes('Tambah Kategori') || b.innerText.includes('Add Category'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Clean toasts inside modal
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const categoryModalPath = path.join(outputDir, 'tournament-category-modal.png');
    await page.screenshot({ path: categoryModalPath, fullPage: false });
    console.log('Saved:', categoryModalPath);

    // Close modal by clicking cancel or pressing Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 1000));

    // ==========================================
    // --- STEP 3: QUALIFICATION SETUP ---
    // ==========================================
    console.log('3. Navigating to Qualification Sessions...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/qualification', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Clean toasts
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    // 1. Qualification Sessions Overview Cards
    const qualSessionsOverviewPath = path.join(outputDir, 'qualification-sessions-overview.png');
    await page.screenshot({ path: qualSessionsOverviewPath, fullPage: false });
    console.log('Saved:', qualSessionsOverviewPath);

    // 2. Open Add Session Modal
    console.log('Opening Add Session modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.innerText.includes('Tambah Sesi') || b.innerText.includes('Add Session'));
      if (addBtn) addBtn.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const qualModalPath = path.join(outputDir, 'qualification-session-modal.png');
    await page.screenshot({ path: qualModalPath, fullPage: false });
    console.log('Saved:', qualModalPath);

    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 1000));

    // 3. Click into first qualification session for Target Map / Allocation
    console.log('Clicking first session to view Target Map...');
    await page.evaluate(() => {
      const sessionCard = document.querySelector('.group.cursor-pointer');
      if (sessionCard) sessionCard.click();
    });
    await new Promise(r => setTimeout(r, 2500));

    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    const qualTargetsPath = path.join(outputDir, 'qualification-target-allocation.png');
    await page.screenshot({ path: qualTargetsPath, fullPage: false });
    console.log('Saved:', qualTargetsPath);

    console.log('All screenshots captured and saved successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

capturePerfectScreenshots();
