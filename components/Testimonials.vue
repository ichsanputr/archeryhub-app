<template>
  <section class="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl"></div>
      <div class="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl"></div>
    </div>
    
    <Container>
      <!-- Testimonials -->
      <div class="text-center mb-16">
        <h2 class="text-2xl sm:text-3xl sm:text-4xl font-bold mb-6">
          <span class="text-gray-800">Join</span> <span class="text-gradient">2,000 developers</span><br>
          <span class="text-gray-800">who leveled up with BudiBadu</span>
        </h2>
      </div>

      <div class="relative mb-6">
      <div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent"></div>
      <div class="overflow-hidden">
        <div class="flex gap-6 animate-testimonial-scroll hover:pause-animation">
          <div 
            v-for="(t, index) in [...testimonials, ...testimonials]" 
            :key="`${t.name}-${index}`"
            class="min-w-[300px] max-w-[300px] glass-card p-6 flex flex-col"
          >
            <div class="flex items-center mb-4">
              <img
                :src="`https://github.com/${t.username}.png?size=80`"
                :alt="t.name"
                class="w-10 h-10 rounded-full mr-3 border-2 border-yellow-500"
                loading="lazy"
              />
              <div>
                <h4 class="font-semibold text-gray-800">{{ t.name }}</h4>
                <p class="text-xs text-gray-600">{{ t.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 leading-relaxed mb-3">"{{ t.content }}"</p>
            <div class="mt-auto flex items-center gap-3 text-xs text-yellow-600 font-medium">
              <span>{{ t.company }}</span>
              <span>•</span>
              <span class="flex items-center gap-0.5">
                <img 
                  v-for="star in t.rating" 
                  :key="star"
                  src="/star.svg" 
                  alt="star" 
                  class="w-4 h-4" 
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Container>
  </section>
</template>

<script setup>
import Container from '~/components/Container.vue'

const testimonials = [
  {
    name: "Sarah Chen",
    username: "sarahchen",
    role: "Software Engineer",
    content: "BudiBadu helped me land my dream job! The interview prep challenges are spot-on.",
    rating: 5,
    company: "Google"
  },
  {
    name: "Marcus Rodriguez",
    username: "marcus-rodriguez",
    role: "Full Stack Developer",
    content: "The algorithm challenges are addictive! I've solved over 500 problems.",
    rating: 4,
    company: "Meta"
  },
  {
    name: "Emily Johnson",
    username: "emily-johnson",
    role: "CS Student",
    content: "As a beginner, the progressive difficulty helped me build confidence.",
    rating: 5,
    company: "MIT"
  },
  {
    name: "David Kim",
    username: "david-kim",
    role: "Backend Engineer",
    content: "Great mix of real-world tasks and clear explanations.",
    rating: 4,
    company: "Amazon"
  },
  {
    name: "Anita Patel",
    username: "anita-patel",
    role: "Frontend Engineer",
    content: "The challenges kept me consistent every day.",
    rating: 5,
    company: "Microsoft"
  }
]
</script>

<style scoped>
@keyframes testimonial-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-testimonial-scroll {
  animation-name: testimonial-scroll;
  animation-duration: 40s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.hover\:pause-animation:hover {
  animation-play-state: paused;
}
</style>
