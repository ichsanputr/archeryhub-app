import puppeteer from 'puppeteer';

async function generateDiagrams() {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();

  // ── 1. DIAGRAM 1: 4 Main Stages of Archery Form (Title Case) ──
  const htmlDiagram1 = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #ffffff;
        margin: 0;
        padding: 0;
        width: 1920px;
        height: 1080px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body class="p-14 bg-white text-slate-900 select-none">
    
    <!-- Header -->
    <div class="flex items-center justify-between pb-8 border-b-2 border-slate-100">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-[#bef264] text-sm font-bold tracking-wide">
          <span>Archeris Form Guide</span>
        </div>
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">The 4 Main Stages of Archery Form</h1>
        <p class="text-lg text-slate-500 font-medium">A step-by-step visual routine for consistent, accurate shooting</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#bef264] font-black text-2xl">A</div>
        <div>
          <div class="text-xl font-black text-slate-900 leading-none">Archeris</div>
          <div class="text-xs font-semibold text-slate-400">Coaching Handbook</div>
        </div>
      </div>
    </div>

    <!-- 4 Stages Grid -->
    <div class="grid grid-cols-4 gap-8 my-auto">
      
      <!-- Stage 1 -->
      <div class="bg-slate-50 rounded-3xl p-7 border-2 border-slate-200/80 flex flex-col justify-between h-[640px]">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-slate-900 text-[#bef264] flex items-center justify-center text-xl font-extrabold shadow-sm">1</div>
          <h2 class="text-2xl font-bold text-slate-900 leading-snug">Stance & Setup</h2>
          <p class="text-slate-600 text-base leading-relaxed">Establish a solid, balanced base sideways across the shooting line before lifting your bow.</p>
        </div>
        
        <!-- SVG Graphic -->
        <div class="my-auto py-4 flex justify-center">
          <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="220" x2="200" y2="220" stroke="#cbd5e1" stroke-width="4" stroke-linecap="round"/>
            <line x1="110" y1="200" x2="110" y2="230" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="6 6"/>
            <rect x="50" y="210" width="30" height="12" rx="6" fill="#0f172a"/>
            <rect x="140" y="210" width="30" height="12" rx="6" fill="#0f172a"/>
            <line x1="65" y1="210" x2="100" y2="140" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
            <line x1="155" y1="210" x2="120" y2="140" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
            <line x1="110" y1="140" x2="110" y2="70" stroke="#0f172a" stroke-width="12" stroke-linecap="round"/>
            <circle cx="110" cy="40" r="22" fill="#bef264" stroke="#0f172a" stroke-width="6"/>
            <path d="M40 50 Q30 130 40 210" stroke="#0ea5e9" stroke-width="6" fill="none" stroke-linecap="round"/>
            <line x1="40" y1="50" x2="40" y2="210" stroke="#64748b" stroke-width="2"/>
          </svg>
        </div>

        <div class="space-y-2 pt-4 border-t border-slate-200">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>Feet Shoulder-Width Apart</span>
          </div>
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>Weight Split 50/50</span>
          </div>
        </div>
      </div>

      <!-- Stage 2 -->
      <div class="bg-slate-50 rounded-3xl p-7 border-2 border-slate-200/80 flex flex-col justify-between h-[640px]">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-slate-900 text-[#bef264] flex items-center justify-center text-xl font-extrabold shadow-sm">2</div>
          <h2 class="text-2xl font-bold text-slate-900 leading-snug">Grip & Nock</h2>
          <p class="text-slate-600 text-base leading-relaxed">Snap the arrow onto the string and set your 45-degree relaxed palm grip on the bow handle.</p>
        </div>

        <!-- SVG Graphic -->
        <div class="my-auto py-4 flex justify-center">
          <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="60" y="30" width="24" height="180" rx="8" fill="#0f172a"/>
            <rect x="56" y="90" width="32" height="60" rx="6" fill="#0ea5e9"/>
            <path d="M120 160 Q80 140 70 120 Q60 100 80 80 Q100 80 120 100" stroke="#0f172a" stroke-width="7" fill="#ffffff" stroke-linecap="round"/>
            <line x1="80" y1="120" x2="130" y2="70" stroke="#bef264" stroke-width="6" stroke-linecap="round"/>
            <line x1="30" y1="110" x2="190" y2="110" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
            <polygon points="190,105 205,110 190,115" fill="#bef264"/>
          </svg>
        </div>

        <div class="space-y-2 pt-4 border-t border-slate-200">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>45° Relaxed Palm Angle</span>
          </div>
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>Index Vane Facing Out</span>
          </div>
        </div>
      </div>

      <!-- Stage 3 -->
      <div class="bg-slate-50 rounded-3xl p-7 border-2 border-slate-200/80 flex flex-col justify-between h-[640px]">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-slate-900 text-[#bef264] flex items-center justify-center text-xl font-extrabold shadow-sm">3</div>
          <h2 class="text-2xl font-bold text-slate-900 leading-snug">Draw & Anchor</h2>
          <p class="text-slate-600 text-base leading-relaxed">Smoothly pull with your back muscles and lock your index finger under your jawbone.</p>
        </div>

        <!-- SVG Graphic -->
        <div class="my-auto py-4 flex justify-center">
          <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="50" r="22" fill="#bef264" stroke="#0f172a" stroke-width="6"/>
            <line x1="140" y1="80" x2="50" y2="80" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
            <path d="M140 80 L185 80 L145 65" stroke="#0f172a" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M40 20 Q55 80 40 180" stroke="#0ea5e9" stroke-width="7" fill="none" stroke-linecap="round"/>
            <path d="M40 20 L145 65 L40 180" stroke="#64748b" stroke-width="3" fill="none"/>
            <line x1="40" y1="75" x2="145" y2="65" stroke="#0f172a" stroke-width="5"/>
            <circle cx="145" cy="65" r="8" fill="#bef264" stroke="#0f172a" stroke-width="3"/>
          </svg>
        </div>

        <div class="space-y-2 pt-4 border-t border-slate-200">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>Solid Jawline Contact</span>
          </div>
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>String on Nose & Chin</span>
          </div>
        </div>
      </div>

      <!-- Stage 4 -->
      <div class="bg-slate-50 rounded-3xl p-7 border-2 border-slate-200/80 flex flex-col justify-between h-[640px]">
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-slate-900 text-[#bef264] flex items-center justify-center text-xl font-extrabold shadow-sm">4</div>
          <h2 class="text-2xl font-bold text-slate-900 leading-snug">Alignment & Release</h2>
          <p class="text-slate-600 text-base leading-relaxed">Relax your drawing fingers completely, expand through the clicker, and hold your follow-through.</p>
        </div>

        <!-- SVG Graphic -->
        <div class="my-auto py-4 flex justify-center">
          <svg width="220" height="240" viewBox="0 0 220 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="150" cy="50" r="22" fill="#bef264" stroke="#0f172a" stroke-width="6"/>
            <line x1="140" y1="80" x2="50" y2="80" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
            <line x1="140" y1="80" x2="190" y2="85" stroke="#0f172a" stroke-width="10" stroke-linecap="round"/>
            <path d="M45 20 Q35 80 45 180" stroke="#0ea5e9" stroke-width="7" fill="none" stroke-linecap="round"/>
            <line x1="45" y1="20" x2="45" y2="180" stroke="#64748b" stroke-width="3"/>
            <line x1="-10" y1="78" x2="30" y2="78" stroke="#0f172a" stroke-width="5" stroke-linecap="round"/>
            <polygon points="30,73 42,78 30,83" fill="#bef264"/>
            <path d="M195 75 Q205 85 195 95" stroke="#0ea5e9" stroke-width="4" fill="none" stroke-linecap="round"/>
          </svg>
        </div>

        <div class="space-y-2 pt-4 border-t border-slate-200">
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>Clean Finger Relaxation</span>
          </div>
          <div class="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span class="w-2 h-2 rounded-full bg-[#bef264]"></span>
            <span>2-Second Follow-Through</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer Summary -->
    <div class="bg-slate-900 rounded-2xl px-8 py-5 text-white flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="px-3 py-1 bg-[#bef264] text-slate-900 text-xs font-black rounded-lg">Coaching Tip</span>
        <span class="text-sm font-medium text-slate-200">Repeat each step in sequence without rushing. Consistency in form creates consistency in score.</span>
      </div>
      <div class="text-xs font-semibold text-slate-400">Figure 1.1 • Archeris Official Guide</div>
    </div>

  </body>
  </html>
  `;

  await page.setContent(htmlDiagram1, { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  const out1 = 'c:/E/ichsan/startup/archeryhub.id/app/public/images/blog/illustrations/archery_form_steps_2d.jpg';
  await page.screenshot({ path: out1, quality: 95, type: 'jpeg' });
  console.log('Generated Diagram 1 ->', out1);


  // ── 2. DIAGRAM 2: 45° Relaxed Grip & Finger Hook (Title Case) ──
  const htmlDiagram2 = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #ffffff;
        margin: 0;
        padding: 0;
        width: 1920px;
        height: 1080px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body class="p-14 bg-white text-slate-900 select-none">
    
    <!-- Header -->
    <div class="flex items-center justify-between pb-8 border-b-2 border-slate-100">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-[#bef264] text-sm font-bold tracking-wide">
          <span>Hand Placement Details</span>
        </div>
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">45-Degree Relaxed Grip and Mediterranean Hook</h1>
        <p class="text-lg text-slate-500 font-medium">Proper hand mechanics for zero bow torque and clean arrow release</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#bef264] font-black text-2xl">A</div>
        <div>
          <div class="text-xl font-black text-slate-900 leading-none">Archeris</div>
          <div class="text-xs font-semibold text-slate-400">Technique Handbook</div>
        </div>
      </div>
    </div>

    <!-- 2 Main Panels -->
    <div class="grid grid-cols-2 gap-10 my-auto">
      
      <!-- Left Panel: 45° Relaxed Palm Grip -->
      <div class="bg-slate-50 rounded-3xl p-9 border-2 border-slate-200/80 flex flex-col justify-between h-[640px]">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-400">Left Panel</span>
            <h2 class="text-3xl font-extrabold text-slate-900 mt-1">45-Degree Relaxed Grip</h2>
          </div>
          <span class="px-4 py-1.5 rounded-xl bg-slate-900 text-[#bef264] text-xs font-bold">Bow Hand Placement</span>
        </div>

        <!-- SVG Vector Artwork -->
        <div class="my-auto py-6 flex justify-center">
          <svg width="400" height="280" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="90" y="20" width="40" height="240" rx="12" fill="#0f172a"/>
            <rect x="85" y="90" width="50" height="90" rx="8" fill="#0ea5e9"/>
            
            <path d="M260 220 Q190 190 150 160 Q120 130 140 100 Q160 80 200 90 Q240 100 270 140" 
                  stroke="#0f172a" stroke-width="9" fill="#ffffff" stroke-linecap="round"/>
            <line x1="140" y1="180" x2="260" y2="60" stroke="#bef264" stroke-width="7" stroke-linecap="round"/>
            <polygon points="260,60 245,65 255,75" fill="#bef264"/>
            <text x="200" y="45" fill="#0f172a" font-size="18" font-weight="800">45° Knuckle Angle</text>
            
            <circle cx="135" cy="140" r="16" fill="#bef264" stroke="#0f172a" stroke-width="5"/>
            <text x="25" y="145" fill="#0f172a" font-size="16" font-weight="700">Thumb Pad Contact</text>
            <line x1="100" y1="145" x2="119" y2="140" stroke="#0f172a" stroke-width="3"/>
          </svg>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-5 border-t border-slate-200">
          <div class="space-y-1">
            <div class="text-sm font-bold text-slate-900">Thumb Pad Pressure</div>
            <div class="text-xs text-slate-500">Rest center handle directly on thenar pad.</div>
          </div>
          <div class="space-y-1">
            <div class="text-sm font-bold text-slate-900">Relaxed Fingers</div>
            <div class="text-xs text-slate-500">Do not squeeze; let finger sling retain bow.</div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Mediterranean String Hook -->
      <div class="bg-slate-50 rounded-3xl p-9 border-2 border-slate-200/80 flex flex-col justify-between h-[640px]">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-400">Right Panel</span>
            <h2 class="text-3xl font-extrabold text-slate-900 mt-1">Mediterranean Finger Hook</h2>
          </div>
          <span class="px-4 py-1.5 rounded-xl bg-slate-900 text-[#bef264] text-xs font-bold">Draw Hand Placement</span>
        </div>

        <!-- SVG Vector Artwork -->
        <div class="my-auto py-6 flex justify-center">
          <svg width="400" height="280" viewBox="0 0 400 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="180" y1="10" x2="180" y2="270" stroke="#0ea5e9" stroke-width="8" stroke-linecap="round"/>
            
            <line x1="20" y1="140" x2="180" y2="140" stroke="#0f172a" stroke-width="8" stroke-linecap="round"/>
            <circle cx="180" cy="140" r="10" fill="#bef264" stroke="#0f172a" stroke-width="4"/>
            
            <path d="M300 90 L210 90 Q175 90 175 110" stroke="#0f172a" stroke-width="9" fill="none" stroke-linecap="round"/>
            <path d="M310 145 L205 145 Q175 145 175 165" stroke="#0f172a" stroke-width="9" fill="none" stroke-linecap="round"/>
            <path d="M295 195 L210 195 Q175 195 175 215" stroke="#0f172a" stroke-width="9" fill="none" stroke-linecap="round"/>
            
            <circle cx="178" cy="100" r="7" fill="#bef264"/>
            <circle cx="178" cy="155" r="7" fill="#bef264"/>
            <circle cx="178" cy="205" r="7" fill="#bef264"/>
            
            <text x="215" y="245" fill="#0f172a" font-size="16" font-weight="700">First Joint Crease</text>
            <path d="M210 240 L190 215" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-5 border-t border-slate-200">
          <div class="space-y-1">
            <div class="text-sm font-bold text-slate-900">3-Finger Placement</div>
            <div class="text-xs text-slate-500">One finger above nock, two fingers below.</div>
          </div>
          <div class="space-y-1">
            <div class="text-sm font-bold text-slate-900">Flat Wrist Line</div>
            <div class="text-xs text-slate-500">Keep back of hand and wrist fully relaxed.</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer Summary -->
    <div class="bg-slate-900 rounded-2xl px-8 py-5 text-white flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="px-3 py-1 bg-[#bef264] text-slate-900 text-xs font-black rounded-lg">Summary</span>
        <span class="text-sm font-medium text-slate-200">A loose palm grip prevents riser torque; seating the string in the first finger joint guarantees a clean release.</span>
      </div>
      <div class="text-xs font-semibold text-slate-400">Figure 1.2 • Archeris Technique Guide</div>
    </div>

  </body>
  </html>
  `;

  await page.setContent(htmlDiagram2, { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  const out2 = 'c:/E/ichsan/startup/archeryhub.id/app/public/images/blog/illustrations/archery_grip_hook_2d.jpg';
  await page.screenshot({ path: out2, quality: 95, type: 'jpeg' });
  console.log('Generated Diagram 2 ->', out2);


  // ── 3. DIAGRAM 3: Anatomy of a Recurve Bow and Arrow (Title Case) ──
  const htmlDiagram3 = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: #ffffff;
        margin: 0;
        padding: 0;
        width: 1920px;
        height: 1080px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body class="p-14 bg-white text-slate-900 select-none">
    
    <!-- Header -->
    <div class="flex items-center justify-between pb-8 border-b-2 border-slate-100">
      <div class="space-y-2">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-[#bef264] text-sm font-bold tracking-wide">
          <span>Equipment Anatomy</span>
        </div>
        <h1 class="text-4xl font-extrabold text-slate-900 tracking-tight">Anatomy of a Recurve Bow and Arrow</h1>
        <p class="text-lg text-slate-500 font-medium">Essential components and tuning hardware of modern target archery setups</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#bef264] font-black text-2xl">A</div>
        <div>
          <div class="text-xl font-black text-slate-900 leading-none">Archeris</div>
          <div class="text-xs font-semibold text-slate-400">Hardware Reference</div>
        </div>
      </div>
    </div>

    <!-- Main Canvas -->
    <div class="bg-slate-50 rounded-3xl p-8 border-2 border-slate-200/80 my-auto h-[640px] flex items-center justify-between relative overflow-hidden">
      
      <!-- Left Callouts (Bow) -->
      <div class="w-72 space-y-6 z-10">
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="text-xs font-bold text-slate-400">Top Component</div>
          <div class="text-lg font-extrabold text-slate-900">Upper Limb</div>
          <div class="text-xs text-slate-500 mt-0.5">Flexible blade storing potential energy.</div>
        </div>
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="text-xs font-bold text-slate-400">Core Chassis</div>
          <div class="text-lg font-extrabold text-slate-900">Riser (Handle)</div>
          <div class="text-xs text-slate-500 mt-0.5">Machined aluminum center frame.</div>
        </div>
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="text-xs font-bold text-slate-400">Bottom Component</div>
          <div class="text-lg font-extrabold text-slate-900">Lower Limb</div>
          <div class="text-xs text-slate-500 mt-0.5">Matched limb providing balanced power.</div>
        </div>
      </div>

      <!-- Central SVG Diagram (Bow & Arrow) -->
      <div class="flex-1 flex justify-center items-center z-10">
        <svg width="760" height="560" viewBox="0 0 760 560" fill="none" xmlns="http://www.w3.org/2000/svg">
          
          <!-- Recurve Bow Curve -->
          <path d="M160 40 Q80 100 120 200 L120 360 Q80 460 160 520" stroke="#0f172a" stroke-width="12" fill="none" stroke-linecap="round"/>
          <!-- Riser Section -->
          <rect x="112" y="200" width="22" height="160" rx="8" fill="#0ea5e9"/>
          <!-- Grip -->
          <rect x="108" y="260" width="28" height="50" rx="6" fill="#bef264"/>
          <!-- Bowstring -->
          <line x1="160" y1="40" x2="160" y2="520" stroke="#94a3b8" stroke-width="4"/>
          <!-- Center Serving -->
          <line x1="160" y1="230" x2="160" y2="330" stroke="#0f172a" stroke-width="8"/>

          <!-- Stabilizer Rod (Forward) -->
          <line x1="120" y1="310" x2="340" y2="310" stroke="#0f172a" stroke-width="7" stroke-linecap="round"/>
          <circle cx="345" cy="310" r="10" fill="#0ea5e9"/>
          <path d="M260 310 L290 380" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
          <rect x="230" y="385" width="130" height="30" rx="8" fill="#0f172a"/>
          <text x="295" y="405" fill="#bef264" font-size="13" font-weight="700" text-anchor="middle">Stabilizer Rod</text>

          <!-- Sight Pin Assembly (Upward & Forward) -->
          <line x1="130" y1="210" x2="220" y2="210" stroke="#0f172a" stroke-width="4"/>
          <line x1="220" y1="190" x2="220" y2="230" stroke="#0f172a" stroke-width="4"/>
          <circle cx="220" cy="200" r="7" fill="#bef264" stroke="#0f172a" stroke-width="2.5"/>
          <path d="M220 190 L240 140" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
          <rect x="195" y="110" width="100" height="30" rx="8" fill="#0f172a"/>
          <text x="245" y="130" fill="#bef264" font-size="13" font-weight="700" text-anchor="middle">Sight Pin</text>

          <!-- Plunger Button (Arrow Rest Area) -->
          <circle cx="140" cy="265" r="7" fill="#bef264" stroke="#0f172a" stroke-width="3"/>
          <path d="M140 265 L90 230" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
          <rect x="20" y="200" width="125" height="30" rx="8" fill="#0f172a"/>
          <text x="82" y="220" fill="#bef264" font-size="13" font-weight="700" text-anchor="middle">Plunger Button</text>

          <!-- Target Carbon Arrow Horizontal -->
          <g transform="translate(160, 260)">
            <!-- Shaft -->
            <line x1="0" y1="0" x2="480" y2="0" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
            
            <!-- Steel Point -->
            <polygon points="480,-7 510,0 480,7" fill="#0ea5e9"/>
            <path d="M495 -7 L515 -45" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
            <rect x="465" y="-75" width="100" height="30" rx="8" fill="#0f172a"/>
            <text x="515" y="-55" fill="#bef264" font-size="13" font-weight="700" text-anchor="middle">Steel Point</text>
            
            <!-- Carbon Shaft Label -->
            <path d="M320 0 L320 -45" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
            <rect x="260" y="-75" width="120" height="30" rx="8" fill="#0f172a"/>
            <text x="320" y="-55" fill="#bef264" font-size="13" font-weight="700" text-anchor="middle">Carbon Shaft</text>
            
            <!-- Fletching Vanes -->
            <path d="M60 -4 L25 -18 L38 -4" fill="#bef264"/>
            <path d="M60 4 L25 18 L38 4" fill="#bef264"/>
            <path d="M45 -18 L70 -55" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
            <rect x="20" y="-85" width="125" height="30" rx="8" fill="#0f172a"/>
            <text x="82" y="-65" fill="#bef264" font-size="13" font-weight="700" text-anchor="middle">Fletching Vanes</text>

            <!-- Nock -->
            <rect x="-14" y="-6" width="14" height="12" rx="3" fill="#bef264" stroke="#0f172a" stroke-width="2"/>
            <path d="M-7 6 L-7 50" stroke="#64748b" stroke-width="2" stroke-dasharray="4 4"/>
            <rect x="-40" y="55" width="70" height="30" rx="8" fill="#0f172a"/>
            <text x="-5" y="75" fill="#bef264" font-size="13" font-weight="700" text-anchor="middle">Nock</text>
          </g>

        </svg>
      </div>

      <!-- Right Callouts (Arrow & Tuning) -->
      <div class="w-72 space-y-6 z-10">
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="text-xs font-bold text-slate-400">Aiming Reference</div>
          <div class="text-lg font-extrabold text-slate-900">Sight Pin</div>
          <div class="text-xs text-slate-500 mt-0.5">Calibrated pin for distance adjustments.</div>
        </div>
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="text-xs font-bold text-slate-400">Arrow Cushion</div>
          <div class="text-lg font-extrabold text-slate-900">Plunger Button</div>
          <div class="text-xs text-slate-500 mt-0.5">Spring-loaded pin damping arrow flex.</div>
        </div>
        <div class="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div class="text-xs font-bold text-slate-400">Balance & Vibration</div>
          <div class="text-lg font-extrabold text-slate-900">Stabilizer System</div>
          <div class="text-xs text-slate-500 mt-0.5">Absorbs hand shock on release.</div>
        </div>
      </div>

    </div>

    <!-- Footer Summary -->
    <div class="bg-slate-900 rounded-2xl px-8 py-5 text-white flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="px-3 py-1 bg-[#bef264] text-slate-900 text-xs font-black rounded-lg">Hardware Breakdown</span>
        <span class="text-sm font-medium text-slate-200">Proper alignment of riser, limbs, and plunger button ensures clean arrow flight without riser contact.</span>
      </div>
      <div class="text-xs font-semibold text-slate-400">Figure 1.3 • Archeris Gear Guide</div>
    </div>

  </body>
  </html>
  `;

  await page.setContent(htmlDiagram3, { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1200));
  const out3 = 'c:/E/ichsan/startup/archeryhub.id/app/public/images/blog/illustrations/bow_anatomy_diagram_2d.jpg';
  await page.screenshot({ path: out3, quality: 95, type: 'jpeg' });
  console.log('Generated Diagram 3 ->', out3);

  await browser.close();
}

generateDiagrams().catch(err => {
  console.error(err);
  process.exit(1);
});
