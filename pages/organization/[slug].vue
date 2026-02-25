<template>
    <div class="bg-background-light min-h-screen flex flex-col">

        <!-- ── Fixed dot-grid background ── -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ══════════════════════════════════════
             HERO HEADER — Full Width
             ══════════════════════════════════════ -->
        <section class="relative w-full bg-navy overflow-hidden">
            <!-- Background Elements -->
            <div class="absolute inset-0 z-0">
                <img v-if="org.banner_url" :src="org.banner_url" class="w-full h-full object-cover opacity-30" />
                <div v-else class="w-full h-full bg-gradient-to-br from-navy to-navy-light opacity-80"></div>
                <!-- Dynamic Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-12 relative z-10 text-white">
                <!-- Back nav -->
                <NuxtLink to="/organization"
                    class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-primary transition-colors mb-10">
                    <Icon icon="ph:arrow-left-bold" />
                    Semua Organisasi
                </NuxtLink>

                <!-- Logo + Org name row -->
                <div class="flex flex-col md:flex-row md:items-end gap-5 md:gap-6 mb-8 sm:mb-10">
                    <!-- Logo -->
                    <div
                        class="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white/10 overflow-hidden bg-white shadow-2xl flex-shrink-0 animate-fade-in">
                        <img :src="useImageOrDefault(org.avatar_url, org.name)" :alt="org.name"
                            class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1">
                        <!-- Verification tag -->
                        <span v-if="org.verification_status === 'verified'"
                            class="inline-block bg-primary text-navy text-[10px] font-black px-2 py-1 mb-4 tracking-widest uppercase">
                            <Icon icon="ph:seal-check-fill" class="inline-block mr-1" />
                            Terverifikasi
                        </span>
                        <h1
                            class="text-2xl sm:text-4xl font-black tracking-tight leading-none mb-4 sm:mb-5 uppercase break-words drop-shadow-md">
                            {{ displayName }}
                        </h1>
                        <p class="text-base sm:text-lg md:text-xl font-light text-white/80 max-w-3xl leading-snug">
                            {{ displayDescription }}
                        </p>
                    </div>
                </div>

                <!-- Stats bar -->
                <div class="flex flex-wrap gap-5 sm:gap-10 py-6 sm:py-8 border-y border-white/10 mb-0">
                    <div>
                        <span class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Total
                            Event</span>
                        <span class="text-xl sm:text-2xl font-black text-primary">{{ totalEvents || '—' }}{{
                            totalEvents > 0 ? '+' : ''
                            }}</span>
                    </div>
                    <div v-if="org.established_date">
                        <span
                            class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Berdiri</span>
                        <span class="text-xl sm:text-2xl font-black">{{ new Date(org.established_date).getFullYear()
                            }}</span>
                    </div>
                    <div v-if="org.city">
                        <span
                            class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Lokasi</span>
                        <span class="text-xl sm:text-2xl font-black font-condensed uppercase tracking-tight">{{ org.city
                            }}</span>
                    </div>
                    <div v-if="clubs.length > 0">
                        <span class="text-[10px] uppercase tracking-widest text-white/40 font-black block mb-1">Klub
                            Binaan</span>
                        <span class="text-xl sm:text-2xl font-black">{{ clubs.length }}</span>
                    </div>
                    <div class="w-full sm:w-auto sm:ml-auto self-center flex gap-3">
                        <button @click="isShareOpen = true"
                            class="size-11 sm:size-12 rounded-xl border border-white/10 hover:border-primary hover:bg-primary transition-all flex items-center justify-center group sm:ml-0 ml-auto backdrop-blur-md">
                            <Icon icon="ph:share-network-bold" class="text-xl text-white group-hover:text-navy" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ══════════════════════════════════════
             MAIN BODY
             ══════════════════════════════════════ -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24">

            <!-- ── About + Info grid ── -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 py-10 sm:py-16">
                <!-- Main Content Column -->
                <div class="lg:col-span-2 space-y-12 sm:space-y-16">
                    <!-- About Section -->
                    <section v-if="pageSettings.sections.about">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:info-bold" class="text-sm" />
                            </span>
                            <h2 class="text-xl font-black uppercase tracking-tight">Tentang Organisasi</h2>
                        </div>
                        <div class="space-y-4 text-[#0f172a]/70 leading-relaxed font-medium">
                            <p class="whitespace-pre-line">{{ org.description }}</p>
                            <p v-if="org.registration_number"
                                class="text-xs font-black uppercase tracking-widest text-navy bg-primary/10 inline-block px-3 py-1 rounded">
                                No. Registrasi: {{ org.registration_number }}
                            </p>
                        </div>
                    </section>

                    <!-- Clubs Section -->
                    <section v-if="clubs.length > 0">
                        <div class="flex items-center gap-3 mb-8">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:shield-star-bold" class="text-sm" />
                            </span>
                            <h2 class="text-xl font-black uppercase tracking-tight">Klub di Bawah Naungan</h2>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <NuxtLink v-for="club in clubs" :key="club.id" :to="`/clubs/${club.slug}`"
                                class="group bg-white p-4 rounded-2xl border border-[#0f172a]/10 hover:border-primary transition-all flex items-center gap-4">
                                <div
                                    class="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <img :src="useImageOrDefault(club.logo_url, club.name)" :alt="club.name"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div class="min-w-0">
                                    <h4
                                        class="font-black text-navy text-sm group-hover:text-primary transition-colors truncate uppercase leading-tight">
                                        {{ club.name }}</h4>
                                    <p class="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mt-0.5">{{
                                        club.city || 'Indonesia' }} • {{ club.member_count }} Archer</p>
                                </div>
                            </NuxtLink>
                        </div>
                    </section>

                    <!-- Vision & Mission -->
                    <section v-if="pageSettings.sections.about && (org.vision || org.mission)" class="space-y-10">
                        <div v-if="org.vision">
                            <div class="flex items-center gap-3 mb-6">
                                <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                    <Icon icon="ph:eye-bold" class="text-sm" />
                                </span>
                                <h2 class="text-xl font-black uppercase tracking-tight">Visi</h2>
                            </div>
                            <p class="text-[#0f172a]/70 leading-relaxed font-medium whitespace-pre-line">{{
                                org.vision }}</p>
                        </div>

                        <div v-if="org.mission">
                            <div class="flex items-center gap-3 mb-6">
                                <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                    <Icon icon="ph:target-bold" class="text-sm" />
                                </span>
                                <h2 class="text-xl font-black uppercase tracking-tight">Misi</h2>
                            </div>
                            <p class="text-[#0f172a]/70 leading-relaxed font-medium whitespace-pre-line">{{
                                org.mission }}</p>
                        </div>
                    </section>

                    <!-- Events Section -->
                    <section>
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center gap-3">
                                <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                    <Icon icon="ph:calendar-bold" class="text-sm" />
                                </span>
                                <h2 class="text-xl font-black uppercase tracking-tight">Event Diselenggarakan</h2>
                            </div>
                            <NuxtLink v-if="totalEvents > 5" to="/events"
                                class="text-xs font-black uppercase tracking-widest text-primary hover:text-navy transition-colors">
                                Lihat Semua
                            </NuxtLink>
                        </div>

                        <div v-if="events.length === 0"
                            class="py-16 text-center border border-[#0f172a]/10 rounded-3xl bg-gray-50/50">
                            <Icon icon="ph:calendar-x-light" class="text-5xl mx-auto mb-3 opacity-20" />
                            <p class="text-[10px] font-black uppercase tracking-widest text-[#64748b]">Belum ada event
                                saat ini</p>
                        </div>

                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <NuxtLink v-for="event in events" :key="event.id" :to="`/events/${event.slug || event.id}`"
                                class="group bg-white p-5 rounded-3xl border border-[#0f172a]/10 hover:border-primary transition-all flex flex-col gap-5">
                                <div class="flex items-start justify-between gap-4">
                                    <div
                                        class="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                        <img :src="useImageOrDefault(event.logo_url, event.name)" :alt="event.name"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <span :class="statusClass(event)"
                                        class="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest">
                                        {{ statusLabel(event) }}
                                    </span>
                                </div>
                                <div>
                                    <h4
                                        class="font-black text-navy text-lg group-hover:text-primary transition-colors line-clamp-2 leading-tight uppercase mb-2">
                                        {{ event.name }}
                                    </h4>
                                    <div class="flex flex-col gap-1.5">
                                        <div
                                            class="flex items-center gap-2 text-[#64748b] text-[10px] font-bold uppercase tracking-widest">
                                            <Icon icon="ph:calendar-blank-fill" class="text-xs" />
                                            {{ formatDate(event.start_date) }}
                                        </div>
                                        <div v-if="event.venue"
                                            class="flex items-center gap-2 text-[#64748b] text-[10px] font-bold uppercase tracking-widest">
                                            <Icon icon="ph:map-pin-fill" class="text-xs" />
                                            <span class="truncate">{{ event.venue }}</span>
                                        </div>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
                            <button @click="page--" :disabled="page === 1"
                                class="w-10 h-10 border border-navy/20 flex items-center justify-center font-bold hover:bg-navy hover:text-primary hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                <Icon icon="ph:caret-left-bold" />
                            </button>
                            <button v-for="p in totalPages" :key="p" @click="page = p"
                                class="w-10 h-10 font-black text-sm border transition-all"
                                :class="page === p ? 'bg-navy text-primary border-navy' : 'border-navy/20 hover:border-navy text-[#64748b]'">
                                {{ p }}
                            </button>
                            <button @click="page++" :disabled="page === totalPages"
                                class="w-10 h-10 border border-navy/20 flex items-center justify-center font-bold hover:bg-navy hover:text-primary hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                <Icon icon="ph:caret-right-bold" />
                            </button>
                        </div>
                    </section>

                    <!-- History -->
                    <section v-if="pageSettings.sections.about && org.history">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:book-open-bold" class="text-sm" />
                            </span>
                            <h2 class="text-xl font-black uppercase tracking-tight">Sejarah</h2>
                        </div>
                        <p class="text-[#0f172a]/70 leading-relaxed font-medium whitespace-pre-line">{{
                            org.history }}</p>
                    </section>

                    <!-- FAQ -->
                    <section v-if="pageSettings.sections.faq && org.faq?.length > 0">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="bg-navy p-1.5 rounded text-primary flex items-center">
                                <Icon icon="ph:question-bold" class="text-sm" />
                            </span>
                            <h2 class="text-xl font-black uppercase tracking-tight">Tanya Jawab (FAQ)</h2>
                        </div>
                        <div class="space-y-4">
                            <details v-for="(item, idx) in org.faq" :key="idx"
                                class="group border border-[#0f172a]/10 hover:border-primary/40 transition-all rounded-3xl overflow-hidden">
                                <summary
                                    class="list-none p-6 font-black text-navy cursor-pointer flex items-center justify-between group-hover:bg-gray-50 transition-all">
                                    <span class="text-lg leading-tight uppercase">{{ item.question }}</span>
                                    <Icon icon="ph:caret-down-bold"
                                        class="transition-transform group-open:rotate-180" />
                                </summary>
                                <div class="px-6 pb-6 text-[#64748b] leading-relaxed font-medium">
                                    {{ item.answer }}
                                </div>
                            </details>
                        </div>
                    </section>
                </div>

                <!-- Sidebar / Contact -->
                <aside class="space-y-8">
                    <!-- Contact Card -->
                    <div class="bg-white rounded-[2.5rem] border border-[#0f172a]/10 p-8 shadow-sm">
                        <h3 class="font-black text-navy mb-8 text-xl uppercase tracking-tighter">Hubungi Kami</h3>
                        <div class="space-y-6">
                            <div v-if="org.whatsapp_no" class="flex gap-4 group cursor-pointer"
                                @click="shareTo('whatsapp')">
                                <div
                                    class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-green-500 group-hover:border-green-500 transition-all">
                                    <Icon icon="ph:whatsapp-logo-fill"
                                        class="text-xl text-[#0f172a] group-hover:text-white" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-0.5">
                                        WhatsApp</p>
                                    <p class="font-black text-navy truncate">{{ org.whatsapp_no }}</p>
                                </div>
                            </div>

                            <div v-if="org.email" class="flex gap-4 group">
                                <div
                                    class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-navy group-hover:border-navy transition-all">
                                    <Icon icon="ph:envelope-fill"
                                        class="text-xl text-[#0f172a] group-hover:text-white" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-0.5">
                                        Email Resmi</p>
                                    <p class="font-black text-navy truncate">{{ org.email }}</p>
                                </div>
                            </div>

                            <div v-if="org.address" class="flex gap-4 group">
                                <div
                                    class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                    <Icon icon="ph:map-pin-fill" class="text-xl text-[#0f172a]" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-0.5">
                                        Sekretariat</p>
                                    <p class="font-bold text-navy text-sm leading-snug">{{ org.address }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Social buttons -->
                        <div v-if="hasSocialMedia" class="mt-10 pt-8 border-t border-gray-100">
                            <p class="text-[10px] font-black text-[#64748b] uppercase tracking-[0.2em] mb-4">Media
                                Sosial</p>
                            <div class="flex flex-wrap gap-2">
                                <a v-if="org.social_instagram"
                                    :href="`https://instagram.com/${org.social_instagram.replace('@', '')}`"
                                    target="_blank"
                                    class="size-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:scale-110 transition-transform">
                                    <Icon icon="ph:instagram-logo-fill" class="text-xl" />
                                </a>
                                <a v-if="org.social_facebook"
                                    :href="org.social_facebook.startsWith('http') ? org.social_facebook : `https://facebook.com/${org.social_facebook}`"
                                    target="_blank"
                                    class="size-10 rounded-xl bg-[#1877f2] flex items-center justify-center text-white hover:scale-110 transition-transform">
                                    <Icon icon="ph:facebook-logo-fill" class="text-xl" />
                                </a>
                                <a v-if="org.social_twitter"
                                    :href="`https://twitter.com/${org.social_twitter.replace('@', '')}`" target="_blank"
                                    class="size-10 rounded-xl bg-black flex items-center justify-center text-white hover:scale-110 transition-transform">
                                    <Icon icon="ph:x-logo-fill" class="text-xl" />
                                </a>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>

        <!-- Share Dialog (Custom Modal) -->
        <Transition name="modal">
            <div v-if="isShareOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div @click="isShareOpen = false" class="absolute inset-0 bg-navy/80 backdrop-blur-sm"></div>
                <div
                    class="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 z-10 transition-all">
                    <div class="flex items-center justify-between mb-8">
                        <h3 class="text-xl font-black text-navy uppercase tracking-tighter">Bagikan Profil</h3>
                        <button @click="isShareOpen = false"
                            class="size-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>

                    <div class="flex items-center gap-4 p-5 bg-gray-50 rounded-xl mb-8">
                        <div
                            class="w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary flex-shrink-0 bg-white">
                            <img :src="useImageOrDefault(org.avatar_url, org.name)"
                                class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-[#64748b] uppercase tracking-widest mb-1">Organisasi
                                Resmi</p>
                            <p class="font-black text-navy text-base uppercase leading-none">{{ org.name }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-4 mb-8">
                        <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                            class="flex flex-col items-center gap-2 group">
                            <div :class="`size-14 rounded-2xl ${plat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`"
                                v-html="plat.iconHtml"></div>
                            <span class="text-[10px] font-black text-[#64748b] uppercase tracking-wider">{{ plat.name
                                }}</span>
                        </button>
                    </div>

                    <div class="flex gap-2">
                        <input type="text" readonly :value="shareUrl"
                            class="flex-1 px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase text-[#64748b] outline-none" />
                        <button @click="copyLink"
                            class="px-6 py-4 bg-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-light transition-colors">
                            {{ copied ? 'Tersalin' : 'Salin URL' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.font-condensed {
    font-stretch: condensed;
}
</style>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'landing' })

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl
const page = ref(1)
const isShareOpen = ref(false)
const copied = ref(false)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

const { data: orgResponse } = await useAsyncData(
    `org-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/organizations/${route.params.slug}`, {
        params: { page: page.value, limit: 12 }
    }),
    { watch: [page], server: true }
)

const org = computed(() => orgResponse.value?.organization || orgResponse.value?.data?.organization || {})
const events = computed(() => orgResponse.value?.events || orgResponse.value?.data?.events || [])
const clubs = computed(() => orgResponse.value?.clubs || orgResponse.value?.data?.clubs || [])
const totalEvents = computed(() => orgResponse.value?.total_events || orgResponse.value?.data?.total_events || 0)
const totalPages = computed(() => Math.ceil(totalEvents.value / 12))

const displayName = computed(() => org.value.name || 'Organisasi Panahan')
const displayDescription = computed(() => org.value.description || 'Organisasi resmi panahan Indonesia yang berdedikasi membina ekosistem olahraga.')

const pageSettings = computed(() => {
    const rawSettings = org.value?.page_settings
    if (!rawSettings) return { sections: { identity: true, contact: true, about: true, faq: true } }
    try {
        const parsed = typeof rawSettings === 'string' ? JSON.parse(rawSettings) : rawSettings
        return {
            sections: {
                identity: true,
                contact: true,
                about: true,
                faq: true,
                ...(parsed.sections || {})
            }
        }
    } catch (e) {
        return { sections: { identity: true, contact: true, about: true, faq: true } }
    }
})

const sharePage = () => {
    isShareOpen.value = true
}

const copyLink = () => {
    navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}

const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', bg: 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.445 2.511-.659c.722.451 1.591.696 2.891.696 3.128 0 5.768-2.586 5.768-5.766 0-3.18-2.585-5.766-5.762-5.766zm3.369 8.303c-.144.405-.842.755-1.168.807-.326.052-.728.093-2.185-.484-1.85-.733-3.038-2.613-3.13-2.733-.093-.12-.76-.997-.76-1.996 0-1 .475-1.5.692-1.742.176-.192.42-.312.693-.312s.273.012.396.024c.123 0 .285-.048.438.312.153.36.525 1.261.57 1.356.045.093.076.204.015.324-.312.612-.342.66-.45.804-.108.144-.225.216-.108.408.117.192.52.852 1.118 1.38.77.684 1.411.897 1.613.997.202.102.321.084.441-.054.12-.138.514-.594.651-.798.136-.204.272-.171.459-.102.187.069 1.187.561 1.391.663z"/></svg>' },
    { id: 'facebook', name: 'Facebook', bg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>' },
    { id: 'twitter', name: 'X', bg: 'bg-slate-50 text-slate-800 hover:bg-slate-800 hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { id: 'copy', name: 'Salin', bg: 'bg-gray-100 text-slate-600 hover:bg-[#0f172a] hover:text-white', iconHtml: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10"/></svg>' }
]

const shareTo = (platform) => {
    if (platform === 'copy') return copyLink()
    const text = encodeURIComponent(`Cek profil ${org.value.name} di Archeryhub!`)
    const url = encodeURIComponent(shareUrl.value)
    let link = ''
    switch (platform) {
        case 'whatsapp': link = `https://wa.me/?text=${text}%20${url}`; break;
        case 'facebook': link = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
    }
    if (link) window.open(link, '_blank')
}

const hasSocialMedia = computed(() => org.value.social_instagram || org.value.social_facebook || org.value.social_twitter)

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getEventPublicStatus = (event) => {
    const now = new Date()
    const startDate = event.start_date ? new Date(event.start_date) : null
    const endDate = event.end_date ? new Date(event.end_date) : null
    if (!startDate && !endDate) return 'Mendatang'
    if (endDate && now > endDate) return 'Selesai'
    if (startDate && now >= startDate) { if (!endDate || now <= endDate) return 'Ongoing' }
    return 'Mendatang'
}

const statusClass = (event) => {
    const status = getEventPublicStatus(event)
    const classes = {
        'Mendatang': 'bg-blue-50 text-blue-600 border border-blue-100',
        'Ongoing': 'bg-primary text-navy',
        'Selesai': 'bg-gray-100 text-gray-400'
    }
    return classes[status] || 'bg-gray-50 text-gray-600'
}

const statusLabel = (event) => getEventPublicStatus(event)

useHead({
    title: computed(() => `${displayName.value} - Archeryhub.id`),
})

useSeoMeta({
    title: () => `${displayName.value} - Archeryhub.id`,
    description: () => displayDescription.value,
    ogTitle: () => displayName.value,
    ogDescription: () => displayDescription.value,
    ogImage: () => org.value.avatar_url || org.value.banner_url
})
</script>
