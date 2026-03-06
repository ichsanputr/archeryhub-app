<script setup>
const { user } = useAuth()
const route = useRoute()
const role = user.value?.role || user.value?.user_type || 'archer'
const target = role === 'club' ? '/dashboard/club/subscription/payment' : '/dashboard/organization/subscription/payment'
await navigateTo({ path: target, query: route.query })
</script>
