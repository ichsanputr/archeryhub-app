<script setup>
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/dashboard/organizer/package', { redirectCode: 301 })
    }
  ]
})
</script>
