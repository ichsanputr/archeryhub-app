import type { DirectiveBinding } from 'vue'

interface ClickOutsideElement extends HTMLElement {
  __clickOutsideHandler__?: (event: MouseEvent | TouchEvent) => void
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click-outside', {
    mounted(el: ClickOutsideElement, binding: DirectiveBinding) {
      el.__clickOutsideHandler__ = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node | null
        if (!target) return
        
        // If click occurred inside the element, do nothing
        if (el === target || el.contains(target)) {
          return
        }
        
        // If click occurred outside, trigger the bound handler
        if (typeof binding.value === 'function') {
          binding.value(event)
        }
      }

      // Use capture: true so clicks on buttons or inside sub-frames still trigger outside detection
      document.addEventListener('click', el.__clickOutsideHandler__, true)
      document.addEventListener('touchstart', el.__clickOutsideHandler__, true)
    },
    unmounted(el: ClickOutsideElement) {
      if (el.__clickOutsideHandler__) {
        document.removeEventListener('click', el.__clickOutsideHandler__, true)
        document.removeEventListener('touchstart', el.__clickOutsideHandler__, true)
        delete el.__clickOutsideHandler__
      }
    }
  })
})
