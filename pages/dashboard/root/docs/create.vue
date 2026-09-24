<template>
    <div>
        <DocEditor :is-edit="false" />
    </div>
</template>

<script setup>
import DocEditor from '~/components/dashboard/DocEditor.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useHead({
    title: 'Buat Dokumen Baru - Archeris Root'
})
</script>
