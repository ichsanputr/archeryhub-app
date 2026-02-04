<template>
    <ClientOnly>
        <div class="tiptap-editor">
            <div v-if="editor" class="toolbar flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
                <!-- Text formatting -->
                <button type="button" @click="editor.chain().focus().toggleBold().run()"
                    :class="{ 'bg-gray-200': editor.isActive('bold') }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Bold">
                    <Icon icon="ph:text-b-bold" class="text-lg" />
                </button>
                <button type="button" @click="editor.chain().focus().toggleItalic().run()"
                    :class="{ 'bg-gray-200': editor.isActive('italic') }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Italic">
                    <Icon icon="ph:text-italic-bold" class="text-lg" />
                </button>
                <button type="button" @click="editor.chain().focus().toggleStrike().run()"
                    :class="{ 'bg-gray-200': editor.isActive('strike') }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Strikethrough">
                    <Icon icon="ph:text-strikethrough-bold" class="text-lg" />
                </button>

                <div class="w-px bg-gray-300 mx-1"></div>

                <!-- Headings -->
                <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                    :class="{ 'bg-gray-200': editor.isActive('heading', { level: 2 }) }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Heading 2">
                    <Icon icon="ph:text-h-two-bold" class="text-lg" />
                </button>
                <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                    :class="{ 'bg-gray-200': editor.isActive('heading', { level: 3 }) }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Heading 3">
                    <Icon icon="ph:text-h-three-bold" class="text-lg" />
                </button>

                <div class="w-px bg-gray-300 mx-1"></div>

                <!-- Lists -->
                <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'bg-gray-200': editor.isActive('bulletList') }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Bullet List">
                    <Icon icon="ph:list-bullets-bold" class="text-lg" />
                </button>
                <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'bg-gray-200': editor.isActive('orderedList') }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Numbered List">
                    <Icon icon="ph:list-numbers-bold" class="text-lg" />
                </button>

                <div class="w-px bg-gray-300 mx-1"></div>

                <!-- Block elements -->
                <button type="button" @click="editor.chain().focus().toggleBlockquote().run()"
                    :class="{ 'bg-gray-200': editor.isActive('blockquote') }"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Quote">
                    <Icon icon="ph:quotes-bold" class="text-lg" />
                </button>
                <button type="button" @click="editor.chain().focus().setHorizontalRule().run()"
                    class="p-2 rounded hover:bg-gray-100 transition-colors" title="Horizontal Rule">
                    <Icon icon="ph:minus-bold" class="text-lg" />
                </button>

                <div class="w-px bg-gray-300 mx-1"></div>

                <!-- Table controls -->
                <div class="relative" ref="tableMenuRef">
                    <button type="button" @click="tableMenuOpen = !tableMenuOpen"
                        :class="{ 'bg-gray-200': editor.isActive('table') }"
                        class="p-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-1" title="Table">
                        <Icon icon="ph:table-bold" class="text-lg" />
                        <Icon icon="ph:caret-down" class="text-sm" />
                    </button>

                    <!-- Table dropdown menu -->
                    <div v-if="tableMenuOpen"
                        class="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px] py-1">
                        <!-- Insert table -->
                        <button type="button" v-if="!editor.isActive('table')" @click="insertTable()"
                            class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                            <Icon icon="ph:plus-bold" class="text-base" />
                            Insert Table
                        </button>

                        <!-- Table operations (only shown when inside a table) -->
                        <template v-if="editor.isActive('table')">
                            <div class="px-3 py-1 text-xs font-semibold text-gray-500 ">Rows</div>
                            <button type="button"
                                @click="editor.chain().focus().addRowBefore().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                <Icon icon="ph:arrow-line-up-bold" class="text-base" />
                                Add Row Above
                            </button>
                            <button type="button"
                                @click="editor.chain().focus().addRowAfter().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                <Icon icon="ph:arrow-line-down-bold" class="text-base" />
                                Add Row Below
                            </button>
                            <button type="button"
                                @click="editor.chain().focus().deleteRow().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2">
                                <Icon icon="ph:trash-bold" class="text-base" />
                                Delete Row
                            </button>

                            <div class="border-t border-gray-100 my-1"></div>
                            <div class="px-3 py-1 text-xs font-semibold text-gray-500 ">Columns</div>
                            <button type="button"
                                @click="editor.chain().focus().addColumnBefore().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                <Icon icon="ph:arrow-line-left-bold" class="text-base" />
                                Add Column Before
                            </button>
                            <button type="button"
                                @click="editor.chain().focus().addColumnAfter().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                <Icon icon="ph:arrow-line-right-bold" class="text-base" />
                                Add Column After
                            </button>
                            <button type="button"
                                @click="editor.chain().focus().deleteColumn().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2">
                                <Icon icon="ph:trash-bold" class="text-base" />
                                Delete Column
                            </button>

                            <div class="border-t border-gray-100 my-1"></div>
                            <div class="px-3 py-1 text-xs font-semibold text-gray-500 ">Cells</div>
                            <button type="button"
                                @click="editor.chain().focus().mergeCells().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                <Icon icon="ph:arrows-merge-bold" class="text-base" />
                                Merge Cells
                            </button>
                            <button type="button"
                                @click="editor.chain().focus().splitCell().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                <Icon icon="ph:arrows-split-bold" class="text-base" />
                                Split Cell
                            </button>
                            <button type="button"
                                @click="editor.chain().focus().toggleHeaderCell().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                                <Icon icon="ph:text-h-bold" class="text-base" />
                                Toggle Header Cell
                            </button>

                            <div class="border-t border-gray-100 my-1"></div>
                            <button type="button"
                                @click="editor.chain().focus().deleteTable().run(); tableMenuOpen = false"
                                class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2">
                                <Icon icon="ph:trash-bold" class="text-base" />
                                Delete Table
                            </button>
                        </template>
                    </div>
                </div>

                <div class="w-px bg-gray-300 mx-1"></div>

                <!-- Undo/Redo -->
                <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()"
                    class="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-30" title="Undo">
                    <Icon icon="ph:arrow-counter-clockwise-bold" class="text-lg" />
                </button>
                <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()"
                    class="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-30" title="Redo">
                    <Icon icon="ph:arrow-clockwise-bold" class="text-lg" />
                </button>
            </div>

            <EditorContent :editor="editor" class="prose prose-sm max-w-none" />
        </div>
        <template #fallback>
            <div class="min-h-[200px] bg-gray-50 border border-gray-200 rounded-lg animate-pulse"></div>
        </template>
    </ClientOnly>
</template>


<script setup>
import { Icon } from '@iconify/vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { TableKit } from '@tiptap/extension-table'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
    modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const tableMenuOpen = ref(false)
const tableMenuRef = ref(null)

// Close table menu when clicking outside
onClickOutside(tableMenuRef, () => {
    tableMenuOpen.value = false
})

const editor = useEditor({
    content: props.modelValue,
    extensions: [
        StarterKit,
        TableKit.configure({
            resizable: true,
            HTMLAttributes: {
                class: 'tiptap-table',
            },
        }),
    ],
    editorProps: {
        attributes: {
            class: 'min-h-[160px] p-4 bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset'
        }
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    }
})

const insertTable = () => {
    editor.value.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    tableMenuOpen.value = false
}

watch(() => props.modelValue, (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
        editor.value.commands.setContent(value, false)
    }
})

onBeforeUnmount(() => {
    editor.value?.destroy()
})
</script>

<style>
.tiptap-editor .ProseMirror {
    min-height: 300px;
}

.tiptap-editor .ProseMirror p {
    margin: 0.5em 0;
}

.tiptap-editor .ProseMirror h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 1em 0 0.5em;
}

.tiptap-editor .ProseMirror h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0.75em 0 0.5em;
}

.tiptap-editor .ProseMirror ul,
.tiptap-editor .ProseMirror ol {
    padding-left: 1.5em;
    margin: 0.5em 0;
}

.tiptap-editor .ProseMirror blockquote {
    border-left: 3px solid #e5e7eb;
    padding-left: 1em;
    margin: 0.5em 0;
    color: #6b7280;
}

.tiptap-editor .ProseMirror hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 1em 0;
}

/* Table styles */
.tiptap-editor .ProseMirror table {
    border-collapse: collapse;
    margin: 1em 0;
    width: 100%;
    table-layout: fixed;
    overflow: hidden;
}

.tiptap-editor .ProseMirror table td,
.tiptap-editor .ProseMirror table th {
    min-width: 1em;
    border: 1px solid #d1d5db;
    padding: 0.5em 0.75em;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
}

.tiptap-editor .ProseMirror table th {
    font-weight: 600;
    text-align: left;
    background-color: #f3f4f6;
}

.tiptap-editor .ProseMirror table .selectedCell:after {
    z-index: 2;
    position: absolute;
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(59, 130, 246, 0.1);
    pointer-events: none;
}

.tiptap-editor .ProseMirror table .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: -2px;
    width: 4px;
    background-color: #3b82f6;
    pointer-events: none;
}

.tiptap-editor .ProseMirror.resize-cursor {
    cursor: col-resize;
}

/* Table wrapper for horizontal scroll on small screens */
.tiptap-editor .tableWrapper {
    overflow-x: auto;
    margin: 1em 0;
}
</style>
