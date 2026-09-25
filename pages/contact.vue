<template>
  <div class="min-h-screen bg-slate-50 font-body text-navy">
    <!-- Hero Section -->
    <section class="bg-navy relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20 text-white">
      <div class="absolute inset-0 z-0">
        <img src="/hero-homepage.jpeg" alt="Contact Us" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl font-display space-y-3">
          <!-- Breadcrumbs -->
          <div class="flex items-center gap-2 text-xs text-slate-300 font-medium mb-2">
            <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
            <Icon icon="ph:caret-right-bold" class="text-[10px] text-slate-400" />
            <span class="text-primary font-semibold">Contact Us</span>
          </div>
          <h1 class="text-white text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-tight">
            Contact <span class="text-primary">Us</span>
          </h1>
          <p class="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
            Have questions or need help with your tournament? We are here to help.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Form & Information Section (Clean spacious padding without negative overlap) -->
    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div class="lg:col-span-8">
          <div class="bg-white p-6 md:p-10 rounded-3xl shadow-xs border border-slate-200/90 h-full">
            <h2 class="text-lg md:text-2xl font-black text-navy mb-6">Send us a message</h2>
            <form class="space-y-6" @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-bold text-slate-600 tracking-wider mb-2">Your Name <span class="text-rose-500">*</span></label>
                  <input v-model="form.name"
                    @input="validateField('name')"
                    @blur="validateField('name')"
                    :class="errors.name ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-200 bg-slate-50 focus:border-navy focus:bg-white'"
                    class="w-full px-4 py-3 border rounded-xl text-sm text-slate-800 focus:outline-hidden transition-colors placeholder:text-slate-400"
                    placeholder="Enter your full name" type="text" />
                  <p v-if="errors.name" class="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <Icon icon="ph:warning-circle-fill" class="shrink-0 text-sm" />
                    <span>{{ errors.name }}</span>
                  </p>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 tracking-wider mb-2">Email Address <span class="text-rose-500">*</span></label>
                  <input v-model="form.email"
                    @input="validateField('email')"
                    @blur="validateField('email')"
                    :class="errors.email ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-200 bg-slate-50 focus:border-navy focus:bg-white'"
                    class="w-full px-4 py-3 border rounded-xl text-sm text-slate-800 focus:outline-hidden transition-colors placeholder:text-slate-400"
                    placeholder="name@example.com" type="email" />
                  <p v-if="errors.email" class="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                    <Icon icon="ph:warning-circle-fill" class="shrink-0 text-sm" />
                    <span>{{ errors.email }}</span>
                  </p>
                </div>
              </div>
              <div>
                <BaseSelect 
                  v-model="form.subject" 
                  :options="subjectOptions" 
                  label="Subject" 
                  placeholder="Select a topic" 
                  :error="errors.subject"
                  @change="validateField('subject')"
                  required />
                <p v-if="errors.subject" class="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <Icon icon="ph:warning-circle-fill" class="shrink-0 text-sm" />
                  <span>{{ errors.subject }}</span>
                </p>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-600 tracking-wider mb-2">Message <span class="text-rose-500">*</span></label>
                <textarea v-model="form.message"
                  @input="validateField('message')"
                  @blur="validateField('message')"
                  :class="errors.message ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500' : 'border-slate-200 bg-slate-50 focus:border-navy focus:bg-white'"
                  class="w-full px-4 py-3 border rounded-xl text-sm text-slate-800 focus:outline-hidden transition-colors placeholder:text-slate-400 resize-none"
                  placeholder="How can we help you?" rows="5"></textarea>
                <p v-if="errors.message" class="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <Icon icon="ph:warning-circle-fill" class="shrink-0 text-sm" />
                  <span>{{ errors.message }}</span>
                </p>
              </div>
              <div class="pt-2">
                <button
                  class="w-full md:w-auto bg-primary hover:bg-primary-hover text-navy px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                  type="submit" :disabled="loading">
                  <span>{{ loading ? 'Sending...' : 'Send Message' }}</span>
                  <Icon icon="ph:paper-plane-tilt-bold" class="text-lg" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="bg-navy rounded-3xl shadow-sm p-8 relative overflow-hidden text-white border border-navy">
            <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Icon icon="ph:globe-hemisphere-west-bold" class="text-9xl" />
            </div>
            <h3 class="font-black text-lg md:text-xl mb-6 relative z-10 text-white">Contact Information</h3>
            <div class="space-y-6 relative z-10">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon icon="ph:map-pin-fill" class="text-primary text-lg" />
                </div>
                <div>
                  <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-1">Headquarters</h4>
                  <p class="text-white leading-relaxed text-xs md:text-sm">
                    Gelora Bung Karno Sports Complex<br />
                    Jl. Pintu Satu Senayan<br />
                    Central Jakarta, DKI Jakarta 10270
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon icon="ph:envelope-simple-fill" class="text-primary text-lg" />
                </div>
                <div>
                  <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-1">Email Support</h4>
                  <a class="text-white hover:text-primary transition-colors text-xs md:text-sm font-medium"
                    href="mailto:admin@archeris.net">admin@archeris.net</a>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Icon icon="ph:phone-fill" class="text-primary text-lg" />
                </div>
                <div>
                  <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-1">Phone</h4>
                  <a class="text-white hover:text-primary transition-colors text-xs md:text-sm font-medium"
                    href="tel:+62215758888">+62 21 575 8888</a>
                  <div class="text-xs text-slate-400 mt-1">Monday-Friday, 09:00 - 17:00 WIB</div>
                </div>
              </div>
            </div>
            <div class="mt-8 pt-8 border-t border-white/10 relative z-10">
              <h4 class="text-xs md:text-sm font-black text-slate-300 tracking-wide mb-4">Follow Us</h4>
              <div class="flex gap-4">
                <a href="https://www.instagram.com/archerisnet/" target="_blank" rel="noopener noreferrer"
                  class="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-navy transition-all flex items-center justify-center group"
                  aria-label="Instagram">
                  <Icon icon="ph:instagram-logo-bold" class="text-xl" />
                </a>
                <a href="https://www.threads.com/@archerisnet" target="_blank" rel="noopener noreferrer"
                  class="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-navy transition-all flex items-center justify-center group"
                  aria-label="Threads">
                  <Icon icon="ph:threads-logo-bold" class="text-xl" />
                </a>
                <a href="https://www.facebook.com/archerisnet/" target="_blank" rel="noopener noreferrer"
                  class="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary hover:text-navy transition-all flex items-center justify-center group"
                  aria-label="Facebook">
                  <Icon icon="ph:facebook-logo-bold" class="text-xl" />
                </a>
              </div>
            </div>
          </div>
          <div class="bg-white p-6 rounded-3xl shadow-xs border border-slate-200/90">
            <h3 class="font-black text-lg text-navy mb-2 flex items-center gap-2">
              <Icon icon="ph:question-bold" class="text-primary text-xl" />
              Quick Help
            </h3>
            <p class="text-xs text-slate-500 mb-3 leading-relaxed">Looking for frequently asked questions or technical guides? Visit our Documentation for instant answers.</p>
            <NuxtLink to="/docs"
              class="text-xs font-bold text-navy hover:text-primary-hover transition-colors flex items-center gap-1">
              <span>Visit Documentation</span>
              <Icon icon="ph:arrow-right-bold" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'landing'
})

const loading = ref(false)
const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'tech', label: 'Technical Issue' },
  { value: 'partnership', label: 'Partnership' }
]

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const validateField = (field) => {
  if (field === 'name') {
    if (!form.name || !form.name.trim()) {
      errors.name = 'Please enter your full name.'
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long.'
    } else {
      errors.name = ''
    }
  }

  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.email || !form.email.trim()) {
      errors.email = 'Please enter your email address.'
    } else if (!emailRegex.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).'
    } else {
      errors.email = ''
    }
  }

  if (field === 'subject') {
    if (!form.subject) {
      errors.subject = 'Please select a topic/subject.'
    } else {
      errors.subject = ''
    }
  }

  if (field === 'message') {
    if (!form.message || !form.message.trim()) {
      errors.message = 'Please enter your message.'
    } else if (form.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.'
    } else {
      errors.message = ''
    }
  }
}

const validateAll = () => {
  validateField('name')
  validateField('email')
  validateField('subject')
  validateField('message')
  return !errors.name && !errors.email && !errors.subject && !errors.message
}

const { post } = useApi()
const toast = useToast()

const handleSubmit = async () => {
  if (!validateAll()) {
    toast.error('Please check and fill in all required fields correctly.')
    return
  }

  loading.value = true
  try {
    await post('/contact', {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject,
      message: form.message.trim()
    })

    toast.success('Thank you! Your message has been sent.')
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
    errors.name = ''
    errors.email = ''
    errors.subject = ''
    errors.message = ''
  } catch (error) {
    console.error('Failed to send message:', error)
    toast.error('Failed to send message. Please try again later.')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Contact Support - Archeris',
  link: [
    { rel: 'canonical', href: useRequestURL().href }
  ],
  script: [
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
            'name': 'Contact Us',
            'item': 'https://archeris.net/contact'
          }
        ]
      })
    }
  ]
})

useSeoMeta({
  title: 'Contact Support - Archeris',
  description: 'Get in touch with the Archeris team for tournament scoring support, technical inquiries, and certified scorekeeper onboarding.',
  ogTitle: 'Contact Support - Archeris',
  ogDescription: 'Get in touch with the Archeris team for tournament scoring support, technical inquiries, and certified scorekeeper onboarding.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
</script>

<style scoped></style>
