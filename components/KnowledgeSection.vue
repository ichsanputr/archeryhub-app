<template>
  <!-- Knowledge & Learning Philosophy Section -->
  <section class="py-20 bg-gradient-to-b from-white to-gray-50">
    <Container>
      <div class="max-w-5xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-2xl sm:text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Why Problem-Solving Skills Define 
            <span class="bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
              Great Programmers
            </span>
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            Understanding why algorithmic thinking and problem decomposition are the cornerstone of successful programming careers
          </p>
        </div>

        <!-- Knowledge Content -->
        <div class="space-y-12">
          <!-- Problem-Solving as Core Skill -->
          <div class="prose prose-lg max-w-none">
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
              Learning Programming Through Problem-Solving
            </h3>
            <p class="text-gray-700 leading-relaxed mb-6">
              Programming is fundamentally about solving problems. Unlike memorizing syntax or frameworks, problem-solving 
              skills transfer across languages, technologies, and domains. When you learn to break down complex challenges 
              into manageable pieces, identify patterns, and construct elegant solutions, you're developing the core mental 
              models that distinguish exceptional programmers from code copiers.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Every programming challenge teaches you to think systematically: analyze requirements, consider edge cases, 
              optimize for efficiency, and write maintainable code. These aren't just academic exercises—they're the exact 
              thinking patterns you'll use when building real applications, debugging production issues, and architecting 
              scalable systems in your professional career.
            </p>
          </div>

          <!-- Technical Interviews and Industry Standards -->
          <div class="prose prose-lg max-w-none">
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
              Why Tech Companies Test Problem-Solving Abilities
            </h3>
            <p class="text-gray-700 leading-relaxed mb-6">
              Google, Facebook, Amazon, Netflix, and virtually every tech company use algorithmic challenges in their 
              interview process—not because they want you to implement sorting algorithms daily, but because these problems 
              reveal how you think under pressure, approach unfamiliar challenges, and communicate your reasoning process.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Technical interviews assess whether you can decompose problems methodically, optimize solutions iteratively, 
              and handle complexity gracefully. Companies know that developers who excel at problem-solving adapt quickly 
              to new technologies, debug issues efficiently, and contribute to architectural decisions that scale. The 
              algorithm is just the medium—the real test is your analytical thinking and problem-solving methodology.
            </p>
          </div>

          <!-- Cognitive Benefits -->
          <div class="prose prose-lg max-w-none">
            <h3 class="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <div class="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              The Cognitive Science Behind Coding Challenges
            </h3>
            <p class="text-gray-700 leading-relaxed mb-6">
              Research in cognitive psychology shows that regular problem-solving practice strengthens pattern recognition, 
              working memory, and abstract reasoning—the exact cognitive abilities that correlate with programming expertise. 
              When you solve diverse algorithmic challenges, you're literally rewiring your brain to recognize common 
              computational patterns and apply them in novel contexts.
            </p>
            <p class="text-gray-700 leading-relaxed">
              This explains why experienced developers can quickly understand unfamiliar codebases, spot optimization 
              opportunities, and design elegant solutions. They've internalized thousands of problem-solving patterns 
              through deliberate practice, creating a mental library of approaches they can draw from when facing 
              new challenges in their daily work.
            </p>
          </div>
        </div>

        <!-- Learning Philosophy Quote -->
        <div class="mt-16 text-center">
          <blockquote class="text-xl sm:text-2xl font-medium text-gray-800 italic max-w-4xl mx-auto">
            "Most good programmers do programming not because they expect to get paid, but because it is fun to program."
          </blockquote>
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-sm text-gray-500">
                – Linus Torvalds, Creator of Linux
            </p>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import Container from '~/components/Container.vue'
</script>