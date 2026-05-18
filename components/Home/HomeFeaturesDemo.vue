<template>
    <section class="py-24 sm:py-32 bg-white">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Main Heading -->
            <div class="text-center mb-24">
                <h2 class="text-4xl sm:text-7xl font-black text-navy leading-tight mb-6 font-display tracking-tighter">
                    {{ $t('home.features_demo.title1') }}<br />
                    {{ $t('home.features_demo.title2') }}
                </h2>
                <p class="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto font-light">
                    {{ $t('home.features_demo.description') }}
                </p>
            </div>

            <!-- Feature Block 1: App -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                <div class="order-2 lg:order-1">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f1_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f1_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f1_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            No Archeris branding—only your club
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Available on iOS, Android, and mobile web
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Consistent look and feel across every touchpoint
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Reinforce your brand with every interaction
                        </li>
                    </ul>
                </div>

                <div class="order-1 lg:order-2 relative flex justify-center lg:justify-end">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] -rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full max-w-[400px] aspect-[4/5] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_app_mockup_1778934013917.png" alt="Archery App Mockup"
                            class="w-full h-full object-contain rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>
            </div>

            <!-- Feature Block 2: Scheduling -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <div class="relative flex justify-center lg:justify-start">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full aspect-video lg:aspect-[4/3] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_dashboard_mockup_1778934029945.png" alt="Archery Dashboard Mockup"
                            class="w-full h-full object-cover rounded-2xl shadow-2xl -rotate-1 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>

                <div>
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f2_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f2_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f2_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Optimize range real estate with smarter time-slot management
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Waitlist tools and priority access features
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Built for multi-discipline and multi-surface facilities
                        </li>
                    </ul>
                </div>
            </div>
            <!-- Feature Block 3: Payments -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
                <div class="order-2 lg:order-1">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f3_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f3_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f3_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Automated payment verification and receipting
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Real-time revenue tracking and financial reporting
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Refund management and early-bird discount tools
                        </li>
                    </ul>
                </div>

                <div class="order-1 lg:order-2 relative flex justify-center lg:justify-end">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] -rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full max-w-[400px] aspect-[4/5] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_payments_mockup_1778934758511.png" alt="Payments Mockup"
                            class="w-full h-full object-contain rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>
            </div>

            <!-- Feature Block 4: Portfolio -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                <div class="relative flex justify-center lg:justify-start">
                    <div class="absolute inset-0 bg-[#E2F9C2] rounded-[3rem] rotate-3 scale-95 opacity-50"></div>
                    <div
                        class="relative w-full max-w-[400px] aspect-[4/5] bg-[#E2F9C2] rounded-[3rem] flex items-center justify-center p-8">
                        <img src="/archery_portfolio_mockup_1778934772420.png" alt="Portfolio Mockup"
                            class="w-full h-full object-contain rounded-2xl shadow-2xl -rotate-1 hover:rotate-0 transition-transform duration-700" />
                    </div>
                </div>

                <div>
                    <span class="text-[10px] font-bold tracking-[0.2em] text-navy/40 mb-4 block">{{
                        $t('home.features_demo.f4_tag') }}</span>
                    <h3 class="text-3xl sm:text-4xl font-bold text-navy mb-6 leading-tight">{{
                        $t('home.features_demo.f4_title') }}</h3>
                    <p class="text-text-secondary text-base sm:text-lg font-light leading-relaxed mb-10">
                        {{ $t('home.features_demo.f4_desc') }}
                    </p>

                    <ul class="space-y-4 border-t border-gray-100 pt-8">
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Dynamic performance charts and scoring averages
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Digital trophy cabinet for certificates and badges
                        </li>
                        <li class="flex items-center text-navy font-medium py-3 border-b border-gray-50">
                            Shareable professional profile for scouting and clubs
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
// No script needed for this simple demo
</script>

<style scoped>
/* No additional styles needed */
</style>
