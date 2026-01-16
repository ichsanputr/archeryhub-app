<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black text-white">Settings</h1>
      <p class="text-brand-gold mt-1">Manage your application preferences and configurations</p>
    </div>

    <!-- Settings Nav Tabs -->
    <div class="flex gap-2 border-b border-brand-border overflow-x-auto">
      <button 
        v-for="tab in tabs" 
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="activeTab === tab.value ? 'border-b-2 border-primary text-white' : 'text-brand-gold hover:text-white'"
        class="px-4 py-3 font-semibold text-sm whitespace-nowrap transition-colors"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="card space-y-6">
      <div>
        <h3 class="text-xl font-bold text-white mb-4">General Settings</h3>
        
        <div class="space-y-4">
          <label class="flex flex-col gap-2">
            <span class="text-white text-sm font-medium">Organization Name</span>
            <input v-model="settings.organizationName" class="input" />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-white text-sm font-medium">Default Language</span>
            <select v-model="settings.language" class="input">
              <option value="en">English</option>
              <option value="id">Indonesian</option>
              <option value="es">Spanish</option>
            </select>
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-white text-sm font-medium">Timezone</span>
            <select v-model="settings.timezone" class="input">
              <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
            </select>
          </label>

          <label class="flex items-center gap-3">
            <input v-model="settings.darkMode" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">Enable Dark Mode</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Tournament Settings -->
    <div v-if="activeTab === 'tournament'" class="card space-y-6">
      <div>
        <h3 class="text-xl font-bold text-white mb-4">Tournament Defaults</h3>
        
        <div class="space-y-4">
          <label class="flex flex-col gap-2">
            <span class="text-white text-sm font-medium">Default Target Distance (meters)</span>
            <input v-model="settings.defaultDistance" type="number" class="input" />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-white text-sm font-medium">Arrows Per End</span>
            <input v-model="settings.arrowsPerEnd" type="number" class="input" />
          </label>

          <label class="flex flex-col gap-2">
            <span class="text-white text-sm font-medium">Time Per End (seconds)</span>
            <input v-model="settings.timePerEnd" type="number" class="input" />
          </label>

          <label class="flex items-center gap-3">
            <input v-model="settings.autoRanking" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">Enable Auto Ranking Calculation</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Scoring Settings -->
    <div v-if="activeTab === 'scoring'" class="card space-y-6">
      <div>
        <h3 class="text-xl font-bold text-white mb-4">Scoring Configuration</h3>
        
        <div class="space-y-4">
          <label class="flex items-center gap-3">
            <input v-model="settings.allowScoreEdits" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">Allow Score Edits After Submission</span>
          </label>

          <label class="flex items-center gap-3">
            <input v-model="settings.requireSignatures" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">Require Digital Signatures</span>
          </label>

          <label class="flex items-center gap-3">
            <input v-model="settings.realtimeUpdates" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">Enable Real-time Leaderboard Updates</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div v-if="activeTab === 'notifications'" class="card space-y-6">
      <div>
        <h3 class="text-xl font-bold text-white mb-4">Notification Preferences</h3>
        
        <div class="space-y-4">
          <label class="flex items-center gap-3">
            <input v-model="settings.emailNotifications" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">Email Notifications</span>
          </label>

          <label class="flex items-center gap-3">
            <input v-model="settings.smsNotifications" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">SMS Notifications</span>
          </label>

          <label class="flex items-center gap-3">
            <input v-model="settings.pushNotifications" type="checkbox" class="rounded border-brand-border text-primary focus:ring-primary" />
            <span class="text-white text-sm">Push Notifications</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end gap-4">
      <button class="btn-secondary">Cancel</button>
      <button @click="saveSettings" class="btn-primary">
        <span class="material-symbols-outlined text-[20px]">save</span>
        Save Settings
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  title: 'Settings',
  layout: 'default'
})

const activeTab = ref('general')

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Tournament', value: 'tournament' },
  { label: 'Scoring', value: 'scoring' },
  { label: 'Notifications', value: 'notifications' },
]

const settings = ref({
  organizationName: 'Archery Hub',
  language: 'en',
  timezone: 'Asia/Jakarta',
  darkMode: true,
  defaultDistance: 70,
  arrowsPerEnd: 3,
  timePerEnd: 240,
  autoRanking: true,
  allowScoreEdits: false,
  requireSignatures: true,
  realtimeUpdates: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
})

const saveSettings = () => {
  console.log('Saving settings:', settings.value)
  // TODO: API call to save settings
  alert('Settings saved successfully!')
}
</script>
