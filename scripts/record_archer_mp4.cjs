const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function recordMotionGraphic() {
  console.log('--- Starting Feature 03 (Archer App) 1080x1080 MP4 Recording ---');
  
  const outputDir = path.join(__dirname, '../tmp/record_frames_feat3');
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1080,
    height: 1080,
    deviceScaleFactor: 1
  });

  const url = 'http://localhost:3003/graphics/feature-archer';
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // 16.5 seconds @ 30 FPS = 495 frames
  const FPS = 30;
  const DURATION_SEC = 16.5;
  const TOTAL_FRAMES = Math.round(FPS * DURATION_SEC); // 495 frames
  const FRAME_INTERVAL_MS = 1000 / FPS;

  console.log(`Recording ${TOTAL_FRAMES} frames @ ${FPS} FPS (${DURATION_SEC}s)...`);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const frameNumber = String(i + 1).padStart(4, '0');
    const framePath = path.join(outputDir, `frame_${frameNumber}.png`);
    
    await page.screenshot({ path: framePath });
    
    // Save high quality poster frame at t=2.0s (frame 60)
    if (i === 60) {
      const posterPath = path.join(__dirname, '../public/features/feature_archer.png');
      fs.copyFileSync(framePath, posterPath);
      console.log('Updated poster PNG ->', posterPath);
    }

    if ((i + 1) % 30 === 0 || i === TOTAL_FRAMES - 1) {
      process.stdout.write(`Captured frame ${i + 1}/${TOTAL_FRAMES}\n`);
    }

    // Advance animation frame time in browser
    await page.evaluate((interval) => {
      return new Promise(resolve => setTimeout(resolve, interval));
    }, FRAME_INTERVAL_MS);
  }

  await browser.close();
  console.log('All frames captured!');

  // Encode to MP4 with ffmpeg
  const mp4Output = path.join(__dirname, '../public/features/feature_archer.mp4');
  console.log('Encoding MP4 with FFmpeg...');

  const ffmpegCmd = `ffmpeg -y -framerate ${FPS} -i "${path.join(outputDir, 'frame_%04d.png')}" -c:v libx264 -pix_fmt yuv420p -crf 20 "${mp4Output}"`;
  
  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log('✓ Successfully created MP4:', mp4Output);
  } catch (err) {
    console.error('Error during ffmpeg encoding:', err);
  }

  // Cleanup frame files
  fs.rmSync(outputDir, { recursive: true, force: true });
  console.log('✓ Cleaned up temporary frame cache.');
  console.log('--- Feature 03 Motion Graphic Video Recorded Successfully! ---');
}

recordMotionGraphic().catch(console.error);
