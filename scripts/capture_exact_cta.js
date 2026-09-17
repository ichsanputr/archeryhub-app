import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const artifactDir = 'C:/Users/HP/.gemini/antigravity/brain/1b868962-d368-4da3-808e-b25497c71f96'
const artifactSection = path.resolve(artifactDir, 'verify_home_mobile_cta_section.png')

async function run() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 950, deviceScaleFactor: 1.5 })
    await page.goto('http://localhost:3003', { waitUntil: 'networkidle0', timeout: 30000 })
    await new Promise(r => setTimeout(r, 2000))

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
    })
    await new Promise(r => setTimeout(r, 1200))

    await page.screenshot({ path: artifactSection, type: 'png' })
    await browser.close()
    console.log('Saved exact mobile CTA section screenshot!')
}

run().catch(console.error)
