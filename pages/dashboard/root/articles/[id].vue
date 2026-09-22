<template>
    <div>
        <ArticleEditor :article-id="articleId" />
    </div>
</template>

<script setup>
import ArticleEditor from '~/components/dashboard/ArticleEditor.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const route = useRoute()
const { t } = useI18n()
const articleId = String(route.params.id)

useHead({
    title: computed(() => `${t('root.articles.edit_title')} - Archeris Root`)
})
</script>
