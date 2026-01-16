<template>
  <div class="user-level-badge">
    <!-- Compact Badge -->
    <div 
      v-if="compact" 
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r cursor-pointer hover:scale-105 transition-transform duration-200"
      :class="badgeGradient"
      @click="showDetails = !showDetails"
    >
      <Icon :icon="badgeIcon" class="w-4 h-4 text-white" />
      <span class="text-xs font-bold text-white">Lv. {{ level }}</span>
    </div>

    <!-- Full Badge with Stats -->
    <div 
      v-else 
      class="bg-white rounded-xl border-2 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
      :class="`border-${levelColor}-200`"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-3">
          <div 
            class="w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg"
            :class="badgeGradient"
          >
            <Icon :icon="badgeIcon" class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">Level {{ level }}</h3>
            <p 
              class="text-xs font-semibold"
              :style="{ color: titleColor }"
            >
              {{ levelTitle }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500">XP</p>
          <p class="text-sm font-bold text-gray-900">{{ currentXP }}</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div v-if="showProgress" class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-gray-600">Progress to Lv. {{ level + 1 }}</span>
          <span class="font-semibold text-gray-900">{{ progressPercent }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r transition-all duration-500 ease-out"
            :class="badgeGradient"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>
        <p class="text-xs text-gray-500 text-center">
          {{ xpToNextLevel }} XP to next level
        </p>
      </div>
    </div>

    <!-- Tooltip/Details Modal -->
    <Teleport to="body">
      <div 
        v-if="showDetails && compact"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        @click="showDetails = false"
      >
        <div 
          class="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border-2"
          :class="`border-${levelColor}-200`"
          @click.stop
        >
          <!-- Level Badge Large -->
          <div class="text-center mb-6">
            <div 
              class="inline-flex w-20 h-20 rounded-full bg-gradient-to-br items-center justify-center shadow-xl mb-3"
              :class="badgeGradient"
            >
              <Icon :icon="badgeIcon" class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900">Level {{ level }}</h3>
            <p 
              class="text-lg font-semibold mt-1"
              :style="{ color: titleColor }"
            >
              {{ levelTitle }}
            </p>
          </div>

          <!-- XP Info -->
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span class="text-sm text-gray-600">Current XP</span>
              <span class="text-lg font-bold text-gray-900">{{ currentXP }}</span>
            </div>

            <!-- Progress -->
            <div>
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-gray-600">Progress</span>
                <span class="font-bold text-gray-900">{{ progressPercent }}%</span>
              </div>
              <div class="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r transition-all duration-500"
                  :class="badgeGradient"
                  :style="{ width: `${progressPercent}%` }"
                />
              </div>
              <p class="text-xs text-gray-500 mt-2 text-center">
                {{ xpToNextLevel }} XP needed for Level {{ level + 1 }}
              </p>
            </div>

            <!-- Stats -->
            <div v-if="stats" class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div class="text-center p-3 bg-yellow-50 rounded-lg">
                <p class="text-2xl font-bold text-yellow-600">{{ stats.total_solved }}</p>
                <p class="text-xs text-gray-600 mt-1">Solved</p>
              </div>
              <div class="text-center p-3 bg-green-50 rounded-lg">
                <p class="text-2xl font-bold text-green-600">{{ Math.round(stats.success_rate) }}%</p>
                <p class="text-xs text-gray-600 mt-1">Success Rate</p>
              </div>
            </div>
          </div>

          <!-- Close Button -->
          <button 
            @click="showDetails = false"
            class="mt-6 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  level: {
    type: Number,
    default: 1
  },
  currentXP: {
    type: Number,
    default: 0
  },
  nextLevelXP: {
    type: Number,
    default: 50
  },
  currentLevelMinXP: {
    type: Number,
    default: 0
  },
  levelTitle: {
    type: String,
    default: 'Beginner'
  },
  titleColor: {
    type: String,
    default: '#9CA3AF'
  },
  badgeIcon: {
    type: String,
    default: 'ph:student'
  },
  badgeGradient: {
    type: String,
    default: 'from-gray-400 to-gray-500'
  },
  compact: {
    type: Boolean,
    default: false
  },
  showProgress: {
    type: Boolean,
    default: true
  },
  stats: {
    type: Object,
    default: null
  }
})

const showDetails = ref(false)

const progressPercent = computed(() => {
  const xpInLevel = props.currentXP - props.currentLevelMinXP
  const xpNeededForLevel = props.nextLevelXP - props.currentLevelMinXP
  if (xpNeededForLevel === 0) return 100
  return Math.min(Math.round((xpInLevel / xpNeededForLevel) * 100), 100)
})

const xpToNextLevel = computed(() => {
  return Math.max(props.nextLevelXP - props.currentXP, 0)
})

const levelColor = computed(() => {
  // Extract color from gradient class (e.g., "from-yellow-400" -> "yellow")
  const match = props.badgeGradient.match(/from-(\w+)-/)
  return match ? match[1] : 'gray'
})
</script>

<style scoped>
.user-level-badge {
  user-select: none;
}
</style>
