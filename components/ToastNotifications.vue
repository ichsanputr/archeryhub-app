<script setup>
import { Icon } from '@iconify/vue'

// Define component name to fix linter error
defineOptions({
  name: 'ToastNotifications'
})

const { toasts, removeToast } = useToast()

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return 'ph:check-circle'
    case 'error':
      return 'ph:warning-circle'
    case 'warning':
      return 'ph:warning'
    case 'info':
    default:
      return 'ph:info'
  }
}

const getToastClasses = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200 text-green-800'
    case 'error':
      return 'bg-red-50 border-red-200 text-red-800'
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200 text-blue-800'
  }
}

const getIconClasses = (type) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    case 'info':
    default:
      return 'text-blue-500'
  }
}
</script>

<template>
  <!-- Toast Container -->
  <Teleport to="body">
    <div class="fixed top-4 right-4 !z-[9999999] space-y-2 max-w-sm">
      <TransitionGroup name="toast" tag="div" class="space-y-2">
        <div v-for="toast in toasts" :key="toast.id" :class="[
          'flex items-center p-4 rounded-lg border shadow-lg transition-all duration-300',
          getToastClasses(toast.type)
        ]">
          <div>
            <Icon :ssr="true" :icon="getToastIcon(toast.type)"
              :class="['w-5 h-5 mr-3 flex-shrink-0', getIconClasses(toast.type)]" />
          </div>
          <div class="flex-1 text-sm font-medium">{{ toast.message }}</div>
          <div class="flex items-center space-x-2">
            <!-- Action Button -->
            <button v-if="toast.action" @click="toast.action.onClick"
              class="px-3 py-1 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
              {{ toast.action.label }}
            </button>
            <!-- Close Button -->
            <button @click="removeToast(toast.id)" class="text-gray-400 ml-2 hover:text-gray-600 transition-colors">
              <Icon :ssr="true" icon="ph:x" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
