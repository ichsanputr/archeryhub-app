import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const artifactDir = 'C:/Users/HP/.gemini/antigravity/brain/1b868962-d368-4da3-808e-b25497c71f96'
const outPath1 = path.resolve(__dirname, '../public/features/feature_mobile_scoring.png')
const outPath2 = path.resolve(__dirname, '../public/mobile/mobile_showcase.png')
const artifactGraphic = path.resolve(artifactDir, 'verify_mobile_showcase_1080.png')
const artifactSection = path.resolve(artifactDir, 'verify_home_mobile_cta_section.png')

async function run() {
    console.log('Launching Puppeteer...')
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    })

    // 1. Capture 1:1 Graphic Page (1080x1080)
    const page1 = await browser.newPage()
    await page1.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 })
    console.log('Navigating to graphics page...')
    await page1.goto('http://localhost:3003/graphics/mobile-showcase', { waitUntil: 'networkidle0', timeout: 30000 })
    await new Promise(r => setTimeout(r, 2000))

    await page1.screenshot({ path: outPath1, type: 'png' })
    await page1.screenshot({ path: outPath2, type: 'png' })
    await page1.screenshot({ path: artifactGraphic, type: 'png' })
    console.log('Saved 1:1 graphic to artifacts and public!')

    // 2. Capture Homepage Section with the 1:1 Image
    const page2 = await browser.newPage()
    await page2.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 })
    console.log('Navigating to homepage...')
    await page2.goto('http://localhost:3003', { waitUntil: 'networkidle0', timeout: 30000 })
    await new Promise(r => setTimeout(r, 2500))

    // Scroll to Mobile CTA section
    await page2.evaluate(() => {
        const h2 = Array.from(document.querySelectorAll('h2')).find(el => el.textContent.includes('Real-Time Archery Scoring') || el.textContent.includes('Shooting Line'))
        if (h2) {
            h2.scrollIntoView({ behavior: 'instant', block: 'center' })
        }
    })
    await new Promise(r => setTimeout(r, 1000))

    await page2.screenshot({ path: artifactSection, type: 'png' })
    console.log('Saved homepage section screenshot to artifacts!')

    await browser.close()
    console.log('Verification capture complete!')
}

run().catch(err => {
    console.error('Error during verification:', err)
    process.exit(1)
})
