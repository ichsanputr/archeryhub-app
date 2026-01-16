<template>
    <div class="h-screen flex bg-[#EBEBF4]">
        <!-- Mobile overlay -->
        <div v-if="isSidebarOpen" @click="isSidebarOpen = false"
            class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"></div>

        <!-- Left Panel - Code Examples List -->
        <div :class="[
            'w-3/4 bg-white border-r border-gray-200 h-screen flex flex-col flex-shrink-0',
            'fixed inset-y-0 right-0 z-50 transform translate-x-full transition-transform duration-300 ease-in-out w-4/5',
            'lg:static lg:translate-x-0 lg:right-auto lg:left-0 lg:w-64',
            { '!translate-x-0': isSidebarOpen }
        ]">
            <!-- Logo and Title -->
            <div class="p-4 border-b border-gray-200 bg-[#2A3042]">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <a href="/" class="flex items-center group">
                            <img src="/logo-light.png" alt="BudiBadu Logo"
                                class="h-8 w-auto group-hover:scale-105 transition-transform duration-300" />
                        </a>
                        <div>
                            <div class="text-lg font-semibold text-white">Samplebadu</div>
                            <div class="text-sm text-gray-200">Code with Example</div>
                        </div>
                    </div>
                    <!-- Close button for mobile -->
                    <button @click="isSidebarOpen = false"
                        class="lg:hidden p-1 rounded-md text-gray-200 hover:text-white">
                        <Icon icon="ph:x" class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Search -->
            <div class="p-4 border-b border-gray-200">
                <div class="relative">
                    <input v-model="searchQuery" type="text" placeholder="Search examples..."
                        class="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <Icon icon="ph:magnifying-glass" class="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                </div>
            </div>

            <!-- Navigation -->
            <nav class="p-4 flex-1 overflow-y-auto">
                <div class="space-y-2">
                    <!-- Home Link -->
                    <a href="/samplebadu" @click="isSidebarOpen = false"
                        class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors"
                        :class="route.path === '/samplebadu' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'">
                        <Icon icon="mi:home" class="w-5 h-5 flex-shrink-0" />
                        Home
                    </a>

                    <!-- Categories (Languages) -->
                    <template v-for="category in filteredCategories" :key="category.id">
                        <div>
                            <!-- Category Header (Expandable) -->
                            <!-- Category Header (Expandable) -->
                            <div
                                class="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 rounded-md transition-colors group">
                                <a :href="`/samplebadu/${category.id}`" @click="isSidebarOpen = false"
                                    class="flex items-center gap-2 flex-1">
                                    <img :src="category.icon" :alt="category.title" class="w-5 h-5 flex-shrink-0" />
                                    {{ category.title }}
                                </a>
                                <button @click.stop="toggleCategory(category.id)"
                                    class="p-1 hover:bg-gray-200 rounded text-gray-500">
                                    <Icon
                                        :icon="expandedCategories.includes(category.id) ? 'ph:caret-down' : 'ph:caret-right'"
                                        class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Items (when expanded) -->
                            <div v-if="expandedCategories.includes(category.id)" class="ml-7 mt-1 space-y-0.5">
                                <a v-for="item in category.items" :key="item.slug" :href="`/samplebadu/${item.slug}`"
                                    @click="isSidebarOpen = false"
                                    class="block px-3 !pl-3 py-1.5 text-sm rounded-md transition-colors"
                                    :class="route.path === `/samplebadu/${item.slug}` ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-gray-100'">
                                    {{ item.title }}
                                </a>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- No results message -->
                <div v-if="filteredCategories.length === 0 && searchQuery"
                    class="mt-4 text-center text-gray-500 text-sm">
                    No examples found matching "{{ searchQuery }}"
                </div>
            </nav>
        </div>

        <!-- Right Panel - Main Content -->
        <div class="flex-1 bg-[#F7F7FA] h-screen overflow-y-auto">
            <!-- Mobile Header -->
            <header
                class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-30">
                <div class="flex items-center gap-2">
                    <a href="/" class="flex items-center group">
                        <img src="/logo.png" alt="BudiBadu Logo"
                            class="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
                    </a>
                    <div>
                        <div class="text-xl font-bold text-gray-900">Samplebadu</div>
                    </div>
                </div>
                <button @click="isSidebarOpen = true"
                    class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                    <Icon icon="ph:list" class="w-5 h-5" />
                </button>
            </header>

            <div class="flex max-w-full">
                <!-- Main Content Column -->
                <div class="flex-1 min-w-0">
                    <main class="sm:p-6">
                        <slot />

                        <!-- AdSense below content -->
                        <div class="my-8 flex justify-center">
                            <ClientOnly>
                                <Adsense key="samplebadu-content-ad" client="ca-pub-1356911639243870"
                                    ad-slot="4242301831" format="auto" responsive="true"
                                    :style="{ display: 'block', width: '100%', minHeight: '100px' }" />
                            </ClientOnly>
                        </div>

                        <!-- Footer -->
                        <footer class="mt-12 pt-6 sm:pb-0 pb-6 border-t border-gray-200">
                            <div class="text-center">
                                <h3 class="text-lg font-semibold text-gray-900 mb-4">BudiBadu Ecosystem</h3>
                                <div class="flex flex-wrap px-4 justify-center gap-6 text-base text-gray-600">

                                    <a href="/" class="hover:text-blue-600 transition-colors">Budibadu</a>
                                </div>
                                <div class="mt-4 text-sm text-gray-500">
                                    © 2025 BudiBadu. All rights reserved.
                                </div>
                            </div>
                        </footer>
                    </main>
                </div>

                <!-- AdSense Column - Desktop Only -->
                <div class="hidden xl:block w-80 flex-shrink-0 bg-white border-l border-gray-200">
                    <div class="sticky top-4 p-4">
                        <Adsense key="samplebadu-sidebar-ad" client="ca-pub-1356911639243870" ad-slot="1250318747"
                            kind="square" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Adsense from '~/components/Adsense.vue'
import sampleCategories from '~/data/sample/index.js'

defineOptions({
    name: 'SampleLayout'
})

const searchQuery = ref('')
const isSidebarOpen = ref(false)
const expandedCategories = ref([])
const route = useRoute()

// Auto-expand categories based on current route
watch(() => route.path, (newPath) => {
    if (newPath.startsWith('/samplebadu/')) {
        const pathParts = newPath.replace('/samplebadu/', '').split('/')
        if (pathParts.length >= 1) {
            const categoryId = pathParts[0]
            if (!expandedCategories.value.includes(categoryId)) {
                expandedCategories.value.push(categoryId)
            }
        }
    }
}, { immediate: true })

const toggleCategory = (categoryId) => {
    const index = expandedCategories.value.indexOf(categoryId)
    if (index > -1) {
        expandedCategories.value.splice(index, 1)
    } else {
        expandedCategories.value.push(categoryId)
    }
}

// Filter categories based on search
const filteredCategories = computed(() => {
    const rawQuery = searchQuery.value;

    if (!rawQuery.trim()) {
        return sampleCategories;
    }

    const query = rawQuery.toLowerCase();

    return sampleCategories.map(category => {
        const filteredItems = category.items.filter(item => {
            // DEBUG: Check for missing title or description
            if (!item.title || typeof item.title !== "string") {
                console.warn("⚠️ Missing or invalid title:", item);
                return false;
            }
            if (!item.description || typeof item.description !== "string") {
                console.warn("⚠️ Missing or invalid description:", item);
                return false;
            }

            const titleMatch = item.title.toLowerCase().includes(query);
            const descMatch = item.description.toLowerCase().includes(query);

            return titleMatch || descMatch;
        });

        if (filteredItems.length > 0) {
            if (!expandedCategories.value.includes(category.id)) {
                expandedCategories.value.push(category.id);
            }
            return { ...category, items: filteredItems };
        }

        return null;
    }).filter(Boolean);
});

</script>
