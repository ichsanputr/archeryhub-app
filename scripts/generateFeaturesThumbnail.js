/**
 * ExcelClash Feature Thumbnail Generator
 * Generates high-fidelity PNG thumbnails for homepage features.
 * Run with: node scripts/generateFeatureThumbnails.js
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, '../public/features')
const WIDTH = 1200
const HEIGHT = 800

const FONT_PATH = path.join(__dirname, '../public/fonts/apfelgrotezk/desktop/ApfelGrotezk-Regular.otf')
const FONT_BASE64 = fs.existsSync(FONT_PATH)
    ? fs.readFileSync(FONT_PATH).toString('base64')
    : ''

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const getHtml = (feature) => `
<!DOCTYPE html>
<html>
<head>
<style>
  @font-face {
    font-family: 'ApfelGrotezk';
    src: url(data:font/otf;base64,${FONT_BASE64}) format('opentype');
    font-weight: normal;
    font-style: normal;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    width: 1200px;
    height: 800px;
    background-color: ${feature.dark ? '#171B36' : '#FDF1E6'};
    color: ${feature.dark ? 'white' : '#1A1A1A'};
    font-family: 'ApfelGrotezk', sans-serif;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px;
    border: 10px solid #1A1A1A;
  }

  .dot-pattern {
    position: absolute; inset: 0; pointer-events: none; 
    opacity: ${feature.dark ? '0.1' : '0.05'};
    background-image: radial-gradient(currentColor 2px, transparent 2px);
    background-size: 32px 32px;
  }

  .content-box {
    position: relative;
    z-index: 10;
    width: 900px;
    background: ${feature.dark ? '#D91629' : 'white'};
    color: ${feature.dark ? 'white' : 'black'};
    border: 6px solid black;
    padding: 60px;
    box-shadow: 20px 20px 0 0 black;
    text-align: left;
  }

  .badge {
    display: inline-block;
    background: ${feature.dark ? 'black' : '#D91629'};
    color: white;
    padding: 10px 20px;
    font-weight: 950;
    font-size: 20px;
    letter-spacing: 0.2em;
    text-transform:;
    margin-bottom: 30px;
  }

  .title {
    font-size: 80px;
    line-height: 0.95;
    font-weight: 950;
    letter-spacing: -0.05em;
    margin-bottom: 25px;
    text-transform:;
  }

  .desc {
    font-size: 28px;
    font-weight: 500;
    line-height: 1.4;
    max-width: 700px;
    opacity: 0.9;
  }

  .ui-element {
    position: absolute;
    right: -40px;
    bottom: -40px;
    width: 200px;
    height: 200px;
    background: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100px;
    font-weight: 900;
    mix-blend-mode: overlay;
    opacity: 0.2;
  }
</style>
</head>
<body>
  <div class="dot-pattern"></div>
  
  <div class="content-box">
    <div class="badge">${feature.category}</div>
    <h1 class="title">${feature.title}</h1>
    <p class="desc">${feature.subtitle}</p>
    <div class="ui-element">${feature.icon || '⚡'}</div>
  </div>

  <div style="position: absolute; bottom: 40px; left: 60px; font-weight: 900; font-size: 24px; opacity: 0.3;">
    EXCELCLASH // RECTIVE ANALYTICS
  </div>
</body>
</html>
`

const FEATURES = [
    {
        slug: 'feature_interactive_challenge',
        category: 'THE CHALLENGE',
        title: 'DIRECT PRACTICE',
        subtitle: 'Solve real data problems with goals and instant scoring.',
        dark: true,
        icon: '🎯'
    },
    {
        slug: 'feature_battle_mode',
        category: 'THE CHALLENGE',
        title: '1V1 BATTLE',
        subtitle: 'Play against others in real-time to see who has the best formulas.',
        dark: true,
        icon: '⚔️'
    },
    {
        slug: 'feature_structured_taxonomy',
        category: 'THE CHALLENGE',
        title: 'PICK YOUR PATH',
        subtitle: 'Choose challenges by category—Finance, Sales, and Ops.',
        dark: true,
        icon: '⛓️'
    },
    {
        slug: 'feature_data_reconstruction',
        category: 'EXERCISES',
        title: 'LEARN & DO',
        subtitle: 'Learn and do challenges at the same time—no boring videos.',
        dark: false,
        icon: '🕹️'
    },
    {
        slug: 'feature_logic_gates',
        category: 'EXERCISES',
        title: 'SAVED PROGRESS',
        subtitle: 'Your exercise results are saved automatically to track your journey.',
        dark: false,
        icon: '📊'
    },
    {
        slug: 'feature_modeling_expertise',
        category: 'EXERCISES',
        title: 'GUIDED PATHS',
        subtitle: 'Follow structured exercises by category with clear skill paths.',
        dark: false,
        icon: '🗺️'
    }
]

const run = async () => {
    console.log(`\n🚀 Generating ${FEATURES.length} feature thumbnails...`)

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.setViewport({ width: WIDTH, height: HEIGHT })

    for (const feat of FEATURES) {
        try {
            await page.setContent(getHtml(feat))
            await page.evaluateHandle('document.fonts.ready')

            const outPath = path.join(OUTPUT_DIR, `${feat.slug}.png`)
            await page.screenshot({ path: outPath, type: 'png' })

            console.log(`✅  ${feat.slug}.png [${feat.category}]`)
        } catch (e) {
            console.error(`❌  ${feat.slug}: ${e.message}`)
        }
    }

    await browser.close()
    console.log('\n✨ Feature thumbnails updated!')
}

run().catch(err => { console.error(err); process.exit(1) })