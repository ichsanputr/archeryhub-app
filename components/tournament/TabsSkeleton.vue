<template>
    <div class="animate-pulse space-y-10">
        <!-- Ringkasan Skeleton -->
        <div v-if="tab === 'Ringkasan'" class="space-y-8">
            <div class="bg-gray-100 rounded-2xl h-48 w-full"></div>
            <div class="bg-gray-100 rounded-2xl h-64 w-full"></div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="i in 3" :key="i" class="bg-gray-100 rounded-2xl h-40 w-full"></div>
            </div>
        </div>

        <!-- Jadwal Skeleton -->
        <div v-else-if="tab === 'Jadwal Lomba'" class="space-y-6">
            <div class="flex gap-3 overflow-hidden">
                <div v-for="i in 4" :key="i" class="bg-gray-100 rounded-xl h-10 w-24 shrink-0"></div>
            </div>
            <div class="bg-white rounded-2xl p-6 border border-gray-100 space-y-8">
                <div v-for="i in 3" :key="i" class="flex gap-6">
                    <div class="w-8 h-8 rounded-full bg-gray-100 shrink-0"></div>
                    <div class="flex-grow space-y-3">
                        <div class="h-4 bg-gray-100 rounded w-1/4"></div>
                        <div class="h-6 bg-gray-100 rounded w-3/4"></div>
                        <div class="h-10 bg-gray-50 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Peserta Skeleton -->
        <div v-else-if="tab === 'Peserta'" class="space-y-6">
            <div class="bg-gray-100 rounded-2xl h-16 w-full"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                <div v-for="i in 6" :key="i"
                    class="bg-white rounded-2xl p-5 pt-10 border border-gray-100 relative mt-6 h-48">
                    <div
                        class="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gray-100 border-4 border-white">
                    </div>
                    <div class="space-y-3 mt-4">
                        <div class="h-4 bg-gray-100 rounded w-2/3 mx-auto"></div>
                        <div class="h-3 bg-gray-50 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hasil Skeleton -->
        <div v-else-if="tab === 'Hasil'" class="space-y-10">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="i in 3" :key="i"
                    class="bg-white rounded-3xl border border-gray-100 h-64 flex flex-col p-5 space-y-4">
                    <div class="bg-gray-50 rounded-2xl aspect-[4/3] w-full"></div>
                    <div class="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div class="flex gap-3">
                        <div class="flex-1 h-10 bg-gray-50 rounded-xl"></div>
                        <div class="flex-1 h-10 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lokasi Skeleton -->
        <div v-else-if="tab === 'Lokasi'" class="space-y-8">
            <div class="bg-gray-100 rounded-2xl h-[400px] w-full"></div>
            <div class="bg-white rounded-2xl p-8 border border-gray-100 space-y-4">
                <div class="h-8 bg-gray-100 rounded w-1/3"></div>
                <div class="h-4 bg-gray-50 rounded w-2/3"></div>
            </div>
        </div>

        <!-- Galeri Skeleton -->
        <div v-else-if="tab === 'Galeri'" class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="i in 2" :key="i" class="bg-gray-100 rounded-2xl aspect-video w-full"></div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="i in 8" :key="i" class="bg-gray-100 rounded-2xl aspect-square w-full"></div>
            </div>
        </div>

        <!-- FAQ Skeleton -->
        <div v-else-if="tab === 'FAQ'" class="space-y-4">
            <div class="h-10 bg-gray-100 rounded w-1/4 mb-8"></div>
            <div v-for="i in 5" :key="i" class="bg-white rounded-3xl h-20 border border-gray-100"></div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    tab: {
        type: String,
        required: true
    }
})
</script>
