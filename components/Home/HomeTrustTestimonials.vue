<template>
    <section class="py-20 sm:py-24 bg-[#DEFEBD]/15 border-y border-[#DEFEBD]/30 overflow-hidden relative">
        <!-- Subtle Vector Graphic in Background for aesthetics -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#DEFEBD]/30 via-transparent to-transparent pointer-events-none"></div>

        <div class="max-w-[1280px] mx-auto px-6 md:px-12">
            <!-- ── Top Header Section: Metric and Badges (Exact Same layout as image) ── -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-16 relative z-10">
                
                <!-- Left Metric Panel -->
                <div class="md:col-span-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <!-- Concentric circles background behind count -->
                    <div class="relative flex items-center justify-center">
                        <div class="absolute w-24 h-24 rounded-full bg-[#DEFEBD]/40 animate-ping opacity-25"></div>
                        <div class="absolute w-20 h-20 rounded-full bg-[#DEFEBD]/30"></div>
                        <div class="w-16 h-16 rounded-full bg-[#DEFEBD] flex items-center justify-center text-navy relative z-10">
                            <Icon icon="ph:arrow-circle-up-right-bold" class="text-3xl text-navy/80" />
                        </div>
                    </div>

                    <div>
                        <div class="text-5xl sm:text-7xl font-black text-navy font-display tracking-tight leading-none mb-2">
                            2,800+
                        </div>
                        <p class="text-base sm:text-lg font-bold text-slate-500 tracking-tight leading-normal">
                            sports organizations trust <span class="text-navy font-black">Archeris</span>
                        </p>
                    </div>
                </div>

                <!-- Right Review Badges Stack -->
                <div class="md:col-span-6 flex flex-col gap-4 sm:max-w-md md:ml-auto w-full">
                    <!-- Badge 1: G2 / 4.7 stars -->
                    <a href="#" class="flex items-center justify-between p-4 bg-[#DEFEBD]/25 border border-[#DEFEBD]/40 rounded-full hover:border-[#9ae811] transition-all hover:-translate-y-0.5 group shadow-sm">
                        <div class="flex items-center gap-3.5">
                            <div class="w-8 h-8 rounded-full bg-[#ff4e00] flex items-center justify-center text-white shrink-0 shadow-sm">
                                <Icon icon="simple-icons:g2" class="text-base" />
                            </div>
                            <span class="text-xs sm:text-sm font-semibold text-slate-600">
                                <span class="font-black text-navy">4.7</span> stars <span class="font-black text-navy">215+</span> reviews
                            </span>
                        </div>
                        <Icon icon="ph:caret-right-bold" class="text-slate-400 group-hover:text-navy transition-colors text-sm" />
                    </a>

                    <!-- Badge 2: Star rating / 5.0 stars -->
                    <a href="#" class="flex items-center justify-between p-4 bg-[#DEFEBD]/25 border border-[#DEFEBD]/40 rounded-full hover:border-[#9ae811] transition-all hover:-translate-y-0.5 group shadow-sm">
                        <div class="flex items-center gap-3.5">
                            <div class="w-8 h-8 rounded-full bg-[#00c853] flex items-center justify-center text-white shrink-0 shadow-sm">
                                <Icon icon="ph:star-fill" class="text-base" />
                            </div>
                            <span class="text-xs sm:text-sm font-semibold text-slate-600">
                                <span class="font-black text-navy">5.0</span> stars <span class="font-black text-navy">1,000+</span> reviews
                            </span>
                        </div>
                        <Icon icon="ph:caret-right-bold" class="text-slate-400 group-hover:text-navy transition-colors text-sm" />
                    </a>
                </div>

            </div>

            <!-- ── Bottom Row Section: Card Testimonials (Exact Same design as image) ── -->
            <div class="relative w-full">
                <!-- Fading Mask for side scrolling indicators -->
                <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#fcfdfa]/20 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#fcfdfa]/20 to-transparent z-10 pointer-events-none"></div>

                <!-- Scrollable Grid Row Container -->
                <div class="flex gap-6 overflow-x-auto no-scrollbar pb-6 scroll-smooth snap-x">
                    
                    <!-- Card 1: Shabbona Park Saints -->
                    <div class="w-[320px] sm:w-[360px] bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shrink-0 snap-start shadow-[0_4px_16px_rgba(183,251,35,0.04)] hover:shadow-[0_8px_24px_rgba(183,251,35,0.12)] hover:border-primary/45 hover:-translate-y-1 transition-all duration-300">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm text-navy/80 font-bold leading-relaxed">
                                "Our youth football program went from 23 players to 124 players in one season due to this platform."
                            </p>
                        </div>
                        <div class="flex items-center gap-3.5 mt-5 border-t border-slate-100 pt-4 shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan" alt="Coach Farhan Avatar" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 shrink-0" />
                            <div>
                                <h4 class="font-black text-xs text-navy leading-none">Coach Farhan</h4>
                                <span class="text-[9px] font-black text-slate-400 mt-1 block uppercase tracking-wider">
                                    Shabbona Park Saints
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 2: Thunder Soccer Club -->
                    <div class="w-[320px] sm:w-[360px] bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shrink-0 snap-start shadow-[0_4px_16px_rgba(183,251,35,0.04)] hover:shadow-[0_8px_24px_rgba(183,251,35,0.12)] hover:border-primary/45 hover:-translate-y-1 transition-all duration-300">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm text-navy/80 font-bold leading-relaxed">
                                "The easy-to-use software, affordability, and first-class customer service make Archeris a must-use for sports organizations."
                            </p>
                        </div>
                        <div class="flex items-center gap-3.5 mt-5 border-t border-slate-100 pt-4 shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rania" alt="Rania Nabilla Avatar" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 shrink-0" />
                            <div>
                                <h4 class="font-black text-xs text-navy leading-none">Rania Nabilla</h4>
                                <span class="text-[9px] font-black text-slate-400 mt-1 block uppercase tracking-wider">
                                    Thunder Soccer Club
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 3: Shadyside Youth Sports -->
                    <div class="w-[320px] sm:w-[360px] bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shrink-0 snap-start shadow-[0_4px_16px_rgba(183,251,35,0.04)] hover:shadow-[0_8px_24px_rgba(183,251,35,0.12)] hover:border-primary/45 hover:-translate-y-1 transition-all duration-300">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm text-navy/80 font-bold leading-relaxed">
                                "Archeris is extremely easy to use and they helped us every step of the way to get us setup very quickly."
                            </p>
                        </div>
                        <div class="flex items-center gap-3.5 mt-5 border-t border-slate-100 pt-4 shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi" alt="Budi Santoso Avatar" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 shrink-0" />
                            <div>
                                <h4 class="font-black text-xs text-navy leading-none">Budi Santoso</h4>
                                <span class="text-[9px] font-black text-slate-400 mt-1 block uppercase tracking-wider">
                                    Shadyside Youth Sports
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 4: Hueytown Youth Baseball -->
                    <div class="w-[320px] sm:w-[360px] bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shrink-0 snap-start shadow-[0_4px_16px_rgba(183,251,35,0.04)] hover:shadow-[0_8px_24px_rgba(183,251,35,0.12)] hover:border-primary/45 hover:-translate-y-1 transition-all duration-300">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm text-navy/80 font-bold leading-relaxed">
                                "Spring registration was approaching fast and the move to Archeris could not have gone more smoothly."
                            </p>
                        </div>
                        <div class="flex items-center gap-3.5 mt-5 border-t border-slate-100 pt-4 shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica" alt="Jessica Lim Avatar" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 shrink-0" />
                            <div>
                                <h4 class="font-black text-xs text-navy leading-none">Jessica Lim</h4>
                                <span class="text-[9px] font-black text-slate-400 mt-1 block uppercase tracking-wider">
                                    Hueytown Youth Baseball
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Card 5: Columbia Wrestling Club -->
                    <div class="w-[320px] sm:w-[360px] bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between shrink-0 snap-start shadow-[0_4px_16px_rgba(183,251,35,0.04)] hover:shadow-[0_8px_24px_rgba(183,251,35,0.12)] hover:border-primary/45 hover:-translate-y-1 transition-all duration-300">
                        <div class="flex-1">
                            <p class="text-xs sm:text-sm text-navy/80 font-bold leading-relaxed">
                                "I was navigating the site as an admin for the first time last year and the amount of support they've provided speaks volumes."
                            </p>
                        </div>
                        <div class="flex items-center gap-3.5 mt-5 border-t border-slate-100 pt-4 shrink-0">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" alt="Marcus Vance Avatar" class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/50 shrink-0" />
                            <div>
                                <h4 class="font-black text-xs text-navy leading-none">Marcus Vance</h4>
                                <span class="text-[9px] font-black text-slate-400 mt-1 block uppercase tracking-wider">
                                    Columbia Wrestling Club
                                </span>
                            </div>
                        </div>
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
