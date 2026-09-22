<template>
  <div class="activity-heatmap">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-bold text-gray-900">{{ totalContributions }} problems in the last year</h3>
        <div class="text-sm text-gray-600 mt-1">Daily problem-solving activity</div>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-600">
        <span>Less</span>
        <div class="flex gap-1">
          <div class="w-3 h-3 rounded-sm bg-gray-200"></div>
          <div class="w-3 h-3 rounded-sm bg-green-200"></div>
          <div class="w-3 h-3 rounded-sm bg-green-400"></div>
          <div class="w-3 h-3 rounded-sm bg-green-600"></div>
          <div class="w-3 h-3 rounded-sm bg-green-800"></div>
        </div>
        <span>More</span>
      </div>
    </div>

    <!-- Heatmap Grid -->
    <div class="heatmap-container overflow-x-auto">
      <div class="inline-flex gap-1">
        <!-- Month labels -->
        <div class="flex flex-col justify-between pr-2 text-xs text-gray-600">
          <div style="height: 12px"></div>
          <div>Mon</div>
          <div style="height: 12px"></div>
          <div>Wed</div>
          <div style="height: 12px"></div>
          <div>Fri</div>
          <div style="height: 12px"></div>
        </div>

        <!-- Weeks -->
        <div class="flex gap-1">
          <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="flex flex-col gap-1">
            <!-- Month label above first week of month -->
            <div class="h-3 text-xs text-gray-600 font-medium">
              {{ getMonthLabel(week[0]?.date, weekIndex) }}
            </div>
            
            <!-- Days in week -->
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              class="activity-cell rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-yellow-400"
              :class="getActivityColor(day.count)"
              :title="getTooltipText(day)"
              @click="showDayDetails(day)"
            >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-200">
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <div class="text-2xl font-bold text-gray-900">{{ currentStreak }}</div>
        <div class="text-xs text-gray-600 mt-1">Current Streak</div>
      </div>
      <div class="text-center p-3 bg-green-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600">{{ longestStreak }}</div>
        <div class="text-xs text-gray-600 mt-1">Longest Streak</div>
      </div>
      <div class="text-center p-3 bg-yellow-50 rounded-lg">
        <div class="text-2xl font-bold text-yellow-600">{{ mostActiveDay }}</div>
        <div class="text-xs text-gray-600 mt-1">Most Active Day</div>
      </div>
      <div class="text-center p-3 bg-orange-50 rounded-lg">
        <div class="text-2xl font-bold text-orange-600">{{ totalDaysActive }}</div>
        <div class="text-xs text-gray-600 mt-1">Days Active</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  activityData: {
    type: Array,
    default: () => []
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  }
})

const weeks = ref([])
const totalContributions = ref(0)

// Generate weeks for the last year
const generateWeeks = () => {
  const weeksArray = []
  const today = new Date()
  const oneYearAgo = new Date(today)
  oneYearAgo.setFullYear(today.getFullYear() - 1)
  
  // Start from the Sunday of the week containing oneYearAgo
  const startDate = new Date(oneYearAgo)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  let currentWeek = []
  let currentDate = new Date(startDate)
  
  while (currentDate <= today) {
    // Find activity for this date
    const dateString = currentDate.toISOString().split('T')[0]
    const activity = props.activityData.find(a => a.date === dateString)
    
    currentWeek.push({
      date: new Date(currentDate),
      count: activity ? activity.count : 0,
      xp: activity ? activity.xp : 0
    })
    
    if (activity && activity.count > 0) {
      totalContributions.value += activity.count
    }
    
    // If it's Saturday or the last day, push the week
    if (currentDate.getDay() === 6 || currentDate >= today) {
      // Fill remaining days of week with empty cells
      while (currentWeek.length < 7) {
        currentWeek.push({ date: null, count: 0, xp: 0 })
      }
      weeksArray.push(currentWeek)
      currentWeek = []
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  weeks.value = weeksArray
}

// Get activity color based on count
const getActivityColor = (count) => {
  if (count === 0) return 'bg-gray-200'
  if (count === 1) return 'bg-green-200'
  if (count <= 2) return 'bg-green-400'
  if (count <= 4) return 'bg-green-600'
  return 'bg-green-800'
}

// Get month label for first week of each month
const getMonthLabel = (date, weekIndex) => {
  if (!date || weekIndex === 0) return ''
  
  const prevWeek = weeks.value[weekIndex - 1]
  if (!prevWeek || !prevWeek[0]?.date) return ''
  
  const currentMonth = date.getMonth()
  const prevMonth = prevWeek[0].date.getMonth()
  
  if (currentMonth !== prevMonth) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return monthNames[currentMonth]
  }
  
  return ''
}

// Get tooltip text
const getTooltipText = (day) => {
  if (!day.date) return ''
  
  const dateStr = day.date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
  
  if (day.count === 0) {
    return `${dateStr}\nNo problems solved`
  }
  
  const problemText = day.count === 1 ? 'problem' : 'problems'
  return `${dateStr}\n${day.count} ${problemText} solved\n+${day.xp} XP`
}

// Show day details (can be expanded to show modal)
const showDayDetails = (day) => {
  if (day.count > 0 && day.date) {
    console.log('Day details:', day)
    // Could emit event or show modal here
  }
}

// Computed stats
const mostActiveDay = computed(() => {
  if (props.activityData.length === 0) return 0
  return Math.max(...props.activityData.map(a => a.count))
})

const totalDaysActive = computed(() => {
  return props.activityData.filter(a => a.count > 0).length
})

onMounted(() => {
  generateWeeks()
})
</script>

<style scoped>
.activity-cell {
  width: 12px;
  height: 12px;
}

.heatmap-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.heatmap-container::-webkit-scrollbar {
  height: 6px;
}

.heatmap-container::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 3px;
}

.heatmap-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.heatmap-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>
