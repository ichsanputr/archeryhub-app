<template>
    <div class="tiptap-editor relative rounded-xl border border-gray-200 overflow-visible shadow-sm"
        :class="{ 'ring-2 ring-primary ring-offset-0': editor?.isFocused }">

        <!-- Toolbar -->
        <div v-if="editor"
            class="toolbar flex flex-wrap gap-0.5 p-2 bg-gray-50 border-b border-gray-200 rounded-t-xl sticky top-0 z-20">

            <!-- Undo / Redo -->
            <div class="flex gap-0.5">
                <TBtn @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()"
                    title="Undo (Ctrl+Z)">
                    <Icon icon="ph:arrow-counter-clockwise-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()"
                    title="Redo (Ctrl+Y)">
                    <Icon icon="ph:arrow-clockwise-bold" />
                </TBtn>
            </div>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Heading dropdown -->
            <div class="relative" ref="headingMenuRef">
                <TBtn @click="headingMenuOpen = !headingMenuOpen" title="Heading" :active="editor.isActive('heading')"
                    class="gap-1 !px-2 min-w-[72px] justify-between">
                    <span class="text-xs font-black">{{ currentHeading }}</span>
                    <Icon icon="ph:caret-down-bold" class="text-[10px]" />
                </TBtn>
                <div v-if="headingMenuOpen" class="dropdown-menu">
                    <button v-for="item in headingOptions" :key="item.value" type="button"
                        @click="setHeading(item.value); headingMenuOpen = false"
                        class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg last:rounded-b-lg"
                        :class="{ 'text-primary font-black': item.value === 0 ? editor.isActive('paragraph') : editor.isActive('heading', { level: item.value }) }">
                        <span :style="{ fontSize: item.size }" class="font-bold leading-none">{{ item.label
                            }}</span>
                    </button>
                </div>
            </div>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Text styling -->
            <div class="flex gap-0.5">
                <TBtn @click="editor.chain().focus().toggleBold().run()" :active="editor.isActive('bold')"
                    title="Bold (Ctrl+B)">
                    <Icon icon="ph:text-b-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleItalic().run()" :active="editor.isActive('italic')"
                    title="Italic (Ctrl+I)">
                    <Icon icon="ph:text-italic-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleUnderline().run()" :active="editor.isActive('underline')"
                    title="Underline (Ctrl+U)">
                    <Icon icon="ph:text-underline-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleStrike().run()" :active="editor.isActive('strike')"
                    title="Strikethrough">
                    <Icon icon="ph:text-strikethrough-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleHighlight().run()" :active="editor.isActive('highlight')"
                    title="Highlight">
                    <Icon icon="ph:highlighter-circle-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleCode().run()" :active="editor.isActive('code')"
                    title="Inline code">
                    <Icon icon="ph:code-bold" />
                </TBtn>
            </div>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Alignment -->
            <div class="flex gap-0.5">
                <TBtn @click="editor.chain().focus().setTextAlign('left').run()"
                    :active="editor.isActive({ textAlign: 'left' })" title="Kiri">
                    <Icon icon="ph:text-align-left-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().setTextAlign('center').run()"
                    :active="editor.isActive({ textAlign: 'center' })" title="Tengah">
                    <Icon icon="ph:text-align-center-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().setTextAlign('right').run()"
                    :active="editor.isActive({ textAlign: 'right' })" title="Kanan">
                    <Icon icon="ph:text-align-right-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().setTextAlign('justify').run()"
                    :active="editor.isActive({ textAlign: 'justify' })" title="Rata kanan-kiri">
                    <Icon icon="ph:text-align-justify-bold" />
                </TBtn>
            </div>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Lists -->
            <div class="flex gap-0.5">
                <TBtn @click="editor.chain().focus().toggleBulletList().run()" :active="editor.isActive('bulletList')"
                    title="Daftar poin">
                    <Icon icon="ph:list-bullets-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleOrderedList().run()" :active="editor.isActive('orderedList')"
                    title="Daftar bernomor">
                    <Icon icon="ph:list-numbers-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleTaskList().run()" :active="editor.isActive('taskList')"
                    title="Daftar tugas">
                    <Icon icon="ph:check-square-bold" />
                </TBtn>
            </div>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Block elements -->
            <div class="flex gap-0.5">
                <TBtn @click="editor.chain().focus().toggleBlockquote().run()" :active="editor.isActive('blockquote')"
                    title="Kutipan">
                    <Icon icon="ph:quotes-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().toggleCodeBlock().run()" :active="editor.isActive('codeBlock')"
                    title="Blok kode">
                    <Icon icon="ph:code-block-bold" />
                </TBtn>
                <TBtn @click="editor.chain().focus().setHorizontalRule().run()" title="Garis pemisah">
                    <Icon icon="ph:minus-bold" />
                </TBtn>
            </div>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Link -->
            <TBtn @click="openLinkDialog" :active="editor.isActive('link')" title="Sisipkan tautan (Ctrl+K)">
                <Icon icon="ph:link-bold" />
            </TBtn>

            <!-- Image menu -->
            <div class="relative" ref="imageMenuRef">
                <TBtn @click="imageMenuOpen = !imageMenuOpen" title="Sisipkan gambar">
                    <Icon icon="ph:image-bold" />
                </TBtn>
                <div v-if="imageMenuOpen" class="dropdown-menu min-w-[160px]">
                    <button type="button" @click="showMediaLibrary = true; imageMenuOpen = false"
                        class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded-t-lg">
                        <Icon icon="ph:images-bold" class="text-primary" /> Media Library
                    </button>
                    <button type="button" @click="imageFileInput?.click(); imageMenuOpen = false"
                        class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                        <Icon icon="ph:upload-bold" class="text-primary" /> Upload File
                    </button>
                    <button type="button" @click="imageUrlMode = true; imageMenuOpen = false"
                        class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded-b-lg">
                        <Icon icon="ph:link-simple-bold" class="text-primary" /> Paste URL
                    </button>
                </div>
            </div>

            <!-- YouTube -->
            <TBtn @click="openYoutubeDialog" title="Embed YouTube">
                <Icon icon="ph:youtube-logo-bold" />
            </TBtn>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Table menu -->
            <div class="relative" ref="tableMenuRef">
                <TBtn @click="tableMenuOpen = !tableMenuOpen" :active="editor.isActive('table')" title="Tabel"
                    class="gap-1">
                    <Icon icon="ph:table-bold" />
                    <Icon icon="ph:caret-down-bold" class="text-[10px]" />
                </TBtn>
                <div v-if="tableMenuOpen" class="dropdown-menu min-w-[200px]">
                    <template v-if="!editor.isActive('table')">
                        <button type="button" @click="insertTable"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 rounded-lg">
                            <Icon icon="ph:plus-bold" class="text-primary" /> Buat Tabel 3×3
                        </button>
                    </template>
                    <template v-else>
                        <div class="px-3 py-1.5 text-[10px] font-black text-gray-400 tracking-widest">BARIS</div>
                        <button type="button"
                            @click="editor.chain().focus().addRowBefore().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Icon icon="ph:arrow-line-up-bold" class="text-navy" /> Tambah Atas
                        </button>
                        <button type="button" @click="editor.chain().focus().addRowAfter().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Icon icon="ph:arrow-line-down-bold" class="text-navy" /> Tambah Bawah
                        </button>
                        <button type="button" @click="editor.chain().focus().deleteRow().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2">
                            <Icon icon="ph:trash-bold" /> Hapus Baris
                        </button>
                        <div class="border-t border-gray-100 my-1"></div>
                        <div class="px-3 py-1.5 text-[10px] font-black text-gray-400 tracking-widest">KOLOM</div>
                        <button type="button"
                            @click="editor.chain().focus().addColumnBefore().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Icon icon="ph:arrow-line-left-bold" class="text-navy" /> Kolom Sebelum
                        </button>
                        <button type="button"
                            @click="editor.chain().focus().addColumnAfter().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Icon icon="ph:arrow-line-right-bold" class="text-navy" /> Kolom Sesudah
                        </button>
                        <button type="button"
                            @click="editor.chain().focus().deleteColumn().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2">
                            <Icon icon="ph:trash-bold" /> Hapus Kolom
                        </button>
                        <div class="border-t border-gray-100 my-1"></div>
                        <div class="px-3 py-1.5 text-[10px] font-black text-gray-400 tracking-widest">SEL</div>
                        <button type="button" @click="editor.chain().focus().mergeCells().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Icon icon="ph:arrows-merge-bold" class="text-navy" /> Gabung Sel
                        </button>
                        <button type="button" @click="editor.chain().focus().splitCell().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                            <Icon icon="ph:arrows-split-bold" class="text-navy" /> Pisahkan Sel
                        </button>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button type="button" @click="editor.chain().focus().deleteTable().run(); tableMenuOpen = false"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2 rounded-b-lg">
                            <Icon icon="ph:trash-bold" /> Hapus Tabel
                        </button>
                    </template>
                </div>
            </div>

            <div class="w-px bg-gray-200 mx-1 self-stretch my-1"></div>

            <!-- Color picker -->
            <div class="relative" ref="colorMenuRef">
                <TBtn @click="colorMenuOpen = !colorMenuOpen" title="Warna teks" class="gap-1">
                    <Icon icon="ph:palette-bold" />
                    <span class="w-2.5 h-2.5 rounded-sm border border-gray-300"
                        :style="{ background: currentColor }"></span>
                </TBtn>
                <div v-if="colorMenuOpen" class="dropdown-menu p-3 min-w-[200px]">
                    <p class="text-[10px] font-black text-gray-400 tracking-widest mb-2">WARNA TEKS</p>
                    <div class="grid grid-cols-8 gap-1">
                        <button v-for="color in colorPalette" :key="color" type="button" @click="setColor(color)"
                            class="w-5 h-5 rounded hover:scale-125 transition-transform border border-white/40 shadow-sm"
                            :style="{ background: color }" :title="color" />
                    </div>
                    <div class="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                        <input type="color" :value="currentColor"
                            @input="setColor(($event.target as HTMLInputElement).value)"
                            class="h-7 w-10 rounded cursor-pointer border border-gray-200 p-0.5" />
                        <button type="button" @click="editor.chain().focus().unsetColor().run(); colorMenuOpen = false"
                            class="text-xs text-gray-500 hover:text-red-500 font-bold">Reset</button>
                    </div>
                </div>
            </div>

            <!-- Word count -->
            <div class="ml-auto flex items-center pl-2">
                <span class="text-[11px] text-gray-400 font-bold hidden sm:block whitespace-nowrap">
                    {{ editor.storage.characterCount?.characters() ?? 0 }} karakter ·
                    {{ editor.storage.characterCount?.words() ?? 0 }} kata
                </span>
            </div>
        </div>

        <!-- Editor content -->
        <EditorContent :editor="editor" class="editor-content" />

        <!-- Hidden file input -->
        <input ref="imageFileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

        <!-- ── Link Dialog ──────────────────────────────────────── -->
        <Teleport to="body">
            <div v-if="linkDialogOpen"
                class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                @mousedown.self="linkDialogOpen = false">
                <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-md mx-4">
                    <h3 class="text-base font-black text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:link-bold" class="text-primary" /> Tautkan URL
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <label class="text-xs font-bold text-gray-500 mb-1 block">URL</label>
                            <input v-model="linkUrl" type="url" placeholder="https://example.com"
                                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                @keydown.enter="applyLink" @keydown.escape="linkDialogOpen = false"
                                ref="linkInputRef" />
                        </div>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input id="link-blank" type="checkbox" v-model="linkOpenNewTab" class="rounded" />
                            <span class="text-sm font-bold text-gray-600">Buka di tab baru</span>
                        </label>
                    </div>
                    <div class="flex gap-2 mt-5">
                        <button type="button" @click="applyLink"
                            class="flex-1 px-4 py-2.5 bg-primary text-btn-text rounded-xl font-black text-sm hover:opacity-90 transition-opacity">
                            Terapkan
                        </button>
                        <button v-if="editor?.isActive('link')" type="button" @click="removeLink"
                            class="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-black text-sm hover:bg-red-100 transition-colors">
                            Hapus
                        </button>
                        <button type="button" @click="linkDialogOpen = false"
                            class="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-100 transition-colors">
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- ── Image URL Dialog ────────────────────────────────── -->
        <Teleport to="body">
            <div v-if="imageUrlMode"
                class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                @mousedown.self="imageUrlMode = false">
                <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-md mx-4">
                    <h3 class="text-base font-black text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:image-bold" class="text-primary" /> Sisipkan Gambar dari URL
                    </h3>
                    <div class="space-y-3">
                        <div>
                            <label class="text-xs font-bold text-gray-500 mb-1 block">URL Gambar</label>
                            <input v-model="imageUrl" type="url" placeholder="https://example.com/image.jpg"
                                class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                                @keydown.enter="insertImageUrl" @keydown.escape="imageUrlMode = false" />
                        </div>
                        <div v-if="imageUrl && !imageUrlError"
                            class="rounded-xl overflow-hidden border border-gray-100 max-h-40 bg-gray-50 flex items-center justify-center">
                            <img :src="imageUrl" class="max-h-40 w-auto object-contain" @error="imageUrlError = true"
                                @load="imageUrlError = false" />
                        </div>
                        <p v-if="imageUrlError" class="text-xs text-red-500 font-bold">URL gambar tidak valid.</p>
                    </div>
                    <div class="flex gap-2 mt-5">
                        <button type="button" @click="insertImageUrl" :disabled="!imageUrl || imageUrlError"
                            class="flex-1 px-4 py-2.5 bg-primary text-btn-text rounded-xl font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
                            Sisipkan
                        </button>
                        <button type="button" @click="imageUrlMode = false"
                            class="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-100 transition-colors">
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- ── YouTube Dialog ──────────────────────────────────── -->
        <Teleport to="body">
            <div v-if="youtubeDialogOpen"
                class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm"
                @mousedown.self="youtubeDialogOpen = false">
                <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-md mx-4">
                    <h3 class="text-base font-black text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:youtube-logo-bold" class="text-red-500" /> Embed YouTube
                    </h3>
                    <div>
                        <label class="text-xs font-bold text-gray-500 mb-1 block">URL Video YouTube</label>
                        <input v-model="youtubeUrl" type="url" placeholder="https://www.youtube.com/watch?v=..."
                            class="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm font-medium"
                            @keydown.enter="insertYoutube" @keydown.escape="youtubeDialogOpen = false" />
                    </div>
                    <div class="flex gap-2 mt-5">
                        <button type="button" @click="insertYoutube" :disabled="!youtubeUrl"
                            class="flex-1 px-4 py-2.5 bg-primary text-btn-text rounded-xl font-black text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
                            Sisipkan
                        </button>
                        <button type="button" @click="youtubeDialogOpen = false"
                            class="px-4 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-100 transition-colors">
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Media Library -->
        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />

        <!-- Upload overlay -->
        <Transition name="fade">
            <div v-if="uploading"
                class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-50">
                <div class="flex flex-col items-center gap-3">
                    <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin">
                    </div>
                    <span class="text-sm font-black text-navy">Mengupload gambar...</span>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TableKit } from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import CharacterCount from '@tiptap/extension-character-count'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { onClickOutside } from '@vueuse/core'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { useApi } from '~/composables/useApi'
import { Icon } from '@iconify/vue'

// ── Inline toolbar button component ──────────────────────────────────────────
const TBtn = defineComponent({
    name: 'TBtn',
    props: {
        active: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
    },
    setup(props, { slots, attrs }) {
        return () => h('button', {
            type: 'button',
            disabled: props.disabled,
            class: [
                'p-2 rounded-lg transition-all text-base flex items-center justify-center gap-1',
                props.active ? 'bg-navy text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-200',
                props.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
                attrs.class,
            ],
            ...Object.fromEntries(Object.entries(attrs).filter(([k]) => k !== 'class')),
        }, slots.default?.())
    },
})

// ── Props & Emits ─────────────────────────────────────────────────────────────
const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Mulai menulis konten di sini...' },
    minHeight: { type: String, default: '300px' },
})
const emit = defineEmits(['update:modelValue'])
const { post } = useApi()

// ── Dropdown refs ─────────────────────────────────────────────────────────────
const tableMenuOpen = ref(false)
const tableMenuRef = ref<HTMLElement | null>(null)
const headingMenuOpen = ref(false)
const headingMenuRef = ref<HTMLElement | null>(null)
const imageMenuOpen = ref(false)
const imageMenuRef = ref<HTMLElement | null>(null)
const colorMenuOpen = ref(false)
const colorMenuRef = ref<HTMLElement | null>(null)

onClickOutside(tableMenuRef, () => { tableMenuOpen.value = false })
onClickOutside(headingMenuRef, () => { headingMenuOpen.value = false })
onClickOutside(imageMenuRef, () => { imageMenuOpen.value = false })
onClickOutside(colorMenuRef, () => { colorMenuOpen.value = false })

// ── Dialog state ──────────────────────────────────────────────────────────────
const linkDialogOpen = ref(false)
const linkUrl = ref('')
const linkOpenNewTab = ref(true)
const linkInputRef = ref<HTMLInputElement | null>(null)

const imageUrlMode = ref(false)
const imageUrl = ref('')
const imageUrlError = ref(false)
const imageFileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)

const youtubeDialogOpen = ref(false)
const youtubeUrl = ref('')

const showMediaLibrary = ref(false)

// ── Colour palette ────────────────────────────────────────────────────────────
const colorPalette = [
    '#000000', '#1e293b', '#374151', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#ffffff',
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#D4AF37', '#0d1b3e',
]
const currentColor = computed(() => (editor.value?.getAttributes('textStyle') as any)?.color ?? '#1e293b')

// ── Heading options ────────────────────────────────────────────────────────────
const headingOptions = [
    { value: 0, label: 'Normal', size: '0.875rem' },
    { value: 1, label: 'Heading 1', size: '1.4rem' },
    { value: 2, label: 'Heading 2', size: '1.2rem' },
    { value: 3, label: 'Heading 3', size: '1.1rem' },
    { value: 4, label: 'Heading 4', size: '1rem' },
]

const currentHeading = computed(() => {
    if (!editor.value) return 'Normal'
    for (let i = 1; i <= 4; i++) {
        if (editor.value.isActive('heading', { level: i })) return `H${i}`
    }
    return 'Normal'
})

// ── Editor setup ──────────────────────────────────────────────────────────────
const editor = useEditor({
    content: props.modelValue,
    immediatelyRender: false,
    extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3, 4] }, taskList: false, taskItem: false }),
        TableKit.configure({ resizable: true }),
        Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'editor-image' } }),
        Link.configure({
            openOnClick: false,
            autolink: true,
            defaultProtocol: 'https',
            HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Underline,
        Highlight.configure({ multicolor: false }),
        TextStyle,
        Color,
        CharacterCount,
        Youtube.configure({ width: '100%', height: 360, nocookie: true }),
        Placeholder.configure({ placeholder: props.placeholder }),
        TaskList,
        TaskItem.configure({ nested: true }),
    ],
    editorProps: {
        attributes: {
            class: 'editor-prose focus:outline-none',
            style: `min-height: ${props.minHeight}`,
        },
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    },
})

watch(() => props.modelValue, (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
        editor.value.commands.setContent(value, false)
    }
}, { flush: 'post' })

onBeforeUnmount(() => { editor.value?.destroy() })

// ── Heading ───────────────────────────────────────────────────────────────────
const setHeading = (level: number) => {
    if (level === 0) {
        editor.value?.chain().focus().setParagraph().run()
    } else {
        editor.value?.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 }).run()
    }
}

// ── Link ──────────────────────────────────────────────────────────────────────
const openLinkDialog = () => {
    const linkAttrs = editor.value?.getAttributes('link') as any
    linkUrl.value = linkAttrs?.href ?? ''
    const targetAttr = linkAttrs?.target
    linkOpenNewTab.value = targetAttr === undefined ? true : targetAttr === '_blank'
    linkDialogOpen.value = true
    nextTick(() => linkInputRef.value?.focus())
}

const applyLink = () => {
    if (!linkUrl.value) {
        editor.value?.chain().focus().unsetLink().run()
    } else {
        editor.value?.chain().focus().setLink({
            href: linkUrl.value,
            target: linkOpenNewTab.value ? '_blank' : null,
        } as any).run()
    }
    linkDialogOpen.value = false
}

const removeLink = () => {
    editor.value?.chain().focus().unsetLink().run()
    linkDialogOpen.value = false
}

// ── Colour ────────────────────────────────────────────────────────────────────
const setColor = (color: string) => {
    editor.value?.chain().focus().setColor(color).run()
}

// ── Image: file upload ────────────────────────────────────────────────────────
const handleImageUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    uploading.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', file.name)
        const response = await post<{ url: string }>('/media/upload', formData)
        editor.value?.chain().focus().setImage({ src: response.url, alt: file.name } as any).run()
    } catch {
        useNuxtApp().$toast?.error?.('Gagal mengupload gambar')
    } finally {
        uploading.value = false
        if (imageFileInput.value) imageFileInput.value.value = ''
    }
}

// ── Image: URL ────────────────────────────────────────────────────────────────
const insertImageUrl = () => {
    if (!imageUrl.value || imageUrlError.value) return
    editor.value?.chain().focus().setImage({ src: imageUrl.value } as any).run()
    imageUrlMode.value = false
    imageUrl.value = ''
}

// ── Image: Media Library ──────────────────────────────────────────────────────
const handleMediaSelect = (media: { url: string; caption?: string }) => {
    editor.value?.chain().focus().setImage({ src: media.url, alt: media.caption ?? '' } as any).run()
    showMediaLibrary.value = false
}

// ── YouTube ───────────────────────────────────────────────────────────────────
const openYoutubeDialog = () => {
    youtubeUrl.value = ''
    youtubeDialogOpen.value = true
}
const insertYoutube = () => {
    if (!youtubeUrl.value) return
    editor.value?.commands.setYoutubeVideo({ src: youtubeUrl.value, width: '100%', height: 360 } as any)
    youtubeDialogOpen.value = false
}

// ── Table ─────────────────────────────────────────────────────────────────────
const insertTable = () => {
    editor.value?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    tableMenuOpen.value = false
}
</script>

<style>
/* ── Editor prose ──────────────────────────────────────────────────────────── */
.editor-prose {
    padding: 1.25rem 1.5rem;
    font-size: 0.9375rem;
    line-height: 1.8;
    color: #1e293b;
}

.editor-prose p {
    margin: 0.4em 0;
}

.editor-prose h1 {
    font-size: 1.875rem;
    font-weight: 900;
    margin: 1.25rem 0 0.5rem;
    color: #0f172a;
    line-height: 1.2;
}

.editor-prose h2 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 1rem 0 0.4rem;
    color: #0f172a;
}

.editor-prose h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0.875rem 0 0.35rem;
    color: #1e293b;
}

.editor-prose h4 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0.75rem 0 0.3rem;
    color: #1e293b;
}

.editor-prose ul {
    padding-left: 1.5em;
    list-style-type: disc;
    margin: 0.5em 0;
}

.editor-prose ol {
    padding-left: 1.5em;
    list-style-type: decimal;
    margin: 0.5em 0;
}

.editor-prose li {
    margin: 0.2em 0;
}

/* Task list */
.editor-prose ul[data-type="taskList"] {
    list-style: none;
    padding-left: 0;
}

.editor-prose ul[data-type="taskList"] li {
    display: flex;
    align-items: flex-start;
    gap: 0.5em;
}

.editor-prose ul[data-type="taskList"] li>label {
    flex-shrink: 0;
    margin-top: 0.25em;
    cursor: pointer;
}

.editor-prose ul[data-type="taskList"] li>label input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    accent-color: #D4AF37;
}

.editor-prose ul[data-type="taskList"] li[data-checked="true"]>div {
    text-decoration: line-through;
    opacity: 0.5;
}

/* Blockquote */
.editor-prose blockquote {
    border-left: 4px solid #D4AF37;
    padding: 0.5em 1em;
    margin: 0.75em 0;
    background: #fafaf7;
    border-radius: 0 0.5rem 0.5rem 0;
    color: #64748b;
    font-style: italic;
}

/* Inline code */
.editor-prose code {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    padding: 0.15em 0.4em;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.85em;
    color: #e11d48;
}

/* Code block */
.editor-prose pre {
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 0.75rem;
    padding: 1em 1.25em;
    margin: 0.75em 0;
    overflow-x: auto;
}

.editor-prose pre code {
    background: transparent;
    border: none;
    color: inherit;
    font-size: 0.875em;
    padding: 0;
}

.editor-prose hr {
    border: none;
    border-top: 2px solid #e2e8f0;
    margin: 1.25em 0;
}

/* Links */
.editor-prose a {
    color: #2563eb;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
}

.editor-prose a:hover {
    color: #1d4ed8;
}

/* Images */
.editor-image {
    max-width: 100%;
    height: auto;
    border-radius: 0.75rem;
    margin: 0.75em auto;
    display: block;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.10);
}

.editor-prose .ProseMirror-selectednode .editor-image,
.editor-image.ProseMirror-selectednode {
    outline: 3px solid #D4AF37;
    outline-offset: 2px;
}

/* YouTube iframes */
.editor-prose div[data-youtube-video] {
    margin: 0.75em 0;
    border-radius: 0.75rem;
    overflow: hidden;
}

.editor-prose div[data-youtube-video] iframe {
    width: 100%;
    border-radius: 0.75rem;
    display: block;
}

/* Tables */
.editor-prose table {
    border-collapse: collapse;
    width: 100%;
    margin: 0.75em 0;
    table-layout: fixed;
}

.editor-prose table td,
.editor-prose table th {
    border: 1px solid #cbd5e1;
    padding: 0.5em 0.75em;
    vertical-align: top;
    min-width: 1em;
}

.editor-prose table th {
    background: #f1f5f9;
    font-weight: 700;
    text-align: left;
}

.editor-prose table .selectedCell::after {
    z-index: 2;
    position: absolute;
    content: "";
    inset: 0;
    background: rgba(212, 175, 55, 0.12);
    pointer-events: none;
}

.editor-prose table td,
.editor-prose table th {
    position: relative;
}

.editor-prose table .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #D4AF37;
    pointer-events: none;
}

.editor-prose .tableWrapper {
    overflow-x: auto;
}

.tiptap-editor .ProseMirror.resize-cursor {
    cursor: col-resize;
}

/* Placeholder */
.editor-prose .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #94a3b8;
    pointer-events: none;
    height: 0;
}

/* ── Dropdown ─────────────────────────────────────────────────────────────── */
.dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 100;
    min-width: 160px;
    padding: 0.25rem;
    animation: dropdown-in 0.1s ease;
}

@keyframes dropdown-in {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ── Slide transition for upload overlay ──────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
