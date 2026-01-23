<template>
    <div class="flex flex-col h-full overflow-hidden bg-[#f9fafb] relative -m-8 h-[calc(100vh-64px)]">
        <!-- Header -->
        <header class="h-16 flex items-center justify-between border-b border-gray-200 px-8 bg-white z-10 shrink-0">
            <div class="flex items-center gap-4 text-navy">
                <h2 class="text-navy text-xl font-bold leading-tight tracking-tight">Scoring Management</h2>
            </div>
            <div class="flex items-center gap-4">
                <div class="relative hidden lg:block group">
                    <Icon icon="ph:magnifying-glass"
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] group-focus-within:text-navy transition-colors" />
                    <input
                        class="bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-navy placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent w-64 transition-all shadow-sm hover:bg-white outline-none"
                        placeholder="Search target or archer..." type="text" />
                </div>
                <button
                    class="flex items-center justify-center h-10 w-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-navy transition-colors relative shadow-sm">
                    <Icon icon="ph:bell" class="text-[20px]" />
                    <span class="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
            </div>
        </header>

        <div
            class="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div class="max-w-7xl mx-auto flex flex-col gap-6">
                <!-- Target Detail Header -->
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 class="text-3xl font-extrabold text-navy tracking-tight flex items-center gap-3">
                            Target {{ targetNumber }}
                            <span
                                class="text-lg font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">18m
                                Recurve</span>
                        </h1>
                        <p class="text-gray-500 mt-1 font-medium">{{ eventName }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-right">
                            <span class="block text-xs uppercase text-gray-400 font-bold tracking-wider">Current
                                Status</span>
                            <span class="text-lg font-bold text-green-600 flex items-center justify-end gap-1.5">
                                <span class="relative flex h-3 w-3">
                                    <span
                                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                Live Scoring
                            </span>
                        </div>
                        <div class="h-10 w-px bg-gray-200 mx-2"></div>
                        <div class="text-right">
                            <span class="block text-xs uppercase text-gray-400 font-bold tracking-wider">Progress</span>
                            <span class="text-lg font-bold text-navy">End {{ currentEnd }} <span
                                    class="text-gray-400 text-sm font-normal">of 20</span></span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                    <!-- Left: Archer Cards -->
                    <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                        <div v-for="(archer, index) in archers" :key="archer.id" @click="activeArcherIndex = index"
                            class="bg-white rounded-xl shadow-sm border transition-all cursor-pointer relative overflow-hidden h-fit"
                            :class="[
                                activeArcherIndex === index ? 'ring-2 ring-primary border-primary' : 'border-gray-200 opacity-70 hover:opacity-100'
                            ]">
                            <!-- Active Indicator Bar -->
                            <div class="absolute top-0 left-0 w-2 h-full transition-colors"
                                :class="activeArcherIndex === index ? 'bg-primary' : 'bg-gray-200 opacity-50'"></div>

                            <div class="p-5 pl-7">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 rounded-lg text-white flex items-center justify-center font-bold text-lg"
                                            :class="activeArcherIndex === index ? 'bg-navy' : 'bg-gray-400'">
                                            {{ archer.position }}
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold text-navy leading-tight">{{ archer.name }}</h3>
                                            <div class="text-xs text-gray-500 font-medium">Rank {{ archer.rank }} •
                                                Club: {{ archer.club }}</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-xs text-gray-400 font-bold uppercase">Total Score</div>
                                        <div class="text-2xl font-black text-navy">{{ archer.totalScore }}</div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">End {{
                                            currentEnd }} Arrows</span>
                                        <span v-if="activeArcherIndex === index"
                                            class="text-xs font-bold text-primary-hover uppercase tracking-wider">Evaluating</span>
                                        <span v-else-if="isEndComplete(archer)"
                                            class="text-xs font-bold text-blue-500 uppercase tracking-wider">Completed</span>
                                    </div>
                                    <div class="flex gap-2 sm:gap-3">
                                        <div v-for="(score, sIdx) in archer.currentEndScores" :key="sIdx"
                                            class="flex-1 aspect-square bg-white border rounded-lg shadow-sm flex items-center justify-center text-xl font-bold transition-all"
                                            :class="[
                                                score ? 'border-gray-200 text-navy' : 'bg-gray-100 border-dashed border-2 border-gray-300 text-gray-400',
                                                activeArcherIndex === index && currentArrowIndex === sIdx ? 'border-2 border-primary ring-2 ring-primary/20' : ''
                                            ]">
                                            {{ score }}
                                        </div>
                                        <div class="w-px bg-gray-300 mx-1"></div>
                                        <div
                                            class="flex-1 aspect-square bg-navy text-primary rounded-lg flex flex-col items-center justify-center shadow-sm">
                                            <span class="text-[10px] uppercase font-bold opacity-70">Sum</span>
                                            <span class="text-xl font-bold">{{ calculateEndSum(archer) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                                    <span
                                        class="text-xs font-semibold text-gray-400 whitespace-nowrap mr-1">Prev:</span>
                                    <div v-for="(prevEnd, pIdx) in archer.prevEnds" :key="pIdx"
                                        class="px-2 py-1 bg-gray-50 rounded border border-gray-100 text-xs text-gray-600 font-mono">
                                        E{{ pIdx + 1 }}: {{ prevEnd }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Keypad -->
                    <div class="lg:col-span-5 xl:col-span-4">
                        <div class="bg-white rounded-xl shadow-card border border-gray-200 p-6 sticky top-6">
                            <div class="flex justify-between items-center mb-5">
                                <h3 class="font-bold text-navy flex items-center gap-2">
                                    <Icon icon="ph:keyboard" />
                                    Rapid Entry
                                </h3>
                                <button @click="clearCurrentArcher"
                                    class="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wide">Clear
                                    Entry</button>
                            </div>

                            <div class="grid grid-cols-3 gap-3 mb-4">
                                <button v-for="key in keys" :key="key.label" @click="inputScore(key.value)"
                                    class="key-btn h-16 rounded-lg text-2xl font-black transition-all shadow-key active:border-b-0 active:translate-y-[4px] border-b-4"
                                    :class="key.class">
                                    {{ key.label }}
                                </button>
                            </div>

                            <div class="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button @click="deleteLastScore"
                                    class="flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 bg-white text-navy font-bold hover:bg-gray-50 transition-colors">
                                    <Icon icon="ph:backspace" />
                                    Delete
                                </button>
                                <button @click="nextArcher"
                                    class="flex items-center justify-center gap-2 h-12 rounded-lg bg-navy text-white font-bold hover:bg-navy-light transition-colors shadow-lg shadow-navy/20">
                                    Next Archer
                                    <Icon icon="ph:arrow-right" />
                                </button>
                            </div>

                            <div class="mt-4 text-center">
                                <p class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Keyboard
                                    Shortcuts Enabled</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const targetNumber = ref('01')
const eventName = ref('Indonesian Open Championship 2024')
const currentEnd = ref(4)

const archers = ref([
    {
        id: 1,
        position: 'A',
        name: 'Sarah Jenkins',
        club: 'Eagles Archery',
        rank: 1,
        totalScore: 298,
        currentEndScores: ['', '', '', '', '', ''],
        prevEnds: [56, 54, 58]
    },
    {
        id: 2,
        position: 'B',
        name: 'Mike Ross',
        club: 'Pearson Specter',
        rank: 3,
        totalScore: 285,
        currentEndScores: ['', '', '', '', '', ''],
        prevEnds: [52, 53, 50]
    }
])

const activeArcherIndex = ref(0)
const currentArrowIndex = ref(0)

const keys = [
    { label: 'X', value: 'X', class: 'bg-[#FFE500] border-[#e6ce00] text-navy' },
    { label: '10', value: '10', class: 'bg-[#FFE500] border-[#e6ce00] text-navy' },
    { label: '9', value: '9', class: 'bg-[#FFE500] border-[#e6ce00] text-navy' },
    { label: '8', value: '8', class: 'bg-[#EF4444] border-red-700 text-white' },
    { label: '7', value: '7', class: 'bg-[#EF4444] border-red-700 text-white' },
    { label: '6', value: '6', class: 'bg-[#3B82F6] border-blue-700 text-white' },
    { label: '5', value: '5', class: 'bg-[#3B82F6] border-blue-700 text-white' },
    { label: '4', value: '4', class: 'bg-[#111827] border-black text-white' },
    { label: '3', value: '3', class: 'bg-[#111827] border-black text-white' },
    { label: '2', value: '2', class: 'bg-white border-gray-200 border-b-gray-300 text-navy' },
    { label: '1', value: '1', class: 'bg-white border-gray-200 border-b-gray-300 text-navy' },
    { label: 'M', value: 'M', class: 'bg-gray-100 border-gray-200 border-b-gray-300 text-gray-500' },
]

const inputScore = (val) => {
    const archer = archers.value[activeArcherIndex.value]
    if (currentArrowIndex.value < 6) {
        archer.currentEndScores[currentArrowIndex.value] = val
        currentArrowIndex.value++

        if (currentArrowIndex.value === 6) {
            // Auto-advance logic can be added here or via a dedicated button
        }
    }
}

const deleteLastScore = () => {
    const archer = archers.value[activeArcherIndex.value]
    if (currentArrowIndex.value > 0) {
        currentArrowIndex.value--
        archer.currentEndScores[currentArrowIndex.value] = ''
    }
}

const clearCurrentArcher = () => {
    const archer = archers.value[activeArcherIndex.value]
    archer.currentEndScores = ['', '', '', '', '', '']
    currentArrowIndex.value = 0
}

const nextArcher = () => {
    activeArcherIndex.value = (activeArcherIndex.value + 1) % archers.value.length

    // Find first empty arrow index for the new active archer
    const archer = archers.value[activeArcherIndex.value]
    const firstEmpty = archer.currentEndScores.findIndex(s => s === '')
    currentArrowIndex.value = firstEmpty === -1 ? 6 : firstEmpty
}

const calculateEndSum = (archer) => {
    return archer.currentEndScores.reduce((sum, val) => {
        if (!val) return sum
        if (val === 'X') return sum + 10
        if (val === 'M') return sum
        return sum + parseInt(val)
    }, 0)
}

const isEndComplete = (archer) => {
    return archer.currentEndScores.every(s => s !== '')
}

const handleKeyDown = (e) => {
    const keyMap = {
        '0': '10',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        'x': 'X',
        'X': 'X',
        'm': 'M',
        'M': 'M',
        'Backspace': 'delete',
        'Enter': 'next'
    }

    const val = keyMap[e.key]
    if (val === 'delete') {
        deleteLastScore()
    } else if (val === 'next') {
        nextArcher()
    } else if (val) {
        inputScore(val)
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.shadow-key {
    box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.1);
}

.key-btn:active {
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}
</style>
