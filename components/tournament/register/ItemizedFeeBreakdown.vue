<template>
    <div class="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs relative">
        <!-- Top Invoice Color Accent Bar -->
        <div class="h-1.5 w-full bg-gradient-to-r from-navy via-navy/80 to-primary" />

        <!-- Invoice Header -->
        <div class="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/80">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-start gap-3.5">
                    <div class="size-11 rounded-2xl bg-navy text-primary flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                        <Icon icon="ph:receipt-bold" class="text-xl" />
                    </div>
                    <div>
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="text-base sm:text-lg font-black text-navy tracking-tight">
                                {{ isEn ? 'Registration Invoice' : 'Rincian Pendaftaran' }}
                            </h3>
                        </div>
                        <div class="text-xs text-slate-500 font-medium mt-0.5">
                            {{ isEn ? 'Review your items, fees, and invoice breakdown before payment.' : 'Tinjau rincian kategori, biaya, dan tagihan sebelum melakukan pembayaran.' }}
                        </div>
                    </div>
                </div>
                <div v-if="$slots.actions" class="shrink-0 self-start sm:self-center">
                    <slot name="actions" />
                </div>
            </div>
        </div>

        <!-- Invoice Table / Bill Structure -->
        <div class="p-4 sm:p-6 space-y-5">
            <!-- Table Header Row (Desktop) -->
            <div class="hidden sm:grid grid-cols-12 gap-3 px-4 py-2.5 rounded-xl bg-slate-100/75 text-xs sm:text-sm font-bold text-slate-500 border border-slate-200/60">
                <div class="col-span-6">{{ isEn ? 'Item Description' : 'Kategori / Item' }}</div>
                <div class="col-span-2 text-center">{{ isEn ? 'Qty' : 'Jumlah' }}</div>
                <div class="col-span-2 text-right">{{ isEn ? 'Unit Price' : 'Harga Satuan' }}</div>
                <div class="col-span-2 text-right">{{ isEn ? 'Amount' : 'Subtotal' }}</div>
            </div>

            <!-- SECTION 1: INDIVIDUAL CATEGORIES -->
            <div v-if="groupedIndividualCategories.length > 0" class="space-y-3">
                <div class="flex items-center justify-between px-1">
                    <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600">
                        <Icon icon="ph:user-circle-bold" class="text-sm text-navy" />
                        <span>{{ isEn ? 'Individual Category Entries' : 'Kategori Individu' }}</span>
                    </div>
                    <button
                        type="button"
                        @click="toggleAllGroups"
                        class="text-xs sm:text-sm font-bold text-navy cursor-pointer flex items-center gap-1">
                        <span>{{ allExpanded ? (isEn ? 'Collapse all' : 'Tutup semua') : (isEn ? 'Expand all' : 'Buka semua') }}</span>
                    </button>
                </div>

                <div class="space-y-3">
                    <div
                        v-for="catGroup in groupedIndividualCategories"
                        :key="catGroup.category_title"
                        class="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition-all">
                        
                        <!-- Category Summary Header Bar -->
                        <div
                            @click="toggleGroup(catGroup.category_title)"
                            class="p-3.5 sm:px-4 sm:py-3.5 bg-slate-50/70 hover:bg-slate-50/90 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-start sm:items-center cursor-pointer transition-colors select-none">
                            
                            <!-- Col 1: Category Name & Icon -->
                            <div class="col-span-6 flex items-center gap-3 min-w-0 w-full">
                                <div class="size-9 rounded-xl p-1 flex items-center justify-center shrink-0 border border-slate-200/80 bg-white shadow-2xs">
                                    <img
                                        :src="'/' + (getCategoryIcon(catGroup.category_title) || 'category-icon/men-single-recurve.svg')"
                                        :alt="catGroup.category_title"
                                        class="w-full h-full object-contain"
                                        @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/men-single-recurve.svg' }" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="font-bold text-navy text-xs sm:text-sm truncate">
                                        {{ catGroup.category_title }}
                                    </div>
                                    <div class="text-xs text-slate-500 font-medium sm:hidden mt-0.5">
                                        {{ catGroup.items.length }}x <span v-if="catGroup.unitFee > 0">@ {{ formatMoney(catGroup.unitFee, currency) }}</span><span v-else class="text-emerald-600 font-bold">{{ isEn ? 'Free' : 'Gratis' }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Col 2: Qty -->
                            <div class="col-span-2 hidden sm:flex items-center justify-center">
                                <span class="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-700">
                                    {{ catGroup.items.length }} {{ isEn ? (catGroup.items.length === 1 ? 'entry' : 'entries') : 'atlet' }}
                                </span>
                            </div>

                            <!-- Col 3: Unit Price -->
                            <div class="col-span-2 hidden sm:block text-right font-medium text-xs sm:text-sm text-slate-600 tabular-nums">
                                <template v-if="catGroup.unitFee > 0">
                                    {{ formatMoney(catGroup.unitFee, currency) }}
                                </template>
                                <span v-else class="text-slate-400 font-normal">-</span>
                            </div>

                            <!-- Col 4: Subtotal + Caret -->
                            <div class="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5 pt-1 sm:pt-0 border-t border-slate-200/60 sm:border-0">
                                <span class="text-xs text-slate-400 font-medium sm:hidden">{{ isEn ? 'Subtotal:' : 'Subtotal:' }}</span>
                                <div class="flex items-center gap-2">
                                    <span v-if="catGroup.subtotal > 0" class="font-black text-xs sm:text-sm text-navy tabular-nums">
                                        {{ formatMoney(catGroup.subtotal, currency) }}
                                    </span>
                                    <span v-else class="font-bold text-xs sm:text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                        {{ isEn ? 'Free' : 'Gratis' }}
                                    </span>
                                    <div
                                        class="size-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isGroupExpanded(catGroup.category_title) }">
                                        <Icon icon="ph:caret-down-bold" class="text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Expanded Archers Itemized List -->
                        <div v-if="isGroupExpanded(catGroup.category_title)" class="divide-y divide-slate-100 bg-white px-3 sm:px-4 py-1.5 border-t border-slate-100">
                            <div
                                v-for="(ath, athIdx) in catGroup.items"
                                :key="ath.id || athIdx"
                                class="py-2.5 px-2 flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50/50 rounded-xl transition-colors">
                                <div class="flex items-center gap-3 min-w-0">
                                    <img
                                        :src="useImageOrDefault(ath.avatar_url, ath.person_name || ath.title)"
                                        :alt="ath.person_name || ath.title"
                                        class="size-8 rounded-full object-cover border border-slate-200 shrink-0" />
                                    <div class="min-w-0">
                                        <div class="font-bold text-navy truncate">
                                            {{ ath.person_name || ath.title }}
                                        </div>
                                        <div class="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                                            <Icon icon="ph:shield-bold" class="text-slate-300 text-xs" />
                                            <span>{{ ath.club_name || ath.subtitle || 'Independent' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="text-right shrink-0">
                                    <span v-if="Number(ath.amount) > 0" class="font-semibold text-slate-700 tabular-nums text-xs sm:text-sm">
                                        {{ formatMoney(ath.amount, currency) }}
                                    </span>
                                    <span v-else class="text-xs text-slate-400 font-medium">
                                        -
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION 2: TEAM CATEGORIES -->
            <div v-if="teamItems.length > 0" class="space-y-3">
                <div class="flex items-center justify-between px-1 pt-1">
                    <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600">
                        <Icon icon="ph:users-three-bold" class="text-sm text-navy" />
                        <span>{{ isEn ? 'Team / Mixed Team Categories' : 'Kategori Beregu / Campuran' }}</span>
                    </div>
                    <button
                        type="button"
                        @click="toggleAllTeamGroups"
                        class="text-xs sm:text-sm font-bold text-navy cursor-pointer flex items-center gap-1">
                        <span>{{ allTeamsExpanded ? (isEn ? 'Collapse all' : 'Tutup semua') : (isEn ? 'Expand all' : 'Buka semua') }}</span>
                    </button>
                </div>

                <div class="space-y-2.5">
                    <div
                        v-for="(item, idx) in teamItems"
                        :key="item.id || idx"
                        class="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-2xs transition-all">
                        
                        <!-- Team Summary Header Bar (Clickable Accordion) -->
                        <div
                            @click="toggleGroup(item.id || item.category_title || String(idx))"
                            class="p-3.5 sm:px-4 sm:py-3.5 bg-slate-50/70 hover:bg-slate-50/90 flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-start sm:items-center cursor-pointer transition-colors select-none">
                            
                            <!-- Col 1: Team Info -->
                            <div class="col-span-6 flex items-center gap-3 min-w-0 w-full">
                                <div class="size-9 rounded-xl p-1 flex items-center justify-center shrink-0 border border-slate-200/80 bg-white shadow-2xs">
                                    <img
                                        :src="'/' + (getCategoryIcon(item.category_title || item.title) || 'category-icon/mix-team.svg')"
                                        :alt="item.category_title || item.title"
                                        class="w-full h-full object-contain"
                                        @error="(e) => { e.target.onerror = null; e.target.src = '/category-icon/mix-team.svg' }" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="font-bold text-navy text-xs sm:text-sm truncate">
                                        {{ item.person_name || item.title }}
                                    </div>
                                    <div v-if="item.subtitle || item.club_name" class="text-xs sm:text-sm text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                                        <span v-if="item.subtitle">{{ item.subtitle }}</span>
                                        <span v-if="item.subtitle && item.club_name" class="text-slate-300">•</span>
                                        <span v-if="item.club_name">{{ item.club_name }}</span>
                                    </div>
                                    <div class="text-xs text-slate-500 font-medium sm:hidden mt-0.5">
                                        {{ item.qty || 1 }}x <span v-if="Number(item.unit_price || item.amount) > 0">@ {{ formatMoney(item.unit_price || item.amount, currency) }}</span><span v-else class="text-emerald-600 font-bold">{{ isEn ? 'Free' : 'Gratis' }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Col 2: Qty -->
                            <div class="col-span-2 hidden sm:flex items-center justify-center">
                                <span class="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-xs sm:text-sm font-bold text-slate-700">
                                    {{ item.qty || 1 }} {{ isEn ? 'slot team' : 'slot tim' }}
                                </span>
                            </div>

                            <!-- Col 3: Unit Price -->
                            <div class="col-span-2 hidden sm:block text-right font-medium text-xs sm:text-sm text-slate-600 tabular-nums">
                                <template v-if="Number(item.unit_price || item.amount) > 0">
                                    {{ formatMoney(item.unit_price || item.amount, currency) }}
                                </template>
                                <span v-else class="text-slate-400 font-normal">-</span>
                            </div>

                            <!-- Col 4: Amount + Caret -->
                            <div class="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5 pt-1 sm:pt-0 border-t border-slate-200/60 sm:border-0">
                                <span class="text-xs text-slate-400 font-medium sm:hidden">{{ isEn ? 'Subtotal:' : 'Subtotal:' }}</span>
                                <div class="flex items-center gap-2">
                                    <div v-if="Number(item.amount) > 0" class="font-black text-xs sm:text-sm text-navy tabular-nums">
                                        {{ formatMoney(item.amount, currency) }}
                                    </div>
                                    <span v-else class="font-bold text-xs sm:text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                        {{ isEn ? 'Free' : 'Gratis' }}
                                    </span>
                                    <div
                                        class="size-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isGroupExpanded(item.id || item.category_title || String(idx)) }">
                                        <Icon icon="ph:caret-down-bold" class="text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Expanded Team Section -->
                        <div v-if="isGroupExpanded(item.id || item.category_title || String(idx))" class="bg-white px-3 sm:px-4 py-2.5 border-t border-slate-100">
                            <!-- Team with Members -->
                            <div v-if="item.members && item.members.length > 0" class="divide-y divide-slate-100">
                                <div
                                    v-for="(member, mIdx) in item.members"
                                    :key="mIdx"
                                    class="py-2.5 px-2 flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-50/50 rounded-xl transition-colors">
                                    <div class="flex items-center gap-3 min-w-0">
                                        <img
                                            :src="useImageOrDefault(member.avatar_url, member.full_name)"
                                            :alt="member.full_name"
                                            class="size-8 rounded-full object-cover border border-slate-200 shrink-0" />
                                        <div class="min-w-0">
                                            <div class="font-bold text-navy truncate">
                                                {{ member.full_name }}
                                            </div>
                                            <div class="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                                                <Icon icon="ph:shield-bold" class="text-slate-300 text-xs" />
                                                <span>{{ member.club_name || 'Independent' }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="text-right shrink-0">
                                        <span class="text-xs text-slate-500 font-medium">
                                            {{ member.role || (mIdx === 0 ? (isEn ? 'Registrant (You)' : 'Pendaftar (Anda)') : (isEn ? `Archer ${mIdx + 1}` : `Atlet ${mIdx + 1}`)) }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Team Quota Slot / Delegation without Members yet -->
                            <div v-else class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs sm:text-sm">
                                <div class="flex items-center justify-between">
                                    <div class="font-bold text-navy flex items-center gap-1.5">
                                        <Icon icon="ph:info-bold" class="text-slate-400 text-sm" />
                                        <span>{{ isEn ? 'Team Slot Reservation Details' : 'Rincian Reservasi Slot Tim' }}</span>
                                    </div>
                                    <span class="px-2 py-0.5 rounded-md bg-navy/10 text-navy font-bold text-xs">
                                        {{ item.qty || 1 }} {{ isEn ? 'Team Slot(s)' : 'Slot Tim' }}
                                    </span>
                                </div>
                                <div class="text-slate-500 leading-relaxed">
                                    {{ item.note || (isEn ? 'Official team quota. Roster composition is submitted directly at Technical Meeting.' : 'Kuota tim resmi turnamen. Susunan atlet diserahkan saat Technical Meeting.') }}
                                </div>
                                <div v-if="item.club_name" class="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                                    <span>{{ isEn ? 'Delegation / Club:' : 'Kontingen / Klub:' }}</span>
                                    <span class="font-bold text-slate-700">{{ item.club_name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fallback Empty State -->
            <div v-if="groupedIndividualCategories.length === 0 && teamItems.length === 0" class="py-10 text-center text-slate-400">
                <Icon icon="ph:receipt-slash-bold" class="text-4xl mx-auto mb-2 text-slate-300" />
                <div class="text-sm sm:text-base font-bold text-slate-600">{{ isEn ? 'No categories selected yet' : 'Belum ada kategori yang dipilih' }}</div>
                <div class="text-xs sm:text-sm text-slate-400 mt-1">{{ isEn ? 'Please return to Step 2 and choose your competition categories.' : 'Silakan kembali ke Langkah 2 untuk memilih kategori lomba.' }}</div>
            </div>

            <!-- Invoice Calculation Summary Section -->
            <div class="pt-2 border-t border-slate-100">
                <!-- Grand Total Card -->
                <div class="p-4 sm:p-5 rounded-2xl bg-navy text-white flex items-center justify-between gap-4 shadow-sm">
                    <div>
                        <div class="text-xs sm:text-sm font-bold text-slate-300">
                            {{ isEn ? 'Total Amount' : 'Total Pembayaran' }}
                        </div>
                        <div class="text-xs text-slate-300/80 mt-0.5">
                            {{ totalIndividualCount + teamItems.length }} {{ isEn ? 'Total Entries' : 'Total Pendaftaran' }}
                        </div>
                    </div>

                    <div class="text-right">
                        <div v-if="totalAmount > 0" class="text-2xl sm:text-3xl font-black text-primary tabular-nums tracking-tight">
                            {{ formatMoney(totalAmount, currency) }}
                        </div>
                        <div v-else class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-sm sm:text-base font-black">
                            <Icon icon="ph:check-circle-bold" class="text-base" />
                            <span>{{ isEn ? 'Free (Rp 0)' : 'Gratis (Rp 0)' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { formatMoney } from '~/composables/useCurrency'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { useImageOrDefault } from '~/composables/useImageHelper'

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    currency: {
        type: String,
        default: 'IDR'
    }
})

const { locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')

// Accordion expansion state per category - collapsed by default
const expandedGroups = ref({})

const isGroupExpanded = (title) => {
    if (expandedGroups.value[title] === undefined) {
        return false
    }
    return Boolean(expandedGroups.value[title])
}

const toggleGroup = (title) => {
    const currentState = isGroupExpanded(title)
    expandedGroups.value[title] = !currentState
}

const allExpanded = computed(() => {
    if (groupedIndividualCategories.value.length === 0) return true
    return groupedIndividualCategories.value.every(g => isGroupExpanded(g.category_title))
})

const toggleAllGroups = () => {
    const targetState = !allExpanded.value
    for (const g of groupedIndividualCategories.value) {
        expandedGroups.value[g.category_title] = targetState
    }
}

const allTeamsExpanded = computed(() => {
    if (teamItems.value.length === 0) return true
    return teamItems.value.every((item, idx) => isGroupExpanded(item.id || item.category_title || String(idx)))
})

const toggleAllTeamGroups = () => {
    const targetState = !allTeamsExpanded.value
    for (let idx = 0; idx < teamItems.value.length; idx++) {
        const item = teamItems.value[idx]
        const key = item.id || item.category_title || String(idx)
        expandedGroups.value[key] = targetState
    }
}

const individualItems = computed(() => {
    return props.items.filter(i => 
        i.group === 'individual' || 
        i.type === 'captain_individual' || 
        i.type === 'delegation_athlete' ||
        i.type === 'delegation_individual' ||
        i.type === 'teammate_covered'
    )
})

const teamItems = computed(() => {
    return props.items.filter(i => 
        (i.group === 'team' || i.type === 'team_fee' || i.type === 'delegation_team') &&
        i.type !== 'teammate_covered' &&
        i.type !== 'teammate_free'
    )
})

// Group individual items by category title
const groupedIndividualCategories = computed(() => {
    const map = new Map()

    for (const item of individualItems.value) {
        const title = item.category_title || item.title || 'Individual Category'
        if (!map.has(title)) {
            map.set(title, {
                category_title: title,
                items: [],
                unitFee: Number(item.amount) || 0,
                subtotal: 0
            })
        }
        const group = map.get(title)
        group.items.push(item)
        group.subtotal += Number(item.amount) || 0
        if (Number(item.amount) > 0) {
            group.unitFee = Number(item.amount)
        }
    }

    return Array.from(map.values())
})

const totalIndividualCount = computed(() => {
    return individualItems.value.length
})

const subtotalIndividual = computed(() => {
    return individualItems.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})

const subtotalTeam = computed(() => {
    return teamItems.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})

const totalAmount = computed(() => {
    return props.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})
</script>
