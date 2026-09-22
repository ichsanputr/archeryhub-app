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
                                Registration Invoice
                            </h3>
                        </div>
                        <div class="text-xs text-slate-500 font-medium mt-1">
                            Official itemized breakdown of competition categories & participants
                        </div>
                    </div>
                </div>

                <!-- Invoice Badges Summary -->
                <div class="flex items-center gap-2 self-start sm:self-center flex-wrap">
                    <div v-if="totalIndividualCount > 0" class="px-3 py-1.5 bg-white text-navy rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 text-xs font-bold">
                        <Icon icon="ph:user-bold" class="text-primary-hover text-sm" />
                        <span>{{ totalIndividualCount }} {{ totalIndividualCount === 1 ? 'Archer' : 'Archers' }}</span>
                    </div>
                    <div v-if="teamItems.length > 0" class="px-3 py-1.5 bg-white text-navy rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 text-xs font-bold">
                        <Icon icon="ph:users-three-bold" class="text-primary-hover text-sm" />
                        <span>{{ teamItems.length }} {{ teamItems.length === 1 ? 'Team' : 'Teams' }}</span>
                    </div>
                    <div class="px-2.5 py-1.5 bg-navy/5 text-navy rounded-xl text-xs font-mono font-bold tracking-wider uppercase">
                        {{ currency }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoice Table / Bill Structure -->
        <div class="p-4 sm:p-6 space-y-5">
            <!-- Table Header Row (Desktop) -->
            <div class="hidden sm:grid grid-cols-12 gap-3 px-4 py-2.5 rounded-xl bg-slate-100/75 text-[11px] font-bold text-slate-500 border border-slate-200/60">
                <div class="col-span-6">Item Description</div>
                <div class="col-span-2 text-center">Qty</div>
                <div class="col-span-2 text-right">Unit Price</div>
                <div class="col-span-2 text-right">Amount</div>
            </div>

            <!-- SECTION 1: INDIVIDUAL CATEGORIES -->
            <div v-if="groupedIndividualCategories.length > 0" class="space-y-3">
                <div class="flex items-center justify-between px-1">
                    <div class="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Icon icon="ph:user-circle-bold" class="text-sm text-navy" />
                        <span>Individual Category Entries</span>
                    </div>
                    <button
                        type="button"
                        @click="toggleAllGroups"
                        class="text-[11px] font-bold text-navy hover:underline cursor-pointer flex items-center gap-1">
                        <span>{{ allExpanded ? 'Collapse all' : 'Expand all' }}</span>
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
                                <div class="size-8 rounded-xl bg-navy text-primary flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                                    <Icon icon="ph:target-bold" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="font-bold text-navy text-xs sm:text-sm truncate">
                                        {{ catGroup.category_title }}
                                    </div>
                                    <div class="text-[11px] text-slate-500 font-medium sm:hidden mt-0.5">
                                        {{ catGroup.items.length }}x @ {{ formatPrice(catGroup.unitFee) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Col 2: Qty -->
                            <div class="col-span-2 hidden sm:flex items-center justify-center">
                                <span class="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700">
                                    {{ catGroup.items.length }} {{ catGroup.items.length === 1 ? 'entry' : 'entries' }}
                                </span>
                            </div>

                            <!-- Col 3: Unit Price -->
                            <div class="col-span-2 hidden sm:block text-right font-medium text-xs text-slate-600 tabular-nums">
                                {{ formatPrice(catGroup.unitFee) }}
                            </div>

                            <!-- Col 4: Subtotal + Caret -->
                            <div class="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2.5 pt-1 sm:pt-0 border-t border-slate-200/60 sm:border-0">
                                <span class="text-xs text-slate-400 font-medium sm:hidden">Subtotal:</span>
                                <div class="flex items-center gap-2">
                                    <span class="font-black text-xs sm:text-sm text-navy tabular-nums">
                                        {{ formatPrice(catGroup.subtotal) }}
                                    </span>
                                    <div
                                        class="size-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 transition-transform duration-200 shrink-0"
                                        :class="{ 'rotate-180': isGroupExpanded(catGroup.category_title) }">
                                        <Icon icon="ph:caret-down-bold" class="text-[10px]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Expanded Archers Itemized List -->
                        <div v-if="isGroupExpanded(catGroup.category_title)" class="divide-y divide-slate-100 bg-white px-3 sm:px-4 py-1.5 border-t border-slate-100">
                            <div
                                v-for="(ath, athIdx) in catGroup.items"
                                :key="ath.id || athIdx"
                                class="py-2.5 px-2 flex items-center justify-between gap-3 text-xs hover:bg-slate-50/50 rounded-xl transition-colors">
                                <div class="flex items-center gap-3 min-w-0">
                                    <div class="size-6 rounded-full bg-slate-100 text-slate-600 font-mono flex items-center justify-center font-bold text-[11px] shrink-0">
                                        {{ athIdx + 1 }}
                                    </div>
                                    <div class="min-w-0">
                                        <div class="font-bold text-navy truncate flex items-center gap-2 flex-wrap">
                                            <span>{{ ath.person_name || ath.title }}</span>
                                            <span v-if="ath.role_label" class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy/5 text-navy border border-navy/10 shrink-0">
                                                {{ ath.role_label }}
                                            </span>
                                            <span v-if="ath.status_badge" class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                                                {{ ath.status_badge }}
                                            </span>
                                        </div>
                                        <div class="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1.5">
                                            <Icon icon="ph:shield-bold" class="text-slate-300 text-xs" />
                                            <span>{{ ath.club_name || ath.subtitle || 'Independent' }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="text-right shrink-0">
                                    <span class="font-semibold text-slate-700 tabular-nums">
                                        {{ formatPrice(ath.amount) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION 2: TEAM CATEGORIES -->
            <div v-if="teamItems.length > 0" class="space-y-3">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-600 px-1 pt-1">
                    <Icon icon="ph:users-three-bold" class="text-sm text-navy" />
                    <span>Team / Mixed Team Categories</span>
                </div>

                <div class="space-y-2.5">
                    <div
                        v-for="(item, idx) in teamItems"
                        :key="item.id || idx"
                        class="p-4 rounded-2xl border border-slate-200/90 bg-white flex flex-col sm:grid sm:grid-cols-12 gap-3 items-start sm:items-center shadow-2xs">
                        
                        <!-- Col 1: Team Info -->
                        <div class="col-span-6 flex items-center gap-3 min-w-0 w-full">
                            <div class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                                <Icon icon="ph:users-three-bold" class="text-base" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="font-bold text-navy text-xs sm:text-sm truncate flex items-center gap-2">
                                    <span>{{ item.person_name || item.title }}</span>
                                    <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy/5 text-navy border border-navy/10 shrink-0">
                                        {{ item.status_badge || 'Team Quota' }}
                                    </span>
                                </div>
                                <div class="text-[11px] text-slate-500 font-medium truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                                    <span>{{ item.category_title || item.subtitle }}</span>
                                    <span v-if="item.club_name" class="text-slate-300">•</span>
                                    <span v-if="item.club_name">{{ item.club_name }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Col 2: Qty -->
                        <div class="col-span-2 hidden sm:flex items-center justify-center">
                            <span class="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-700">
                                1 team
                            </span>
                        </div>

                        <!-- Col 3: Unit Price -->
                        <div class="col-span-2 hidden sm:block text-right font-medium text-xs text-slate-600 tabular-nums">
                            {{ formatPrice(item.amount) }}
                        </div>

                        <!-- Col 4: Amount -->
                        <div class="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                            <span class="text-xs text-slate-400 font-medium sm:hidden">Subtotal:</span>
                            <div class="font-black text-xs sm:text-sm text-navy tabular-nums">
                                {{ formatPrice(item.amount) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fallback Empty State -->
            <div v-if="groupedIndividualCategories.length === 0 && teamItems.length === 0" class="py-10 text-center text-slate-400">
                <Icon icon="ph:receipt-slash-bold" class="text-4xl mx-auto mb-2 text-slate-300" />
                <div class="text-sm font-bold text-slate-600">No categories selected yet</div>
                <div class="text-xs text-slate-400 mt-1">Please return to Step 2 and choose your competition categories.</div>
            </div>

            <!-- Invoice Calculation Summary Section (Receipt Perforated Style) -->
            <div class="pt-4 border-t-2 border-dashed border-slate-200 space-y-2.5">
                <!-- Subtotal Breakdown Lines -->
                <div v-if="totalIndividualCount > 0" class="flex items-center justify-between text-xs text-slate-600">
                    <span class="flex items-center gap-1.5">
                        <Icon icon="ph:user-bold" class="text-slate-400" />
                        <span>Subtotal Individual Categories ({{ totalIndividualCount }} {{ totalIndividualCount === 1 ? 'Archer' : 'Archers' }})</span>
                    </span>
                    <span class="font-bold text-slate-800 tabular-nums">{{ formatPrice(subtotalIndividual) }}</span>
                </div>

                <div v-if="teamItems.length > 0" class="flex items-center justify-between text-xs text-slate-600">
                    <span class="flex items-center gap-1.5">
                        <Icon icon="ph:users-three-bold" class="text-slate-400" />
                        <span>Subtotal Team Categories ({{ teamItems.length }} {{ teamItems.length === 1 ? 'Team' : 'Teams' }})</span>
                    </span>
                    <span class="font-bold text-slate-800 tabular-nums">{{ formatPrice(subtotalTeam) }}</span>
                </div>

                <div class="flex items-center justify-between text-xs text-slate-600">
                    <span class="flex items-center gap-1.5">
                        <Icon icon="ph:sparkle-bold" class="text-slate-400" />
                        <span>Platform & Registration Service Fee</span>
                    </span>
                    <span class="font-semibold text-slate-600">Free / Rp 0</span>
                </div>

                <!-- Grand Total Card -->
                <div class="p-4 sm:p-5 rounded-2xl bg-navy text-white flex items-center justify-between gap-4 shadow-sm mt-3">
                    <div>
                        <div class="text-xs font-bold text-slate-300">
                            Total Invoice Amount
                        </div>
                        <div class="text-[11px] text-slate-300/80 mt-0.5 flex items-center gap-1">
                            <Icon icon="ph:shield-check-fill" class="text-primary text-xs" />
                            <span>Official Entry Verified</span>
                        </div>
                    </div>

                    <div class="text-right">
                        <div class="text-2xl sm:text-3xl font-black text-primary tabular-nums tracking-tight">
                            {{ formatPrice(totalAmount) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Invoice Footer Guarantee Note -->
        <div class="px-6 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3 text-[11px] text-slate-500 flex-wrap">
            <div class="flex items-center gap-1.5">
                <Icon icon="ph:seal-check-bold" class="text-emerald-600 text-sm" />
                <span>Official invoice automatically generated by Archeris platform.</span>
            </div>
            <div class="font-mono text-slate-400 text-[10px]">
                Official Entry Bill
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { formatMoney } from '~/composables/useCurrency'

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

// Accordion expansion state per category - open by default for rich invoice view
const expandedGroups = ref({})

const isGroupExpanded = (title) => {
    if (expandedGroups.value[title] === undefined) {
        return true
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
        if (item.amount > 0) {
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

const formatPrice = (val) => {
    return formatMoney(val, props.currency)
}
</script>
