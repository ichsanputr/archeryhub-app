<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-4xl relative z-10">
                <div class="max-w-3xl text-center md:text-left">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:question-bold" class="text-base sm:text-lg" />
                        <span>Support Center</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Frequently <span class="text-primary">Asked Questions</span>
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                        Find quick answers to common questions about registration, organizers, and the Archeris.net scoring system.
                    </p>
                </div>
            </div>
        </section>

        <!-- FAQ Content -->
        <section class="container mx-auto px-4 max-w-4xl py-16">
            <div class="space-y-4">
                <div v-for="(faq, index) in faqs" :key="index"
                     class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-sm transition-all">
                    <button @click="toggleFaq(index)"
                        class="w-full px-6 py-5 flex items-center justify-between text-left group">
                        <span class="font-bold text-navy group-hover:text-primary transition-colors">{{ faq.question
                            }}</span>
                        <Icon icon="ph:caret-down-bold"
                            :class="['text-gray-400 transition-transform duration-300', activeFaq === index ? 'rotate-180' : '']" />
                    </button>
                    <div v-show="activeFaq === index" class="px-6 pb-6 text-gray-500 text-sm leading-relaxed">
                        {{ faq.answer }}
                    </div>
                </div>
            </div>

            <!-- Still Need Help? -->
            <div class="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center border border-gray-100 shadow-sm">
                <div
                    class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                    <Icon icon="ph:chat-circle-dots-bold" class="text-3xl" />
                </div>
                <h2 class="text-lg sm:text-2xl font-black text-navy mb-3">Still Need Help?</h2>
                <p class="text-gray-500 mb-8 max-w-md mx-auto">
                    Our support team is ready to assist you with technical issues or any other questions.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <NuxtLink to="/contact">
                        <BaseButton variant="primary" size="lg" icon="ph:envelope-simple-bold">
                            Contact Us
                        </BaseButton>
                    </NuxtLink>
                    <NuxtLink to="/docs">
                        <BaseButton variant="outline" size="lg" icon="ph:book-open-bold">
                            Documentation
                        </BaseButton>
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

definePageMeta({
    layout: 'landing'
})

const activeFaq = ref(0)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const faqs = [
    {
        question: 'How do I register an organizer on Archeris.net?',
        answer: 'You can register your organizer via the registration page by choosing the "Organizer" account type. Once your email is verified, you can complete your organizer profile and start managing events.'
    },
    {
        question: 'Can the scoring system be used for offline tournaments?',
        answer: 'Absolutely! Archeris.net is designed to simplify offline tournament scoring digitally. Scores can be entered directly by referees or participants through the application.'
    },
    {
        question: 'How does the event registration payment process work?',
        answer: 'We support various automated payment methods such as Bank Transfer, E-Wallet, and QRIS. Registration status is updated automatically upon successful payment.'
    },
    {
        question: 'Is athlete data kept secure?',
        answer: 'We implement strict data security standards and end-to-end encryption to ensure all athletes\' personal information is stored securely.'
    },
    {
        question: 'How do I request technical assistance?',
        answer: 'If you encounter any technical issues, please contact our support team through the Contact page or send an email to support@archeris.net.'
    }
]

useHead({
    title: 'FAQ - Frequently Asked Questions - Archeris.net'
})
</script>
