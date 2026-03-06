<template>
    <div class="bg-background-light min-h-screen flex flex-col">
        <!-- Hero Skeleton -->
        <section class="relative min-h-[32rem] w-full bg-navy pt-28 sm:pt-36 pb-12 flex items-end">
            <div
                class="relative w-full p-8 sm:p-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-end justify-between gap-8 z-10">
                <div class="space-y-4 w-full sm:w-auto">
                    <!-- Badge -->
                    <div class="h-5 bg-white/10 rounded-full w-32 mb-4"></div>

                    <div class="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                        <!-- Logo -->
                        <div
                            class="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 sm:border-[6px] border-white/10 bg-white/10 shrink-0">
                        </div>
                        <!-- Title -->
                        <div class="h-10 sm:h-12 bg-white/20 rounded-2xl w-64 md:w-96"></div>
                    </div>

                    <!-- Details -->
                    <div class="flex items-center gap-6 pt-4">
                        <div class="h-4 bg-white/10 rounded-lg w-24"></div>
                        <div class="h-4 bg-white/10 rounded-lg w-24"></div>
                        <div class="h-4 bg-white/10 rounded-lg w-24"></div>
                    </div>
                </div>

                <!-- Action Button -->
                <div class="h-14 bg-white/20 rounded-xl w-32 hidden sm:block"></div>
            </div>
        </section>

        <!-- Content Skeleton -->
        <div class="bg-white rounded-t-[3rem] -mt-12 relative z-20">
            <main class="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-24">
                <!-- About Description -->
                <div class="space-y-8">
                    <div class="h-4 bg-gray-100 rounded w-48 mb-8"></div>
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div class="md:col-span-8 space-y-4">
                            <div v-for="i in 5" :key="i" class="h-4 bg-gray-50 rounded w-full"></div>
                        </div>
                        <div class="md:col-span-4 space-y-6">
                            <div v-for="i in 2" :key="i" class="h-24 bg-gray-50 rounded-2xl w-full"></div>
                        </div>
                    </div>
                </div>

                <!-- Grid Sections -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div v-for="i in 2" :key="i" class="space-y-8">
                        <div class="h-4 bg-gray-100 rounded w-48 mb-8"></div>
                        <div class="space-y-4">
                            <div v-for="j in 3" :key="j" class="h-12 bg-gray-50 rounded-2xl w-full"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
