<template>
    <div class="flex flex-col gap-8 max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/organization" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink to="/dashboard/organization/news" class="hover:text-primary transition-colors">Berita</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Buat Baru</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Buat Berita Baru</h1>
                <p class="text-gray-500 font-medium mt-1">Tulis dan publikasikan berita untuk organisasi Anda.</p>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <form @submit.prevent="submitNews">
                <!-- Featured Image Upload -->
                <div class="p-8 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:image" class="text-primary" />
                        Gambar Utama
                    </h3>
                    <div class="relative h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer overflow-hidden"
                        @click="openMediaLibrary">
                        <img v-if="form.imageURL" :src="form.imageURL" class="w-full h-full object-cover" />
                        <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <div class="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Icon icon="ph:image-bold" class="text-3xl text-gray-400" />
                            </div>
                            <div class="text-center">
                                <p class="font-bold text-navy">Klik untuk pilih gambar</p>
                                <p class="text-sm text-gray-400">Pilih dari library atau upload baru</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Media Library Modal -->
                <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />

                <!-- Basic Info -->
                <div class="p-8 border-b border-gray-100 space-y-6">
                    <h3 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:info" class="text-primary" />
                        Informasi Berita
                    </h3>

                    <BaseInput v-model="form.title" label="Judul Berita"
                        placeholder="Masukkan judul berita yang menarik..." required />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseSelect v-model="form.category" :items="categoryOptions" label="Kategori" required />
                        <BaseSelect v-model="form.status" :items="statusOptions" label="Status Publikasi" required />
                    </div>

                    <BaseInput v-model="form.tags" label="Tags" placeholder="Contoh: event, turnamen, sleman"
                        icon="ph:tag" />

                    <div>
                        <label class="block text-xs font-bold text-navy  tracking-wider mb-2">
                            Kutipan Singkat
                        </label>
                        <textarea v-model="form.excerpt"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows="3"
                            placeholder="Tulis ringkasan singkat berita (akan ditampilkan di preview)..."></textarea>
                    </div>
                </div>

                <!-- Content Editor -->
                <div class="p-8 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:text-aa" class="text-primary" />
                        Konten Berita
                    </h3>
                    <TiptapEditor v-model="form.content" placeholder="Tulis konten berita Anda di sini..." />
                </div>

                <!-- Actions -->
                <div class="p-8 bg-gray-50/50 flex items-center justify-between gap-4">
                    <NuxtLink to="/dashboard/organization/news">
                        <BaseButton variant="white" icon="ph:arrow-left">
                            Kembali
                        </BaseButton>
                    </NuxtLink>
                    <div class="flex items-center gap-3">
                        <BaseButton variant="outline" type="button" icon="ph:eye" @click="previewNews">
                            Preview
                        </BaseButton>
                        <BaseButton variant="gold" type="submit" icon="ph:paper-plane-tilt" :loading="isSubmitting">
                            {{ form.status === 'published' ? 'Publikasikan' : 'Simpan Draft' }}
                        </BaseButton>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({
    title: 'Buat Berita',
    layout: 'dashboard'
})

useHead({
    title: 'Buat Berita - Archeris Dashboard'
})

const { post } = useApi()
const router = useRouter()
const toast = useToast()
const { t } = useDashboardI18n()
const isSubmitting = ref(false)
const showMediaLibrary = ref(false)

const form = ref({
    title: '',
    category: 'pengumuman',
    status: 'draft',
    tags: '',
    excerpt: '',
    content: '',
    imageURL: '',
    metaTitle: '',
    metaDescription: ''
})

const openMediaLibrary = () => {
    showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
    form.value.imageURL = media.url
    showMediaLibrary.value = false
}

const categoryOptions = [
    { title: 'Event', value: 'event' },
    { title: 'Pengumuman', value: 'pengumuman' },
    { title: 'Prestasi', value: 'prestasi' },
    { title: 'Lainnya', value: 'lainnya' }
]

const statusOptions = [
    { title: 'Draft', value: 'draft' },
    { title: 'Publik', value: 'published' }
]

const previewNews = () => {
    toast.info(t('organization.news.form.preview', 'Preview'))
}

const submitNews = async () => {
    if (!form.value.title) {
        toast.error(t('organization.news.form.toast_title_required', 'Judul berita wajib diisi'))
        return
    }

    isSubmitting.value = true

    try {
        const payload = {
            title: form.value.title,
            excerpt: form.value.excerpt,
            content: form.value.content,
            image_url: form.value.imageURL,
            category: form.value.category,
            tags: form.value.tags,
            status: form.value.status,
            meta_title: form.value.metaTitle,
            meta_description: form.value.metaDescription
        }

        await post('/news', payload)

        toast.success(form.value.status === 'published'
            ? t('organization.news.form.toast_create_ok_published', 'Berita berhasil dipublikasikan!')
            : t('organization.news.form.toast_create_ok_draft', 'Draft berhasil disimpan!'))
        router.push('/dashboard/organization/news')
    } catch (error) {
        toast.error(t('organization.news.form.toast_create_failed', 'Gagal menyimpan berita'))
    } finally {
        isSubmitting.value = false
    }
}
</script>
