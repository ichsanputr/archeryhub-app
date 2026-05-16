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
          <span class="text-gray-800">Join</span> <span class="text-gradient">Hundreds of Promoters</span><br>
          <span class="text-gray-800">who manage events with archeris.net</span>
        </h2>
      </div>

      <div class="relative mb-6">
        <div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent">
        </div>
        <div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent">
        </div>
        <div class="overflow-hidden">
          <div class="flex gap-6 animate-testimonial-scroll hover:pause-animation">
            <div v-for="(t, index) in [...testimonials, ...testimonials]" :key="`${t.name}-${index}`"
              class="min-w-[300px] max-w-[300px] glass-card p-6 flex flex-col">
              <div class="flex items-center mb-4">
                <img :src="`https://github.com/${t.username}.png?size=80`" :alt="t.name"
                  class="w-10 h-10 rounded-full mr-3 border-2 border-yellow-500" loading="lazy" />
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
                  <img v-for="star in t.rating" :key="star" src="/star.svg" alt="star" class="w-4 h-4" />
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
    name: "Agus Santoso",
    username: "agus-archery",
    role: "Tournament Director",
    content: "archeris.net has revolutionized how we run our provincial championships. The live results are a game-changer!",
    rating: 5,
    company: "East Java Archery Association"
  },
  {
    name: "Siti Rahayu",
    username: "siti-para",
    role: "National Athlete",
    content: "Checking my rankings and upcoming matches has never been easier. The mobile experience is seamless.",
    rating: 4,
    company: "National Para-Archery Team"
  },
  {
    name: "Budi Pratama",
    username: "budi-pro-archery",
    role: "Club Manager",
    content: "Registration and participant management used to take days. Now it's done in minutes with archeris.net.",
    rating: 5,
    company: "Jakarta Archery Club"
  },
  {
    name: "Dewi Lestari",
    username: "dewi-events",
    role: "Event Organizer",
    content: "The bracket generation and automated scoring saved us so much time during the qualifiers.",
    rating: 4,
    company: "Prime Archery Events"
  },
  {
    name: "Andi Wijaya",
    username: "andi-coach",
    role: "Head Coach",
    content: "Tracking my athletes' performance across multiple tournaments is now data-driven and efficient.",
    rating: 5,
    company: "Elite Archery Academy"
  }
]
</script>

<style scoped>
@keyframes testimonial-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
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

