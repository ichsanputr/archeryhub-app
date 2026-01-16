<script setup>
import { Icon } from '@iconify/vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  shareText: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'content', // 'content', 'challenge', 'tutorial'
    validator: (value) => ['content', 'challenge', 'tutorial'].includes(value)
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// State for copy button
const copyState = ref('idle') // 'idle', 'copying', 'copied'

// Computed for dialog visibility
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Get current URL if not provided
const currentUrl = computed(() => {
  if (props.url) return props.url
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

// Detect platform from URL or props
const detectedPlatform = computed(() => {
  const url = currentUrl.value
  if (!url) return 'programming'

  // Check for platform in URL path
  const platformMatch = url.match(/\/(rust|python|java|php|javascript|typescript)\//)
  if (platformMatch) {
    return platformMatch[1]
  }

  // Check for platform in subdomain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    const subdomain = hostname.split('.')[0].toLowerCase()
    const platforms = ['rust', 'python', 'java', 'php', 'javascript', 'typescript']
    if (platforms.includes(subdomain)) {
      return subdomain
    }
  }

  return 'programming'
})

// Generate share text based on type and platform
const finalShareText = computed(() => {
  if (props.shareText) return props.shareText

  const platform = detectedPlatform.value
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1)

  const typeTexts = {
    challenge: `Check out this ${platformName} coding challenge: ${props.title}`,
    tutorial: `Learn ${platformName} with this tutorial: ${props.title}`,
    content: `Check this out: ${props.title}`
  }

  return typeTexts[props.type] || typeTexts.content
})

// Dialog title based on type
const dialogTitle = computed(() => {
  const titles = {
    challenge: 'Share This Challenge',
    tutorial: 'Share This Tutorial',
    content: 'Share Content'
  }
  return titles[props.type] || titles.content
})

// Share functionality
const shareOn = (platform) => {
  const url = currentUrl.value
  const title = props.title
  const text = finalShareText.value

  let shareUrl = ''

  switch (platform) {
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      break
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
      break
    case 'reddit':
      shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      break
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
      break
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
      break
    case 'copy':
      copyState.value = 'copying'
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          copyState.value = 'copied'
          setTimeout(() => {
            copyState.value = 'idle'
          }, 2000)
        }).catch(() => {
          // Fallback for older browsers
          fallbackCopyToClipboard(url)
        })
      } else {
        fallbackCopyToClipboard(url)
      }
      return
  }

  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=400')
    showDialog.value = false
  }
}

// H
// Fallback copy function for older browsers
const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.opacity = '0'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand('copy')
    copyState.value = 'copied'
    setTimeout(() => {
      copyState.value = 'idle'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
    copyState.value = 'idle'
  }

  document.body.removeChild(textArea)
}
</script>

<template>
  <v-dialog v-model="showDialog" max-width="500" class="share-dialog rounded-xl" transition="dialog-transition">
    <v-card rounded="lg"
      class="!rounded-xl overflow-hidden bg-white border border-gray-200 dark:bg-[#23272f] dark:border dark:border-gray-700">
      <v-card-title
        class="bg-gradient-to-r from-yellow-500 to-amber-500 text-white dark:bg-gradient-to-r dark:from-[#23272f] dark:to-[#18181b] dark:text-yellow-200">
        <div class="flex items-center justify-between py-2">
          <div class="flex items-center">
            <Icon :ssr="true" icon="ph:share" class="w-6 h-6 mr-3 dark:text-yellow-300" />
            <span class="text-xl font-bold">{{ dialogTitle }}</span>
          </div>
          <button @click="showDialog = false" class="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Icon :ssr="true" icon="ph:x" class="w-5 h-5" />
          </button>
        </div>
      </v-card-title>

      <v-card-text class="p-6 bg-white dark:bg-[#23272f]">
        <div class="text-center mb-6">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ title }}</h3>
          <div class="text-gray-600 text-sm dark:text-gray-300">
            {{ type === 'challenge' ? 'Share this challenge with your friends' :
              type === 'tutorial' ? 'Share this tutorial with your friends' :
                'Share this content with your friends' }}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <!-- Twitter -->
          <button @click="shareOn('twitter')"
            class="flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group dark:border-gray-700 dark:bg-[#23272f] dark:hover:border-blue-400 dark:hover:bg-[#23272f]">
            <Icon :ssr="true" icon="logos:twitter" class="w-6 h-6 mr-3" />
            <span
              class="font-medium text-gray-700 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">Twitter</span>
          </button>

          <!-- Facebook -->
          <button @click="shareOn('facebook')"
            class="flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group dark:border-gray-700 dark:bg-[#23272f] dark:hover:border-blue-600 dark:hover:bg-[#23272f]">
            <Icon :ssr="true" icon="logos:facebook" class="w-6 h-6 mr-3" />
            <span
              class="font-medium text-gray-700 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">Facebook</span>
          </button>

          <!-- LinkedIn -->
          <button @click="shareOn('linkedin')"
            class="flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-700 hover:bg-blue-50 transition-all duration-200 group dark:border-gray-700 dark:bg-[#23272f] dark:hover:border-blue-700 dark:hover:bg-[#23272f]">
            <Icon :ssr="true" icon="logos:linkedin-icon" class="w-6 h-6 mr-3" />
            <span
              class="font-medium text-gray-700 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-400">LinkedIn</span>
          </button>

          <!-- Reddit -->
          <button @click="shareOn('reddit')"
            class="flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 group dark:border-gray-700 dark:bg-[#23272f] dark:hover:border-orange-500 dark:hover:bg-[#23272f]">
            <Icon :ssr="true" icon="logos:reddit-icon" class="w-6 h-6 mr-3" />
            <span
              class="font-medium text-gray-700 group-hover:text-orange-600 dark:text-gray-200 dark:group-hover:text-orange-400">Reddit</span>
          </button>

          <!-- Telegram -->
          <button @click="shareOn('telegram')"
            class="flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group dark:border-gray-700 dark:bg-[#23272f] dark:hover:border-blue-500 dark:hover:bg-[#23272f]">
            <Icon :ssr="true" icon="logos:telegram" class="w-6 h-6 mr-3" />
            <span
              class="font-medium text-gray-700 group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">Telegram</span>
          </button>

          <!-- WhatsApp -->
          <button @click="shareOn('whatsapp')"
            class="flex items-center justify-center p-4 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group dark:border-gray-700 dark:bg-[#23272f] dark:hover:border-green-500 dark:hover:bg-[#23272f]">
            <Icon :ssr="true" icon="logos:whatsapp-icon" class="w-6 h-6 mr-3" />
            <span
              class="font-medium text-gray-700 group-hover:text-green-600 dark:text-gray-200 dark:group-hover:text-green-400">WhatsApp</span>
          </button>
        </div>

        <!-- Copy Link -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button @click="shareOn('copy')" :disabled="copyState === 'copying'"
            class="w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 group" :class="{
              'bg-gray-100 hover:bg-gray-200 dark:bg-[#18181b] dark:hover:bg-[#23272f]': copyState === 'idle',
              'bg-green-100 dark:bg-green-900/20': copyState === 'copied',
              'bg-gray-50 dark:bg-[#18181b] cursor-not-allowed': copyState === 'copying'
            }">
            <Icon :ssr="true"
              :icon="copyState === 'copied' ? 'ph:check' : copyState === 'copying' ? 'ph:spinner' : 'ph:copy'"
              class="w-5 h-5 mr-2 transition-all duration-200" :class="[
                {
                  'text-gray-600 group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-yellow-300': copyState === 'idle',
                  'text-green-600 dark:text-green-400': copyState === 'copied',
                  'text-gray-400 dark:text-gray-500': copyState === 'copying'
                },
                { 'animate-spin': copyState === 'copying' }
              ]" />
            <span class="font-medium transition-all duration-200" :class="{
              'text-gray-700 group-hover:text-gray-800 dark:text-gray-200 dark:group-hover:text-yellow-300': copyState === 'idle',
              'text-green-600 dark:text-green-400': copyState === 'copied',
              'text-gray-400 dark:text-gray-500': copyState === 'copying'
            }">
              {{ copyState === 'copied' ? 'Copied!' : copyState === 'copying' ? 'Copying...' : 'Copy Link' }}
            </span>
          </button>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Dialog Animation */
:deep(.v-dialog) {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease;
}

:deep(.v-overlay--active .v-dialog) {
  animation: scaleIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.share-dialog .v-overlay__content {
  margin: 24px;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .share-dialog .v-overlay__content {
    margin: 12px;
    width: calc(100% - 24px);
  }
}

/* Dark mode overrides */
.dark .share-dialog .v-card {
  background-color: #23272f !important;
  border-color: #333646 !important;
}

.dark .share-dialog .v-card-title {
  background: linear-gradient(90deg, #23272f 0%, #18181b 100%) !important;
  color: #fde68a !important;
}

.dark .share-dialog .v-card-text {
  background-color: #23272f !important;
}

.dark .share-dialog .v-card-actions {
  background-color: #23272f !important;
}

.dark .share-dialog h3 {
  color: #f3f4f6 !important;
}

.dark .share-dialog .text-gray-600 {
  color: #d1d5db !important;
}

.dark .share-dialog .text-gray-700 {
  color: #d1d5db !important;
}

.dark .share-dialog .border-gray-200 {
  border-color: #333646 !important;
}

.dark .share-dialog .bg-gray-100 {
  background-color: #18181b !important;
}

.dark .share-dialog .hover\:bg-gray-200:hover {
  background-color: #23272f !important;
}

.dark .share-dialog .group-hover\:text-gray-800:hover {
  color: #fde68a !important;
}

.dark .share-dialog .group-hover\:text-blue-600:hover {
  color: #60a5fa !important;
}

.dark .share-dialog .group-hover\:text-green-600:hover {
  color: #6ee7b7 !important;
}

.dark .share-dialog .group-hover\:text-orange-600:hover {
  color: #fdba74 !important;
}
</style>
