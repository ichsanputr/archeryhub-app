<template>
  <div class="relative overflow-hidden py-20">
    <!-- Background -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50"></div>
      <div class="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl"></div>
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
            BudiBadu is a comprehensive coding challenge platform designed to help developers 
            sharpen their problem-solving skills across multiple programming languages. We believe 
            that consistent practice with well-crafted challenges is the key to becoming a better programmer.
          </p>
          <p class="text-lg leading-relaxed text-gray-600">
            Our platform offers language-specific challenges for Rust, Python, Java, PHP, JavaScript, 
            and TypeScript, with each platform tailored to the unique characteristics and best practices 
            of that language. Whether you're preparing for technical interviews, learning a new language, 
            or simply want to stay sharp, BudiBadu provides the perfect environment for growth.
          </p>
        </div>

        <!-- Personal Description -->
        <div class="rounded-2xl border border-yellow-100 bg-white p-8 text-left shadow-sm">
          <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            About the Founder
          </h2>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            Hi! I'm Ichsan, the creator and developer behind BudiBadu. As a passionate programmer 
            and educator, I've experienced firsthand the challenges of learning new programming languages 
            and preparing for technical interviews. This journey inspired me to create a platform that 
            makes coding practice more accessible and effective.
          </p>
          <p class="text-lg leading-relaxed text-gray-600 mb-4">
            With years of experience in software development and a deep understanding of what makes 
            programming challenges effective, I've carefully curated problems that not only test your 
            coding skills but also help you think like a programmer. Each challenge is designed to 
            build upon previous knowledge while introducing new concepts and patterns.
          </p>
          <p class="text-lg leading-relaxed text-gray-600">
            My goal is to create a supportive community where developers can grow together, share 
            knowledge, and celebrate each other's achievements. BudiBadu is more than just a 
            coding platform—it's a place where your programming journey becomes an adventure.
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
  title: 'About - BudiBadu Coding Challenge',
  meta: [
    {
      name: 'description',
      content: 'Learn about BudiBadu, the comprehensive coding challenge platform designed to help developers sharpen their problem-solving skills across multiple programming languages.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://budibadu.com${route.path}`
    }
  ]
})
</script>
