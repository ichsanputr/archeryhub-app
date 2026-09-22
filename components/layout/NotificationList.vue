<template>
    <div
        class="w-full bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
        <!-- Header -->
        <div class="px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
            <div class="flex items-center gap-2">
                <div class="font-black text-navy dark:text-white text-sm">{{ t('notifications.title') }}</div>
                <span v-if="unreadCount > 0"
                    class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {{ unreadCount }}
                </span>
            </div>
            <button v-if="notifications.length > 0" @click.stop="$emit('mark-all-read')"
                class="text-xs font-bold text-gray-500 hover:text-navy hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors">
                {{ t('notifications.mark_all_read') }}
            </button>
        </div>

        <!-- List -->
        <div class="max-h-[380px] overflow-y-auto no-scrollbar divide-y divide-gray-50 dark:divide-slate-800/60">
            <div v-if="notifications.length > 0">
                <div v-for="note in notifications" :key="note.id" @click="handleNotificationClick(note)"
                    :class="[
                        'px-5 py-3.5 flex items-start gap-3.5 hover:bg-gray-50/80 dark:hover:bg-slate-800/60 cursor-pointer transition-colors group',
                        !note.is_read ? 'bg-blue-50/30 dark:bg-blue-900/10' : 'bg-white dark:bg-slate-900'
                    ]">

                    <!-- Icon/Avatar -->
                    <div
                        :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', getIconBg(note.type)]">
                        <Icon :icon="getIcon(note.type)" :class="['text-lg', getIconColor(note.type)]" />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2 mb-0.5">
                            <div :class="['text-xs leading-snug truncate', !note.is_read ? 'font-black text-navy dark:text-white' : 'text-gray-700 dark:text-slate-300 font-bold']">
                                {{ note.title }}
                            </div>
                            <span class="text-[10px] text-gray-400 dark:text-slate-500 font-medium shrink-0 whitespace-nowrap">
                                {{ formatTimeAgo(note.created_at) }}
                            </span>
                        </div>
                        <div class="text-xs text-gray-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
                            {{ note.message }}
                        </div>
                    </div>

                    <!-- Actions on item -->
                    <div class="flex items-center gap-1 shrink-0 self-center">
                        <button
                            v-if="!note.is_read"
                            @click.stop="$emit('mark-read', note.id)"
                            class="p-1 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                            :title="t('notifications.mark_as_read')"
                        >
                            <Icon icon="ph:check-bold" class="text-xs" />
                        </button>
                        <button
                            @click.stop="$emit('delete', note.id)"
                            class="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            :title="t('notifications.delete')"
                        >
                            <Icon icon="ph:x-bold" class="text-xs" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="py-10 px-6 text-center">
                <div class="w-12 h-12 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-gray-300 dark:text-slate-600">
                    <Icon icon="ph:bell-slash-bold" class="text-2xl" />
                </div>
                <div class="text-navy dark:text-white font-black text-sm">{{ t('notifications.empty_title') }}</div>
                <div class="text-gray-400 dark:text-slate-500 text-xs mt-1">{{ t('notifications.empty_desc') }}</div>
            </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-2.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/60 text-center">
            <NuxtLink :to="`/dashboard/${userPersona}/notifications`" @click="$emit('close')"
                class="text-xs font-black text-navy dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 py-1 px-3 rounded-lg transition-colors inline-flex items-center justify-center gap-1.5">
                <span>{{ t('notifications.view_all') }}</span>
                <Icon icon="ph:arrow-right-bold" class="text-xs" />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'
import { useDashboardI18n } from '~/composables/useDashboardI18n'

const { t, locale } = useDashboardI18n()
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
