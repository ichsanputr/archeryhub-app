<template>
  <div>
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="min-h-screen bg-slate-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
      <div class="h-64 bg-slate-200 rounded-3xl"></div>
      <div class="h-16 bg-slate-200 rounded-2xl"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="h-48 bg-slate-200 rounded-2xl"></div>
        <div class="h-48 bg-slate-200 rounded-2xl"></div>
        <div class="h-48 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMessage" class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-3xl p-8 text-center space-y-4 shadow-sm border border-slate-200">
        <div class="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto text-2xl">
          <Icon icon="ph:warning-circle-bold" />
        </div>
        <h2 class="text-xl font-black text-navy">Tournament Not Found</h2>
        <p class="text-xs text-slate-500 leading-relaxed">{{ errorMessage }}</p>
        <NuxtLink to="/tournaments" class="inline-flex items-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl text-xs transition-colors">
          <Icon icon="ph:arrow-left-bold" />
          <span>Browse All Tournaments</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Main Tournament Detail View -->
    <TournamentExternalDetailView 
      v-else 
      :tournament="tournament" 
      :tournament-data="tournamentData" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import TournamentExternalDetailView from '~/components/tournament/TournamentExternalDetailView.vue'

definePageMeta({
  layout: 'landing',
  headerTransparent: true,
  headerSticky: false,
  wideContainer: true
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBase = config.public.apiBaseUrl || 'http://localhost:8001'

const slug = route.params.slug || '23662'

const { data: responseData, pending: isLoading, error } = await useAsyncData(
  `tournament-external-${slug}`,
  () => $fetch(`${apiBase}/tournaments/external/${slug}`),
  {
    lazy: false,
    server: true
  }
)

const tournament = computed(() => responseData.value?.tournament || null)
const tournamentData = computed(() => responseData.value?.data || null)
const errorMessage = computed(() => error.value ? (error.value.message || 'Failed to load tournament data') : '')
</script>
