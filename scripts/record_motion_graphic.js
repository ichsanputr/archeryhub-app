import puppeteer from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const htmlPath = path.resolve(__dirname, '../public/features/html/motion-registration.html')
const framesDir = path.resolve(__dirname, '../tmp/motion_frames')
const outMp4 = path.resolve(__dirname, '../public/features/feature_registration.mp4')
const outGif = path.resolve(__dirname, '../public/features/feature_registration.gif')
const outPoster = path.resolve(__dirname, '../public/features/feature_registration.png')

async function record() {
    console.log('--- Starting Motion Graphic Recording ---')
    
    // Prepare frames folder
    if (fs.existsSync(framesDir)) {
        fs.rmSync(framesDir, { recursive: true, force: true })
    }
    fs.mkdirSync(framesDir, { recursive: true })

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    })

    const page = await browser.newPage()
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    })

    const fileUrl = 'file://' + htmlPath.replace(/\\/g, '/')
    console.log('Loading motion graphic URL:', fileUrl)
    await page.goto(fileUrl, { waitUntil: 'networkidle0' })

    // Wait 1.5s for fonts & icons
    await new Promise(r => setTimeout(r, 1500))

    const FPS = 30
    const DURATION_SEC = 4.2
    const TOTAL_FRAMES = Math.round(FPS * DURATION_SEC)
    const FRAME_INTERVAL_MS = 1000 / FPS

    console.log(`Recording ${TOTAL_FRAMES} frames @ ${FPS} FPS (${DURATION_SEC}s)...`)

    for (let i = 0; i < TOTAL_FRAMES; i++) {
        const frameNum = String(i).padStart(4, '0')
        const frameFile = path.join(framesDir, `frame_${frameNum}.png`)
        
        await page.screenshot({ path: frameFile, type: 'png' })
        await new Promise(r => setTimeout(r, FRAME_INTERVAL_MS))

        if (i % 20 === 0 || i === TOTAL_FRAMES - 1) {
            process.stdout.write(`Captured frame ${i + 1}/${TOTAL_FRAMES}\r`)
        }
    }

    console.log('\nAll frames captured!')
    
    // Save the climax frame as the default static poster/thumbnail
    const climaxFrame = path.join(framesDir, `frame_${String(Math.round(TOTAL_FRAMES * 0.85)).padStart(4, '0')}.png`)
    if (fs.existsSync(climaxFrame)) {
        fs.copyFileSync(climaxFrame, outPoster)
        console.log('Updated static poster PNG ->', outPoster)
    }

    await browser.close()

    // ── ENCODE TO MP4 VIA FFMPEG ──
    console.log('Encoding MP4 with FFmpeg...')
    const inputPattern = path.join(framesDir, 'frame_%04d.png').replace(/\\/g, '/')
    const mp4Cmd = `ffmpeg -y -framerate ${FPS} -i "${inputPattern}" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast "${outMp4.replace(/\\/g, '/')}"`
    execSync(mp4Cmd, { stdio: 'inherit' })
    console.log('✓ Successfully created MP4:', outMp4)

    // ── ENCODE TO HIGH-QUALITY PALETTED GIF VIA FFMPEG ──
    console.log('Encoding High-Quality GIF with FFmpeg...')
    const gifCmd = `ffmpeg -y -framerate ${FPS} -i "${inputPattern}" -vf "fps=24,scale=1280:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" "${outGif.replace(/\\/g, '/')}"`
    execSync(gifCmd, { stdio: 'inherit' })
    console.log('✓ Successfully created GIF:', outGif)

    // Clean up temporary frames
    fs.rmSync(framesDir, { recursive: true, force: true })
    console.log('✓ Cleaned up temporary frame cache.')
    console.log('--- All Motion Graphic Artifacts Generated Successfully! ---')
}

record().catch(err => {
    console.error('Recording Error:', err)
    process.exit(1)
})
