<template>
    <div class="space-y-8">
        <section class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-black text-navy">Subscription Saya</h1>
                    <p class="text-sm text-gray-500 mt-1">Kelola paket, pemakaian, dan riwayat tagihan Anda.</p>
                </div>
                <BaseButton variant="primary" icon="ph:credit-card-bold" size="sm">
                    Kelola Metode Pembayaran
                </BaseButton>
            </div>
        </section>

        <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div class="absolute top-4 right-4">
                    <span class="px-3 py-1 bg-primary/20 text-navy text-[10px] font-black uppercase tracking-widest rounded-full">
                        Aktif
                    </span>
                </div>
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Paket Saat Ini</h3>
                <div class="mb-6">
                    <p class="text-3xl font-black text-navy mb-1">Pro Club</p>
                    <p class="text-sm text-gray-500">Ditagih tahunan</p>
                </div>
                <div class="space-y-4 mb-6">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">Harga</span>
                        <span class="font-bold text-navy">Rp 799.000 / bulan</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">Tagihan Berikutnya</span>
                        <span class="font-bold text-navy">14 Nov 2026</span>
                    </div>
                </div>
                <button
                    class="w-full py-2.5 text-sm font-bold border border-navy text-navy rounded-lg hover:bg-slate-50 transition-colors">
                    Batalkan Subscription
                </button>
            </div>

            <div class="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Pemakaian & Batas</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div class="flex justify-between items-end mb-2">
                            <div>
                                <p class="text-sm font-bold text-navy">Anggota Aktif</p>
                                <p class="text-xs text-gray-500">Total anggota bulan ini</p>
                            </div>
                            <p class="text-sm font-black text-navy">842 <span class="text-gray-500 font-medium">/ 1.000</span>
                            </p>
                        </div>
                        <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-navy rounded-full" style="width: 84.2%"></div>
                        </div>
                        <p class="mt-3 text-[11px] text-gray-500 italic">
                            Pemakaian mendekati batas paket. Pertimbangkan upgrade untuk anggota tanpa batas.
                        </p>
                    </div>
                    <div>
                        <div class="flex justify-between items-end mb-2">
                            <div>
                                <p class="text-sm font-bold text-navy">Kredit Event</p>
                                <p class="text-xs text-gray-500">Saldo Pay-As-You-Go</p>
                            </div>
                            <p class="text-sm font-black text-navy">12 <span class="text-gray-500 font-medium">tersisa</span>
                            </p>
                        </div>
                        <div class="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full" style="width: 40%"></div>
                        </div>
                        <div class="mt-3 flex items-center justify-between">
                            <p class="text-[11px] text-gray-500">Termasuk 5 kredit bonus bulanan.</p>
                            <button class="text-[11px] font-bold text-navy underline">Beli Tambahan</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="space-y-5">
            <h2 class="text-lg font-extrabold text-navy">Ubah Paket</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                    <h4 class="text-sm font-bold text-navy mb-1">Rookie Club</h4>
                    <p class="text-2xl font-black text-navy mb-4">Rp 299rb<span class="text-sm font-normal text-gray-500">/bln</span>
                    </p>
                    <ul class="space-y-3 mb-8 flex-1">
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            Maks. 100 anggota
                        </li>
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            2 event tahunan
                        </li>
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            Laporan dasar
                        </li>
                    </ul>
                    <button
                        class="w-full py-2.5 text-xs font-bold border border-gray-200 text-gray-500 rounded-lg hover:bg-slate-50 transition-colors">
                        Downgrade
                    </button>
                </div>

                <div class="bg-white p-6 rounded-2xl border-2 border-primary ring-4 ring-primary/10 shadow-sm flex flex-col relative">
                    <div
                        class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-navy text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                        Paket Saat Ini
                    </div>
                    <h4 class="text-sm font-bold text-navy mb-1">Pro Club</h4>
                    <p class="text-2xl font-black text-navy mb-4">Rp 799rb<span class="text-sm font-normal text-gray-500">/bln</span>
                    </p>
                    <ul class="space-y-3 mb-8 flex-1">
                        <li class="flex items-center gap-2 text-xs text-navy font-medium">
                            <Icon icon="ph:check-circle-fill" class="text-primary text-sm" />
                            Maks. 1.000 anggota
                        </li>
                        <li class="flex items-center gap-2 text-xs text-navy font-medium">
                            <Icon icon="ph:check-circle-fill" class="text-primary text-sm" />
                            10 event tahunan
                        </li>
                        <li class="flex items-center gap-2 text-xs text-navy font-medium">
                            <Icon icon="ph:check-circle-fill" class="text-primary text-sm" />
                            Analitik lanjutan
                        </li>
                        <li class="flex items-center gap-2 text-xs text-navy font-medium">
                            <Icon icon="ph:check-circle-fill" class="text-primary text-sm" />
                            Dukungan prioritas
                        </li>
                    </ul>
                    <button class="w-full py-2.5 text-xs font-bold bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed"
                        disabled>
                        Dipilih
                    </button>
                </div>

                <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                    <h4 class="text-sm font-bold text-navy mb-1">Elite Organization</h4>
                    <p class="text-2xl font-black text-navy mb-4">Rp 2,1jt<span class="text-sm font-normal text-gray-500">/bln</span>
                    </p>
                    <ul class="space-y-3 mb-8 flex-1">
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            Anggota tanpa batas
                        </li>
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            Event tanpa batas
                        </li>
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            Branding kustom
                        </li>
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            Akses API
                        </li>
                        <li class="flex items-center gap-2 text-xs text-gray-500">
                            <Icon icon="ph:check-circle-fill" class="text-green-500 text-sm" />
                            Dedicated manager
                        </li>
                    </ul>
                    <button
                        class="w-full py-2.5 text-xs font-bold bg-primary text-navy rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                        Upgrade Sekarang
                    </button>
                </div>
            </div>
        </section>

        <section class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-sm font-bold text-navy uppercase tracking-widest">Riwayat Tagihan</h3>
                <button class="text-xs font-bold text-navy hover:underline flex items-center gap-1">
                    <Icon icon="ph:download-simple-bold" class="text-sm" />
                    Ekspor Semua
                </button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-gray-200">
                        <tr>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Tanggal Invoice</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Deskripsi</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Nominal</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                            <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Invoice</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="(invoice, index) in invoices" :key="index" class="hover:bg-slate-50/60 transition-colors">
                            <td class="px-6 py-4 text-sm font-medium text-navy">{{ invoice.date }}</td>
                            <td class="px-6 py-4 text-sm text-gray-500">{{ invoice.description }}</td>
                            <td class="px-6 py-4 text-sm font-bold text-navy">{{ invoice.amount }}</td>
                            <td class="px-6 py-4">
                                <span class="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    Lunas
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button class="p-2 hover:bg-slate-100 rounded-lg text-gray-500 transition-colors"
                                    title="Unduh PDF">
                                    <Icon icon="ph:download-simple-bold" class="text-lg" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-gray-200 bg-slate-50 flex justify-center">
                <button class="text-xs font-bold text-gray-500 hover:text-navy transition-colors">
                    Lihat Semua Riwayat Tagihan
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
    layout: 'dashboard'
})

const invoices = [
    {
        date: '14 Okt 2026',
        description: 'Subscription Pro Club (Perpanjangan Tahunan)',
        amount: 'Rp 9.588.000'
    },
    {
        date: '14 Sep 2026',
        description: 'Add-on: 50 Kredit Event Tambahan',
        amount: 'Rp 250.000'
    },
    {
        date: '14 Agu 2026',
        description: 'Subscription Pro Club (Tahunan)',
        amount: 'Rp 9.588.000'
    }
]

useSeoMeta({
    title: 'Subscription Dashboard - Archeryhub.id',
    description: 'Kelola subscription, limit penggunaan, dan riwayat tagihan di dashboard Archeryhub.id.'
})
</script>
