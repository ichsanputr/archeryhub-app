<template>
    <div>
        <div v-if="loading" class="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div class="size-12 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center animate-pulse">
                <Icon icon="ph:book-bookmark-bold" class="text-2xl text-navy animate-spin" />
            </div>
            <div class="text-xs font-bold text-slate-400">Memuat artikel dokumentasi...</div>
        </div>

        <div v-else-if="error" class="bg-white p-12 rounded-3xl border border-red-100 text-center space-y-4 max-w-md mx-auto">
            <div class="size-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto text-2xl">
                <Icon icon="ph:warning-circle-bold" />
            </div>
            <h3 class="text-lg font-black text-navy">Dokumen Tidak Ditemukan</h3>
            <p class="text-xs text-slate-500">Artikel dokumentasi yang Anda cari tidak ditemukan atau telah dihapus.</p>
            <NuxtLink to="/dashboard/root/docs">
                <BaseButton variant="primary" icon="ph:arrow-left-bold">
                    Kembali ke Daftar Dokumen
                </BaseButton>
            </NuxtLink>
        </div>

        <DocEditor v-else :initial-doc="doc" :is-edit="true" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import DocEditor from '~/components/dashboard/DocEditor.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const route = useRoute()
const toast = useToast()
const { get } = useApi()

const loading = ref(true)
const error = ref(false)
const doc = ref(null)

const fetchDoc = async () => {
    loading.value = true
    error.value = false
    try {
        const slug = route.params.slug
        const res = await get(`/root/dashboard/docs/${slug}`)
        if (res) {
            doc.value = res
        } else {
            error.value = true
        }
    } catch (err) {
        console.error('Fetch doc detail failed:', err)
        error.value = true
        toast.error('Gagal memuat detail dokumentasi')
    } finally {
        loading.value = false
    }
}

useHead({
    title: computed(() => doc.value ? `Edit ${doc.value.id?.title || doc.value.en?.title || doc.value.slug} - Archeris Root` : 'Edit Dokumen - Archeris Root')
})

onMounted(() => {
    fetchDoc()
})
</script>
