<template>
    <pre><code ref="codeBlock" :class="language">{{ code }}</code></pre>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github-dark.css';

const props = defineProps({
    code: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    showLineNumbers: { type: Boolean, default: false }
});

const codeBlock = ref(null);

// Track loaded languages & plugin
const loadedLangs = new Set();
let lineNumbersLoaded = false;

// Dynamic language loader (bundles only what is needed)
const loadLanguage = async (lang) => {
    console.log(lang);
    if (loadedLangs.has(lang)) return;
    loadedLangs.add(lang);

    const modules = {
        javascript: () => import('highlight.js/lib/languages/javascript'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        rust: () => import('highlight.js/lib/languages/rust'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml'),
        python: () => import('highlight.js/lib/languages/python'),
        plaintext: () => import('highlight.js/lib/languages/plaintext'),
        sql: () => import('highlight.js/lib/languages/sql'),
        php: () => import('highlight.js/lib/languages/php'),
        java: () => import('highlight.js/lib/languages/java'),
        go: () => import('highlight.js/lib/languages/go'),
        ruby: () => import('highlight.js/lib/languages/ruby'),
        bash: () => import('highlight.js/lib/languages/bash'),
        shell: () => import('highlight.js/lib/languages/shell'),
        kotlin: () => import('highlight.js/lib/languages/kotlin'),
        matlab: () => import('highlight.js/lib/languages/matlab'),
        tex: () => import('highlight.js/lib/languages/latex'),
        makefile: () => import('highlight.js/lib/languages/makefile'),
        markdown: () => import('highlight.js/lib/languages/markdown'),
        nginx: () => import('highlight.js/lib/languages/nginx'),
        perl: () => import('highlight.js/lib/languages/perl'),
        powershell: () => import('highlight.js/lib/languages/powershell'),
        r: () => import('highlight.js/lib/languages/r'),
        scss: () => import('highlight.js/lib/languages/scss'),
        scala: () => import('highlight.js/lib/languages/scala'),
        solidity: () => import('highlightjs-solidity/dist/solidity.es.min.js'),
        swift: () => import('highlight.js/lib/languages/swift'),
        terraform: () => import('highlight.js/lib/languages/plaintext'),
        yaml: () => import('highlight.js/lib/languages/yaml'),
        c: () => import('highlight.js/lib/languages/c'),
        cpp: () => import('highlight.js/lib/languages/cpp'),
        dockerfile: () => import('highlight.js/lib/languages/dockerfile'),
        graphql: () => import('highlight.js/lib/languages/graphql'),
        haskell: () => import('highlight.js/lib/languages/haskell'),
        lua: () => import('highlight.js/lib/languages/lua'),
    };

    if (!modules[lang]) return;

    console.log(modules[lang]);

    const module = await modules[lang]();
    hljs.registerLanguage(lang, module.default);
};

// Lazy load line numbers plugin
const loadLineNumbersPlugin = async () => {
    if (!props.showLineNumbers || !process.client || lineNumbersLoaded) return;

    await import('highlightjs-line-numbers.js');

    lineNumbersLoaded = true;
};

// Highlight block
const highlight = async () => {
    if (!codeBlock.value) return;

    await loadLanguage(props.language);
    await nextTick();

    hljs.highlightElement(codeBlock.value);

    if (props.showLineNumbers) {
        await loadLineNumbersPlugin();
        if (window.hljs?.lineNumbersBlock) {
            window.hljs.lineNumbersBlock(codeBlock.value);
        }
    }
};

onMounted(() => {
    if (process.client) {
        window.hljs = hljs;
    }
    highlight();
});

watch(() => props.code, highlight);
watch(() => props.language, highlight);
</script>

<style scoped>
pre {
    background: #1e1e1e;
    overflow-x: auto;
}

/* Line numbers styling */
:deep(.hljs-ln-numbers) {
    text-align: right;
    color: #5a5a5a;
    border-right: 1px solid #3e3e3e;
    vertical-align: top;
    padding-right: 8px !important;
    user-select: none;
}

:deep(.hljs-ln-code) {
    padding-left: 10px !important;
}
</style>
