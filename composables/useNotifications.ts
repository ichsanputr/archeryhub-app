import { ref } from 'vue'
import { useApi } from './useApi'
import { useAuth } from './useAuth'

export interface AppNotification {
  id: number
  user_id: string
  user_role: string
  type: 'event' | 'payment' | 'achievement' | 'info' | 'success' | 'warning' | 'danger' | 'default' | string
  title: string
  message: string
  link?: string | null
  is_read: boolean
  created_at: string
  updated_at?: string
}

const notifications = ref<AppNotification[]>([])
const unreadCount = ref<number>(0)
const totalCount = ref<number>(0)
const isLoading = ref<boolean>(false)
let pollingTimer: any = null

export const useNotifications = () => {
  const api = useApi()
  const { user, isLoggedIn } = useAuth()

  const fetchUnreadCount = async () => {
    if (!isLoggedIn.value && !user.value) {
      return 0
    }
    try {
      const res: any = await api.get('/notifications/unread-count')
      const count = res?.count ?? res?.unread_count ?? 0
      unreadCount.value = count
      return count
    } catch (e) {
      return unreadCount.value
    }
  }

  const fetchNotifications = async (options: { limit?: number; offset?: number; unreadOnly?: boolean } = {}) => {
    isLoading.value = true
    try {
      const params = new URLSearchParams()
      if (options.limit) params.append('limit', String(options.limit))
      if (options.offset) params.append('offset', String(options.offset))
      if (options.unreadOnly) params.append('unread_only', 'true')

      const queryString = params.toString() ? `?${params.toString()}` : ''
      const res: any = await api.get(`/notifications${queryString}`)
      
      const list = Array.isArray(res?.notifications) ? res.notifications : (Array.isArray(res) ? res : [])
      notifications.value = list
      if (typeof res?.unread_count === 'number') {
        unreadCount.value = res.unread_count
      }
      if (typeof res?.total === 'number') {
        totalCount.value = res.total
      }
      return list
    } catch (e) {
      console.error('[useNotifications] Failed to fetch notifications:', e)
      return []
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`)
      const found = notifications.value.find(n => n.id === id)
      if (found && !found.is_read) {
        found.is_read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (e) {
      console.error(`[useNotifications] Failed to mark notification ${id} as read:`, e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      notifications.value.forEach(n => {
        n.is_read = true
      })
      unreadCount.value = 0
    } catch (e) {
      console.error('[useNotifications] Failed to mark all notifications as read:', e)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`)
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        if (!notifications.value[index].is_read) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        notifications.value.splice(index, 1)
        totalCount.value = Math.max(0, totalCount.value - 1)
      }
    } catch (e) {
      console.error(`[useNotifications] Failed to delete notification ${id}:`, e)
    }
  }

  const clearAllNotifications = async () => {
    try {
      await api.delete('/notifications/clear-all')
      notifications.value = []
      unreadCount.value = 0
      totalCount.value = 0
    } catch (e) {
      console.error('[useNotifications] Failed to clear all notifications:', e)
    }
  }

  const startPolling = (intervalMs = 45000) => {
    if (import.meta.server) return
    stopPolling()
    fetchUnreadCount()
    pollingTimer = setInterval(() => {
      if (isLoggedIn.value || user.value) {
        fetchUnreadCount()
      }
    }, intervalMs)
  }

  const stopPolling = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  return {
    notifications,
    unreadCount,
    totalCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    startPolling,
    stopPolling
  }
}
