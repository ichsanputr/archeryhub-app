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
                        <img v-if="org.avatar_url" :src="org.avatar_url" :alt="org.name"
                            class="w-full h-full object-cover" />
                        <div v-else
                            class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                            <span class="text-4xl md:text-5xl font-black text-navy">{{ org.name?.charAt(0) }}</span>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight">{{ org.name }}
                                    </h1>
                                    <span v-if="org.verification_status === 'verified'"
                                        class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] md:text-xs font-black rounded-full uppercase tracking-wider">
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
                                <button class="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                                    <Icon icon="ph:share-network-bold" class="text-xl text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <!-- Stats Bar -->
                        <div class="flex flex-wrap items-center gap-4 md:gap-8 mt-8 pt-8 border-t border-gray-100">
                            <div class="text-center sm:text-left">
                                <p class="text-2xl md:text-3xl font-black text-navy">{{ events.length }}</p>
                                <p class="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-wide">
                                    Event</p>
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
                                <span :class="statusClass(event.status)"
                                    class="px-4 py-2 text-sm font-black rounded-full border">
                                    {{ statusLabel(event.status) }}
                                </span>
                            </NuxtLink>
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
                                <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Visi</h3>
                                <p class="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{{ org.vision }}
                                </p>
                            </div>
                            <div v-if="org.mission">
                                <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Misi</h3>
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
                                <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                    <Icon icon="ph:whatsapp-logo-fill" class="text-xl text-green-500" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">WhatsApp</p>
                                    <p class="font-bold text-navy">{{ org.whatsapp_no }}</p>
                                </div>
                            </div>
                            <div v-if="org.email" class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                    <Icon icon="ph:envelope-fill" class="text-xl text-red-400" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Email</p>
                                    <p class="font-bold text-navy">{{ org.email }}</p>
                                </div>
                            </div>
                            <div v-if="org.address" class="flex items-center gap-4">
                                <div class="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                                    <Icon icon="ph:map-pin-fill" class="text-xl text-orange-400" />
                                </div>
                                <div>
                                    <p class="text-gray-400 text-xs font-bold uppercase">Alamat</p>
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

                    <!-- Contact Person -->
                    <div v-if="org.contact_person_name"
                        class="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 text-white shadow-sm">
                        <h3 class="font-black mb-4 flex items-center gap-2">
                            <Icon icon="ph:user-circle-bold" class="text-primary" />
                            Kontak Person
                        </h3>
                        <p class="font-bold text-lg">{{ org.contact_person_name }}</p>
                        <p v-if="org.contact_person_email" class="text-sm text-blue-200">{{ org.contact_person_email }}
                        </p>
                        <p v-if="org.contact_person_phone" class="text-sm text-blue-200">{{ org.contact_person_phone }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

const { data: orgResponse, pending: isLoading } = await useAsyncData(
    `org-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/organizations/${route.params.slug}`),
    { server: true }
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


const hasSocialMedia = computed(() => {
    return org.value.social_instagram || org.value.social_facebook || org.value.social_twitter
})

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusClass = (status) => {
    const classes = {
        published: 'bg-green-50 text-green-600 border-green-200',
        live: 'bg-red-50 text-red-600 border-red-200',
        completed: 'bg-gray-50 text-gray-600 border-gray-200',
        draft: 'bg-amber-50 text-amber-600 border-amber-200'
    }
    return classes[status] || 'bg-gray-50 text-gray-600 border-gray-200'
}

const statusLabel = (status) => {
    const labels = {
        published: 'Open',
        live: 'Live',
        completed: 'Selesai',
        draft: 'Draft'
    }
    return labels[status] || status
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
