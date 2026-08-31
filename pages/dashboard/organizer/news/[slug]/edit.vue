<template>
  <div class="flex flex-col gap-6 sm:gap-8 max-w-6xl mx-auto w-full">
    <!-- Header Section (Enhanced Navy & Brand Accents) -->
    <DashboardHeader
      :title="t('organizer_news.edit.title', 'Edit Artikel Berita')"
      :subtitle="t('organizer_news.edit.subtitle', 'Perbarui konten, foto sampul, kategori, atau status publikasi berita ini.')"
      icon="ph:note-pencil-bold"
      :back-to="`/dashboard/organizer/news/${route.params.slug}`"
      :back-text="t('organizer_news.edit.cancel', 'Batal & Kembali')"
      :breadcrumbs="[
        { label: t('common.dashboard', 'Dashboard'), to: '/dashboard' },
        { label: t('organizer_news.index.title', 'Berita'), to: '/dashboard/organizer/news' },
        { label: form.title || 'Detail', to: `/dashboard/organizer/news/${route.params.slug}` },
        { label: t('organizer_news.edit.title_short', 'Edit Berita') }
      ]"
    />

    <!-- Form Section -->
    <form @submit.prevent="submitNews" class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      <!-- Main Content Column (2 Cols) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Article Info & Excerpt Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div class="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Icon icon="ph:article-bold" class="text-navy text-lg" />
            <h3 class="text-base font-black text-navy">{{ t('organizer_news.create.info_heading', 'Informasi Utama Berita') }}</h3>
          </div>

          <BaseInput
            v-model="form.title"
            :label="t('organizer_news.create.label_title', 'Judul Berita')"
            :placeholder="t('organizer_news.create.placeholder_title', 'Contoh: Sleman Archery Championship 2026 Resmi Dibuka')"
            required
          />

          <div>
            <label class="block text-xs font-bold text-navy tracking-wider mb-2">
              {{ t('organizer_news.create.label_excerpt', 'Ringkasan / Kutipan Lead (Opsional)') }}
            </label>
            <textarea
              v-model="form.excerpt"
              class="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all resize-none text-xs sm:text-sm text-slate-800"
              rows="3"
              :placeholder="t('organizer_news.create.placeholder_excerpt', 'Tuliskan 1-2 kalimat ringkasan yang menarik perhatian pembaca...')"
            ></textarea>
          </div>
        </div>

        <!-- Rich Text Editor Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <Icon icon="ph:text-aa-bold" class="text-navy text-lg" />
              <h3 class="text-base font-black text-navy">{{ t('organizer_news.create.content_heading', 'Isi Lengkap Artikel') }}</h3>
            </div>
            <span class="text-xs font-semibold text-slate-400">Editor Visual</span>
          </div>

          <div class="min-h-[350px]">
            <TiptapEditor
              v-model="form.content"
              :placeholder="t('organizer_news.create.placeholder_content', 'Tuliskan isi artikel berita secara lengkap di sini...')"
            />
          </div>
        </div>
      </div>

      <!-- Settings & Publishing Sidebar (1 Col) -->
      <aside class="space-y-6">
        <!-- Publishing Control Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Icon icon="ph:sliders-horizontal-bold" class="text-navy text-lg" />
            <h3 class="text-sm font-black text-navy capitalize">{{ t('organizer_news.detail.status_heading', 'Status & Publikasi') }}</h3>
          </div>

          <BaseSelect
            v-model="form.status"
            :items="statusOptions"
            :label="t('organizer_news.create.label_status', 'Status Publikasi')"
            required
          />

          <BaseSelect
            v-model="form.category"
            :items="categoryOptions"
            :label="t('organizer_news.create.label_category', 'Kategori Berita')"
            required
          />

          <BaseInput
            v-model="form.tags"
            :label="t('organizer_news.create.label_tags', 'Label & Tagar')"
            :placeholder="t('organizer_news.create.placeholder_tags', 'Contoh: panahan, kejurda, sleman (pisahkan dengan koma)')"
            icon="ph:tag"
          />

          <div class="pt-3 border-t border-slate-100 space-y-2">
            <BaseButton
              variant="primary"
              type="submit"
              icon="ph:floppy-disk-bold"
              :loading="isSubmitting"
              block
              class="h-11 font-black text-xs"
            >
              {{ form.status === 'published' ? t('organizer_news.edit.update_publish', 'Simpan & Publikasikan') : t('organizer_news.edit.save_changes', 'Simpan Perubahan') }}
            </BaseButton>

            <NuxtLink :to="`/dashboard/organizer/news/${route.params.slug}`" class="block">
              <BaseButton variant="white" block class="h-10 text-xs font-bold">
                {{ t('organizer_news.edit.cancel', 'Batal') }}
              </BaseButton>
            </NuxtLink>
          </div>
        </div>

        <!-- Featured Image Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <Icon icon="ph:image-bold" class="text-navy text-lg" />
              <h3 class="text-sm font-black text-navy">{{ t('organizer_news.create.featured_image', 'Foto Sampul Utama') }}</h3>
            </div>
            <button
              v-if="form.imageURL"
              type="button"
              @click="form.imageURL = ''"
              class="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
            >
              <Icon icon="ph:trash" />
              <span>Hapus</span>
            </button>
          </div>

          <div
            class="relative h-48 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center"
            @click="openMediaLibrary"
          >
            <img v-if="form.imageURL" :src="form.imageURL" class="w-full h-full object-cover" />
            <div v-else class="flex flex-col items-center justify-center p-4 text-center gap-2">
              <div class="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <div class="font-black text-navy text-xs">{{ t('organizer_news.create.click_to_select_image', 'Klik untuk Pilih / Unggah Gambar') }}</div>
                <div class="text-[11px] text-slate-400 mt-0.5">{{ t('organizer_news.create.select_or_upload', 'Format JPG, PNG, atau WebP') }}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </form>

    <!-- Media Library Modal -->
    <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import TiptapEditor from '~/components/common/TiptapEditor.client.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

definePageMeta({
    title: 'Edit Berita',
    layout: 'dashboard'
})

useHead({
    title: computed(() => (form.value.title || t('organizer_news.edit.title_short', 'Edit Berita')) + ' - ArcheryHub Dashboard')
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

const openMediaLibrary = () => {
    showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
    form.value.imageURL = media.url
    showMediaLibrary.value = false
}

const categoryOptions = computed(() => [
    { title: t('organizer_news.options.cat_announcement', 'Pengumuman'), value: 'pengumuman' },
    { title: t('organizer_news.options.cat_event', 'Event & Turnamen'), value: 'event' },
    { title: t('organizer_news.options.cat_achievement', 'Prestasi & Rekor'), value: 'prestasi' },
    { title: t('organizer_news.options.cat_other', 'Lainnya'), value: 'lainnya' }
])

const statusOptions = computed(() => [
    { title: t('organizer_news.options.status_draft', 'Draf (Belum Terbit)'), value: 'draft' },
    { title: t('organizer_news.options.status_published', 'Terbit (Publik)'), value: 'published' }
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
                tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
                excerpt: data.excerpt || '',
                content: data.content || '',
                imageURL: data.image_url || '',
                metaTitle: data.meta_title || '',
                metaDescription: data.meta_description || ''
            }
        }
    } catch (error) {
        toast.error(t('organizer_news.index.toast_fetch_failed', 'Gagal memuat data berita'))
        router.push('/dashboard/organizer/news')
    }
}

const submitNews = async () => {
    if (!form.value.title.trim()) {
        toast.error(t('organizer_news.create.toast_title_required', 'Judul berita wajib diisi'))
        return
    }

    isSubmitting.value = true

    try {
        const payload = {
            title: form.value.title.trim(),
            excerpt: form.value.excerpt.trim(),
            content: form.value.content,
            image_url: form.value.imageURL,
            category: form.value.category,
            tags: form.value.tags,
            status: form.value.status,
            meta_title: form.value.metaTitle,
            meta_description: form.value.metaDescription
        }

        await put(`/news/${route.params.slug}`, payload)

        toast.success(t('organizer_news.edit.toast_update_ok', 'Berita berhasil diperbarui!'))
        router.push(`/dashboard/organizer/news/${route.params.slug}`)
    } catch (error) {
        toast.error(t('organizer_news.edit.toast_update_failed', 'Gagal memperbarui berita'))
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    loadNews()
})
</script>
