<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
    <Container>
      <div class="py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div class="text-navy font-bold animate-pulse">{{ t('profile_public.loading_profile') }}</div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="ph:user-focus" class="w-10 h-10" />
          </div>
          <h2 class="text-2xl font-black text-navy mb-2">{{ t('profile_public.profile_not_found') }}</h2>
          <div class="text-text-secondary mb-8 max-w-sm mx-auto">{{ error }}</div>
          <BaseButton :to="`/dashboard/${userPersona}/events`" variant="primary" icon="ph:arrow-left">
            {{ t('profile_public.back_to_home') }}
          </BaseButton>
        </div>

        <!-- Profile Content -->
        <div v-else-if="profile" class="space-y-6">
          <!-- Header Section -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Cover with gradient -->
            <div class="h-32 bg-gradient-to-r from-navy via-primary to-navy"></div>

            <!-- Profile Info -->
            <div class="relative px-6 pb-6">
              <!-- Avatar -->
              <div class="absolute -top-16 left-6">
                <img :src="useImageOrDefault(profile.avatar_url, profile.name || profile.username)"
                  :alt="profile.name || profile.username"
                  class="w-32 h-32 rounded-full border-4 border-white shadow-lg" />
              </div>

              <!-- User Info -->
              <div class="pt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900">{{ profile.name || profile.username }}</h1>
                  <div class="text-gray-600 mt-1">@{{ profile.username }}</div>
                  <div class="text-sm text-gray-500 mt-2">
                    <Icon icon="ph:calendar" class="inline w-4 h-4 mr-1" />
                    {{ t('profile_public.joined') }} {{ formatDate(profile.created_at) }}
                  </div>
                </div>

                <!-- Level Badge -->
                <div class="flex-shrink-0">
                  <UserLevelBadge :level="profile.level" :current-x-p="profile.experience_points"
                    :next-level-x-p="profile.next_level_xp" :current-level-min-x-p="profile.current_level_min_xp"
                    :level-title="profile.level_title" :title-color="profile.level_title_color"
                    :badge-icon="profile.badge_icon" :badge-gradient="profile.badge_gradient" :show-progress="true" />
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow group">
              <div
                class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary transition-colors">
                <Icon icon="ph:check-circle-fill" class="w-6 h-6 text-primary group-hover:text-navy" />
              </div>
              <div class="text-3xl font-black text-navy">{{ profile.total_solved }}</div>
              <div class="text-sm text-text-secondary mt-1 font-medium">{{ t('profile_public.events_participated') }}</div>
            </div>

            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon icon="ph:fire-fill" class="w-6 h-6 text-green-600" />
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ profile.current_streak }}</div>
              <div class="text-sm text-gray-600 mt-1">{{ t('profile_public.current_streak') }}</div>
            </div>

            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow group">
              <div
                class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-500 transition-colors">
                <Icon icon="ph:trophy-fill" class="w-6 h-6 text-orange-600 group-hover:text-white" />
              </div>
              <div class="text-3xl font-black text-navy">{{ profile.longest_streak }}</div>
              <div class="text-sm text-text-secondary mt-1 font-medium">{{ t('profile_public.best_achievement') }}</div>
            </div>

            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon icon="ph:percent-fill" class="w-6 h-6 text-purple-600" />
              </div>
              <div class="text-3xl font-bold text-gray-900">{{ Math.round(profile.success_rate) }}%</div>
              <div class="text-sm text-gray-600 mt-1">{{ t('profile_public.success_rate') }}</div>
            </div>
          </div>

          <!-- Activity Heatmap -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <ActivityHeatmap v-if="activityData.length > 0" :activity-data="activityData"
              :current-streak="profile.current_streak" :longest-streak="profile.longest_streak" />
            <div v-else class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Icon icon="ph:calendar-blank" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <div class="text-text-secondary font-medium">{{ t('profile_public.no_activity_data') }}</div>
            </div>
          </div>

          <!-- Problem Breakdown -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{{ t('profile_public.problems_by_difficulty') }}</h2>
            <div class="space-y-4">
              <!-- Easy -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span class="font-semibold text-gray-900">{{ t('profile_public.difficulty_easy') }}</span>
                  </div>
                  <span class="text-gray-600">{{ profile.easy_solved }} {{ t('profile_public.solved') }}</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-green-500 transition-all duration-500"
                    :style="{ width: `${getPercentage(profile.easy_solved, profile.total_solved)}%` }"></div>
                </div>
              </div>

              <!-- Medium -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span class="font-semibold text-gray-900">{{ t('profile_public.difficulty_medium') }}</span>
                  </div>
                  <span class="text-gray-600">{{ profile.medium_solved }} {{ t('profile_public.solved') }}</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-yellow-500 transition-all duration-500"
                    :style="{ width: `${getPercentage(profile.medium_solved, profile.total_solved)}%` }"></div>
                </div>
              </div>

              <!-- Hard -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <span class="font-semibold text-gray-900">{{ t('profile_public.difficulty_hard') }}</span>
                  </div>
                  <span class="text-gray-600">{{ profile.hard_solved }} {{ t('profile_public.solved') }}</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div class="h-full bg-red-500 transition-all duration-500"
                    :style="{ width: `${getPercentage(profile.hard_solved, profile.total_solved)}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submission Stats -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{{ t('profile_public.submission_statistics') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center p-4 bg-blue-50 rounded-xl">
                <div class="text-4xl font-bold text-blue-600">{{ profile.total_submissions }}</div>
                <div class="text-sm text-gray-600 mt-2">{{ t('profile_public.total_submissions') }}</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-xl">
                <div class="text-4xl font-bold text-green-600">{{ profile.total_solved }}</div>
                <div class="text-sm text-gray-600 mt-2">{{ t('profile_public.accepted') }}</div>
              </div>
              <div class="text-center p-4 bg-red-50 rounded-xl">
                <div class="text-4xl font-bold text-red-600">{{ profile.total_submissions - profile.total_solved }}</div>
                <div class="text-sm text-gray-600 mt-2">{{ t('profile_public.failed') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'
import UserLevelBadge from '~/components/UserLevelBadge.vue'
import ActivityHeatmap from '~/components/ActivityHeatmap.vue'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'

const route = useRoute()
const { apiBaseUrl } = useApi()
const { t } = useI18n()

const username = route.params.username
const profile = ref(null)
const activityData = ref([])
const loading = ref(true)
const error = ref(null)

// Fetch user profile
const fetchProfile = async () => {
  try {
    const response = await $fetch(`${apiBaseUrl}/public/user/${username}`)
    if (response && response.data) {
      profile.value = response.data
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = err.message || 'Failed to load user profile'
  }
}

// Fetch activity data
const fetchActivity = async () => {
  try {
    const response = await $fetch(`${apiBaseUrl}/public/user/${username}/activity`)
    if (response && response.data) {
      activityData.value = response.data
    }
  } catch (err) {
    console.error('Error fetching activity:', err)
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Get percentage
const getPercentage = (value, total) => {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchActivity()])
  loading.value = false
})

// SEO
useHead({
  title: `${username} - Profil | Archeryhub.id`,
  meta: [
    { name: 'description', content: `Lihat profil panahan, statistik, dan riwayat turnamen ${username} di Archeryhub.id` }
  ]
})
</script>

<style scoped>
/* Additional animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
