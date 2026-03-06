<template>
    <div class="bg-navy-dark min-h-screen flex flex-col">
        <!-- Hero Skeleton -->
        <section class="relative min-h-[32rem] w-full bg-navy pt-28 sm:pt-36 pb-12 flex items-end">
            <div
                class="relative w-full p-8 sm:p-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-end justify-between gap-8 z-10">
                <div class="space-y-4 w-full sm:w-auto">
                    <!-- Badge -->
                    <div class="h-5 bg-white/10 rounded-full w-32 mb-4"></div>

                    <div class="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                        <!-- Avatar -->
                        <div
                            class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 sm:border-[6px] border-white/10 bg-white/10 shrink-0">
                        </div>
                        <!-- Name -->
                        <div class="h-10 sm:h-12 bg-white/20 rounded-2xl w-64 md:w-96"></div>
                    </div>

                    <!-- Details -->
                    <div class="flex items-center gap-6 pt-4">
                        <div class="h-4 bg-white/10 rounded-lg w-24"></div>
                        <div class="h-4 bg-white/10 rounded-lg w-24"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Content Skeleton -->
        <div class="bg-white rounded-t-[3rem] -mt-12 relative z-20">
            <main class="max-w-7xl mx-auto px-6 md:px-12 py-24">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <!-- Left Column -->
                    <div class="lg:col-span-8 space-y-16">
                        <div v-for="i in 3" :key="i" class="space-y-6">
                            <div class="h-4 bg-gray-100 rounded w-48 mb-8"></div>
                            <div class="space-y-4">
                                <div v-for="j in 4" :key="j" class="h-4 bg-gray-50 rounded w-full"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="lg:col-span-4 space-y-12">
                        <div v-for="i in 3" :key="i" class="space-y-6">
                            <div class="h-4 bg-gray-100 rounded w-48 mb-6"></div>
                            <div class="h-32 bg-gray-50 rounded-3xl w-full"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
