<script setup>
const { user } = useAuth()
const role = user.value?.role || user.value?.user_type || 'archer'
const target = role === 'club' ? '/dashboard/club/subscription' : '/dashboard/organization/subscription'
await navigateTo(target)
</script>
