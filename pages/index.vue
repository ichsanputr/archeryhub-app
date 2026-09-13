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

        <!-- Mobile CTA Section -->
        <HomeMobileCTA />

    </div>
</template>

<script setup>
import HomeHero from '~/components/Home/HomeHero.vue'
import HomeLearnToUse from '~/components/Home/HomeLearnToUse.vue'
import HomeTrustTestimonials from '~/components/Home/HomeTrustTestimonials.vue'
import HomeFeaturesDemo from '~/components/Home/HomeFeaturesDemo.vue'
import HomeMobileCTA from '~/components/Home/HomeMobileCTA.vue'
import SubscriptionPromo from '~/components/dashboard/subscription/SubscriptionPromo.vue'

definePageMeta({
    layout: 'landing'
})

const { t } = useI18n()

useHead({
    title: computed(() => t('home.meta_title', 'Archeris - Archery Event Management & Live Scoring Platform')),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => t('home.meta_title', 'Archeris - Archery Event Management & Live Scoring Platform'),
    description: () => t('home.meta_desc', 'The modern archery tournament management system. Live scoring, target butt allocations, elimination brackets, and real-time public leaderboards.'),
    ogTitle: () => t('home.meta_title', 'Archeris - Archery Event Management & Live Scoring Platform'),
    ogDescription: () => t('home.meta_desc', 'The modern archery tournament management system. Live scoring, target butt allocations, elimination brackets, and real-time public leaderboards.')
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
