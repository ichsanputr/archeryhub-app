<script setup>
 
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { definePageMeta, useSeoMeta } from '#imports'
import { useDateFormat } from '@vueuse/core'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'

const route = useRoute()
const slug = route.params.slug
const config = useRuntimeConfig()

// Auth state
const { user, isLoggedIn } = useAuth()

const scrollContainer = ref(null)
const scroll = (direction) => {
    if (!scrollContainer.value) return
    const scrollAmount = 400
    scrollContainer.value.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
    })
}
const isArcher = computed(() => user.value?.type === 'archer' || user.value?.role === 'archer')

// Generate login URL with redirect
const loginUrl = computed(() => `/auth/login?redirect=${encodeURIComponent(`/events/${slug}`)}`)
const registerUrl = computed(() => `/events/${slug}/register`)

const isLoading = ref(false)

// Fallback data
const fallbackTournament = {
    name: '',
    organizer: 'Perpani DKI Jakarta',
    image: '/hero-event-detail.jpeg',
    page_settings: {
        sections: {
            about: true,
            divisions: true,
            fees: true,
            payment_methods: true,
            prizes: true,
            schedule: true,
            location: true
        }
    }
}

const tournament = ref(fallbackTournament)

const tabs = computed(() => {
    if (!tournament.value || !tournament.value.page_settings) return ['Ringkasan']
    const list = ['Ringkasan']
    if (tournament.value.page_settings?.sections?.schedule !== false) {
        list.push('Jadwal Lomba')
    }
    list.push('Peserta', 'Hasil')
    if (tournament.value.page_settings?.sections?.location !== false) {
        list.push('Lokasi')
    }
    // Always show Galeri tab
    list.push('Galeri')
    if (tournament.value.page_settings?.sections?.faq !== false && tournament.value.faq?.length > 0) {
        list.push('FAQ')
    }
    return list
})
const activeTab = ref('Ringkasan')

// Helper function to decode tab name from URL
const decodeTabName = (tab) => {
    if (!tab) return null
    return decodeURIComponent(String(tab).replace(/\+/g, ' '))
}

const transformEventData = (data) => {
    if (!data) return fallbackTournament

    let pg = {}
    try {
        if (typeof data.page_settings === 'string') {
            pg = JSON.parse(data.page_settings)
        } else if (data.page_settings && typeof data.page_settings === 'object') {
            pg = data.page_settings
        }
    } catch (e) {
        console.warn('Failed to parse page_settings', e)
    }

    const sections = pg.sections || {
        about: true,
        divisions: true,
        fees: true,
        prizes: true,
        schedule: true,
        location: true,
        faq: true,
        payment_methods: true
    }

    return {
        name: data.name || data.title || '',
        date: (() => {
            if (!data.start_date) return data.date || ''
            const start = useDateFormat(data.start_date, 'DD MMM YYYY', { locales: 'id-ID' }).value
            const end = data.end_date ? useDateFormat(data.end_date, 'DD MMM YYYY', { locales: 'id-ID' }).value : null
            if (!end || start === end) return start
            return `${start} - ${end}`
        })(),
        location: data.venue || data.location || '',
        venue: data.venue || data.location || '',
        gmaps_link: data.gmaps_link || '',
        address: data.address || '',
        status: data.status || 'upcoming',
        category: data.category || '',
        organizer: data.organizer_name || data.organizer || 'Penyelenggara',
        organizer_slug: data.organizer_username || data.organizer_slug || null,
        organizer_logo: data.organizer_avatar_url || data.organizer_logo || null,
        whatsapp_number: data.whatsapp_number || data.organizer_phone || data.phone || null,
        image: data.banner_url || data.image || '/hero-event-detail.jpeg',
        thumbnail: data.logo_url || data.thumbnail || null,
        description: data.description || '',
        total_prize: data.total_prize || 0,
        technical_guidebook_url: data.technical_guidebook_url || null,
        max_participants: data.max_participants ?? null,
        registration_deadline: data.registration_deadline || null,
        participant_count: data.participant_count || 0,
        page_settings: { ...pg, sections },
        faq: data.faq ? (typeof data.faq === 'string' ? JSON.parse(data.faq) : data.faq) : [],
        prizes: pg.prizes || { first: '-', second: '-', third: '-' },
        fees: pg.fees || [],
        results: pg.results || [],
        payment_methods: pg.payment_methods || [],
        location_accessibility: pg.location_accessibility || []
    }
}

// Google Maps embed URL
const gmapsEmbedUrl = computed(() => {
    if (!tournament.value.gmaps_link) return null

    try {
        const link = tournament.value.gmaps_link
        // If it's already an embed URL
        if (link.includes('google.com/maps/embed')) return link

        // Extract coordinates or place from URL if available
        const coordsMatch = link.match(/[?&]q=([^&]+)/)
        if (coordsMatch) {
            const query = decodeURIComponent(coordsMatch[1])
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
        }

        const searchQuery = tournament.value.venue || tournament.value.location || link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } catch (e) {
        const searchQuery = tournament.value.venue || tournament.value.location || tournament.value.gmaps_link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }
})

const divisionsData = ref([])

const formatCategoryLabel = (e) => {
    return [e.category_name, e.event_type_name, e.gender_division_name]
        .filter(Boolean)
        .join(' ')
}

const processDivisions = (events) => {
    const grouped = {}
    events.forEach(e => {
        if (!grouped[e.division_name]) {
            grouped[e.division_name] = {
                name: e.division_name,
                categories: new Set()
            }
        }
        const label = formatCategoryLabel(e)
        if (label) grouped[e.division_name].categories.add(label)
    })

    return Object.values(grouped).map(d => ({
        name: d.name,
        categories: Array.from(d.categories),
        icon: getCategoryIcon(d.name)
    }))
}

const displayValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    return value
}

const indonesianPaymentMethods = [
    { title: 'BCA (Bank Central Asia)', value: 'BCA', image: '/payment-method/bca.png', type: 'bank' },
    { title: 'Mandiri', value: 'Mandiri', image: '/payment-method/mandiri.png', type: 'bank' },
    { title: 'BNI (Bank Negara Indonesia)', value: 'BNI', image: '/payment-method/bni.png', type: 'bank' },
    { title: 'BRI (Bank Rakyat Indonesia)', value: 'BRI', image: '/payment-method/bri.png', type: 'bank' },
    { title: 'BSI (Bank Syariah Indonesia)', value: 'BSI', image: '/payment-method/bsi.png', type: 'bank' },
    { title: 'Bank Danamon', value: 'Danamon', image: '/payment-method/danamon.png', type: 'bank' },
    { title: 'GoPay', value: 'GoPay', image: '/payment-method/gopay.png', type: 'ewallet' },
    { title: 'OVO', value: 'OVO', image: '/payment-method/ovo.png', type: 'ewallet' },
    { title: 'DANA', value: 'DANA', image: '/payment-method/dana.png', type: 'ewallet' },
]

const getPaymentMethodImage = (bankName) => {
    if (!bankName) return null
    const method = indonesianPaymentMethods.find(m => m.value.toLowerCase() === bankName.toLowerCase() || bankName.toLowerCase().includes(m.value.toLowerCase()))
    return method ? method.image : null
}

const getPaymentIcon = (method) => {
    const name = (method.bank_name || '').toLowerCase()
    if (method.type === 'qris' || name.includes('qris')) return 'ph:qr-code-bold'
    if (name.includes('bca')) return 'ph:bank-bold'
    if (name.includes('mandiri')) return 'ph:bank-bold'
    if (name.includes('bni')) return 'ph:bank-bold'
    if (name.includes('bri')) return 'ph:bank-bold'
    if (name.includes('gopay')) return 'ph:wallet-bold'
    if (name.includes('dana')) return 'ph:wallet-bold'
    if (name.includes('ovo')) return 'ph:wallet-bold'
    return method.type === 'bank' ? 'ph:bank-bold' : 'ph:wallet-bold'
}

// Prize Captions Computed
const firstPrizeCaption = computed(() => tournament.value.prizes?.first_caption || '+ Medali Emas & Sertifikat')
const secondPrizeCaption = computed(() => tournament.value.prizes?.second_caption || '+ Medali Perak & Sertifikat')
const thirdPrizeCaption = computed(() => tournament.value.prizes?.third_caption || '+ Medali Perunggu & Sertifikat')

// SSR: Fetch event data with useAsyncData
const { data: eventData, error: eventError } = await useAsyncData(
    `event-${slug}`,
    async () => {
        const [eventRes, categoriesRes, schedulesRes, participantsRes, imagesRes] = await Promise.all([
            $fetch(`${config.public.apiBaseUrl}/events/${slug}`),
            $fetch(`${config.public.apiBaseUrl}/events/${slug}/categories`).catch(() => null),
            $fetch(`${config.public.apiBaseUrl}/events/${slug}/schedule`).catch(() => null),
            $fetch(`${config.public.apiBaseUrl}/events/${slug}/participants?limit=2000`).catch(() => null),
            $fetch(`${config.public.apiBaseUrl}/events/${slug}/images`).catch(() => null)
        ])
        return {
            event: eventRes,
            categories: categoriesRes,
            schedules: schedulesRes,
            participants: participantsRes,
            images: imagesRes
        }
    }
)

// Initialize data from SSR response
if (eventData.value?.event) {
    tournament.value = transformEventData(eventData.value.event.data || eventData.value.event)
}
if (eventData.value?.categories?.events) {
    divisionsData.value = processDivisions(eventData.value.categories.events)
}

const schedulesData = computed(() => eventData.value?.schedules?.schedules || eventData.value?.schedules?.data?.schedules || [])
const participantsData = computed(() => eventData.value?.participants?.participants || [])
const categoriesList = computed(() => eventData.value?.categories?.events || [])
const galleryImages = computed(() => eventData.value?.images?.images || eventData.value?.images?.data?.images || [])

// Lightbox state
const lightboxUrl = ref(null)
const openLightbox = (url) => {
    lightboxUrl.value = url
}

// Throw 404 if event not found
if (eventError.value || !eventData.value?.event || !tournament.value.name) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Event tidak ditemukan',
        fatal: true
    })
}

// Sync tab with query params
watch(() => route.query.tab, (newTab) => {
    if (!tournament.value) return
    if (newTab) {
        const decodedTab = decodeTabName(newTab)
        if (decodedTab && tabs.value.includes(decodedTab)) {
            activeTab.value = decodedTab
        } else {
            activeTab.value = tabs.value[0] || 'Ringkasan'
        }
    } else {
        activeTab.value = 'Ringkasan'
    }
}, { immediate: true })

definePageMeta({
    layout: 'landing'
})

useHead({
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => `${tournament.value.name} - Archeryhub.id`,
    description: () => tournament.value.description,
    ogTitle: () => tournament.value.name,
    ogDescription: () => tournament.value.description,
    ogImage: () => tournament.value.image,
    twitterCard: 'summary_large_image',
})

const copySuccess = ref(false)
const publicEventUrl = computed(() => {
    const origin = window?.location?.origin || 'https://archeryhub.id'
    return `${origin}/events/${slug}`
})

const copyPublicUrl = async () => {
    try {
        await navigator.clipboard.writeText(publicEventUrl.value)
        copySuccess.value = true
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const countdown = ref({ days: 0, hours: 0, minutes: 0, isClosed: false })

const updateCountdown = () => {
    if (!tournament.value.registration_deadline) {
        countdown.value.isClosed = true
        return
    }

    const deadline = new Date(tournament.value.registration_deadline)
    const now = new Date()
    const diff = deadline - now

    if (diff <= 0) {
        countdown.value = { days: 0, hours: 0, minutes: 0, isClosed: true }
        return
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    countdown.value = { days, hours, minutes, isClosed: false }
}

let countdownTimer
onMounted(() => {
    updateCountdown()
    countdownTimer = setInterval(updateCountdown, 10000) // Update every 10s
})

onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer)
})

const shareTo = (platform) => {
    const url = encodeURIComponent(publicEventUrl.value)
    const text = encodeURIComponent(tournament.value.name || 'Event Panahan')

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20-%20${url}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
}
</script>
