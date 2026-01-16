import { ref, computed } from 'vue'
import { useApi } from './useApi'

export const useUserLevel = () => {
  const { apiBaseUrl } = useApi()
  
  const userStats = ref(null)
  const levelSystem = ref(null)
  const xpHistory = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Fetch user stats (requires authentication)
  const fetchUserStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch(`${apiBaseUrl}/user/stats`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response && response.data) {
        userStats.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Error fetching user stats:', err)
      error.value = err.message || 'Failed to fetch user stats'
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch level system (public endpoint)
  const fetchLevelSystem = async () => {
    try {
      const response = await $fetch(`${apiBaseUrl}/public/level-system`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response && response.data) {
        levelSystem.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Error fetching level system:', err)
      return null
    }
  }

  // Fetch XP history (requires authentication)
  const fetchXPHistory = async () => {
    try {
      const response = await $fetch(`${apiBaseUrl}/user/xp-history`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response && response.data) {
        xpHistory.value = response.data
      }
      
      return response.data
    } catch (err) {
      console.error('Error fetching XP history:', err)
      return null
    }
  }

  // Computed properties
  const levelProgress = computed(() => {
    if (!userStats.value) return 0
    return Math.round(userStats.value.level_progress || 0)
  })

  const xpToNextLevel = computed(() => {
    if (!userStats.value) return 0
    return userStats.value.next_level_xp - userStats.value.experience_points
  })

  const formattedSuccessRate = computed(() => {
    if (!userStats.value) return '0%'
    return `${Math.round(userStats.value.success_rate || 0)}%`
  })

  // Helper function to get level info by XP
  const getLevelByXP = (xp) => {
    if (!levelSystem.value) return null
    
    return levelSystem.value.find(level => {
      return xp >= level.min_xp && xp <= level.max_xp
    })
  }

  // Helper function to get XP by difficulty
  const getXPByDifficulty = (difficulty) => {
    const xpMap = {
      'Easy': 10,
      'Medium': 25,
      'Hard': 50
    }
    return xpMap[difficulty] || 10
  }

  return {
    // State
    userStats,
    levelSystem,
    xpHistory,
    loading,
    error,
    
    // Actions
    fetchUserStats,
    fetchLevelSystem,
    fetchXPHistory,
    
    // Computed
    levelProgress,
    xpToNextLevel,
    formattedSuccessRate,
    
    // Helpers
    getLevelByXP,
    getXPByDifficulty
  }
}
