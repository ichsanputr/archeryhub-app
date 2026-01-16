<template>
  <Teleport to="body">
    <!-- Overlay - shown immediately without transition -->
    <div v-if="show" class="fixed inset-0 z-40 bg-black/40" @click="handleClose"></div>

    <!-- Drawer Panel with transition -->
    <transition name="drawer-slide">
      <div v-if="show" class="fixed inset-0 z-50 flex pointer-events-none">
        <!-- Drawer Panel -->
        <div ref="drawerPanel" :class="[
          'relative w-full max-w-xs sm:max-w-sm h-full shadow-2xl border-r pointer-events-auto',
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800 text-white'
            : 'bg-white border-gray-200 text-gray-900'
        ]">
          <div class="flex items-center justify-between px-4 py-4 border-b"
            :class="theme === 'dark' ? 'border-gray-800' : 'border-gray-200'">
            <div class="text-lg font-semibold truncate">Problems List</div>
            <button @click="handleClose" class="p-2 rounded-lg border transition-colors" :class="theme === 'dark'
              ? 'border-gray-700 hover:bg-gray-800 text-gray-300'
              : 'border-gray-200 hover:bg-gray-50 text-gray-600'" aria-label="Close problems list drawer">
              <Icon :ssr="true" icon="ph:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Category Chips -->
          <div class="px-4 py-3 border-b overflow-x-auto hidden-scrollbar"
            :class="theme === 'dark' ? 'border-gray-800' : 'border-gray-200'">
            <div class="flex items-center gap-2 min-w-max">
              <!-- Current Problem Category (always shown first) -->
              <button v-if="currentProblemCategory"
                @click="$emit('update:selectedCategory', currentProblemCategory.slug)"
                class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border" :class="selectedCategory === currentProblemCategory.slug
                  ? theme === 'dark'
                    ? 'bg-blue-900 text-blue-200 border-blue-700'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                  : theme === 'dark'
                    ? 'bg-yellow-900 text-yellow-200 border-yellow-700 hover:bg-yellow-800'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'">
                {{ currentProblemCategory.name }}
              </button>

              <button v-for="category in filteredCategories" :key="category.slug"
                @click="$emit('update:selectedCategory', category.slug)"
                class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border" :class="selectedCategory === category.slug
                  ? theme === 'dark'
                    ? 'bg-blue-900 text-blue-200 border-blue-700'
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-750'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'">
                {{ category.name }}
              </button>
            </div>
          </div>

          <!-- Problems List -->
          <div class="h-[calc(100%-120px)] overflow-y-auto px-4 py-4 custom-scrollbar">
            <!-- Loading State - Vertically Centered -->
            <div v-if="isLoadingProblems" class="flex items-center justify-center h-full">
              <div class="text-center" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">
                <Icon :ssr="true" icon="ph:spinner" class="w-10 h-10 mx-auto mb-4 opacity-60 animate-spin" />
                <p>Loading problems...</p>
              </div>
            </div>

            <!-- Empty State - Vertically Centered -->
            <div v-else-if="!allProblems?.length" class="flex items-center justify-center h-full">
              <div class="text-center" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">
                <Icon :ssr="true" icon="ph:list-bullets" class="w-10 h-10 mx-auto mb-4 opacity-60" />
                <p>No problems found.</p>
              </div>
            </div>

            <!-- Problems List with Staggered Animation -->
            <div v-else class="space-y-3">
              <a v-for="(problem, index) in allProblems" :key="problem.slug" :href="`/problem/${problem.slug}`"
                class="problem-item block rounded-xl border p-4 transition-all"
                :style="{ animationDelay: `${index * 50}ms` }" :class="theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 hover:border-yellow-500 hover:bg-gray-750'
                  : 'bg-gray-50 border-gray-200 hover:border-yellow-500 hover:bg-white'" @click="handleClose">
                <div class="flex items-start justify-between gap-3">
                  <div class="space-y-1 min-w-0 flex-1">
                    <div class="text-xs font-semibold leading-snug line-clamp-2">{{ problem.problem_name ||
                      problem.title }}</div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <div class="text-xs" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'">
                        {{ problem.category_name || 'General' }}
                      </div>
                      <span v-if="problem.difficulty" :class="[
                        'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                        problem.difficulty?.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                      ]">
                        {{ problem.difficulty }}
                      </span>
                    </div>
                  </div>
                  <Icon :ssr="true" icon="ph:arrow-right" :class="theme === 'dark' ? 'text-gray-400' : 'text-gray-500'"
                    class="w-4 h-4 flex-shrink-0 mt-1" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  show: Boolean,
  theme: String,
  allProblems: Array,
  isLoadingProblems: Boolean,
  categories: Array,
  selectedCategory: String,
  currentProblem: Object
})

const emit = defineEmits(['close', 'update:selectedCategory'])

// Current problem category
const currentProblemCategory = computed(() => {
  const result = !props.currentProblem?.category_slug || !props.categories
    ? null
    : props.categories.find(cat => cat.slug === props.currentProblem.category_slug)
  console.log('🏷️ currentProblemCategory:', {
    slug: props.currentProblem?.category_slug,
    hasCategories: !!props.categories,
    categoriesLength: props.categories?.length || 0,
    result
  })
  return result
})

// Filtered categories - always exclude current problem category to avoid duplicates
// (it's always shown as the first chip after "All")
const filteredCategories = computed(() => {
  console.log('🔍 filteredCategories computing:', {
    hasCategories: !!props.categories,
    categoriesLength: props.categories?.length || 0,
    hasCurrent: !!currentProblemCategory.value
  })

  if (!props.categories || !currentProblemCategory.value) {
    console.log('  ➡️ Returning all categories:', props.categories?.length || 0)
    return props.categories || []
  }

  const filtered = props.categories.filter(cat => cat.slug !== currentProblemCategory.value.slug)
  console.log('  ➡️ Returning filtered (excluding current):', filtered.length)
  return filtered
})

const handleClose = () => emit('close')
</script>

<style scoped>
/* Slide Transition */
.drawer-slide-enter-active {
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.2s ease;
}

.drawer-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 1, 1), opacity 0.2s ease;
}

.drawer-slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.drawer-slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.drawer-slide-enter-to,
.drawer-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Hidden scrollbar for category chips */
.hidden-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Problem Item Animation */
.problem-item {
  animation: fadeInUp 0.4s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
