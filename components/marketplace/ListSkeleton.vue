<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div v-for="i in 10" :key="i"
            class="bg-white rounded-3xl border border-gray-100 flex flex-col overflow-hidden h-full">

            <!-- Image Area -->
            <div class="relative pt-[100%] bg-gray-100"></div>

            <!-- Content Area -->
            <div class="p-6 flex flex-col flex-1">
                <!-- Badge & Status -->
                <div class="flex justify-between items-center mb-4">
                    <div class="h-4 bg-gray-100 rounded-md w-16"></div>
                    <div class="h-4 bg-gray-50 rounded-md w-12"></div>
                </div>

                <!-- Title lines -->
                <div class="h-5 bg-gray-100 rounded-lg w-full mb-2"></div>
                <div class="h-5 bg-gray-100 rounded-lg w-4/5 mb-6"></div>

                <!-- Price Footer -->
                <div class="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div class="h-6 bg-gray-100 rounded-lg w-24"></div>
                    <div class="w-8 h-8 rounded-lg bg-gray-50"></div>
                </div>
            </div>
        </div>
    </div>
</template>
