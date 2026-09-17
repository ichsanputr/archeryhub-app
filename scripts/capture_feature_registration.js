import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const htmlPath = path.resolve(__dirname, '../public/features/html/feature-registration.html')
const outPath1 = path.resolve(__dirname, '../public/features/feature_registration.png')
const outPath2 = path.resolve(__dirname, '../public/images/features/feature_registration.png')

async function run() {
    console.log('Launching Puppeteer...')
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    })

    const page = await browser.newPage()
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2
    })

    const fileUrl = 'file://' + htmlPath.replace(/\\/g, '/')
    console.log('Navigating to:', fileUrl)
    await page.goto(fileUrl, { waitUntil: 'networkidle0' })

    // Wait for web fonts & iconify icons to load
    await new Promise(r => setTimeout(r, 2000))

    // Ensure output directories exist
    fs.mkdirSync(path.dirname(outPath1), { recursive: true })
    fs.mkdirSync(path.dirname(outPath2), { recursive: true })

    console.log('Taking screenshot 1 ->', outPath1)
    await page.screenshot({ path: outPath1, type: 'png' })

    console.log('Taking screenshot 2 ->', outPath2)
    await page.screenshot({ path: outPath2, type: 'png' })

    await browser.close()
    console.log('Successfully captured 16:9 4K feature registration thumbnail!')
}

run().catch(err => {
    console.error('Capture error:', err)
    process.exit(1)
})
