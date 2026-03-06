<script setup>
const { user } = useAuth()
const route = useRoute()
const role = user.value?.role || user.value?.user_type || 'archer'
const slug = route.params.slug
const subPath = Array.isArray(slug) ? slug.join('/') : slug || ''
const target = role === 'archer' ? '/dashboard/archer' : `/dashboard/${role}/news/${subPath}`
await navigateTo(target, { replace: true })
</script>
