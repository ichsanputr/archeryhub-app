<script setup>
const { user } = useAuth()
const role = user.value?.role || user.value?.user_type || 'archer'
const target = role === 'archer' ? '/dashboard/archer' : `/dashboard/${role}/news/create`
await navigateTo(target, { replace: true })
</script>
