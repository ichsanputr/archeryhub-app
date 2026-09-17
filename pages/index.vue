<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">
        <!-- Hero Section -->
        <HomeHero />

        <!-- Learn to Use Section -->
        <HomeLearnToUse />

        <!-- Trust & Testimonials Section -->
        <HomeTrustTestimonials />

        <!-- Features Demo Section -->
        <HomeFeaturesDemo />

        <!-- Pricing Section -->
        <HomePricing />

        <!-- Blog & Knowledge Base Section -->
        <HomeBlogSection />

        <!-- Mobile CTA Section -->
        <HomeMobileCTA />

    </div>
</template>

<script setup>
import HomeHero from '~/components/Home/HomeHero.vue'
import HomeLearnToUse from '~/components/Home/HomeLearnToUse.vue'
import HomeTrustTestimonials from '~/components/Home/HomeTrustTestimonials.vue'
import HomeFeaturesDemo from '~/components/Home/HomeFeaturesDemo.vue'
import HomeBlogSection from '~/components/Home/HomeBlogSection.vue'
import HomeMobileCTA from '~/components/Home/HomeMobileCTA.vue'

definePageMeta({
    layout: 'landing'
})

const { t } = useI18n()

const structuredData = computed(() => [
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Archeris',
        'url': 'https://archeris.net',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://archeris.net/tournaments?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    },
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Archeris',
        'url': 'https://archeris.net',
        'logo': 'https://archeris.net/logo.png',
        'sameAs': [
            'https://www.instagram.com/archerisnet/',
            'https://www.threads.com/@archerisnet',
            'https://www.facebook.com/archerisnet/'
        ]
    },
    {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Archeris - The Best Archery Scoring System',
        'applicationCategory': 'SportsApplication',
        'operatingSystem': 'Web, iOS, Android',
        'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
        },
        'description': 'The modern archery scoring system running directly from your phone for tournament scorekeepers, arrow valuation, and World Archery brackets.'
    }
])

useHead({
    title: computed(() => t('home.meta_title', 'Archeris - The Best Archery Scoring System')),
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
    title: () => t('home.meta_title', 'Archeris - The Best Archery Scoring System'),
    description: () => t('home.meta_desc', 'Archeris is the complete archery scoring system and competition management platform built for organizers and archers worldwide. It provides a simple and modern way to run tournaments, track standings, and handle archery scoring from any device.'),
    ogTitle: () => t('home.meta_title', 'Archeris - The Best Archery Scoring System'),
    ogDescription: () => t('home.meta_desc', 'Archeris is the complete archery scoring system and competition management platform built for organizers and archers worldwide. It provides a simple and modern way to run tournaments, track standings, and handle archery scoring from any device.'),
    ogType: 'website',
    ogUrl: 'https://archeris.net',
    ogImage: 'https://archeris.net/og-default.jpg',
    twitterCard: 'summary_large_image',
    twitterTitle: () => t('home.meta_title', 'Archeris - The Best Archery Scoring System'),
    twitterDescription: () => t('home.meta_desc', 'Archeris is the complete archery scoring system and competition management platform built for organizers and archers worldwide. It provides a simple and modern way to run tournaments, track standings, and handle archery scoring from any device.')
})
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.border-border-subtle {
    border-color: #e5e7eb;
}

/* Custom Scrollbar */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}
</style>
