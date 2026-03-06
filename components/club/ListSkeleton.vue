<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i"
            class="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col relative">

            <!-- Banner Skeleton -->
            <div class="h-24 w-full bg-gray-100"></div>

            <!-- Logo Skeleton -->
            <div class="flex justify-center -mt-12 mb-4 px-5">
                <div class="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-sm overflow-hidden">
                    <div class="w-full h-full bg-gray-100"></div>
                </div>
            </div>

            <!-- Info Skeleton -->
            <div class="px-6 pb-6 flex-1 flex flex-col items-center">
                <!-- Title -->
                <div class="h-6 bg-gray-100 rounded-lg w-3/4 mb-3"></div>

                <!-- Location -->
                <div class="h-4 bg-gray-50 rounded-lg w-1/2 mb-6"></div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 gap-3 w-full mb-6">
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-50 h-16"></div>
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-50 h-16"></div>
                </div>

                <!-- Footer -->
                <div class="mt-auto w-full pt-5 border-t border-gray-50 flex items-center justify-between">
                    <div class="flex -space-x-2">
                        <div v-for="j in 3" :key="j" class="w-7 h-7 rounded-full bg-gray-100 border-2 border-white">
                        </div>
                    </div>
                    <div class="w-10 h-10 rounded-xl bg-gray-50"></div>
                </div>
            </div>
        </div>
    </div>
</template>
