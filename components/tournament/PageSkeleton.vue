<template>
    <div class="bg-background-light min-h-screen">
        <!-- Hero Skeleton -->
        <div class="bg-navy h-[400px] flex items-center">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-16">
                <!-- Breadcrumb Skeleton -->
                <div class="h-4 bg-white/10 rounded-lg w-32 mb-8"></div>

                <div class="space-y-6">
                    <!-- Title Skeleton -->
                    <div class="h-12 bg-white/20 rounded-2xl w-3/4 md:w-1/2"></div>

                    <!-- Metadata Skeleton -->
                    <div class="flex gap-4">
                        <div class="h-6 bg-white/10 rounded-full w-40"></div>
                        <div class="h-6 bg-white/10 rounded-full w-40"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabs Skeleton -->
        <div class="sticky top-0 bg-white border-b border-gray-100 shadow-sm py-4">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
                <div v-for="i in 5" :key="i" class="h-5 bg-gray-100 rounded-lg w-20"></div>
            </div>
        </div>

        <!-- Content Skeleton -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Content column -->
                <div class="lg:col-span-2 space-y-10">
                    <div class="bg-white rounded-3xl p-8 border border-gray-100 space-y-6">
                        <div class="h-8 bg-gray-100 rounded-xl w-48"></div>
                        <div class="space-y-3">
                            <div v-for="i in 4" :key="i" class="h-4 bg-gray-50 rounded-lg w-full"></div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar column -->
                <div class="space-y-8">
                    <div class="bg-white rounded-3xl p-8 border border-gray-100 space-y-6 text-center">
                        <div class="h-6 bg-gray-100 rounded-lg w-40 mx-auto"></div>
                        <div class="h-20 bg-gray-50 rounded-2xl w-full"></div>
                        <div class="h-12 bg-primary/20 rounded-xl w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
