<template>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 py-10 border-t border-gray-100 mt-10">
        <!-- Result Info -->
        <div v-if="totalItems" class="text-sm font-medium text-gray-400">
            Menampilkan <span class="text-navy font-bold">{{ startItem }}</span> - <span class="text-navy font-bold">{{
                endItem }}</span>
            dari <span class="text-navy font-black tracking-tighter">{{ totalItems }}</span> Peserta
        </div>
        <div v-else-if="totalPages" class="text-sm font-medium text-gray-400">
            Halaman <span class="text-navy font-bold">{{ currentPage }}</span> dari <span class="text-navy font-bold">{{
                totalPages }}</span>
        </div>

        <!-- Pagination Controls -->
        <nav class="flex items-center gap-1 sm:gap-2">
            <!-- Prev Button -->
            <button @click="emitPage(currentPage - 1)" :disabled="currentPage === 1"
                class="group flex items-center justify-center size-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:border-navy hover:text-navy transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-sm">
                <Icon icon="ph:caret-left-bold" class="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1 sm:gap-1.5">
                <template v-for="(page, index) in displayedPages" :key="index">
                    <button v-if="typeof page === 'number'" @click="emitPage(page)" :class="[
                        'size-10 flex items-center justify-center rounded-xl font-black text-sm transition-all duration-300 transform active:scale-90',
                        currentPage === page
                            ? 'bg-navy text-primary shadow-lg shadow-navy/10 scale-105 z-10'
                            : 'bg-white text-gray-400 border border-gray-100 hover:border-navy hover:text-navy hover:shadow-sm'
                    ]">
                        {{ page }}
                    </button>
                    <div v-else class="size-10 flex items-center justify-center text-gray-300">
                        <Icon icon="ph:dots-three-outline-fill" class="text-xs opacity-50" />
                    </div>
                </template>
            </div>

            <!-- Next Button -->
            <button @click="emitPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="group flex items-center justify-center size-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:border-navy hover:text-navy transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-sm">
                <Icon icon="ph:caret-right-bold" class="group-hover:translate-x-0.5 transition-transform" />
            </button>
        </nav>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    totalItems: {
        type: Number,
        default: 0
    },
    itemsPerPage: {
        type: Number,
        default: 12
    }
})

const emit = defineEmits(['update:currentPage', 'change-page'])

const startItem = computed(() => ((props.currentPage - 1) * props.itemsPerPage) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

const displayedPages = computed(() => {
    const total = props.totalPages
    const current = props.currentPage
    const delta = 2 // Number of pages to show around current page
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
            range.push(i)
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1)
            } else if (i - l !== 1) {
                rangeWithDots.push('...')
            }
        }
        rangeWithDots.push(i)
        l = i
    }

    return rangeWithDots
})

const emitPage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
        emit('update:currentPage', page)
        emit('change-page', page)
    }
}
</script>

<style scoped>
/* Smooth button transitions */
button {
    -webkit-tap-highlight-color: transparent;
}
</style>
