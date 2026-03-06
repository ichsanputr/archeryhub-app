<template>
    <div>
        <div class="container mx-auto px-4 max-w-7xl py-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <!-- Image Column -->
                <div class="space-y-4">
                    <div class="aspect-square bg-gray-100 rounded-2xl"></div>
                    <div class="flex gap-3 overflow-x-auto">
                        <div v-for="i in 4" :key="i" class="w-20 h-20 rounded-xl bg-gray-50 shrink-0"></div>
                    </div>
                </div>

                <!-- Info Column -->
                <div class="space-y-8">
                    <div class="space-y-4">
                        <div class="h-10 bg-gray-100 rounded-xl w-3/4"></div>
                        <div class="h-4 bg-gray-50 rounded-lg w-1/4"></div>
                    </div>

                    <div class="h-24 bg-gray-50 rounded-2xl w-full"></div>

                    <div class="space-y-4">
                        <div class="h-12 bg-gray-100 rounded-xl w-1/2"></div>
                        <div class="h-14 bg-gray-100 rounded-xl w-full"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white border-t border-gray-100 py-12 mt-12">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="h-4 bg-gray-100 rounded w-48 mb-8"></div>
                <div class="space-y-4">
                    <div v-for="i in 6" :key="i" class="h-4 bg-gray-50 rounded w-full"></div>
                </div>
            </div>
        </div>
    </div>
</template>
