import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const OUTPUT_DIR = path.join(__dirname, '../public/features')
const SIZE = 1000 // 1:1 Aspect Ratio

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const FEATURES = [
    'registration',
    'scoring',
    'leaderboard',
    'report',
    'payment',
    'profile'
]

const run = async () => {
    console.log(`\n🚀 Capturing ${FEATURES.length} Archeris feature prototypes...`)

    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.setViewport({ width: SIZE, height: SIZE })

    for (const name of FEATURES) {
        try {
            const htmlPath = path.join(__dirname, `../public/features/html/feature-${name}.html`)
            const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`
            
            await page.goto(fileUrl, { waitUntil: 'networkidle0' })
            await page.evaluateHandle('document.fonts.ready')

            const outPath = path.join(OUTPUT_DIR, `feature_${name}.png`)
            await page.screenshot({ path: outPath, type: 'png' })

            console.log(`✅  feature_${name}.png captured`)
        } catch (e) {
            console.error(`❌  ${name}: ${e.message}`)
        }
    }

    await browser.close()
    console.log('\n✨ Feature thumbnails updated from HTML prototypes!')
}

run().catch(err => { console.error(err); process.exit(1) })
