<template>
    <div class="space-y-10">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
                <h1 class="text-3xl font-black text-navy tracking-tight uppercase">Lane Management</h1>
                <p class="text-text-secondary mt-1 font-medium text-sm">Manage target assignments and archer placements
                    for each session.</p>
            </div>
            <div class="flex gap-3">
                <button
                    class="px-5 py-2.5 bg-white border border-gray-200 text-gray-400 hover:text-navy font-bold text-sm rounded-xl transition-all flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter Lanes
                </button>
                <button
                    class="px-5 py-2.5 bg-navy text-white hover:bg-navy-light font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">auto_fix_high</span>
                    Auto-Assign
                </button>
            </div>
        </div>

        <!-- Quick Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div v-for="metric in targetMetrics" :key="metric.label"
                class="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 group hover:border-primary transition-all">
                <div class="flex items-center justify-between mb-4">
                    <div :class="metric.bgClass"
                        class="size-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                        <span class="material-symbols-outlined text-[20px]" :class="metric.iconColor">{{ metric.icon
                            }}</span>
                    </div>
                    <span v-if="metric.subtext"
                        class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-gray-50 text-gray-400">{{
                        metric.subtext }}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ metric.label
                        }}</span>
                    <h3 class="text-2xl font-black text-navy">{{ metric.value }}</h3>
                </div>
            </div>
        </div>

        <!-- Target Assignment Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="target in laneData" :key="target.id"
                class="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col overflow-hidden hover:shadow-lg transition-all relative group">

                <!-- Overlay for maintenance status -->
                <div v-if="target.status === 'maintenance'"
                    class="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        class="bg-navy text-primary font-black px-5 py-2.5 rounded-xl shadow-lg text-xs uppercase tracking-widest">
                        Manage Status
                    </button>
                </div>

                <div class="px-5 py-4 border-b border-gray-50 flex justify-between items-center"
                    :class="target.status === 'maintenance' ? 'bg-amber-50/50' : 'bg-gray-50/30'">
                    <div class="flex items-center gap-3">
                        <div class="font-black text-sm px-3 py-1.5 rounded-xl shadow-sm"
                            :class="target.status === 'full' ? 'bg-navy text-primary' : 'bg-white text-navy border border-gray-200'">
                            {{ target.target }}
                        </div>
                        <span class="font-black text-navy uppercase tracking-tight text-sm">{{ target.label }}</span>
                    </div>
                    <span :class="getStatusClass(target.status)"
                        class="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest">
                        {{ target.statusLabel }}
                    </span>
                </div>

                <div class="p-5 space-y-3 flex-grow" :class="target.status === 'maintenance' ? 'opacity-40' : ''">
                    <div v-for="pos in ['A', 'B', 'C', 'D']" :key="pos" class="group/item">
                        <div v-if="getArcher(target, pos)"
                            class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-primary/20 hover:bg-white transition-all">
                            <span
                                class="flex items-center justify-center size-7 rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 shadow-sm">{{
                                pos }}</span>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-xs font-bold text-navy truncate group-hover/item:text-primary-hover transition-colors">
                                    {{ getArcher(target, pos).name }}
                                </p>
                                <p class="text-[9px] font-bold text-gray-400 truncate uppercase tracking-tight mt-0.5">
                                    {{ getArcher(target, pos).division }}
                                </p>
                            </div>
                        </div>
                        <div v-else @click="target.status !== 'maintenance' ? addArcher(target, pos) : null"
                            class="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer group/add">
                            <span
                                class="flex items-center justify-center size-7 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-300">{{
                                pos }}</span>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-[10px] font-black text-gray-300 group-hover/add:text-primary transition-colors uppercase">
                                    Available Slot
                                </p>
                            </div>
                            <span
                                class="material-symbols-outlined text-gray-300 text-[18px] group-hover/add:text-primary group-hover/add:rotate-90 transition-all">add_circle</span>
                        </div>
                    </div>
                </div>

                <div class="px-5 py-3 border-t border-gray-50 bg-gray-50/20">
                    <button
                        class="w-full flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 hover:text-navy transition-colors py-1.5 uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="target.status === 'maintenance'">
                        <span class="material-symbols-outlined text-[16px]">edit_document</span>
                        Edit Assignments
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

const targetMetrics = [
    { label: 'Total Lanes', value: '32', icon: 'adjust', iconColor: 'text-blue-600', bgClass: 'bg-blue-50' },
    { label: 'Registered Archers', value: '112', icon: 'groups', iconColor: 'text-purple-600', bgClass: 'bg-purple-50', subtext: '/ 128 Slots' },
    { label: 'Available Slots', value: '16', icon: 'event_seat', iconColor: 'text-emerald-600', bgClass: 'bg-emerald-50' },
    { label: 'Under Maintenance', value: '1', icon: 'handyman', iconColor: 'text-amber-600', bgClass: 'bg-amber-50', subtext: 'Lane 05' },
]

const laneData = reactive([
    { id: 1, target: '01', label: 'Lane 1', status: 'full', statusLabel: 'Full', archers: { A: { name: 'Sarah Jenkins', division: 'Recurve Women' }, B: { name: 'Mike Ross', division: 'Recurve Men' }, C: { name: 'Emily Chen', division: 'Recurve Women' }, D: { name: 'David Kim', division: 'Recurve Men' } } },
    { id: 2, target: '02', label: 'Lane 2', status: 'partial', statusLabel: '2 Left', archers: { A: { name: 'Jessica Pearson', division: 'Compound Women' }, B: { name: 'Harvey Specter', division: 'Compound Men' } } },
    { id: 3, target: '03', label: 'Lane 3', status: 'empty', statusLabel: 'Empty', archers: {} },
    { id: 4, target: '04', label: 'Lane 4', status: 'full', statusLabel: 'Full', archers: { A: { name: 'Louis Litt', division: 'Barebow Men' }, B: { name: 'Donna Paulsen', division: 'Barebow Women' }, C: { name: 'Rachel Zane', division: 'Barebow Women' }, D: { name: 'Katrina Bennett', division: 'Barebow Women' } } },
    { id: 5, target: '05', label: 'Lane 5', status: 'maintenance', statusLabel: 'Maintenance', archers: {} },
    { id: 6, target: '06', label: 'Lane 6', status: 'partial', statusLabel: '1 Left', archers: { A: { name: 'Samantha Wheeler', division: 'Youth Recurve' }, B: { name: 'Alex Williams', division: 'Youth Recurve' }, C: { name: 'Robert Zane', division: 'Youth Recurve' } } },
])

const getArcher = (target, pos) => target.archers[pos]

const getStatusClass = (status) => {
    const classes = {
        'full': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'partial': 'bg-blue-50 text-blue-700 border-blue-200',
        'empty': 'bg-gray-50 text-gray-500 border-gray-100',
        'maintenance': 'bg-amber-50 text-amber-700 border-amber-200'
    }
    return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const addArcher = (target, pos) => {
    alert(`Adding archer to Lane ${target.target} Position ${pos}`)
}
</script>
