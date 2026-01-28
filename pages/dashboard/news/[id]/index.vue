<template>
    <div class="flex flex-col gap-8">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <NuxtLink to="/dashboard/news" class="hover:text-primary transition-colors">Berita</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Detail</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">{{ article.title }}</h1>
            </div>
            <div class="flex items-center gap-3">
                <NuxtLink :to="`/dashboard/news/${route.params.id}/edit`">
                    <BaseButton variant="outline" icon="ph:pencil-simple">
                        Edit
                    </BaseButton>
                </NuxtLink>
                <BaseButton variant="white" icon="ph:trash" @click="deleteArticle" class="text-red-500 hover:bg-red-50">
                    Hapus
                </BaseButton>
            </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Article Content -->
            <div class="lg:col-span-2">
                <article class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <!-- Featured Image -->
                    <div class="relative h-80 bg-gradient-to-br from-navy to-blue-800">
                        <img v-if="article.image" :src="article.image" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Icon icon="ph:newspaper" class="text-7xl text-white/20" />
                        </div>

                        <!-- Category Badge -->
                        <div class="absolute top-6 left-6">
                            <span :class="[
                                'px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-sm',
                                article.category === 'Event' ? 'bg-blue-500/90 text-white' :
                                    article.category === 'Pengumuman' ? 'bg-amber-500/90 text-white' :
                                        article.category === 'Prestasi' ? 'bg-green-500/90 text-white' :
                                            'bg-gray-500/90 text-white'
                            ]">
                                {{ article.category }}
                            </span>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-8">
                        <!-- Meta Info -->
                        <div class="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                            <div class="flex items-center gap-2">
                                <div
                                    class="h-8 w-8 rounded-full bg-navy text-white flex items-center justify-center text-sm font-bold">
                                    {{ article.author.charAt(0) }}
                                </div>
                                <span class="font-medium text-gray-600">{{ article.author }}</span>
                            </div>
                            <div class="h-4 w-px bg-gray-200"></div>
                            <div class="flex items-center gap-1.5">
                                <Icon icon="ph:calendar" />
                                <span>{{ article.date }}</span>
                            </div>
                            <div class="h-4 w-px bg-gray-200"></div>
                            <div class="flex items-center gap-1.5">
                                <Icon icon="ph:clock" />
                                <span>{{ article.readTime }} menit baca</span>
                            </div>
                        </div>

                        <!-- Article Body -->
                        <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            <p class="text-xl text-gray-600 font-medium mb-6">{{ article.excerpt }}</p>

                            <div v-html="article.content"></div>
                        </div>

                        <!-- Tags -->
                        <div class="mt-8 pt-6 border-t border-gray-100">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-sm text-gray-400 font-medium">Tags:</span>
                                <span v-for="tag in article.tags" :key="tag"
                                    class="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors">
                                    {{ tag }}
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Status Card -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:info" class="text-primary" />
                        Status Berita
                    </h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Status</span>
                            <span :class="[
                                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                                article.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                            ]">
                                {{ article.status === 'published' ? 'Dipublikasi' : 'Draft' }}
                            </span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Dibuat</span>
                            <span class="text-sm font-medium text-gray-700">{{ article.createdAt }}</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-sm text-gray-500">Terakhir diubah</span>
                            <span class="text-sm font-medium text-gray-700">{{ article.updatedAt }}</span>
                        </div>
                    </div>
                </div>

                <!-- Stats Card -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:chart-line-up" class="text-primary" />
                        Statistik
                    </h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="text-center p-4 bg-blue-50 rounded-xl">
                            <div class="flex items-center justify-center gap-1.5 text-blue-600 mb-1">
                                <Icon icon="ph:eye" class="text-lg" />
                            </div>
                            <p class="text-2xl font-bold text-navy">{{ article.views.toLocaleString() }}</p>
                            <p class="text-xs text-gray-400 font-medium">Views</p>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <div class="flex items-center justify-center gap-1.5 text-green-600 mb-1">
                                <Icon icon="ph:share-network" class="text-lg" />
                            </div>
                            <p class="text-2xl font-bold text-navy">{{ article.shares }}</p>
                            <p class="text-xs text-gray-400 font-medium">Shares</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="font-bold text-navy mb-4 flex items-center gap-2">
                        <Icon icon="ph:lightning" class="text-primary" />
                        Aksi Cepat
                    </h3>
                    <div class="space-y-2">
                        <BaseButton v-if="article.status === 'draft'" variant="gold" block icon="ph:paper-plane-tilt"
                            @click="publishArticle">
                            Publikasikan
                        </BaseButton>
                        <BaseButton v-else variant="outline" block icon="ph:archive" @click="unpublishArticle">
                            Tarik ke Draft
                        </BaseButton>
                        <BaseButton variant="white" block icon="ph:copy" @click="duplicateArticle">
                            Duplikat
                        </BaseButton>
                        <BaseButton variant="white" block icon="ph:share-network" @click="shareArticle">
                            Bagikan
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '~/composables/useToast'

definePageMeta({
    title: 'Detail Berita',
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Dummy article data
const article = ref({
    id: route.params.id,
    title: 'Kejuaraan Nasional Panahan 2024 Resmi Dibuka',
    excerpt: 'Kejuaraan nasional panahan tahun 2024 resmi dibuka dengan diikuti oleh lebih dari 500 atlet dari seluruh Indonesia.',
    content: `
    <p>Kejuaraan Nasional Panahan 2024 telah resmi dibuka pada hari Senin, 20 Januari 2024 di Gelora Bung Karno, Jakarta. Acara ini dihadiri oleh Menteri Pemuda dan Olahraga serta berbagai pejabat dari Perpani.</p>
    
    <h2>Partisipasi yang Luar Biasa</h2>
    <p>Tahun ini, kejuaraan diikuti oleh lebih dari 500 atlet dari 34 provinsi di Indonesia. Ini merupakan jumlah peserta terbanyak dalam sejarah Kejuaraan Nasional Panahan.</p>
    
    <p>"Kami sangat bangga melihat antusiasme yang luar biasa dari para pemanah di seluruh Indonesia. Ini menunjukkan bahwa olahraga panahan semakin berkembang di tanah air," ujar Ketua Umum Perpani.</p>
    
    <h2>Kategori Pertandingan</h2>
    <p>Pertandingan akan berlangsung dalam berbagai kategori, termasuk:</p>
    <ul>
      <li>Recurve - Senior Putra dan Putri</li>
      <li>Compound - Senior Putra dan Putri</li>
      <li>Barebow - Senior dan Junior</li>
      <li>Kategori Beregu</li>
    </ul>
    
    <p>Kejuaraan akan berlangsung selama 5 hari, dari tanggal 20-25 Januari 2024.</p>
  `,
    category: 'Event',
    status: 'published',
    date: '20 Jan 2024',
    author: 'Admin',
    readTime: 5,
    views: 1234,
    shares: 45,
    tags: ['Kejuaraan Nasional', 'Panahan', '2024', 'Jakarta'],
    image: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=1200',
    createdAt: '20 Jan 2024, 10:30',
    updatedAt: '21 Jan 2024, 14:15'
})

const publishArticle = () => {
    article.value.status = 'published'
    toast.success('Berita berhasil dipublikasikan!')
}

const unpublishArticle = () => {
    article.value.status = 'draft'
    toast.info('Berita ditarik ke draft')
}

const duplicateArticle = () => {
    toast.info('Fitur duplikat akan segera tersedia')
}

const shareArticle = () => {
    toast.info('Fitur bagikan akan segera tersedia')
}

const deleteArticle = () => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
        toast.success('Berita berhasil dihapus')
        router.push('/dashboard/news')
    }
}
</script>

<style scoped>
.prose h2 {
    @apply text-xl font-bold text-navy mt-8 mb-4;
}

.prose p {
    @apply mb-4;
}

.prose ul {
    @apply list-disc pl-6 mb-4 space-y-2;
}
</style>
