const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureStep2And3() {
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

    console.log('1. Logging in as organizer...');
    await page.goto('http://localhost:3003/auth/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', 'ichsanfadhil67@gmail.com');
    await page.type('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    // --- CATEGORIES SETUP ---
    console.log('2. Navigating to Tournament Categories setup...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/categories', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Hide any lingering toast notifications
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    // 1. Categories List View
    const categoriesListPath = path.join(outputDir, 'tournament-categories-list.png');
    await page.screenshot({ path: categoriesListPath, fullPage: false });
    console.log('Saved:', categoriesListPath);

    // 2. Click Add Category Button
    console.log('Clicking Add Category button...');
    const addCatBtn = await page.$('button:has-text("+ Tambah Kategori"), button:has-text("+ Add Category"), button:has-text("Tambah Kategori"), button:has-text("Add Category")') ||
                      await page.evaluateHandle(() => {
                        const btns = Array.from(document.querySelectorAll('button, a'));
                        return btns.find(b => b.innerText.includes('Tambah') || b.innerText.includes('Add Category') || b.innerText.includes('Create Category'));
                      });

    if (addCatBtn && addCatBtn.click) {
      await addCatBtn.click();
      await new Promise(r => setTimeout(r, 1500));
      // Hide toasts
      await page.evaluate(() => {
        document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
      });
      const addCategoryModalPath = path.join(outputDir, 'tournament-category-modal.png');
      await page.screenshot({ path: addCategoryModalPath, fullPage: false });
      console.log('Saved:', addCategoryModalPath);
    }

    // --- QUALIFICATION SESSIONS SETUP ---
    console.log('3. Navigating to Qualification setup...');
    await page.goto('http://localhost:3003/dashboard/organizer/tournaments/t-soac-2026-full/qualification', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // Hide any toasts
    await page.evaluate(() => {
      document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
    });

    // 1. Qualification Overview
    const qualOverviewPath = path.join(outputDir, 'qualification-sessions-overview.png');
    await page.screenshot({ path: qualOverviewPath, fullPage: false });
    console.log('Saved:', qualOverviewPath);

    // 2. Click Add Session or Edit Session
    console.log('Clicking Add Session / Session Settings button...');
    const sessionBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button, a'));
      return btns.find(b => b.innerText.includes('Sesi') || b.innerText.includes('Session') || b.innerText.includes('Atur') || b.innerText.includes('Config'));
    });

    if (sessionBtn && sessionBtn.click) {
      await sessionBtn.click();
      await new Promise(r => setTimeout(r, 1500));
      await page.evaluate(() => {
        document.querySelectorAll('.toast, [role="alert"], .fixed.bottom-4, .fixed.top-4').forEach(el => el.remove());
      });
      const qualModalPath = path.join(outputDir, 'qualification-session-modal.png');
      await page.screenshot({ path: qualModalPath, fullPage: false });
      console.log('Saved:', qualModalPath);
    }

    console.log('Completed capturing Step 2 & Step 3 screenshots!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    await browser.close();
  }
}

captureStep2And3();
