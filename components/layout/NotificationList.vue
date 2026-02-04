<template>
    <div
        class="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] transform transition-all duration-300 origin-top-right">
        <!-- Header -->
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h3 class="font-black text-navy text-base">Notifikasi</h3>
            <button @click="$emit('mark-all-read')"
                class="text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                Tandai semua dibaca
            </button>
        </div>

        <!-- List -->
        <div class="max-h-[400px] overflow-y-auto no-scrollbar">
            <div v-if="notifications.length > 0">
                <div v-for="note in notifications" :key="note.id" @click="handleNotificationClick(note)"
                    :class="['px-5 py-4 flex gap-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0', !note.read ? 'bg-blue-50/50' : '']">

                    <!-- Icon/Avatar -->
                    <div
                        :class="['w-10 h-10 rounded-full flex items-center justify-center shrink-0', getIconBg(note.type)]">
                        <Icon :icon="getIcon(note.type)" :class="['text-xl', getIconColor(note.type)]" />
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                        <p
                            :class="['text-sm leading-snug mb-1', !note.read ? 'font-black text-gray-900' : 'text-gray-700 font-medium']">
                            {{ note.title }}
                        </p>
                        <p class="text-xs text-gray-600 line-clamp-2 mb-2 font-medium">{{ note.message }}</p>
                        <span class="text-[10px] text-gray-300 font-bold  tracking-wider">{{ note.time
                            }}</span>
                    </div>

                    <!-- Unread Dot -->
                    <div v-if="!note.read" class="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="py-12 px-6 text-center">
                <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon icon="ph:bell-slash" class="text-3xl text-gray-200" />
                </div>
                <p class="text-navy font-black text-base">Belum Ada Notifikasi</p>
                <p class="text-gray-400 text-xs mt-1">Kami akan memberitahu Anda saat ada berita atau aktivitas baru.
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-center">
            <NuxtLink to="/dashboard/notifications"
                class="text-xs font-black text-navy hover:text-primary transition-colors flex items-center justify-center gap-2">
                Lihat Semua Notifikasi
                <Icon icon="ph:arrow-right-bold" />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    notifications: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'mark-all-read', 'click'])

const getIcon = (type) => {
    switch (type) {
        case 'success': return 'ph:check-circle-fill'
        case 'warning': return 'ph:warning-circle-fill'
        case 'danger': return 'ph:x-circle-fill'
        case 'info': return 'ph:info-fill'
        default: return 'ph:bell-fill'
    }
}

const getIconBg = (type) => {
    switch (type) {
        case 'success': return 'bg-green-100'
        case 'warning': return 'bg-amber-100'
        case 'danger': return 'bg-red-100'
        case 'info': return 'bg-blue-100'
        default: return 'bg-gray-100'
    }
}

const getIconColor = (type) => {
    switch (type) {
        case 'success': return 'text-green-600'
        case 'warning': return 'text-amber-600'
        case 'danger': return 'text-red-600'
        case 'info': return 'text-blue-600'
        default: return 'text-gray-600'
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
