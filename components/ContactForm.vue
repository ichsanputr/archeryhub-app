<template>
  <div class="max-w-xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6" novalidate>
      <input 
        type="hidden" 
        name="access_key" 
        value="5d7de956-fd19-451b-a5b6-72b85a64f71e" 
      />
      
      <div>
        <label 
          for="name" 
          class="block text-sm font-medium text-primary mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          v-model="formData.name"
          placeholder="Your Name"
          class="w-full px-4 py-3 bg-surface border border-themed rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-primary placeholder-muted transition-all duration-300"
          required
        />
      </div>
      
      <div>
        <label 
          for="email" 
          class="block text-sm font-medium text-primary mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="formData.email"
          placeholder="your@email.com"
          class="w-full px-4 py-3 bg-surface border border-themed rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-primary placeholder-muted transition-all duration-300"
          required
        />
      </div>
      
      <div>
        <label 
          for="message" 
          class="block text-sm font-medium text-primary mb-2"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          v-model="formData.message"
          placeholder="Your message..."
          rows="5"
          class="w-full px-4 py-3 bg-surface border border-themed rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-primary placeholder-muted transition-all duration-300 resize-none"
          required
        ></textarea>
      </div>
      
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Icon 
          v-if="isSubmitting"
          name="mdi:loading" 
          class="animate-spin w-4 h-4" 
        />
        {{ isSubmitting ? 'Sending...' : 'Send Message' }}
      </button>
      
      <div 
        v-if="result"
        :class="[
          'p-4 rounded-lg text-center font-medium',
          result.includes('✅') 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : result.includes('❌')
            ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
        ]"
      >
        {{ result }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Icon } from '@iconify/vue'

const isSubmitting = ref(false)
const result = ref('')
const formData = reactive({
  name: '',
  email: '',
  message: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  result.value = 'Sending...'

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '5d7de956-fd19-451b-a5b6-72b85a64f71e',
        ...formData
      })
    })

    const data = await response.json()

    if (data.success) {
      result.value = '✅ Form submitted successfully!'
      formData.name = ''
      formData.email = ''
      formData.message = ''
    } else {
      console.error('Error:', data)
      result.value = '❌ Something went wrong!'
    }
  } catch (error) {
    console.error('Error:', error)
    result.value = '❌ Something went wrong!'
  } finally {
    isSubmitting.value = false
    setTimeout(() => result.value = '', 5000)
  }
}
</script>
