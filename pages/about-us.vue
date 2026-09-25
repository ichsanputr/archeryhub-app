<template>
  <div class="min-h-screen bg-slate-50 font-body text-navy selection:bg-primary/20 selection:text-navy">
    <!-- Header Banner -->
    <section class="relative bg-navy text-white pt-28 pb-14 sm:pt-36 sm:pb-20 overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img src="/hero-event-detail.jpeg" alt="About Archeris" class="w-full h-full object-cover opacity-20" />
        <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-navy/60"></div>
      </div>

      <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <!-- Breadcrumbs -->
        <div class="flex items-center justify-center gap-2 text-xs text-slate-300 font-medium mb-2">
          <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[10px] text-slate-400" />
          <span class="text-primary font-semibold">About Us</span>
        </div>

        <h1 class="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-display leading-tight">
          About Archeris
        </h1>
        <p class="text-slate-300 text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed">
          Making archery scoring and tournament management simple for everyone.
        </p>
      </div>
    </section>

    <!-- Main Editorial Content Area -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-xs space-y-10">

        <!-- Background & Origin -->
        <section class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Icon icon="ph:compass-bold" class="text-primary text-sm" />
            <span>Our Story</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-navy font-display tracking-tight">
            Why We Built Archeris
          </h2>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            Anyone who has competed in or organized an archery tournament knows the frustration: stacks of paper scorecards, long lines at the scoring desk, and hours of waiting for elimination brackets. Archers and spectators often spend half their day just waiting to see who shoots next.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            We built Archeris to solve this problem. We replaced slow, manual paper tabulation with a fast, modern mobile scoring platform. Our goal is simple: make scoring instant, accurate, and transparent for everyone on the shooting line.
          </p>
        </section>

        <!-- Quote Box -->
        <blockquote class="p-6 bg-slate-50 border-l-4 border-navy rounded-r-2xl space-y-2">
          <p class="text-slate-800 font-medium italic text-sm sm:text-base leading-relaxed">
            "Archery requires total focus. Managing a tournament should be just as clean and simple."
          </p>
          <footer class="text-xs font-bold text-slate-500">— The Archeris Team</footer>
        </blockquote>

        <!-- Mission -->
        <section class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Icon icon="ph:target-bold" class="text-primary text-sm" />
            <span>Our Mission</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-navy font-display tracking-tight">
            Digital Scoring on Any Device
          </h2>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            From day one, our goal has been clear: help organizers run tournaments directly from a smartphone or tablet, without expensive hardware or complicated setups.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            Whether you run a weekend club practice or a multi-day championship, Archeris handles qualification rounds, elimination match brackets, and live leaderboards automatically.
          </p>
        </section>

        <!-- Vision & What We Deliver -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <!-- Vision -->
          <div class="p-6 rounded-2xl bg-navy text-white space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-xl bg-white/10 text-primary flex items-center justify-center text-lg">
              <Icon icon="ph:eye-bold" />
            </div>
            <h3 class="text-base font-bold text-white">Our Vision</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              To make archery events easy to run, enjoyable to follow, and accessible to clubs everywhere.
            </p>
          </div>

          <!-- What We Deliver -->
          <div class="p-6 rounded-2xl bg-slate-100 text-navy space-y-3 border border-slate-200/80">
            <div class="w-9 h-9 rounded-xl bg-navy text-primary flex items-center justify-center text-lg">
              <Icon icon="ph:rocket-launch-bold" />
            </div>
            <h3 class="text-base font-bold text-navy">What We Deliver</h3>
            <ul class="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed font-normal">
              <li class="flex items-start gap-2">
                <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm shrink-0 mt-0.5" />
                <span>Live mobile scoring with instant leaderboards.</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm shrink-0 mt-0.5" />
                <span>Automatic elimination brackets and certificates.</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm shrink-0 mt-0.5" />
                <span>Clear archery articles and learning resources.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Principles in Practice -->
        <section class="space-y-4 pt-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Icon icon="ph:heart-bold" class="text-primary text-sm" />
            <span>Our Values</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-navy font-display tracking-tight">
            How We Work
          </h2>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            <strong>Accuracy First:</strong> In archery, every millimeter matters. Our system ensures every arrow score, tie-break, and qualification total is recorded accurately and clearly.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            <strong>Easy to Use:</strong> We design tools that work seamlessly under open-field sunlight and spotty connections. Volunteers, judges, and archers can start scoring without complex training.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            <strong>Built with the Community:</strong> We listen closely to club managers, coaches, and archers to improve Archeris with every single event.
          </p>
        </section>



      </article>
    </main>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
  layout: 'landing'
})

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  'name': 'About Archeris - Digital Archery Platform',
  'description': 'Building a modern, accurate, and accessible digital archery ecosystem for athletes, coaches, clubs, and tournament organizers.',
  'url': 'https://archeris.net/about-us'
}))

useHead({
  title: 'About Us - Archeris',
  link: [
    { rel: 'canonical', href: useRequestURL().href }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(structuredData.value))
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://archeris.net/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'About Us',
            'item': 'https://archeris.net/about-us'
          }
        ]
      })
    }
  ]
})

useSeoMeta({
  title: 'About Us - Archeris',
  description: 'Learn about Archeris, our mission to digitize archery tournament scoring, our background, and our commitment to accuracy and precision.',
  ogTitle: 'About Us - Archeris',
  ogDescription: 'Learn about Archeris, our mission to digitize archery tournament scoring, our background, and our commitment to accuracy and precision.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>

<style scoped></style>
