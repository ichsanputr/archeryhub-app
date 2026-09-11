<script setup>
useHead({
  title: 'Metode Pembayaran - Archeris Dashboard'
})

definePageMeta({
  middleware: [
    function () {
      return navigateTo('/dashboard/organizer/bank-accounts', { redirectCode: 301 })
    }
  ]
})
</script>
