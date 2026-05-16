<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">
        <!-- Hero Section -->
        <HomeHero />

        <!-- Learn to Use Section -->
        <HomeLearnToUse />

        <!-- Features Demo Section -->
        <HomeFeaturesDemo />

        <!-- Latest Blog Section -->
        <HomeLatestBlog />

        <!-- Pricing Section -->
        <HomePricing />

        <!-- Mobile CTA Section -->
        <HomeMobileCTA />





    </div>
</template>

<script setup>
import HomeHero from '~/components/Home/HomeHero.vue'
import HomeStats from '~/components/Home/HomeStats.vue'
import HomeLearnToUse from '~/components/Home/HomeLearnToUse.vue'
import HomeFeaturesDemo from '~/components/Home/HomeFeaturesDemo.vue'
import HomeMobileCTA from '~/components/Home/HomeMobileCTA.vue'
import HomeLatestBlog from '~/components/Home/HomeLatestBlog.vue'
import SubscriptionPromo from '~/components/dashboard/subscription/SubscriptionPromo.vue'

definePageMeta({
    layout: 'landing'
})

const { t } = useI18n()

useHead({
    title: t('home.meta_title'),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    meta: [
        {
            name: 'description',
            content: t('home.meta_desc')
        }
    ]
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
