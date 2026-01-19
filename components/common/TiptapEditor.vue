<template>
    <div class="tiptap-editor">
        <div v-if="editor" class="toolbar flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg">
            <button type="button" @click="editor.chain().focus().toggleBold().run()"
                :class="{ 'bg-gray-200': editor.isActive('bold') }"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">format_bold</span>
            </button>
            <button type="button" @click="editor.chain().focus().toggleItalic().run()"
                :class="{ 'bg-gray-200': editor.isActive('italic') }"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">format_italic</span>
            </button>
            <button type="button" @click="editor.chain().focus().toggleStrike().run()"
                :class="{ 'bg-gray-200': editor.isActive('strike') }"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">strikethrough_s</span>
            </button>

            <div class="w-px bg-gray-300 mx-1"></div>

            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                :class="{ 'bg-gray-200': editor.isActive('heading', { level: 2 }) }"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">title</span>
            </button>
            <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                :class="{ 'bg-gray-200': editor.isActive('heading', { level: 3 }) }"
                class="p-2 rounded hover:bg-gray-100 transition-colors text-sm font-bold">
                H3
            </button>

            <div class="w-px bg-gray-300 mx-1"></div>

            <button type="button" @click="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'bg-gray-200': editor.isActive('bulletList') }"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">format_list_bulleted</span>
            </button>
            <button type="button" @click="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'bg-gray-200': editor.isActive('orderedList') }"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">format_list_numbered</span>
            </button>

            <div class="w-px bg-gray-300 mx-1"></div>

            <button type="button" @click="editor.chain().focus().toggleBlockquote().run()"
                :class="{ 'bg-gray-200': editor.isActive('blockquote') }"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">format_quote</span>
            </button>
            <button type="button" @click="editor.chain().focus().setHorizontalRule().run()"
                class="p-2 rounded hover:bg-gray-100 transition-colors">
                <span class="material-symbols-outlined text-lg">horizontal_rule</span>
            </button>

            <div class="w-px bg-gray-300 mx-1"></div>

            <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()"
                class="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-30">
                <span class="material-symbols-outlined text-lg">undo</span>
            </button>
            <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()"
                class="p-2 rounded hover:bg-gray-100 transition-colors disabled:opacity-30">
                <span class="material-symbols-outlined text-lg">redo</span>
            </button>
        </div>

        <EditorContent :editor="editor" class="prose prose-sm max-w-none" />
    </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
    modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
    content: props.modelValue,
    extensions: [StarterKit],
    editorProps: {
        attributes: {
            class: 'min-h-[160px] p-4 bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset'
        }
    },
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
    }
})

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
    min-height: 160px;
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
</style>
