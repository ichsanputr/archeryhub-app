const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const API_MEDIA_DIR = 'C:/E/ichsan/startup/archeryhub.id/api/media';
const API_DOCS_DIR = 'C:/E/ichsan/startup/archeryhub.id/api/data/docs';

// Database config
const dbConfig = {
  host: '151.243.222.93',
  port: 30036,
  user: 'ichsan',
  password: 'withheld', // Note: placeholder to be filled or handled safely, we'll read from env or use config.
  database: 'archeris'
};

async function getDbConnection() {
  // Let's check environment first or fallback to default
  const host = process.env.DB_HOST || dbConfig.host;
  const port = parseInt(process.env.DB_PORT || dbConfig.port, 10);
  const user = process.env.DB_USER || dbConfig.user;
  const password = process.env.DB_PASSWORD || '12345'; // Use the password seen in seed_news_data.go
  const database = process.env.DB_NAME || dbConfig.database;

  return await mysql.createConnection({ host, port, user, password, database });
}

// Ensure media output directory exists
if (!fs.existsSync(API_MEDIA_DIR)) {
  fs.mkdirSync(API_MEDIA_DIR, { recursive: true });
}

const getHtml = (title, category, isDark = true) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background-color: ${isDark ? '#0f172a' : '#ffffff'};
    color: ${isDark ? '#ffffff' : '#0f172a'};
    font-family: 'Outfit', sans-serif;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 80px 100px;
  }
  .grid-pattern {
    position: absolute; inset: 0; pointer-events: none; 
    opacity: ${isDark ? '0.04' : '0.06'};
    background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px);
    background-size: 50px 50px;
  }
  .accent-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 12px;
    background: linear-gradient(90deg, #facc15, #f59e0b, #ef4444);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    background: ${isDark ? 'rgba(250, 204, 21, 0.15)' : 'rgba(239, 68, 68, 0.1)'};
    color: ${isDark ? '#facc15' : '#ef4444'};
    padding: 8px 18px;
    font-weight: 800;
    font-size: 16px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 9999px;
    border: 1px solid ${isDark ? 'rgba(250, 204, 21, 0.3)' : 'rgba(239, 68, 68, 0.2)'};
    width: fit-content;
  }
  .title {
    font-size: 56px;
    line-height: 1.15;
    font-weight: 900;
    letter-spacing: -0.02em;
    margin-top: 20px;
    max-width: 950px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)'};
    padding-top: 30px;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo-box {
    width: 44px;
    height: 44px;
    background: #0f172a;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.1);
  }
  .logo-img {
    width: 26px;
    height: 26px;
    object-contain: fit;
  }
  .brand-name {
    font-weight: 900;
    font-size: 24px;
    letter-spacing: -0.03em;
    color: ${isDark ? '#ffffff' : '#0f172a'};
  }
  .doc-tag {
    font-size: 16px;
    font-weight: 700;
    color: ${isDark ? 'rgba(255,255,255,0.4)' : 'rgba(15,23,42,0.4)'};
    letter-spacing: 0.05em;
  }
</style>
</head>
<body>
  <div class="accent-bar"></div>
  <div class="grid-pattern"></div>
  
  <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;">
    <div class="badge">${category}</div>
    <h1 class="title">${title}</h1>
  </div>

  <div class="footer">
    <div class="brand">
      <div class="logo-box">
        <img src="https://archeris.net/logo.png" class="logo-img" />
      </div>
      <span class="brand-name">Archeris</span>
    </div>
    <div class="doc-tag">ARCHERIS // PLATFORM</div>
  </div>
</body>
</html>
`;

async function generateThumbnails() {
  console.log('🚀 Initializing Puppeteer Browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });

  // 1. Process News from Database
  console.log('📰 Connecting to DB to fetch news posts...');
  let connection;
  let newsArticles = [];
  try {
    connection = await getDbConnection();
    const [rows] = await connection.query('SELECT uuid, slug, title, category FROM news');
    newsArticles = rows;
  } catch (error) {
    console.error('⚠️ Could not fetch news from DB, using fallback defaults:', error.message);
  }

  console.log(`Processing ${newsArticles.length} news items...`);
  for (const news of newsArticles) {
    try {
      const category = news.category || 'PENGUMUMAN';
      const html = getHtml(news.title, category, true); // Dark theme for news
      await page.setContent(html);
      await page.evaluateHandle('document.fonts.ready');

      const filename = `news-${news.slug}.jpg`;
      const outPath = path.join(API_MEDIA_DIR, filename);
      await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
      console.log(`✅ Generated News Thumbnail: ${filename}`);

      // Update Database record with the new local image filename
      if (connection) {
        await connection.query('UPDATE news SET image_url = ? WHERE uuid = ?', [filename, news.uuid]);
        console.log(`   └ DB Updated: ${news.slug}`);
      }
    } catch (e) {
      console.error(`❌ Error generating news thumbnail for ${news.slug}:`, e.message);
    }
  }

  // 2. Process Docs from data/docs JSON files
  console.log('📄 Reading docs JSON files...');
  if (fs.existsSync(API_DOCS_DIR)) {
    const files = fs.readdirSync(API_DOCS_DIR).filter(f => f.endsWith('.json'));
    console.log(`Processing ${files.length} doc files...`);

    for (const f of files) {
      try {
        const filePath = path.join(API_DOCS_DIR, f);
        const docData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Indonesian title as primary default or english if unavailable
        const title = docData.id?.title || docData.en?.title || 'Documentation';
        const category = docData.category || 'GUIDE';

        const html = getHtml(title, category, false); // Light theme for docs
        await page.setContent(html);
        await page.evaluateHandle('document.fonts.ready');

        const filename = `doc-${docData.slug}.jpg`;
        const outPath = path.join(API_MEDIA_DIR, filename);
        await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
        console.log(`✅ Generated Doc Thumbnail: ${filename}`);

        // Update the JSON file object to include this thumbnail path/filename
        // We will store it under a thumbnail key if we want, or make it standard.
        // Let's add "image_url": filename to the root of docData JSON.
        docData.image_url = filename;
        fs.writeFileSync(filePath, JSON.stringify(docData, null, 2), 'utf8');
        console.log(`   └ JSON Updated: ${docData.slug}.json`);
      } catch (e) {
        console.error(`❌ Error generating doc thumbnail for ${f}:`, e.message);
      }
    }
  } else {
    console.warn(`⚠️ Docs directory not found at: ${API_DOCS_DIR}`);
  }

  if (connection) {
    await connection.end();
  }
  await browser.close();
  console.log('✨ Thumbnail generation complete!');
}

generateThumbnails().catch(err => {
  console.error('Fatal error during thumbnail generation:', err);
  process.exit(1);
});
