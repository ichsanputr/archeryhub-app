<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <Icon :ssr="true" icon="logos:github-icon" class="mx-auto h-12 w-12" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          {{ status === 'loading' ? 'Authenticating...' : status === 'success' ? 'Success!' : 'Error' }}
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          {{ statusMessage }}
        </p>
      </div>
      
      <div v-if="status === 'loading'" class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
      </div>
      
      <div v-if="status === 'success'" class="text-center">
        <button 
          @click="goToHome"
          class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Go to Homepage
        </button>
      </div>
      
      <div v-if="status === 'error'" class="text-center">
        <button 
          @click="retryLogin"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global definePageMeta */
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRuntimeConfig, useHead } from '#app'
import { useAuth } from '#imports'

defineOptions({
  name: 'AuthCallbackPage'
})

definePageMeta({
  layout: 'blank'
})

const config = useRuntimeConfig()

const status = ref('loading')
const statusMessage = ref('Please wait while we sign you in with GitHub')
// setToken is no longer needed with HTTP-only cookies

// This page is hit by GitHub's OAuth redirect
// The actual authentication logic happens on your backend
// and the user gets redirected to home page after successful auth

onMounted(async () => {
  try {
    // Check for OAuth errors in URL
    const urlParams = new URLSearchParams(window.location.search)
    
    if (urlParams.get('error')) {
      status.value = 'error'
      statusMessage.value = `Authentication failed: ${urlParams.get('error_description') || urlParams.get('error')}`
      return
    }
    
    const code = urlParams.get('code')
    if (code) {
      // Exchange code for token - server should set HTTP-only cookie
      try {
        const response = await fetch(`${config.public.apiBaseUrl}/auth/github/exchange?code=${code}&redirect_uri=${window.location.origin}/auth/callback`, {
          method: 'GET',
          credentials: 'include' // Important: include cookies in request
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Server should have set HTTP-only cookie, so we don't need to handle token here
        // Just check if authentication was successful
        if (data.user || data.message === 'Authentication successful') {
          status.value = 'success'
          statusMessage.value = 'Successfully authenticated! Redirecting to homepage...'
          
          // Refresh user state in the auth composable
          const { fetchUser } = useAuth()
          await fetchUser()
          
          // Redirect to homepage after a short delay
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
          return
        } else {
          throw new Error('Authentication failed')
        }
      } catch (error) {
        console.error('Token exchange error:', error)
        status.value = 'error'
        statusMessage.value = 'Failed to exchange authorization code for token.'
        return
      }
    }
    
    // If still on this page after 5 seconds, something might be wrong
    setTimeout(() => {
      if (status.value === 'loading') {
        status.value = 'error'
        statusMessage.value = 'Authentication is taking longer than expected. Please try again.'
      }
    }, 5000)
    
  } catch (error) {
    console.error('Auth callback error:', error)
    status.value = 'error'
    statusMessage.value = 'An unexpected error occurred during authentication.'
  }
})

const goToHome = () => {
  // Navigate to homepage
  window.location.href = '/'
}

const retryLogin = () => {
  // Navigate to homepage
  window.location.href = '/'
}

// Set page title based on status
useHead(() => ({
  title: computed(() => {
    switch (status.value) {
      case 'loading': return 'Authenticating... - BudiBadu'
      case 'success': return 'Authentication Successful - BudiBadu'
      case 'error': return 'Authentication Failed - BudiBadu'
      default: return 'GitHub Authentication - BudiBadu'
    }
  }).value,
  meta: [
    { name: 'description', content: 'GitHub OAuth authentication callback for BudiBadu coding platform' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
}))
</script>
