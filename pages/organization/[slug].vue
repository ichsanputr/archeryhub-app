<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Organization Banner -->
        <section class="relative h-72 md:h-96 bg-gradient-to-br from-navy to-blue-900 overflow-hidden">
            <img :src="org.banner_url || '/hero-club-detail-default.jpeg'"
                class="w-full h-full object-cover opacity-60" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent"></div>
        </section>

        <!-- Organization Header Card -->
        <section class="container mx-auto px-4 max-w-6xl -mt-28 relative z-10 mb-10">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div
                        class="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white border-2 border-white shadow-sm overflow-hidden flex-shrink-0 -mt-20 md:-mt-24 relative z-20">
                        <img :src="useImageOrDefault(org.avatar_url, org.name)" :alt="org.name"
                            class="w-full h-full object-cover" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight">{{ org.name }}
                                    </h1>
                                    <span v-if="org.verification_status === 'verified'"
                                        class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] md:text-xs font-black rounded-full  tracking-wider">
                                        <Icon icon="ph:seal-check-fill" />
                                        Verified
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium">
                                    <span v-if="org.city" class="flex items-center gap-1.5">
                                        <Icon icon="ph:map-pin-fill" class="text-primary" />
                                        {{ org.city }}<span v-if="org.country && org.country !== 'Indonesia'">, {{
                                            org.country }}</span>
                                    </span>
                                    <span v-if="org.acronym" class="flex items-center gap-1.5">
                                        <Icon icon="ph:tag-bold" />
                                        {{ org.acronym }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <a v-if="org.website" :href="org.website" target="_blank"
                                    class="px-6 py-3 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                                    <Icon icon="ph:globe-bold" />
                                    Website
                                </a>
                                <button @click="sharePage"
                                    class="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all group relative"
                                    title="Bagikan">
                                    <Icon icon="ph:share-network-bold"
                                        class="text-xl text-gray-600 group-hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="container mx-auto px-4 max-w-6xl pb-16">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Column -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- About -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:info-bold" class="text-xl text-primary" />
                            </div>
                            Tentang Organisasi
                        </h2>
                        <p class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                            {{ org.description || 'Organisasi panahan Indonesia.' }}
                        </p>
                    </div>

                    <!-- Events by this Organization -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:trophy-bold" class="text-xl text-primary" />
                            </div>
                            Event yang Diselenggarakan
                        </h2>
                        <div v-if="events.length === 0" class="text-center py-8 text-gray-400">
                            <div>
                                <Icon icon="ph:calendar-x" class="text-4xl mb-2 mx-auto" />
                            </div>
                            <p>Belum ada event yang diselenggarakan</p>
                        </div>
                        <div v-else class="space-y-4">
                            <NuxtLink v-for="event in events" :key="event.id" :to="`/events/${event.slug}`"
                                class="flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all cursor-pointer group">
                                <div
                                    class="w-14 h-14 rounded-xl bg-navy flex items-center justify-center overflow-hidden shrink-0">
                                    <img v-if="event.logo_url" :src="event.logo_url"
                                        class="w-full h-full object-cover" />
                                    <Icon v-else icon="ph:trophy-fill" class="text-2xl text-primary" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-black text-navy text-lg group-hover:text-primary transition-colors">
                                        {{ event.name }}</h4>
                                    <p class="text-sm text-gray-400 flex items-center gap-2">
                                        <Icon icon="ph:calendar" />
                                        {{ formatDate(event.start_date) }}
                                        <span v-if="event.venue" class="flex items-center gap-1">
                                            <Icon icon="ph:map-pin" />
                                            {{ event.venue }}
                                        </span>
                                    </p>
                                </div>
                                <span :class="statusClass(event)"
                                    class="px-4 py-2 text-sm font-black rounded-full border">
                                    {{ statusLabel(event) }}
                                </span>
                            </NuxtLink>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
                            <button @click="page--" :disabled="page === 1"
                                class="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                                <Icon icon="ph:caret-left-bold" />
                            </button>

                            <div class="flex items-center gap-1">
                                <button v-for="p in totalPages" :key="p" @click="page = p" :class="[
                                    'w-10 h-10 rounded-lg font-bold text-sm transition-all',
                                    page === p
                                        ? 'bg-navy text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-100'
                                ]">
                                    {{ p }}
                                </button>
                            </div>

                            <button @click="page++" :disabled="page === totalPages"
                                class="p-2 rounded-lg border border-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">
                                <Icon icon="ph:caret-right-bold" />
                            </button>
                        </div>
                    </div>

                    <!-- Vision & Mission -->
                    <div v-if="pageSettings.sections.about && (org.vision || org.mission)"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-6 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:eye-bold" class="text-xl text-primary" />
                            </div>
                            Visi & Misi
                        </h2>
                        <div class="space-y-6">
                            <div v-if="org.vision">
                                <h3 class="text-sm font-black text-gray-400  tracking-widest mb-2">Visi</h3>
                                <p class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{{ org.vision }}
                                </p>
                            </div>
                            <div v-if="org.mission">
                                <h3 class="text-sm font-black text-gray-400  tracking-widest mb-2">Misi</h3>
                                <p class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{{ org.mission }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- History -->
                    <div v-if="pageSettings.sections.about && org.history"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:book-open-bold" class="text-xl text-primary" />
                            </div>
                            Sejarah Organisasi
                        </h2>
                        <p class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{{ org.history }}</p>
                    </div>

                    <!-- FAQ -->
                    <div v-if="pageSettings.sections.faq && org.faq?.length > 0"
                        class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 overflow-hidden relative">
                        <!-- Decorative element -->
                        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

                        <div
                            class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 relative z-10">
                            <div>
                                <h2 class="font-black text-navy text-2xl mb-2 flex items-center gap-3">
                                    <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Icon icon="ph:question-bold" class="text-2xl text-primary" />
                                    </div>
                                    Tanya Jawab (FAQ)
                                </h2>
                                <p class="text-sm text-gray-400 font-medium">Informasi penting yang mungkin Anda
                                    butuhkan</p>
                            </div>
                        </div>

                        <div class="space-y-4 relative z-10">
                            <details v-for="(faq, fIdx) in org.faq" :key="fIdx"
                                class="group border border-gray-100 rounded-3xl transition-all duration-300 open:bg-gray-50/50 open:border-primary/20 open:shadow-lg open:shadow-primary/5">
                                <summary
                                    class="list-none p-6 font-black text-navy cursor-pointer flex items-center justify-between group-hover:bg-gray-50 group-open:bg-transparent rounded-3xl transition-all duration-300">
                                    <div class="flex items-center gap-4">
                                        <span
                                            class="flex-shrink-0 w-8 h-8 rounded-xl bg-gray-100 group-open:bg-primary group-open:text-navy flex items-center justify-center text-xs font-black transition-colors">
                                            {{ fIdx + 1 }}
                                        </span>
                                        <span class="text-lg leading-tight">{{ faq.question }}</span>
                                    </div>
                                    <div
                                        class="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-open:rotate-180 group-open:bg-navy group-open:border-navy transition-all duration-500">
                                        <Icon icon="ph:caret-down-bold"
                                            class="text-gray-400 group-open:text-white transition-colors" />
                                    </div>
                                </summary>
                                <div class="px-6 pb-8 pt-0 ml-12">
                                    <div class="h-px w-full bg-gradient-to-r from-primary/20 to-transparent mb-6"></div>
                                    <p class="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                                        {{ faq.answer }}
                                    </p>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Contact Card -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy mb-5 flex items-center gap-2">
                            <Icon icon="ph:phone-bold" class="text-primary" />
                            Kontak
                        </h3>
                        <div class="space-y-4">
                            <div v-if="org.whatsapp_no" class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Icon icon="ph:whatsapp-logo-fill" class="text-lg text-gray-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold ">WhatsApp</p>
                                    <p class="font-bold text-navy">{{ org.whatsapp_no }}</p>
                                </div>
                            </div>
                            <div v-if="org.email" class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Icon icon="ph:envelope-fill" class="text-lg text-gray-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold ">Email</p>
                                    <p class="font-bold text-navy">{{ org.email }}</p>
                                </div>
                            </div>
                            <div v-if="org.address" class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Icon icon="ph:map-pin-fill" class="text-lg text-gray-600" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold ">Alamat</p>
                                    <p class="font-bold text-navy text-sm">{{ org.address }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Social Media -->
                    <div v-if="hasSocialMedia" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy mb-5 flex items-center gap-2">
                            <Icon icon="ph:share-network-bold" class="text-primary" />
                            Media Sosial
                        </h3>
                        <div class="flex flex-wrap gap-3">
                            <a v-if="org.social_instagram"
                                :href="`https://instagram.com/${org.social_instagram.replace('@', '')}`" target="_blank"
                                class="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-xl font-bold text-sm hover:bg-pink-100 transition-colors">
                                <Icon icon="ph:instagram-logo-fill" />
                                Instagram
                            </a>
                            <a v-if="org.social_facebook"
                                :href="org.social_facebook.startsWith('http') ? org.social_facebook : `https://facebook.com/${org.social_facebook}`"
                                target="_blank"
                                class="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors">
                                <Icon icon="ph:facebook-logo-fill" />
                                Facebook
                            </a>
                            <a v-if="org.social_twitter"
                                :href="`https://twitter.com/${org.social_twitter.replace('@', '')}`" target="_blank"
                                class="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl font-bold text-sm hover:bg-sky-100 transition-colors">
                                <Icon icon="ph:twitter-logo-fill" />
                                Twitter
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Share Dialog (Custom Modal) -->
        <div v-if="isShareOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <!-- Overlay -->
            <div @click="isShareOpen = false" class="absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity">
            </div>

            <!-- Modal -->
            <div
                class="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                <div class="flex items-center justify-between mb-6 text-left">
                    <h3 class="text-xl font-black text-navy">
                        Bagikan Organisasi
                    </h3>
                    <button @click="isShareOpen = false" class="text-gray-400 hover:text-navy transition-colors">
                        <Icon icon="ph:x-bold" class="text-xl" />
                    </button>
                </div>

                <div class="space-y-6">
                    <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                        <div class="w-12 h-12 rounded-xl bg-white shadow-sm overflow-hidden shrink-0">
                            <img :src="useImageOrDefault(org.avatar_url, org.name)"
                                class="w-full h-full object-cover" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-navy truncate">{{ org.name }}</p>
                            <p class="text-xs text-gray-400 truncate">{{ org.city }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-4">
                        <button @click="shareTo('whatsapp')" class="flex flex-col items-center gap-2 group">
                            <div
                                class="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                                <Icon icon="ph:whatsapp-logo-fill" class="text-2xl" />
                            </div>
                            <span class="text-[10px] font-bold text-gray-500">WhatsApp</span>
                        </button>
                        <button @click="shareTo('facebook')" class="flex flex-col items-center gap-2 group">
                            <div
                                class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Icon icon="ph:facebook-logo-fill" class="text-2xl" />
                            </div>
                            <span class="text-[10px] font-bold text-gray-500">Facebook</span>
                        </button>
                        <button @click="shareTo('twitter')" class="flex flex-col items-center gap-2 group">
                            <div
                                class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                                <Icon icon="ph:twitter-logo-fill" class="text-2xl" />
                            </div>
                            <span class="text-[10px] font-bold text-gray-500">Twitter</span>
                        </button>
                        <button @click="copyLink" class="flex flex-col items-center gap-2 group">
                            <div
                                class="w-12 h-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all">
                                <Icon icon="ph:link-bold" class="text-2xl" />
                            </div>
                            <span class="text-[10px] font-bold text-gray-500">{{ copied ? 'Tersalin' : 'Salin' }}</span>
                        </button>
                    </div>

                    <div class="relative group mt-4">
                        <input type="text" readonly :value="shareUrl"
                            class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 outline-none" />
                        <button @click="copyLink"
                            class="absolute right-2 top-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black hover:bg-gray-50 transition-colors shadow-sm">
                            {{ copied ? 'Berhasil' : 'Salin' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl
const page = ref(1)
const isShareOpen = ref(false)
const copied = ref(false)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

const { data: orgResponse, pending: isLoading } = await useAsyncData(
    `org-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/organizations/${route.params.slug}`, {
        params: { page: page.value, limit: 5 }
    }),
    { watch: [page], server: true }
)

const pageSettings = computed(() => {
    const rawSettings = orgResponse.value?.organization?.page_settings || orgResponse.value?.data?.organization?.page_settings
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

const org = computed(() => {
    return orgResponse.value?.organization || orgResponse.value?.data?.organization || {}
})

const events = computed(() => orgResponse.value?.events || orgResponse.value?.data?.events || [])
const totalEvents = computed(() => orgResponse.value?.total_events || orgResponse.value?.data?.total_events || 0)
const totalPages = computed(() => Math.ceil(totalEvents.value / 5))

const sharePage = () => {
    if (navigator.share) {
        navigator.share({
            title: org.value.name,
            text: org.value.description,
            url: window.location.href
        }).catch(() => {
            isShareOpen.value = true
        })
    } else {
        isShareOpen.value = true
    }
}

const copyLink = () => {
    navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
}

const shareTo = (platform) => {
    const text = encodeURIComponent(`Cek profil ${org.value.name} di Archeryhub!`)
    const url = encodeURIComponent(shareUrl.value)

    let shareLink = ''
    switch (platform) {
        case 'whatsapp': shareLink = `https://wa.me/?text=${text}%20${url}`; break;
        case 'facebook': shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
        case 'twitter': shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
    }

    if (shareLink) window.open(shareLink, '_blank')
}

const hasSocialMedia = computed(() => {
    return org.value.social_instagram || org.value.social_facebook || org.value.social_twitter
})

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Calculate public status based on event dates
const getEventPublicStatus = (event) => {
    const now = new Date()
    const startDate = event.start_date ? new Date(event.start_date) : null
    const endDate = event.end_date ? new Date(event.end_date) : null

    if (!startDate && !endDate) return 'Mendatang'
    if (endDate && now > endDate) return 'Selesai'
    if (startDate && now >= startDate) {
        if (!endDate || now <= endDate) return 'Ongoing'
    }
    return 'Mendatang'
}

const statusClass = (event) => {
    const status = getEventPublicStatus(event)
    const classes = {
        'Mendatang': 'bg-blue-50 text-blue-600 border-blue-200',
        'Ongoing': 'bg-primary/10 text-primary border-primary/20',
        'Selesai': 'bg-gray-50 text-gray-600 border-gray-200'
    }
    return classes[status] || 'bg-gray-50 text-gray-600 border-gray-200'
}

const statusLabel = (event) => {
    return getEventPublicStatus(event)
}

useHead({
    title: computed(() => `${org.value.name || 'Organisasi'} - Archeryhub.id`),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => `${org.value.name || 'Organisasi'} - Archeryhub.id`,
    description: () => org.value.description || 'Profil organisasi panahan Indonesia di Archeryhub.id',
    ogTitle: () => org.value.name,
    ogDescription: () => org.value.description,
    ogImage: () => org.value.avatar_url || org.value.banner_url
})
</script>
