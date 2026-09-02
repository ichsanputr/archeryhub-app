<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('dashboard.reports.title')"
      :subtitle="t('dashboard.reports.subtitle')"
      icon="ph:chart-bar-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.reports.title', 'Laporan') }
      ]"
    />

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
          <div class="text-gray-500 text-xs font-medium leading-relaxed">{{ report.description }}</div>
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

useHead({ title: computed(() => t('reports.title', 'Reports') + ' - Archeris Dashboard') })


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
    path: '/dashboard/organizer/reports/participants',
    bgColor: 'bg-navy',
    textColor: 'text-primary'
  },
  {
    title: t('dashboard.reports.finance_title'),
    description: t('dashboard.reports.finance_desc'),
    icon: 'ph:currency-circle-dollar-bold',
    path: '/dashboard/organizer/reports/finance',
    bgColor: 'bg-navy',
    textColor: 'text-primary'
  },
  {
    title: t('dashboard.reports.performance_title'),
    description: t('dashboard.reports.performance_desc'),
    icon: 'ph:target-bold',
    path: '/dashboard/organizer/reports/performance',
    bgColor: 'bg-navy',
    textColor: 'text-primary'
  },
  {
    title: t('dashboard.reports.attendance_title'),
    description: t('dashboard.reports.attendance_desc'),
    icon: 'ph:check-circle-bold',
    path: '/dashboard/organizer/reports/attendance',
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
