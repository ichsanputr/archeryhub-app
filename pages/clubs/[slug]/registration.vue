<script setup>
const route = useRoute()

await navigateTo(`/clubs/${route.params.slug}/daftar`, {
  redirectCode: 301,
})
</script>
