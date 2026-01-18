<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
    <Container>
      <div class="py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="inline-block w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
            <p class="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <Icon icon="ph:warning-circle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <NuxtLink to="/problem" class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">
            <Icon icon="ph:arrow-left" class="w-5 h-5" />
            Back to Problems
          </NuxtLink>
        </div>

        <!-- Profile Content -->
        <div v-else-if="profile" class="space-y-6">
          <!-- Header Section -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <!-- Cover with gradient -->
            <div class="h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400"></div>
            
            <!-- Profile Info -->
            <div class="relative px-6 pb-6">
              <!-- Avatar -->
              <div class="absolute -top-16 left-6">
                <img 
                  :src="profile.avatar_url" 
                  :alt="profile.name || profile.username"
                  class="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
              </div>

              <!-- User Info -->
              <div class="pt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 class="text-3xl font-bold text-gray-900">{{ profile.name || profile.username }}</h1>
                  <p class="text-gray-600 mt-1">@{{ profile.username }}</p>
                  <p class="text-sm text-gray-500 mt-2">
                    <Icon icon="ph:calendar" class="inline w-4 h-4 mr-1" />
                    Joined {{ formatDate(profile.created_at) }}
                  </p>
                </div>

                <!-- Level Badge -->
                <div class="flex-shrink-0">
                  <UserLevelBadge
                    :level="profile.level"
                    :current-x-p="profile.experience_points"
                    :next-level-x-p="profile.next_level_xp"
                    :current-level-min-x-p="profile.current_level_min_xp"
                    :level-title="profile.level_title"
                    :title-color="profile.level_title_color"
                    :badge-icon="profile.badge_icon"
                    :badge-gradient="profile.badge_gradient"
                    :show-progress="true"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon icon="ph:check-circle-fill" class="w-6 h-6 text-yellow-600" />
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ profile.total_solved }}</p>
              <p class="text-sm text-gray-600 mt-1">Problems Solved</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon icon="ph:fire-fill" class="w-6 h-6 text-green-600" />
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ profile.current_streak }}</p>
              <p class="text-sm text-gray-600 mt-1">Current Streak</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon icon="ph:trophy-fill" class="w-6 h-6 text-orange-600" />
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ profile.longest_streak }}</p>
              <p class="text-sm text-gray-600 mt-1">Longest Streak</p>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon icon="ph:percent-fill" class="w-6 h-6 text-purple-600" />
              </div>
              <p class="text-3xl font-bold text-gray-900">{{ Math.round(profile.success_rate) }}%</p>
              <p class="text-sm text-gray-600 mt-1">Success Rate</p>
            </div>
          </div>

          <!-- Activity Heatmap -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <ActivityHeatmap 
              v-if="activityData.length > 0"
              :activity-data="activityData"
              :current-streak="profile.current_streak"
              :longest-streak="profile.longest_streak"
            />
            <div v-else class="text-center py-12">
              <Icon icon="ph:calendar-blank" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-600">No activity data yet. Start solving problems!</p>
            </div>
          </div>

          <!-- Problem Breakdown -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Problems by Difficulty</h2>
            <div class="space-y-4">
              <!-- Easy -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span class="font-semibold text-gray-900">Easy</span>
                  </div>
                  <span class="text-gray-600">{{ profile.easy_solved }} solved</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-green-500 transition-all duration-500"
                    :style="{ width: `${getPercentage(profile.easy_solved, profile.total_solved)}%` }"
                  ></div>
                </div>
              </div>

              <!-- Medium -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span class="font-semibold text-gray-900">Medium</span>
                  </div>
                  <span class="text-gray-600">{{ profile.medium_solved }} solved</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-yellow-500 transition-all duration-500"
                    :style="{ width: `${getPercentage(profile.medium_solved, profile.total_solved)}%` }"
                  ></div>
                </div>
              </div>

              <!-- Hard -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <span class="font-semibold text-gray-900">Hard</span>
                  </div>
                  <span class="text-gray-600">{{ profile.hard_solved }} solved</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-red-500 transition-all duration-500"
                    :style="{ width: `${getPercentage(profile.hard_solved, profile.total_solved)}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submission Stats -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Submission Statistics</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center p-4 bg-blue-50 rounded-xl">
                <p class="text-4xl font-bold text-blue-600">{{ profile.total_submissions }}</p>
                <p class="text-sm text-gray-600 mt-2">Total Submissions</p>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-xl">
                <p class="text-4xl font-bold text-green-600">{{ profile.total_solved }}</p>
                <p class="text-sm text-gray-600 mt-2">Accepted</p>
              </div>
              <div class="text-center p-4 bg-red-50 rounded-xl">
                <p class="text-4xl font-bold text-red-600">{{ profile.total_submissions - profile.total_solved }}</p>
                <p class="text-sm text-gray-600 mt-2">Failed</p>
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
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'
import UserLevelBadge from '~/components/UserLevelBadge.vue'
import ActivityHeatmap from '~/components/ActivityHeatmap.vue'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const { apiBaseUrl } = useApi()

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
  title: `${username} - Profile | BudiBadu`,
  meta: [
    { name: 'description', content: `View ${username}'s coding profile, stats, and problem-solving activity on BudiBadu` }
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
