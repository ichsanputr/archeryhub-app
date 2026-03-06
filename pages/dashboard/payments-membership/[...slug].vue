<script setup>
const route = useRoute()
const slug = route.params.slug
const subPath = Array.isArray(slug) ? slug.join('/') : slug || ''
const target = subPath ? `/dashboard/club/payments-membership/${subPath}` : '/dashboard/club/payments-membership'
await navigateTo(target, { replace: true })
</script>
