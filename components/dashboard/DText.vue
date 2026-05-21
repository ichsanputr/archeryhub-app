<script setup lang="ts">
import { defineProps } from 'vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

const props = defineProps<{ k: string; fallback?: string }>()
const { t } = useDashboardI18n()
</script>

<template>
  <span>{{ t(props.k, props.fallback || '') }}</span>
</template>
