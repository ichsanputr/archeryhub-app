<template>
  <div ref="pickerContainer" class="relative inline-block text-left" v-click-outside="closePicker">
    <button type="button" @click="togglePicker"
      class="p-2.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-xl transition-all flex items-center justify-center shrink-0"
      :title="t('chat.emoji_picker') || 'Emoji'">
      <Icon icon="ph:smiley-bold" class="text-xl text-amber-500" />
    </button>

    <!-- Popover Container -->
    <Transition name="fade-up">
      <div v-if="isOpen"
        class="absolute z-50 w-72 sm:w-80 bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col h-80"
        :class="[
          isFlippedTop ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top',
          isAlignedRight ? 'right-0' : 'left-0'
        ]">
        
        <!-- Search bar -->
        <div class="p-2.5 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
          <Icon icon="ph:magnifying-glass" class="text-gray-400 text-sm ml-1" />
          <input v-model="search" type="text" :placeholder="t('chat.search_emoji', 'Cari emoji...')"
            class="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-primary font-medium" />
        </div>

        <!-- Category Tabs -->
        <div v-if="!search" class="flex items-center justify-between px-2 py-1.5 border-b border-gray-100 bg-white overflow-x-auto no-scrollbar text-xs">
          <button v-for="cat in categories" :key="cat.name" @click="activeCat = cat.name"
            :class="activeCat === cat.name ? 'bg-amber-50 text-amber-600 font-bold' : 'text-gray-400 hover:text-navy'"
            class="px-2 py-1 rounded-lg text-sm transition-all shrink-0">
            {{ cat.icon }}
          </button>
        </div>

        <!-- Emoji Grid -->
        <div class="flex-grow overflow-y-auto p-2.5 no-scrollbar">
          <div v-if="filteredEmojis.length === 0" class="text-center py-8 text-xs text-gray-400 font-medium">
            {{ t('chat.no_emojis', 'Tidak ada emoji') }}
          </div>
          <div v-else class="grid grid-cols-7 sm:grid-cols-8 gap-1">
            <button v-for="e in filteredEmojis" :key="e" @click="selectEmoji(e)"
              class="size-8 rounded-lg hover:bg-amber-50 flex items-center justify-center text-lg transition-transform active:scale-125">
              {{ e }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import useDashboardI18n from '~/composables/useDashboardI18n'
import { useDropdownPosition } from '~/composables/useDropdownPosition'

const { t } = useDashboardI18n()
const emit = defineEmits(['select'])
const isOpen = ref(false)
const search = ref('')
const activeCat = ref('Smileys')
const pickerContainer = ref(null)

const { isFlippedTop, isAlignedRight } = useDropdownPosition(pickerContainer, isOpen, { panelHeight: 330, panelWidth: 320 })

const togglePicker = () => {
  isOpen.value = !isOpen.value
}

const closePicker = () => {
  isOpen.value = false
}

const selectEmoji = (emoji) => {
  emit('select', emoji)
}

const categories = [
  { name: 'Smileys', icon: '😀', emojis: ['😀','😃','😄','😁','😆','😅','😂','🤣','🥲','🥹','😊','😇','🙂','🙃','😉','😌','😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓','😎','🥸','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😮‍💨','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🫣','🤗','🫡','🤔','🫢','🤭','🤫','🤥','😶','😶‍🌫️','😐','😑','😬','🫠','🫥','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','😵‍💫','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️','👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','😿','😾'] },
  { name: 'Gestures', icon: '👋', emojis: ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦵','🦿','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','💋'] },
  { name: 'Hearts & Objects', icon: '❤️', emojis: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','🫀','🔥','✨','🌟','💫','💥','💢','💦','💧','💨','🎯','🏹','🏆','🥇','🥈','🥉','⚽','🏀','🏈','⚾','🎾','🏐','🏉','🥏','🎱','🏓','🏸','🏒','🥍','🏏','⛳','🥊','🥋','🎽','🛹','🛼','🎣'] },
  { name: 'Symbols & Flags', icon: '🎉', emojis: ['🎉','🎊','🥳','🎈','🎁','🎗️','🎟️','🎫','🎖️','🏆','🔔','📢','📣','💬','💭','🗯️','📢','💡','⚡','⭐','🔔','✅','❌','⭕','🛑','⛔','🚫','💯','⚠️','🔴','🟢','🔵','🟡','🇮🇩','🇺🇸','🇬🇧','🇯🇵','🇰🇷','🇩🇪','🇫🇷'] }
]

const filteredEmojis = computed(() => {
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    const all = categories.flatMap(c => c.emojis)
    return all.filter(e => e.includes(q) || true).slice(0, 56)
  }
  const found = categories.find(c => c.name === activeCat.value)
  return found ? found.emojis : categories[0].emojis
})

// Simple custom click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease-out;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
