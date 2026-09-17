const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function recordFeatureFast(featureName, urlPath, durationSec) {
  console.log('=======================================================');
  console.log(`Recording Feature: ${featureName} (${durationSec}s @ 60 FPS Stream)`);
  console.log('=======================================================');

  const mp4Output = path.join(__dirname, `../public/features/${featureName}.mp4`);
  const posterPath = path.join(__dirname, `../public/features/${featureName}.png`);
  const tempWebm = path.join(__dirname, `../tmp/temp_${featureName}.webm`);

  const tmpDir = path.join(__dirname, '../tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
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
  await new Promise(r => setTimeout(r, 2000));

  // Save lossless poster frame PNG at t=2.0s
  const posterDataUrl = await page.evaluate(() => {
    if (window.__renderAtTime) window.__renderAtTime(2000);
    const c = document.querySelector('canvas');
    return c.toDataURL('image/png');
  });
  const posterBuf = Buffer.from(posterDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
  fs.writeFileSync(posterPath, posterBuf);
  console.log('✓ Saved HD poster PNG:', posterPath);

  console.log(`Starting real-time 60 FPS hardware canvas stream for ${durationSec}s...`);
  const base64Video = await page.evaluate(async (durMs) => {
    const canvas = document.querySelector('canvas');
    // Reset animation to t=0
    if (window.__renderAtTime) window.__renderAtTime(0);
    if (window.__forcedTime !== undefined) delete window.__forcedTime;

    const stream = canvas.captureStream(60);
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 12000000
    });

    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.start(100);

    await new Promise(r => setTimeout(r, durMs));
    recorder.stop();

    await new Promise(r => recorder.onstop = r);
    const blob = new Blob(chunks, { type: 'video/webm' });
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(blob);
    });
  }, durationSec * 1000);

  await browser.close();

  fs.writeFileSync(tempWebm, Buffer.from(base64Video, 'base64'));
  console.log(`Raw WebM stream captured (${(fs.statSync(tempWebm).size / (1024 * 1024)).toFixed(2)} MB)`);

  console.log('Encoding to pristine H.264 MP4 with FFmpeg (CRF 18)...');
  const ffmpegCmd = `ffmpeg -y -i "${tempWebm}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p "${mp4Output}"`;
  execSync(ffmpegCmd, { stdio: 'inherit' });

  if (fs.existsSync(tempWebm)) fs.unlinkSync(tempWebm);

  console.log(`\n✓ SUCCESS: ${featureName}.mp4 generated in ${(durationSec + 5).toFixed(0)} seconds!`);
  const stat = fs.statSync(mp4Output);
  console.log(`  File size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB`);
}

async function main() {
  await recordFeatureFast('feature_scorekeeper', '/graphics/feature-scorekeeper', 25.0);
}

main().catch(err => {
  console.error('Recording error:', err);
  process.exit(1);
});
