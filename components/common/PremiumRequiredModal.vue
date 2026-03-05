<template>
    <AppDialog v-model:show="showModal" :title="title" :message="message" confirm-text="Upgrade Sekarang"
        cancel-text="Nanti Saja" type="warning" icon="ph:crown-bold" @confirm="handleUpgrade" />
</template>

<script setup>
const props = defineProps({
    feature: {
        type: String,
        default: ''
    }
})

const showModal = defineModel('show')
const router = useRouter()

const title = computed(() => {
    if (props.feature === 'create_event') return 'Fitur Dibatasi'
    if (props.feature === 'export_data') return 'Export Data Terkunci'
    if (props.feature === 'active_subscription') return 'Paket Kedaluwarsa'
    if (props.feature === 'member_limit') return 'Limit Anggota Tercapai'
    if (props.feature === 'analytics') return 'Analitik Lanjutan'
    return 'Fitur Premium'
})

const message = computed(() => {
    if (props.feature === 'member_limit') return 'Klub Anda telah mencapai batas maksimal anggota untuk paket saat ini. Upgrade ke paket Elite untuk anggota tak terbatas.'
    if (props.feature === 'analytics') return 'Fitur analitik dan statistik tingkat lanjut hanya tersedia pada paket Elite. Pantau performa dengan data lebih mendalam.'

    const base = 'Masa berlaku paket langganan Anda telah berakhir. Upgrade atau perpanjang paket untuk mengaktifkan kembali fitur ini.'
    if (props.feature === 'create_event') return `${base} Buat event baru dan kelola pendaftaran tanpa hambatan.`
    if (props.feature === 'export_data') return `${base} Tarik data peserta ke format CSV/Excel dengan mudah.`
    return base
})

const handleUpgrade = () => {
    showModal.value = false
    router.push('/dashboard/subscription')
}
</script>
