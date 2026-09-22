<template>
    <div class="space-y-8">
        <!-- Plan Selection -->
        <div class="space-y-5">
            <div class="flex items-center gap-3">
                <div
                    class="size-8 bg-navy border border-navy rounded-lg flex items-center justify-center text-btn-inverse shadow-sm">
                    <Icon icon="ph:trophy-bold" class="text-lg" />
                </div>
                <h2 class="text-lg font-extrabold text-navy">{{ t('subscription.org_plans.title') }}</h2>
            </div>
            <div
                class="flex flex-col lg:flex-row overflow-hidden rounded-[32px] border border-gray-100 shadow-sm bg-white min-h-[500px]">
                <!-- Left Banner -->
                <div
                    class="lg:w-4/12 bg-navy relative flex flex-col justify-center items-center px-8 py-16 text-center overflow-hidden text-white">
                    <div class="relative z-10">
                        <span class="text-primary/60 font-black tracking-[0.3em] text-[10px] mb-4 block">
                            {{ t('subscription.org_plans.recommended_for') }}
                        </span>
                        <h3 class="text-white text-3xl font-black leading-tight mb-4 tracking-tight">{{ t('subscription.plans.elite_title') }}</h3>
                        <div class="h-1.5 w-24 bg-primary mx-auto mb-8 rounded-full"></div>
                        <div class="text-slate-400 text-sm font-medium max-w-[220px] mx-auto leading-relaxed">
                            Solusi lengkap untuk turnamen skala besar dengan peserta tak terbatas dan analitik lanjutan.
                        </div>
                        <div class="mt-12 space-y-4">
                            <div class="flex items-center gap-3 justify-center text-primary/80">
                                <Icon icon="ph:users-three-fill" class="text-xl" />
                                <span class="text-xs font-black tracking-widest text-white/80">{{ t('subscription.org_plans.unlimited_participants') }}</span>
                            </div>
                            <div class="flex items-center gap-3 justify-center text-primary/80">
                                <Icon icon="ph:chart-bar-fill" class="text-xl" />
                                <span class="text-xs font-black tracking-widest text-white/80">{{ t('subscription.org_plans.advanced_analytics') }}</span>
                            </div>
                        </div>
                    </div>
                    <Icon icon="ph:trophy-bold"
                        class="absolute -bottom-10 -right-10 text-[240px] text-white/5 rotate-12" />
                </div>

                <!-- Plans Grid -->
                <div class="lg:w-8/12 p-8 md:p-12 flex flex-col justify-center bg-slate-50/20">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div v-for="plan in plans" :key="plan.id"
                            class="bg-white p-8 rounded-[24px] border-2 transition-all duration-300 flex flex-col relative group h-full shadow-sm"
                            :class="plan.isCurrent ? 'border-primary ring-8 ring-primary/5' : 'border-gray-100 hover:border-primary/20 hover:shadow-md'">

                            <div v-if="plan.isCurrent"
                                class="absolute -top-3 left-6 bg-navy text-btn-inverse text-[10px] font-black px-4 py-1.5 rounded-full capitalize tracking-widest shadow-sm">
                                {{ t('subscription.status.active') }}
                            </div>

                            <div class="mb-6">
                                <div
                                    class="size-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <Icon
                                        :icon="plan.name.toLowerCase().includes('elite') ? 'ph:crown-bold' : 'ph:lightning-bold'"
                                        class="text-xl text-navy" />
                                </div>
                                <h4 class=" text-xs font-black text-gray-400 tracking-[0.2em] mb-2">{{
                                    plan.name }}</h4>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-3xl font-black text-navy">{{ plan.priceLabel }}</span>
                                    <span class="text-[10px] font-bold text-gray-400 tracking-widest ml-1">/
                                        {{ plan.billing }}</span>
                                </div>
                            </div>

                            <ul class="space-y-3 mb-8 flex-1">
                                <li v-for="feat in plan.features" :key="feat"
                                    class="flex items-start gap-2.5 text-[12px]"
                                    :class="plan.isCurrent ? 'text-navy font-bold' : 'text-navy/60 font-medium'">
                                    <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                                    <span>{{ feat }}</span>
                                </li>
                            </ul>

                            <button v-if="plan.isCurrent"
                                class="w-full py-4 text-[10px] font-black bg-slate-100 text-slate-400 rounded-2xl cursor-not-allowed tracking-widest border border-slate-200"
                                disabled>
                                {{ t('subscription.plans.current_package') }}
                            </button>
                            <button v-else @click="$emit('select', plan)"
                                class="w-full py-4 text-[10px] font-black bg-navy text-white rounded-2xl hover:bg-primary hover:text-btn-text transition-all tracking-widest shadow-sm active:scale-95">
                                {{ plan.isUpgrade ? t('subscription.plans.upgrade_now') : t('subscription.plans.choose_package') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Comparison Table -->
        <div class="space-y-6">
                 <div class="flex items-center gap-3">
                <div
                    class="size-8 bg-navy border border-navy rounded-lg flex items-center justify-center text-btn-inverse shadow-sm">
                    <Icon icon="ph:scales-bold" class="text-lg" />
                </div>
                <h2 class="text-lg font-extrabold text-navy">{{ t('subscription.comparison.title') }}</h2>
            </div>
            <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden overflow-x-auto">
                <table class="w-full text-left min-w-[700px]">
                    <thead>
                        <tr class="bg-slate-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 tracking-[0.2em]">
                            <th class="px-8 py-5 w-[40%]">{{ t('subscription.comparison.feature_header') }}</th>
                            <th class="px-8 py-5 text-center w-[20%] border-l border-gray-50 text-navy">
                                <span class="inline-block px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black">
                                    {{ $t('subscription_page.free_title') }}
                                </span>
                            </th>
                            <th class="px-8 py-5 text-center w-[20%] border-l border-gray-50 text-navy">
                                {{ t('subscription.comparison.standard_header') }}
                            </th>
                            <th class="px-8 py-5 text-center w-[20%] border-l border-gray-50 bg-primary/5 text-primary">
                                {{ t('subscription.comparison.elite_header') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="row in comparisonData" :key="row.feature_key"
                            class="group hover:bg-slate-50/30 transition-colors">
                            <td class="px-8 py-4">
                                <div class="flex items-center gap-4">
                                    <Icon :icon="getFeatureIcon(row.feature_key)"
                                        class="text-lg text-gray-400 group-hover:text-primary transition-colors" />
                                    <span class="text-sm font-bold text-navy/80">{{ $t('subscription_page.comparison_features.' + row.feature_key, row.feature_name) }}</span>
                                </div>
                            </td>
                            <!-- Free Column -->
                            <td class="px-8 py-4 text-center border-l border-gray-100">
                                <template v-if="typeof row.free === 'boolean'">
                                    <Icon :icon="row.free ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                        class="text-xl mx-auto"
                                        :class="row.free ? 'text-green-500' : 'text-gray-200'" />
                                </template>
                                <span v-else class="text-xs font-black text-navy/60">{{ translateValue(row.free) }}</span>
                            </td>
                            <!-- Standar Column -->
                            <td class="px-8 py-4 text-center border-l border-gray-100">
                                <template v-if="typeof row.standar === 'boolean'">
                                    <Icon :icon="row.standar ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                        class="text-xl mx-auto"
                                        :class="row.standar ? 'text-green-500' : 'text-gray-200'" />
                                </template>
                                <span v-else class="text-xs font-black text-navy/60">{{ translateValue(row.standar) }}</span>
                            </td>
                            <!-- Elite Column -->
                            <td class="px-8 py-4 text-center border-l border-gray-100 bg-primary/5">
                                <template v-if="typeof row.elite === 'boolean'">
                                    <Icon :icon="row.elite ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                        class="text-xl mx-auto" :class="row.elite ? 'text-primary' : 'text-gray-200'" />
                                </template>
                                <span v-else class="text-xs font-black text-navy">{{ translateValue(row.elite) }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useI18n()
const { t: td } = useDashboardI18n()

defineProps({
    plans: Array,
    comparisonData: Array
})

defineEmits(['select'])

const translateValue = (val) => {
    if (typeof val === 'boolean') return val
    const keys = [
        'unlimited', 'auto_local', 'manual', 'auto_global', 'scoring_elimination',
        'scoring_basic', 'scoring_full', 'cert_basic', 'cert_custom', 'wa_system',
        'wa_custom', 'referee_5', 'referee_1', 'export_standard', 'export_basic',
        'export_elite', 'support_standard', 'support_priority', 'standard_template',
        'custom_domain', 'standard_team', 'mixed_teams', 'standard_allocation',
        'visual_drag_drop', 'yes_obs_widget', 'summary_only', 'full_graphs_xls'
    ]
    if (keys.includes(val)) {
        return t('subscription_page.' + val)
    }
    return val
}

const getFeatureIcon = (key) => {
    const icons = {
        participants_limit: 'ph:users-three-bold',
        online_reg: 'ph:clipboard-text-bold',
        scoring_methods: 'ph:target-bold',
        cert_designer: 'ph:scroll-bold',
        wa_notifications: 'ph:whatsapp-logo-bold',
        referees_limit: 'ph:user-gear-bold',
        offline_sync: 'ph:clock-countdown-bold',
        media_storage: 'ph:hard-drives-bold',
        exports_reports: 'ph:file-csv-bold',
        priority_support: 'ph:headset-bold',
        landing_page_seo: 'ph:globe-bold',
        team_club_mgmt: 'ph:users-bold',
        target_allocation: 'ph:grid-four-bold',
        obs_overlay: 'ph:broadcast-bold',
        direct_payout: 'ph:bank-bold',
        custom_whatsapp: 'ph:chat-teardrop-text-bold',
        digital_cert_sign: 'ph:signature-bold',
        finance_analytics: 'ph:chart-line-up-bold',
        ticket_management: 'ph:ticket-bold',
        mass_print_score: 'ph:printer-bold'
    }
    return icons[key] || 'ph:star-bold'
}
</script>
