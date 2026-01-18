<template>
  <div class="min-h-screen py-10">
    <Container>
      <!-- Header Section -->
      <section
        class="mb-12 relative overflow-hidden rounded-3xl border border-yellow-100 bg-gradient-to-br from-yellow-50 via-white to-orange-50">
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
        <div class="absolute top-20 right-20 h-20 w-20 rounded-full bg-yellow-300/30 blur-2xl"></div>
        <div class="relative p-8 sm:p-12">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white/80 px-4 py-2 text-sm text-yellow-700 shadow-sm backdrop-blur">
            <Icon icon="ph:chat-circle-dots" class="w-4 h-4" />
            Get in touch
          </div>
          <h1 class="mt-6 text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            We'd love to
            <span
              class="bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent">hear
              from you</span>
          </h1>
          <p class="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl">
            Questions, feedback, or partnership ideas? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <!-- Content -->
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Contact Form - Takes 2 columns -->
        <section class="lg:col-span-2">
          <div class="rounded-3xl border border-yellow-100 bg-white p-8 sm:p-10 shadow-sm">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <div class="space-y-3 text-gray-600">
                <p>Fill out the form below and we'll get back to you within 24 hours.</p>
                <p>Whether you're reporting a bug, suggesting a feature, or just want to share your thoughts about
                  Archeryhub.id, we value your input. Our team reviews every message carefully and strives to provide
                  helpful, personalized responses.</p>
                <p>For urgent technical issues or time-sensitive inquiries, please include "URGENT" in your subject
                  line, and we'll prioritize your message. For general questions or feedback, you can expect a response
                  within one business day.</p>
                <p>We're committed to building the best archery tournament management platform, and your feedback helps
                  us improve. Thank you for taking the time to reach out!</p>
              </div>
            </div>

            <form class="space-y-6">
              <div class="grid sm:grid-cols-2 gap-6">
                <div>
                  <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input id="name" name="name" type="text" required placeholder="John Doe"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-200" />
                </div>
                <div>
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input id="email" name="email" type="email" required placeholder="john@example.com"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-200" />
                </div>
              </div>

              <div>
                <label for="subject" class="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <select id="subject" name="subject" required
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-200">
                  <option value="">Select a topic</option>
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="partnership">Partnership</option>
                  <option value="support">Technical Support</option>
                </select>
              </div>

              <div>
                <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea id="message" name="message" rows="6" required placeholder="Tell us more about your inquiry..."
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 focus:outline-none transition-all duration-200 resize-none"></textarea>
              </div>

              <div class="flex items-start gap-3">
                <input type="checkbox" name="agree" required
                  class="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500" />
                <label class="text-sm text-gray-600">
                  I agree to the <a href="/privacy" class="text-yellow-600 hover:text-yellow-700 underline">privacy
                    policy</a>
                  and <a href="/terms" class="text-yellow-600 hover:text-yellow-700 underline">terms of service
                  </a>.
                </label>
              </div>

              <button type="submit"
                class="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105">
                <Icon icon="ph:paper-plane-tilt" class="w-5 h-5 mr-2 inline" />
                Send Message
              </button>
            </form>
          </div>
        </section>

        <!-- Contact Information Sidebar -->
        <aside class="lg:col-span-1 space-y-6">
          <!-- Contact Methods -->
          <div class="rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="ph:address-book" class="w-5 h-5 text-yellow-600" />
              Contact Information
            </h3>

            <div class="space-y-4">
              <a href="mailto:hello@archeryhub.id"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 transition-colors group">
                <div
                  class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <Icon icon="ph:envelope" class="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Email</div>
                  <div class="text-sm text-gray-600">hello@archeryhub.id</div>
                </div>
              </a>

              <a href="https://github.com/ichsanputr" target="_blank"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 transition-colors group">
                <div
                  class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <Icon icon="ph:github-logo" class="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">GitHub</div>
                  <div class="text-sm text-gray-600">@ichsanputr</div>
                </div>
              </a>

              <a href="https://twitter.com/archeryhub" target="_blank"
                class="flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-50 transition-colors group">
                <div
                  class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <Icon icon="ph:twitter-logo" class="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">Twitter</div>
                  <div class="text-sm text-gray-600">@archeryhub</div>
                </div>
              </a>
            </div>
          </div>

          <!-- Quick Help -->
          <div class="rounded-3xl border border-yellow-100 bg-white p-6 shadow-sm">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Icon icon="ph:question" class="w-5 h-5 text-yellow-600" />
              Why reach out?
            </h3>

            <ul class="space-y-3 text-sm !list-disc !list-inside text-gray-600">
              <li class="flex items-start gap-2">
                Report a bug or technical issue
              </li>
              <li class="flex items-start gap-2">
                Suggest new features or improvements
              </li>
              <li class="flex items-start gap-2">
                Discuss partnerships or collaborations
              </li>
              <li class="flex items-start gap-2">
                Ask about our platform and roadmap
              </li>
              <li class="flex items-start gap-2">
                Educational institution partnerships
              </li>
            </ul>
          </div>

        </aside>
      </div>
    </Container>
  </div>
</template>

<script setup>
import Container from '~/components/Container.vue'
import { Icon } from '@iconify/vue'

// Use landing layout
definePageMeta({
  layout: 'landing'
})

// Set page meta
const route = useRoute()
useHead({
  title: 'Contact - Archery Hub Tournament Manager',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with the Archery Hub team. We\'d love to hear your feedback, suggestions, and questions.'
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
