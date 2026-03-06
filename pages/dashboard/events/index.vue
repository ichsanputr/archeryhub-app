<script setup>
const { user } = useAuth()
const role = user.value?.role || user.value?.user_type || 'archer'
const target = `/dashboard/${role}/events`
await navigateTo(target)
</script>
