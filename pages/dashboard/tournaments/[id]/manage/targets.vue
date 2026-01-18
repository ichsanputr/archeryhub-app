<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
                <h1 class="text-3xl font-black text-navy tracking-tight uppercase italic">Manajemen Lajur</h1>
                <p class="text-text-sub font-medium mt-1">Kelola pembagian target dan plotting atlet untuk tiap sesi
                    pertandingan.</p>
            </div>
            <div class="flex gap-3">
                <button
                    class="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-navy font-black text-sm hover:bg-gray-50 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-[20px]">filter_list</span>
                    Filter
                </button>
                <button
                    class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-navy font-black text-sm hover:bg-primary-hover transition-all shadow-lg border border-primary/20">
                    <span class="material-symbols-outlined text-[20px]">auto_fix_high</span>
                    Auto-Assign Target
                </button>
            </div>
        </div>

        <!-- Metric Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="metric in targetMetrics" :key="metric.label"
                class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
                <div :class="metric.bgClass" class="h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-2xl" :class="metric.iconColor">{{ metric.icon }}</span>
                </div>
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ metric.label }}
                    </p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-black text-navy tabular-nums">{{ metric.value }}</h3>
                        <span v-if="metric.subtext" class="text-[10px] font-black text-gray-400 opacity-60 uppercase">{{
                            metric.subtext }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Target Assignment Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="target in laneData" :key="target.id"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden hover:shadow-md transition-all relative group">

                <!-- Overlay for maintenance status -->
                <div v-if="target.status === 'maintenance'"
                    class="absolute inset-0 bg-white/60 z-10 flex flex-col items-center justify-center backdrop-blur-[1px] opacity-0 hover:opacity-100 transition-opacity">
                    <button
                        class="bg-navy text-primary font-black px-4 py-2 rounded-xl shadow-lg border border-navy/10 text-xs uppercase tracking-widest">Kelola
                        Status</button>
                </div>

                <div class="px-5 py-4 border-b border-gray-50 flex justify-between items-center"
                    :class="target.status === 'maintenance' ? 'bg-yellow-50/50' : 'bg-gray-50/30'">
                    <div class="flex items-center gap-3">
                        <div class="font-black text-sm px-2.5 py-1 rounded-lg shadow-sm"
                            :class="target.status === 'full' ? 'bg-navy text-primary' : 'bg-white text-navy border border-gray-200'">
                            {{ target.target }}
                        </div>
                        <span class="font-black text-navy uppercase tracking-tight italic">{{ target.label }}</span>
                    </div>
                    <span :class="getStatusClass(target.status)"
                        class="text-[9px] font-black px-2 py-1 rounded-full border uppercase tracking-widest">
                        {{ target.statusLabel }}
                    </span>
                </div>

                <div class="p-5 space-y-3 flex-grow" :class="target.status === 'maintenance' ? 'opacity-40' : ''">
                    <div v-for="pos in ['A', 'B', 'C', 'D']" :key="pos" class="group/item">
                        <div v-if="getArcher(target, pos)"
                            class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-transparent hover:border-primary/20 hover:bg-white transition-all">
                            <span
                                class="flex items-center justify-center w-6 h-6 rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 shadow-sm shadow-gray-100 uppercase">{{
                                pos }}</span>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-xs font-black text-navy truncate group-hover/item:text-primary transition-colors">
                                    {{ getArcher(target, pos).name }}</p>
                                <p class="text-[9px] font-bold text-gray-400 truncate uppercase tracking-tighter">{{
                                    getArcher(target, pos).division }}</p>
                            </div>
                        </div>
                        <div v-else @click="target.status !== 'maintenance' ? addArcher(target, pos) : null"
                            class="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer group/add">
                            <span
                                class="flex items-center justify-center w-6 h-6 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-300 uppercase">{{
                                pos }}</span>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-[10px] font-black text-gray-300 italic group-hover/add:text-primary transition-colors">
                                    Tersedia</p>
                            </div>
                            <span
                                class="material-symbols-outlined text-gray-300 text-[18px] group-hover/add:text-primary group-hover/add:rotate-90 transition-all">add_circle</span>
                        </div>
                    </div>
                </div>

                <div class="px-5 py-3 border-t border-gray-50 bg-gray-50/20">
                    <button
                        class="w-full flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 hover:text-navy transition-colors py-1 uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="target.status === 'maintenance'">
                        <span class="material-symbols-outlined text-[16px]">edit_document</span>
                        Atur Penempatan
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
    { label: 'Total Target', value: '32', icon: 'adjust', iconColor: 'text-blue-600', bgClass: 'bg-blue-50' },
    { label: 'Atlet Terdaftar', value: '112', icon: 'groups', iconColor: 'text-purple-600', bgClass: 'bg-purple-50', subtext: '/ 128 Slot' },
    { label: 'Slot Tersedia', value: '16', icon: 'event_seat', iconColor: 'text-green-600', bgClass: 'bg-green-50' },
    { label: 'Perbaikan', value: '1', icon: 'handyman', iconColor: 'text-orange-600', bgClass: 'bg-orange-50', subtext: 'Lajur 05' },
]

const laneData = reactive([
    { id: 1, target: '01', label: 'Target 1', status: 'full', statusLabel: 'Penuh', archers: { A: { name: 'Sarah Jenkins', division: 'Recurve Women' }, B: { name: 'Mike Ross', division: 'Recurve Men' }, C: { name: 'Emily Chen', division: 'Recurve Women' }, D: { name: 'David Kim', division: 'Recurve Men' } } },
    { id: 2, target: '02', label: 'Target 2', status: 'partial', statusLabel: '2 Tersisa', archers: { A: { name: 'Jessica Pearson', division: 'Compound Women' }, B: { name: 'Harvey Specter', division: 'Compound Men' } } },
    { id: 3, target: '03', label: 'Target 3', status: 'empty', statusLabel: 'Kosong', archers: {} },
    { id: 4, target: '04', label: 'Target 4', status: 'full', statusLabel: 'Penuh', archers: { A: { name: 'Louis Litt', division: 'Barebow Men' }, B: { name: 'Donna Paulsen', division: 'Barebow Women' }, C: { name: 'Rachel Zane', division: 'Barebow Women' }, D: { name: 'Katrina Bennett', division: 'Barebow Women' } } },
    { id: 5, target: '05', label: 'Target 5', status: 'maintenance', statusLabel: 'Maintenance', archers: {} },
    { id: 6, target: '06', label: 'Target 6', status: 'partial', statusLabel: '1 Tersisa', archers: { A: { name: 'Samantha Wheeler', division: 'Youth Recurve' }, B: { name: 'Alex Williams', division: 'Youth Recurve' }, C: { name: 'Robert Zane', division: 'Youth Recurve' } } },
])

const getArcher = (target, pos) => target.archers[pos]

const getStatusClass = (status) => {
    const classes = {
        'full': 'bg-green-50 text-green-700 border-green-200',
        'partial': 'bg-blue-50 text-blue-700 border-blue-200',
        'empty': 'bg-gray-50 text-gray-500 border-gray-100',
        'maintenance': 'bg-yellow-50 text-yellow-800 border-yellow-200'
    }
    return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const addArcher = (target, pos) => {
    alert(`Menambahkan atlet ke Lajur ${target.target} Posisi ${pos}`)
}
</script>

<style scoped>
.text-navy {
    color: #0f172a;
}

.text-text-sub {
    color: #4b5563;
}

.bg-navy {
    background-color: #0f172a;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
