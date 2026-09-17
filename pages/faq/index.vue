<template>
    <div class="min-h-screen bg-slate-50/70">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" alt="FAQ Hero" class="w-full h-full object-cover opacity-25" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/70"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-95"></div>
            </div>

            <!-- Ambient lights -->
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <!-- Breadcrumbs -->
                <div class="mb-4">
                    <Breadcrumbs 
                        :items="[]" 
                        :current="$t('nav.faq', 'FAQ')" 
                        class="!text-slate-300" 
                    />
                </div>

                <div class="max-w-3xl text-center md:text-left">
                    <span class="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 border border-white/15 text-slate-200 text-xs font-bold rounded-full mb-4">
                        <Icon icon="ph:question-bold" class="text-sm text-primary" />
                        {{ $t('faq_page.badge', 'Help & Support') }}
                    </span>
                    <h1 class="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                        {{ $t('faq_page.title_main', 'Frequently') }} <span class="text-primary">{{ $t('faq_page.title_highlight', 'Asked Questions') }}</span>
                    </h1>
                    <p class="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl font-normal mb-8">
                        {{ $t('faq_page.description', 'Everything you need to know about the Archeris archery scoring system, tournament management, athlete registration, and pricing.') }}
                    </p>

                    <!-- Search Box -->
                    <div class="relative max-w-xl">
                        <input
                            v-model="searchQuery"
                            type="text"
                            :placeholder="$t('faq_page.search_placeholder', 'Search questions, archery scoring, rules, or features...')"
                            class="w-full pl-12 pr-10 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all shadow-lg"
                        />
                        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 z-10">
                            <Icon icon="ph:magnifying-glass-bold" class="text-xl" />
                        </div>
                        <button
                            v-if="searchQuery"
                            @click="searchQuery = ''"
                            class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors z-10"
                            aria-label="Clear Search">
                            <Icon icon="ph:x-circle-fill" class="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content Area -->
        <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <!-- Category Filter Pills -->
            <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                <button
                    v-for="cat in categories"
                    :key="cat.id"
                    @click="activeCategory = cat.id"
                    :class="[
                        'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 shadow-xs',
                        activeCategory === cat.id
                            ? 'bg-navy text-white shadow-md shadow-navy/20'
                            : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-navy border border-slate-200/80'
                    ]">
                    <Icon :icon="cat.icon" class="text-base" />
                    <span>{{ cat.label }}</span>
                    <span 
                        :class="[
                            'text-[10px] font-bold px-2 py-0.5 rounded-full',
                            activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        ]">
                        {{ getCategoryCount(cat.id) }}
                    </span>
                </button>
            </div>

            <!-- Results Count (if searching) -->
            <div v-if="searchQuery" class="mb-6 flex items-center justify-between">
                <p class="text-xs sm:text-sm font-semibold text-slate-600">
                    {{ $t('faq_page.showing_results', { count: filteredFaqs.length }, `Showing ${filteredFaqs.length} results`) }}
                    <span class="text-navy font-bold">"{{ searchQuery }}"</span>
                </p>
                <button
                    @click="searchQuery = ''"
                    class="text-xs font-bold text-navy hover:underline flex items-center gap-1">
                    <Icon icon="ph:x-bold" />
                    {{ $t('faq_page.clear_search', 'Clear Search') }}
                </button>
            </div>

            <!-- FAQ Accordion List -->
            <div v-if="filteredFaqs.length > 0" class="space-y-3.5">
                <div
                    v-for="(faq, index) in filteredFaqs"
                    :key="faq.id"
                    :class="[
                        'bg-white rounded-2xl transition-all duration-300 overflow-hidden shadow-xs hover:shadow-md',
                        openFaqId === faq.id ? 'shadow-md ring-1 ring-slate-200/80 bg-white' : ''
                    ]">
                    <!-- Question Button -->
                    <button
                        @click="toggleFaq(faq.id)"
                        class="w-full px-6 py-5 flex items-start justify-between text-left group gap-4">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-2">
                                <span class="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                                    {{ getCategoryLabel(faq.category) }}
                                </span>
                            </div>
                            <h3 :class="[
                                'font-bold text-sm sm:text-base md:text-lg transition-colors leading-snug',
                                openFaqId === faq.id ? 'text-navy' : 'text-navy group-hover:text-slate-700'
                            ]">
                                {{ faq.question }}
                            </h3>
                        </div>
                        <div :class="[
                            'size-8 rounded-xl flex items-center justify-center shrink-0 mt-1 transition-all duration-300',
                            openFaqId === faq.id ? 'bg-navy text-white rotate-180' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-navy'
                        ]">
                            <Icon icon="ph:caret-down-bold" class="text-base" />
                        </div>
                    </button>

                    <!-- Answer Area -->
                    <transition
                        enter-active-class="transition-all duration-300 ease-out"
                        leave-active-class="transition-all duration-200 ease-in"
                        enter-from-class="opacity-0 max-h-0"
                        enter-to-class="opacity-100 max-h-96"
                        leave-from-class="opacity-100 max-h-96"
                        leave-to-class="opacity-0 max-h-0">
                        <div v-if="openFaqId === faq.id" class="px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80 bg-slate-50/40">
                            <p class="font-normal">{{ faq.answer }}</p>
                            <div v-if="faq.bullets && faq.bullets.length > 0" class="mt-3 space-y-1.5 pl-1">
                                <div v-for="(bullet, bIdx) in faq.bullets" :key="bIdx" class="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                    <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-base shrink-0 mt-0.5" />
                                    <span>{{ bullet }}</span>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>
            </div>

            <!-- Empty Search State -->
            <div v-else class="bg-white rounded-3xl p-12 text-center my-8 shadow-xs">
                <div class="size-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon icon="ph:magnifying-glass-slash-bold" class="text-3xl" />
                </div>
                <h3 class="text-lg sm:text-xl font-black text-navy mb-2">
                    {{ $t('faq_page.no_results_title', 'No questions matched your search') }}
                </h3>
                <p class="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                    {{ $t('faq_page.no_results_desc', 'Try searching with different keywords or browse through the category tabs above.') }}
                </p>
                <button
                    @click="resetFilters"
                    class="px-5 py-2.5 bg-navy hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md">
                    {{ $t('faq_page.clear_search', 'Clear Search') }}
                </button>
            </div>

            <!-- Still Need Help? Support Card -->
            <div class="mt-16 bg-gradient-to-br from-navy to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl">
                <!-- Glow decor -->
                <div class="absolute -top-16 -right-16 size-48 bg-primary/20 blur-[60px] rounded-full pointer-events-none"></div>
                <div class="absolute -bottom-16 -left-16 size-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>

                <div class="relative z-10 max-w-2xl mx-auto">
                    <div class="size-14 bg-white/10 border border-white/15 text-white rounded-2xl flex items-center justify-center mx-auto mb-5">
                        <Icon icon="ph:chat-teardrop-dots-bold" class="text-3xl" />
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-black text-white mb-3">
                        {{ $t('faq_page.need_help_title', 'Still have questions?') }}
                    </h2>
                    <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                        {{ $t('faq_page.need_help_desc', "Can't find the answer you're looking for? Our support team is here to help you get your archery tournament up and running.") }}
                    </p>
                    <div class="flex flex-wrap items-center justify-center gap-4">
                        <NuxtLink to="/contact">
                            <BaseButton variant="primary" size="lg" icon="ph:envelope-simple-bold" class="min-w-[160px] font-bold">
                                {{ $t('faq_page.contact_us', 'Contact Support') }}
                            </BaseButton>
                        </NuxtLink>
                        <NuxtLink to="/docs">
                            <BaseButton variant="outline" size="lg" icon="ph:book-open-bold" class="!border-white/30 !text-white hover:!bg-white/10 min-w-[160px] font-bold">
                                {{ $t('faq_page.documentation', 'Browse Docs') }}
                            </BaseButton>
                        </NuxtLink>
                        <NuxtLink to="/auth/register">
                            <BaseButton variant="secondary" size="lg" icon="ph:arrow-right-bold" class="!bg-white !text-navy hover:!bg-slate-100 min-w-[160px] font-bold">
                                {{ $t('faq_page.register_now', 'Create Free Account') }}
                            </BaseButton>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
    layout: 'landing'
})

const searchQuery = ref('')
const activeCategory = ref('all')
const openFaqId = ref('gen-1')

const toggleFaq = (id) => {
    openFaqId.value = openFaqId.value === id ? null : id
}

const resetFilters = () => {
    searchQuery.value = ''
    activeCategory.value = 'all'
}

const categories = [
    { id: 'all', label: 'All Questions', icon: 'ph:squares-four-bold' },
    { id: 'general', label: 'General', icon: 'ph:info-bold' },
    { id: 'scoring', label: 'Archery Scoring', icon: 'ph:target-bold' },
    { id: 'organizers', label: 'Organizers', icon: 'ph:trophy-bold' },
    { id: 'archers', label: 'Archers & Clubs', icon: 'ph:users-three-bold' },
    { id: 'pricing', label: 'Pricing & Quotas', icon: 'ph:tag-bold' }
]

const faqs = [
    // ─── General ───
    {
        id: 'gen-1',
        category: 'general',
        question: 'What is Archeris and how does it work?',
        answer: 'Archeris is a comprehensive tournament management platform and digital archery scoring system built for organizers and archers worldwide. It replaces paper scorecards with smartphone scoring, automates division rankings, and manages qualification and elimination match brackets seamlessly from start to finish.',
        bullets: [
            'End-to-end competition setup, division quotas, and online entry payments',
            'Paperless arrow scorekeeping right on the shooting line using any smartphone',
            'Real-time tournament standings, World Archery elimination brackets, and official PDF result books'
        ]
    },
    {
        id: 'gen-2',
        category: 'general',
        question: 'Do organizers or archers need to download an app from the app store?',
        answer: 'No downloads or installations are required. Archeris is engineered as a responsive web application that runs directly in any modern browser on iOS, Android, tablets, laptops, and desktop computers.'
    },
    {
        id: 'gen-3',
        category: 'general',
        question: 'Can Archeris support both local club events and national championships?',
        answer: 'Yes. Archeris scales easily from single-day club practice shoots and regional open competitions to large multi-day championships featuring hundreds of athletes across multiple division categories.'
    },
    {
        id: 'gen-4',
        category: 'general',
        question: 'Is Archeris compliant with World Archery rules?',
        answer: 'Yes. Archeris adheres to official World Archery competition formats, including standard target face dimensions, standard 3-arrow and 6-arrow ends, arrow values (X, 10, 9 down to M), qualification rounds, set-system match play, and cumulative score elimination brackets.'
    },

    // ─── Archery Scoring ───
    {
        id: 'score-1',
        category: 'scoring',
        question: 'How does digital archery scoring work on the shooting line?',
        answer: 'Scorekeepers or archers input arrow scores directly on their smartphones using a clean, color-coded keypad. Arrow sums, running totals, and 10s or Xs counts are calculated automatically, instantly updating the public leaderboard without manual scorecard addition.'
    },
    {
        id: 'score-2',
        category: 'scoring',
        question: 'How are end scores verified and confirmed?',
        answer: 'After recording each end, scorekeepers review the values with archers on that target and tap "Confirm End". Confirmed ends lock the round against accidental edits and commit the scores directly to the official tournament records.'
    },
    {
        id: 'score-3',
        category: 'scoring',
        question: 'Can scores be corrected if a mistake or dispute occurs on the line?',
        answer: 'Yes. Authorized organizers and tournament judges have administrative permissions to review arrow score logs, adjust values with a transparent audit trail, and resolve shooting line disputes smoothly.'
    },
    {
        id: 'score-4',
        category: 'scoring',
        question: 'Can organizers generate official printable PDF result books and certificates?',
        answer: 'Yes. Archeris automatically generates comprehensive PDF result booklets, qualification ranking sheets, elimination match trees, and digital archer certificates equipped with QR verification codes ready to print or share.'
    },

    // ─── Tournament Organizers ───
    {
        id: 'org-1',
        category: 'organizers',
        question: 'How quickly can an organizer set up a tournament?',
        answer: 'You can publish a tournament in just a few minutes. Enter your tournament title, dates, and venue, configure division categories (such as Recurve Men, Compound Women, Barebow U-15), set participant quotas and entry fees, and publish your public registration page.'
    },
    {
        id: 'org-2',
        category: 'organizers',
        question: 'How do elimination brackets and seedings work?',
        answer: 'Once qualification scores are finalized, Archeris automatically generates standard tournament elimination brackets seeded according to qualification rankings. Match winners advance through each round up to the medal matches.'
    },
    {
        id: 'org-3',
        category: 'organizers',
        question: 'How do organizers assign scorekeepers to target lanes?',
        answer: 'From your organizer dashboard, you can add scorekeepers by username or email and assign them specific target lane ranges. When scorekeepers sign in on their phones, they immediately see their assigned targets ready for scoring.'
    },
    {
        id: 'org-4',
        category: 'organizers',
        question: 'Can organizers collect tournament registration fees online?',
        answer: 'Yes. Archeris integrates secure automated payment gateways, allowing archers to pay registration fees instantly while organizers track incoming transactions and participant statuses in real time.'
    },

    // ─── Archers & Participants ───
    {
        id: 'arc-1',
        category: 'archers',
        question: 'How do archers find and register for tournaments?',
        answer: 'Archers can browse published competitions on the Archeris tournament directory, choose their age and bow division, complete the online entry form, and secure their slot with instant online payment.'
    },
    {
        id: 'arc-2',
        category: 'archers',
        question: 'What is the digital e-ticket and QR attendance pass?',
        answer: 'After completing tournament registration, archers receive a verified digital e-ticket with competition details, category info, target lane assignment, and a unique QR attendance code for rapid check-in at the venue.'
    },
    {
        id: 'arc-3',
        category: 'archers',
        question: 'Can archers view their personal score history and tournament standings?',
        answer: 'Yes. Each registered archer has a personal profile and dashboard to monitor upcoming event schedules, live qualification rankings, match progression, and historical scoring records across all Archeris events.'
    },

    // ─── Pricing & Quotas ───
    {
        id: 'pri-1',
        category: 'pricing',
        question: 'Is there a free plan to try Archeris?',
        answer: 'Yes! The Free Starter plan includes 1 free tournament quota (supporting up to 50 participants and 200 MB media storage) with full access to scoring, target allocation, and brackets so you can test the system completely risk-free.'
    },
    {
        id: 'pri-2',
        category: 'pricing',
        question: 'How do tournament quota packages work for Standard EO and Elite EO?',
        answer: 'Tournament quotas are purchased per event and stored in your organizer balance. Standard EO (Rp 24.999 / $1.50 promo) covers up to 200 archers per tournament, while Elite EO (Rp 39.999 / $3.50 promo) supports unlimited archers. Quotas stored in your balance never expire.'
    },
    {
        id: 'pri-3',
        category: 'pricing',
        question: 'What payment methods are supported for registration and package purchases?',
        answer: 'Archeris supports automated online payments including QRIS, Virtual Accounts (BCA, Mandiri, BNI, BRI), credit/debit cards, and PayPal for international organizers and archers.'
    }
]

const getCategoryCount = (catId) => {
    if (catId === 'all') return faqs.length
    return faqs.filter(f => f.category === catId).length
}

const getCategoryLabel = (catId) => {
    const found = categories.find(c => c.id === catId)
    return found ? found.label : catId
}

const filteredFaqs = computed(() => {
    let list = faqs

    // Filter by category tab
    if (activeCategory.value !== 'all') {
        list = list.filter(f => f.category === activeCategory.value)
    }

    // Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        list = list.filter(f => {
            const inQuestion = f.question.toLowerCase().includes(query)
            const inAnswer = f.answer.toLowerCase().includes(query)
            const inBullets = f.bullets && f.bullets.some(b => b.toLowerCase().includes(query))
            return inQuestion || inAnswer || inBullets
        })
    }

    return list
})

const structuredData = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer
        }
    }))
}))

useHead({
    title: 'FAQ - The Best Archery Scoring System & Platform Questions | Archeris',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify(structuredData.value))
        }
    ]
})

useSeoMeta({
    title: 'FAQ - The Best Archery Scoring System & Platform Questions | Archeris',
    description: 'Frequently asked questions about digital archery scoring, tournament management, target butt allocations, World Archery elimination brackets, and pricing.',
    ogTitle: 'FAQ - The Best Archery Scoring System & Platform Questions | Archeris',
    ogDescription: 'Frequently asked questions about digital archery scoring, tournament management, target butt allocations, World Archery elimination brackets, and pricing.',
    ogType: 'website',
    twitterCard: 'summary_large_image'
})
</script>
