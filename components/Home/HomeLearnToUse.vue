<template>
    <section class="py-20 sm:py-32 bg-[#DEFEBD] overflow-hidden relative">
        <!-- Creative Archery Target Orbit Spiral SVG (Right Side - Navy) -->
        <svg class="absolute -right-32 -bottom-32 h-[135%] w-auto text-navy pointer-events-none opacity-20 animate-[spin_240s_linear_infinite]" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="360" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="10 15" opacity="0.15" />
            <circle cx="400" cy="400" r="290" fill="none" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <circle cx="400" cy="400" r="220" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.3" />
            <circle cx="400" cy="400" r="150" fill="none" stroke="currentColor" stroke-width="5" opacity="0.4" />
            <circle cx="400" cy="400" r="80" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.5" />
            <path d="M 400 400 A 300 300 0 0 1 700 400 A 240 240 0 0 1 400 640 A 180 180 0 0 1 220 400 Z" fill="none" stroke="currentColor" stroke-width="2" opacity="0.18" />
            <line x1="400" y1="40" x2="400" y2="760" stroke="currentColor" stroke-width="1" stroke-dasharray="10 10" opacity="0.12" />
            <line x1="40" y1="400" x2="760" y2="400" stroke="currentColor" stroke-width="1" stroke-dasharray="10 10" opacity="0.12" />
        </svg>

        <!-- Creative Archery Target Orbit Spiral SVG (Left Side - Navy) -->
        <svg class="absolute -left-32 -top-32 h-[135%] w-auto text-navy pointer-events-none opacity-20" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="400" cy="400" r="360" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="10 15" opacity="0.15" />
            <circle cx="400" cy="400" r="290" fill="none" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <circle cx="400" cy="400" r="220" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.3" />
            <path d="M 400 400 A 300 300 0 0 1 700 400 A 240 240 0 0 1 400 640 A 180 180 0 0 1 220 400 Z" fill="none" stroke="currentColor" stroke-width="2" opacity="0.18" />
            <line x1="400" y1="40" x2="400" y2="760" stroke="currentColor" stroke-width="1" stroke-dasharray="10 10" opacity="0.12" />
            <line x1="40" y1="400" x2="760" y2="400" stroke="currentColor" stroke-width="1" stroke-dasharray="10 10" opacity="0.12" />
        </svg>

        <div class="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <!-- Section Header -->
            <div class="text-center mb-16 sm:mb-24">
                <h2 class="text-3xl sm:text-5xl font-black text-navy leading-tight mb-6 font-display tracking-tight">
                    {{ $t('home.learn.title') }} <br class="hidden sm:block" />
                    <span class="text-navy/70">
                        {{ $t('home.learn.subtitle') }}
                    </span>
                </h2>
                <p class="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
                    {{ $t('home.learn.description') }}
                </p>
            </div>

            <!-- Three Centered White Feature Panels (Smooth Featherweight Shadows) -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch justify-center">
                
                <!-- ── CARD 1: CLUB REGISTRATION & MANAGEMENT ── -->
                <div class="bg-white rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(15,23,42,0.04)] border border-slate-100/80 text-navy hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div class="mb-6 flex justify-between items-center">
                        <div class="flex items-center gap-1.5">
                            <span class="w-3 h-3 rounded-full bg-red-400/80"></span>
                            <span class="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                            <span class="w-3 h-3 rounded-full bg-[#63C03B]"></span>
                        </div>
                        <span class="px-3 py-1 bg-[#63C03B]/10 text-[#63C03B] font-black text-[10px] rounded-full uppercase tracking-wider">
                            Club Setup
                        </span>
                    </div>

                    <div class="flex-1 flex flex-col justify-center gap-6">
                        <!-- Custom Setup Header -->
                        <div class="flex items-center gap-4 border-b border-slate-100 pb-4">
                            <div class="w-12 h-12 rounded-2xl bg-[#63C03B]/10 flex items-center justify-center text-[#63C03B] shrink-0 font-bold text-lg">
                                AH
                            </div>
                            <div>
                                <h4 class="font-black text-sm text-navy leading-none">Archery Hub Surabaya</h4>
                                <span class="text-[10px] font-bold text-slate-400 mt-1 block">Professional Club Portal</span>
                            </div>
                        </div>

                        <!-- Active Members List -->
                        <div class="space-y-3">
                            <span class="text-[10px] font-black tracking-widest uppercase text-slate-400 block mb-1">Active Roster</span>
                            <div class="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:user-circle-bold" class="text-slate-400 text-lg" />
                                    <span class="text-xs font-bold text-navy">Farhan Wijaya</span>
                                </div>
                                <span class="text-[9px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase">Recurve</span>
                            </div>
                            <div class="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
                                <div class="flex items-center gap-2">
                                    <Icon icon="ph:user-circle-bold" class="text-slate-400 text-lg" />
                                    <span class="text-xs font-bold text-navy">Rania Nabilla</span>
                                </div>
                                <span class="text-[9px] font-bold bg-[#63C03B]/20 text-[#63C03B] px-2 py-0.5 rounded-full uppercase font-black">Compound</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-400">Total Members:</span>
                        <span class="font-black text-navy">124 Athletes</span>
                    </div>
                </div>

                <!-- ── CARD 2 (CENTER): DYNAMIC TARGET & FIELD SCHEDULER ── -->
                <div class="bg-white rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(15,23,42,0.04)] border border-slate-100/80 text-navy hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div class="mb-6 flex justify-between items-center">
                        <div class="flex items-center gap-1.5">
                            <span class="w-3 h-3 rounded-full bg-red-400/80"></span>
                            <span class="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                            <span class="w-3 h-3 rounded-full bg-[#63C03B]"></span>
                        </div>
                        <span class="px-3 py-1 bg-[#63C03B]/10 text-[#63C03B] font-black text-[10px] rounded-full uppercase tracking-wider animate-pulse">
                            Live Scheduling
                        </span>
                    </div>

                    <div class="flex-1 flex flex-col gap-5">
                        <div class="flex justify-between items-center">
                            <h3 class="text-base font-black tracking-tight leading-none text-navy font-display">
                                Target Allocation
                            </h3>
                            <span class="text-[10px] font-bold text-slate-400">Week 1</span>
                        </div>

                        <!-- Target Butt Interactive Allocator Grid -->
                        <div class="grid grid-cols-4 gap-2.5">
                            <div class="aspect-square rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center p-1 cursor-pointer hover:border-[#63C03B]/50 transition-colors">
                                <span class="text-xs font-black text-navy">1A</span>
                                <span class="text-[8px] text-slate-400">Recurve</span>
                            </div>
                            <div class="aspect-square rounded-xl border border-[#63C03B]/30 bg-[#63C03B]/5 flex flex-col items-center justify-center p-1 cursor-pointer">
                                <span class="text-xs font-black text-[#63C03B]">1B</span>
                                <span class="text-[8px] text-[#63C03B]/70 font-bold">U-15</span>
                            </div>
                            <div class="aspect-square rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center p-1 cursor-pointer hover:border-[#63C03B]/50 transition-colors">
                                <span class="text-xs font-black text-navy">2A</span>
                                <span class="text-[8px] text-slate-400">Barebow</span>
                            </div>
                            <div class="aspect-square rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center justify-center p-1 cursor-pointer hover:border-[#63C03B]/50 transition-colors">
                                <span class="text-xs font-black text-navy">2B</span>
                                <span class="text-[8px] text-slate-400">Compound</span>
                            </div>
                        </div>

                        <!-- Mini Schedule Table -->
                        <div class="border border-slate-100 rounded-xl overflow-hidden bg-slate-50 text-[10px] font-medium text-slate-500">
                            <div class="bg-slate-100 p-2 flex justify-between font-bold text-navy">
                                <span>Upcoming Match</span>
                                <span class="text-[#63C03B]">Active</span>
                            </div>
                            <div class="p-2.5 flex items-center justify-between border-t border-slate-200/40">
                                <span class="font-black text-navy">Warriors vs Bobcats</span>
                                <span>Target 1B</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-400">Total Matches:</span>
                        <span class="font-black text-navy">125 Games</span>
                    </div>
                </div>

                <!-- ── CARD 3: REAL-TIME SCORING & PORTFOLIO ── -->
                <div class="bg-white rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(15,23,42,0.04)] border border-slate-100/80 text-navy hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div class="mb-6 flex justify-between items-center">
                        <div class="flex items-center gap-1.5">
                            <span class="w-3 h-3 rounded-full bg-red-400/80"></span>
                            <span class="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                            <span class="w-3 h-3 rounded-full bg-[#63C03B]"></span>
                        </div>
                        <span class="px-3 py-1 bg-[#63C03B]/10 text-[#63C03B] font-black text-[10px] rounded-full uppercase tracking-wider">
                            Analytics
                        </span>
                    </div>

                    <div class="flex-1 flex flex-col justify-center gap-6">
                        <!-- Scoreboard Mock -->
                        <div class="bg-slate-900 text-white rounded-2xl p-4 flex flex-col gap-3">
                            <div class="flex justify-between items-center border-b border-white/10 pb-2">
                                <span class="text-[9px] font-black text-[#63C03B] tracking-widest uppercase">Live Scoring</span>
                                <span class="text-[8px] text-white/40">Sesi 1</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div>
                                    <span class="text-[8px] text-white/40 font-bold block">Archer</span>
                                    <h5 class="font-black text-xs text-white">Budi Santoso</h5>
                                </div>
                                <div class="flex gap-1">
                                    <span class="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-bold text-xs">X</span>
                                    <span class="w-6 h-6 rounded bg-white/10 flex items-center justify-center font-bold text-xs">10</span>
                                    <span class="w-6 h-6 rounded bg-[#63C03B]/20 text-[#63C03B] border border-[#63C03B]/30 flex items-center justify-center font-black text-xs">9</span>
                                </div>
                            </div>
                        </div>

                        <!-- Visual Trend Chart Mock -->
                        <div class="space-y-2">
                            <div class="flex justify-between items-center text-[10px] font-bold text-slate-400">
                                <span>Athlete Trend</span>
                                <span class="text-[#63C03B] font-black">9.2 Average</span>
                            </div>
                            <div class="flex items-end gap-2 h-14 pt-2">
                                <div class="bg-slate-100 rounded-t flex-1 h-[40%]"></div>
                                <div class="bg-slate-100 rounded-t flex-1 h-[60%]"></div>
                                <div class="bg-slate-100 rounded-t flex-1 h-[50%]"></div>
                                <div class="bg-[#63C03B] rounded-t flex-1 h-[85%]"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span class="font-bold text-slate-400">Success Rate:</span>
                        <span class="font-black text-[#63C03B]">+12% Growth</span>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
