import { defineNuxtPlugin } from '#app'
import { Icon } from '@iconify/vue'

export default defineNuxtPlugin((nuxtApp) => {
  // Global registration is now handled by components/Icon.client.vue
  // to ensure icons only render on the client and avoid SSR blank issues.
  // nuxtApp.vueApp.component('Icon', Icon)
})
