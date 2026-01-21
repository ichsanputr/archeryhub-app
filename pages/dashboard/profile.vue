<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar -->
          <div class="relative">
            <img :src="user?.avatar || '/default-avatar.png'" :alt="user?.full_name || 'User'"
              class="w-24 h-24 rounded-full border-4 border-gray-100" />
            <div
              class="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <Icon :ssr="true" icon="ph:check" class="w-4 h-4 text-white" />
            </div>
          </div>

          <!-- User Info -->
          <div class="flex-1 text-center sm:text-left">
            <h1 class="text-2xl font-bold text-gray-900">{{ user?.full_name || 'Anonymous User' }}</h1>
            <p class="text-lg text-gray-600 mb-2">@{{ user?.username || 'unknown' }}</p>
            <p class="text-gray-500 mb-4">{{ user?.email || 'No email provided' }}</p>

            <!-- GitHub Link -->
            <div class="flex justify-center sm:justify-start mt-4">
              <BaseButton v-if="user?.githubProfile" :to="user?.githubProfile" target="_blank" variant="outline"
                size="sm" icon="logos:github-icon">
                View GitHub Profile
              </BaseButton>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 text-center">
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-2xl font-bold text-gray-900">{{ stats.solved }}</div>
              <div class="text-sm text-gray-600">Solved</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-2xl font-bold text-gray-900">{{ stats.attempts }}</div>
              <div class="text-sm text-gray-600">Attempts</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-2xl font-bold text-gray-900">{{ stats.rank }}</div>
              <div class="text-sm text-gray-600">Rank</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="border-b border-gray-100 bg-gray-50/50">
          <nav class="flex overflow-x-auto no-scrollbar" aria-label="Tabs">
            <BaseButton v-for="tab in tabs" :key="tab.id" variant="ghost" size="md" :class="[
              'rounded-none border-b-2 font-bold !px-8 !py-4 transition-all whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-navy bg-primary/5'
                : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-100/50'
            ]" @click="activeTab = tab.id">
              <Icon :icon="tab.icon" class="w-5 h-5 mr-2" />
              {{ tab.name }}
            </BaseButton>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-6">
          <!-- Recent Activity Tab -->
          <div v-if="activeTab === 'activity'" class="space-y-4">
            <h3 class="text-xl font-black text-navy mb-4">Aktivitas Terakhir</h3>
            <div v-if="recentActivity.length === 0"
              class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Icon icon="ph:activity" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 font-medium">Belum ada aktivitas baru untuk ditampilkan</p>
              <BaseButton to="/dashboard/events" variant="gold" class="mt-6" icon="ph:magnifying-glass">
                Cari Event Panahan
              </BaseButton>
            </div>
            <div v-else class="space-y-3">
              <div v-for="activity in recentActivity" :key="activity.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <Icon :ssr="true" :icon="activity.type === 'solved' ? 'ph:check-circle' : 'ph:x-circle'" :class="[
                    'w-5 h-5 mr-3',
                    activity.type === 'solved' ? 'text-green-500' : 'text-red-500'
                  ]" />
                  <div>
                    <p class="font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-sm text-gray-500">{{ activity.date }}</p>
                  </div>
                </div>
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  activity.type === 'solved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]">
                  {{ activity.type === 'solved' ? 'Solved' : 'Attempted' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Achievements Tab -->
          <div v-if="activeTab === 'achievements'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="achievement in achievements" :key="achievement.id" :class="[
                'p-4 rounded-lg border-2 transition-all',
                achievement.earned
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              ]">
                <div class="flex items-center mb-2">
                  <Icon :ssr="true" :icon="achievement.icon" :class="[
                    'w-6 h-6 mr-3',
                    achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                  ]" />
                  <h4 class="font-medium text-gray-900">{{ achievement.title }}</h4>
                </div>
                <p class="text-sm text-gray-600">{{ achievement.description }}</p>
                <div v-if="achievement.progress" class="mt-2">
                  <div class="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{{ achievement.progress.current }}/{{ achievement.progress.total }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-yellow-600 h-2 rounded-full transition-all"
                      :style="{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div v-if="activeTab === 'settings'" class="space-y-8">
            <h3 class="text-xl font-black text-navy mb-4">Pengaturan Akun</h3>

            <!-- Profile Settings -->
            <div class="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-navy rounded-lg text-white">
                  <Icon icon="ph:user-focus" class="w-5 h-5" />
                </div>
                <h4 class="font-bold text-navy">Informasi Profil</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BaseInput v-model="settings.displayName" label="Nama Tampilan" placeholder="Masukkan nama kamu" />
                <BaseInput :model-value="user?.email" label="Alamat Email" disabled />
              </div>
            </div>

            <!-- Preferences -->
            <div class="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-navy rounded-lg text-white">
                  <Icon icon="ph:bell-ringing" class="w-5 h-5" />
                </div>
                <h4 class="font-bold text-navy">Preferensi Notifikasi</h4>
              </div>

              <div class="space-y-4">
                <BaseCheckbox v-model="settings.emailNotifications" label="Aktifkan Notifikasi Email" />
                <BaseCheckbox v-model="settings.publicProfile" label="Jadikan Profil Publik" />
              </div>
            </div>

            <!-- Save Button -->
            <div class="flex justify-end pt-4">
              <BaseButton variant="gold" size="lg" icon="ph:floppy-disk" @click="saveSettings">
                Simpan Perubahan
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

// Auth composable
const { user, isLoggedIn } = useAuth()
const { showToast } = useToast()

// Redirect if not logged in
/*
if (!isLoggedIn.value) {
  await navigateTo('/')
}
*/


// Reactive data
const activeTab = ref('activity')
const stats = ref({
  solved: 0,
  attempts: 0,
  rank: '-'
})

const settings = ref({
  displayName: user.value?.name || '',
  emailNotifications: true,
  publicProfile: true
})

const tabs = [
  { id: 'activity', name: 'Recent Activity', icon: 'ph:activity' },
  { id: 'achievements', name: 'Achievements', icon: 'ph:trophy' },
  { id: 'settings', name: 'Settings', icon: 'ph:gear' }
]

const recentActivity = ref([
  // Example data - replace with real data from API
])

const achievements = ref([
  {
    id: 1,
    title: 'First Steps',
    description: 'Solve your first problem',
    icon: 'ph:baby',
    earned: false,
    progress: { current: 0, total: 1 }
  },
  {
    id: 2,
    title: 'Problem Solver',
    description: 'Solve 10 problems',
    icon: 'ph:puzzle-piece',
    earned: false,
    progress: { current: 0, total: 10 }
  },
  {
    id: 3,
    title: 'Speed Demon',
    description: 'Solve a problem in under 5 minutes',
    icon: 'ph:lightning',
    earned: false,
    progress: null
  },
  {
    id: 4,
    title: 'Perfectionist',
    description: 'Solve 5 problems without any failed attempts',
    icon: 'ph:star',
    earned: false,
    progress: { current: 0, total: 5 }
  },
  {
    id: 5,
    title: 'Weekly Warrior',
    description: 'Solve at least one problem every day for a week',
    icon: 'ph:calendar-check',
    earned: false,
    progress: { current: 0, total: 7 }
  },
  {
    id: 6,
    title: 'Community Member',
    description: 'Join the platform',
    icon: 'ph:users',
    earned: true,
    progress: null
  }
])

const saveSettings = () => {
  // TODO: Implement settings save to API
  showToast('Settings saved successfully!', 'success')
}

// Meta tags
definePageMeta({
  title: 'Profile'
  // middleware: 'auth'
})

const route = useRoute()
useSeoMeta({
  title: 'Profil Saya - Archeryhub.id',
  description: 'Lihat progres dan pencapaian kamu di Archeryhub.id'
})
useHead({
  link: [
    {
      rel: 'canonical',
      href: `https://archeryhub.id${route.path}`
    }
  ]
})
</script>
