<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-black text-navy">Settings</h1>
      <p class="text-text-secondary mt-1 font-medium italic">Manage your application preferences and configurations</p>
    </div>

    <!-- Settings Nav Tabs -->
    <div class="flex gap-2 border-b border-gray-100 overflow-x-auto no-scrollbar pb-1">
      <BaseButton v-for="tab in tabs" :key="tab.value" variant="ghost" size="sm" :class="[
        'rounded-none border-b-2 font-bold !px-5 !py-4 transition-all',
        activeTab === tab.value ? 'border-primary text-navy bg-primary/5' : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'
      ]" @click="activeTab = tab.value">
        {{ tab.label }}
      </BaseButton>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-6">General Settings</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BaseInput v-model="settings.organizationName" label="Organization Name" placeholder="Archeryhub.id" />

          <BaseSelect v-model="settings.language" label="Default Language" :items="[
            { title: 'English', value: 'en' },
            { title: 'Indonesian', value: 'id' },
            { title: 'Spanish', value: 'es' }
          ]" />

          <BaseSelect v-model="settings.timezone" label="Timezone" :items="[
            { title: 'Asia/Jakarta (GMT+7)', value: 'Asia/Jakarta' },
            { title: 'America/New_York (GMT-5)', value: 'America/New_York' },
            { title: 'Europe/London (GMT)', value: 'Europe/London' }
          ]" />

          <div class="flex items-center pt-8">
            <BaseCheckbox v-model="settings.darkMode" label="Enable Dark Mode" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tournament Settings -->
    <div v-if="activeTab === 'tournament'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-6">Tournament Defaults</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BaseInput v-model.number="settings.defaultDistance" label="Default Target Distance (meters)" type="number" />
          <BaseInput v-model.number="settings.arrowsPerEnd" label="Arrows Per End" type="number" />
          <BaseInput v-model.number="settings.timePerEnd" label="Time Per End (seconds)" type="number" />

          <div class="flex items-center pt-8">
            <BaseCheckbox v-model="settings.autoRanking" label="Enable Auto Ranking Calculation" />
          </div>
        </div>
      </div>
    </div>

    <!-- Scoring Settings -->
    <div v-if="activeTab === 'scoring'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-6">Scoring Configuration</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseCheckbox v-model="settings.allowScoreEdits" label="Allow Score Edits After Submission" />
          <BaseCheckbox v-model="settings.requireSignatures" label="Require Digital Signatures" />
          <BaseCheckbox v-model="settings.realtimeUpdates" label="Enable Real-time Leaderboard Updates" />
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div v-if="activeTab === 'notifications'"
      class="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm space-y-8">
      <div>
        <h3 class="text-xl font-bold text-navy mb-6">Notification Preferences</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseCheckbox v-model="settings.emailNotifications" label="Email Notifications" />
          <BaseCheckbox v-model="settings.smsNotifications" label="SMS Notifications" />
          <BaseCheckbox v-model="settings.pushNotifications" label="Push Notifications" />
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end gap-3 mt-10 pt-6 border-t border-gray-100">
      <BaseButton variant="outline" size="lg">
        Batal
      </BaseButton>
      <BaseButton variant="gold" size="lg" icon="save" @click="saveSettings">
        Simpan Perubahan
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  title: 'Settings',
  layout: 'dashboard'
})

const activeTab = ref('general')

const tabs = [
  { label: 'General', value: 'general' },
  { label: 'Tournament', value: 'tournament' },
  { label: 'Scoring', value: 'scoring' },
  { label: 'Notifications', value: 'notifications' },
]

const settings = ref({
  organizationName: 'Archeryhub.id',
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
