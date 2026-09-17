import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outPath1 = path.resolve(__dirname, '../public/features/feature_mobile_scoring.png')
const outPath2 = path.resolve(__dirname, '../public/mobile/mobile_showcase.png')

async function run() {
    console.log('Launching Puppeteer...')
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    })

    const page = await browser.newPage()
    await page.setViewport({
        width: 1080,
        height: 1080,
        deviceScaleFactor: 2
    })

    const url = 'http://localhost:3003/graphics/mobile-showcase'
    console.log('Navigating to:', url)
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

    // Wait for web fonts & images to fully render
    await new Promise(r => setTimeout(r, 2500))

    // Ensure output directories exist
    fs.mkdirSync(path.dirname(outPath1), { recursive: true })
    fs.mkdirSync(path.dirname(outPath2), { recursive: true })

    console.log('Taking screenshot ->', outPath1)
    await page.screenshot({ path: outPath1, type: 'png' })

    console.log('Taking screenshot ->', outPath2)
    await page.screenshot({ path: outPath2, type: 'png' })

    await browser.close()
    console.log('Successfully captured 1:1 mobile showcase image!')
}

run().catch(err => {
    console.error('Capture error:', err)
    process.exit(1)
})
