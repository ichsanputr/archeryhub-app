<template>
    <div class="space-y-8 pb-12">
        <!-- Header -->
        <div class="bg-navy relative overflow-hidden py-8 rounded-3xl">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-navy/90 z-10"></div>
                <img alt="background pattern"
                    class="w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
                    :src="useImageOrDefault('https://images.unsplash.com/photo-1541535881962-3bb380b08458?auto=format&fit=crop&q=80&w=1200')" />
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
                    <NuxtLink to="/dashboard" class="hover:text-white transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <NuxtLink to="/events" class="hover:text-white transition-colors">Events</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <span class="text-primary font-medium">Registration & Payment</span>
                </div>
                <h1 class="text-white text-3xl font-black tracking-tight">Registration & Payment</h1>
            </div>
        </div>

        <div v-if="isLoading"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
            <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
            <p class="text-gray-500 font-medium">Memuat data registrasi...</p>
        </div>

        <div v-else-if="registrations.length === 0"
            class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Icon icon="ph:clipboard-light" class="text-4xl text-gray-300" />
            </div>
            <h3 class="text-xl font-bold text-navy mb-2">Belum Ada Registrasi</h3>
            <p class="text-gray-500 mb-8 px-6 text-center">Anda belum mendaftar ke event manapun. Mulai daftar ke event
                yang tersedia!</p>
            <NuxtLink to="/events">
                <BaseButton variant="primary" size="lg">Cari Event</BaseButton>
            </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Registration Details -->
                <section
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-2 ring-primary/50">
                    <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <span
                                class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-xs font-bold">1</span>
                            Registration Details
                        </h2>
                        <button v-if="!isEditing" @click="isEditing = true"
                            class="text-sm text-primary font-medium hover:underline">
                            Edit
                        </button>
                    </div>
                    <div class="p-6 md:p-8">
                        <div v-for="(reg, index) in registrations" :key="reg.id"
                            :class="index > 0 ? 'mt-6 pt-6 border-t border-gray-100' : ''">
                            <div class="flex flex-col md:flex-row gap-6 items-start">
                                <div
                                    class="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                    <img v-if="user?.avatar_url" :src="user.avatar_url" alt="Athlete"
                                        class="w-full h-full object-cover" />
                                    <div v-else
                                        class="w-full h-full flex items-center justify-center bg-primary text-navy">
                                        <Icon icon="ph:user-bold" class="text-3xl" />
                                    </div>
                                </div>
                                <div class="flex-grow w-full space-y-6">
                                    <div>
                                        <h3 class="text-xl font-bold text-navy">{{ user?.name || 'Athlete Name' }}</h3>
                                        <p class="text-gray-500 text-sm">{{ user?.club_name || 'Club Name' }}</p>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label
                                                class="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">ID
                                                Number</label>
                                            <select v-if="isEditing" v-model="reg.archer_id"
                                                class="bg-gray-50 border border-gray-300 text-navy text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
                                                <option v-for="archer in archers" :key="archer.id" :value="archer.id">{{
                                                    archer.id_number }}</option>
                                                <option value="">Add New ID...</option>
                                            </select>
                                            <div v-else class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                <span class="text-sm font-semibold text-navy font-mono">{{
                                                    reg.archer_id_number || 'INA-2024-XXXX' }}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                class="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                                            <select v-if="isEditing" v-model="reg.category_id"
                                                class="bg-gray-50 border border-gray-300 text-navy text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
                                                <option v-for="cat in eventCategories" :key="cat.id" :value="cat.id">
                                                    {{ cat.division_name }} - {{ cat.category_name }}
                                                </option>
                                            </select>
                                            <div v-else class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                                <span class="text-sm font-semibold text-navy">{{ reg.category_name ||
                                                    'Category Name' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="isEditing" class="pt-4 mt-2 border-t border-gray-100">
                                        <h4 class="text-sm font-bold text-navy mb-4">Additional Information</h4>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                            <div>
                                                <label
                                                    class="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Jersey
                                                    Size</label>
                                                <select v-model="reg.jersey_size"
                                                    class="bg-gray-50 border border-gray-300 text-navy text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
                                                    <option disabled value="">Select Size</option>
                                                    <option>S</option>
                                                    <option>M</option>
                                                    <option>L</option>
                                                    <option>XL</option>
                                                    <option>XXL</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label
                                                    class="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Emergency
                                                    Contact Name</label>
                                                <input v-model="reg.emergency_contact_name" type="text"
                                                    class="bg-gray-50 border border-gray-300 text-navy text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />
                                            </div>
                                            <div>
                                                <label
                                                    class="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Contact
                                                    Phone Number</label>
                                                <input v-model="reg.emergency_contact_phone" type="text"
                                                    class="bg-gray-50 border border-gray-300 text-navy text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="isEditing" class="flex items-center gap-6 pt-2">
                                        <BaseButton variant="primary" @click="saveRegistration(reg)">Save Changes
                                        </BaseButton>
                                        <button @click="isEditing = false"
                                            class="text-sm font-semibold text-gray-500 hover:text-navy transition-colors cursor-pointer">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Payment Section -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                    :class="isEditing ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''">
                    <div class="p-6 border-b border-gray-100">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <span
                                class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-xs font-bold">2</span>
                            Payment
                        </h2>
                    </div>
                    <div class="p-6 md:p-8 space-y-8">
                        <div>
                            <h3 class="text-sm font-bold text-navy mb-4">Payment Summary</h3>
                            <div class="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div v-for="reg in registrations" :key="reg.id" class="space-y-2">
                                    <div class="flex justify-between items-center text-sm">
                                        <span class="text-gray-600">Entry Fee ({{ reg.category_name }})</span>
                                        <span class="font-bold text-navy">Rp {{ formatPrice(reg.entry_fee || 350000)
                                            }}</span>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center text-sm">
                                    <span class="text-gray-600">Platform Admin Fee</span>
                                    <span class="font-bold text-navy">Rp {{ formatPrice(platformFee) }}</span>
                                </div>
                                <div class="border-t border-gray-200 my-2 pt-2 flex justify-between items-center">
                                    <span class="text-base font-bold text-navy">Total Payment</span>
                                    <span class="text-xl font-black text-primary">Rp {{ formatPrice(totalPayment)
                                        }}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-sm font-bold text-navy mb-4">Select Payment Method</h3>
                            <div class="space-y-4">
                                <div>
                                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                        Virtual Accounts</p>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <label v-for="method in vaMethods" :key="method.value"
                                            class="relative flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                            <input v-model="selectedPaymentMethod"
                                                class="peer h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                                type="radio" :value="method.value" />
                                            <div class="ml-3 flex items-center gap-3 w-full">
                                                <div :class="method.bgColor"
                                                    class="w-10 h-10 rounded text-white flex items-center justify-center font-bold text-xs">
                                                    {{ method.code }}
                                                </div>
                                                <span class="text-sm font-bold text-navy group-hover:text-primary">{{
                                                    method.name }}</span>
                                            </div>
                                            <div
                                                class="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-xl pointer-events-none">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                        E-Wallets & QRIS</p>
                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <label v-for="method in ewalletMethods" :key="method.value"
                                            class="relative flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                                            <input v-model="selectedPaymentMethod"
                                                class="peer h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                                type="radio" :value="method.value" />
                                            <div class="ml-3">
                                                <div class="text-sm font-bold text-navy flex items-center gap-2">
                                                    <Icon :icon="method.icon" :class="method.iconColor" />
                                                    {{ method.name }}
                                                </div>
                                            </div>
                                            <div
                                                class="absolute inset-0 border-2 border-transparent peer-checked:border-primary rounded-xl pointer-events-none">
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="pt-4 border-t border-gray-100 p-6">
                        <BaseButton variant="primary" size="lg" icon="ph:lock" class="w-full text-lg h-14"
                            @click="handlePayment" :disabled="!selectedPaymentMethod || isProcessing">
                            <Icon v-if="isProcessing" icon="ph:spinner-gap-bold" class="animate-spin" />
                            <span v-else>Confirm & Pay Rp {{ formatPrice(totalPayment) }}</span>
                        </BaseButton>
                        <div class="mt-6 flex flex-wrap justify-center items-center gap-6 text-gray-400">
                            <div class="flex items-center gap-2 text-xs font-medium">
                                <Icon icon="ph:shield-check-bold" class="text-lg text-green-500" />
                                Secure Payment
                            </div>
                            <div class="flex items-center gap-2 text-xs font-medium">
                                <Icon icon="ph:lock-bold" class="text-lg text-blue-500" />
                                SSL Encrypted
                            </div>
                            <div class="flex items-center gap-2 text-xs font-medium">
                                <Icon icon="ph:shield-bold" class="text-lg text-gray-500" />
                                Data Protection
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Sidebar -->
            <aside class="space-y-6">
                <div v-for="event in events" :key="event.id"
                    class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 sticky top-24">
                    <div class="relative h-48">
                        <img :alt="event.name" class="w-full h-full object-cover"
                            :src="useImageOrDefault(event.banner_url)" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div class="absolute bottom-4 left-4 right-4">
                            <span
                                class="inline-block px-2 py-1 mb-2 rounded bg-primary text-navy text-[10px] font-bold uppercase tracking-wider">
                                {{ event.type || 'National Series' }}
                            </span>
                            <h3 class="text-white font-bold text-lg leading-tight">{{ event.name }}</h3>
                        </div>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex items-start gap-3">
                            <div
                                class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                <Icon icon="ph:calendar-bold" class="text-sm" />
                            </div>
                            <div>
                                <span class="block text-xs text-gray-500 uppercase font-bold">Date</span>
                                <span class="text-sm font-semibold text-navy">
                                    {{ formatDate(event.start_date) }} - {{ formatDate(event.end_date) }}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-start gap-3">
                            <div
                                class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                <Icon icon="ph:map-pin-bold" class="text-sm" />
                            </div>
                            <div>
                                <span class="block text-xs text-gray-500 uppercase font-bold">Venue</span>
                                <span class="text-sm font-semibold text-navy">{{ event.venue || 'TBA' }}</span>
                            </div>
                        </div>
                        <div class="flex items-start gap-3 pt-4 border-t border-gray-100">
                            <div
                                class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                <Icon icon="ph:headset-bold" class="text-sm" />
                            </div>
                            <div>
                                <span class="block text-xs text-gray-500 uppercase font-bold">Need Help?</span>
                                <a class="text-sm font-semibold text-primary hover:underline" href="#">Contact
                                    Organizer</a>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const { user } = useAuth()
const { get, post, put } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isEditing = ref(false)
const isProcessing = ref(false)
const registrations = ref([])
const archers = ref([])
const eventCategories = ref([])
const events = ref([])
const selectedPaymentMethod = ref(null)

const platformFee = 5000

const vaMethods = [
    { value: 'bca', name: 'BCA Virtual Account', code: 'BCA', bgColor: 'bg-blue-600' },
    { value: 'mandiri', name: 'Mandiri VA', code: 'BMRI', bgColor: 'bg-[#003d79] text-[#fdb913] border border-gray-100' }
]

const ewalletMethods = [
    { value: 'gopay', name: 'GoPay', icon: 'ph:wallet-bold', iconColor: 'text-blue-500' },
    { value: 'ovo', name: 'OVO', icon: 'ph:device-mobile-bold', iconColor: 'text-purple-600' },
    { value: 'qris', name: 'QRIS', icon: 'ph:qr-code-bold', iconColor: 'text-gray-800' }
]

const totalPayment = computed(() => {
    const entryFees = registrations.value.reduce((sum, reg) => sum + (reg.entry_fee || 350000), 0)
    return entryFees + platformFee
})

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)

const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA'
    try {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return dateStr
    }
}

const fetchRegistrations = async () => {
    isLoading.value = true
    try {
        // Fetch pending registrations for the user
        const response = await get('/events/registrations/pending')
        registrations.value = response.data || response.registrations || []

        // Fetch event details for each registration
        if (registrations.value.length > 0) {
            const eventIds = [...new Set(registrations.value.map(r => r.event_id))]
            const eventPromises = eventIds.map(id => get(`/events/${id}`))
            const eventResults = await Promise.all(eventPromises)
            events.value = eventResults.map(r => r.data || r.event || r)
        }

        // Fetch archers for the user
        const archersRes = await get('/archers/my')
        archers.value = archersRes.data || archersRes.archers || []

        // Fetch categories for events
        if (events.value.length > 0) {
            const catPromises = events.value.map(e => get(`/events/${e.id}/categories`))
            const catResults = await Promise.all(catPromises)
            eventCategories.value = catResults.flatMap(r => r.events || r.data?.events || [])
        }
    } catch (error) {
        console.error('Failed to fetch registrations:', error)
        // For demo purposes, create mock data
        registrations.value = []
    } finally {
        isLoading.value = false
    }
}

const saveRegistration = async (reg) => {
    try {
        await put(`/events/${reg.event_id}/registrations/${reg.id}`, {
            archer_id: reg.archer_id,
            category_id: reg.category_id,
            jersey_size: reg.jersey_size,
            emergency_contact_name: reg.emergency_contact_name,
            emergency_contact_phone: reg.emergency_contact_phone
        })
        toast.success('Registrasi berhasil diperbarui')
        isEditing.value = false
        await fetchRegistrations()
    } catch (error) {
        console.error('Failed to save registration:', error)
        toast.error('Gagal menyimpan perubahan')
    }
}

const handlePayment = async () => {
    if (!selectedPaymentMethod.value) {
        toast.error('Pilih metode pembayaran terlebih dahulu')
        return
    }

    isProcessing.value = true
    try {
        // Create payment for all registrations
        const paymentData = {
            registrations: registrations.value.map(r => r.id),
            payment_method: selectedPaymentMethod.value,
            amount: totalPayment.value
        }

        const response = await post('/payment/create', paymentData)

        if (response.payment_url) {
            window.location.href = response.payment_url
        } else {
            toast.success('Pembayaran sedang diproses')
            await fetchRegistrations()
        }
    } catch (error) {
        console.error('Failed to process payment:', error)
        toast.error('Gagal memproses pembayaran')
    } finally {
        isProcessing.value = false
    }
}

onMounted(fetchRegistrations)
</script>
