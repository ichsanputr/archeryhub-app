<template>
    <div class="flex flex-col gap-8 max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink to="/dashboard/news" class="hover:text-primary transition-colors">Berita</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Edit</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Edit Berita</h1>
                <p class="text-gray-500 font-medium mt-1">Perbarui konten berita Anda.</p>
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
                                <Icon icon="ph:upload-simple" class="text-3xl text-gray-400" />
                            </div>
                            <div class="text-center">
                                <p class="font-bold text-navy">Klik untuk pilih gambar</p>
                                <p class="text-sm text-gray-400">Pilih dari library atau upload baru</p>
                            </div>
                        </div>
                    </div>
                </div>

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
                    <NuxtLink to="/dashboard/news">
                        <BaseButton variant="white" icon="ph:arrow-left">
                            Batal
                        </BaseButton>
                    </NuxtLink>
                    <div class="flex items-center gap-3">
                        <BaseButton variant="gold" type="submit" icon="ph:floppy-disk" :loading="isSubmitting">
                            {{ form.status === 'published' ? 'Perbarui & Publikasikan' : 'Simpan Perubahan' }}
                        </BaseButton>
                    </div>
                </div>
            </form>
        </div>

        <!-- Media Library Modal -->
        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'

definePageMeta({
    title: 'Edit Berita',
    layout: 'dashboard'
})

useHead({
    title: 'Edit Berita - ArcheryHub Dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { get, put } = useApi()

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

const loadNews = async () => {
    try {
        const response = await get(`/news/${route.params.slug}`)
        if (response?.data) {
            const data = response.data
            form.value = {
                title: data.title || '',
                category: data.category || 'pengumuman',
                status: data.status || 'draft',
                tags: data.tags || '',
                excerpt: data.excerpt || '',
                content: data.content || '',
                imageURL: data.image_url || '',
                metaTitle: data.meta_title || '',
                metaDescription: data.meta_description || ''
            }
        }
    } catch (error) {
        toast.error('Gagal memuat data berita')
        router.push('/dashboard/news')
    }
}

const openMediaLibrary = () => {
    showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
    form.value.imageURL = media.url
    showMediaLibrary.value = false
}

const submitNews = async () => {
    if (!form.value.title) {
        toast.error('Judul berita wajib diisi')
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

        await put(`/news/${route.params.slug}`, payload)

        toast.success('Berita berhasil diperbarui!')
        router.push('/dashboard/news')
    } catch (error) {
        toast.error('Gagal memperbarui berita')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    loadNews()
})
</script>
