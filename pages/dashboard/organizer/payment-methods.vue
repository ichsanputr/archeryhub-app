<script setup>
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/dashboard/organizer/bank-accounts', { redirectCode: 301 })
    }
  ]
})
</script>
