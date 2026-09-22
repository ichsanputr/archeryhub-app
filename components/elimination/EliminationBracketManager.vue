<template>
    <div class="flex flex-col gap-6 pb-12">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Reset Match Confirmation Dialog -->
        <AppDialog
            v-model:show="showResetConfirmDialog"
            :title="t('event_elimination.reset_match_title')"
            :message="t('event_elimination.confirm_reset_match')"
            :confirmText="t('event_elimination.confirm_reset_btn')"
            :cancelText="t('common.cancel')"
            icon="ph:arrow-counter-clockwise-bold"
            type="danger"
            @confirm="executeResetMatch"
        />

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="animate-pulse space-y-6">
            <!-- Header Skeleton -->
            <div
                class="relative overflow-hidden rounded-3xl border border-gray-100 bg-white h-48 p-8 flex flex-col justify-between shadow-sm">
                <div class="flex items-center gap-6">
                    <div class="h-16 w-16 bg-gray-100 rounded-2xl"></div>
                    <div class="space-y-3 flex-1">
                        <div class="h-8 bg-gray-100 rounded-lg w-1/3"></div>
                        <div class="h-4 bg-gray-50 rounded-md w-1/4"></div>
                        <div class="flex gap-2">
                            <div class="h-4 w-20 bg-gray-50 rounded-full"></div>
                            <div class="h-4 w-20 bg-gray-50 rounded-full"></div>
                        </div>
                    </div>
                    <div class="hidden sm:flex gap-3">
                        <div class="h-12 w-36 bg-gray-100 rounded-xl"></div>
                        <div class="h-12 w-12 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
                <div class="flex gap-4 border-t border-gray-50 pt-4">
                    <div v-for="i in 2" :key="i" class="h-10 w-32 bg-gray-100 rounded-xl"></div>
                </div>
            </div>

            <!-- Content Skeleton -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Sidebar Match List -->
                <div class="lg:col-span-4 space-y-4">
                    <div v-for="i in 5" :key="i"
                        class="bg-white rounded-3xl p-5 border border-gray-100 flex gap-4 shadow-sm">
                        <div class="size-10 bg-gray-100 rounded-xl shrink-0"></div>
                        <div class="flex-1 space-y-2 min-w-0">
                            <div class="h-4 bg-gray-100 rounded w-3/4"></div>
                            <div class="h-3 bg-gray-50 rounded w-1/2"></div>
                        </div>
                        <div class="size-6 bg-gray-50 rounded-full shrink-0"></div>
                    </div>
                </div>

                <!-- Main Area (Target/Scoring) -->
                <div class="lg:col-span-8">
                    <div class="bg-white rounded-3xl p-8 border border-gray-100 min-h-[500px] shadow-sm">
                        <div
                            class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-50">
                            <div>
                                <div class="h-7 bg-gray-100 rounded-lg w-48 mb-2"></div>
                                <div class="h-4 bg-gray-50 rounded-md w-64"></div>
                            </div>
                            <div class="h-11 bg-gray-100 rounded-xl w-40 shrink-0"></div>
                        </div>

                        <!-- Responsive Grid for Match Cards -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="i in 4" :key="i"
                                class="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 space-y-6">
                                <div class="flex justify-between items-center">
                                    <div class="size-8 bg-gray-100 rounded-lg"></div>
                                    <div class="h-4 bg-gray-100 rounded w-20"></div>
                                </div>
                                <div class="space-y-3">
                                    <div class="h-14 bg-white rounded-2xl border border-gray-50"></div>
                                    <div class="h-14 bg-white rounded-2xl border border-gray-50"></div>
                                </div>
                                <div class="h-10 bg-gray-100 rounded-xl w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template v-else-if="bracket">
            <!-- Enhanced Header Section (Matching Platform Standard Header) -->
            <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm mb-2">
                <!-- Theme Motif Pattern -->
                <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>

                <!-- Decorative Background Elements -->
                <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
                <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

                <!-- Header Content -->
                <div class="relative p-4 sm:p-8">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
                        <div class="flex flex-col gap-3 flex-1 min-w-0">
                            <!-- Top Row: Back Button & Title -->
                            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
                                <!-- Back Button -->
                                <button type="button"
                                    @click="handleBack"
                                    class="size-10 sm:size-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md hover:bg-primary hover:text-navy text-white transition-all shrink-0 cursor-pointer active:scale-95"
                                    :title="t('event_elimination.back_to_brackets')">
                                    <Icon icon="ph:arrow-left-bold" class="text-lg sm:text-2xl" />
                                </button>

                                <h1 class="text-lg sm:text-2xl lg:text-3xl font-black leading-tight tracking-tight text-white truncate flex-1 min-w-0">
                                    {{ pageTitle }}
                                </h1>
                            </div>

                            <!-- Chips Meta Info (Full-width clean wrapping on mobile) -->
                            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs text-slate-300 font-bold sm:pl-[72px] lg:pl-0">
                                <!-- Bracket ID Chip -->
                                <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] sm:text-xs font-bold font-mono">
                                    <Icon icon="ph:hash-bold" class="text-xs text-white/70" />
                                    <span>{{ bracket.bracket_id || bracketId }}</span>
                                </div>

                                <!-- Match Count / Done Chip -->
                                <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] sm:text-xs font-bold">
                                    <Icon icon="ph:chart-bar-fill" class="text-xs text-white/70" />
                                    <span>{{ finishedMatchesCount }}/{{ matches.length }} {{ t('event_elimination.done') }}</span>
                                </div>

                                <!-- Format Chip -->
                                <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] sm:text-xs font-bold">
                                    <Icon icon="ph:crosshair-bold" class="text-xs text-white/70" />
                                    <span>{{ bracket.format === 'recurve_set' ? t('event_elimination.set_system') : t('event_elimination.total_score_format') }} • {{ t('event_elimination.arrows_ends_format', '{arrows} Panah / {ends} End', { arrows: bracket.arrows_per_end, ends: bracket.ends_per_match }) }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons (Responsive on Mobile) -->
                        <div class="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-3 lg:pt-0 border-t border-white/10 lg:border-t-0 w-full sm:w-auto">
                            <!-- Download / Print Scoresheet Button -->
                            <button type="button" :disabled="isDownloadingScoresheet"
                                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-white/10 text-white hover:bg-primary hover:text-navy border border-white/20 rounded-xl transition-all text-xs font-black disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 cursor-pointer"
                                @click="downloadScoresheet">
                                <Icon :icon="isDownloadingScoresheet ? 'ph:spinner' : 'ph:printer-bold'"
                                    :class="['text-base', isDownloadingScoresheet ? 'animate-spin' : '']" />
                                <span class="truncate">{{ isDownloadingScoresheet ? t('event_elimination.processing') : t('event_elimination.print_scoresheet') }}</span>
                            </button>

                            <!-- Back to Full Tree Button (when in round mode) -->
                            <button v-if="currentRoundNo" type="button"
                                @click="handleBack"
                                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 bg-white/10 text-white hover:bg-white/20 border border-white/20 rounded-xl transition-all text-xs font-black shadow-sm active:scale-95 cursor-pointer">
                                <Icon icon="ph:tree-structure-bold" class="text-base text-white" />
                                <span class="truncate">{{ t('event_elimination.view_bracket') }}</span>
                            </button>

                            <BaseButton v-if="!currentRoundNo && Object.keys(rounds).length === 0"
                                @click="isSubscriptionActive ? generateBracket() : (showPremiumModal = true)" variant="primary" icon="ph:magic-wand-bold"
                                class="w-full sm:w-auto h-10 sm:h-11 shadow-md shadow-primary/30 tracking-wider font-black text-xs">
                                {{ t('event_elimination.create_bracket') }}
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Navigation (Matching Qualification Style) -->
            <div v-if="currentRoundNo"
                class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide bg-white rounded-t-2xl px-2 mb-6">
                <button v-for="t in tabs" :key="t.id" type="button" @click="switchTab(t.id)"
                    class="px-6 py-4 border-b-2 font-black text-sm sm:text-base flex items-center gap-2.5 whitespace-nowrap transition-colors outline-none cursor-pointer"
                    :class="activeTab === t.id
                        ? 'border-primary text-navy bg-primary/5'
                        : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'">
                    <Icon :icon="t.icon" class="text-xl" />
                    <span>{{ t.label }}</span>
                </button>
            </div>

            <!-- ROUND MANAGEMENT MODE -->
            <div v-if="currentRoundNo" class="space-y-6">
                <!-- TARGET TAB -->
                <EliminationTargetMode v-if="activeTab === 'target'" :round-matches="roundMatches"
                    :target-options="targetOptions" :is-auto-assigning="isAutoAssigning" :bracket-size="bracket?.bracket_size || 8" @update-target="updateTarget"
                    @auto-assign="autoAssignTargets" />

                <!-- SCORING TAB -->
                <EliminationScoringMode v-if="activeTab === 'scoring'" :bracket="bracket" :round-matches="roundMatches"
                    :selected-scoring-match="selectedScoringMatch" v-model:active-side="activeSide"
                    v-model:current-end="currentEnd" :match-ends="matchEnds" :is-saving="isSaving"
                    :is-ending-match="isEndingMatch" :selected-arrow-index="selectedArrowIndex"
                    :can-end-match="canEndMatch" :manual-winner-id="manualWinnerId" :team-members-map="teamMembersMap"
                    @select-match="selectMatchForScoring" @add-score="addArrowScore"
                    @delete-last-arrow="deleteLastArrow" @save-and-next="saveAndNext" @end-match="endMatch"
                    @select-arrow-box="selectArrowBox" @reset-match="resetMatch" :is-match-finished="isMatchFinished"
                    :is-resetting="isResetting" />
            </div>

            <!-- BRACKET VIEW MODE -->
            <EliminationBracketView v-else :bracket="bracket" :rounds="rounds" :selected-match="selectedMatch"
                @generate-bracket="isSubscriptionActive ? generateBracket() : (showPremiumModal = true)" @navigate-to-round="navigateToRound" @select-match="selectMatch" />
        </template>

        <!-- Not Found / Error State -->
        <div v-else class="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <Icon icon="ph:warning-circle-bold" class="text-8xl text-red-50 mb-4 mx-auto" />
            <h2 class="text-3xl font-black text-navy tracking-tight">{{ t('event_elimination.bracket_not_found') }}</h2>
            <div class="text-gray-400 mt-2">{{ t('event_elimination.bracket_invalid_desc') }}</div>
            <button @click="navigateTo(route.path.includes('/organizer/') ? `/dashboard/organizer/tournaments/${eventId}/elimination` : `/dashboard/archer/tournaments/${eventId}/my-elimination`)"
                class="mt-10 px-6 py-3 rounded-2xl border-2 border-navy text-navy font-black tracking-widest hover:bg-navy hover:text-white transition-all cursor-pointer">
                {{ t('event_elimination.back_to_list') }}
            </button>
        </div>
    </div>

    <!-- End Match Confirmation Dialog -->
    <ClientOnly>
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showEndMatchDialog"
                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
                    <div
                        class="relative w-full max-w-lg bg-navy rounded-3xl shadow-2xl overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto">
                        <!-- Decorative Elements -->
                        <div class="absolute inset-0 opacity-10 pointer-events-none">
                            <Icon icon="ph:target"
                                class="text-[200px] sm:text-[300px] absolute -right-16 -bottom-16 rotate-12 text-white/20" />
                        </div>

                        <div class="relative p-6 sm:p-8 text-center">
                            <div class="mb-4 sm:mb-6">
                                <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">{{ t('event_elimination.end_match_confirm') }}</h2>
                                <div class="text-white/60 text-[10px] sm:text-sm mt-1">{{ t('event_elimination.end_match_confirm_desc') }}</div>
                            </div>

                            <!-- Battle Display -->
                            <div v-if="selectedScoringMatch"
                                class="bg-white/5 rounded-2xl p-4 sm:p-6 border border-white/10 mb-4 sm:mb-6">
                                <div class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                                    <!-- Side A -->
                                    <div
                                        class="flex-1 w-full sm:w-auto text-center flex flex-row sm:flex-col items-center sm:justify-center gap-4">
                                        <img :src="useImageOrDefault(null, selectedScoringMatch.entry_a_name)"
                                            class="size-12 sm:size-16 rounded-xl sm:rounded-2xl border-2 shrink-0"
                                            :class="(getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') || manualWinnerId === selectedScoringMatch.entry_a_id) ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/20'" />
                                        <div class="flex-1 sm:flex-none text-left sm:text-center min-w-0">
                                            <div class="font-bold text-white text-xs sm:text-sm truncate mb-0.5">
                                                {{ selectedScoringMatch.entry_a_name || 'TBD' }}
                                            </div>
                                            <div class="text-2xl sm:text-3xl font-black tabular-nums"
                                                :class="(getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') || manualWinnerId === selectedScoringMatch.entry_a_id) ? 'text-primary' : 'text-white/60'">
                                                {{ getMatchScore(selectedScoringMatch, 'A') }}
                                            </div>
                                        </div>
                                        <div v-if="getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') || manualWinnerId === selectedScoringMatch.entry_a_id"
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] sm:text-[10px] font-black tracking-wider shrink-0 sm:mt-2">
                                            <Icon icon="ph:crown-simple-fill" class="text-[10px]" />
                                            <span class="hidden sm:inline">{{ t('event_elimination.winner') }}</span>
                                        </div>
                                    </div>

                                    <!-- VS -->
                                    <div class="hidden sm:flex flex-col items-center gap-2">
                                        <div
                                            class="size-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                            <span class="text-[10px] font-black text-white/40 tracking-widest">VS</span>
                                        </div>
                                    </div>
                                    <div class="sm:hidden w-full h-px bg-white/5"></div>

                                    <!-- Side B -->
                                    <div
                                        class="flex-1 w-full sm:w-auto text-center flex flex-row-reverse sm:flex-col items-center sm:justify-center gap-4">
                                        <img :src="useImageOrDefault(null, selectedScoringMatch.entry_b_name)"
                                            class="size-12 sm:size-16 rounded-xl sm:rounded-2xl border-2 shrink-0"
                                            :class="(getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') || manualWinnerId === selectedScoringMatch.entry_b_id) ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/20'" />
                                        <div class="flex-1 sm:flex-none text-right sm:text-center min-w-0">
                                            <div class="font-bold text-white text-xs sm:text-sm truncate mb-0.5">
                                                {{ selectedScoringMatch.entry_b_name || 'TBD' }}
                                            </div>
                                            <div class="text-2xl sm:text-3xl font-black tabular-nums"
                                                :class="(getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') || manualWinnerId === selectedScoringMatch.entry_b_id) ? 'text-primary' : 'text-white/60'">
                                                {{ getMatchScore(selectedScoringMatch, 'B') }}
                                            </div>
                                        </div>
                                        <div v-if="getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') || manualWinnerId === selectedScoringMatch.entry_b_id"
                                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] sm:text-[10px] font-black tracking-wider shrink-0 sm:mt-2">
                                            <Icon icon="ph:crown-simple-fill" class="text-[10px]" />
                                            <span class="hidden sm:inline">{{ t('event_elimination.winner') }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Pilih Pemenang Manual (untuk Shoot-off Seri) -->
                            <div v-if="isShootOffTie"
                                class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-left">
                                <div class="flex items-center gap-2 mb-3">
                                    <Icon icon="ph:info-bold" class="text-yellow-500" />
                                    <span class="text-xs font-black text-yellow-500 tracking-widest">{{ t('event_elimination.manual_winner_desc') }}</span>
                                </div>
                                <div class="text-[10px] text-white/40 mb-4 leading-relaxed">
                                    {{ t('event_elimination.shoot_off_tie_desc') }}
                                </div>

                                <div class="space-y-2">
                                    <button v-if="selectedScoringMatch.entry_a_id"
                                        @click="manualWinnerId = selectedScoringMatch.entry_a_id"
                                        class="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                                        :class="manualWinnerId === selectedScoringMatch.entry_a_id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'">
                                        <span class="text-sm font-bold text-white">{{ selectedScoringMatch.entry_a_name
                                            }}</span>
                                        <Icon v-if="manualWinnerId === selectedScoringMatch.entry_a_id"
                                            icon="ph:check-circle-fill" class="text-primary" />
                                    </button>

                                    <button v-if="selectedScoringMatch.entry_b_id"
                                        @click="manualWinnerId = selectedScoringMatch.entry_b_id"
                                        class="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                                        :class="manualWinnerId === selectedScoringMatch.entry_b_id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'">
                                        <span class="text-sm font-bold text-white">{{ selectedScoringMatch.entry_b_name
                                            }}</span>
                                        <Icon v-if="manualWinnerId === selectedScoringMatch.entry_b_id"
                                            icon="ph:check-circle-fill" class="text-primary" />
                                    </button>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <button @click="showEndMatchDialog = false"
                                    class="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all">
                                    {{ t('event_elimination.cancel') }}
                                </button>
                                <BaseButton @click="confirmEndMatch"
                                    :disabled="isEndingMatch || (selectedScoringMatch && getMatchScore(selectedScoringMatch, 'A') === getMatchScore(selectedScoringMatch, 'B') && !manualWinnerId)"
                                    variant="primary" :loading="isEndingMatch" icon="ph:check-bold"
                                    class="flex-1 px-6 py-3 rounded-xl font-black tracking-wide">
                                    {{ isEndingMatch ? t('event_elimination.processing') : t('event_elimination.confirm') }}
                                </BaseButton>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </ClientOnly>
</template>

<script setup>
import { useApi, getApiErrorMessage } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import AppDialog from '~/components/common/AppDialog.vue'
import EliminationBracketView from '~/components/elimination/EliminationBracketView.vue'
import EliminationTargetMode from '~/components/elimination/EliminationTargetMode.vue'
import EliminationScoringMode from '~/components/elimination/EliminationScoringMode.vue'

const { t } = useDashboardI18n()

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const eventId = computed(() => route.params.id)
const bracketId = computed(() => route.params.bracketId)
const { post, get, put } = useApi()
const toast = useToast()

const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)
const showResetConfirmDialog = ref(false)

const isLoading = ref(true)
const isSaving = ref(false)
const isAutoAssigning = ref(false)
const isDownloadingScoresheet = ref(false)
const bracket = ref(null)
const categoryInfo = ref(null)
const entries = ref([])
const matches = ref([])
const rounds = ref({})
const selectedMatch = ref(null)
const availableTargets = ref([])
const selectedArrowIndex = ref(0)
const selectedScoringMatch = ref(null)
const matchEnds = ref({}) // { matchId: { A: { 1: {total: 0, arrows: []} }, B: { ... } } }
const manualWinnerId = ref(null)
const teamMembersMap = ref({})
const isResetting = ref(false)

const isByeMatch = (match) => {
    if (!match) return false
    return match.is_bye === true || 
           match.is_bye === 1 || 
           match.is_bye === '1' ||
           match.entry_b_name === 'BYE' || 
           match.entry_a_name === 'BYE' ||
           (!match.entry_b_id && match.entry_a_id && !match.entry_b_uuid) ||
           (!match.entry_a_id && match.entry_b_id && !match.entry_a_uuid)
}

const isMatchFinished = computed(() => {
    return selectedScoringMatch.value?.status === 'finished' || !!selectedScoringMatch.value?.winner_entry_id
})

const currentRoundNo = computed(() => {
    const raw = route.params.round || route.query.round
    if (!raw) return null
    return typeof raw === 'string' ? raw.replace(/^round-?/i, '') : String(raw)
})
const roundMatches = computed(() => {
    if (!currentRoundNo.value) return []
    return rounds.value[currentRoundNo.value] || rounds.value[Number(currentRoundNo.value)] || []
})

const finishedMatchesCount = computed(() => {
    return matches.value.filter(m => m.status === 'finished' || m.winner_entry_id).length
})

const pageTitle = computed(() => {
    const catName = bracket.value?.category_name || t('event_elimination.title')
    if (!currentRoundNo.value) return catName
    return `${catName} - ${getRoundName(parseInt(currentRoundNo.value))}`
})

useHead({
    title: computed(() => `${pageTitle.value} - Archeris Dashboard`)
})

const targetOptions = computed(() => {
    return availableTargets.value.map(t => ({
        ...t,
        displayName: `Target ${t.name}`
    }))
})

// Round Management States
const activeTab = ref(route.query.mode === 'scoring' ? 'scoring' : 'target')
const tabs = computed(() => [
    { id: 'target', label: t('event_elimination.target_codes'), icon: 'ph:target-bold' },
    { id: 'scoring', label: t('event_elimination.scores'), icon: 'ph:pencil-circle-bold' }
])

const switchTab = (tabId) => {
    activeTab.value = tabId
    const isOrganizer = route.path.includes('/organizer/')
    const base = isOrganizer 
        ? `/dashboard/organizer/tournaments/${eventId.value}/elimination/${bracketId.value}`
        : `/dashboard/archer/tournaments/${eventId.value}/my-elimination`
    const newQuery = { ...route.query, mode: tabId }
    if (currentRoundNo.value) {
        newQuery.round = String(currentRoundNo.value)
    }
    router.replace({ path: base, query: newQuery })
}

// Sync activeTab with route query when changed externally
watch(() => route.query.mode, (newMode) => {
    if ((newMode === 'scoring' || newMode === 'target') && activeTab.value !== newMode) {
        activeTab.value = newMode
    }
})

const initMatchEnds = (matchId) => {
    if (!matchId) return
    if (!matchEnds.value[matchId]) {
        const initEnds = {}
        const totalEnds = bracket.value?.ends_per_match || 5
        const arrowsPerEnd = bracket.value?.arrows_per_end || 3
        for (let i = 1; i <= totalEnds; i++) {
            initEnds[i] = { total: 0, arrows: Array(arrowsPerEnd).fill(null), end_no: i }
        }
        initEnds[99] = { total: 0, arrows: [null], end_no: 99 }

        matchEnds.value[matchId] = {
            A: JSON.parse(JSON.stringify(initEnds)),
            B: JSON.parse(JSON.stringify(initEnds))
        }
    }
}

// Auto-select first playable match when in scoring mode or when round changes
watchEffect(() => {
    if (activeTab.value === 'scoring' && currentRoundNo.value && roundMatches.value.length > 0) {
        if (!selectedScoringMatch.value || !roundMatches.value.some(m => m.id === selectedScoringMatch.value?.id)) {
            // Find first playable (non-BYE) match first, fallback to first match
            const firstPlayable = roundMatches.value.find(m => !isByeMatch(m))
            const chosen = firstPlayable || roundMatches.value[0]
            if (chosen) {
                selectMatchForScoring(chosen)
            }
        }
    }
})

// Reset selected match when round changes - fixes caching issue
watch(currentRoundNo, (newRound, oldRound) => {
    if (newRound !== oldRound) {
        selectedScoringMatch.value = null
        currentEnd.value = 1
        activeSide.value = 'A'
    }
})

const statusBadgeClasses = computed(() => {
    const s = bracket.value?.status
    if (s === 'running') return 'bg-blue-500 text-white shadow-blue-200'
    if (s === 'finished') return 'bg-emerald-500 text-white shadow-emerald-200'
    if (s === 'generated') return 'bg-navy text-primary shadow-navy/20'
    return 'bg-gray-100 text-gray-400 border border-gray-200'
})

// Check if there is a shoot-off tie
const isShootOffTie = computed(() => {
    if (!selectedScoringMatch.value) return false
    const matchId = selectedScoringMatch.value.id
    const m = matchEnds.value[matchId]
    if (!m || !m.A || !m.B) return false

    const soA = m.A?.[99]?.arrows?.[0]
    const soB = m.B?.[99]?.arrows?.[0]

    if (soA === null || soB === null || soA === undefined || soB === undefined || soA === '' || soB === '') return false

    const getV = (v) => v === 'X' ? 11 : (v === 'M' ? 0 : parseInt(v) || 0)
    const vA = getV(soA)
    const vB = getV(soB)

    // Base scores tied checks
    const isRecurve = bracket.value?.format === 'recurve_set'
    let baseA, baseB
    if (isRecurve) {
        baseA = calculateSetPoints(matchId, 'A')
        baseB = calculateSetPoints(matchId, 'B')
    } else {
        baseA = Object.values(m.A || {}).reduce((s, e) => e.end_no === 99 ? s : s + (e.total || 0), 0)
        baseB = Object.values(m.B || {}).reduce((s, e) => e.end_no === 99 ? s : s + (e.total || 0), 0)
    }

    if (baseA !== baseB) return false
    return vA === vB
})

// Check if match can be ended - requires at least one completed end
const canEndMatch = computed(() => {
    if (!selectedScoringMatch.value) return false
    const matchId = selectedScoringMatch.value.id
    const m = matchEnds.value[matchId] || (selectedScoringMatch.value.uuid ? matchEnds.value[selectedScoringMatch.value.uuid] : null)
    if (!m || !m.A || !m.B) return false

    // Check if at least one end has been completed by both sides
    const arrowsPerEnd = bracket.value?.arrows_per_end || 3
    for (let i = 1; i <= (bracket.value?.ends_per_match || 5); i++) {
        const hasA = Array.isArray(m.A?.[i]?.arrows) && m.A[i].arrows.length === arrowsPerEnd && m.A[i].arrows.every(a => a !== null && a !== '')
        const hasB = Array.isArray(m.B?.[i]?.arrows) && m.B[i].arrows.length === arrowsPerEnd && m.B[i].arrows.every(a => a !== null && a !== '')
        if (hasA && hasB) return true
    }
    return false
})

// Scoring States
const activeSide = ref('A')
const currentEnd = ref(1)

// Helper to automatically focus the first empty arrow (or last arrow if end is full)
const focusNextEmptyArrow = (side = activeSide.value, endNo = currentEnd.value) => {
    if (!selectedScoringMatch.value) return
    const matchId = selectedScoringMatch.value.id || selectedScoringMatch.value.uuid
    if (!matchId) return
    initMatchEnds(matchId)
    
    const end = matchEnds.value[matchId]?.[side]?.[endNo]
    const totalArrows = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)
    
    if (end && Array.isArray(end.arrows)) {
        const emptyIdx = end.arrows.findIndex(a => a === null || a === undefined || a === '')
        if (emptyIdx !== -1 && emptyIdx < totalArrows) {
            selectedArrowIndex.value = emptyIdx
            return
        }
        selectedArrowIndex.value = Math.max(0, totalArrows - 1)
    } else {
        selectedArrowIndex.value = 0
    }
}

// Monitor end changes to adjust arrow focus to first empty
watch(currentEnd, (newEnd) => {
    focusNextEmptyArrow(activeSide.value, newEnd)
})

// Monitor side changes to adjust arrow focus to first empty
watch(activeSide, (newSide) => {
    focusNextEmptyArrow(newSide, currentEnd.value)
})

const isEndingMatch = ref(false)
const showEndMatchDialog = ref(false)

const fetchBracket = async (silent = false) => {
    if (!silent) isLoading.value = true
    try {
        const response = await get(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}`)
        bracket.value = response?.bracket || null
        entries.value = response?.entries || []
        matches.value = response?.matches || []
        rounds.value = response?.rounds || {}

        // Re-sync selectedScoringMatch to get updated scores/status
        if (selectedScoringMatch.value) {
            const updatedMatch = matches.value.find(m => m.id === selectedScoringMatch.value.id)
            if (updatedMatch) {
                selectedScoringMatch.value = updatedMatch
            }
        }

        if (bracket.value?.category_id) {
            fetchCategoryDetails(bracket.value.category_id)
        }

        // Fetch all scores for the bracket list
        fetchAllScores()
        fetchTeamMembers()
    } catch (error) {
        console.error('Failed to fetch bracket:', error)
        toast.error(getApiErrorMessage(error, t('event_elimination.toast_bracket_load_failed')))
    } finally {
        if (!silent) isLoading.value = false
    }
}

const fetchCategoryDetails = async (categoryUuid) => {
    try {
        const response = await get(`/tournaments/${eventId.value}/categories`)
        const cats = response?.events || response.data?.events || []
        categoryInfo.value = cats.find(c => (c.id === categoryUuid || c.uuid === categoryUuid))
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const fetchAvailableTargets = async () => {
    try {
        const response = await get(`/tournaments/${eventId.value}/targets/options`)
        const options = response?.options || response.data?.options || []
        availableTargets.value = options.map(o => ({
            id: o.uuid || o.id,
            name: o.target_name || o.value || o.name
        }))
    } catch (error) {
        console.error('Failed to fetch targets:', error)
    }
}

const generateBracket = async () => {
    try {
        await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/generate`)
        toast.success(t('event_elimination.toast_bracket_generated'))
        await fetchBracket()
    } catch (error) {
        console.error('Failed to generate bracket:', error)
        const data = error?.data || error?.response?.data
        let msg = getApiErrorMessage(error, t('event_elimination.toast_bracket_generate_failed'))
        if (data?.participant_count != null && data?.required != null) {
            msg = `${msg} (${t('event_elimination.available')} ${data.participant_count}, ${t('event_elimination.required_count')} ${data.required})`
        }
        toast.error(msg)
    }
}

const downloadScoresheet = async () => {
    if (isDownloadingScoresheet.value) return
    isDownloadingScoresheet.value = true
    try {
        const apiBase = apiBaseUrl
        const isTeam = bracket.value?.bracket_type && bracket.value.bracket_type !== 'individual'
        const url = isTeam
            ? `${apiBase}/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/scoresheet-team?bracket_id=${bracketId.value}`
            : `${apiBase}/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/scoresheet`

        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) {
            const errJson = await res.json().catch(() => null)
            throw new Error(errJson?.error || `HTTP error! status: ${res.status}`)
        }

        let filename = `Scoresheet-Eliminasi-${bracket.value?.bracket_id || bracketId.value}.pdf`
        const disposition = res.headers.get('content-disposition')
        if (disposition && disposition.includes('filename=')) {
            const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
            if (match && match[1]) {
                filename = match[1].replace(/['"]/g, '').trim()
            }
        }
        if (!filename.toLowerCase().endsWith('.pdf')) {
            filename += '.pdf'
        }

        const blob = await res.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = blobUrl
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)

        toast.addToast(t('event_elimination.toast_scoresheet_downloaded'), 'success')
    } catch (err) {
        console.error('Failed to download scoresheet PDF:', err)
        toast.addToast(err?.message || t('event_elimination.toast_failed_open_scoresheet'), 'error')
    } finally {
        isDownloadingScoresheet.value = false
    }
}

const openScoresheet = async () => {
    await downloadScoresheet()
}

const navigateToRound = (roundNo) => {
    const isOrganizer = route.path.includes('/organizer/')
    const base = isOrganizer 
        ? `/dashboard/organizer/tournaments/${eventId.value}/elimination/${bracketId.value}`
        : `/dashboard/archer/tournaments/${eventId.value}/my-elimination`
    router.push({
        path: base,
        query: { round: String(roundNo), mode: activeTab.value || 'target' }
    })
}

const selectMatch = (match) => {
    if (match && match.id) {
        navigateTo(`/match/${match.id}`, {
            open: {
                target: '_blank'
            }
        })
    }
}

const handleBack = () => {
    const isOrganizer = route.path.includes('/organizer/')
    if (currentRoundNo.value) {
        const base = isOrganizer 
            ? `/dashboard/organizer/tournaments/${eventId.value}/elimination/${bracketId.value}`
            : `/dashboard/archer/tournaments/${eventId.value}/my-elimination`
        router.push({ path: base, query: {} })
    } else {
        const list = isOrganizer 
            ? `/dashboard/organizer/tournaments/${eventId.value}/elimination`
            : `/dashboard/archer/tournaments/${eventId.value}`
        router.push(list)
    }
}

const selectMatchForScoring = (match) => {
    if (!match) return
    selectedScoringMatch.value = match
    activeSide.value = 'A'
    currentEnd.value = 1
    initMatchEnds(match.id)
    focusNextEmptyArrow('A', 1)
    fetchMatchScores(match.id)
}

const fetchTeamMembers = async () => {
    if (bracket.value?.bracket_type === 'individual') return
    try {
        const res = await get(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/team-members`)
        teamMembersMap.value = res?.members || {}
    } catch (e) {
        console.error('Failed to fetch team members:', e)
    }
}

const fetchAllScores = async () => {
    try {
        const response = await get(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/scores`)
        const ends = response?.ends || []

        ends.forEach(end => {
            const matchId = end.match_id
            const side = end.side
            const endNo = end.end_no

            const mObj = matches.value.find(m => m.uuid === matchId || m.id === matchId)
            const idsToUpdate = [matchId]
            if (mObj?.id && mObj.id !== matchId) idsToUpdate.push(mObj.id)
            if (mObj?.uuid && mObj.uuid !== matchId) idsToUpdate.push(mObj.uuid)

            idsToUpdate.forEach(id => {
                initMatchEnds(id)
                if (matchEnds.value[id]?.[side]?.[endNo]) {
                    matchEnds.value[id][side][endNo].total = end.end_total
                    const arrows = [...(end.arrows || [])]
                    const targetSize = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)
                    while (arrows.length < targetSize) arrows.push(null)
                    if (arrows.length > targetSize) arrows.length = targetSize
                    matchEnds.value[id][side][endNo].arrows = arrows
                }
            })
        })
    } catch (e) {
        console.error('Failed to fetch bracket scores:', e)
    }
}

const fetchMatchScores = async (matchId) => {
    if (!matchId) return
    try {
        initMatchEnds(matchId)
        const response = await get(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/matches/${matchId}`)
        const ends = response?.ends || []

        const mObj = matches.value.find(m => m.uuid === matchId || m.id === matchId)
        const idsToUpdate = [matchId]
        if (mObj?.id && mObj.id !== matchId) idsToUpdate.push(mObj.id)
        if (mObj?.uuid && mObj.uuid !== matchId) idsToUpdate.push(mObj.uuid)

        ends.forEach(end => {
            const side = end.side
            const endNo = end.end_no
            idsToUpdate.forEach(id => {
                initMatchEnds(id)
                if (matchEnds.value[id]?.[side]?.[endNo]) {
                    matchEnds.value[id][side][endNo].total = end.end_total
                    matchEnds.value[id][side][endNo].end_no = endNo
                    const arrows = [...(end.arrows || [])]
                    const targetSize = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)
                    while (arrows.length < targetSize) arrows.push(null)
                    if (arrows.length > targetSize) arrows.length = targetSize
                    matchEnds.value[id][side][endNo].arrows = arrows
                }
            })
        })
        focusNextEmptyArrow(activeSide.value, currentEnd.value)
    } catch (e) {
        console.error('Failed to fetch match scores:', e)
    }
}

const getMatchScore = (match, side) => {
    if (!match || (!match.id && !match.uuid)) return 0
    const isRecurve = bracket.value?.format === 'recurve_set'
    const sideKey = side === 'A' ? 'A' : 'B'

    const m = matchEnds.value[match.id] || matchEnds.value[match.uuid]
    let score = 0
    if (m && m[sideKey]) {
        if (isRecurve) score = calculateSetPoints(match.id, sideKey)
        else score = Object.values(m[sideKey] || {}).reduce((s, e) => {
            if (e?.end_no === 99) return s
            return s + (e?.total || 0)
        }, 0) || 0
    } else {
        if (isRecurve) score = (side === 'A' ? match.total_points_a : match.total_points_b) || 0
        else score = (side === 'A' ? match.total_score_a : match.total_score_b) || 0
    }

    // Shoot-off logic: Winner gets +1 Set Point ONLY in Recurve Set System (making 5-5 become 6-5)
    if (isRecurve) {
        const soA = m?.A?.[99]?.arrows?.[0]
        const soB = m?.B?.[99]?.arrows?.[0]

        if (soA && soB) {
            const getV = (v) => v === 'X' ? 11 : (v === 'M' ? 0 : parseInt(v) || 0)
            const vA = getV(soA)
            const vB = getV(soB)

            if (vA > vB) {
                if (side === 'A') score += 1
            } else if (vB > vA) {
                if (side === 'B') score += 1
            } else {
                // Tie in shootout - check manual selection
                const currentSideId = side === 'A' ? match.entry_a_id : match.entry_b_id
                if (manualWinnerId.value && manualWinnerId.value === currentSideId) {
                    score += 1
                } else if (match.winner_entry_id === currentSideId && match.status === 'finished') {
                    // Persistent winner check
                    score += 1
                }
            }
        }
    }

    return score
}

const calculateSetPoints = (matchId, side) => {
    if (!matchId) return 0
    const m = matchEnds.value[matchId]
    if (!m || !m.A || !m.B) return 0

    let setPointsA = 0
    let setPointsB = 0

    const totalEnds = bracket.value?.ends_per_match || 5
    const arrowsPerEnd = bracket.value?.arrows_per_end || 3

    for (let i = 1; i <= totalEnds; i++) {
        const endA = m.A?.[i]
        const endB = m.B?.[i]
        if (!endA || !endB) continue

        // Only count if both have finished the end
        if (endA.arrows && endB.arrows && endA.arrows.length === arrowsPerEnd && endB.arrows.length === arrowsPerEnd) {
            if (endA.total > endB.total) {
                setPointsA += 2
            } else if (endA.total < endB.total) {
                setPointsB += 2
            } else {
                setPointsA += 1
                setPointsB += 1
            }
        }

        // Stop if someone reached 6 points
        if (setPointsA >= 6 || setPointsB >= 6) break
    }

    return side === 'A' ? setPointsA : setPointsB
}

const getMatchProgress = (match) => {
    if (!match) return 0
    if (match.winner_entry_id) return 100
    const m = matchEnds.value[match.id]
    if (!m || !m.A) return 0
    const scoredEnds = Object.values(m.A).filter(e => Array.isArray(e?.arrows) && e.arrows.some(a => a !== null && a !== '')).length
    const totalEnds = bracket.value?.ends_per_match || 5
    return Math.min(scoredEnds * (100 / totalEnds), 95)
}

const getArrowScore = (matchId, endNo, side, arrowIdx) => {
    if (!matchId) return ''
    const val = matchEnds.value[matchId]?.[side]?.[endNo]?.arrows?.[arrowIdx - 1]
    return val === null || val === undefined ? '' : val
}

const calculateEndTotal = (matchId, endNo, side) => {
    if (!matchId) return 0
    const end = matchEnds.value[matchId]?.[side]?.[endNo]
    if (!end || !Array.isArray(end.arrows)) return 0
    return end.arrows.reduce((sum, a) => {
        if (!a || a === '-' || a === '') return sum
        const val = a === 'X' ? 10 : (a === 'M' ? 0 : parseInt(a) || 0)
        return sum + val
    }, 0)
}

const calculateEndStats = (matchId, endNo, side) => {
    if (!matchId) return { x: 0, ten: 0 }
    const end = matchEnds.value[matchId]?.[side]?.[endNo]
    if (!end || !Array.isArray(end.arrows)) return { x: 0, ten: 0 }
    return end.arrows.reduce((stats, a) => {
        if (a === 'X') {
            stats.x++
            stats.ten++
        } else if (a === '10' || a === 10) {
            stats.ten++
        }
        return stats
    }, { x: 0, ten: 0 })
}

const addArrowScore = (score) => {
    if (!selectedScoringMatch.value) return
    if (isByeMatch(selectedScoringMatch.value)) {
        toast.info(t('event_elimination.bye_no_scoring_needed'))
        return
    }
    if (isMatchFinished.value) {
        toast.info(t('event_elimination.toast_match_finished_no_edit'))
        return
    }
    const matchId = selectedScoringMatch.value.id
    const side = activeSide.value
    const endNo = currentEnd.value
    // Use 1 arrow for shoot-off, otherwise use bracket default
    const totalArrows = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)

    // Ensure match object exists
    initMatchEnds(matchId)

    // Ensure side exist
    if (!matchEnds.value[matchId][side]) matchEnds.value[matchId][side] = {}

    // Ensure specific end exists (important for shoot-off End 99)
    if (!matchEnds.value[matchId][side][endNo]) {
        matchEnds.value[matchId][side][endNo] = { total: 0, arrows: Array(totalArrows).fill(null), end_no: endNo }
    }

    const end = matchEnds.value[matchId][side][endNo]

    // Safety check for array size
    if (!end.arrows || end.arrows.length !== totalArrows) {
        const newArrows = end.arrows ? [...end.arrows] : []
        while (newArrows.length < totalArrows) newArrows.push(null)
        if (newArrows.length > totalArrows) newArrows.length = totalArrows // Truncate if too long
        end.arrows = newArrows
    }

    // Update at selected index
    end.arrows.splice(selectedArrowIndex.value, 1, score)

    // Tactile haptic feedback on devices with vibration support
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20)
    }

    // Recalculate total immediately for UI
    end.total = calculateEndTotal(matchId, endNo, side)

    // Move to next index
    if (selectedArrowIndex.value < totalArrows - 1) {
        selectedArrowIndex.value++
    } else {
        // Automatically switch side if current side is finished
        if (side === 'A') {
            activeSide.value = 'B'
            focusNextEmptyArrow('B', endNo)
        }
    }
}

const deleteLastArrow = () => {
    if (!selectedScoringMatch.value) return
    if (isByeMatch(selectedScoringMatch.value)) return
    if (isMatchFinished.value) return
    const matchId = selectedScoringMatch.value.id
    const endNo = currentEnd.value
    const side = activeSide.value

    const end = matchEnds.value[matchId]?.[side]?.[endNo]
    if (!end || !end.arrows) return

    // Tactile haptic feedback on delete
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(10)
    }

    // Clear current selected box
    end.arrows.splice(selectedArrowIndex.value, 1, null)

    // Recalculate
    end.total = calculateEndTotal(matchId, endNo, side)

    // Move back if not at 0
    if (selectedArrowIndex.value > 0) {
        selectedArrowIndex.value--
    } else if (side === 'B') {
        // If at beginning of Side B, move to end of Side A
        activeSide.value = 'A'
        const arrowsPerEnd = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)
        selectedArrowIndex.value = arrowsPerEnd - 1
    }
}

const selectArrowBox = (side, index) => {
    if (isByeMatch(selectedScoringMatch.value)) return
    activeSide.value = side
    selectedArrowIndex.value = index
}

const saveAndNext = async () => {
    if (!isSubscriptionActive.value) {
        showPremiumModal.value = true
        return
    }
    if (!selectedScoringMatch.value || isMatchFinished.value || isByeMatch(selectedScoringMatch.value)) return
    isSaving.value = true
    try {
        const matchId = selectedScoringMatch.value.id
        initMatchEnds(matchId)
        const arrowsA = matchEnds.value[matchId].A[currentEnd.value].arrows.map(a => String(a))
        const arrowsB = matchEnds.value[matchId].B[currentEnd.value].arrows.map(a => String(a))

        await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/matches/${matchId}/score`, {
            end_no: currentEnd.value,
            score_a: matchEnds.value[matchId].A[currentEnd.value].total,
            score_b: matchEnds.value[matchId].B[currentEnd.value].total,
            arrows_a: matchEnds.value[matchId].A[currentEnd.value].arrows.filter(a => a !== null).map(a => String(a)),
            arrows_b: matchEnds.value[matchId].B[currentEnd.value].arrows.filter(a => a !== null).map(a => String(a))
        })

        toast.success(t('event_elimination.toast_end_score_saved', { end: currentEnd.value }))

        // Update match scores in UI by re-fetching bracket (silently)
        await fetchBracket(true)

        if (activeSide.value === 'A') {
            activeSide.value = 'B'
            focusNextEmptyArrow('B', currentEnd.value)
        } else {
            activeSide.value = 'A'
            if (currentEnd.value < (bracket.value?.ends_per_match || 5)) {
                currentEnd.value++
            }
            focusNextEmptyArrow('A', currentEnd.value)
        }
    } catch (e) {
        toast.error(getApiErrorMessage(e, t('event_elimination.toast_save_score_failed')))
    } finally {
        isSaving.value = false
    }
}

const resetMatch = () => {
    if (!isSubscriptionActive.value) {
        showPremiumModal.value = true
        return
    }
    if (!selectedScoringMatch.value) return
    if (isByeMatch(selectedScoringMatch.value)) {
        toast.info(t('event_elimination.bye_no_scoring_needed'))
        return
    }
    showResetConfirmDialog.value = true
}

const executeResetMatch = async () => {
    if (!selectedScoringMatch.value) return
    isResetting.value = true
    try {
        const matchId = selectedScoringMatch.value.id
        await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/matches/${matchId}/reset`)
        toast.success(t('event_elimination.toast_match_reset_live'))

        // Refresh data
        await fetchBracket()

        // Re-select the match to update UI state
        const updatedMatch = matches.value.find(m => m.id === matchId)
        if (updatedMatch) {
            selectedScoringMatch.value = updatedMatch
        }
    } catch (error) {
        console.error('Failed to reset match:', error)
        toast.error(getApiErrorMessage(error, t('event_elimination.toast_reset_match_failed')))
    } finally {
        isResetting.value = false
    }
}

const finishByeMatch = async (match) => {
    if (!isSubscriptionActive.value) {
        showPremiumModal.value = true
        return
    }
    isEndingMatch.value = true
    try {
        const winnerId = match.entry_a_id || match.entry_b_id
        await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/matches/${match.id}/finish`, {
            winner_entry_id: winnerId
        })
        toast.success(t('event_elimination.toast_match_finished'))
        await fetchBracket()
    } catch (e) {
        toast.error(getApiErrorMessage(e, t('event_elimination.toast_finish_match_failed')))
    } finally {
        isEndingMatch.value = false
    }
}

const endMatch = () => {
    if (!selectedScoringMatch.value || isMatchFinished.value) return
    if (isByeMatch(selectedScoringMatch.value)) {
        finishByeMatch(selectedScoringMatch.value)
        return
    }
    if (!canEndMatch.value) return
    manualWinnerId.value = null // Reset selection
    showEndMatchDialog.value = true
}

const confirmEndMatch = async () => {
    if (!isSubscriptionActive.value) {
        showPremiumModal.value = true
        return
    }
    if (!selectedScoringMatch.value) return

    isEndingMatch.value = true
    try {
        const matchId = selectedScoringMatch.value.id
        initMatchEnds(matchId)

        // Auto-save any ends that have arrow entries before ending match
        const endsData = matchEnds.value[matchId]
        if (endsData && (endsData.A || endsData.B)) {
            const totalEnds = bracket.value?.ends_per_match || 5
            const endNumbersToSave = []
            for (let i = 1; i <= totalEnds; i++) {
                const hasArrowsA = endsData.A?.[i]?.arrows?.some(a => a !== null && a !== '' && a !== undefined)
                const hasArrowsB = endsData.B?.[i]?.arrows?.some(a => a !== null && a !== '' && a !== undefined)
                if (hasArrowsA || hasArrowsB) endNumbersToSave.push(i)
            }
            // Check Shoot-off (End 99)
            const hasShootOffA = endsData.A?.[99]?.arrows?.some(a => a !== null && a !== '' && a !== undefined)
            const hasShootOffB = endsData.B?.[99]?.arrows?.some(a => a !== null && a !== '' && a !== undefined)
            if (hasShootOffA || hasShootOffB) endNumbersToSave.push(99)

            // Save all dirty ends sequentially
            for (const endNo of endNumbersToSave) {
                const endA = endsData.A?.[endNo] || { total: 0, arrows: [] }
                const endB = endsData.B?.[endNo] || { total: 0, arrows: [] }
                try {
                    await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/matches/${matchId}/score`, {
                        end_no: endNo,
                        score_a: endA.total || 0,
                        score_b: endB.total || 0,
                        arrows_a: (endA.arrows || []).filter(a => a !== null && a !== undefined && a !== '').map(a => String(a)),
                        arrows_b: (endB.arrows || []).filter(a => a !== null && a !== undefined && a !== '').map(a => String(a))
                    })
                } catch (saveErr) {
                    console.warn(`Failed to auto-save end ${endNo} before ending match:`, saveErr)
                }
            }
        }

        // Call API endpoint that will auto-calculate winner from saved scores
        await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/matches/${matchId}/end`, {
            winner_entry_id: manualWinnerId.value
        })

        toast.success(t('event_elimination.toast_match_ended'))

        // Close dialog
        showEndMatchDialog.value = false

        // Refresh bracket data to get updated matches
        await fetchBracket()

        // Deselect the match after ending
        selectedScoringMatch.value = null

    } catch (e) {
        console.error('Failed to end match:', e)
        toast.error(getApiErrorMessage(e, t('event_elimination.toast_end_match_failed')))
    } finally {
        isEndingMatch.value = false
    }
}

const updateTarget = async (match) => {
    if (!isSubscriptionActive.value) {
        showPremiumModal.value = true
        return
    }
    try {
        await put(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/targets`, {
            assignments: [
                {
                    match_id: match.id,
                    target_id: match.target_id
                }
            ]
        })
        toast.success(t('event_elimination.toast_target_updated'))
    } catch (e) {
        toast.error(getApiErrorMessage(e, t('event_elimination.toast_update_target_failed')))
    }
}

const autoAssignTargets = async () => {
    if (!isSubscriptionActive.value) {
        showPremiumModal.value = true
        return
    }
    isAutoAssigning.value = true
    try {
        const roundNo = currentRoundNo.value || 1
        await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/targets/auto-assign?round=${roundNo}`)
        toast.success(t('event_elimination.toast_auto_assign_success'))
        await fetchBracket(true)
    } catch (e) {
        toast.error(getApiErrorMessage(e, t('event_elimination.toast_auto_assign_failed')))
    } finally {
        isAutoAssigning.value = false
    }
}

const canFinishMatch = (match) => {
    if (!match || match.winner_entry_id) return false
    const m = matchEnds.value[match.id]
    if (!m || !m.A || !m.B) return false

    // Check if at least one arrow is scored to enable finishing
    const hasAnyArrow = Object.values(m.A).some(e => e?.arrows?.length > 0) ||
        Object.values(m.B).some(e => e?.arrows?.length > 0)

    return hasAnyArrow
}

const finishMatchAction = async (match) => {
    if (!isSubscriptionActive.value) {
        showPremiumModal.value = true
        return
    }
    try {
        const isRecurve = bracket.value?.format === 'recurve_set'
        let winnerId;

        if (isRecurve) {
            const pointsA = calculateSetPoints(match.id, 'A')
            const pointsB = calculateSetPoints(match.id, 'B')
            winnerId = pointsA >= pointsB ? match.entry_a_id : match.entry_b_id
        } else {
            const totalA = Object.values(matchEnds.value[match.id]?.A || {}).reduce((s, e) => s + (e?.total || 0), 0)
            const totalB = Object.values(matchEnds.value[match.id]?.B || {}).reduce((s, e) => s + (e?.total || 0), 0)
            winnerId = totalA >= totalB ? match.entry_a_id : match.entry_b_id
        }

        await post(`/tournaments/${eventId.value}/elimination/brackets/${bracketId.value}/matches/${match.id}/finish`, {
            winner_entry_id: winnerId
        })
        toast.success(t('event_elimination.toast_match_finished'))
        await fetchBracket()
        selectedScoringMatch.value = null
    } catch (e) {
        toast.error(getApiErrorMessage(e, t('event_elimination.toast_finish_match_failed')))
    }
}

const getFullTargetName = (match) => {
    if (!match) return t('event_elimination.no_target')
    if (match.target_name) return match.target_name.startsWith('Target') ? match.target_name : `Target ${match.target_name}`
    return getTargetName(match.target_id || match.target_uuid)
}

const getTargetName = (tid) => {
    if (!tid) return t('event_elimination.no_target')
    const tItem = availableTargets.value.find(o => o.id === tid)
    return tItem ? `Target ${tItem.name}` : t('event_elimination.selected_target')
}

const formatDate = (d) => dayjs(d).format('DD MMM YYYY, HH:mm')
const timeAgo = (d) => dayjs(d).fromNow()

// Bracket visualization
const BASE_MATCH_HEIGHT = 160
const getTotalRounds = computed(() => Object.keys(rounds.value).length)
const isSplitLayout = computed(() => (bracket.value?.bracket_size || 8) >= 4)

const leftSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = 1; i < total; i++) nums.push(i)
    return nums
})

const rightSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = total - 1; i >= 1; i--) nums.push(i)
    return nums
})

const getMatchesForSide = (roundNo, side) => {
    const all = rounds.value[roundNo] || []
    if (parseInt(roundNo) === getTotalRounds.value) return all
    const half = Math.ceil(all.length / 2)
    return side === 'left' ? all.slice(0, half) : all.slice(half)
}

const getSideTotalHeight = computed(() => {
    const size = bracket.value?.bracket_size || 8
    const sideSize = size / 2
    return Math.max(sideSize, 2) * BASE_MATCH_HEIGHT
})

const getSlotHeightForSide = (roundNo) => {
    const r = parseInt(roundNo)
    return Math.pow(2, r - 1) * BASE_MATCH_HEIGHT
}

const calculateConnectorPath = (i, roundNo, side = 'left', isSingle = false) => {
    const r = parseInt(roundNo)
    const slotHeight = getSlotHeightForSide(r)
    const nextSlotHeight = getSlotHeightForSide(r + 1)

    if (isSingle) {
        // Single match connecting to Final Entry A or B
        const y = slotHeight / 2
        const targetY = nextSlotHeight / 2
        const entryOffset = side === 'left' ? -26 : 26
        const targetEY = targetY + entryOffset

        if (side === 'left') {
            return `M 0 ${y} H 40 V ${targetEY} H 80`
        } else {
            return `M 80 ${y} H 40 V ${targetEY} H 0`
        }
    }

    const y1 = (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
    const targetY = (i - 1) * nextSlotHeight + nextSlotHeight / 2

    if (side === 'left') {
        return `M 0 ${y1} H 40 V ${targetY} H 80 M 0 ${y2} H 40 V ${targetY} H 80`
    } else {
        return `M 80 ${y1} H 40 V ${targetY} H 0 M 80 ${y2} H 40 V ${targetY} H 0`
    }
}

function getRoundName(roundNo) {
    const size = bracket.value?.bracket_size || 8
    const totalRounds = Math.log2(size)
    const roundFromEnd = totalRounds - roundNo + 1
    if (roundFromEnd === 1) return t('event_elimination.final') || 'Final'
    if (roundFromEnd === 2) return t('event_elimination.semifinal') || 'Semifinal'
    if (roundFromEnd === 3) return t('event_elimination.quarterfinal') || 'Quarterfinal'
    return t('event_elimination.round_of', { count: Math.pow(2, roundFromEnd) }) || `Round of ${Math.pow(2, roundFromEnd)}`
}

// Auto-re-fetch when route parameters change during client navigation
watch([eventId, bracketId], async ([newId, newBracketId], [oldId, oldBracketId]) => {
    if (newId && newBracketId && (newId !== oldId || newBracketId !== oldBracketId)) {
        await fetchBracket()
        await fetchAvailableTargets()
    }
})

onMounted(async () => {
    await fetchBracket()
    await fetchAvailableTargets()
})
</script>

<style scoped>
.status-badge {
    @apply text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-lg;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from>div,
.modal-leave-to>div {
    transform: scale(0.9) translateY(20px);
}

.modal-enter-active>div,
.modal-leave-active>div {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>