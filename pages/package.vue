<template>
    <div class="min-h-screen bg-slate-50 text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 flex items-center">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event-detail.jpeg" alt="Package Hero"
                    class="w-full h-full object-cover object-center opacity-30" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-95"></div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <!-- Breadcrumbs Navigation -->
                <div class="mb-4">
                    <Breadcrumbs 
                        :items="[]" 
                        :current="$t('nav.package', 'Package')" 
                        class="!text-slate-300" 
                    />
                </div>

                <div class="max-w-3xl">
                    <h1
                        class="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        {{ $t('subscription_page.title', 'Scale Your Archery Tournament Management') }}
                    </h1>
                    <div class="text-white/80 text-sm md:text-lg leading-relaxed max-w-2xl font-medium">
                        {{ $t('subscription_page.description', 'Flexible and transparent pricing options for tournament organizers, from local clubs to national championships. Enjoy free Standard package access for the first 3 months promo!') }}
                    </div>
                </div>
            </div>
        </section>

        <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-20">
            <!-- ─── Pricing / Package Cards ─── -->
            <div class="space-y-12 md:space-y-16">
                <!-- 3 Cards: Standar (Left - PROMO), Free (Middle), Elite (Right) -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full">
                    
                    <!-- 1. Standard EO (Left Card) -->
                    <div
                        class="bg-navy rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-1 group hover:shadow-2xl">
                        <!-- Glow behind card -->
                        <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
                        <!-- Dot pattern -->
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                        <!-- Card Content wrapper -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full flex-1">
                            <div class="flex-1 flex flex-col">
                                <div class="h-12 flex items-center justify-between mb-5">
                                    <div
                                        class="size-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center border border-primary/30">
                                        <Icon icon="ph:lightning-bold" class="text-2xl" />
                                    </div>
                                    <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold rounded-md">
                                        {{ $t('subscription_page.standard_tag', 'Standard') }}
                                    </span>
                                </div>
                                <div class="min-h-[72px] mb-5">
                                    <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.basic_title', 'Standard EO') }}</h3>
                                    <div class="text-slate-300 text-sm font-medium leading-relaxed">{{ $t('subscription_page.basic_desc', 'Complete tournament solution for clubs and medium-scale archery events.') }}</div>
                                </div>
                                
                                <!-- Strikethrough Price + Promo Display -->
                                <div class="min-h-[110px] flex flex-col justify-end mb-6">
                                    <!-- Original Price Struck Through -->
                                    <div class="h-6 flex items-center gap-2 mb-1">
                                        <span class="text-sm font-bold text-slate-400 line-through tracking-tight opacity-75">
                                             ${{ (standardPlan.price_usd || 3.00).toFixed(2) }}
                                        </span>
                                        <span class="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                                            50% promo
                                        </span>
                                    </div>
                                    <!-- Promo Price ($1.50) -->
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-lg font-bold text-primary">$</span>
                                        <span class="text-4xl sm:text-5xl font-black text-white tracking-tighter">{{ (standardPlan.promo_price_usd || 1.50).toFixed(2) }}</span>
                                        <span class="text-primary font-bold text-xs sm:text-sm">{{ $t('subscription_page.per_event', '/event') }}</span>
                                    </div>
                                    <div class="mt-2 mb-2">
                                        <CurrencyPreviewPopover
                                            :price-usd="standardPlan.price_usd || 3.00"
                                            :promo-price-usd="standardPlan.promo_price_usd || 1.50"
                                            :price-idr="standardPlan.price_idr || 49900"
                                            :promo-price-idr="standardPlan.promo_price_idr || 24999"
                                            :dark-theme="true"
                                        />
                                    </div>
                                    <div class="min-h-[28px] text-xs sm:text-sm text-amber-200/90 font-medium mt-1 leading-relaxed">
                                        {{ $t('subscription_page.promo_subtext', 'Special introductory rate for tournament organizers.') }}
                                    </div>
                                </div>

                                <div class="h-px bg-white/10 mb-6"></div>
                                
                                <div class="flex-1 flex flex-col justify-start mb-8">
                                    <ul class="space-y-3.5">
                                        <li v-for="feat in eoBasicFeatures" :key="feat"
                                            class="flex items-start gap-3 text-sm sm:text-base font-semibold text-white/95">
                                            <Icon icon="ph:check-circle-fill" class="text-primary text-xl shrink-0 mt-0.5" />
                                            <span>{{ feat }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <BaseButton
                                variant="primary"
                                size="lg"
                                block
                                icon="ph:lightning-bold"
                                class="mt-auto min-h-[48px] text-sm font-bold"
                                @click="handleSelectPlan(7, 'Standard', 1.50)">
                                {{ $t('subscription_page.choose_plan', 'Choose Plan') }}
                            </BaseButton>
                        </div>
                    </div>

                    <!-- 2. Free / Starter Plan (Middle Card) -->
                    <div
                        class="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden">
                        <!-- Starter badge -->
                        <div class="absolute top-0 right-0 bg-slate-100 text-slate-600 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold rounded-bl-2xl border-b border-l border-slate-200">
                            {{ $t('subscription_page.starter_badge', 'Starter') }}
                        </div>

                        <!-- Card Content wrapper -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full flex-1">
                            <div class="flex-1 flex flex-col">
                                <div class="h-12 flex items-center justify-between mb-5">
                                    <div
                                        class="size-12 bg-slate-100 rounded-2xl flex items-center justify-center text-navy font-black">
                                        <Icon icon="ph:leaf-bold" class="text-2xl text-navy" />
                                    </div>
                                </div>
                                <div class="min-h-[72px] mb-5">
                                    <h3 class="text-2xl font-black text-navy mb-2">{{ $t('subscription_page.free_title', 'Free EO') }}</h3>
                                    <div class="text-slate-600 text-sm font-medium leading-relaxed">{{ $t('subscription_page.free_desc', 'Try and run your first archery tournament instantly at zero cost.') }}</div>
                                </div>
                                
                                <div class="min-h-[110px] flex flex-col justify-end mb-6">
                                    <div class="h-6 flex items-center gap-2 mb-1">
                                        <span class="text-sm font-bold text-slate-400">
                                            {{ $t('subscription_page.free_plan_tag', 'Starter Tier') }}
                                        </span>
                                    </div>
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-4xl sm:text-5xl font-black text-navy tracking-tighter">$0</span>
                                        <span class="text-slate-500 font-bold text-xs sm:text-sm ml-1">{{ freePlan.period }}</span>
                                    </div>
                                    <div class="mt-2 mb-2">
                                        <CurrencyPreviewPopover
                                            :price-usd="0"
                                            :promo-price-usd="0"
                                            :price-idr="0"
                                            :promo-price-idr="0"
                                            :dark-theme="false"
                                        />
                                    </div>
                                    <div class="min-h-[28px] text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                                        {{ $t('subscription_page.free_subtext', '1 free event quota to try out our tournament scoring system.') }}
                                    </div>
                                </div>

                                <div class="h-px bg-slate-200 mb-6"></div>
                                
                                <div class="flex-1 flex flex-col justify-start mb-8">
                                    <ul class="space-y-3.5">
                                        <li v-for="feat in eoFreeFeatures" :key="feat"
                                            class="flex items-start gap-3 text-sm sm:text-base font-semibold text-navy/90">
                                            <Icon icon="ph:check-circle-fill" class="mt-0.5 text-xl shrink-0 text-emerald-500" />
                                            <span>{{ feat }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <BaseButton
                                variant="navy"
                                size="lg"
                                block
                                icon="ph:arrow-right-bold"
                                class="mt-auto min-h-[48px] text-sm font-bold"
                                @click="handleSelectPlan(0, 'Free', 0)">
                                {{ $t('subscription_page.try_now', 'Try Now') }}
                            </BaseButton>
                        </div>
                    </div>

                    <!-- 3. Elite EO (Right Card) -->
                    <div
                        class="bg-navy rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-1 group hover:shadow-2xl">
                        <!-- Glow behind card -->
                        <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
                        <!-- Dot pattern -->
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                        <!-- Card Content wrapper -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full flex-1">
                            <div class="flex-1 flex flex-col">
                                <div class="h-12 flex items-center justify-between mb-5">
                                    <div
                                        class="size-12 bg-primary rounded-2xl flex items-center justify-center text-navy shadow-md shadow-primary/20">
                                        <Icon icon="ph:crown-simple-fill" class="text-2xl" />
                                    </div>
                                    <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-primary text-xs font-bold rounded-md">
                                        {{ $t('subscription_page.professional', 'Professional') }}
                                    </span>
                                </div>
                                <div class="min-h-[72px] mb-5">
                                    <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.elite_title', 'Elite EO') }}</h3>
                                    <div class="text-slate-400 text-sm font-medium leading-relaxed">{{ $t('subscription_page.elite_desc', 'Unlimited features for professional and large-scale championship organizers.') }}</div>
                                </div>
                                
                                <div class="min-h-[110px] flex flex-col justify-end mb-6">
                                    <div class="h-6 flex items-center gap-2 mb-1">
                                        <span class="text-sm font-bold text-slate-400 line-through tracking-tight opacity-75">
                                             ${{ (elitePlan.price_usd || 7.00).toFixed(2) }}
                                        </span>
                                        <span class="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded border border-primary/30">
                                            50% promo
                                        </span>
                                    </div>
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-lg font-bold text-white opacity-45">$</span>
                                        <span class="text-4xl sm:text-5xl font-black text-white tracking-tighter">{{ (elitePlan.promo_price_usd || 3.50).toFixed(2) }}</span>
                                        <span class="text-slate-400 font-bold text-xs sm:text-sm">{{ $t('subscription_page.per_event', '/event') }}</span>
                                    </div>
                                    <div class="mt-2 mb-2">
                                        <CurrencyPreviewPopover
                                            :price-usd="elitePlan.price_usd || 7.00"
                                            :promo-price-usd="elitePlan.promo_price_usd || 3.50"
                                            :price-idr="elitePlan.price_idr || 79900"
                                            :promo-price-idr="elitePlan.promo_price_idr || 39999"
                                            :dark-theme="true"
                                        />
                                    </div>
                                    <div class="min-h-[28px] text-xs sm:text-sm text-slate-400 font-medium mt-1 leading-relaxed">
                                        {{ $t('subscription_page.elite_subtext', 'Full access to all professional features for official tournaments.') }}
                                    </div>
                                </div>

                                <div class="h-px bg-white/10 mb-6"></div>
                                
                                <div class="flex-1 flex flex-col justify-start mb-8">
                                    <ul class="space-y-3.5">
                                        <li v-for="feat in eoEliteFeatures" :key="feat"
                                            class="flex items-start gap-3 text-sm sm:text-base font-semibold text-white/95">
                                            <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-xl shrink-0 mt-0.5" />
                                            <span>{{ feat }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            <BaseButton
                                variant="primary"
                                size="lg"
                                block
                                icon="ph:crown-simple-bold"
                                class="mt-auto min-h-[48px] text-sm font-bold"
                                @click="handleSelectPlan(8, 'Elite', 3.50)">
                                {{ $t('subscription_page.choose_plan', 'Choose Plan') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>

                <!-- ─── Simple Detailed Comparison Matrix ─── -->
                <div class="w-full pt-8 md:pt-12">
                    <div class="text-center mb-8 md:mb-10">
                        <h3 class="text-sm md:text-base font-bold text-slate-400 mb-2">
                            {{ $t('subscription_page.detail_comparison', 'Detailed Feature Comparison') }}
                        </h3>
                        <div class="h-1 w-12 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <!-- Comparison Table Container -->
                    <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 md:p-10 relative overflow-hidden">
                        <div class="overflow-x-auto -mx-2 sm:mx-0">
                            <table class="w-full min-w-[650px] border-separate border-spacing-y-2.5">
                                <thead>
                                    <tr class="text-xs sm:text-sm font-bold text-slate-500">
                                        <th class="pb-4 pl-4 text-left w-[40%]">{{ $t('subscription_page.feature_header', 'Features & capacities') }}</th>
                                        <th class="pb-4 text-center w-[20%]">
                                            <span class="inline-block px-3.5 py-1.5 bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm rounded-xl border border-slate-200">
                                                {{ $t('subscription_page.free_title', 'Free EO') }}
                                            </span>
                                        </th>
                                        <th class="pb-4 text-center w-[20%]">
                                            <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs border border-white/10">
                                                {{ $t('subscription_page.basic_title', 'Standard EO') }}
                                                <span class="bg-primary text-navy text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md font-bold">
                                                    {{ $t('subscription_page.promo_tag', 'Promo') }}
                                                </span>
                                            </span>
                                        </th>
                                        <th class="pb-4 text-center w-[20%]">
                                            <span class="inline-block px-3.5 py-1.5 bg-slate-100 text-navy font-bold text-xs sm:text-sm rounded-xl border border-slate-200">
                                                {{ $t('subscription_page.elite_title', 'Elite EO') }}
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template v-for="row in eoComparisonData" :key="row.id || row.feature">
                                        <!-- Parent Feature Row Card with Rounded Borders and Gap -->
                                        <tr
                                            @click="row.subItems ? toggleRow(row.id) : null"
                                            :class="[
                                                'transition-all duration-200 group bg-slate-50/60 hover:bg-slate-100/80',
                                                row.subItems ? 'cursor-pointer select-none' : '',
                                                isExpanded(row.id) ? 'bg-slate-100/90 shadow-2xs' : ''
                                            ]">
                                            <td class="py-4 sm:py-5 pl-4 sm:pl-5 pr-3 text-sm md:text-base rounded-l-2xl border-y border-l border-slate-200/70">
                                                <div class="flex items-center gap-3">
                                                    <button
                                                        v-if="row.subItems"
                                                        type="button"
                                                        :aria-label="row.feature"
                                                        class="size-7 sm:size-8 rounded-lg bg-white border border-slate-200 text-slate-600 group-hover:bg-primary group-hover:text-navy group-hover:border-primary flex items-center justify-center transition-all duration-300 shrink-0 shadow-2xs"
                                                        :class="{ 'rotate-180 bg-primary text-navy border-primary shadow-xs': isExpanded(row.id) }">
                                                        <Icon icon="ph:caret-down-bold" class="text-xs sm:text-sm" />
                                                    </button>
                                                    <span :class="row.subItems ? 'font-bold text-navy text-sm md:text-base' : 'font-medium text-navy text-sm md:text-base'">
                                                        {{ row.feature }}
                                                    </span>
                                                </div>
                                            </td>
                                            <td class="py-4 sm:py-5 text-center border-y border-slate-200/70">
                                                <template v-if="typeof row.free === 'boolean'">
                                                    <div class="size-6 sm:size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
                                                        <Icon icon="ph:check-bold" class="text-xs sm:text-sm font-bold" />
                                                    </div>
                                                </template>
                                                <span v-else class="text-sm md:text-base font-bold text-navy">{{ row.free }}</span>
                                            </td>
                                            <td class="py-4 sm:py-5 text-center bg-primary/[0.04] border-y border-primary/20">
                                                <template v-if="typeof row.standar === 'boolean'">
                                                    <div class="size-6 sm:size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
                                                        <Icon icon="ph:check-bold" class="text-xs sm:text-sm font-bold" />
                                                    </div>
                                                </template>
                                                <span v-else class="text-sm md:text-base font-bold text-navy">{{ row.standar }}</span>
                                            </td>
                                            <td class="py-4 sm:py-5 pr-4 sm:pr-5 text-center rounded-r-2xl border-y border-r border-slate-200/70">
                                                <template v-if="typeof row.elite === 'boolean'">
                                                    <div class="size-6 sm:size-7 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xs">
                                                        <Icon icon="ph:check-bold" class="text-xs sm:text-sm font-bold" />
                                                    </div>
                                                </template>
                                                <span v-else class="text-sm md:text-base font-bold text-navy">{{ row.elite }}</span>
                                            </td>
                                        </tr>

                                        <!-- Expanded Sub-items Drawer Row with Clean Spacing -->
                                        <tr v-if="row.subItems && isExpanded(row.id)">
                                            <td colspan="4" class="p-0">
                                                <div class="p-4 sm:p-6 bg-slate-50/90 rounded-2xl border border-slate-200 shadow-xs mb-2">
                                                    <div class="text-xs sm:text-sm font-bold text-slate-500 mb-3.5 flex items-center gap-2">
                                                        <span class="size-2 rounded-full bg-primary"></span>
                                                        <span>{{ locale === 'id' ? 'Fitur yang termasuk:' : 'Included in this suite:' }}</span>
                                                    </div>
                                                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                                        <div
                                                            v-for="sub in row.subItems"
                                                            :key="sub.name"
                                                            class="flex items-center gap-3 p-3 sm:p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs hover:border-primary/50 transition-colors">
                                                            <div class="size-7 sm:size-8 rounded-lg bg-slate-100 text-navy flex items-center justify-center shrink-0 border border-slate-200/60">
                                                                <Icon :icon="sub.icon || 'ph:check-bold'" class="text-sm text-navy" />
                                                            </div>
                                                            <span class="text-xs sm:text-sm font-semibold text-navy leading-snug">{{ sub.name }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- FAQ Section -->
                <div class="mt-16 md:mt-24 w-full max-w-4xl mx-auto">
                    <div class="text-center mb-8 md:mb-12">
                        <h2 class="text-xs sm:text-sm font-bold text-primary mb-2">{{ $t('subscription_page.faq_title', 'FAQ') }}</h2>
                        <h4 class="font-black text-navy text-2xl sm:text-3xl md:text-4xl tracking-tight">
                            {{ $t('subscription_page.faq_subtitle', 'Frequently Asked Questions') }}
                        </h4>
                    </div>
                    <div class="space-y-3.5">
                        <div v-for="(faq, index) in faqs" :key="index"
                            :class="['rounded-2xl border transition-all duration-300 overflow-hidden', activeFaq === index ? 'bg-white border-primary/50 shadow-md ring-1 ring-primary/20' : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs']">
                            <button @click="toggleFaq(index)"
                                class="w-full px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left group gap-4 transition-colors">
                                <span :class="['text-base sm:text-lg font-black transition-colors duration-200', activeFaq === index ? 'text-navy' : 'text-navy/90 group-hover:text-navy']">
                                    {{ faq.question }}
                                </span>
                                <div
                                    :class="['size-9 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0', activeFaq === index ? 'bg-navy text-primary rotate-180 shadow-xs' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200/70 group-hover:text-navy']">
                                    <Icon icon="ph:caret-down-bold" class="text-base" />
                                </div>
                            </button>
                            <transition enter-active-class="transition-all duration-300 ease-out"
                                enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[300px] opacity-100"
                                leave-active-class="transition-all duration-200 ease-in"
                                leave-from-class="max-h-[300px] opacity-100" leave-to-class="max-h-0 opacity-0">
                                <div v-show="activeFaq === index"
                                    class="px-6 sm:px-8 pb-6 sm:pb-8 text-slate-500 text-sm sm:text-base leading-relaxed font-semibold border-t border-slate-100 pt-4">
                                    {{ faq.answer }}
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { usePricingPlans } from '~/composables/usePricingPlans'
import CurrencyPreviewPopover from '~/components/Common/CurrencyPreviewPopover.vue'

const { tm, t, locale } = useI18n()
const { user, organizerProfile } = useAuth()
const router = useRouter()
const { fetchPlans, freePlan, standardPlan, elitePlan, comparisonMatrix } = usePricingPlans()

const activeFaq = ref(0)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const faqs = computed(() => {
    if (locale.value === 'id') {
        return [
            {
                question: 'Bagaimana cara kerja sistem kuota turnamen?',
                answer: 'Penyelenggara turnamen dapat membeli kuota turnamen satuan maupun paket diskon. Setiap kuota dapat digunakan untuk mempublikasikan dan mengelola 1 turnamen lengkap dengan seluruh fitur.'
            },
            {
                question: 'Apa perbedaan Standard EO dan Elite EO?',
                answer: 'Standard EO mendukung hingga 200 peserta dan 3 GB media storage per turnamen. Elite EO mendukung peserta tanpa batas dan 10 GB media storage. Seluruh fitur skoring, bagan eliminasi, 8 dokumen printout PDF, e-sertifikat, dan laporan aktif penuh di kedua paket.'
            },
            {
                question: 'Apakah kuota turnamen memiliki batas masa kedaluwarsa?',
                answer: 'Tidak. Seluruh kuota turnamen yang tersimpan di akun Anda berlaku selamanya (Lifetime). Anda dapat menggunakannya kapan saja sesuai jadwal event Anda.'
            },
            {
                question: 'Kapan kuota turnamen terpotong dari saldo akun?',
                answer: 'Kuota hanya terpotong saat Anda mempublikasikan turnamen (mengubah status dari Draf menjadi Publik). Selama persiapan kategori, aturan, dan jadwal dalam mode Draf, kuota tidak terpakai.'
            }
        ]
    }
    return [
        {
            question: 'How does the tournament quota system work?',
            answer: 'Organizers can purchase tournament quotas individually or in discounted bundles. Each quota allows you to publish and manage one complete tournament with all platform features.'
        },
        {
            question: 'What is the difference between Standard EO and Elite EO?',
            answer: 'Standard EO supports up to 200 participants and 3 GB media storage per tournament. Elite EO offers unlimited participants and 10 GB media storage. All scoring, elimination brackets, 8 PDF printout documents, e-certificates, and data export features are fully unlocked on both tiers.'
        },
        {
            question: 'Do purchased tournament quotas have an expiration date?',
            answer: 'No. All tournament quotas stored in your organizer account never expire (Lifetime validity). You can keep them and use them whenever your tournament schedule is set.'
        },
        {
            question: 'When is tournament quota deducted from my account balance?',
            answer: 'Tournament quota is only deducted when you publish a tournament (changing status from Draft to Public). While setting up categories, brackets, and rules in Draft mode, no quota is consumed.'
        }
    ]
})

definePageMeta({
    layout: 'landing'
})

onMounted(() => {
    fetchPlans()
})

useHead({ title: computed(() => t('nav.pricing', 'Pricing & Plans') + ' - Archeris') })

const isUSD = computed(() => {
    if (user.value && organizerProfile.value) {
        return organizerProfile.value.country !== 'Indonesia'
    }
    return locale.value === 'en'
})

const handleSelectPlan = (planId, planName, planPrice) => {
    if (!user.value) {
        router.push(`/auth/register?redirect=${encodeURIComponent('/package')}`)
        return
    }
    // Logged in: redirect to organizer package dashboard
    router.push('/dashboard/organizer/package')
}

const eoBasicFeatures = computed(() => {
    if (locale.value === 'id') {
        return [
            'Hingga 200 Peserta per Turnamen',
            '3 GB Media Storage',
            'Akses Semua Fitur'
        ]
    }
    return [
        'Up to 200 Participants / Tournament',
        '3 GB Media Storage',
        'Access All Features'
    ]
})

const eoFreeFeatures = computed(() => {
    if (locale.value === 'id') {
        return [
            'Maksimal 50 Peserta per Turnamen',
            '200 MB Media Storage',
            'Akses Semua Fitur'
        ]
    }
    return [
        'Up to 50 Participants / Tournament',
        '200 MB Media Storage',
        'Access All Features'
    ]
})

const eoEliteFeatures = computed(() => {
    if (locale.value === 'id') {
        return [
            'Peserta Tanpa Batas',
            '10 GB Media Storage',
            'Akses Semua Fitur'
        ]
    }
    return [
        'Unlimited Participants',
        '10 GB Media Storage',
        'Access All Features'
    ]
})

const expandedRows = ref(new Set())

const isExpanded = (id) => {
    return expandedRows.value.has(id)
}

const toggleRow = (id) => {
    if (expandedRows.value.has(id)) {
        expandedRows.value.delete(id)
    } else {
        expandedRows.value.add(id)
    }
}

const eoComparisonData = computed(() => {
    const isId = locale.value === 'id'
    if (isId) {
        return [
            // ─── Batasan Utama ───
            {
                id: 'participants',
                feature: 'Batas Peserta per Turnamen',
                free: '50 Pemanah',
                standar: '200 Pemanah',
                elite: 'Tanpa Batas'
            },
            {
                id: 'storage',
                feature: 'Media Storage',
                free: '200 MB',
                standar: '3 GB',
                elite: '10 GB'
            },
            {
                id: 'categories',
                feature: 'Kategori Lomba',
                free: 'Tanpa Batas',
                standar: 'Tanpa Batas',
                elite: 'Tanpa Batas'
            },
            {
                id: 'scorekeepers',
                feature: 'Akun Scorekeeper',
                free: 'Tanpa Batas',
                standar: 'Tanpa Batas',
                elite: 'Tanpa Batas'
            },
            {
                id: 'access_period',
                feature: 'Masa Aktif Data',
                free: 'Selamanya',
                standar: 'Selamanya',
                elite: 'Selamanya'
            },

            // ─── Expandable: Pengaturan Turnamen ───
            {
                id: 'setup',
                feature: 'Pengaturan Turnamen',
                free: true,
                standar: true,
                elite: true,
                subItems: [
                    { name: 'Kategori, divisi busur & kelompok usia', icon: 'ph:sliders-horizontal-bold' },
                    { name: 'Batas kuota & biaya pendaftaran', icon: 'ph:money-bold' },
                    { name: 'Penataan nomor bantalan target (1A - 1D)', icon: 'ph:target-bold' },
                    { name: 'Jadwal sesi & rundown pertandingan', icon: 'ph:calendar-check-bold' }
                ]
            },

            // ─── Expandable: Pendaftaran Peserta ───
            {
                id: 'registration',
                feature: 'Pendaftaran Peserta',
                free: true,
                standar: true,
                elite: true,
                subItems: [
                    { name: 'Pendaftaran mandiri atlet secara online', icon: 'ph:user-plus-bold' },
                    { name: 'Tambah manual & import data peserta', icon: 'ph:users-three-bold' },
                    { name: 'Pembayaran otomatis & upload bukti transfer manual', icon: 'ph:credit-card-bold' },
                    { name: 'Verifikasi status pembayaran & daftar peserta instan', icon: 'ph:shield-check-bold' }
                ]
            },

            // ─── Expandable: Skoring & Pertandingan ───
            {
                id: 'scoring',
                feature: 'Skoring & Pertandingan',
                free: true,
                standar: true,
                elite: true,
                subItems: [
                    { name: 'Skoring kualifikasi digital langsung', icon: 'ph:device-mobile-bold' },
                    { name: 'Bagan eliminasi (sistem set & total poin)', icon: 'ph:tree-structure-bold' },
                    { name: 'Pertandingan beregu & tim campuran', icon: 'ph:users-four-bold' },
                    { name: 'Akses scorekeeper via PIN', icon: 'ph:key-bold' }
                ]
            },

            // ─── Expandable: Cetak Dokumen & Sertifikat ───
            {
                id: 'printouts',
                feature: 'Cetak Dokumen & Sertifikat',
                free: true,
                standar: true,
                elite: true,
                subItems: [
                    { name: 'Lembar skor kualifikasi (PDF)', icon: 'ph:file-pdf-bold' },
                    { name: 'Pohon bagan eliminasi A3/A4 (PDF)', icon: 'ph:file-pdf-bold' },
                    { name: 'Start list penempatan bantalan (PDF)', icon: 'ph:file-pdf-bold' },
                    { name: 'Daftar peserta per abjad, klub & kategori (PDF)', icon: 'ph:file-pdf-bold' },
                    { name: 'Label stiker nomor bantalan & busur (PDF)', icon: 'ph:file-pdf-bold' },
                    { name: 'Hasil kualifikasi resmi (PDF)', icon: 'ph:file-pdf-bold' },
                    { name: 'Klasemen perolehan medali (PDF)', icon: 'ph:file-pdf-bold' },
                    { name: 'Sertifikat pemanah dengan QR code (PDF)', icon: 'ph:certificate-bold' }
                ]
            },

            // ─── Expandable: Ekspor Data ───
            {
                id: 'export',
                feature: 'Ekspor Data',
                free: true,
                standar: true,
                elite: true,
                subItems: [
                    { name: 'Ekspor data peserta (Excel & CSV)', icon: 'ph:file-xls-bold' },
                    { name: 'Ekspor transaksi & laporan keuangan (Excel & CSV)', icon: 'ph:file-xls-bold' },
                    { name: 'Ekspor statistik kehadiran & divisi (Excel & CSV)', icon: 'ph:file-xls-bold' }
                ]
            },

            // ─── Dukungan Teknis ───
            {
                id: 'support',
                feature: 'Dukungan Teknis',
                free: '24/7 Support',
                standar: '24/7 Support',
                elite: '24/7 Support'
            }
        ]
    }
    return [
        // ─── Core Limits ───
        {
            id: 'participants',
            feature: 'Participant limit per tournament',
            free: '50 Archers',
            standar: '200 Archers',
            elite: 'Unlimited'
        },
        {
            id: 'storage',
            feature: 'Media storage',
            free: '200 MB',
            standar: '3 GB',
            elite: '10 GB'
        },
        {
            id: 'categories',
            feature: 'Competition categories',
            free: 'Unlimited',
            standar: 'Unlimited',
            elite: 'Unlimited'
        },
        {
            id: 'scorekeepers',
            feature: 'Scorekeeper accounts',
            free: 'Unlimited',
            standar: 'Unlimited',
            elite: 'Unlimited'
        },
        {
            id: 'access_period',
            feature: 'Access period',
            free: 'Lifetime',
            standar: 'Lifetime',
            elite: 'Lifetime'
        },

        // ─── Expandable: Tournament Setup ───
        {
            id: 'setup',
            feature: 'Tournament setup',
            free: true,
            standar: true,
            elite: true,
            subItems: [
                { name: 'Custom categories, bows & age groups', icon: 'ph:sliders-horizontal-bold' },
                { name: 'Quota & registration fees', icon: 'ph:money-bold' },
                { name: 'Target lane setup (1A - 1D)', icon: 'ph:target-bold' },
                { name: 'Match schedule & sessions', icon: 'ph:calendar-check-bold' }
            ]
        },

        // ─── Expandable: Participant Registration ───
        {
            id: 'registration',
            feature: 'Participant registration',
            free: true,
            standar: true,
            elite: true,
            subItems: [
                { name: 'Online participant registration', icon: 'ph:user-plus-bold' },
                { name: 'Manual participant entry & import', icon: 'ph:users-three-bold' },
                { name: 'Payment gateway & manual transfer upload', icon: 'ph:credit-card-bold' },
                { name: 'Instant payment & roster verification', icon: 'ph:shield-check-bold' }
            ]
        },

        // ─── Expandable: Scoring & Match Play ───
        {
            id: 'scoring',
            feature: 'Scoring & match play',
            free: true,
            standar: true,
            elite: true,
            subItems: [
                { name: 'Live digital qualification scoring', icon: 'ph:device-mobile-bold' },
                { name: 'Elimination brackets (Set system & total score)', icon: 'ph:tree-structure-bold' },
                { name: 'Team & mixed team matches', icon: 'ph:users-four-bold' },
                { name: 'Scorekeeper access via PIN', icon: 'ph:key-bold' }
            ]
        },

        // ─── Expandable: Printouts & Certificates ───
        {
            id: 'printouts',
            feature: 'Printouts & certificates',
            free: true,
            standar: true,
            elite: true,
            subItems: [
                { name: 'Qualification scoresheets (PDF)', icon: 'ph:file-pdf-bold' },
                { name: 'Elimination bracket charts A3/A4 (PDF)', icon: 'ph:file-pdf-bold' },
                { name: 'Target start list (PDF)', icon: 'ph:file-pdf-bold' },
                { name: 'Participant roster by name, club & category (PDF)', icon: 'ph:file-pdf-bold' },
                { name: 'Target & bow sticker labels (PDF)', icon: 'ph:file-pdf-bold' },
                { name: 'Official qualification results (PDF)', icon: 'ph:file-pdf-bold' },
                { name: 'Medal standings (PDF)', icon: 'ph:file-pdf-bold' },
                { name: 'Archer certificates with QR code (PDF)', icon: 'ph:certificate-bold' }
            ]
        },

        // ─── Expandable: Data Export ───
        {
            id: 'export',
            feature: 'Data export',
            free: true,
            standar: true,
            elite: true,
            subItems: [
                { name: 'Export participants (Excel & CSV)', icon: 'ph:file-xls-bold' },
                { name: 'Export payments & financial reports (Excel & CSV)', icon: 'ph:file-xls-bold' },
                { name: 'Export attendance & division stats (Excel & CSV)', icon: 'ph:file-xls-bold' }
            ]
        },

        // ─── Support ───
        {
            id: 'support',
            feature: 'Customer support',
            free: '24/7 Support',
            standar: '24/7 Support',
            elite: '24/7 Support'
        }
    ]
})

const faqSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.value.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer
        }
    }))
}))

useHead({
    title: computed(() => 'Archeris Pricing - Scalable Archery Scoring Plans'),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify(faqSchema.value))
        }
    ]
})

useSeoMeta({
    title: () => 'Archeris Pricing - Scalable Archery Scoring Plans',
    description: () => 'Flexible and transparent pricing options for tournament organizers. Enjoy scalable packages for real-time archery scoring and live leaderboards.',
    ogTitle: () => 'Archeris Pricing - Scalable Archery Scoring Plans',
    ogDescription: () => 'Flexible and transparent pricing options for tournament organizers. Enjoy scalable packages for real-time archery scoring and live leaderboards.',
    ogType: 'website',
    ogUrl: 'https://archeris.net/package',
    twitterCard: 'summary_large_image'
})
</script>
