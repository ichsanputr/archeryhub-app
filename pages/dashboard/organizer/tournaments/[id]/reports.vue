<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="tournament?.name ? `${tournament.name} - ${activeTab === 'revenue' ? (isEn ? 'Revenue' : 'Pendapatan') : (isEn ? 'Participants' : 'Peserta')}` : (activeTab === 'revenue' ? (isEn ? 'Revenue' : 'Pendapatan') : (isEn ? 'Participants' : 'Peserta'))"
      :subtitle="tournamentSubtitle"
      :icon="activeTab === 'revenue' ? 'ph:receipt-bold' : 'ph:users-three-bold'"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.sidebar.my_events', 'My Tournaments'), to: '/dashboard/organizer/tournaments' },
        { label: tournament?.name || tournamentTitle || t('dashboard_event_overview.summary_title', 'Overview'), to: `/dashboard/organizer/tournaments/${eventId}/overview` },
        { label: activeTab === 'revenue' ? (isEn ? 'Revenue' : 'Pendapatan') : (isEn ? 'Participants' : 'Peserta') }
      ]"
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <BaseButton
            variant="primary"
            icon="ph:download-simple-bold"
            class="h-10 sm:h-11 px-6 shadow-lg shadow-navy/10 hover:shadow-md transition-all text-xs sm:text-sm font-black tracking-wider cursor-pointer"
            :loading="isExporting"
            @click="handleExportCSV"
          >
            <span>{{ isEn ? 'Export CSV' : 'Ekspor CSV' }}</span>
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>

    <!-- Tab Switcher Bar -->
    <div class="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs flex items-center justify-between flex-wrap gap-3">
      <div class="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-xl w-fit">
        <button
          type="button"
          @click="activeTab = 'participants'"
          :class="activeTab === 'participants' ? 'bg-white text-navy shadow-xs font-black' : 'text-slate-500 hover:text-navy font-bold'"
          class="px-4 py-2 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icon icon="ph:users-three-bold" class="text-sm text-slate-600" />
          <span>{{ isEn ? 'Participants' : 'Peserta' }}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy/5 text-navy">
            {{ participantsList.length }}
          </span>
        </button>

        <button
          type="button"
          @click="activeTab = 'revenue'"
          :class="activeTab === 'revenue' ? 'bg-white text-navy shadow-xs font-black' : 'text-slate-500 hover:text-navy font-bold'"
          class="px-4 py-2 rounded-lg text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icon icon="ph:coins-bold" class="text-sm text-slate-600" />
          <span>{{ isEn ? 'Revenue' : 'Pendapatan' }}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy/5 text-navy font-mono">
            Rp {{ formatPrice(totalNetRevenue) }}
          </span>
        </button>
      </div>

      <!-- Quick Summary Count -->
      <div class="px-3 py-1.5 text-xs text-slate-500 font-medium">
        <span v-if="activeTab === 'participants'">
          {{ filteredParticipants.length }} {{ isEn ? 'archers shown' : 'peserta ditampilkan' }}
        </span>
        <span v-else>
          {{ filteredPayments.length }} {{ isEn ? 'transactions shown' : 'transaksi ditampilkan' }}
        </span>
      </div>
    </div>

    <!-- Filter Dialog Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showFilterModal"
          class="fixed inset-0 z-[200] overflow-y-auto bg-navy/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          @click.self="showFilterModal = false"
        >
          <div
            class="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg mx-auto relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            @click.stop
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 shrink-0">
                  <Icon icon="ph:sliders-horizontal-bold" class="text-lg text-slate-700" />
                </div>
                <div>
                  <h2 class="text-base sm:text-lg font-black text-navy leading-tight">
                    {{ isEn ? 'Filter Data' : 'Filter Data' }}
                  </h2>
                  <div class="text-xs text-slate-500 font-medium mt-0.5">
                    {{ isEn ? 'Filter records by date range, category, and status' : 'Saring data berdasarkan rentang tanggal, kategori, dan status' }}
                  </div>
                </div>
              </div>
              <button
                type="button"
                @click="showFilterModal = false"
                class="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-navy transition-colors flex items-center justify-center cursor-pointer"
              >
                <Icon icon="ph:x-bold" class="text-sm" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
              <!-- 1. Rentang Tanggal (Date Range) -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-navy">
                  {{ isEn ? 'Date Range' : 'Rentang Tanggal' }}
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span class="text-[11px] font-semibold text-slate-500 block mb-1">{{ isEn ? 'From Date' : 'Dari Tanggal' }}</span>
                    <BaseDatePicker
                      v-model="draftFilters.startDate"
                      :placeholder="isEn ? 'Select start date' : 'Pilih tanggal awal'"
                      :max-date="draftFilters.endDate"
                      clearable
                    />
                  </div>
                  <div>
                    <span class="text-[11px] font-semibold text-slate-500 block mb-1">{{ isEn ? 'To Date' : 'Sampai Tanggal' }}</span>
                    <BaseDatePicker
                      v-model="draftFilters.endDate"
                      :placeholder="isEn ? 'Select end date' : 'Pilih tanggal akhir'"
                      :min-date="draftFilters.startDate"
                      clearable
                    />
                  </div>
                </div>
              </div>

              <!-- 2. Kategori Lomba (Category) -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-navy">
                  {{ isEn ? 'Competition Category' : 'Kategori Lomba' }}
                </label>
                <select
                  v-model="draftFilters.category"
                  class="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-navy outline-none focus:ring-2 focus:ring-navy/20 cursor-pointer"
                >
                  <option value="">{{ isEn ? 'All Categories' : 'Semua Kategori' }}</option>
                  <option v-for="cat in categoriesList" :key="cat.uuid || cat.id" :value="cat.uuid || cat.id">
                    {{ cat.category_name_custom || cat.name }}
                  </option>
                </select>
              </div>

              <!-- 3. Status Pembayaran (Payment Status) -->
              <div class="space-y-2">
                <label class="block text-xs font-bold text-navy">
                  {{ isEn ? 'Payment Status' : 'Status Pembayaran' }}
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    @click="draftFilters.paymentStatus = ''"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      !draftFilters.paymentStatus
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'All' : 'Semua' }}
                  </button>
                  <button
                    type="button"
                    @click="draftFilters.paymentStatus = 'paid'"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      draftFilters.paymentStatus === 'paid'
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'Paid' : 'Lunas' }}
                  </button>
                  <button
                    type="button"
                    @click="draftFilters.paymentStatus = 'pending'"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      draftFilters.paymentStatus === 'pending'
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'Pending' : 'Menunggu' }}
                  </button>
                  <button
                    type="button"
                    @click="draftFilters.paymentStatus = 'expired'"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      draftFilters.paymentStatus === 'expired'
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'Expired' : 'Kedaluwarsa' }}
                  </button>
                  <button
                    type="button"
                    @click="draftFilters.paymentStatus = 'cancelled'"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      draftFilters.paymentStatus === 'cancelled'
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'Cancelled' : 'Dibatalkan' }}
                  </button>
                </div>
              </div>

              <!-- 4. Presensi / Check-in Status (Only for Participants Tab) -->
              <div v-if="activeTab === 'participants'" class="space-y-2">
                <label class="block text-xs font-bold text-navy">
                  {{ isEn ? 'Check-in Status' : 'Status Presensi Venue' }}
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    @click="draftFilters.checkinStatus = ''"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      !draftFilters.checkinStatus
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'All' : 'Semua' }}
                  </button>
                  <button
                    type="button"
                    @click="draftFilters.checkinStatus = 'checked_in'"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      draftFilters.checkinStatus === 'checked_in'
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'Checked-in' : 'Hadir' }}
                  </button>
                  <button
                    type="button"
                    @click="draftFilters.checkinStatus = 'pending'"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center',
                      draftFilters.checkinStatus === 'pending'
                        ? 'bg-navy text-white border-navy font-black shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    ]"
                  >
                    {{ isEn ? 'Not Checked-in' : 'Belum Hadir' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                @click="resetDraftFilters"
                class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {{ isEn ? 'Reset' : 'Reset Filter' }}
              </button>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="showFilterModal = false"
                  class="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {{ isEn ? 'Cancel' : 'Batal' }}
                </button>
                <button
                  type="button"
                  @click="applyFilters"
                  class="px-5 py-2.5 bg-navy text-white hover:bg-navy-dark text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  {{ isEn ? 'Apply Filters' : 'Terapkan' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-6">
      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 h-96 animate-pulse"></div>
    </div>

    <!-- Main Content Area -->
    <div v-else class="space-y-6">
      <!-- TAB 1: PARTICIPANTS TABLE -->
      <div v-if="activeTab === 'participants'">
        <DashboardDataTable
          :items="filteredParticipants"
          :columns="participantColumns"
          :loading="isLoading"
          :searchable="true"
          :search-placeholder="isEn ? 'Search by archer name, club, or email...' : 'Cari nama atlet, klub, atau email...'"
          :has-filter-modal="true"
          :filter-button-label="isEn ? 'Filter' : 'Filter'"
          :active-filter-count="activeFilterCount"
          :active-filter-chips="activeFilterChips"
          :show-reset-button="hasActiveFilters"
          count-icon="ph:users-three-bold"
          :count-unit="isEn ? 'archers' : 'atlet'"
          :show-count-badge="true"
          :empty-title="isEn ? 'No participants found' : 'Belum ada peserta terdaftar'"
          empty-icon="ph:users-three-bold"
          :items-per-page="25"
          @search="searchQuery = $event"
          @open-filter="openFilterModal"
          @reset-filters="resetAllFilters"
          @remove-chip="removeFilterChip"
        >
          <!-- Profile Slot -->
          <template #item-profile="{ item }">
            <div class="flex items-center gap-3 py-1">
              <div class="size-10 rounded-full bg-slate-100 flex items-center justify-center text-navy font-bold text-xs border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
                <img :src="useImageOrDefault(item.avatar_url, item.full_name || item.name)" class="size-full object-cover" />
              </div>
              <div class="min-w-0 py-0.5">
                <div class="text-xs sm:text-sm font-black text-navy leading-tight hover:text-slate-800 transition-colors truncate">
                  {{ item.full_name || item.name || '-' }}
                </div>
                <div class="text-[11px] text-slate-400 font-medium mt-0.5 truncate">
                  {{ item.email || item.phone || '-' }}
                </div>
              </div>
            </div>
          </template>

          <!-- Category Slot -->
          <template #item-category="{ item }">
            <div class="py-1">
              <span class="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {{ item.category_name || item.division || '-' }}
              </span>
            </div>
          </template>

          <!-- Club & City Slot -->
          <template #item-club="{ item }">
            <div class="flex flex-col py-1">
              <span class="text-xs font-bold text-slate-700 leading-snug truncate">{{ item.club_name || item.club || '-' }}</span>
              <span v-if="item.city || item.contingent" class="text-[10px] text-slate-400 font-semibold tracking-wider truncate">
                {{ item.city || item.contingent }}
              </span>
            </div>
          </template>

          <!-- Payment Status Slot -->
          <template #item-status="{ item }">
            <div class="py-1">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize"
                :class="getStatusClass(item.payment_status || item.status)"
              >
                {{ getDisplayStatus(item.payment_status || item.status) }}
              </span>
            </div>
          </template>

          <!-- Checkin Slot -->
          <template #item-checkin="{ item }">
            <div class="py-1">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border"
                :class="item.checked_in || item.last_reregistration_at
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'"
              >
                <Icon :icon="item.checked_in || item.last_reregistration_at ? 'ph:check-circle-bold' : 'ph:minus-circle-bold'" class="text-xs text-slate-600" />
                <span>{{ item.checked_in || item.last_reregistration_at ? (isEn ? 'Checked-in' : 'Hadir') : (isEn ? 'Pending' : 'Belum Hadir') }}</span>
              </span>
            </div>
          </template>

          <!-- Registered Date Slot -->
          <template #item-registered_at="{ item }">
            <div class="py-1 text-xs text-slate-600 font-medium">
              {{ formatDate(item.registration_date || item.created_at) }}
            </div>
          </template>

          <!-- Actions Slot -->
          <template #actions="{ item }">
            <div class="flex items-center justify-end gap-1.5">
              <BaseButton
                :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${item.archer_id || item.athlete_code || item.id}`"
                variant="white"
                size="sm"
                icon="ph:eye-bold"
                class="h-9 w-9 p-0 text-slate-500 hover:text-navy border-slate-200 shadow-2xs"
                :title="isEn ? 'View Detail' : 'Lihat Detail'"
              />
            </div>
          </template>
        </DashboardDataTable>
      </div>

      <!-- TAB 2: REVENUE TABLE (CLEAN TABLE NO CARDS NO BANNERS) -->
      <div v-if="activeTab === 'revenue'">
        <DashboardDataTable
          :items="filteredPayments"
          :columns="revenueColumns"
          :loading="isLoading"
          :searchable="true"
          :search-placeholder="isEn ? 'Search by reference or athlete name...' : 'Cari referensi atau nama atlet...'"
          :has-filter-modal="true"
          :filter-button-label="isEn ? 'Filter' : 'Filter'"
          :active-filter-count="activeFilterCount"
          :active-filter-chips="activeFilterChips"
          :show-reset-button="hasActiveFilters"
          count-icon="ph:receipt-bold"
          :count-unit="isEn ? 'transactions' : 'transaksi'"
          :show-count-badge="true"
          :empty-title="isEn ? 'No revenue transactions found' : 'Belum ada data transaksi pendapatan'"
          empty-icon="ph:receipt-bold"
          :items-per-page="25"
          @search="searchQuery = $event"
          @open-filter="openFilterModal"
          @reset-filters="resetAllFilters"
          @remove-chip="removeFilterChip"
        >
          <!-- Reference Slot -->
          <template #item-reference="{ item }">
            <div class="py-1">
              <span class="font-mono text-xs font-bold text-navy">
                {{ item.reference || item.invoice_no || item.id || '-' }}
              </span>
            </div>
          </template>

          <!-- Athlete / Payer Slot -->
          <template #item-athlete="{ item }">
            <div class="py-1">
              <div class="text-xs sm:text-sm font-bold text-navy">
                {{ item.athlete_name || item.user_name || item.full_name || item.name || '-' }}
              </div>
              <div v-if="item.category_name" class="text-[11px] text-slate-400 font-medium mt-0.5">
                {{ item.category_name }}
              </div>
            </div>
          </template>

          <!-- Payment Method Slot -->
          <template #item-method="{ item }">
            <div class="py-1">
              <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {{ formatPaymentMethod(item.payment_method || item.method) }}
              </span>
            </div>
          </template>

          <!-- Amount Slot -->
          <template #item-amount="{ item }">
            <div class="py-1 font-mono text-xs font-black text-navy text-right">
              Rp {{ formatPrice(item.amount || item.total_amount || item.payment_amount || 0) }}
            </div>
          </template>

          <!-- Status Slot -->
          <template #item-status="{ item }">
            <div class="py-1">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize"
                :class="getStatusClass(item.status || item.payment_status)"
              >
                {{ getDisplayStatus(item.status || item.payment_status) }}
              </span>
            </div>
          </template>

          <!-- Paid At Date Slot -->
          <template #item-paid_at="{ item }">
            <div class="py-1 text-xs text-slate-600 font-medium">
              {{ formatDate(item.paid_at || item.created_at || item.registration_date) }}
            </div>
          </template>
        </DashboardDataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { useImageOrDefault } from '~/composables/useImageHelper'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseDatePicker from '~/components/common/BaseDatePicker.vue'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const api = useApi()
const apiBaseUrl = useApiBaseUrl()
const { t, locale } = useDashboardI18n()
const { tournamentTitle } = useTournamentContext()
const isEn = computed(() => locale.value === 'en')

const eventId = computed(() => (route.params.id as string) || (route.params.slug as string))

const activeTab = ref<'participants' | 'revenue'>('participants')

useHead({
  title: computed(() => `${activeTab.value === 'revenue' ? (isEn.value ? 'Revenue' : 'Pendapatan') : (isEn.value ? 'Participants' : 'Peserta')} - Archeris Dashboard`)
})

const isLoading = ref(true)
const isExporting = ref(false)
const searchQuery = ref('')
const showFilterModal = ref(false)

const filters = reactive({
  startDate: '',
  endDate: '',
  category: '',
  paymentStatus: '',
  checkinStatus: ''
})

const draftFilters = reactive({
  startDate: '',
  endDate: '',
  category: '',
  paymentStatus: '',
  checkinStatus: ''
})

const tournament = ref<any>(null)
const participantsList = ref<any[]>([])
const categoriesList = ref<any[]>([])
const paymentsList = ref<any[]>([])

const tournamentSubtitle = computed(() => {
  if (!tournament.value?.name) return isEn.value ? 'Tournament reports and participants data' : 'Laporan dan data peserta turnamen panahan'
  const venue = tournament.value?.venue || tournament.value?.location || (isEn.value ? 'Venue' : 'Lokasi')
  const date = tournament.value?.start_date ? new Date(tournament.value.start_date).toLocaleDateString(isEn.value ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
  return `${venue} ${date ? '• ' + date : ''}`
})

const participantColumns = computed(() => [
  { key: 'profile', label: isEn.value ? 'Archer / Athlete' : 'Pemanah / Atlet', sortable: true },
  { key: 'category', label: isEn.value ? 'Category' : 'Kategori Lomba', sortable: true },
  { key: 'club', label: isEn.value ? 'Club / Contingent' : 'Klub / Kontingen', sortable: true },
  { key: 'status', label: isEn.value ? 'Payment Status' : 'Status Pembayaran', sortable: true },
  { key: 'checkin', label: isEn.value ? 'Venue Check-in' : 'Presensi Venue', sortable: true },
  { key: 'registered_at', label: isEn.value ? 'Registration Date' : 'Tanggal Daftar', sortable: true },
  { key: 'actions', label: '', align: 'right' }
])

const revenueColumns = computed(() => [
  { key: 'reference', label: isEn.value ? 'Reference / ID' : 'No. Referensi', sortable: true },
  { key: 'athlete', label: isEn.value ? 'Payer / Athlete' : 'Nama Pembayar / Atlet', sortable: true },
  { key: 'method', label: isEn.value ? 'Payment Method' : 'Metode Pembayaran', sortable: true },
  { key: 'amount', label: isEn.value ? 'Amount' : 'Nominal', align: 'right', sortable: true },
  { key: 'status', label: isEn.value ? 'Status' : 'Status Pembayaran', sortable: true },
  { key: 'paid_at', label: isEn.value ? 'Payment Date' : 'Tanggal Bayar', sortable: true }
])

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.startDate || filters.endDate) count++
  if (filters.category) count++
  if (filters.paymentStatus) count++
  if (activeTab.value === 'participants' && filters.checkinStatus) count++
  return count
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0 || !!searchQuery.value)

const activeFilterChips = computed(() => {
  const chips: { key: string; label: string }[] = []

  if (filters.startDate || filters.endDate) {
    const s = filters.startDate || '...'
    const e = filters.endDate || '...'
    chips.push({ key: 'date', label: `${isEn.value ? 'Date' : 'Tanggal'}: ${s} - ${e}` })
  }

  if (filters.category) {
    const found = categoriesList.value.find((c: any) => (c.uuid || c.id) === filters.category)
    chips.push({ key: 'category', label: `${isEn.value ? 'Category' : 'Kategori'}: ${found?.category_name_custom || found?.name || filters.category}` })
  }

  if (filters.paymentStatus) {
    chips.push({ key: 'paymentStatus', label: `${isEn.value ? 'Payment' : 'Status'}: ${getDisplayStatus(filters.paymentStatus)}` })
  }

  if (activeTab.value === 'participants' && filters.checkinStatus) {
    chips.push({ key: 'checkinStatus', label: `${isEn.value ? 'Check-in' : 'Presensi'}: ${filters.checkinStatus === 'checked_in' ? (isEn.value ? 'Checked-in' : 'Hadir') : (isEn.value ? 'Pending' : 'Belum Hadir')}` })
  }

  return chips
})

const openFilterModal = () => {
  draftFilters.startDate = filters.startDate
  draftFilters.endDate = filters.endDate
  draftFilters.category = filters.category
  draftFilters.paymentStatus = filters.paymentStatus
  draftFilters.checkinStatus = filters.checkinStatus
  showFilterModal.value = true
}

const applyFilters = () => {
  filters.startDate = draftFilters.startDate
  filters.endDate = draftFilters.endDate
  filters.category = draftFilters.category
  filters.paymentStatus = draftFilters.paymentStatus
  filters.checkinStatus = draftFilters.checkinStatus
  showFilterModal.value = false
}

const resetDraftFilters = () => {
  draftFilters.startDate = ''
  draftFilters.endDate = ''
  draftFilters.category = ''
  draftFilters.paymentStatus = ''
  draftFilters.checkinStatus = ''
}

const resetAllFilters = () => {
  filters.startDate = ''
  filters.endDate = ''
  filters.category = ''
  filters.paymentStatus = ''
  filters.checkinStatus = ''
  searchQuery.value = ''
  resetDraftFilters()
}

const removeFilterChip = (key: string) => {
  if (key === 'date') {
    filters.startDate = ''
    filters.endDate = ''
    draftFilters.startDate = ''
    draftFilters.endDate = ''
  } else if (key === 'category') {
    filters.category = ''
    draftFilters.category = ''
  } else if (key === 'paymentStatus') {
    filters.paymentStatus = ''
    draftFilters.paymentStatus = ''
  } else if (key === 'checkinStatus') {
    filters.checkinStatus = ''
    draftFilters.checkinStatus = ''
  }
}

const filteredParticipants = computed(() => {
  return participantsList.value.filter((p: any) => {
    // Search query filter
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const name = (p.full_name || p.name || '').toLowerCase()
      const email = (p.email || '').toLowerCase()
      const club = (p.club_name || p.club || '').toLowerCase()
      const cat = (p.category_name || p.division || '').toLowerCase()
      if (!name.includes(q) && !email.includes(q) && !club.includes(q) && !cat.includes(q)) {
        return false
      }
    }

    // Category filter
    if (filters.category) {
      const matchCat = p.category_id === filters.category || 
                       p.category_uuid === filters.category ||
                       p.category_name === filters.category
      if (!matchCat) return false
    }

    // Payment status filter
    if (filters.paymentStatus) {
      const s = (p.payment_status || p.status || '').toLowerCase()
      if (filters.paymentStatus === 'paid' && !['paid', 'completed', 'success', 'settled', 'lunas'].includes(s)) return false
      if (filters.paymentStatus === 'pending' && !['pending', 'waiting', 'menunggu', 'awaiting_verification'].includes(s)) return false
      if (filters.paymentStatus === 'expired' && s !== 'expired') return false
      if (filters.paymentStatus === 'cancelled' && !['cancelled', 'canceled'].includes(s)) return false
    }

    // Checkin status filter
    if (filters.checkinStatus) {
      const isChecked = !!(p.checked_in || p.last_reregistration_at)
      if (filters.checkinStatus === 'checked_in' && !isChecked) return false
      if (filters.checkinStatus === 'pending' && isChecked) return false
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      const rawDate = p.registration_date || p.created_at
      if (rawDate) {
        const d = new Date(rawDate).toISOString().split('T')[0]
        if (filters.startDate && d < filters.startDate) return false
        if (filters.endDate && d > filters.endDate) return false
      }
    }

    return true
  })
})

const filteredPayments = computed(() => {
  let list = paymentsList.value
  if (!list || list.length === 0) {
    // Fallback: build payments view from participant payments
    list = participantsList.value.map((p: any) => ({
      reference: p.payment_id || p.qr_raw || (p.uuid ? `TRX-${p.uuid.substring(0, 8).toUpperCase()}` : '-'),
      athlete_name: p.full_name || p.name || '-',
      category_name: p.category_name || p.division || '-',
      category_id: p.category_id,
      payment_method: p.payment_method || 'Online Gateway',
      amount: Number(p.payment_amount || p.amount || tournament.value?.entry_fee || 0),
      status: p.payment_status || p.status || 'paid',
      paid_at: p.registration_date || p.created_at,
      created_at: p.created_at || p.registration_date
    }))
  }

  return list.filter((pay: any) => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const ref = (pay.reference || pay.invoice_no || '').toLowerCase()
      const name = (pay.athlete_name || pay.user_name || '').toLowerCase()
      const method = (pay.payment_method || pay.method || '').toLowerCase()
      if (!ref.includes(q) && !name.includes(q) && !method.includes(q)) return false
    }

    if (filters.category && pay.category_id) {
      if (pay.category_id !== filters.category) return false
    }

    if (filters.paymentStatus) {
      const s = (pay.status || pay.payment_status || '').toLowerCase()
      if (filters.paymentStatus === 'paid' && !['paid', 'completed', 'success', 'settled', 'lunas'].includes(s)) return false
      if (filters.paymentStatus === 'pending' && !['pending', 'waiting', 'menunggu', 'awaiting_verification'].includes(s)) return false
      if (filters.paymentStatus === 'expired' && s !== 'expired') return false
      if (filters.paymentStatus === 'cancelled' && !['cancelled', 'canceled'].includes(s)) return false
    }

    if (filters.startDate || filters.endDate) {
      const rawDate = pay.paid_at || pay.created_at
      if (rawDate) {
        const d = new Date(rawDate).toISOString().split('T')[0]
        if (filters.startDate && d < filters.startDate) return false
        if (filters.endDate && d > filters.endDate) return false
      }
    }

    return true
  })
})

const totalNetRevenue = computed(() => {
  const paidItems = filteredPayments.value.filter((p: any) => ['paid', 'completed', 'success', 'settled', 'lunas'].includes((p.status || p.payment_status || '').toLowerCase()))
  const gross = paidItems.reduce((sum: number, p: any) => sum + Number(p.amount || p.total_amount || p.payment_amount || 0), 0)
  return gross * 0.95
})

const formatPrice = (num: number) => {
  return Number(num || 0).toLocaleString(isEn.value ? 'en-US' : 'id-ID')
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString(isEn.value ? 'en-US' : 'id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const formatPaymentMethod = (method?: string) => {
  if (!method) return isEn.value ? 'Online' : 'Otomatis'
  const m = method.toLowerCase()
  if (m.includes('mayar') || m.includes('qris') || m.includes('va')) return 'QRIS / VA (Mayar)'
  if (m.includes('paypal')) return 'PayPal Global'
  if (m.includes('manual') || m.includes('transfer')) return isEn.value ? 'Bank Transfer' : 'Transfer Bank'
  if (m.includes('cash') || m.includes('tunai')) return isEn.value ? 'Cash' : 'Tunai'
  return method
}

const getStatusClass = (status?: string) => {
  const s = (status || '').toLowerCase()
  if (['paid', 'completed', 'success', 'settled', 'lunas'].includes(s)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (['pending', 'waiting', 'menunggu'].includes(s)) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

const getDisplayStatus = (status?: string) => {
  const s = (status || '').toLowerCase()
  if (['paid', 'completed', 'success', 'settled', 'lunas'].includes(s)) return isEn.value ? 'Paid' : 'Lunas'
  if (['pending', 'waiting', 'menunggu', 'awaiting_verification'].includes(s)) return isEn.value ? 'Pending' : 'Menunggu'
  if (['expired'].includes(s)) return isEn.value ? 'Expired' : 'Kedaluwarsa'
  if (['failed', 'cancelled', 'canceled', 'rejected'].includes(s)) return isEn.value ? 'Cancelled' : 'Dibatalkan'
  return status || '-'
}

const fetchTournamentData = async () => {
  isLoading.value = true
  const id = eventId.value
  try {
    const [tRes, catsRes, participantsRes, paymentsRes] = await Promise.all([
      api.get(`/tournaments/${id}`).catch(() => null),
      api.get(`/tournaments/${id}/categories`).catch(() => null),
      api.get(`/tournaments/${id}/participants?limit=1000`).catch(() => null),
      api.get(`/tournaments/${id}/payments`).catch(() => null)
    ])

    tournament.value = tRes?.tournament || tRes?.data || tRes || {}
    categoriesList.value = catsRes?.categories || catsRes?.data || (Array.isArray(catsRes) ? catsRes : [])
    participantsList.value = participantsRes?.participants || participantsRes?.data || (Array.isArray(participantsRes) ? participantsRes : [])
    paymentsList.value = Array.isArray(paymentsRes) ? paymentsRes : (paymentsRes?.invoices || paymentsRes?.payments || paymentsRes?.data || [])
  } catch (err) {
    console.error('Failed to fetch tournament data:', err)
  } finally {
    isLoading.value = false
  }
}

const handleExportCSV = async () => {
  isExporting.value = true
  try {
    if (activeTab.value === 'participants') {
      try {
        const url = `${apiBaseUrl}/events/${eventId.value}/participants/export`
        const res = await fetch(url, {
          credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to export CSV')
        const blob = await res.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = downloadUrl
        a.download = `participants-${eventId.value}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(downloadUrl)
      } catch (err) {
        console.error('Failed to export CSV via fetch, falling back to anchor download:', err)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = `${apiBaseUrl}/events/${eventId.value}/participants/export`
        a.download = `participants-${eventId.value}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } else {
      if (filteredPayments.value.length === 0) {
        alert(isEn.value ? 'No revenue transactions to export.' : 'Tidak ada data transaksi pendapatan untuk diekspor.')
        return
      }

      const headers = ['No', isEn.value ? 'Reference' : 'No. Referensi', isEn.value ? 'Payer Name' : 'Nama Pembayar', isEn.value ? 'Category' : 'Kategori', isEn.value ? 'Payment Method' : 'Metode Pembayaran', isEn.value ? 'Amount' : 'Nominal', isEn.value ? 'Status' : 'Status', isEn.value ? 'Payment Date' : 'Tanggal Bayar']
      const rows = filteredPayments.value.map((pay: any, idx: number) => [
        idx + 1,
        `"${pay.reference || pay.invoice_no || pay.id || '-'}"`,
        `"${pay.athlete_name || pay.user_name || '-'}"`,
        `"${pay.category_name || '-'}"`,
        `"${formatPaymentMethod(pay.payment_method || pay.method)}"`,
        pay.amount || pay.total_amount || 0,
        `"${getDisplayStatus(pay.status || pay.payment_status)}"`,
        `"${formatDate(pay.paid_at || pay.created_at)}"`
      ])

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', `revenue-${eventId.value}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  } finally {
    isExporting.value = false
  }
}

onMounted(() => {
  fetchTournamentData()
})
</script>
