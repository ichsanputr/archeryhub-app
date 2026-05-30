<template>
    <div class="flex flex-col gap-8 max-w-4xl mx-auto">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">{{ t('common.dashboard') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink :to="`/dashboard/${userPersona}/news`" class="hover:text-primary transition-colors">{{ t('organizer_news.index.title') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">{{ t('organizer_news.edit.title_short') }}</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">{{ t('organizer_news.edit.title') }}</h1>
                <p class="text-gray-500 font-medium mt-1">{{ t('organizer_news.edit.subtitle') }}</p>
            </div>
        </div>

        <!-- Form Card -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <form @submit.prevent="submitNews">
                <!-- Featured Image Upload -->
                <div class="p-8 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:image" class="text-primary" />
                        {{ t('organizer_news.create.featured_image') }}
                    </h3>
                    <div class="relative h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer overflow-hidden"
                        @click="openMediaLibrary">
                        <img v-if="form.imageURL" :src="form.imageURL" class="w-full h-full object-cover" />
                        <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <div class="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                <Icon icon="ph:upload-simple" class="text-3xl text-gray-400" />
                            </div>
                            <div class="text-center">
                                <p class="font-bold text-navy">{{ t('organizer_news.create.click_to_select_image') }}</p>
                                <p class="text-sm text-gray-400">{{ t('organizer_news.create.select_or_upload') }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Basic Info -->
                <div class="p-8 border-b border-gray-100 space-y-6">
                    <h3 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:info" class="text-primary" />
                        {{ t('organizer_news.create.info_heading') }}
                    </h3>

                    <BaseInput v-model="form.title" :label="t('organizer_news.create.label_title')"
                        :placeholder="t('organizer_news.create.placeholder_title')" required />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BaseSelect v-model="form.category" :items="categoryOptions" :label="t('organizer_news.create.label_category')" required />
                        <BaseSelect v-model="form.status" :items="statusOptions" :label="t('organizer_news.create.label_status')" required />
                    </div>

                    <BaseInput v-model="form.tags" :label="t('organizer_news.create.label_tags')" :placeholder="t('organizer_news.create.placeholder_tags')"
                        icon="ph:tag" />

                    <div>
                        <label class="block text-xs font-bold text-navy  tracking-wider mb-2">
                            {{ t('organizer_news.create.label_excerpt') }}
                        </label>
                        <textarea v-model="form.excerpt"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                            rows="3"
                            :placeholder="t('organizer_news.create.placeholder_excerpt')"></textarea>
                    </div>
                </div>

                <!-- Content Editor -->
                <div class="p-8 border-b border-gray-100">
                    <h3 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:text-aa" class="text-primary" />
                        {{ t('organizer_news.create.content_heading') }}
                    </h3>
                    <TiptapEditor v-model="form.content" :placeholder="t('organizer_news.create.placeholder_content')" />
                </div>

                <!-- Actions -->
                <div class="p-8 bg-gray-50/50 flex items-center justify-between gap-4">
                    <NuxtLink :to="`/dashboard/${userPersona}/news`">
                        <BaseButton variant="white" icon="ph:arrow-left">
                            {{ t('organizer_news.edit.cancel') }}
                        </BaseButton>
                    </NuxtLink>
                    <div class="flex items-center gap-3">
                        <BaseButton variant="gold" type="submit" icon="ph:floppy-disk" :loading="isSubmitting">
                            {{ form.status === 'published' ? t('organizer_news.edit.update_publish') : t('organizer_news.edit.save_changes') }}
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
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({
    title: 'Edit Berita',
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { get, put } = useApi()
const { t } = useDashboardI18n()

useHead({
    title: () => `${t('organizer_news.form.edit_title')} - ArcheryHub Dashboard`
})

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

const categoryOptions = computed(() => [
    { title: t('organizer_news.options.cat_event'), value: 'event' },
    { title: t('organizer_news.options.cat_announcement'), value: 'pengumuman' },
    { title: t('organizer_news.options.cat_achievement'), value: 'prestasi' },
    { title: t('organizer_news.options.cat_other'), value: 'lainnya' }
])

const statusOptions = computed(() => [
    { title: t('organizer_news.options.status_draft'), value: 'draft' },
    { title: t('organizer_news.options.status_published'), value: 'published' }
])

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
        toast.error(t('organizer.news.form.toast_load_failed', 'Gagal memuat data berita'))
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

        await put(`/news/${route.params.slug}`, payload)

        toast.success(t('organizer.news.form.toast_update_ok', 'Berita berhasil diperbarui!'))
        router.push('/dashboard/news')
    } catch (error) {
        toast.error(t('organizer.news.form.toast_update_failed', 'Gagal memperbarui berita'))
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    loadNews()
})
</script>
