<script setup>
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'

defineOptions({
  name: 'LoginRequired'
})

const { login } = useAuth()

defineProps({
  title: {
    type: String,
    default: 'Login Required'
  },
  message: {
    type: String,
    default: 'Please log in to access this feature and track your progress.'
  },
  icon: {
    type: String,
    default: 'ph:user-circle'
  },
  primaryAction: {
    type: String,
    default: 'Login with GitHub'
  },
  secondaryAction: {
    type: String,
    default: 'Go to Homepage'
  },
  secondaryRoute: {
    type: String,
    default: '/'
  },
  primaryIcon: {
    type: String,
    default: 'logos:github-icon'
  },
  secondaryIcon: {
    type: String,
    default: 'ph:code'
  }
})
</script>

<template>
  <div class="flex justify-center items-center min-h-[420px] py-12">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto w-full">
      <div class="flex flex-col items-center text-center">
        <div class="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white px-3 py-1 text-sm text-yellow-700 shadow-sm mb-5">
          <Icon :ssr="true" :icon="icon" class="w-4 h-4" />
          <span>Authentication Required</span>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
        <p class="text-gray-600 mb-6">{{ message }}</p>
        <div class="flex flex-col gap-3 w-full">
          <button
            @click="login"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors w-full"
          >
            <img
              v-if="primaryIcon === 'logos:github-icon'"
              src="/github-light.svg"
              alt="GitHub"
              class="w-4 h-4"
            />
            <Icon
              v-else
              :ssr="true"
              :icon="primaryIcon"
              class="w-4 h-4"
            />
            {{ primaryAction }}
          </button>
          <a :href="secondaryRoute" class="w-full">
            <button class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors w-full">
              <Icon :ssr="true" :icon="secondaryIcon" class="w-4 h-4" />
              {{ secondaryAction }}
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
