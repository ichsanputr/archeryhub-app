<template>
  <div class="h-[calc(100vh-5.5rem)] flex flex-col gap-0 overflow-hidden">

    <!-- Main Chat Shell -->
    <div class="flex-grow flex bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden min-h-0">

      <!-- ───────── LEFT: Conversation List ───────── -->
      <div class="flex flex-col shrink-0 border-r border-gray-200 bg-gray-50"
        :class="activeConv ? 'hidden md:flex md:w-80 lg:w-96' : 'w-full md:w-80 lg:w-96'">
        <!-- Top bar -->
        <div class="px-5 pt-5 pb-4 border-b border-gray-200 bg-white shrink-0">
          <div class="flex items-center gap-3 mb-4">
            <div class="size-10 rounded-2xl bg-navy flex items-center justify-center shrink-0">
              <Icon icon="ph:chat-circle-dots-bold" class="text-primary text-lg" />
            </div>
            <div>
              <h1 class="text-base font-black text-navy leading-none">{{ t('chat.title', 'Pesan & Chat') }}</h1>
              <div class=" text-xs text-gray-500 font-semibold mt-0.5">{{ t('chat.subtitle', 'Komunikasi dengan pelanggan toko Anda') }}</div>
            </div>
          </div>
          <div class="relative">
            <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input v-model="searchQuery" type="text" :placeholder="t('chat.search_placeholder', 'Cari pesan atau nama...')"
              class="w-full pl-9 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-white transition-all outline-none placeholder:text-gray-400" />
          </div>
        </div>

        <!-- Conversation items -->
        <div class="flex-grow overflow-y-auto no-scrollbar">
          <!-- Loading -->
          <div v-if="isLoadingList" class="divide-y divide-gray-100">
            <div v-for="i in 5" :key="i" class="px-4 py-3.5 flex items-center gap-3 animate-pulse">
              <div class="size-12 rounded-2xl bg-gray-200 shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 w-2/3 bg-gray-200 rounded-lg"></div>
                <div class="h-2.5 w-3/4 bg-gray-100 rounded-lg"></div>
              </div>
              <div class="h-2 w-8 bg-gray-100 rounded shrink-0"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredConvs.length === 0"
            class="flex flex-col items-center justify-center p-10 text-center h-full">
            <div
              class="size-20 rounded-3xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
              <Icon icon="ph:chat-centered-dots" class="text-4xl text-gray-300" />
            </div>
            <div class="text-sm font-black text-gray-500">{{ t('chat.empty_title', 'Belum Ada Percakapan') }}</div>
            <div class=" text-xs text-gray-400 font-medium mt-1">{{ t('chat.empty_desc', 'Pesan dari pembeli akan muncul di sini') }}</div>
          </div>

          <!-- Conversation List -->
          <div v-else class="divide-y divide-gray-100">
            <div v-for="conv in filteredConvs" :key="conv.id" @click="openConversation(conv)"
              class="px-4 py-3.5 flex items-center gap-3 cursor-pointer transition-all relative" :class="activeConv?.id === conv.id
                ? 'bg-primary/10 border-l-4 border-primary'
                : 'border-l-4 border-transparent hover:bg-white hover:shadow-sm'">

              <!-- Archer avatar -->
              <div class="relative size-12 shrink-0">
                <div class="size-full rounded-2xl bg-white overflow-hidden border-2"
                  :class="activeConv?.id === conv.id ? 'border-primary/30' : 'border-gray-200'">
                  <img :src="useImageOrDefault(conv.archer_avatar, conv.archer_name)" class="w-full h-full object-cover" />
                </div>
                <!-- Online indicator -->
                <div class="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-white"
                  :class="isOnline(conv.archer_last_seen) ? 'bg-green-400' : 'bg-gray-300'"></div>
                <!-- Unread badge -->
                <div v-if="conv.seller_unread > 0"
                  class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary border-2 border-white flex items-center justify-center px-1">
                  <span class="text-[9px] font-black text-navy">{{ conv.seller_unread > 9 ? '9+' : conv.seller_unread
                    }}</span>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-0.5">
                  <span class="text-sm font-black text-navy truncate">{{ conv.archer_name || 'Pembeli' }}</span>
                  <span class="text-[10px] font-semibold shrink-0 ml-2"
                    :class="conv.seller_unread > 0 ? 'text-primary' : 'text-gray-400'">
                    {{ formatTime(conv.last_message_at || conv.created_at) }}
                  </span>
                </div>
                <div class=" text-xs truncate leading-snug"
                  :class="conv.seller_unread > 0 ? 'text-navy font-bold' : 'text-gray-500 font-medium'">
                  {{ conv.last_message || (conv.product_name ? `Re: ${conv.product_name}` : t('chat.start_conversation', 'Mulai Percakapan')) }}
                </div>
                <div v-if="conv.product_name"
                  class="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded-md">
                  <Icon icon="ph:package-bold" class="text-[10px] text-primary" />
                  {{ conv.product_name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ───────── RIGHT: Chat Thread ───────── -->
      <div class="flex-grow flex flex-col min-w-0 bg-white" :class="!activeConv && 'hidden md:flex'">

        <!-- No conversation selected -->
        <div v-if="!activeConv" class="flex-grow flex flex-col items-center justify-center p-10 text-center">
          <div
            class="size-24 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-6">
            <Icon icon="ph:chat-circle-dots-bold" class="text-4xl text-primary/50" />
          </div>
          <h3 class="text-xl font-black text-navy tracking-tight mb-2">{{ t('chat.select_conversation', 'Pilih Percakapan') }}</h3>
          <div class="text-sm text-gray-400 font-medium max-w-[260px] leading-relaxed">
            {{ t('chat.select_conversation_desc', 'Pilih salah satu pesan di sebelah kiri untuk mulai membaca dan membalas.') }}
          </div>
        </div>

        <!-- Active conversation -->
        <template v-else>

          <!-- Chat header -->
          <div class="px-5 py-3 bg-white border-b border-gray-200 flex items-center gap-3 shrink-0">
            <!-- Back (mobile) -->
            <button @click="activeConv = null"
              class="md:hidden size-9 rounded-xl hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition">
              <Icon icon="ph:arrow-left-bold" class="text-navy" />
            </button>
            <!-- Archer avatar -->
            <div class="size-10 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shrink-0">
              <img :src="useImageOrDefault(activeConv.archer_avatar, activeConv.archer_name)" class="w-full h-full object-cover" />
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-black text-navy leading-none truncate">{{ activeConv.archer_name || 'Pembeli' }}
              </h3>
              <div class="flex items-center gap-1 mt-0.5">
                <div class="size-1.5 rounded-full"
                  :class="isOnline(activeConv.archer_last_seen) ? 'bg-green-400' : 'bg-gray-300'"></div>
                <span class="text-[10px] font-semibold"
                  :class="isOnline(activeConv.archer_last_seen) ? 'text-green-500' : 'text-gray-400'">
                  {{ lastActiveLabel(activeConv.archer_last_seen) }}
                </span>
                <template v-if="activeConv.product_name">
                  <span class="text-gray-200 mx-1">·</span>
                  <Icon icon="ph:package-bold" class="text-[10px] text-gray-400" />
                  <span class="text-[10px] text-gray-400 font-semibold truncate">{{ activeConv.product_name }}</span>
                </template>
              </div>
            </div>

            <!-- Product thumbnail & Close Ticket Action -->
            <div class="flex items-center gap-2">
              <BaseButton
                variant="outline"
                size="xs"
                icon="ph:clipboard-text-bold"
                class="!rounded-xl !border-gray-200 text-navy bg-white hover:bg-gray-50 font-bold text-[11px] shadow-xs"
                @click="showCloseTicketModal = true"
                title="Tutup / Selesaikan Pesanan Ini"
              >
                Tutup Pesanan
              </BaseButton>
              <div v-if="activeConv.product_image"
                class="size-10 rounded-xl overflow-hidden border-2 border-gray-200 shrink-0">
                <img :src="useImageOrDefault(activeConv.product_image)" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <!-- Product context banner -->
          <div v-if="activeConv.product_name"
            class="flex items-center gap-3 px-5 py-2.5 bg-primary/5 border-b border-primary/20 shrink-0">
            <div class="size-8 rounded-lg overflow-hidden bg-white border-2 border-primary/20 shrink-0">
              <img v-if="activeConv.product_image" :src="useImageOrDefault(activeConv.product_image)" class="w-full h-full object-cover" />
              <Icon v-else icon="ph:package-bold" class="text-gray-400 text-sm m-auto mt-1.5" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-[10px] font-black text-navy truncate">{{ activeConv.product_name }}</div>
              <div class="text-[9px] text-gray-500 font-semibold">{{ t('chat.product_asked', 'Menanyakan Produk Ini') }}</div>
            </div>
          </div>

          <!-- Messages area -->
          <div ref="messageContainer" @scroll="onMessageScroll" class="flex-grow overflow-y-auto px-4 sm:px-6 py-5 space-y-3 no-scrollbar bg-[#efeae2]/70 relative transition-all duration-200"
            style="background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); background-repeat: repeat;">

            <!-- Top loading indicator for older messages -->
            <div v-if="isLoadingOlder" class="flex justify-center py-2">
              <div class="px-3 py-1 bg-white/90 rounded-full border border-gray-200 shadow-sm flex items-center gap-2 text-xs font-bold text-gray-500 animate-pulse">
                <Icon icon="ph:spinner-gap-bold" class="animate-spin text-primary" />
                <span>{{ t('chat.loading_older', 'Memuat pesan terdahulu...') }}</span>
              </div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="isLoadingMessages" class="space-y-4 animate-pulse">
              <div v-for="i in 5" :key="i" class="flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
                <div class="rounded-2xl bg-white border border-gray-200 shadow-sm"
                  :class="i % 2 === 0 ? 'w-2/3 h-10 rounded-tr-sm' : 'w-1/2 h-10 rounded-tl-sm'"></div>
              </div>
            </div>

            <!-- Messages -->
            <template v-else>
              <div v-if="messages.length === 0"
                class="flex flex-col items-center justify-center h-full py-10 text-center">
                <div
                  class="size-16 rounded-3xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
                  <Icon icon="ph:chat-circle-bold" class="text-3xl text-gray-300" />
                </div>
                <div class="text-sm font-bold text-gray-400">{{ t('chat.no_messages', 'Belum Ada Pesan') }}</div>
                <div class="text-xs text-gray-300 font-medium mt-1">{{ t('chat.reply_to_start', 'Kirim pesan untuk memulai pembicaraan') }}</div>
              </div>

              <template v-else>
                <template v-for="(msg, index) in messages" :key="msg.id">
                  <!-- Date separator -->
                  <div v-if="showDateSeparator(index)" class="flex items-center gap-3 my-3">
                    <div class="flex-1 h-px bg-gray-200"></div>
                    <span
                      class="text-[9px] font-black text-gray-400 tracking-widest bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                      {{ formatDateLabel(msg.created_at) }}
                    </span>
                    <div class="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <!-- Message bubble -->
                  <div class="flex flex-col transition-all duration-200" :class="msg.sender_type === 'seller' ? 'items-end' : 'items-start'">
                    <div class="max-w-[78%] sm:max-w-[65%]">
                      <div class="px-4 py-2.5 text-sm leading-relaxed font-medium shadow-xs whitespace-pre-wrap break-words bg-white text-navy border border-gray-200" :class="msg.sender_type === 'seller'
                        ? 'rounded-2xl rounded-tr-xs'
                        : 'rounded-2xl rounded-tl-xs'">
                        {{ msg.message }}
                      </div>
                      <div class="mt-1 text-[9px] font-semibold text-gray-400 flex items-center gap-1"
                        :class="msg.sender_type === 'seller' ? 'justify-end' : 'justify-start'">
                        {{ formatMessageTime(msg.created_at) }}
                        <Icon v-if="msg.sender_type === 'seller'" icon="ph:checks-bold"
                          :class="msg.is_read ? 'text-primary' : 'text-gray-300'" class="text-xs" />
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </template>
          </div>

          <!-- Input area -->
          <div class="px-4 py-3 bg-white border-t-2 border-gray-200 shrink-0">
            <div class="flex items-end gap-2.5 max-w-4xl mx-auto">
              <div
                class="flex-grow bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-primary/40 focus-within:bg-white transition-all flex items-end overflow-hidden">
                <textarea v-model="newMessage" :placeholder="t('chat.type_reply', 'Ketik balasan pesan...')" rows="1"
                  @keydown.enter.exact.prevent="sendMessage"
                  class="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium px-4 py-3 max-h-32 resize-none no-scrollbar text-navy placeholder:text-gray-300 outline-none" />
              </div>
              <button @click="sendMessage" :disabled="!newMessage.trim() || isSending"
                class="size-11 rounded-2xl bg-navy flex items-center justify-center shrink-0 shadow-lg hover:bg-primary hover:shadow-primary/40 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 border-2 border-navy hover:border-primary">
                <Icon v-if="isSending" icon="ph:spinner" class="animate-spin text-primary text-lg" />
                <Icon v-else icon="ph:paper-plane-right-fill" class="text-primary text-lg" />
              </button>
            </div>
            <div class="text-[9px] text-gray-300 font-semibold text-center mt-2">{{ t('chat.send_hint', 'Tekan Enter untuk mengirim, Shift + Enter untuk baris baru') }}
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Close Order Ticket Modal -->
    <div v-if="showCloseTicketModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Icon icon="ph:check-square-offset-bold" class="text-xl" />
            </div>
            <div>
              <h3 class="font-black text-navy text-lg leading-tight">Tutup Tiket Pesanan</h3>
              <div class="text-xs text-gray-500 mt-0.5">Pilih status penyelesaian untuk transaksi ini</div>
            </div>
          </div>
          <button @click="showCloseTicketModal = false" class="size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition">
            <Icon icon="ph:x-bold" class="text-sm" />
          </button>
        </div>

        <div class="space-y-3">
          <!-- Option 1: Selesai / Deal -->
          <button @click="handleCloseTicket('success')" :disabled="isClosingTicket"
            class="w-full text-left p-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-500 transition-all flex items-start gap-3.5 group">
            <div class="size-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Icon icon="ph:check-bold" class="text-lg" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-black text-emerald-950 text-sm flex items-center justify-between">
                <span>Pesanan Selesai / Berhasil Deal</span>
                <Icon icon="ph:arrow-right-bold" class="text-emerald-600 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div class="text-[11px] text-emerald-800/80 mt-1 leading-relaxed">
                Transaksi disepakati, pembayaran/stok aman, dan produk siap atau sudah dikirim ke pembeli.
              </div>
            </div>
          </button>

          <!-- Option 2: Batal / Tidak Deal -->
          <button @click="handleCloseTicket('failed')" :disabled="isClosingTicket"
            class="w-full text-left p-4 rounded-2xl border-2 border-rose-100 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-500 transition-all flex items-start gap-3.5 group">
            <div class="size-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Icon icon="ph:x-bold" class="text-lg" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-black text-rose-950 text-sm flex items-center justify-between">
                <span>Batalkan / Tidak Jadi Deal</span>
                <Icon icon="ph:arrow-right-bold" class="text-rose-600 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div class="text-[11px] text-rose-800/80 mt-1 leading-relaxed">
                Pesanan tidak berlanjut (stok barang habis, negosiasi batal, atau pembeli membatalkan).
              </div>
            </div>
          </button>
        </div>

        <div class="pt-2">
          <BaseButton @click="showCloseTicketModal = false" variant="outline" size="md" class="w-full !rounded-xl text-gray-500">
            Kembali ke Obrolan
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

definePageMeta({ layout: 'dashboard' })

const { t } = useDashboardI18n()

useHead({ title: computed(() => `${t('chat.title', 'Pesan & Chat')} - Dashboard Seller`) })

const { get, post } = useApi()
const toast = useToast()

const searchQuery = ref('')
const conversations = ref([])
const isLoadingList = ref(true)
const activeConv = ref(null)
const messages = ref([])
const isLoadingMessages = ref(false)
const isLoadingOlder = ref(false)
const hasMoreMessages = ref(true)
const newMessage = ref('')
const isSending = ref(false)
const isClosingTicket = ref(false)
const showCloseTicketModal = ref(false)
const messageContainer = ref(null)
let pollInterval = null

async function handleCloseTicket(status) {
  if (!activeConv.value || isClosingTicket.value) return

  isClosingTicket.value = true
  const closingMessage = status === 'success'
    ? '🎉 *PESANAN SELESAI*\n━━━━━━━━━━━━━━━━━━━━━━━━\n✅ *Status:* Transaksi Selesai & Deal\nTerima kasih telah berbelanja! Pesanan Anda telah selesai diproses oleh penjual.\n━━━━━━━━━━━━━━━━━━━━━━━━'
    : '⚠️ *PESANAN DIBATALKAN*\n━━━━━━━━━━━━━━━━━━━━━━━━\n❌ *Status:* Dibatalkan / Tutup Tiket\nPenjual telah menutup percakapan / tiket pesanan ini.\n━━━━━━━━━━━━━━━━━━━━━━━━'

  try {
    await post(`/chat/conversations/${activeConv.value.id}/messages`, { message: closingMessage })
    showCloseTicketModal.value = false
    toast.success(status === 'success' ? 'Pesanan berhasil ditandai selesai!' : 'Tiket pesanan berhasil ditutup / dibatalkan.')
    await fetchMessages(activeConv.value.id)
    await refreshConversationsSilent()
  } catch (error) {
    console.error('Failed to close ticket:', error)
    toast.error('Gagal memperbarui status pesanan')
  } finally {
    isClosingTicket.value = false
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const filteredConvs = computed(() => {
  if (!searchQuery.value) return conversations.value
  const q = searchQuery.value.toLowerCase()
  return conversations.value.filter(c =>
    (c.archer_name || '').toLowerCase().includes(q) ||
    (c.product_name || '').toLowerCase().includes(q) ||
    (c.last_message || '').toLowerCase().includes(q)
  )
})

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(fetchConversations)
onUnmounted(() => clearInterval(pollInterval))

// ─── Fetch Conversations ──────────────────────────────────────────────────────
async function fetchConversations() {
  isLoadingList.value = true
  try {
    const res = await get('/chat/conversations')
    conversations.value = res.conversations || []
  } catch (e) {
    console.error('Failed to fetch conversations:', e)
  } finally {
    isLoadingList.value = false
  }
}

// Silent refresh — used by polling so the skeleton never flashes
async function refreshConversationsSilent() {
  try {
    const res = await get('/chat/conversations')
    conversations.value = res.conversations || []
  } catch { /* silent */ }
}

// ─── Open Conversation ────────────────────────────────────────────────────────
async function openConversation(conv) {
  if (activeConv.value?.id === conv.id) return
  activeConv.value = conv
  hasMoreMessages.value = true
  await fetchMessages(conv.id)
  const idx = conversations.value.findIndex(c => c.id === conv.id)
  if (idx >= 0) conversations.value[idx].seller_unread = 0
  clearInterval(pollInterval)
  pollInterval = setInterval(() => pollMessages(conv.id), 5000)
}

// ─── Top Scroll Pagination (Load Older Messages) ─────────────────────────────
async function onMessageScroll() {
  if (!messageContainer.value || isLoadingOlder.value || !hasMoreMessages.value || !activeConv.value) return
  if (messageContainer.value.scrollTop < 50) {
    await fetchOlderMessages()
  }
}

async function fetchOlderMessages() {
  if (!messages.value.length || isLoadingOlder.value || !hasMoreMessages.value) return
  const oldestMsg = messages.value[0]
  if (!oldestMsg?.id || oldestMsg.id.startsWith('temp-')) return

  isLoadingOlder.value = true
  const oldScrollHeight = messageContainer.value?.scrollHeight || 0

  try {
    const res = await get(`/chat/conversations/${activeConv.value.id}/messages`, {
      params: { before_id: oldestMsg.id }
    })
    const olderMsgs = res.messages || []
    if (olderMsgs.length === 0) {
      hasMoreMessages.value = false
    } else {
      const uniqueOlder = olderMsgs.filter(om => !messages.value.some(m => m.id === om.id))
      if (uniqueOlder.length === 0) {
        hasMoreMessages.value = false
      } else {
        messages.value = [...uniqueOlder, ...messages.value]
        await nextTick()
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight - oldScrollHeight
        }
      }
    }
  } catch (e) {
    console.error('Failed to load older messages:', e)
  } finally {
    isLoadingOlder.value = false
  }
}

// ─── Fetch Messages ───────────────────────────────────────────────────────────
async function fetchMessages(convId) {
  isLoadingMessages.value = true
  try {
    const res = await get(`/chat/conversations/${convId}/messages`)
    messages.value = res.messages || []
    await scrollToBottom()
  } catch (e) {
    toast.error(t('chat.load_failed'))
  } finally {
    isLoadingMessages.value = false
  }
}

async function pollMessages(convId) {
  if (!activeConv.value || activeConv.value.id !== convId) return
  try {
    const lastMsg = messages.value[messages.value.length - 1]
    const params = lastMsg?.id ? { after_id: lastMsg.id } : {}
    const res = await get(`/chat/conversations/${convId}/messages`, { params })
    const newMsgs = res.messages || []
    if (newMsgs.length > 0) {
      for (const msg of newMsgs) {
        if (!messages.value.some(m => m.id === msg.id)) {
          messages.value.push(msg)
        }
      }
      await scrollToBottom()
    }
    // Use silent refresh so isLoadingList stays false and skeleton never flashes
    await refreshConversationsSilent()
  } catch { /* silent */ }
}

// ─── Send Message ─────────────────────────────────────────────────────────────
async function sendMessage() {
  const text = newMessage.value.trim()
  if (!text || isSending.value || !activeConv.value) return

  isSending.value = true
  const tempMsg = {
    id: 'temp-' + Date.now(),
    conversation_id: activeConv.value.id,
    sender_type: 'seller',
    message: text,
    is_read: false,
    created_at: new Date().toISOString(),
  }
  messages.value.push(tempMsg)
  newMessage.value = ''
  await scrollToBottom()

  try {
    const sent = await post(`/chat/conversations/${activeConv.value.id}/messages`, { message: text })
    const idx = messages.value.findIndex(m => m.id === tempMsg.id)
    if (idx >= 0) messages.value[idx] = sent
    const convIdx = conversations.value.findIndex(c => c.id === activeConv.value.id)
    if (convIdx >= 0) {
      conversations.value[convIdx].last_message = text
      conversations.value[convIdx].last_message_at = new Date().toISOString()
    }
  } catch {
    toast.error(t('chat.send_failed'))
    messages.value = messages.value.filter(m => m.id !== tempMsg.id)
  } finally {
    isSending.value = false
  }
}

// ─── Scroll ───────────────────────────────────────────────────────────────────
async function scrollToBottom() {
  await nextTick()
  if (messageContainer.value) messageContainer.value.scrollTop = messageContainer.value.scrollHeight
}

// ─── Online Status ────────────────────────────────────────────────────────────
const isOnline = (lastSeenAt) => {
  if (!lastSeenAt) return false
  return (Date.now() - new Date(lastSeenAt).getTime()) < 5 * 60 * 1000
}

const lastActiveLabel = (lastSeenAt) => {
  if (!lastSeenAt) return t('chat.status_offline')
  const diff = Date.now() - new Date(lastSeenAt).getTime()
  if (diff < 5 * 60 * 1000) return t('chat.status_online')
  if (diff < 60 * 60 * 1000) return t('chat.status_active_m', { val: Math.floor(diff / 60000) })
  if (diff < 24 * 60 * 60 * 1000) return t('chat.status_active_h', { val: Math.floor(diff / 3600000) })
  return t('chat.status_active_d', { val: Math.floor(diff / 86400000) })
}

// ─── Formatting ───────────────────────────────────────────────────────────────
const formatTime = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return t('chat.yesterday')
  if (diffDays < 7) return d.toLocaleDateString('id-ID', { weekday: 'short' })
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

const formatMessageTime = (dt) => {
  if (!dt) return ''
  return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const formatDateLabel = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return t('chat.today')
  if (diffDays === 1) return t('chat.yesterday')
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

const showDateSeparator = (index) => {
  if (index === 0) return true
  const cur = new Date(messages.value[index].created_at).toDateString()
  const prev = new Date(messages.value[index - 1].created_at).toDateString()
  return cur !== prev
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
