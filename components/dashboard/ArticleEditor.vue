<template>
    <div class="space-y-8">
        <!-- Header Banner -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-3">
                    <div class="flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest text-primary/80">
                        <NuxtLink to="/dashboard/root" class="text-white hover:text-primary transition-colors">{{ t('root.index.root_terminal') }}</NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <NuxtLink to="/dashboard/root/articles" class="text-white hover:text-primary transition-colors">{{ t('root.articles.title') }}</NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">{{ isEdit ? t('root.articles.edit_title') : t('root.articles.create_title') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <NuxtLink to="/dashboard/root/articles"
                            class="size-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <Icon icon="ph:arrow-left-bold" class="text-white text-lg" />
                        </NuxtLink>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">
                                {{ isEdit ? (form.title || t('root.articles.edit_title')) : t('root.articles.create_title') }}
                            </h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-0.5">
                                {{ isEdit ? t('root.articles.edit_subtitle') : t('root.articles.create_subtitle') }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Action Buttons -->
                <div class="flex items-center gap-3">
                    <NuxtLink to="/dashboard/root/articles">
                        <BaseButton variant="outline" class="!text-white !border-white/20 hover:!bg-white/10">
                            {{ t('common.cancel') }}
                        </BaseButton>
                    </NuxtLink>
                    <BaseButton v-if="form.status !== 'published'" variant="outline" @click="handleSave('draft')" :loading="savingDraft" icon="ph:floppy-disk-bold" class="!text-white !border-white/20 hover:!bg-white/10">
                        {{ t('root.articles.save_draft') }}
                    </BaseButton>
                    <BaseButton variant="primary" @click="handleSave(form.status === 'draft' ? 'published' : form.status)" :loading="submitting" icon="ph:paper-plane-tilt-bold" class="shadow-lg shadow-primary/20">
                        {{ isEdit ? t('root.articles.update') : t('root.articles.publish') }}
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- 2-Column Editor Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT MAIN COLUMN: ARTICLE CONTENT -->
            <div class="lg:col-span-8 space-y-6">
                <!-- Title & Slug Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                            {{ t('root.articles.form_title') }} <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.title" @input="onTitleInput" type="text"
                            :placeholder="t('root.articles.form_title_placeholder')"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base font-bold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>

                    <!-- Slug with toggle -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-bold text-gray-500 tracking-wider">
                                {{ t('root.articles.form_slug') }}
                            </label>
                            <button type="button" @click="isManualSlug = !isManualSlug"
                                class="text-xs font-bold text-navy hover:text-slate-600 hover:underline flex items-center gap-1">
                                <Icon :icon="isManualSlug ? 'ph:magic-wand-bold' : 'ph:pencil-simple-bold'" />
                                <span>{{ isManualSlug ? t('root.articles.form_slug_auto') : 'Ubah manual' }}</span>
                            </button>
                        </div>
                        <div class="flex items-center rounded-xl border border-gray-200 bg-gray-50/70 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                            <span class="pl-3.5 pr-1 text-xs font-mono text-gray-400 select-none">/blog/</span>
                            <input v-model="form.slug" :readonly="!isManualSlug" type="text"
                                :placeholder="t('root.articles.form_slug_placeholder')"
                                class="w-full pr-4 py-2 bg-transparent text-xs font-mono text-navy outline-none" />
                        </div>
                    </div>

                    <!-- Excerpt -->
                    <div>
                        <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                            {{ t('root.articles.form_excerpt') }}
                        </label>
                        <textarea v-model="form.excerpt" rows="2"
                            :placeholder="t('root.articles.form_excerpt_placeholder')"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all leading-relaxed"></textarea>
                    </div>
                </div>

                <!-- Content Editor Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                        <label class="block text-xs font-black text-navy tracking-wider">
                            {{ t('root.articles.form_content') }} <span class="text-red-500">*</span>
                        </label>

                        <!-- Editor Mode Tabs -->
                        <div class="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
                            <button type="button" @click="activeTab = 'write'"
                                class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                                :class="activeTab === 'write' ? 'bg-white text-navy shadow-xs' : 'text-gray-500 hover:text-navy'">
                                <Icon icon="ph:pencil-simple-bold" />
                                <span>{{ t('root.articles.form_tab_write') }}</span>
                            </button>
                            <button type="button" @click="activeTab = 'preview'"
                                class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                                :class="activeTab === 'preview' ? 'bg-white text-navy shadow-xs' : 'text-gray-500 hover:text-navy'">
                                <Icon icon="ph:eye-bold" />
                                <span>{{ t('root.articles.form_tab_preview') }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Toolbar (Visible in Write Mode) -->
                    <div v-show="activeTab === 'write'" class="flex flex-wrap items-center gap-1 p-2 bg-gray-50/80 rounded-2xl border border-gray-100 text-gray-600">
                        <button type="button" @click="insertFormat('h2')" :title="t('root.articles.toolbar_h2')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg font-bold text-xs transition-colors">H2</button>
                        <button type="button" @click="insertFormat('h3')" :title="t('root.articles.toolbar_h3')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg font-bold text-xs transition-colors">H3</button>
                        <div class="h-4 w-px bg-gray-200 mx-1"></div>
                        <button type="button" @click="insertFormat('bold')" :title="t('root.articles.toolbar_bold')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:text-b-bold" class="text-base" /></button>
                        <button type="button" @click="insertFormat('italic')" :title="t('root.articles.toolbar_italic')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:text-italic-bold" class="text-base" /></button>
                        <div class="h-4 w-px bg-gray-200 mx-1"></div>
                        <button type="button" @click="insertFormat('ul')" :title="t('root.articles.toolbar_ul')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:list-bullets-bold" class="text-base" /></button>
                        <button type="button" @click="insertFormat('ol')" :title="t('root.articles.toolbar_ol')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:list-numbers-bold" class="text-base" /></button>
                        <button type="button" @click="insertFormat('quote')" :title="t('root.articles.toolbar_quote')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:quotes-bold" class="text-base" /></button>
                        <div class="h-4 w-px bg-gray-200 mx-1"></div>
                        <button type="button" @click="insertFormat('link')" :title="t('root.articles.toolbar_link')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:link-bold" class="text-base" /></button>
                        <button type="button" @click="insertFormat('image')" :title="t('root.articles.toolbar_image')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:image-bold" class="text-base" /></button>
                        <button type="button" @click="insertFormat('code')" :title="t('root.articles.toolbar_code')"
                            class="p-2 hover:bg-white hover:text-navy rounded-lg transition-colors"><Icon icon="ph:code-bold" class="text-base" /></button>
                    </div>

                    <!-- Textarea Editor -->
                    <div v-show="activeTab === 'write'">
                        <textarea ref="editorRef" v-model="form.content" rows="18"
                            :placeholder="t('root.articles.form_content_placeholder')"
                            class="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm font-mono text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all leading-relaxed no-scrollbar"></textarea>
                    </div>

                    <!-- Live Preview -->
                    <div v-show="activeTab === 'preview'" class="min-h-[400px] p-6 bg-slate-50/60 rounded-2xl border border-gray-200">
                        <div v-if="!form.content" class="text-center py-16 text-gray-400 text-sm">
                            {{ t('root.articles.preview_empty') }}
                        </div>
                        <div v-else class="prose prose-slate max-w-none article-prose
                            prose-headings:text-navy prose-headings:font-bold prose-headings:font-display prose-headings:tracking-tight
                            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-black prose-h2:mt-8 prose-h2:mb-4
                            prose-h3:text-lg sm:prose-h3:text-xl prose-h3:font-bold prose-h3:text-slate-900 prose-h3:mt-6 prose-h3:mb-3
                            prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:text-base prose-p:mb-5
                            prose-ul:text-slate-700 prose-ul:text-base prose-ul:leading-[1.8] prose-ul:space-y-2
                            prose-ol:text-slate-700 prose-ol:text-base prose-ol:leading-[1.8] prose-ol:space-y-2
                            prose-strong:text-navy prose-strong:font-bold
                            prose-blockquote:border-l-4 prose-blockquote:border-navy prose-blockquote:bg-white prose-blockquote:p-4 prose-blockquote:rounded-xl prose-blockquote:text-navy prose-blockquote:italic"
                            v-html="renderedContent">
                        </div>
                    </div>
                </div>

                <!-- Tags Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                    <label class="block text-xs font-bold text-navy tracking-wider">
                        {{ t('root.articles.form_tags') }}
                    </label>
                    <div class="flex flex-wrap items-center gap-2 p-2.5 border border-gray-200 rounded-2xl min-h-[48px] bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                        <span v-for="(tag, idx) in form.tags" :key="idx"
                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-navy/5 text-navy text-xs font-bold">
                            <span>#{{ tag }}</span>
                            <button type="button" @click="removeTag(idx)" class="text-gray-400 hover:text-red-500 transition-colors">
                                <Icon icon="ph:x-bold" class="text-xs" />
                            </button>
                        </span>
                        <input v-model="tagInput" @keydown.enter.prevent="addTag" @keydown.comma.prevent="addTag"
                            type="text" :placeholder="t('root.articles.form_tags_placeholder')"
                            class="flex-grow min-w-[150px] px-2 py-1 text-xs text-navy outline-none bg-transparent" />
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDEBAR: METADATA & SETTINGS -->
            <div class="lg:col-span-4 space-y-6">
                <!-- Publication Status Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <h3 class="text-xs font-black text-navy tracking-wider flex items-center gap-2">
                        <Icon icon="ph:paper-plane-tilt-bold" class="text-navy text-base" />
                        <span>{{ t('root.articles.form_status') }}</span>
                    </h3>

                    <BaseSelect v-model="form.status" :options="statusOptions" :label="t('root.articles.form_status')" class="w-full" />

                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">
                            {{ t('root.articles.form_published_at') }}
                        </label>
                        <input v-model="form.published_at" type="datetime-local"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>

                    <div class="pt-2 border-t border-gray-100 flex flex-col gap-2">
                        <BaseButton variant="primary" block @click="handleSave(form.status === 'draft' ? 'published' : form.status)" :loading="submitting" icon="ph:check-circle-bold">
                            {{ isEdit ? t('root.articles.update') : t('root.articles.publish') }}
                        </BaseButton>
                        <BaseButton v-if="form.status !== 'draft'" variant="outline" block @click="handleSave('draft')" :loading="savingDraft" icon="ph:floppy-disk-bold">
                            {{ t('root.articles.save_draft') }}
                        </BaseButton>
                    </div>
                </div>

                <!-- Category Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <h3 class="text-xs font-black text-navy tracking-wider flex items-center gap-2">
                        <Icon icon="ph:tag-bold" class="text-navy text-base" />
                        <span>{{ t('root.articles.form_category') }}</span>
                    </h3>

                    <BaseSelect v-model="form.category" :options="categoryListOptions" :label="t('root.articles.category_label')" class="w-full" />

                    <!-- Custom Category if needed -->
                    <div v-if="form.category === 'custom'" class="pt-2">
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">{{ t('root.articles.custom_category_label') }}</label>
                        <input v-model="customCategory" type="text" :placeholder="t('root.articles.custom_category_placeholder')"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>
                </div>

                <!-- Cover Image Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <h3 class="text-xs font-black text-navy tracking-wider flex items-center gap-2">
                        <Icon icon="ph:image-bold" class="text-navy text-base" />
                        <span>{{ t('root.articles.form_cover_image') }}</span>
                    </h3>

                    <!-- Image Preview -->
                    <div class="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center relative group">
                        <img v-if="form.image_url" :src="form.image_url" alt="Cover Preview" class="w-full h-full object-cover" />
                        <div v-else class="flex flex-col items-center gap-2 text-gray-300">
                            <Icon icon="ph:image-square-bold" class="text-4xl" />
                            <span class="text-[10px] font-bold">{{ t('root.articles.banner_aspect_hint') }}</span>
                        </div>
                    </div>

                    <!-- Upload Button & URL Input -->
                    <div class="space-y-3">
                        <div class="flex items-center gap-2">
                            <input ref="fileInputRef" @change="handleFileUpload" type="file" accept="image/*" class="hidden" />
                            <BaseButton type="button" variant="outline" size="sm" block @click="fileInputRef?.click()" :loading="uploadingImage" icon="ph:upload-simple-bold">
                                {{ uploadingImage ? t('root.articles.form_uploading') : t('root.articles.form_upload_cover') }}
                            </BaseButton>
                        </div>
                        <input v-model="form.image_url" type="text" :placeholder="t('root.articles.cover_url_placeholder')"
                            class="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono" />
                        <div class="text-[10px] text-gray-400 leading-tight">
                            {{ t('root.articles.form_cover_image_desc') }}
                        </div>
                    </div>
                </div>

                <!-- Author & Read Time Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <h3 class="text-xs font-black text-navy tracking-wider flex items-center gap-2">
                        <Icon icon="ph:user-circle-bold" class="text-primary text-base" />
                        <span>{{ t('root.articles.author_metadata') }}</span>
                    </h3>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">
                            {{ t('root.articles.form_author_name') }}
                        </label>
                        <input v-model="form.author_name" type="text"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">
                            {{ t('root.articles.form_author_role') }}
                        </label>
                        <input v-model="form.author_role" type="text"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 mb-1.5 tracking-wider">
                            {{ t('root.articles.form_read_time') }}
                        </label>
                        <input v-model.number="form.read_time" type="number" min="1" max="60"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'

const props = defineProps({
    articleId: {
        type: String,
        default: null
    }
})

const isEdit = computed(() => !!props.articleId)

const { t } = useI18n()
const router = useRouter()
const api = useApi()
const toast = useToast()

const editorRef = ref(null)
const fileInputRef = ref(null)
const activeTab = ref('write')
const isManualSlug = ref(false)
const tagInput = ref('')
const customCategory = ref('')
const submitting = ref(false)
const savingDraft = ref(false)
const uploadingImage = ref(false)

const form = ref({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Gear & Equipment',
    image_url: '',
    author_name: 'Archeris Editorial',
    author_role: 'Archery Specialist & Coach',
    author_avatar: generateDicebearAvatar('Archeris Editorial'),
    tags: [],
    read_time: 5,
    status: 'published',
    published_at: ''
})

const statusOptions = computed(() => [
    { label: t('root.articles.status_published'), value: 'published' },
    { label: t('root.articles.status_draft'), value: 'draft' },
    { label: t('root.articles.status_archived'), value: 'archived' }
])

const categoryListOptions = computed(() => [
    { label: t('root.articles.cat_gear'), value: 'Gear & Equipment' },
    { label: t('root.articles.cat_rules'), value: 'Rules & Scoring' },
    { label: t('root.articles.cat_guides'), value: 'Guides & Technique' },
])

const onTitleInput = () => {
    if (!isManualSlug.value) {
        form.value.slug = form.value.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }
}

const addTag = () => {
    const raw = tagInput.value.trim().replace(/^#/, '')
    if (raw && !form.value.tags.includes(raw)) {
        form.value.tags.push(raw)
    }
    tagInput.value = ''
}

const removeTag = (index) => {
    form.value.tags.splice(index, 1)
}

const insertFormat = (type) => {
    const textarea = editorRef.value
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = textarea.value.substring(start, end)
    let replacement = ''

    switch (type) {
        case 'h2':
            replacement = `\n## ${selected || 'Heading 2'}\n`
            break
        case 'h3':
            replacement = `\n### ${selected || 'Heading 3'}\n`
            break
        case 'bold':
            replacement = `**${selected || 'teks tebal'}**`
            break
        case 'italic':
            replacement = `*${selected || 'teks miring'}*`
            break
        case 'ul':
            replacement = `\n- ${selected || 'Item list'}\n- Item list\n`
            break
        case 'ol':
            replacement = `\n1. ${selected || 'Item pertama'}\n2. Item kedua\n`
            break
        case 'quote':
            replacement = `\n> ${selected || 'Kutipan penting'}\n`
            break
        case 'link':
            replacement = `[${selected || 'Teks link'}](https://example.com)`
            break
        case 'image':
            replacement = `\n![${selected || 'Deskripsi gambar'}](https://example.com/image.jpg)\n`
            break
        case 'code':
            replacement = `\n\`\`\`\n${selected || '// Kode atau teks blok'}\n\`\`\`\n`
            break
    }

    const current = form.value.content || ''
    form.value.content = current.substring(0, start) + replacement + current.substring(end)
}

const renderedContent = computed(() => {
    if (!form.value.content) return ''
    try {
        return marked.parse(form.value.content)
    } catch {
        return form.value.content
    }
})

const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB')
        return
    }

    try {
        uploadingImage.value = true
        const formData = new FormData()
        formData.append('image', file)

        const res = await api.post('/root/dashboard/articles/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        form.value.image_url = res.image_url || res.url
        toast.success(t('root.articles.form_cover_image'))
    } catch (err) {
        console.error('Failed to upload image:', err)
        toast.error(err.data?.error || 'Gagal mengunggah gambar')
    } finally {
        uploadingImage.value = false
    }
}

const fetchArticleDetail = async () => {
    if (!props.articleId) return
    try {
        const res = await api.get(`/root/dashboard/articles/${props.articleId}`)
        const data = res.data || res
        form.value = {
            title: data.title || '',
            slug: data.slug || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || 'Archery Equipment',
            image_url: data.image || data.image_url || '',
            author_name: data.author_name || 'Archeris Editorial',
            author_role: data.author_role || 'Archery Specialist & Coach',
            author_avatar: data.author_avatar || generateDicebearAvatar(data.author_name || 'Archeris Editorial'),
            tags: Array.isArray(data.tags) ? data.tags : [],
            read_time: data.read_time || 5,
            status: data.status || 'published',
            published_at: data.published_at ? data.published_at.slice(0, 16) : ''
        }
        isManualSlug.value = true
    } catch (err) {
        console.error('Failed to load article detail:', err)
        toast.error('Gagal memuat artikel')
        router.push('/dashboard/root/articles')
    }
}

const handleSave = async (targetStatus) => {
    if (!form.value.title.trim()) {
        toast.error(t('root.articles.form_title'))
        return
    }
    if (!form.value.content.trim()) {
        toast.error(t('root.articles.form_content'))
        return
    }

    const isDraft = targetStatus === 'draft'
    if (isDraft) savingDraft.value = true
    else submitting.value = true

    let category = form.value.category
    if (category === 'custom' && customCategory.value.trim()) {
        category = customCategory.value.trim()
    }

    const payload = {
        title: form.value.title.trim(),
        slug: form.value.slug.trim(),
        excerpt: form.value.excerpt.trim(),
        content: form.value.content,
        category: category,
        image_url: form.value.image_url.trim(),
        author_name: form.value.author_name.trim(),
        author_role: form.value.author_role.trim(),
        author_avatar: form.value.author_avatar.trim(),
        tags: form.value.tags,
        read_time: form.value.read_time || 5,
        status: targetStatus,
        published_at: form.value.published_at ? form.value.published_at + ':00' : null
    }

    try {
        if (isEdit.value) {
            await api.put(`/root/dashboard/articles/${props.articleId}`, payload)
            toast.success(t('root.articles.update_success'))
        } else {
            await api.post('/root/dashboard/articles', payload)
            toast.success(t('root.articles.save_success'))
        }
        router.push('/dashboard/root/articles')
    } catch (err) {
        console.error('Failed to save article:', err)
        toast.error(err.data?.error || 'Gagal menyimpan artikel')
    } finally {
        savingDraft.value = false
        submitting.value = false
    }
}

onMounted(() => {
    if (isEdit.value) {
        fetchArticleDetail()
    } else {
        // Set default published_at to now in local ISO format (YYYY-MM-DDTHH:mm)
        const now = new Date()
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        form.value.published_at = now.toISOString().slice(0, 16)
    }
})
</script>
