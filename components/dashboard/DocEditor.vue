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
                        <NuxtLink to="/dashboard/root" class="text-white hover:text-primary transition-colors">{{ t('root.index.root_terminal', 'Root Terminal') }}</NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <NuxtLink to="/dashboard/root/docs" class="text-white hover:text-primary transition-colors">{{ t('sidebar.docs', 'Documentation') }}</NuxtLink>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">{{ isEdit ? t('root.docs.edit_title', 'Edit Documentation') : t('root.docs.create_title', 'Create Documentation') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <NuxtLink to="/dashboard/root/docs"
                            class="size-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <Icon icon="ph:arrow-left-bold" class="text-white text-lg" />
                        </NuxtLink>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">
                                {{ isEdit ? (currentTitle || t('root.docs.edit_title', 'Edit Documentation')) : t('root.docs.create_title', 'Create Documentation') }}
                            </h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-0.5">
                                {{ isEdit ? t('root.docs.edit_subtitle', 'Update knowledge base guide and bilingual content') : t('root.docs.create_subtitle', 'Create a new knowledge base article for Archeris docs') }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Action Buttons -->
                <div class="flex items-center gap-3">
                    <NuxtLink to="/dashboard/root/docs">
                        <BaseButton variant="outline" class="!text-white !border-white/20 hover:!bg-white/10">
                            {{ t('common.cancel', 'Cancel') }}
                        </BaseButton>
                    </NuxtLink>
                    <a v-if="isEdit && form.slug && form.category" :href="`/docs/${form.category}/${form.slug}`" target="_blank">
                        <BaseButton variant="outline" icon="ph:arrow-square-out-bold" class="!text-white !border-white/20 hover:!bg-white/10">
                            {{ t('root.docs.preview_public', 'View Public') }}
                        </BaseButton>
                    </a>
                    <BaseButton variant="primary" @click="handleSave" :loading="submitting" icon="ph:floppy-disk-bold" class="shadow-lg shadow-primary/20">
                        {{ isEdit ? t('common.save_changes', 'Save Changes') : t('root.docs.publish_doc', 'Create Document') }}
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- 2-Column Editor Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <!-- LEFT MAIN COLUMN: BILINGUAL CONTENT -->
            <div class="lg:col-span-8 space-y-6">
                <!-- Language Selector Tabs -->
                <div class="bg-white p-2.5 rounded-2xl border border-gray-200/80 shadow-2xs flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <button type="button" @click="activeLang = 'id'"
                            class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                            :class="activeLang === 'id' ? 'bg-navy text-primary shadow-xs' : 'text-slate-600 hover:bg-slate-100'">
                            <Icon icon="circle-flags:id" class="text-base" />
                            <span>Bahasa Indonesia (ID)</span>
                            <span v-if="form.id.title" class="size-1.5 rounded-full bg-emerald-400"></span>
                        </button>
                        <button type="button" @click="activeLang = 'en'"
                            class="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                            :class="activeLang === 'en' ? 'bg-navy text-primary shadow-xs' : 'text-slate-600 hover:bg-slate-100'">
                            <Icon icon="circle-flags:us" class="text-base" />
                            <span>English (EN)</span>
                            <span v-if="form.en.title" class="size-1.5 rounded-full bg-emerald-400"></span>
                        </button>
                    </div>

                    <div class="text-[11px] font-semibold text-slate-400 pr-2">
                        {{ activeLang === 'id' ? 'Mengedit konten Bahasa Indonesia' : 'Editing English content' }}
                    </div>
                </div>

                <!-- Title & Excerpt Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                            {{ activeLang === 'id' ? 'Judul Artikel (ID)' : 'Article Title (EN)' }} <span class="text-red-500">*</span>
                        </label>
                        <input v-model="currentLocalized.title" @input="onTitleInput" type="text"
                            :placeholder="activeLang === 'id' ? 'Contoh: Cara Mengatur Profil Pemanah' : 'Example: How to Set Up Your Archer Profile'"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl text-base font-bold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    </div>

                    <!-- Excerpt -->
                    <div>
                        <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                            {{ activeLang === 'id' ? 'Ringkasan Panduan (ID)' : 'Article Summary / Excerpt (EN)' }}
                        </label>
                        <textarea v-model="currentLocalized.excerpt" rows="2"
                            :placeholder="activeLang === 'id' ? 'Ringkasan singkat apa yang dipelajari pembaca pada artikel ini...' : 'Brief summary of what readers will learn in this guide...'"
                            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all leading-relaxed"></textarea>
                    </div>
                </div>

                <!-- Content Editor Card with Tiptap -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
                    <div class="flex items-center justify-between border-b border-gray-100 pb-3 flex-wrap gap-2">
                        <div class="flex items-center gap-2">
                            <label class="block text-xs font-black text-navy tracking-wider">
                                {{ activeLang === 'id' ? 'Konten Dokumentasi' : 'Documentation Content' }} <span class="text-red-500">*</span>
                            </label>
                        </div>

                        <!-- Editor Mode Tabs -->
                        <div class="flex items-center bg-gray-100 p-1 rounded-xl gap-1">
                            <button type="button" @click="editorMode = 'write'"
                                class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                :class="editorMode === 'write' ? 'bg-white text-navy shadow-xs' : 'text-gray-500 hover:text-navy'">
                                <Icon icon="ph:pencil-simple-bold" />
                                <span>{{ t('root.docs.editor_write', 'Edit') }}</span>
                            </button>
                            <button type="button" @click="editorMode = 'preview'"
                                class="px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                                :class="editorMode === 'preview' ? 'bg-white text-navy shadow-xs' : 'text-gray-500 hover:text-navy'">
                                <Icon icon="ph:eye-bold" />
                                <span>{{ t('root.docs.editor_preview', 'Preview') }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Tiptap Rich Text Editor -->
                    <div v-show="editorMode === 'write'" class="min-h-[420px]">
                        <TiptapEditor
                            :key="activeLang"
                            v-model="currentLocalized.content"
                            :placeholder="activeLang === 'id' ? 'Tulis panduan dokumentasi lengkap di sini...' : 'Write complete documentation guide here...'"
                            min-height="380px"
                        />
                    </div>

                    <!-- Live Rendered Preview -->
                    <div v-show="editorMode === 'preview'" class="p-6 bg-slate-50/70 border border-gray-200 rounded-2xl min-h-[400px]">
                        <div class="doc-content prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-navy prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-img:rounded-2xl prose-img:border prose-img:shadow-sm"
                            v-html="formattedPreviewContent || '<p class=\'text-slate-400 italic\'>Belum ada konten...</p>'">
                        </div>
                    </div>

                    <!-- Generated Table of Contents Preview -->
                    <div class="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2">
                        <div class="flex items-center justify-between text-xs font-bold text-navy">
                            <span class="flex items-center gap-1.5">
                                <Icon icon="ph:list-dashes-bold" class="text-primary text-sm" />
                                <span>Table of Contents (Auto Generated dari &lt;h2&gt;)</span>
                            </span>
                            <span class="text-[10px] text-slate-400 font-normal">{{ currentTOC.length }} sections</span>
                        </div>
                        <ul v-if="currentTOC.length > 0" class="text-xs space-y-1 text-slate-600 pl-2">
                            <li v-for="(item, idx) in currentTOC" :key="idx" class="flex items-center gap-1.5">
                                <span class="size-1.5 rounded-full bg-primary shrink-0"></span>
                                <span class="font-medium truncate">{{ item.text }}</span>
                                <span class="text-[10px] font-mono text-slate-400">#{{ item.id }}</span>
                            </li>
                        </ul>
                        <div v-else class="text-[11px] text-slate-400 italic">
                            Belum ada Heading 2 (&lt;h2&gt;) pada konten artikel.
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT SIDEBAR: METADATA & SETTINGS -->
            <div class="lg:col-span-4 space-y-6">
                <!-- Document Settings Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                    <h3 class="text-sm font-black text-navy uppercase tracking-wider flex items-center gap-2">
                        <Icon icon="ph:sliders-horizontal-bold" class="text-primary text-base" />
                        <span>Metadata Dokumen</span>
                    </h3>

                    <!-- Slug -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label class="block text-xs font-bold text-navy tracking-wider">
                                URL Slug <span class="text-red-500">*</span>
                            </label>
                            <button type="button" @click="isManualSlug = !isManualSlug"
                                class="text-[11px] font-bold text-navy hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                                <Icon :icon="isManualSlug ? 'ph:magic-wand-bold' : 'ph:pencil-simple-bold'" />
                                <span>{{ isManualSlug ? 'Auto generate' : 'Edit manual' }}</span>
                            </button>
                        </div>
                        <div class="flex items-center rounded-xl border border-gray-200 bg-gray-50/70 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                            <span class="pl-3.5 pr-1 text-xs font-mono text-gray-400 select-none">/docs/{{ form.category || '...' }}/</span>
                            <input v-model="form.slug" :readonly="!isManualSlug" type="text"
                                placeholder="archer-profile-setup"
                                class="w-full pr-4 py-2.5 bg-transparent text-xs font-mono text-navy outline-none" />
                        </div>
                    </div>

                    <!-- Category -->
                    <div>
                        <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                            Kategori Panduan <span class="text-red-500">*</span>
                        </label>
                        <select v-model="form.category"
                            class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-navy bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer">
                            <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                                {{ cat.label }}
                            </option>
                        </select>
                    </div>

                    <!-- Icon -->
                    <div>
                        <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                            Ikon Iconify
                        </label>
                        <div class="flex items-center gap-2">
                            <div class="size-10 rounded-xl bg-navy/5 border border-navy/10 flex items-center justify-center shrink-0">
                                <Icon :icon="form.icon || 'ph:file-text-bold'" class="text-xl text-navy" />
                            </div>
                            <input v-model="form.icon" type="text" placeholder="ph:user-circle-gear-bold"
                                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-mono text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        <div class="mt-1 text-[10px] text-slate-400">
                            Nama ikon standar Iconify (contoh: <code>ph:trophy-bold</code>, <code>ph:target-bold</code>).
                        </div>
                    </div>

                    <!-- Order & Read Time -->
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                                Urutan Tampil
                            </label>
                            <input v-model.number="form.order" type="number" min="0"
                                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-navy mb-2 tracking-wider">
                                Estimasi Waktu
                            </label>
                            <input v-model="form.readTime" type="text" placeholder="5 min"
                                class="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                        </div>
                    </div>
                </div>

                <!-- Translation Status Card -->
                <div class="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                    <h3 class="text-sm font-black text-navy uppercase tracking-wider flex items-center gap-2">
                        <Icon icon="ph:translate-bold" class="text-primary text-base" />
                        <span>Status Kelengkapan Bahasa</span>
                    </h3>

                    <div class="space-y-2 text-xs">
                        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span class="flex items-center gap-2 font-bold text-navy">
                                <Icon icon="circle-flags:id" class="text-base" />
                                <span>Bahasa Indonesia</span>
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                                :class="form.id.title && form.id.content ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                                {{ form.id.title && form.id.content ? 'Lengkap' : 'Belum Lengkap' }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                            <span class="flex items-center gap-2 font-bold text-navy">
                                <Icon icon="circle-flags:us" class="text-base" />
                                <span>English</span>
                            </span>
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                                :class="form.en.title && form.en.content ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
                                {{ form.en.title && form.en.content ? 'Complete' : 'Incomplete' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'

const props = defineProps({
    initialDoc: {
        type: Object,
        default: null
    },
    isEdit: {
        type: Boolean,
        default: false
    }
})

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const { get, post, put } = useApi()

const activeLang = ref('id') // 'id' | 'en'
const editorMode = ref('write') // 'write' | 'preview'
const isManualSlug = ref(false)
const submitting = ref(false)

const categoryOptions = [
    { value: 'accounts', label: 'Accounts & Profile (Akun & Profil)' },
    { value: 'tournaments', label: 'Tournaments Management (Turnamen)' },
    { value: 'scorekeeper', label: 'Scorekeeper (Pencatatan Skor)' },
    { value: 'qualification', label: 'Qualification Phase (Kualifikasi)' },
    { value: 'elimination', label: 'Elimination & Brackets (Eliminasi)' },
    { value: 'reporting', label: 'Reporting & Certificates (Laporan & Sertifikat)' },
]

const form = ref({
    slug: '',
    category: 'accounts',
    icon: 'ph:file-text-bold',
    order: 1,
    readTime: '5 min',
    en: {
        title: '',
        excerpt: '',
        content: '',
        toc: []
    },
    id: {
        title: '',
        excerpt: '',
        content: '',
        toc: []
    }
})

// Populate form if initial doc passed
if (props.initialDoc) {
    form.value.slug = props.initialDoc.slug || ''
    form.value.category = props.initialDoc.category || 'accounts'
    form.value.icon = props.initialDoc.icon || 'ph:file-text-bold'
    form.value.order = props.initialDoc.order || 1
    form.value.readTime = props.initialDoc.readTime || '5 min'
    
    if (props.initialDoc.en) {
        form.value.en = {
            title: props.initialDoc.en.title || '',
            excerpt: props.initialDoc.en.excerpt || '',
            content: props.initialDoc.en.content || '',
            toc: props.initialDoc.en.toc || []
        }
    }
    if (props.initialDoc.id) {
        form.value.id = {
            title: props.initialDoc.id.title || '',
            excerpt: props.initialDoc.id.excerpt || '',
            content: props.initialDoc.id.content || '',
            toc: props.initialDoc.id.toc || []
        }
    }
}

const currentLocalized = computed(() => {
    return activeLang.value === 'id' ? form.value.id : form.value.en
})

const formattedPreviewContent = computed(() => {
    const content = currentLocalized.value?.content || ''
    if (!content) return ''
    return content.replace(/(?<!<div class="(?:table-responsive|tableWrapper)"[^>]*>)\s*(<table[\s\S]*?<\/table>)/gi, (match) => {
        return `<div class="table-responsive">${match}</div>`
    })
})

const currentTitle = computed(() => {
    return form.value.id?.title || form.value.en?.title || ''
})

// Extract live TOC from current content
const currentTOC = computed(() => {
    const html = currentLocalized.value.content || ''
    const re = /<h2([^>]*)>(.*?)<\/h2>/gi
    const idRe = /id=["']([^"']+)["']/i
    const tagStripRe = /<[^>]*>/g
    const items = []
    
    let match
    let count = 1
    while ((match = re.exec(html)) !== null) {
        const attrs = match[1] || ''
        const inner = match[2] || ''
        const text = inner.replace(tagStripRe, '').trim()
        if (!text) continue

        let id = ''
        const idMatch = idRe.exec(attrs)
        if (idMatch && idMatch[1]) {
            id = idMatch[1]
        } else {
            id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `heading-${count}`
        }
        items.push({ id, level: 2, text })
        count++
    }
    return items
})

const onTitleInput = () => {
    if (!props.isEdit && !isManualSlug.value) {
        const titleForSlug = form.value.en?.title || form.value.id?.title || ''
        form.value.slug = titleForSlug
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }
}

const handleSave = async () => {
    if (!form.value.slug) {
        toast.error('Slug dokumen wajib diisi')
        return
    }
    if (!form.value.category) {
        toast.error('Kategori dokumen wajib dipilih')
        return
    }
    if (!form.value.id.title && !form.value.en.title) {
        toast.error('Judul artikel wajib diisi (minimal Bahasa Indonesia atau English)')
        return
    }

    submitting.value = true
    try {
        const payload = {
            slug: form.value.slug,
            category: form.value.category,
            icon: form.value.icon || 'ph:file-text-bold',
            order: Number(form.value.order) || 1,
            readTime: form.value.readTime || '5 min',
            en: {
                title: form.value.en.title || form.value.id.title,
                excerpt: form.value.en.excerpt || form.value.id.excerpt,
                content: form.value.en.content || form.value.id.content,
                toc: []
            },
            id: {
                title: form.value.id.title || form.value.en.title,
                excerpt: form.value.id.excerpt || form.value.en.excerpt,
                content: form.value.id.content || form.value.en.content,
                toc: []
            }
        }

        if (props.isEdit) {
            const baseSlug = props.initialDoc?.slug || form.value.slug
            await put(`/root/dashboard/docs/${baseSlug}`, payload)
            toast.success('Dokumentasi berhasil diperbarui!')
        } else {
            await post('/root/dashboard/docs', payload)
            toast.success('Dokumentasi baru berhasil dibuat!')
        }
        router.push('/dashboard/root/docs')
    } catch (err) {
        console.error('Save failed:', err)
        const errMsg = err?.data?.error || err?.message || 'Gagal menyimpan dokumen'
        toast.error(errMsg)
    } finally {
        submitting.value = false
    }
}
</script>
