<template>
    <div class="space-y-10">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Detail Turnamen</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Manajemen Bantalan</h1>
                <p class="text-gray-500 font-medium mt-1">Atur penempatan atlet dan konfigurasi bantalan target.</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:funnel" class="h-11">
                    Filter Bantalan
                </BaseButton>
                <BaseButton variant="white" icon="ph:magic-wand" class="h-11">
                    Isi Otomatis
                </BaseButton>
                <BaseButton variant="primary" icon="ph:pencil-simple-bold" class="h-11 shadow-lg shadow-primary/20">
                    Edit Penempatan
                </BaseButton>
            </div>
        </div>

        <!-- Quick Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:target" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Target</p>
                    <p class="text-xl font-black text-navy">{{ targets.length }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:users-three" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Atlet Terdaftar</p>
                    <p class="text-xl font-black text-navy">{{ totalAthletes }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:user-plus" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Slot Tersedia</p>
                    <p class="text-xl font-black text-navy">{{ availableSlots }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:wrench" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sedang Perbaikan</p>
                    <p class="text-xl font-black text-navy">2</p>
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
                        <span class="font-black text-navy uppercase tracking-tight text-sm">{{
                            target.label.toLowerCase() }}</span>
                    </div>
                    <span :class="getStatusClass(target.status)"
                        class="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest">
                        {{ target.statusLabel.toLowerCase() }}
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
                                    slot tersedia
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
                        edit penempatan
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
    { label: 'total target', value: '32', icon: 'adjust', iconColor: 'text-blue-600', bgClass: 'bg-blue-50' },
    { label: 'atlet terdaftar', value: '112', icon: 'groups', iconColor: 'text-purple-600', bgClass: 'bg-purple-50', subtext: '/ 128 slot' },
    { label: 'slot tersedia', value: '16', icon: 'event_seat', iconColor: 'text-emerald-600', bgClass: 'bg-emerald-50' },
    { label: 'sedang perbaikan', value: '1', icon: 'handyman', iconColor: 'text-amber-600', bgClass: 'bg-amber-50', subtext: 'target 05' },
]

const laneData = reactive([
    { id: 1, target: '01', label: 'target 1', status: 'full', statusLabel: 'penuh', archers: { A: { name: 'Sarah Jenkins', division: 'Recurve Women' }, B: { name: 'Mike Ross', division: 'Recurve Men' }, C: { name: 'Emily Chen', division: 'Recurve Women' }, D: { name: 'David Kim', division: 'Recurve Men' } } },
    { id: 2, target: '02', label: 'target 2', status: 'partial', statusLabel: 'sisa 2', archers: { A: { name: 'Jessica Pearson', division: 'Compound Women' }, B: { name: 'Harvey Specter', division: 'Compound Men' } } },
    { id: 3, target: '03', label: 'target 3', status: 'empty', statusLabel: 'kosong', archers: {} },
    { id: 4, target: '04', label: 'target 4', status: 'full', statusLabel: 'penuh', archers: { A: { name: 'Louis Litt', division: 'Barebow Men' }, B: { name: 'Donna Paulsen', division: 'Barebow Women' }, C: { name: 'Rachel Zane', division: 'Barebow Women' }, D: { name: 'Katrina Bennett', division: 'Barebow Women' } } },
    { id: 5, target: '05', label: 'target 5', status: 'maintenance', statusLabel: 'perbaikan', archers: {} },
    { id: 6, target: '06', label: 'target 6', status: 'partial', statusLabel: 'sisa 1', archers: { A: { name: 'Samantha Wheeler', division: 'Youth Recurve' }, B: { name: 'Alex Williams', division: 'Youth Recurve' }, C: { name: 'Robert Zane', division: 'Youth Recurve' } } },
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
