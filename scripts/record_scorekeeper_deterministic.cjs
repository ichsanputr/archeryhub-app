const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

async function recordScorekeeper() {
  const featureName = 'feature_scorekeeper';
  const urlPath = '/graphics/feature-scorekeeper';
  const durationSec = 25.0;
  const FPS = 30;
  const TOTAL_FRAMES = Math.round(FPS * durationSec); // 750 frames

  console.log('=======================================================');
  console.log(`Starting High-Speed Deterministic Recording: ${featureName}`);
  console.log(`Duration: ${durationSec}s | Framerate: ${FPS} FPS | Total: ${TOTAL_FRAMES} frames`);
  console.log('=======================================================');

  const mp4Output = path.join(__dirname, `../public/features/${featureName}.mp4`);
  const posterPath = path.join(__dirname, `../public/features/${featureName}.png`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1
  });

  const url = `http://localhost:3003${urlPath}`;
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.waitForFunction(() => typeof window.__renderAtTime === 'function', { timeout: 15000 });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Spawning FFmpeg stream pipe (MJPEG -> H.264 CRF 18)...');
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-framerate', String(FPS),
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    mp4Output
  ]);

  ffmpeg.stderr.on('data', () => {});

  console.log(`Streaming ${TOTAL_FRAMES} frames deterministically into FFmpeg...`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const virtualTimeMs = i * (1000 / FPS);

    // Capture poster as lossless PNG at t=2.4s (frame 72)
    if (i === 72) {
      const pngDataUrl = await page.evaluate((t) => {
        window.__renderAtTime(t);
        return document.querySelector('canvas').toDataURL('image/png');
      }, virtualTimeMs);
      const pngBuf = Buffer.from(pngDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
      fs.writeFileSync(posterPath, pngBuf);
      console.log('  -> Saved HD poster PNG:', posterPath);
    }

    // High quality JPEG (0.98) stream for ultra-fast video encoding
    const jpegDataUrl = await page.evaluate((t) => {
      window.__renderAtTime(t);
      return document.querySelector('canvas').toDataURL('image/jpeg', 0.98);
    }, virtualTimeMs);

    const base64Data = jpegDataUrl.replace(/^data:image\/jpeg;base64,/, '');
    const buf = Buffer.from(base64Data, 'base64');

    ffmpeg.stdin.write(buf);

    if ((i + 1) % 75 === 0 || i === TOTAL_FRAMES - 1) {
      const pct = Math.round(((i + 1) / TOTAL_FRAMES) * 100);
      const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
      const fpsReal = ((i + 1) / (Date.now() - startTime) * 1000).toFixed(1);
      console.log(`  [${pct}%] Streamed frame ${i + 1}/${TOTAL_FRAMES} (${elapsedSec}s elapsed @ ${fpsReal} fps)`);
    }
  }

  await browser.close();
  console.log('Finished streaming all frames. Finalizing MP4 encoding...');

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✓ Successfully generated HD MP4: ${mp4Output}`);
        const stat = fs.statSync(mp4Output);
        console.log(`  File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

recordScorekeeper().catch(err => {
  console.error('Fatal recording error:', err);
  process.exit(1);
});
