<template>
    <div class="min-h-screen bg-background-light font-body text-navy overflow-x-hidden">
        <!-- Hero Section -->
        <HomeHero />

        <!-- Main Content Section: Tournaments & CTA -->
        <section class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 -mt-12 relative z-20">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 sm:mt-2 gap-6 md:gap-8">
                <!-- Column 1: Upcoming Tournaments -->
                <div class="md:col-span-2 lg:col-span-2">
                    <HomeUpcomingEvents />
                </div>

                <!-- Column 2: CTA Cards (Stacked) -->
                <HomeCTAStack />
            </div>
        </section>

        <!-- Live Events Section -->
        <HomeLiveEvents />

        <!-- Features Section (Restored) -->
        <HomeFeatures />

        <!-- Featured Clubs Section -->
        <HomeFeaturedClubs />

        <!-- Latest News Section -->
        <HomeLatestNews />
    </div>
</template>

<script setup>
import HomeHero from '~/components/Home/HomeHero.vue'
import HomeUpcomingEvents from '~/components/Home/HomeUpcomingEvents.vue'
import HomeCTAStack from '~/components/Home/HomeCTAStack.vue'
import HomeLiveEvents from '~/components/Home/HomeLiveEvents.vue'
import HomeFeaturedClubs from '~/components/Home/HomeFeaturedClubs.vue'
import HomeLatestNews from '~/components/Home/HomeLatestNews.vue'
import HomeFeatures from '~/components/Home/HomeFeatures.vue'

definePageMeta({
    layout: 'landing'
})

useHead({
    title: 'Archeryhub.id - All in One Platform Panahan Indonesia',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    meta: [
        {
            name: 'description',
            content: 'Archeryhub.id hadir sebagai wadah bagi seluruh penggiat panahan di Indonesia. Dari pemula hingga juara nasional, di sini kita terhubung lewat event, prestasi, dan semangat yang sama.'
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
