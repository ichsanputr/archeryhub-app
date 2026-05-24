<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-5">
          <div
            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Icon icon="ph:chart-bar-bold" class="text-primary text-2xl sm:text-3xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none">{{ t('dashboard.reports.title') }}</h1>
            <p class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wider">{{ t('dashboard.reports.subtitle') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Event Filter Information Alert (if event_id query is passed) -->
    <div v-if="eventName" class="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary text-xs font-bold transition-all">
      <Icon icon="ph:info-bold" class="text-lg shrink-0" />
      <span>
        Filtering Reports for Event: <span class="text-navy-dark underline">{{ eventName }}</span>. You can clear this filter inside individual reports.
      </span>
    </div>

    <!-- Reports Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink 
        v-for="report in reportTypes" 
        :key="report.path" 
        :to="getLink(report.path)"
        class="group relative bg-white border border-gray-200 hover:border-primary/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-start gap-5 overflow-hidden"
      >
        <!-- hover background accent -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div :class="[report.bgColor, report.textColor]" class="size-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
          <Icon :icon="report.icon" class="text-2xl" />
        </div>
        
        <div class="space-y-1 relative z-10 flex-1">
          <h3 class="text-navy-dark font-black text-base group-hover:text-primary transition-colors flex items-center gap-2">
            {{ report.title }}
            <Icon icon="ph:arrow-right-bold" class="text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </h3>
          <p class="text-gray-500 text-xs font-medium leading-relaxed">{{ report.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const api = useApi()

const eventId = computed(() => route.query.event_id || '')
const eventName = ref('')

onMounted(() => {
  if (eventId.value) {
    fetchEventName()
  }
})

const fetchEventName = async () => {
  try {
    const res = await api.get(`/events/${eventId.value}`)
    if (res && res.name) {
      eventName.value = res.name
    }
  } catch (err) {
    console.error('failed to fetch event name:', err)
  }
}

const getLink = (path) => {
  return eventId.value ? `${path}?event_id=${eventId.value}` : path
}

const reportTypes = computed(() => [
  {
    title: t('dashboard.reports.participants_title'),
    description: t('dashboard.reports.participants_desc'),
    icon: 'ph:users-three-bold',
    path: '/dashboard/organization/reports/participants',
    bgColor: 'bg-navy',
    textColor: 'text-primary'
  },
  {
    title: t('dashboard.reports.finance_title'),
    description: t('dashboard.reports.finance_desc'),
    icon: 'ph:currency-circle-dollar-bold',
    path: '/dashboard/organization/reports/finance',
    bgColor: 'bg-navy',
    textColor: 'text-primary'
  },
  {
    title: t('dashboard.reports.performance_title'),
    description: t('dashboard.reports.performance_desc'),
    icon: 'ph:target-bold',
    path: '/dashboard/organization/reports/performance',
    bgColor: 'bg-navy',
    textColor: 'text-primary'
  },
  {
    title: t('dashboard.reports.attendance_title'),
    description: t('dashboard.reports.attendance_desc'),
    icon: 'ph:check-circle-bold',
    path: '/dashboard/organization/reports/attendance',
    bgColor: 'bg-navy',
    textColor: 'text-primary'
  }
])
</script>

<style scoped>
.bg-navy {
  background-color: var(--sidebar-bg, #0f172a);
}
</style>
