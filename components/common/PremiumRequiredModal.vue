<template>
    <AppDialog v-model:show="showModal" :title="title" :message="message" :confirm-text="t('premium.upgrade_now')"
        :cancel-text="t('premium.maybe_later')" type="warning" icon="ph:crown-bold" @confirm="handleUpgrade" />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
    feature: {
        type: String,
        default: ''
    }
})

const showModal = defineModel('show')
const router = useRouter()

const title = computed(() => {
    if (props.feature === 'create_event') return t('premium.feature_limited')
    if (props.feature === 'export_data') return t('premium.export_locked')
    if (props.feature === 'active_subscription') return t('premium.subscription_expired')
    if (props.feature === 'member_limit') return t('premium.member_limit_reached')
    if (props.feature === 'analytics') return t('premium.advanced_analytics')
    return t('premium.premium_feature')
})

const message = computed(() => {
    if (props.feature === 'member_limit') return t('premium.msg_member_limit')
    if (props.feature === 'analytics') return t('premium.msg_analytics')
    const base = t('premium.msg_base')
    if (props.feature === 'create_event') return `${base} ${t('premium.msg_create_event')}`
    if (props.feature === 'export_data') return `${base} ${t('premium.msg_export_data')}`
    return base
})

const handleUpgrade = () => {
    showModal.value = false
    router.push('/dashboard/subscription')
}
</script>
