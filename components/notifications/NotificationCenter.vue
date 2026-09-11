<template>
  <div class="max-w-4xl mx-auto flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-black text-navy">{{ t('notifications.title', 'Notifikasi') }}</h1>
        <div class="text-sm text-gray-500 font-medium mt-1">
          {{ t('notifications.subtitle', 'Semua riwayat pembaruan, turnamen, dan aktivitas akun Anda.') }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          v-if="notifications.length > 0 && unreadCount > 0"
          @click="markAllAsRead"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Icon icon="ph:checks-bold" class="text-base text-gray-600" />
          <span>{{ t('notifications.mark_all_read', 'Tandai Semua Dibaca') }}</span>
        </button>

        <button
          v-if="notifications.length > 0"
          @click="clearAllNotifications"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
        >
          <Icon icon="ph:trash-bold" class="text-base" />
          <span>{{ t('notifications.clear_all', 'Hapus Semua') }}</span>
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex items-center gap-2 border-b border-gray-200">
      <button
        @click="activeFilter = 'all'"
        :class="[
          'px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2',
          activeFilter === 'all'
            ? 'border-navy text-navy font-black'
            : 'border-transparent text-gray-500'
        ]"
      >
        <span>{{ t('notifications.filter_all', 'Semua') }}</span>
        <span class="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 font-bold text-gray-600">
          {{ totalCount || notifications.length }}
        </span>
      </button>
      <button
        @click="activeFilter = 'unread'"
        :class="[
          'px-4 py-2.5 text-xs font-bold transition-all border-b-2 -mb-px flex items-center gap-2',
          activeFilter === 'unread'
            ? 'border-navy text-navy font-black'
            : 'border-transparent text-gray-500'
        ]"
      >
        <span>{{ t('notifications.filter_unread', 'Belum Dibaca') }}</span>
        <span
          v-if="unreadCount > 0"
          class="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black"
        >
          {{ unreadCount }}
        </span>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col gap-3">
      <div v-for="i in 4" :key="i" class="h-24 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
    </div>

    <!-- Notification List -->
    <div v-else-if="filteredNotifications.length > 0" class="flex flex-col gap-3">
      <div
        v-for="note in filteredNotifications"
        :key="note.id"
        @click="handleNotificationClick(note)"
        :class="[
          'p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 cursor-pointer',
          !note.is_read
            ? 'bg-blue-50/30 border-blue-100 shadow-sm'
            : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
        ]"
      >
        <!-- Icon -->
        <div
          :class="['w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5', getIconBg(note.type)]"
        >
          <Icon :icon="getIcon(note.type)" :class="['text-xl', getIconColor(note.type)]" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-3 mb-1">
            <div :class="['text-sm leading-snug truncate', !note.is_read ? 'font-black text-navy' : 'text-gray-800 font-bold']">
              {{ note.title }}
            </div>
            <span class="text-xs text-gray-400 font-medium shrink-0 whitespace-nowrap">
              {{ formatDate(note.created_at) }}
            </span>
          </div>
          <div class="text-xs text-gray-600 leading-relaxed font-normal mb-2">
            {{ note.message }}
          </div>
          <div v-if="note.link" class="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 underline underline-offset-2">
            <span>{{ t('notifications.open_link', 'Buka tautan') }}</span>
            <Icon icon="ph:arrow-square-out-bold" class="text-xs text-gray-500" />
          </div>
        </div>

        <!-- Actions (Mark As Read & Delete) -->
        <div class="flex items-center gap-1 shrink-0 self-center">
          <!-- Mark As Read button -->
          <button
            v-if="!note.is_read"
            @click.stop="markAsRead(note.id)"
            class="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            :title="t('notifications.mark_as_read', 'Tandai sudah dibaca')"
          >
            <Icon icon="ph:check-circle-bold" class="text-lg text-emerald-600" />
          </button>

          <!-- Delete notification button -->
          <button
            @click.stop="deleteNotification(note.id)"
            class="p-2 rounded-xl text-gray-400  hover:bg-rose-50 transition-colors"
            :title="t('notifications.delete', 'Hapus notifikasi')"
          >
            <Icon icon="ph:trash-bold" class="text-lg" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
      <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
        <Icon icon="ph:bell-slash-bold" class="text-3xl" />
      </div>
      <div class="text-base font-black text-navy">{{ t('notifications.empty_title', 'Belum Ada Notifikasi') }}</div>
      <div class="text-xs text-gray-500 max-w-sm mx-auto mt-1 font-medium">
        {{ t('notifications.empty_desc', 'Semua notifikasi terkait turnamen, skor, dan pembayaran Anda akan muncul di sini.') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '~/composables/useNotifications'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()
const router = useRouter()
const activeFilter = ref('all')

const {
  notifications,
  unreadCount,
  totalCount,
  isLoading,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} = useNotifications()

onMounted(() => {
  fetchNotifications({ limit: 50 })
})

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'unread') {
    return notifications.value.filter(n => !n.is_read)
  }
  return notifications.value
})

const getIcon = (type) => {
  switch (type) {
    case 'event': return 'ph:trophy-bold'
    case 'payment': return 'ph:credit-card-bold'
    case 'achievement': return 'ph:medal-bold'
    case 'success': return 'ph:check-circle-bold'
    case 'warning': return 'ph:warning-circle-bold'
    case 'danger': return 'ph:x-circle-bold'
    case 'info': return 'ph:info-bold'
    default: return 'ph:bell-bold'
  }
}

const getIconBg = (type) => {
  switch (type) {
    case 'event': return 'bg-amber-50 text-amber-600'
    case 'payment': return 'bg-emerald-50 text-emerald-600'
    case 'achievement': return 'bg-purple-50 text-purple-600'
    case 'success': return 'bg-emerald-50 text-emerald-600'
    case 'warning': return 'bg-amber-50 text-amber-600'
    case 'danger': return 'bg-rose-50 text-rose-600'
    case 'info': return 'bg-blue-50 text-blue-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

const getIconColor = (type) => {
  switch (type) {
    case 'event': return 'text-amber-600'
    case 'payment': return 'text-emerald-600'
    case 'achievement': return 'text-purple-600'
    case 'success': return 'text-emerald-600'
    case 'warning': return 'text-amber-600'
    case 'danger': return 'text-rose-600'
    case 'info': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const handleNotificationClick = async (note) => {
  if (!note.is_read) {
    await markAsRead(note.id)
  }
  if (note.link) {
    router.push(note.link)
  }
}
</script>
