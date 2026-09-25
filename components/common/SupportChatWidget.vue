<template>
  <div ref="widgetWrapper" class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-4">
    <Transition name="chat-window">
      <div v-if="isOpen"
        class="w-[380px] max-w-[calc(100vw-24px)] h-[600px] max-h-[calc(100vh-110px)] bg-white rounded-xl flex flex-col overflow-hidden border border-gray-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] max-sm:fixed max-sm:inset-0 max-sm:w-screen max-sm:h-[100dvh] max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none max-sm:border-0">
        <header class="bg-navy px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="size-10 bg-white/15 rounded-full flex items-center justify-center text-white border border-white/20">
              <Icon icon="ph:headset-bold" class="text-xl" />
            </div>
            <div>
              <h2 class="text-white text-sm font-bold leading-none">Customer Service</h2>
              <div class="flex items-center gap-1.5 mt-1">
                <span class="size-2 bg-primary rounded-full animate-pulse"></span>
                <span class="text-white/60 text-xs font-medium tracking-wider">{{ isEn ? 'Online Now' : 'Sedang Online' }}</span>
              </div>
            </div>
          </div>
          <button class="text-white/70 hover:text-white transition-colors" @click="isOpen = false">
            <Icon icon="ph:x" class="text-xl" />
          </button>
        </header>

        <div ref="chatContainer" class="flex-1 overflow-y-auto p-5 space-y-4 bg-[#efeae2]/70 relative" style="background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); background-repeat: repeat;">
          <TransitionGroup name="chat-message" tag="div" class="space-y-4">
            <div v-for="(message, index) in messages" :key="`msg-${index}-${message.time}`"
              :class="message.role === 'bot' ? 'flex items-end gap-2.5' : 'flex items-end justify-end gap-2.5'">
              <template v-if="message.role === 'bot'">
                <div class="size-8 rounded-full bg-navy flex items-center justify-center text-primary shrink-0">
                  <Icon icon="ph:robot-bold" class="text-lg" />
                </div>
                <div class="flex flex-col gap-1 max-w-[80%]">
                  <div
                    class="bg-navy text-white px-4 py-3 rounded-2xl rounded-bl-none text-sm leading-relaxed shadow-sm">
                    {{ message.text }}</div>
                  <span class="text-[10px] text-slate-400 ml-1">{{ message.time }}</span>
                </div>
              </template>

              <template v-else>
                <div class="flex flex-col gap-1 items-end max-w-[80%]">
                  <div
                    class="bg-gray-100 text-navy px-4 py-3 rounded-2xl rounded-br-none text-sm leading-relaxed shadow-sm border border-slate-200">
                    {{ message.text }}</div>
                  <span class="text-[10px] text-slate-400 mr-1">{{ message.time }}</span>
                </div>
                <div
                  class="size-8 rounded-full bg-primary/20 flex items-center justify-center text-navy shrink-0 border border-primary/30">
                  <Icon icon="ph:user" class="text-lg" />
                </div>
              </template>
            </div>
          </TransitionGroup>

          <div v-if="isLoading" class="flex items-end gap-2.5">
            <div class="size-8 rounded-full bg-navy flex items-center justify-center text-primary shrink-0">
              <Icon icon="ph:robot-bold" class="text-lg" />
            </div>
            <div class="bg-navy text-white px-4 py-3 rounded-2xl rounded-bl-none text-sm leading-relaxed shadow-sm">
              <div class="typing-loader" :aria-label="isEn ? 'Bot is typing' : 'Bot sedang mengetik'">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-slate-100 bg-white">
          <form class="relative flex items-center" @submit.prevent="sendMessage()">
            <input v-model="inputMessage"
              class="w-full bg-slate-100 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 text-navy placeholder-slate-500"
              :placeholder="isEn ? 'Ask a question...' : 'Tulis pesan kamu...'" type="text" />
            <button type="submit"
              class="absolute right-2 p-1.5 bg-primary text-navy rounded-lg hover:brightness-95 transition-all flex items-center justify-center shadow-sm cursor-pointer"
              :disabled="!inputMessage.trim() || isLoading">
              <Icon icon="ph:paper-plane-tilt-fill" class="text-lg" />
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <button
      class="size-10 md:size-12 bg-primary text-navy rounded-full flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer"
      :class="isOpen ? 'max-sm:hidden' : ''" @click="isOpen = !isOpen" aria-label="Toggle support chat">
      <Icon :icon="isOpen ? 'ph:x-bold' : 'ph:chat-circle-dots-fill'" class="text-xl md:text-2xl" />
      <span v-if="!isOpen && unreadCount > 0"
        class="absolute -top-1 -right-1 size-5 bg-red-500 border-2 border-background-light rounded-full text-[10px] text-white flex items-center justify-center font-bold">
        {{ unreadCount }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { nextTick, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const isEn = computed(() => locale.value === 'en')

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const widgetWrapper = ref(null)
const isOpen = ref(false)
const isLoading = ref(false)
const inputMessage = ref('')
const chatContainer = ref(null)
const unreadCount = ref(1)

const handleOutsideClick = (event) => {
  if (isOpen.value && widgetWrapper.value && !widgetWrapper.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick)
})

const nowTime = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })

const defaultGreeting = () => {
  return isEn.value
    ? 'Hello! I am the Archeris Customer Support assistant. How can I help you today?'
    : 'Halo! Saya Customer Service Archeris. Ada yang bisa saya bantu hari ini?'
}

const messages = ref([
  {
    role: 'bot',
    text: defaultGreeting(),
    time: nowTime(),
  },
])

watch(isEn, () => {
  if (messages.value.length === 1 && messages.value[0].role === 'bot') {
    messages.value[0].text = defaultGreeting()
  }
})

const scrollToBottom = async () => {
  await nextTick()
  if (!chatContainer.value) return
  chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}

const sendMessage = async (prefilled) => {
  const text = (prefilled ?? inputMessage.value).trim()
  if (!text || isLoading.value) return

  messages.value.push({ role: 'user', text, time: nowTime() })
  inputMessage.value = ''
  isLoading.value = true
  await scrollToBottom()

  try {
    await new Promise((resolve) => setTimeout(resolve, 400))
    const currentLang = locale.value || 'id'
    const res = await $fetch(`${apiBaseUrl}/chatbot/message?lang=${currentLang}`, {
      method: 'POST',
      body: { message: text, lang: currentLang },
    })

    const fallbackReply = isEn.value
      ? "I'm sorry, I couldn't understand that question. Could you please rephrase or ask about tournaments, scoring, rules, or packages?"
      : "Maaf, saya belum bisa memproses pertanyaan itu. Silakan coba tanyakan seputar turnamen, scoring, aturan, atau paket langganan."

    messages.value.push({
      role: 'bot',
      text: res?.answer || fallbackReply,
      time: nowTime(),
    })
  } catch (error) {
    const errorReply = isEn.value
      ? 'The chatbot service is temporarily unavailable. Please try again in a moment.'
      : 'Saat ini server chatbot sedang sibuk. Silakan coba beberapa saat lagi ya.'

    messages.value.push({
      role: 'bot',
      text: errorReply,
      time: nowTime(),
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

watch(isOpen, (open) => {
  if (open) unreadCount.value = 0
})
</script>

<style scoped>
.chat-window-enter-active,
.chat-window-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.chat-message-enter-active,
.chat-message-leave-active {
  transition: all 0.22s ease;
}

.chat-message-enter-from,
.chat-message-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.typing-loader {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 28px;
  min-height: 10px;
}

.typing-loader span {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.85);
  animation: dot-bounce 1s infinite ease-in-out;
}

.typing-loader span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-loader span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes dot-bounce {

  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  40% {
    transform: translateY(-3px);
    opacity: 1;
  }
}
</style>
