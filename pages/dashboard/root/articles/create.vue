<template>
    <div>
        <ArticleEditor />
    </div>
</template>

<script setup>
import ArticleEditor from '~/components/dashboard/ArticleEditor.vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const { t } = useI18n()

useHead({
    title: computed(() => `${t('root.articles.create_title')} - Archeris Root`)
})
</script>
