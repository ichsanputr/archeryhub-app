<template>
    <div class="min-h-screen bg-background-dark">
        <!-- Navigation -->
        <nav
            class="fixed top-0 left-0 right-0 z-50 bg-background-dark/95 backdrop-blur border-b border-surface-highlight">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center gap-3">
                        <div class="size-10 rounded-lg bg-brand-gold flex items-center justify-center">
                            <span class="material-symbols-outlined text-xl text-black">target</span>
                        </div>
                        <span class="text-xl font-bold text-white">Archery Hub</span>
                    </div>
                    <div class="hidden md:flex items-center gap-8">
                        <a href="#features" class="text-gray-400 hover:text-white transition-colors">Features</a>
                        <a href="#how-it-works" class="text-gray-400 hover:text-white transition-colors">How It
                            Works</a>
                        <a href="#testimonials"
                            class="text-gray-400 hover:text-white transition-colors">Testimonials</a>
                        <a href="#faq" class="text-gray-400 hover:text-white transition-colors">FAQ</a>
                    </div>
                    <div class="flex items-center gap-4">
                        <NuxtLink to="/auth/login"
                            class="text-brand-gold hover:text-white transition-colors font-medium">
                            Sign In
                        </NuxtLink>
                        <NuxtLink to="/auth/login"
                            class="px-4 py-2 rounded-lg bg-brand-gold text-black font-bold hover:bg-yellow-400 transition-colors">
                            Get Started
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative overflow-hidden pt-24">
            <div class="absolute inset-0 bg-gradient-to-br from-background-dark via-surface-dark to-background-dark">
            </div>
            <div
                class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent">
            </div>

            <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div class="text-center lg:text-left">
                        <div
                            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-6">
                            <span class="material-symbols-outlined text-lg">verified</span>
                            <span>Trusted by 500+ Organizations Worldwide</span>
                        </div>

                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                            Professional
                            <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-400">Archery</span>
                            Tournament Management
                        </h1>

                        <p class="text-lg md:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                            The complete platform for archery competitions. From registration to live results,
                            manage everything in one place.
                        </p>

                        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <NuxtLink to="/auth/login"
                                class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-gold to-yellow-500 text-black font-bold text-lg hover:shadow-lg hover:shadow-brand-gold/30 transition-all">
                                <span class="material-symbols-outlined">rocket_launch</span>
                                Start Free Trial
                            </NuxtLink>
                            <a href="#how-it-works"
                                class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-surface-highlight text-white font-semibold text-lg hover:bg-surface-highlight transition-all">
                                <span class="material-symbols-outlined">play_circle</span>
                                Watch Demo
                            </a>
                        </div>
                    </div>

                    <div class="hidden lg:flex justify-center">
                        <div class="relative">
                            <div
                                class="size-80 rounded-full bg-gradient-to-br from-brand-gold/20 to-transparent flex items-center justify-center">
                                <div
                                    class="size-64 rounded-full bg-gradient-to-br from-brand-gold/30 to-transparent flex items-center justify-center">
                                    <span class="material-symbols-outlined text-9xl text-brand-gold">target</span>
                                </div>
                            </div>
                            <div
                                class="absolute -top-4 -right-4 bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 shadow-xl">
                                <div class="text-2xl font-bold text-white">1.2M+</div>
                                <div class="text-xs text-brand-gold">Scores Recorded</div>
                            </div>
                            <div
                                class="absolute -bottom-4 -left-4 bg-surface-dark border border-surface-highlight rounded-xl px-4 py-3 shadow-xl">
                                <div class="text-2xl font-bold text-white">50K+</div>
                                <div class="text-xs text-brand-gold">Athletes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Bar -->
        <section class="py-12 bg-surface-dark border-y border-surface-highlight">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div v-for="stat in stats" :key="stat.label" class="text-center">
                        <div class="text-3xl md:text-4xl font-black text-brand-gold mb-1">{{ stat.value }}</div>
                        <div class="text-sm text-gray-400">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Live Competitions Spotlight -->
        <section class="py-20 bg-background-dark">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-12">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-medium mb-4">
                        <span class="size-2 rounded-full bg-red-500 animate-pulse"></span>
                        Live Now
                    </div>
                    <h2 class="text-3xl md:text-4xl font-black text-white mb-4">Active Competitions</h2>
                    <p class="text-gray-400 max-w-2xl mx-auto">See what's happening in the archery world right now</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="event in liveEvents" :key="event.name"
                        class="group p-6 rounded-2xl bg-surface-dark border border-surface-highlight hover:border-brand-gold/50 transition-all">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h3 class="text-lg font-bold text-white group-hover:text-brand-gold transition-colors">
                                    {{ event.name }}</h3>
                                <p class="text-sm text-gray-400">{{ event.location }}</p>
                            </div>
                            <span v-if="event.live"
                                class="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">LIVE</span>
                            <span v-else
                                class="px-2 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-bold">{{
                                event.status }}</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-400">{{ event.date }}</span>
                            <span class="text-brand-gold font-medium">{{ event.participants }} Athletes</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="py-20 bg-surface-dark/50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-black text-white mb-4">Everything You Need</h2>
                    <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                        Comprehensive tools designed for archery tournament organizers, coaches, and athletes.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div v-for="feature in features" :key="feature.title"
                        class="group p-6 rounded-2xl bg-surface-dark border border-surface-highlight hover:border-brand-gold/50 transition-all">
                        <div
                            class="size-14 rounded-xl bg-brand-gold/10 flex items-center justify-center mb-4 group-hover:bg-brand-gold/20 transition-colors">
                            <span class="material-symbols-outlined text-3xl text-brand-gold">{{ feature.icon }}</span>
                        </div>
                        <h3 class="text-xl font-bold text-white mb-2">{{ feature.title }}</h3>
                        <p class="text-gray-400">{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- How It Works -->
        <section id="how-it-works" class="py-20 bg-background-dark">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-black text-white mb-4">How It Works</h2>
                    <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                        Get your tournament up and running in minutes
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div v-for="(step, index) in steps" :key="step.title" class="relative text-center">
                        <div
                            class="size-16 rounded-full bg-brand-gold/10 border-2 border-brand-gold flex items-center justify-center mx-auto mb-4">
                            <span class="text-2xl font-black text-brand-gold">{{ index + 1 }}</span>
                        </div>
                        <h3 class="text-lg font-bold text-white mb-2">{{ step.title }}</h3>
                        <p class="text-sm text-gray-400">{{ step.description }}</p>
                        <div v-if="index < 3"
                            class="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-brand-gold/50 to-transparent">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Testimonials -->
        <section id="testimonials" class="py-20 bg-surface-dark/50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-black text-white mb-4">Trusted by Champions</h2>
                    <p class="text-lg text-gray-400 max-w-2xl mx-auto">
                        See what tournament organizers say about Archery Hub
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div v-for="testimonial in testimonials" :key="testimonial.name"
                        class="p-6 rounded-2xl bg-surface-dark border border-surface-highlight">
                        <div class="flex items-center gap-1 mb-4">
                            <span v-for="i in 5" :key="i"
                                class="material-symbols-outlined text-brand-gold text-lg">star</span>
                        </div>
                        <p class="text-gray-300 mb-6">"{{ testimonial.quote }}"</p>
                        <div class="flex items-center gap-4">
                            <div class="size-12 rounded-full bg-brand-gold/20 flex items-center justify-center">
                                <span class="text-brand-gold font-bold">{{ testimonial.initials }}</span>
                            </div>
                            <div>
                                <div class="text-white font-bold">{{ testimonial.name }}</div>
                                <div class="text-sm text-gray-400">{{ testimonial.role }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="py-20 bg-background-dark">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-black text-white mb-4">Frequently Asked Questions</h2>
                    <p class="text-lg text-gray-400">Find answers to common questions</p>
                </div>

                <div class="space-y-4">
                    <div v-for="(faq, index) in faqs" :key="index"
                        class="rounded-xl bg-surface-dark border border-surface-highlight overflow-hidden">
                        <button @click="toggleFaq(index)"
                            class="w-full p-6 flex items-center justify-between text-left">
                            <span class="text-white font-semibold">{{ faq.question }}</span>
                            <span class="material-symbols-outlined text-brand-gold transition-transform"
                                :class="{ 'rotate-180': openFaq === index }">
                                expand_more
                            </span>
                        </button>
                        <div v-show="openFaq === index" class="px-6 pb-6 text-gray-400">
                            {{ faq.answer }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-20 bg-surface-dark/50">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div
                    class="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-brand-gold/10 via-surface-dark to-surface-dark border border-brand-gold/20">
                    <h2 class="text-3xl md:text-4xl font-black text-white mb-4">Ready to Get Started?</h2>
                    <p class="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
                        Join thousands of archery organizations already using Archery Hub to manage their tournaments.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <NuxtLink to="/auth/login"
                            class="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-brand-gold to-yellow-500 text-black font-bold text-lg hover:shadow-lg hover:shadow-brand-gold/30 transition-all">
                            <span class="material-symbols-outlined">rocket_launch</span>
                            Start Free Trial
                        </NuxtLink>
                        <NuxtLink to="/contact"
                            class="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl border border-surface-highlight text-white font-semibold text-lg hover:bg-surface-highlight transition-all">
                            <span class="material-symbols-outlined">mail</span>
                            Contact Sales
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="py-16 border-t border-surface-highlight bg-background-dark">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div class="col-span-2 md:col-span-1">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="size-10 rounded-lg bg-brand-gold flex items-center justify-center">
                                <span class="material-symbols-outlined text-xl text-black">target</span>
                            </div>
                            <span class="text-xl font-bold text-white">Archery Hub</span>
                        </div>
                        <p class="text-gray-400 text-sm mb-4">
                            Professional tournament management for archery competitions worldwide.
                        </p>
                    </div>

                    <div>
                        <h4 class="text-white font-bold mb-4">Product</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li><a href="#features" class="hover:text-brand-gold transition-colors">Features</a></li>
                            <li>
                                <NuxtLink to="/about" class="hover:text-brand-gold transition-colors">About</NuxtLink>
                            </li>
                            <li><a href="#" class="hover:text-brand-gold transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-bold mb-4">Support</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li>
                                <NuxtLink to="/contact" class="hover:text-brand-gold transition-colors">Contact
                                </NuxtLink>
                            </li>
                            <li><a href="#faq" class="hover:text-brand-gold transition-colors">FAQ</a></li>
                            <li><a href="#" class="hover:text-brand-gold transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-bold mb-4">Legal</h4>
                        <ul class="space-y-2 text-sm text-gray-400">
                            <li>
                                <NuxtLink to="/privacy" class="hover:text-brand-gold transition-colors">Privacy Policy
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/terms" class="hover:text-brand-gold transition-colors">Terms of Service
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </div>

                <div
                    class="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-surface-highlight">
                    <div class="text-sm text-gray-500 mb-4 md:mb-0">
                        © {{ new Date().getFullYear() }} Archery Hub. All rights reserved.
                    </div>
                    <div class="flex items-center gap-4">
                        <a href="#" class="text-gray-400 hover:text-brand-gold transition-colors">
                            <span class="material-symbols-outlined">mail</span>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-brand-gold transition-colors">
                            <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-brand-gold transition-colors">
                            <svg class="size-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
    layout: 'blank',
    title: 'Archery Hub - Professional Tournament Management'
})

const openFaq = ref(null)
const toggleFaq = (index) => {
    openFaq.value = openFaq.value === index ? null : index
}

const stats = [
    { value: '2,500+', label: 'Tournaments Hosted' },
    { value: '85', label: 'Countries' },
    { value: '50,000+', label: 'Athletes' },
    { value: '1.2M+', label: 'Scores Recorded' }
]

const liveEvents = [
    { name: 'National Indoor Championship 2026', location: 'Jakarta, Indonesia', date: 'Jan 17-19', participants: 248, live: true },
    { name: 'World Cup Stage 1', location: 'Shanghai, China', date: 'Jan 22-28', participants: 312, status: 'UPCOMING' },
    { name: 'European Grand Prix', location: 'Paris, France', date: 'Feb 5-8', participants: 186, status: 'UPCOMING' }
]

const features = [
    { icon: 'event', title: 'Tournament Management', description: 'Create and manage tournaments with ease. Set up categories, distances, and sessions in minutes.' },
    { icon: 'live_tv', title: 'Live Results', description: 'Real-time score updates and live leaderboards that keep everyone engaged.' },
    { icon: 'groups', title: 'Athlete Registration', description: 'Streamlined registration process with photo ID cards and accreditation support.' },
    { icon: 'account_tree', title: 'Bracket System', description: 'Automated bracket generation for elimination rounds with visual displays.' },
    { icon: 'print', title: 'Print Center', description: 'Generate scorecards, result sheets, certificates, and official documents.' },
    { icon: 'analytics', title: 'Statistics & Analytics', description: 'Comprehensive statistics and performance analytics for athletes and teams.' }
]

const steps = [
    { title: 'Create Event', description: 'Set up your tournament with dates, venue, and competition format.' },
    { title: 'Register Athletes', description: 'Athletes register online or you can import from spreadsheets.' },
    { title: 'Run Competition', description: 'Use our scoring system for qualification and elimination rounds.' },
    { title: 'Share Results', description: 'Publish live results and generate certificates automatically.' }
]

const testimonials = [
    { name: 'John Smith', initials: 'JS', role: 'Tournament Director, USA Archery', quote: 'Archery Hub has revolutionized how we run our national championships. The live scoring feature is a game-changer.' },
    { name: 'Maria Garcia', initials: 'MG', role: 'Club President, Madrid Archery', quote: 'Finally, a system that understands archery. Setup is intuitive and our athletes love seeing real-time rankings.' },
    { name: 'Tanaka Yuki', initials: 'TY', role: 'Event Organizer, Japan Archery Federation', quote: 'We\'ve reduced our administrative time by 70%. The automated bracket system is incredibly reliable.' }
]

const faqs = [
    { question: 'How much does Archery Hub cost?', answer: 'Archery Hub offers a free tier for small clubs with up to 3 tournaments per year. Paid plans start at $29/month for unlimited tournaments and premium features.' },
    { question: 'Can I import my existing athlete database?', answer: 'Yes! You can import athletes via CSV or Excel files. We also support integration with major archery federation databases.' },
    { question: 'Does it work offline?', answer: 'Our mobile scoring app works offline and syncs automatically when connectivity is restored. Perfect for outdoor venues with limited internet.' },
    { question: 'What archery formats are supported?', answer: 'We support all World Archery formats including Olympic, Field, and 3D. Custom scoring rules can also be configured.' },
    { question: 'How do I get support?', answer: 'We offer email support for all users, with priority support and phone access for premium plans. Our documentation covers most common questions.' }
]
</script>
