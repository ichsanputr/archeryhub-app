<template>
    <div
        class="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] transform transition-all duration-300 origin-top-right">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div class="flex items-center gap-2">
                <div class="font-black text-navy text-base">{{ t('notifications.title', 'Notifikasi') }}</div>
                <span v-if="unreadCount > 0"
                    class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {{ unreadCount }}
                </span>
            </div>
            <button v-if="notifications.length > 0" @click.stop="$emit('mark-all-read')"
                class="text-xs font-bold text-gray-600 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors">
                {{ t('notifications.mark_all_read', 'Tandai semua dibaca') }}
            </button>
        </div>

        <!-- List -->
        <div class="max-h-[380px] overflow-y-auto no-scrollbar divide-y divide-gray-50">
            <div v-if="notifications.length > 0">
                <div v-for="note in notifications" :key="note.id" @click="handleNotificationClick(note)"
                    :class="[
                        'px-5 py-3.5 flex items-start gap-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors group',
                        !note.is_read ? 'bg-blue-50/20' : 'bg-white'
                    ]">

                    <!-- Icon/Avatar -->
                    <div
                        :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', getIconBg(note.type)]">
                        <Icon :icon="getIcon(note.type)" :class="['text-lg', getIconColor(note.type)]" />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-0.5">
                            <div :class="['text-xs leading-snug truncate', !note.is_read ? 'font-black text-navy' : 'text-gray-700 font-bold']">
                                {{ note.title }}
                            </div>
                            <span class="text-[10px] text-gray-400 font-medium shrink-0 whitespace-nowrap">
                                {{ formatTimeAgo(note.created_at) }}
                            </span>
                        </div>
                        <div class="text-xs text-gray-600 line-clamp-2 leading-relaxed font-normal">
                            {{ note.message }}
                        </div>
                    </div>

                    <!-- Actions on item -->
                    <div class="flex items-center gap-1 shrink-0 self-center">
                        <button
                            v-if="!note.is_read"
                            @click.stop="$emit('mark-read', note.id)"
                            class="p-1 rounded-lg text-gray-400  hover:bg-emerald-50 transition-colors"
                            :title="t('notifications.mark_as_read', 'Tandai sudah dibaca')"
                        >
                            <Icon icon="ph:check-bold" class="text-xs" />
                        </button>
                        <button
                            @click.stop="$emit('delete', note.id)"
                            class="p-1 rounded-lg text-gray-400  hover:bg-rose-50 transition-colors"
                            :title="t('notifications.delete', 'Hapus notifikasi')"
                        >
                            <Icon icon="ph:x-bold" class="text-xs" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="py-12 px-6 text-center">
                <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-300">
                    <Icon icon="ph:bell-slash-bold" class="text-2xl" />
                </div>
                <div class="text-navy font-black text-sm">{{ t('notifications.empty_title', 'Belum Ada Notifikasi') }}</div>
                <div class="text-gray-400 text-xs mt-1">{{ t('notifications.empty_desc', 'Notifikasi aktivitas dan turnamen Anda akan muncul di sini.') }}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 border-t border-gray-100 bg-gray-50/60 text-center">
            <NuxtLink :to="`/dashboard/${userPersona}/notifications`" @click="$emit('close')"
                class="text-xs font-black text-navy hover:bg-gray-100 py-1 px-3 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5">
                <span>{{ t('notifications.view_all', 'Lihat Semua Notifikasi') }}</span>
                <Icon icon="ph:arrow-right-bold" class="text-xs" />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { userPersona } = useAuth()

const props = defineProps({
    notifications: {
        type: Array,
        default: () => []
    },
    unreadCount: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['close', 'mark-all-read', 'mark-read', 'delete', 'click'])

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

const formatTimeAgo = (dateStr) => {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffSec = Math.floor(diffMs / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHour = Math.floor(diffMin / 60)
        const diffDay = Math.floor(diffHour / 24)

        const isId = locale.value === 'id'
        if (diffSec < 60) return isId ? 'Baru saja' : 'Just now'
        if (diffMin < 60) return isId ? `${diffMin}m lalu` : `${diffMin}m ago`
        if (diffHour < 24) return isId ? `${diffHour}j lalu` : `${diffHour}h ago`
        if (diffDay < 7) return isId ? `${diffDay}h lalu` : `${diffDay}d ago`
        const dateLocale = isId ? 'id-ID' : 'en-US'
        return date.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' })
    } catch {
        return ''
    }
}

const handleNotificationClick = (note) => {
    emit('click', note)
    emit('close')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
