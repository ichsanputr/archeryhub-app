<template>
    <div class="space-y-8">
        <!-- Plan Selection -->
        <div class="space-y-5">
            <div class="flex items-center gap-3">
                <div
                    class="size-8 bg-navy border border-navy rounded-lg flex items-center justify-center text-btn-inverse shadow-sm">
                    <Icon icon="ph:trophy-bold" class="text-lg" />
                </div>
                <h2 class="text-lg font-extrabold text-navy">Pilihan Paket Event Optimizer</h2>
            </div>
            <div
                class="flex flex-col lg:flex-row overflow-hidden rounded-[32px] border border-gray-100 shadow-sm bg-white min-h-[500px]">
                <!-- Left Banner -->
                <div
                    class="lg:w-4/12 bg-navy relative flex flex-col justify-center items-center px-8 py-16 text-center overflow-hidden text-white">
                    <div class="relative z-10">
                        <span class="text-primary/60 font-black tracking-[0.3em] text-[10px] mb-4 block">
                            Direkomendasikan untuk EO Profesional
                        </span>
                        <h3 class="text-white text-3xl font-black leading-tight mb-4 tracking-tight">Paket Elite</h3>
                        <div class="h-1.5 w-24 bg-primary mx-auto mb-8 rounded-full"></div>
                        <div class="text-slate-400 text-sm font-medium max-w-[220px] mx-auto leading-relaxed">
                            Solusi lengkap untuk turnamen skala besar dengan peserta tak terbatas dan analitik lanjutan.
                        </div>
                        <div class="mt-12 space-y-4">
                            <div class="flex items-center gap-3 justify-center text-primary/80">
                                <Icon icon="ph:users-three-fill" class="text-xl" />
                                <span class="text-xs font-black tracking-widest text-white/80">Peserta Tak
                                    Terbatas</span>
                            </div>
                            <div class="flex items-center gap-3 justify-center text-primary/80">
                                <Icon icon="ph:chart-bar-fill" class="text-xl" />
                                <span class="text-xs font-black tracking-widest text-white/80">Analitik
                                    Lanjutan</span>
                            </div>
                        </div>
                    </div>
                    <Icon icon="ph:trophy-bold"
                        class="absolute -bottom-10 -right-10 text-[240px] text-white/5 rotate-12" />
                </div>

                <!-- Plans Grid -->
                <div class="lg:w-8/12 p-8 md:p-12 flex flex-col justify-center bg-slate-50/20">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div v-for="plan in plans" :key="plan.id"
                            class="bg-white p-8 rounded-[24px] border-2 transition-all duration-300 flex flex-col relative group h-full shadow-sm"
                            :class="plan.isCurrent ? 'border-primary ring-8 ring-primary/5' : 'border-gray-100 hover:border-primary/20 hover:shadow-md'">

                            <div v-if="plan.isCurrent"
                                class="absolute -top-3 left-6 bg-navy text-btn-inverse text-[10px] font-black px-4 py-1.5 rounded-full capitalize tracking-widest shadow-sm">
                                Aktif
                            </div>

                            <div class="mb-6">
                                <div
                                    class="size-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <Icon
                                        :icon="plan.name.toLowerCase().includes('elite') ? 'ph:crown-bold' : 'ph:lightning-bold'"
                                        class="text-xl text-navy" />
                                </div>
                                <h4 class=" text-xs font-black text-gray-400 tracking-[0.2em] mb-2">{{
                                    plan.name }}</h4>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-3xl font-black text-navy">{{ plan.priceLabel }}</span>
                                    <span class="text-[10px] font-bold text-gray-400 tracking-widest ml-1">/
                                        {{ plan.billing }}</span>
                                </div>
                            </div>

                            <ul class="space-y-3 mb-8 flex-1">
                                <li v-for="feat in plan.features" :key="feat"
                                    class="flex items-start gap-2.5 text-[12px]"
                                    :class="plan.isCurrent ? 'text-navy font-bold' : 'text-navy/60 font-medium'">
                                    <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                                    <span>{{ feat }}</span>
                                </li>
                            </ul>

                            <button v-if="plan.isCurrent"
                                class="w-full py-4 text-[10px] font-black bg-slate-100 text-slate-400 rounded-2xl cursor-not-allowed tracking-widest border border-slate-200"
                                disabled>
                                Paket Aktif
                            </button>
                            <button v-else @click="$emit('select', plan)"
                                class="w-full py-4 text-[10px] font-black bg-navy text-white rounded-2xl hover:bg-primary hover:text-btn-text transition-all tracking-widest shadow-sm active:scale-95">
                                {{ plan.isUpgrade ? 'Upgrade Sekarang' : 'Pilih Paket' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Comparison Table -->
        <div class="space-y-6">
            <div class="flex items-center gap-3">
                <div
                    class="size-8 bg-navy border border-navy rounded-lg flex items-center justify-center text-btn-inverse shadow-sm">
                    <Icon icon="ph:scales-bold" class="text-lg" />
                </div>
                <h2 class="text-lg font-extrabold text-navy">Perbandingan Detail</h2>
            </div>
            <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden overflow-x-auto">
                <table class="w-full text-left min-w-[600px]">
                    <thead>
                        <tr class="bg-slate-50/50 border-b border-gray-100">
                            <th class="px-8 py-5 text-[10px] font-black text-gray-400 tracking-[0.2em]">Fitur
                                Utama</th>
                            <th
                                class="px-8 py-5 text-center text-xs font-black text-navy tracking-widest border-l border-gray-50">
                                Standar</th>
                            <th
                                class="px-8 py-5 text-center text-xs font-black text-primary tracking-widest border-l border-gray-50 bg-primary/5">
                                Elite</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="row in comparisonData" :key="row.feature"
                            class="group hover:bg-slate-50/30 transition-colors">
                            <td class="px-8 py-4">
                                <div class="flex items-center gap-4">
                                    <Icon :icon="row.icon"
                                        class="text-lg text-gray-400 group-hover:text-primary transition-colors" />
                                    <span class="text-sm font-bold text-navy/80">{{ row.feature }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-4 text-center border-l border-gray-100">
                                <template v-if="typeof row.basic === 'boolean'">
                                    <Icon :icon="row.basic ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                        class="text-xl mx-auto"
                                        :class="row.basic ? 'text-green-500' : 'text-gray-200'" />
                                </template>
                                <span v-else class="text-xs font-black text-navy/60">{{ row.basic }}</span>
                            </td>
                            <td class="px-8 py-4 text-center border-l border-gray-100 bg-primary/5">
                                <template v-if="typeof row.elite === 'boolean'">
                                    <Icon :icon="row.elite ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                        class="text-xl mx-auto" :class="row.elite ? 'text-primary' : 'text-gray-200'" />
                                </template>
                                <span v-else class="text-xs font-black text-navy">{{ row.elite }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="p-4 bg-slate-50/50 text-center border-t border-gray-50">
                    <div class="text-[10px] text-gray-400 font-bold tracking-[0.2em]">
                        * Downgrade akan berlaku setelah periode tagihan berjalan berakhir.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    plans: Array,
})

defineEmits(['select'])

const comparisonData = [
    { feature: 'Maksimum Peserta', basic: '50 / Event', elite: 'Tak Terbatas', icon: 'ph:users-three-bold' },
    { feature: 'Sistem Digital Scoring', basic: true, elite: true, icon: 'ph:target-bold' },
    { feature: 'Publikasi Berita', basic: true, elite: true, icon: 'ph:newspaper-bold' },
    { feature: 'Manajemen Match Finals', basic: false, elite: true, icon: 'ph:trophy-bold' },
    { feature: 'Integrasi Pembayaran', basic: false, elite: true, icon: 'ph:credit-card-bold' },
    { feature: 'Penyimpanan Media', basic: '1 GB', elite: '5 GB', icon: 'ph:hard-drives-bold' },
    { feature: 'Analitik Lanjutan', basic: false, elite: true, icon: 'ph:chart-bar-bold' },
    { feature: 'Dukungan Prioritas', basic: true, elite: true, icon: 'ph:headset-bold' },
]
</script>
