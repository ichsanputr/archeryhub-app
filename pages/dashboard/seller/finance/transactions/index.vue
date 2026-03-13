<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="flex items-center gap-5">
          <div
            class="size-14 sm:size-16 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
            <Icon icon="ph:list-bullets-bold" class="text-primary text-3xl sm:text-4xl" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">Riwayat Transaksi</h1>
            <div class="text-slate-300 text-xs sm:text-sm font-bold mt-1 tracking-wide">Pantau semua arus kas masuk dan keluar toko anda</div>
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/dashboard/seller/finance/balance">
            <BaseButton variant="white" icon="ph:wallet-bold"
              class="h-12 px-6 font-black text-[11px] !rounded-2xl border-white/10 hover:bg-white/10 hover:text-white transition-all">
              Saldo & Rekening
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Rest of the transactions page content would go here -->
    <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
      <div class="text-center py-20">
        <Icon icon="ph:clock-counter-clockwise-bold" class="text-6xl text-gray-100 mx-auto mb-4" />
        <div class="text-gray-400 font-bold">Daftar transaksi akan muncul di sini</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Riwayat Transaksi - Dashboard Seller' })
</script>