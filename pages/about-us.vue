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
          Building a modern, accurate, and accessible digital archery ecosystem for athletes, coaches, clubs, and tournament organizers.
        </p>
      </div>
    </section>

    <!-- Main Editorial Content Area (Semi-Article Format) -->
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <article class="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-xs space-y-10">

        <!-- Background & Origin -->
        <section class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Icon icon="ph:compass-bold" class="text-primary text-sm" />
            <span>Our Origin</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-navy font-display tracking-tight">
            From Paper Scorecards to the Shooting Line
          </h2>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            For anyone who has ever competed in or organized an archery tournament, the scene is all too familiar: stacks of paper scorecards, long queues at the tabulation desk, and hours of waiting for elimination bracket calculations. Athletes and spectators often wait for hours just to discover official qualifying ranks or next-round match assignments.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            Archeris was born directly out of this range experience. We recognized the gap between the rapidly growing enthusiasm for competitive archery and outdated, error-prone manual tabulation methods. We believe sports technology should simplify tournament operations and make matches transparent, instant, and engaging for everyone involved.
          </p>
        </section>

        <!-- Quote Box -->
        <blockquote class="p-6 bg-slate-50 border-l-4 border-navy rounded-r-2xl space-y-2">
          <p class="text-slate-800 font-medium italic text-sm sm:text-base leading-relaxed">
            "Archery is a discipline of focus and precision. The infrastructure supporting it must be equally precise—every arrow recorded accurately, transparently, and accessible in real time."
          </p>
          <footer class="text-xs font-bold text-slate-500">— Archeris Founding Team</footer>
        </blockquote>

        <!-- Initial Purpose -->
        <section class="space-y-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Icon icon="ph:target-bold" class="text-primary text-sm" />
            <span>Our Mission</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-navy font-display tracking-tight">
            Making Digital Scoring Accessible Everywhere
          </h2>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            Our purpose from day one has been clear: deliver an archery competition platform that operates seamlessly from any smartphone without requiring complex on-site server setups or expensive proprietary scoring terminals.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            We developed automated ranking round tabulation, standard World Archery compliant elimination match brackets, and official Ianseo tournament synchronization so that grassroots clubs and national federations alike can run world-class competitions efficiently.
          </p>
        </section>

        <!-- Vision & Mission -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <!-- Vision -->
          <div class="p-6 rounded-2xl bg-navy text-white space-y-3 shadow-xs">
            <div class="w-9 h-9 rounded-xl bg-white/10 text-primary flex items-center justify-center text-lg">
              <Icon icon="ph:eye-bold" />
            </div>
            <h3 class="text-base font-bold text-white">Our Vision</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              To be the leading digital archery platform uniting archers, coaches, clubs, and tournaments with trusted, standardized competition data across the globe.
            </p>
          </div>

          <!-- Mission -->
          <div class="p-6 rounded-2xl bg-slate-100 text-navy space-y-3 border border-slate-200/80">
            <div class="w-9 h-9 rounded-xl bg-navy text-primary flex items-center justify-center text-lg">
              <Icon icon="ph:rocket-launch-bold" />
            </div>
            <h3 class="text-base font-bold text-navy">What We Deliver</h3>
            <ul class="text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed font-normal">
              <li class="flex items-start gap-2">
                <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm shrink-0 mt-0.5" />
                <span>Accurate, real-time live scoring and digital scorecards.</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm shrink-0 mt-0.5" />
                <span>Automated bracket progression and verified digital certificates.</span>
              </li>
              <li class="flex items-start gap-2">
                <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm shrink-0 mt-0.5" />
                <span>High-quality archery guides and educational resources.</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Principles in Practice (Smooth Narrative Paragraphs) -->
        <section class="space-y-4 pt-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
            <Icon icon="ph:heart-bold" class="text-primary text-sm" />
            <span>Our Principles</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-navy font-display tracking-tight">
            How We Build and Operate
          </h2>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            Behind every feature we engineer is an uncompromising commitment to scoring integrity and data accuracy. In archery, millimeters decide championships; our system ensures every arrow score, shoot-off tie-break, and qualification total is completely transparent, auditable, and instantly verifiable.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            Accessibility drives our design philosophy. By creating clean, responsive interfaces that perform reliably under open-field sunlight and varied network conditions, we empower volunteer scorekeepers, certified judges, and archers to focus entirely on the competition rather than technical hurdles.
          </p>

          <p class="text-slate-700 text-sm sm:text-base leading-relaxed">
            We grow alongside the archery community. We continuously collaborate with club managers, tournament directors, and national judges to incorporate practical on-the-ground feedback into every release, ensuring our platform evolves to meet the genuine needs of the sport.
          </p>
        </section>

        <!-- Call to Action Footer -->
        <section class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1 text-center sm:text-left">
            <h4 class="text-sm font-bold text-navy">Have questions or interested in partnering?</h4>
            <p class="text-xs text-slate-500">Our team is ready to support your tournament, club, or organization.</p>
          </div>

          <div class="flex items-center gap-3">
            <NuxtLink to="/tournaments" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold transition-colors cursor-pointer">
              Explore Tournaments
            </NuxtLink>
            <NuxtLink to="/blog" class="px-4 py-2 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer">
              Read Guides
            </NuxtLink>
          </div>
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
