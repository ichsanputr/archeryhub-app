<template>
    <div class="animate-pulse">
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" 
                class="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full shadow-sm">
                <!-- Image area -->
                <div class="relative h-52 bg-gray-100">
                    <div class="absolute top-4 left-4 h-6 bg-gray-200 rounded-lg w-16"></div>
                </div>
                
                <!-- Content area -->
                <div class="p-6 flex-1 flex flex-col space-y-4">
                    <!-- Title -->
                    <div class="space-y-2">
                        <div class="h-5 bg-gray-100 rounded-md w-full"></div>
                        <div class="h-5 bg-gray-100 rounded-md w-2/3"></div>
                    </div>

                    <!-- Details -->
                    <div class="space-y-3 mb-4">
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-lg bg-gray-50 shrink-0"></div>
                            <div class="h-3 bg-gray-100 rounded w-1/3"></div>
                        </div>
                        <div class="flex items-center gap-3">
                            <div class="h-8 w-8 rounded-lg bg-gray-50 shrink-0"></div>
                            <div class="h-3 bg-gray-100 rounded w-1/2"></div>
                        </div>
                    </div>

                    <!-- Button -->
                    <div class="mt-auto pt-4">
                        <div class="h-12 bg-gray-50 rounded-xl w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
