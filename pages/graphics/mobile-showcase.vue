<template>
    <div class="w-[1080px] h-[1080px] relative overflow-hidden bg-[#F8FAF6] flex items-center justify-center font-sans antialiased select-none">
        
        <!-- Ambient Studio Light & Gradients -->
        <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-[#63C03B]/20 via-emerald-100/35 to-transparent blur-[110px] rounded-full pointer-events-none"></div>
        <div class="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-navy/8 blur-[130px] rounded-full pointer-events-none"></div>
        <div class="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-emerald-200/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div class="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-sky-200/20 blur-[120px] rounded-full pointer-events-none"></div>

        <!-- Archery Geometric Architectural Ring Watermark -->
        <svg class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[920px] h-[920px] text-navy/[0.035] pointer-events-none" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="390" stroke="currentColor" stroke-width="1.5" />
            <circle cx="400" cy="400" r="320" stroke="currentColor" stroke-width="2" />
            <circle cx="400" cy="400" r="250" stroke="currentColor" stroke-width="2.5" stroke-dasharray="14 14" />
            <circle cx="400" cy="400" r="180" stroke="currentColor" stroke-width="3" />
            <circle cx="400" cy="400" r="110" stroke="currentColor" stroke-width="3.5" />
            <line x1="400" y1="0" x2="400" y2="800" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" />
            <line x1="0" y1="400" x2="800" y2="400" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" />
        </svg>

        <!-- 3-Device Studio Composition Stage (Balanced Scale with Generous Side Padding) -->
        <div class="relative w-[1080px] h-[1080px] flex items-center justify-center">

            <!-- Floor Ambient Shadows -->
            <div class="absolute bottom-[105px] left-[110px] w-[290px] h-[40px] bg-slate-900/22 blur-[28px] rounded-full -rotate-6"></div>
            <div class="absolute bottom-[105px] right-[110px] w-[290px] h-[40px] bg-slate-900/22 blur-[28px] rounded-full rotate-6"></div>
            <div class="absolute bottom-[80px] left-1/2 -translate-x-1/2 w-[390px] h-[50px] bg-slate-900/38 blur-[34px] rounded-full"></div>

            <!-- Left Phone: Event Discovery & Tournament List -->
            <div class="absolute left-[85px] top-[225px] w-[370px] aspect-[622/910] rounded-[2.9rem] bg-slate-900 p-2.5 shadow-[0_32px_65px_-18px_rgba(15,23,42,0.32)] border-2 border-slate-700/80 -rotate-[6.5deg] scale-[0.94] z-10">
                <div class="w-full h-full rounded-[2.25rem] overflow-hidden bg-white relative border border-slate-200">
                    <img src="/mobile/screen_1.png" alt="Tournament Event Discovery" class="w-full h-full object-fill block" />
                    <div class="pointer-events-none absolute inset-0 rounded-[2.25rem] ring-1 ring-inset ring-black/10"></div>
                </div>
            </div>

            <!-- Right Phone: Official Scorekeeper Rapid Numpad -->
            <div class="absolute right-[85px] top-[225px] w-[370px] aspect-[623/910] rounded-[2.9rem] bg-slate-900 p-2.5 shadow-[0_32px_65px_-18px_rgba(15,23,42,0.32)] border-2 border-slate-700/80 rotate-[6.5deg] scale-[0.94] z-10">
                <div class="w-full h-full rounded-[2.25rem] overflow-hidden bg-white relative border border-slate-200">
                    <img src="/mobile/screen_3.png" alt="Scorekeeper Rapid Input" class="w-full h-full object-fill block" />
                    <div class="pointer-events-none absolute inset-0 rounded-[2.25rem] ring-1 ring-inset ring-black/10"></div>
                </div>
            </div>

            <!-- Center Phone: Hero Digital Target Face Scoring -->
            <div class="relative z-30 w-[440px] aspect-[625/912] rounded-[3.2rem] bg-slate-950 p-3 shadow-[0_45px_90px_-20px_rgba(15,23,42,0.45),0_18px_36px_-12px_rgba(15,23,42,0.22)] border-[2.5px] border-slate-600">
                <!-- Top Notch / Speaker Ear-piece -->
                <div class="absolute top-4 left-1/2 -translate-x-1/2 w-26 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-end px-3 border border-slate-800 shadow-inner">
                    <div class="w-2 h-2 rounded-full bg-slate-700"></div>
                </div>

                <!-- Screen Display Frame -->
                <div class="w-full h-full rounded-[2.5rem] overflow-hidden bg-white relative border border-slate-200 shadow-inner">
                    <img src="/mobile/screen_2.png" alt="Digital Target Face Scoring" class="w-full h-full object-fill block" />
                    <div class="pointer-events-none absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-black/10"></div>
                </div>
            </div>

        </div>

    </div>
</template>

<script setup>
definePageMeta({
    layout: false
})
</script>
