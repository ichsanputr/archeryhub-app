<script setup>
definePageMeta({
    layout: 'dashboard'
})
import { Icon } from '@iconify/vue'
import { computed, ref, watch, onBeforeMount } from 'vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const { user } = useAuth()
const payment = usePayment()

const planId = computed(() => route.query.plan_id)
const planName = computed(() => route.query.plan_name || t('subscription_payment_page.default_plan_name'))
const planPrice = computed(() => route.query.plan_price || '0')

// Redirect back if no plan selected (client-side only for safety)
onBeforeMount(() => {
    if (!planId.value) {
        router.push('/dashboard/organization/subscription')
    }
})

const { data: channelsRes, pending: loadingChannels, error: fetchError } = useFetch(`${apiBaseUrl}/payment/channels`, {
    key: 'payment-channels',
    credentials: 'include',
    lazy: true,
    server: false // Only fetch on client to avoid SSR issues with auth cookies
})

const channels = computed(() => {
    const list = [
        {
            code: 'paddle',
            name: t('subscription_payment_page.paddle_name'),
            icon_url: 'https://cdn.paddle.com/paddle/assets/images/logos/paddle-logo-dark.svg',
            feeLabel: t('subscription_payment_page.fee_integrated'),
            group: t('subscription_payment_page.paddle_group'),
            active: true
        }
    ]
    if (!channelsRes.value) return list
    const data = channelsRes.value.data || channelsRes.value || []
    if (Array.isArray(data)) {
        return [...list, ...data.filter((c) => c.active)]
    }
    return list
})

const groupedChannels = computed(() => {
    const groups = {}
    channels.value.forEach((channel) => {
        if (!groups[channel.group]) {
            groups[channel.group] = []
        }
        groups[channel.group].push({
            ...channel,
            feeLabel: channel.feeLabel || (channel.fee_customer?.flat === 0
                ? `${channel.fee_customer?.percent}%`
                : `Rp ${(channel.fee_customer?.flat || 0).toLocaleString('id-ID')}`)
        })
    })
    return groups
})

const selectedChannel = ref(null)
const selectedMonths = ref(1)
const isProcessing = ref(false)
const errorMessage = ref('')
const instructions = ref([])
const loadingInstructions = ref(false)

watch(selectedChannel, async (code) => {
    if (!code || code === 'paddle') { instructions.value = []; return }
    loadingInstructions.value = true
    instructions.value = await payment.getInstruction(code)
    loadingInstructions.value = false
})

const totalAmount = computed(() => {
    const price = parseInt(planPrice.value?.toString() || '0') || 0
    return price * selectedMonths.value
})

const handlePayment = async () => {
    if (!selectedChannel.value) {
        errorMessage.value = t('subscription_payment_page.select_method_error')
        return
    }

    isProcessing.value = true
    errorMessage.value = ''

    if (selectedChannel.value === 'paddle') {
        try {
            // 1. Initiate transaction on Go Backend which returns secure hosted checkout_url
            const res = await $fetch(`${apiBaseUrl}/payment/paddle/initiate`, {
                method: 'POST',
                body: {
                    plan_id: parseInt(planId.value),
                    months: selectedMonths.value
                },
                credentials: 'include'
            })

            if (!res || !res.checkout_url) {
                throw new Error(t('subscription_payment_page.paddle_link_error'))
            }

            // 2. Redirect user directly to Paddle secure hosted checkout page (adblocker immune!)
            if (res.checkout_url.includes('txn_mock_')) {
                alert(t('subscription_payment_page.paddle_success_simulation'))
                await $fetch(`${apiBaseUrl}/payment/simulate-success/${res.reference}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                router.push('/dashboard/organization/subscription?status=success')
            } else {
                if (window.Paddle && res.tripay_reference) {
                    window.Paddle.Checkout.open({
                        transactionId: res.tripay_reference,
                        eventCallback: (data) => {
                            if (data.name === 'checkout.completed') {
                                router.push('/dashboard/organization/subscription?status=success')
                            }
                        }
                    })
                } else {
                    window.location.href = res.checkout_url
                }
            }

        } catch (err) {
            console.error('Paddle payment initiation failed:', err)
            errorMessage.value = err.data?.error || err.message || t('subscription_payment_page.paddle_process_error')
        } finally {
            isProcessing.value = false
        }
        return
    }

    try {
        const res = await $fetch(`${apiBaseUrl}/payment/create`, {
            method: 'POST',
            body: {
                type: 'subscription',
                plan_id: parseInt(planId.value),
                method: selectedChannel.value,
                months: selectedMonths.value,
                event_id: route.query.event_id || ""
            },
            credentials: 'include'
        })

        if (res.checkout_url) {
            window.location.href = res.checkout_url
        } else {
            errorMessage.value = t('subscription_payment_page.generic_payment_error')
        }
    } catch (err) {
        console.error('Payment failed:', err)
        errorMessage.value = err.data?.error || t('subscription_payment_page.generic_payment_error')
    } finally {
        isProcessing.value = false
    }
}

useHead({
    title: t('subscription_payment_page.page_title')
})
</script>

<template>
    <div class="space-y-8 pb-20">
        <!-- Header Section -->
        <div>
            <nuxt-link to="/dashboard/organization/subscription"
                class="inline-flex items-center gap-2 text-navy hover:text-primary transition-all font-bold text-sm mb-6 group">
                <Icon icon="ph:arrow-left-bold" />
                {{ t('subscription_payment_page.back') }}
            </nuxt-link>

            <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
                <!-- Theme Motif Pattern -->
                <div class="absolute inset-0"
                    style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
                </div>
                <!-- Decorative Background Elements (Glows) -->
                <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
                <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

                <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:credit-card-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('subscription_payment_page.title') }}</h1>
                            <div class="text-slate-300 text-xs sm:text-sm font-medium mt-1">{{ t('subscription_payment_page.subtitle') }}</div>
                        </div>
                    </div>

                    <div
                        class="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10 min-w-[240px]">
                        <div class="flex items-center justify-between gap-4 mb-3">
                            <div class="flex items-center gap-2.5">
                                <Icon icon="ph:package-fill" class="text-primary text-xl" />
                                <span class="text-white font-black text-lg">{{ planName }}</span>
                            </div>
                        </div>
                        <div class="pt-3 border-t border-white/10 flex justify-between items-center">
                            <span class="text-slate-400 text-[10px] font-black tracking-widest">{{ t('subscription_payment_page.total_pay') }}</span>
                            <span class="text-primary font-black text-xl">Rp {{ totalAmount.toLocaleString('id-ID')
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="relative z-20">
            <!-- Duration Selection -->
            <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mb-8">
                <div class="flex items-center gap-4 mb-6">
                    <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon icon="ph:calendar-bold" class="text-navy text-xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-black text-navy leading-none">{{ t('subscription_payment_page.choose_duration') }}</h3>
                        <div class=" text-xs font-bold text-gray-400 tracking-widest mt-2">{{ t('subscription_payment_page.duration_desc') }}</div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <button v-for="m in [1, 3, 6, 12]" :key="m" @click="selectedMonths = m"
                        class="px-6 py-3 rounded-2xl border-2 font-black text-xs tracking-widest transition-all"
                        :class="selectedMonths === m ? 'border-primary bg-primary/5 text-navy ring-4 ring-primary/5' : 'border-gray-100 text-gray-400 hover:border-gray-200 hover:text-navy'">
                        {{ m === 12 ? t('subscription_payment_page.year') : t('subscription_payment_page.months', { n: m }) }}
                        <span v-if="m >= 6"
                            class="ml-2 px-2 py-0.5 bg-green-500 text-white text-[9px] rounded-full">{{ t('subscription_payment_page.save') }}</span>
                    </button>

                    <div class="flex items-center gap-3 ml-4">
                        <span class="text-[10px] font-black text-gray-400 tracking-widest">{{ t('subscription_payment_page.custom') }}</span>
                        <div class="flex items-center bg-slate-50 rounded-xl border border-gray-100 p-1">
                            <button @click="selectedMonths > 1 && selectedMonths--"
                                class="size-8 flex items-center justify-center text-navy hover:bg-white rounded-lg transition-colors">
                                <Icon icon="ph:minus-bold" />
                            </button>
                            <input type="number" v-model="selectedMonths" min="1" max="12"
                                class="w-12 bg-transparent text-center font-black text-sm text-navy focus:outline-none" />
                            <button @click="selectedMonths < 12 && selectedMonths++"
                                class="size-8 flex items-center justify-center text-navy hover:bg-white rounded-lg transition-colors">
                                <Icon icon="ph:plus-bold" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Payment Methods -->
                <div class="lg:col-span-2 space-y-8">
                    <div v-if="loadingChannels" class="space-y-4">
                        <div v-for="i in 3" :key="i" class="h-40 bg-white rounded-3xl animate-pulse"></div>
                    </div>

                    <div v-else v-for="(methods, group) in groupedChannels" :key="group" class="space-y-4">
                        <div class="flex items-center gap-3 ml-2">
                            <div class="size-2 bg-primary rounded-full"></div>
                            <h3 class="text-sm font-black text-navy tracking-[0.2em]">{{ group }}</h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="method in methods" :key="method.code" @click="selectedChannel = method.code"
                                class="bg-white p-5 rounded-[24px] border-2 cursor-pointer transition-all flex items-center justify-between group shadow-sm hover:shadow-md h-24"
                                :class="selectedChannel === method.code ? 'border-primary ring-4 ring-primary/5 bg-primary/5' : 'border-white hover:border-primary/20'">

                                <div class="flex items-center gap-4">
                                    <div
                                        class="size-14 bg-slate-50 rounded-2xl p-2 flex items-center justify-center group-hover:bg-white transition-colors border border-gray-100 shadow-sm overflow-hidden">
                                        <img :src="method.icon_url" :alt="method.name"
                                            class="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 class="text-sm font-black text-navy">{{ method.name }}</h4>
                                        <p class="text-[10px] font-bold text-gray-400 tracking-widest mt-1">
                                            {{ t('subscription_payment_page.fee') }} {{ method.feeLabel }}</p>
                                    </div>
                                </div>

                                <div class="size-6 rounded-full border-2 flex items-center justify-center transition-all"
                                    :class="selectedChannel === method.code ? 'border-primary bg-primary' : 'border-gray-100'">
                                    <Icon v-if="selectedChannel === method.code" icon="ph:check-bold"
                                        class="text-white text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="lg:col-span-1">
                    <div class="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm sticky top-24">
                        <h3 class="text-lg font-black text-navy mb-6">{{ t('subscription_payment_page.order_summary') }}</h3>

                        <div class="space-y-4 mb-8">
                            <div class="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                                <span class="text-gray-500 text-sm font-medium">{{ t('subscription_payment_page.plan') }}</span>
                                <span class="text-navy font-bold text-sm">{{ planName }}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                                <span class="text-gray-500 text-sm font-medium">{{ t('subscription_payment_page.duration') }}</span>
                                <span class="text-navy font-bold text-sm">{{ t('subscription_payment_page.months', { n: selectedMonths }) }}</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-dashed border-gray-100">
                                <span class="text-gray-500 text-sm font-medium">{{ t('subscription_payment_page.subtotal') }}</span>
                                <span class="text-navy font-bold text-sm">Rp {{ (parseInt(planPrice?.toString() || '0')
                                    * selectedMonths).toLocaleString('id-ID') }}</span>
                            </div>
                            <div v-if="selectedChannel" class="flex justify-between items-center py-2">
                                <span class="text-gray-500 text-sm font-medium">{{ t('subscription_payment_page.method') }}</span>
                                <span class="text-navy font-bold text-sm">{{channels.find(c => c.code ===
                                    selectedChannel)?.name}}</span>
                            </div>
                        </div>

                        <div v-if="errorMessage || fetchError"
                            class="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl  text-xs font-bold flex items-center gap-3 border border-red-100">
                            <Icon icon="ph:warning-circle-fill" class="text-lg shrink-0" />
                            {{ errorMessage || 'Gagal mengambil metode pembayaran. Silakan coba lagi.' }}
                        </div>

                        <button @click="handlePayment" :disabled="isProcessing || !selectedChannel"
                            class="w-full h-12 mt-2 bg-navy text-white rounded-xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 shadow-sm hover:opacity-90 active:scale-95">
                            <Icon v-if="isProcessing" icon="ph:spinner-gap-bold" class="animate-spin text-xl" />
                            <template v-else>
                                {{ t('subscription_payment_page.pay_now') }}
                                <Icon icon="ph:arrow-right-bold" />
                            </template>
                        </button>

                        <p class="text-[10px] text-center text-gray-400 font-bold tracking-widest mt-6">
                            {{ t('subscription_payment_page.secure_transaction', { gateway: selectedChannel === 'paddle' ? 'Paddle' : 'Tripay' }) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
