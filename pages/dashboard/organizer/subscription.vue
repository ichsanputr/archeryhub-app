<script setup>
useHead({
  title: 'Langganan Penyelenggara - Archeris Dashboard'
})

definePageMeta({
  middleware: [
    function () {
      return navigateTo('/dashboard/organizer/package', { redirectCode: 301 })
    }
  ]
})
</script>
