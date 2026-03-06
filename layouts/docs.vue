<template>
    <div class="min-h-screen flex flex-col bg-gray-50 font-body text-navy overflow-x-hidden">
        <!-- Docs Header — always white -->
        <header
            class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 flex items-center">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
                <!-- Left: Logo + Docs badge -->
                <div class="flex items-center gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2.5">
                        <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                            <img src="/logo.png" alt="Archeryhub.id" class="w-5 h-5 object-contain" />
                        </div>
                        <span class="text-lg font-black tracking-tight text-navy">Archeryhub<span
                                class="text-[#D9FF00]">.id</span></span>
                    </NuxtLink>
                    <div class="hidden sm:flex items-center gap-2">
                        <span class="text-gray-200 text-lg font-light select-none">/</span>
                        <NuxtLink to="/docs" class="text-sm font-bold text-gray-500 hover:text-navy transition-colors">
                            Docs</NuxtLink>
                    </div>
                </div>

                <!-- Center: Search -->
                <div class="hidden md:block flex-1 max-w-sm mx-8">
                    <div class="relative">
                        <Icon icon="ph:magnifying-glass-bold"
                            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <NuxtLink to="/docs">
                            <div
                                class="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-400 cursor-pointer hover:border-primary transition-colors">
                                Cari dokumentasi...
                            </div>
                        </NuxtLink>
                    </div>
                </div>

                <!-- Right: Nav links -->
                <div class="flex items-center gap-4">
                    <NuxtLink to="/docs"
                        class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-navy transition-colors">
                        <Icon icon="ph:book-open-bold" class="text-base" />
                        <span>Dokumentasi</span>
                    </NuxtLink>
                    <NuxtLink to="/faq"
                        class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-navy transition-colors">
                        <Icon icon="ph:question-bold" class="text-base" />
                        <span>FAQ</span>
                    </NuxtLink>
                    <NuxtLink to="/contact"
                        class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-navy transition-colors">
                        <Icon icon="ph:chat-circle-dots-bold" class="text-base" />
                        <span>Support</span>
                    </NuxtLink>
                    <NuxtLink to="/dashboard"
                        class="inline-flex items-center gap-1.5 bg-navy text-primary text-sm font-bold px-4 py-2 rounded-xl hover:bg-navy/90 transition-all">
                        Dashboard
                    </NuxtLink>
                </div>
            </div>
        </header>

        <main class="flex-grow pt-16">
            <slot />
        </main>

        <!-- Simple docs footer -->
        <footer class="bg-white border-t border-gray-100 py-8 mt-8">
            <div
                class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
                <div class="flex items-center gap-2">
                    <img src="/logo.png" class="w-5 h-5 object-contain" alt="" />
                    <span>© 2025 Archeryhub.id — Dokumentasi</span>
                </div>
                <div class="flex items-center gap-6">
                    <NuxtLink to="/" class="hover:text-navy transition-colors">Beranda</NuxtLink>
                    <NuxtLink to="/docs" class="hover:text-navy transition-colors">Docs</NuxtLink>
                    <NuxtLink to="/faq" class="hover:text-navy transition-colors">FAQ</NuxtLink>
                    <NuxtLink to="/contact" class="hover:text-navy transition-colors">Kontak</NuxtLink>
                </div>
            </div>
        </footer>
        <BaseToast />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineOptions({ name: 'DocsLayout' })
</script>
