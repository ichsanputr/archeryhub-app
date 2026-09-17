import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const framesDir = path.resolve(__dirname, '../tmp/record_frames_1080')
const outMp4 = path.resolve(__dirname, '../public/features/feature_registration.mp4')
const outPoster = path.resolve(__dirname, '../public/features/feature_registration.png')

async function record() {
    console.log('--- Starting 1:1 1080x1080 Motion Graphic Recording ---')
    
    if (fs.existsSync(framesDir)) {
        fs.rmSync(framesDir, { recursive: true, force: true })
    }
    fs.mkdirSync(framesDir, { recursive: true })

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setViewport({
        width: 1080,
        height: 1080,
        deviceScaleFactor: 1
    })

    const targetUrl = 'http://localhost:3003/graphics/feature-registration'
    console.log('Navigating to:', targetUrl)
    await page.goto(targetUrl, { waitUntil: 'networkidle0' })

    await new Promise(r => setTimeout(r, 2500))

    const FPS = 30
    const DURATION_SEC = 17.0
    const TOTAL_FRAMES = Math.round(FPS * DURATION_SEC)
    const FRAME_INTERVAL_MS = 1000 / FPS

    console.log(`Recording ${TOTAL_FRAMES} frames @ ${FPS} FPS (${DURATION_SEC}s)...`)

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const frameNum = String(i).padStart(4, '0')
        const frameFile = path.join(framesDir, `frame_${frameNum}.png`)
        
        await page.screenshot({ path: frameFile, type: 'png' })
        await new Promise(r => setTimeout(r, FRAME_INTERVAL_MS))

        if (i % 30 === 0 || i === TOTAL_FRAMES - 1) {
            process.stdout.write(`Captured frame ${i + 1}/${TOTAL_FRAMES}\r`)
        }
    }

    console.log('\nAll frames captured!')
    
    const posterFrame = path.join(framesDir, 'frame_0100.png')
    if (fs.existsSync(posterFrame)) {
        fs.copyFileSync(posterFrame, outPoster)
        console.log('Updated poster PNG ->', outPoster)
    }

    await browser.close()

    console.log('Encoding MP4 with FFmpeg...')
    const inputPattern = path.join(framesDir, 'frame_%04d.png').replace(/\\/g, '/')
    const mp4Cmd = `ffmpeg -y -framerate ${FPS} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium "${outMp4.replace(/\\/g, '/')}"`
    execSync(mp4Cmd, { stdio: 'inherit' })
    console.log('✓ Successfully created MP4:', outMp4)

    fs.rmSync(framesDir, { recursive: true, force: true })
    console.log('✓ Cleaned up temporary frame cache.')
    console.log('--- Motion Graphic Video Recorded Successfully! ---')
}

record().catch(err => {
    console.error('Recording Error:', err)
    process.exit(1)
})
