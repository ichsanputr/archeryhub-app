import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'

export interface UserStats {
  level_progress?: number
  next_level_xp?: number
  experience_points?: number
  success_rate?: number
  [key: string]: unknown
}

export interface LevelInfo {
  min_xp: number
  max_xp: number
  [key: string]: unknown
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export const useUserLevel = () => {
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.apiBaseUrl as string

  const userStats: Ref<UserStats | null> = ref(null)
  const levelSystem: Ref<LevelInfo[] | null> = ref(null)
  const xpHistory: Ref<unknown[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const fetchUserStats = async (): Promise<UserStats | null> => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ data?: UserStats }>(`${apiBaseUrl}/user/stats`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response?.data) {
        userStats.value = response.data
      }
      return response.data ?? null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user stats'
      console.error('Error fetching user stats:', err)
      error.value = message
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchLevelSystem = async (): Promise<LevelInfo[] | null> => {
    try {
      const response = await $fetch<{ data?: LevelInfo[] }>(
        `${apiBaseUrl}/public/level-system`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      if (response?.data) {
        levelSystem.value = response.data
      }
      return response.data ?? null
    } catch (err) {
      console.error('Error fetching level system:', err)
      return null
    }
  }

  const fetchXPHistory = async (): Promise<unknown[] | null> => {
    try {
      const response = await $fetch<{ data?: unknown[] }>(`${apiBaseUrl}/user/xp-history`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response?.data) {
        xpHistory.value = response.data
      }
      return response.data ?? null
    } catch (err) {
      console.error('Error fetching XP history:', err)
      return null
    }
  }

  const levelProgress: ComputedRef<number> = computed(() => {
    if (!userStats.value) return 0
    return Math.round(userStats.value.level_progress ?? 0)
  })

  const xpToNextLevel: ComputedRef<number> = computed(() => {
    if (!userStats.value?.next_level_xp || userStats.value.experience_points == null) {
      return 0
    }
    return userStats.value.next_level_xp - userStats.value.experience_points
  })

  const formattedSuccessRate: ComputedRef<string> = computed(() => {
    if (!userStats.value) return '0%'
    return `${Math.round(userStats.value.success_rate ?? 0)}%`
  })

  const getLevelByXP = (xp: number): LevelInfo | undefined => {
    if (!levelSystem.value) return undefined
    return levelSystem.value.find(
      (level) => xp >= level.min_xp && xp <= level.max_xp
    )
  }

  const xpMap: Record<Difficulty, number> = {
    Easy: 10,
    Medium: 25,
    Hard: 50
  }

  const getXPByDifficulty = (difficulty: string): number => {
    return xpMap[difficulty as Difficulty] ?? 10
  }

  return {
    userStats,
    levelSystem,
    xpHistory,
    loading,
    error,
    fetchUserStats,
    fetchLevelSystem,
    fetchXPHistory,
    levelProgress,
    xpToNextLevel,
    formattedSuccessRate,
    getLevelByXP,
    getXPByDifficulty
  }
}
