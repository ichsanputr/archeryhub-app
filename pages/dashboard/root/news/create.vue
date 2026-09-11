<template>
    <div class="flex flex-col gap-8 max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard/root" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink to="/dashboard/root/news" class="hover:text-primary transition-colors">Berita</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Buat Baru</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Buat Berita Baru</h1>
                <div class="text-gray-500 font-medium mt-1">Tulis dan publikasikan berita resmi Archeris.</div>
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
                                <div class="font-bold text-navy">{{ t("root_news_cms.click_to_select_image") }}</div>
                                <div class="text-sm text-gray-400">{{ t("root_news_cms.choose_media") }}</div>
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
 
                    <BaseInput v-model="form.title" :label="t('root_news_cms.title_label')"
                        :placeholder="t('root_news_cms.title_placeholder')" required />
 
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseSelect v-model="form.category" :items="categoryOptions" :label="t('root_news_cms.category')" required />
                        <BaseSelect v-model="form.status" :items="statusOptions" :label="t('root_news_cms.publication_status')" required />
                    </div>
 
                    <BaseInput v-model="form.tags" :label="t('root_news_cms.tags_label')" :placeholder="t('root_news_cms.tags_placeholder')"
                        icon="ph:tag" />
 
                    <div>
                        <label class="block text-xs font-bold text-navy  tracking-wider mb-2">
                            Kutipan Singkat
                        </label>
                        <textarea v-model="form.excerpt"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows="3"
                            :placeholder="t('root_news_cms.excerpt_placeholder')"></textarea>
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
                    <NuxtLink to="/dashboard/root/news">
                        <BaseButton variant="white" icon="ph:arrow-left">
                            Kembali
                        </BaseButton>
                    </NuxtLink>
                    <div class="flex items-center gap-3">
                        <BaseButton variant="outline" type="button" icon="ph:eye" @click="previewNews">
                            Preview
                        </BaseButton>
                        <BaseButton variant="gold" type="submit" icon="ph:paper-plane-tilt" :loading="isSubmitting">
                            {{ form.status === 'published' ? t('root_news_cms.publish') : t('root_news_cms.save_draft') }}
                        </BaseButton>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
 
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import useDashboardI18n from '~/composables/useDashboardI18n'
 
definePageMeta({
    title: 'Buat Berita',
    layout: 'dashboard'
})
 
useHead({
    title: computed(() => t('news.create_title', 'Create News') + ' - Archeris Dashboard')
})
 
const { post } = useApi()
const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)
const showMediaLibrary = ref(false)
 
const form = ref({
    title: '',
    category: 'pengumuman',
    status: 'published',
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
    toast.info(t('organizer.news.form.preview', 'Preview'))
}
 
const submitNews = async () => {
    if (!form.value.title) {
        toast.error(t('organizer.news.form.toast_title_required', 'Judul berita wajib diisi'))
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
            ? t('organizer.news.form.toast_create_ok_published', 'Berita berhasil dipublikasikan!')
            : t('organizer.news.form.toast_create_ok_draft', 'Draft berhasil disimpan!'))
        router.push('/dashboard/root/news')
    } catch (error) {
        toast.error(t('organizer.news.form.toast_create_failed', 'Gagal menyimpan berita'))
    } finally {
        isSubmitting.value = false
    }
}
</script>
