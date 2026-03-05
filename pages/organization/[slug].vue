<template>
    <div class="bg-background-light min-h-screen flex flex-col">

        <!-- ── Fixed dot-grid background ── -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ══════════════════════════════════════
             HERO HEADER — Consistent with clubs/archers
             ══════════════════════════════════════ -->
        <section class="relative h-[28rem] w-full overflow-hidden bg-navy-dark">
            <!-- Background Image — same pattern as clubs/archers -->
            <img v-if="org.banner_url || org.banner" :src="useImageOrDefault(org.banner_url || org.banner, org.name)"
                class="w-full h-full object-cover object-center opacity-80 shrink-0" :alt="org.name" />
            <div v-else class="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-navy-light">
            </div>

            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent"></div>

            <!-- Hero Content -->
            <div class="absolute bottom-12 left-0 right-0 pb-10 px-6 sm:px-12 max-w-7xl mx-auto z-10">
                <div class="text-white space-y-4">
                    <!-- Badge -->
                    <div class="flex flex-wrap items-center gap-3">
                        <span
                            class="px-4 py-1 bg-primary text-navy-dark text-[10px] sm:text-[11px] font-black rounded-full uppercase tracking-[0.2em]">
                            Profil Resmi Organisasi
                        </span>
                        <div v-if="org.verification_status === 'verified'"
                            class="flex items-center gap-1.5 text-primary">
                            <Icon icon="ph:seal-check-fill" class="text-base" />
                            <span
                                class="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Terverifikasi</span>
                        </div>
                    </div>

                    <!-- Logo + Name -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                        <div
                            class="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl border-4 border-white/20 shadow-2xl overflow-hidden bg-white shrink-0">
                            <img :src="useImageOrDefault(org.avatar_url || org.logo_url, org.name)"
                                class="w-full h-full object-cover" :alt="org.name" />
                        </div>
                        <h1
                            class="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-[0.9] text-white break-words">
                            {{ displayName }}
                        </h1>
                    </div>

                    <!-- Meta row -->
                    <div class="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                        <div v-if="org.city" class="flex items-center gap-2">
                            <span
                                class="text-white/50 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Wilayah</span>
                            <Icon icon="ph:map-pin-fill" class="text-primary text-sm" />
                            <span class="font-bold text-sm text-white">{{ org.city }}</span>
                        </div>
                        <div v-if="org.established_date" class="w-px h-4 bg-white/20"></div>
                        <div v-if="org.established_date" class="flex items-center gap-2">
                            <span
                                class="text-white/50 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Berdiri</span>
                            <span class="font-bold text-sm text-primary">{{ new Date(org.established_date).getFullYear()
                            }}</span>
                        </div>
                        <div class="w-px h-4 bg-white/20"></div>
                        <div class="flex items-center gap-2">
                            <span
                                class="text-white/50 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Event</span>
                            <span class="font-bold text-sm text-primary">{{ totalEvents || 0 }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ══════════════════════════════════════
             MAIN CONTENT
             ══════════════════════════════════════ -->
        <div class="bg-white rounded-t-[3rem] -mt-12 relative z-20 pb-20">
            <main class="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20">
                <div class="space-y-20 sm:space-y-24">

                    <!-- Profil Organisasi -->
                    <div v-if="pageSettings.sections.about" class="space-y-8">
                        <h3
                            class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4">
                            Profil Organisasi <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div class="lg:col-span-8 space-y-6">
                                <p class="text-sm sm:text-base text-navy/70 leading-relaxed font-light">
                                    {{ org.description || displayDescription }}
                                </p>
                                <div v-if="org.registration_number"
                                    class="inline-flex items-center gap-3 px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl">
                                    <Icon icon="ph:fingerprint-bold" class="text-navy/20 text-lg shrink-0" />
                                    <div>
                                        <p
                                            class="text-[10px] sm:text-[11px] font-black text-navy/30 uppercase tracking-widest">
                                            Nomor
                                            Registrasi Resmi</p>
                                        <p class="font-black text-navy text-sm uppercase">{{ org.registration_number }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <!-- Visi & Misi -->
                    <div v-if="pageSettings.sections.about && (org.vision || org.mission)" class="space-y-8">
                        <h3
                            class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4">
                            Visi &amp; Misi <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div v-if="org.vision"
                                class="p-6 sm:p-8 bg-gray-50 rounded-2xl sm:rounded-3xl border border-gray-100">
                                <div class="flex items-center gap-3 mb-4">
                                    <div
                                        class="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon icon="ph:eye-fill" class="text-lg text-primary" />
                                    </div>
                                    <h4
                                        class="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-navy/40">
                                        Visi
                                        Organisasi</h4>
                                </div>
                                <p
                                    class="text-base sm:text-lg font-bold text-navy leading-relaxed italic whitespace-pre-line">
                                    "{{ org.vision }}"
                                </p>
                            </div>
                            <div v-if="org.mission" class="p-6 sm:p-8 bg-navy rounded-2xl sm:rounded-3xl text-white">
                                <div class="flex items-center gap-3 mb-4">
                                    <div
                                        class="size-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Icon icon="ph:target-fill" class="text-lg text-primary" />
                                    </div>
                                    <h4
                                        class="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                                        Misi
                                        Strategis</h4>
                                </div>
                                <p
                                    class="text-sm sm:text-base text-white/80 leading-relaxed font-medium whitespace-pre-line">
                                    {{ org.mission }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Prestasi Organisasi -->
                    <div v-if="achievements.length > 0" class="space-y-8">
                        <h3
                            class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4">
                            Prestasi Organisasi <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="item in achievements" :key="item.id"
                                class="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col gap-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-[9px] font-black tracking-widest text-navy/20 uppercase">{{
                                        formatDate(item.published_at) }}</span>
                                    <div class="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Icon icon="ph:trophy-fill" class="text-primary text-base" />
                                    </div>
                                </div>
                                <h4 class="text-base font-black text-navy leading-tight">{{ item.title }}</h4>
                                <p class="text-xs text-navy/60 line-clamp-2 leading-relaxed">{{ item.excerpt }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Berita & Artikel -->
                    <div v-if="news.length > 0" class="space-y-8">
                        <h3
                            class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4">
                            Berita &amp; Artikel <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-for="item in news" :key="item.id"
                                class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                                <div class="w-full aspect-video bg-gray-100 overflow-hidden">
                                    <img :src="item.image_url" class="w-full h-full object-cover" />
                                </div>
                                <div class="p-5 flex flex-col gap-2 flex-1">
                                    <span class="text-[9px] font-black tracking-widest text-navy/20 uppercase">{{
                                        formatDate(item.published_at) }}</span>
                                    <h4 class="text-sm font-black text-navy leading-tight">{{ item.title }}</h4>
                                    <p class="text-xs text-navy/60 line-clamp-2 leading-relaxed">{{ item.excerpt }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Event Diselenggarakan -->
                    <div class="space-y-8">
                        <div class="flex items-center justify-between">
                            <h3
                                class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4 flex-1">
                                Event Diselenggarakan <span class="h-px flex-1 bg-gray-100"></span>
                            </h3>
                            <NuxtLink v-if="totalEvents > 4" to="/events"
                                class="ml-4 text-[11px] sm:text-xs font-black uppercase tracking-widest text-primary">
                                Lihat Semua
                            </NuxtLink>
                        </div>

                        <div v-if="events.length === 0"
                            class="py-16 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                            <Icon icon="ph:calendar-blank-light" class="text-5xl text-gray-100 mx-auto mb-3" />
                            <p class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/20">Belum
                                ada event
                                terjadwal</p>
                        </div>

                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <NuxtLink v-for="event in events" :key="event.id" :to="`/events/${event.slug || event.id}`"
                                class="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-5">
                                <div
                                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                    <img :src="useImageOrDefault(event.logo_url, event.name)" :alt="event.name"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                                    <div class="space-y-2">
                                        <span :class="statusClass(event)"
                                            class="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
                                            {{ statusLabel(event) }}
                                        </span>
                                        <h4 class="font-black text-navy text-sm leading-tight uppercase truncate">
                                            {{ event.name }}
                                        </h4>
                                    </div>
                                    <div class="flex flex-wrap gap-3 pt-2 border-t border-gray-50">
                                        <div
                                            class="flex items-center gap-1.5 text-navy/40 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                                            <Icon icon="ph:calendar-blank-fill" class="text-xs text-primary" />
                                            {{ formatDate(event.start_date) }}
                                        </div>
                                        <div v-if="event.venue"
                                            class="flex items-center gap-1.5 text-navy/40 text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                                            <Icon icon="ph:map-pin-fill" class="text-xs text-primary" />
                                            <span class="truncate max-w-[120px]">{{ event.venue }}</span>
                                        </div>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Sejarah Singkat -->
                    <div v-if="pageSettings.sections.about && org.history" class="space-y-8">
                        <h3
                            class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4">
                            Sejarah Singkat <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="max-w-3xl">
                            <p
                                class="text-sm sm:text-base text-navy/70 leading-relaxed font-medium whitespace-pre-line">
                                {{ org.history }}
                            </p>
                        </div>
                    </div>

                    <!-- Lokasi & Sekretariat -->
                    <div v-if="org.address || org.gmaps_link" class="space-y-8">
                        <h3
                            class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4">
                            Lokasi &amp; Sekretariat <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div
                            class="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                            <div class="h-52 sm:h-80 w-full bg-gray-50">
                                <iframe v-if="gmapsEmbedUrl" :src="gmapsEmbedUrl" width="100%" height="100%"
                                    style="border:0;" allowfullscreen="" loading="lazy"
                                    referrerpolicy="no-referrer-when-downgrade">
                                </iframe>
                                <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                                    <div class="text-center">
                                        <Icon icon="ph:map-pin-light" class="text-4xl text-gray-200 mb-2 mx-auto" />
                                        <p
                                            class="text-[11px] sm:text-xs font-black text-navy/20 uppercase tracking-widest">
                                            Peta
                                            belum tersedia</p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-5 sm:p-8 flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
                                <div class="p-4 bg-navy rounded-2xl shrink-0">
                                    <Icon icon="ph:map-pin-fill" class="text-xl text-primary" />
                                </div>
                                <div class="min-w-0">
                                    <h4 class="text-base sm:text-xl font-black text-navy leading-tight mb-1 uppercase">
                                        {{ org.address || 'Sekretariat Utama' }}
                                    </h4>
                                    <p
                                        class="text-[11px] sm:text-xs font-black text-navy/30 uppercase tracking-widest mb-4">
                                        {{ org.city }}, {{ org.province }}
                                    </p>
                                    <a v-if="org.gmaps_link" :href="org.gmaps_link" target="_blank"
                                        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-navy rounded-xl text-[11px] sm:text-xs font-black uppercase tracking-widest border border-gray-100">
                                        Buka di Maps
                                        <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- FAQ -->
                    <div v-if="pageSettings.sections.faq && org.faq?.length > 0" class="space-y-8">
                        <h3
                            class="text-[11px] sm:text-xs font-black uppercase tracking-[0.3em] text-navy/30 flex items-center gap-4">
                            Tanya Jawab (FAQ) <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div v-for="(item, idx) in org.faq" :key="idx"
                                class="p-5 sm:p-7 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="size-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Icon icon="ph:question-bold" class="text-sm text-primary" />
                                    </div>
                                    <div class="space-y-3 flex-1 min-w-0">
                                        <h4 class="font-black text-navy text-sm uppercase leading-tight tracking-tight">
                                            {{ item.question }}
                                        </h4>
                                        <div class="h-px bg-gray-100"></div>
                                        <p class="text-xs sm:text-sm text-navy/60 leading-relaxed">
                                            {{ item.answer }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Contact & Social Media — Moved to bottom -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-10">
                        <!-- Hubungi Kami -->
                        <div class="bg-navy p-6 sm:p-8 rounded-[2rem] text-white shadow-sm relative overflow-hidden">
                            <h4 class="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-primary mb-6">
                                Hubungi Kami
                            </h4>
                            <div class="space-y-4">
                                <a v-if="org.whatsapp_no" :href="`https://wa.me/${org.whatsapp_no.replace(/\D/g, '')}`"
                                    target="_blank" class="flex items-center gap-3">
                                    <div
                                        class="size-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                        <Icon icon="ph:whatsapp-logo-fill" class="text-base" />
                                    </div>
                                    <span class="font-bold text-xs sm:text-sm truncate text-white/80">{{ org.whatsapp_no
                                    }}</span>
                                </a>
                                <a v-if="org.email" :href="`mailto:${org.email}`" class="flex items-center gap-3">
                                    <div
                                        class="size-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                        <Icon icon="ph:envelope-bold" class="text-base" />
                                    </div>
                                    <span class="font-bold text-xs sm:text-sm truncate text-white/80">{{ org.email
                                    }}</span>
                                </a>
                                <div v-if="!org.whatsapp_no && !org.email"
                                    class="text-white/30 text-[11px] sm:text-xs font-black uppercase tracking-widest">
                                    Belum tersedia
                                </div>
                            </div>
                        </div>

                        <!-- Media Sosial -->
                        <div v-if="hasSocialMedia"
                            class="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                            <h4 class="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-navy/30 mb-6">
                                Media Sosial
                            </h4>
                            <div class="flex flex-wrap gap-3">
                                <a v-if="org.social_instagram"
                                    :href="`https://instagram.com/${org.social_instagram.replace('@', '')}`"
                                    target="_blank"
                                    class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-navy shadow-sm text-xs font-black uppercase tracking-wider">
                                    <Icon icon="ph:instagram-logo-bold" class="text-base shrink-0" />
                                    <span class="hidden sm:inline">Instagram</span>
                                </a>
                                <a v-if="org.social_facebook" :href="org.social_facebook" target="_blank"
                                    class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-navy shadow-sm text-xs font-black uppercase tracking-wider">
                                    <Icon icon="ph:facebook-logo-bold" class="text-base shrink-0" />
                                    <span class="hidden sm:inline">Facebook</span>
                                </a>
                                <a v-if="org.social_twitter" :href="`https://twitter.com/${org.social_twitter}`"
                                    target="_blank"
                                    class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-navy shadow-sm text-xs font-black uppercase tracking-wider">
                                    <Icon icon="ph:twitter-logo-bold" class="text-base shrink-0" />
                                    <span class="hidden sm:inline">Twitter</span>
                                </a>
                            </div>
                        </div>
                        <!-- Placeholder if no social media -->
                        <div v-else
                            class="bg-gray-50 p-6 sm:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-center">
                            <p class="text-[10px] font-black uppercase tracking-widest text-navy/20">Belum ada media
                                sosial</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>

        <!-- Share Dialog -->
        <Transition name="modal">
            <div v-if="isShareOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div @click="isShareOpen = false" class="absolute inset-0 bg-navy/80 backdrop-blur-sm"></div>
                <div class="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 z-10">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-base font-black text-navy uppercase tracking-tighter">Bagikan Profil</h3>
                        <button @click="isShareOpen = false"
                            class="size-9 bg-gray-100 rounded-full flex items-center justify-center">
                            <Icon icon="ph:x-bold" class="text-sm" />
                        </button>
                    </div>

                    <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                        <div
                            class="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary flex-shrink-0 bg-white">
                            <img :src="useImageOrDefault(org.avatar_url || org.logo_url, org.name)"
                                class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p class="text-[11px] sm:text-xs font-black text-navy/40 uppercase tracking-widest mb-0.5">
                                Organisasi
                                Resmi</p>
                            <p class="font-black text-navy text-sm uppercase leading-none">{{ org.name }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-3 mb-6">
                        <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                            class="flex flex-col items-center gap-2">
                            <div :class="`size-12 rounded-2xl ${plat.bg} flex items-center justify-center`"
                                v-html="plat.iconHtml"></div>
                            <span class="text-[10px] sm:text-[11px] font-black text-navy/40 uppercase tracking-wider">{{
                                plat.name
                                }}</span>
                        </button>
                    </div>

                    <div class="flex gap-2">
                        <input type="text" readonly :value="shareUrl"
                            class="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] sm:text-[11px] font-black uppercase text-navy/40 outline-none" />
                        <button @click="copyLink"
                            class="px-5 py-3 bg-navy text-white rounded-xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                            {{ copied ? 'Tersalin' : 'Salin' }}
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

const org = computed(() => {
    const data = orgResponse.value?.data || orgResponse.value || {}
    return data.organization || data || {}
})
const events = computed(() => orgResponse.value?.events || orgResponse.value?.data?.events || [])
const clubs = computed(() => orgResponse.value?.clubs || orgResponse.value?.data?.clubs || [])
const achievements = computed(() => orgResponse.value?.achievements || orgResponse.value?.data?.achievements || [])
const news = computed(() => orgResponse.value?.news || orgResponse.value?.data?.news || [])
const totalEvents = computed(() => orgResponse.value?.total_events || orgResponse.value?.data?.total_events || 0)
const totalPages = computed(() => Math.ceil(totalEvents.value / 12))

const gmapsEmbedUrl = computed(() => {
    const link = org.value?.gmaps_link || org.value?.google_maps_link
    if (!link && !org.value?.address) return null

    try {
        if (link && link.includes('google.com/maps/embed')) return link
        const searchQuery = org.value.address || `${org.value.name} ${org.value.city}`
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } catch (e) {
        return null
    }
})

const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

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

const copyLink = () => {
    navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}

const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', bg: 'bg-green-50 text-green-600', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.445 2.511-.659c.722.451 1.591.696 2.891.696 3.128 0 5.768-2.586 5.768-5.766 0-3.18-2.585-5.766-5.762-5.766zm3.369 8.303c-.144.405-.842.755-1.168.807-.326.052-.728.093-2.185-.484-1.85-.733-3.038-2.613-3.13-2.733-.093-.12-.76-.997-.76-1.996 0-1 .475-1.5.692-1.742.176-.192.42-.312.693-.312s.273.012.396.024c.123 0 .285-.048.438.312.153.36.525 1.261.57 1.356.045.093.076.204.015.324-.312.612-.342.66-.45.804-.108.144-.225.216-.108.408.117.192.52.852 1.118 1.38.77.684 1.411.897 1.613.997.202.102.321.084.441-.054.12-.138.514-.594.651-.798.136-.204.272-.171.459-.102.187.069 1.187.561 1.391.663z"/></svg>' },
    { id: 'facebook', name: 'Facebook', bg: 'bg-blue-50 text-blue-600', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>' },
    { id: 'twitter', name: 'X', bg: 'bg-slate-50 text-slate-800', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { id: 'copy', name: 'Salin', bg: 'bg-gray-100 text-slate-600', iconHtml: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10"/></svg>' }
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

const hasSocialMedia = computed(() => !!(org.value.social_instagram || org.value.social_facebook || org.value.social_twitter))

const getEventPublicStatus = (event) => {
    const now = new Date()
    const startDate = event.start_date ? new Date(event.start_date) : null
    const endDate = event.end_date ? new Date(event.end_date) : null
    const regEnd = event.registration_end_date ? new Date(event.registration_end_date) : null

    if (now < startDate && regEnd && now <= regEnd) return 'Pendaftaran Dibuka'
    if (now < startDate) return 'Mendatang'
    if (endDate && now > endDate) return 'Selesai'
    if (startDate && now >= startDate) return 'Sedang Berlangsung'
    return 'Mendatang'
}

const statusLabel = (event) => getEventPublicStatus(event)

const statusClass = (event) => {
    const status = getEventPublicStatus(event)
    const classes = {
        'Pendaftaran Dibuka': 'bg-green-50 text-green-600 border border-green-100',
        'Mendatang': 'bg-blue-50 text-blue-600 border border-blue-100',
        'Sedang Berlangsung': 'bg-primary text-navy-dark',
        'Selesai': 'bg-gray-100 text-gray-400'
    }
    return classes[status] || 'bg-gray-50 text-gray-600'
}

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
