<template>
    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <!-- Breadcrumb -->
        <div class="mb-8">
            <Breadcrumbs :items="[
                { label: 'Support Center', path: '/help' },
                { label: 'Tutorials', path: '/help/tutorials' }
            ]" :current="tutorial.title" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <!-- Tutorial Content -->
            <article class="lg:col-span-8">
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span class="bg-primary/10 text-navy px-3 py-1 rounded-full text-xs font-bold  tracking-wider">
                            {{ tutorial.category }}
                        </span>
                        <div
                            class="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-slate-500 text-xs font-bold">
                            <Icon icon="ph:clock-bold" class="text-sm" />
                            {{ tutorial.readTime }} mnt baca
                        </div>
                        <div
                            class="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-slate-500 text-xs font-bold">
                            <Icon icon="ph:calendar-check-bold" class="text-sm" />
                            Diperbarui: {{ tutorial.lastUpdated }}
                        </div>
                    </div>
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-navy leading-tight mb-6">
                        {{ tutorial.title }}
                    </h1>
                </div>

                <!-- Tutorial Hero Image (Optional) -->
                <div v-if="tutorial.image"
                    class="mb-10 rounded-2xl overflow-hidden shadow-sm aspect-video relative border border-gray-100">
                    <img :src="tutorial.image" :alt="tutorial.title" class="w-full h-full object-cover" />
                </div>

                <!-- Tutorial Body -->
                <div class="prose prose-slate prose-lg max-w-none 
                    prose-headings:text-navy prose-headings:font-black 
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-navy prose-strong:font-black">
                    <div v-html="tutorial.content"></div>
                </div>

                <!-- Helpful Feedback -->
                <div
                    class="mt-12 p-8 bg-white rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                    <div>
                        <h4 class="font-black text-navy text-lg mb-1">Apakah panduan ini membantu?</h4>
                        <p class="text-sm text-slate-500">Berikan feedback Anda untuk membantu kami meningkatkan
                            layanan.</p>
                    </div>
                    <div class="flex gap-3">
                        <BaseButton variant="outline" size="sm" icon="ph:thumbs-up-bold"
                            class="hover:border-primary hover:text-primary">Ya, Membantu</BaseButton>
                        <BaseButton variant="outline" size="sm" icon="ph:thumbs-down-bold"
                            class="hover:border-red-500 hover:text-red-500">Tidak</BaseButton>
                    </div>
                </div>
            </article>

            <!-- Sidebar -->
            <aside class="lg:col-span-4 space-y-8">
                <!-- Related Guides -->
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <span class="w-1 h-6 bg-primary rounded-full"></span>
                        Panduan Terkait
                    </h3>
                    <div class="space-y-6">
                        <NuxtLink v-for="guide in relatedGuides" :key="guide.slug" :to="`/help/${guide.slug}`"
                            class="group block">
                            <h4
                                class="font-bold text-navy text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                {{ guide.title }}
                            </h4>
                            <span class="text-[10px] text-slate-400 font-bold  tracking-wider">{{
                                guide.category }}</span>
                        </NuxtLink>
                    </div>
                    <NuxtLink to="/help"
                        class="block w-full text-center mt-6 py-2.5 rounded-lg border border-gray-200 text-sm font-bold text-slate-600 hover:bg-gray-50 transition-colors">
                        Kembali ke Pusat Bantuan
                    </NuxtLink>
                </div>

                <!-- Need More Help? -->
                <div class="bg-navy rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                    <div class="relative z-10 text-center">
                        <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Icon icon="ph:chat-circle-text-bold" class="text-3xl text-primary" />
                        </div>
                        <h3 class="text-xl font-bold mb-2">Butuh Bantuan Lebih?</h3>
                        <p class="text-white/60 text-sm mb-8 leading-relaxed">
                            Belum menemukan solusi? Tim dukungan kami siap membantu Anda secara langsung.
                        </p>
                        <NuxtLink to="/contact">
                            <BaseButton variant="primary" block size="lg" icon="ph:paper-plane-tilt-bold">
                                Hubungi Support
                            </BaseButton>
                        </NuxtLink>
                    </div>
                </div>
            </aside>
        </div>
    </main>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const slug = route.params.slug

// Mock data for the tutorial - In a real app, this would be fetched from an API
const tutorial = ref({
    title: 'Cara Mendaftarkan Klub Panahan Anda',
    category: 'Akun & Profil',
    readTime: 5,
    lastUpdated: '15 Jan 2026',
    image: '/hero-homepage.jpeg',
    content: `
        <p>Selamat datang di Archeryhub.id! Mendaftarkan klub Anda adalah langkah pertama untuk mulai mengelola anggota, inventaris, dan turnamen secara digital.</p>
        
        <h2>Langkah 1: Registrasi Akun Klub</h2>
        <p>Pergi ke halaman pendaftaran dan pilih opsi <strong>Akun Klub</strong>. Pastikan Anda menggunakan email resmi klub untuk memudahkan proses verifikasi di masa mendatang.</p>
        
        <h2>Langkah 2: Melengkapi Profil</h2>
        <p>Setelah login, Anda akan diarahkan ke dashboard manajemen klub. Lengkapi informasi dasar seperti:</p>
        <ul>
            <li>Nama Resmi Klub</li>
            <li>Alamat Lengkap & Koordinat Latihan</li>
            <li>Logo Klub (Format PNG/JPG, Maks 2MB)</li>
            <li>Struktur Organisasi (Opsional)</li>
        </ul>
        
        <blockquote>
            Tip: Profil yang lengkap dengan logo dan alamat yang jelas akan lebih mudah ditemukan oleh para pemanah yang ingin bergabung.
        </blockquote>

        <h2>Langkah 3: Verifikasi Identitas</h2>
        <p>Untuk fitur premium seperti e-scoring dan manajemen keuangan, kami memerlukan verifikasi identitas pengurus klub. Silakan unggah dokumen pendukung melalui menu Pengaturan Keamanan.</p>
    `
})

const relatedGuides = ref([
    { title: 'Menambahkan anggota baru ke klub', category: 'Manajemen Anggota', slug: 'add-members' },
    { title: 'Mengatur kategori alat dan inventaris', category: 'Gudang', slug: 'inventory-setup' },
    { title: 'Panduan pembayaran iuran bulanan', category: 'Keuangan', slug: 'billing-guide' }
])

useHead({
    title: computed(() => `${tutorial.value.title} - Pusat Bantuan Archeryhub.id`)
})
</script>
