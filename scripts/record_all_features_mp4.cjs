const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function recordSingleFeature(featureName, urlPath, durationSec = 17.5) {
  console.log(`\n========================================`);
  console.log(`Starting Recording for: ${featureName} (${durationSec}s @ 30 FPS)`);
  console.log(`========================================`);

  const outputDir = path.join(__dirname, `../tmp/record_frames_${featureName}`);
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

  const url = `http://localhost:3003${urlPath}`;
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Warm-up wait for font rendering
  await new Promise(r => setTimeout(r, 2000));

  const FPS = 30;
  const TOTAL_FRAMES = Math.round(FPS * durationSec);
  const FRAME_INTERVAL_MS = 1000 / FPS;

  console.log(`Recording ${TOTAL_FRAMES} frames...`);

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const frameNumber = String(i + 1).padStart(4, '0');
    const framePath = path.join(outputDir, `frame_${frameNumber}.png`);
    
    await page.screenshot({ path: framePath, type: 'png' });
    
    // Save high quality poster frame at t=2.4s (frame 72)
    if (i === 72) {
      const posterPath = path.join(__dirname, `../public/features/${featureName}.png`);
      fs.copyFileSync(framePath, posterPath);
      console.log('Updated poster PNG ->', posterPath);
    }

    if ((i + 1) % 45 === 0 || i === TOTAL_FRAMES - 1) {
      process.stdout.write(`Captured frame ${i + 1}/${TOTAL_FRAMES}\n`);
    }

    await page.evaluate((interval) => {
      return new Promise(resolve => setTimeout(resolve, interval));
    }, FRAME_INTERVAL_MS);
  }

  await browser.close();
  console.log('All frames captured for', featureName);

  // Encode to pristine HD MP4 with CRF 18
  const mp4Output = path.join(__dirname, `../public/features/${featureName}.mp4`);
  console.log('Encoding HD MP4 with FFmpeg...');

  const ffmpegCmd = `ffmpeg -y -framerate ${FPS} -i "${path.join(outputDir, 'frame_%04d.png')}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${mp4Output}"`;
  
  try {
    execSync(ffmpegCmd, { stdio: 'inherit' });
    console.log(`✓ Successfully generated HD MP4: ${mp4Output}`);
  } catch (err) {
    console.error('Error during ffmpeg encoding:', err);
  }

  // Cleanup temporary frame cache
  fs.rmSync(outputDir, { recursive: true, force: true });
}

async function main() {
  await recordSingleFeature('feature_competition', '/graphics/feature-competition', 17.5);
  await recordSingleFeature('feature_archer', '/graphics/feature-archer', 17.5);
  await recordSingleFeature('feature_scorekeeper', '/graphics/feature-scorekeeper', 17.5);
  console.log('\n✓ ALL 3 FEATURE VIDEOS RECORDED IN PRISTINE HD QUALITY!');
}

main().catch(console.error);
