<template>
  <div class="relative overflow-hidden py-20">
    <!-- Background -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50"></div>
      <div class="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl">
      </div>
    </div>

    <Container>
      <div class="text-center max-w-4xl mx-auto">
        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
          <span class="text-gray-900">About</span>
        </h1>

        <!-- Platform Description -->
        <div class="rounded-2xl border border-yellow-100 bg-white p-8 mb-12 text-left shadow-sm">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            Our Platform
          </h2>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            Archery Hub is a comprehensive tournament management platform designed to help archery
            organizations and clubs manage their competitions with ease. We believe
            that efficient management and live engagement are key to a successful sporting event.
          </p>
          <p class="text-lg leading-relaxed text-gray-600">
            Our platform offers end-to-end solutions for archery tournaments, including registration,
            athlete management, live scoring, and official result publishing. Whether you're running
            a small club competition or a national championship, Archery Hub provides the
            perfect tools for a professional experience.
          </p>
        </div>

        <!-- Personal Description -->
        <div class="rounded-2xl border border-yellow-100 bg-white p-8 text-left shadow-sm">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            About the Founder
          </h2>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            Hi! I'm Ichsan, the creator and developer behind Archery Hub. As an archery
            enthusiast and software engineer, I've seen the need for more modern and
            accessible tools to manage archery events and track athlete progress.
            This passion inspired me to build a platform that simplifies tournament logistics.
          </p>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            With years of experience in both software development and sports management,
            I've designed Archery Hub to be intuitive for organizers and engaging for athletes.
            Every feature is built with the goal of making archery competitions more
            professional, transparent, and exciting for everyone involved.
          </p>
          <p class="text-lg leading-relaxed text-gray-600">
            My goal is to support the archery community by providing world-class technology
            that grows with your needs. Archery Hub is more than just a
            management system—it's a partner in your tournament journey.
          </p>
        </div>

      </div>
    </Container>
  </div>
</template>

<script setup>
import Container from '~/components/Container.vue'

// Use landing layout
definePageMeta({
  layout: 'landing'
})

// Set page meta
const route = useRoute()
useHead({
  title: 'About - Archery Hub Tournament Manager',
  meta: [
    {
      name: 'description',
      content: 'Learn about Archery Hub, the comprehensive tournament management platform designed to help archery organizations and clubs manage their competitions with ease.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://archeryhub.id${route.path}`
    }
  ]
})
</script>
