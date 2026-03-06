<script setup>
const { user } = useAuth()
const route = useRoute()
const role = user.value?.role || user.value?.user_type || 'archer'
const slug = route.params.slug
const target = role === 'archer' ? '/dashboard/archer' : `/dashboard/${role}/news/${slug}/edit`
await navigateTo(target, { replace: true })
</script>
