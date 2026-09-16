<template>
  <div class="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
    <main class="flex-grow pt-20 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <div class="max-w-lg w-full bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 text-center shadow-xl space-y-6">
        <div class="relative size-20 mx-auto">
          <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
          <div class="relative size-20 rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Icon icon="ph:check-circle-bold" class="text-4xl" />
          </div>
        </div>

        <div class="space-y-2">
          <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 capitalize tracking-widest">
            {{ t("org_subscription_success.badge") }}
          </span>
          <h1 class="text-3xl font-black text-navy tracking-tight pt-2">{{ t("org_subscription_success.title") }}</h1>
          <div class="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
            {{ t("org_subscription_success.desc") }}
          </div>
        </div>

        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs space-y-3">
          <div class="flex items-center gap-2 font-bold text-navy">
            <Icon icon="ph:sparkle-bold" class="text-primary text-sm" />
            <span>{{ t("org_subscription_success.activated_features") }}</span>
          </div>
          <ul class="space-y-2 text-slate-600 font-medium pl-1">
            <li class="flex items-center gap-2">
              <Icon icon="ph:check-bold" class="text-emerald-500 shrink-0" />
              <span>{{ t("org_subscription_success.feat_1") }}</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="ph:check-bold" class="text-emerald-500 shrink-0" />
              <span>{{ t("org_subscription_success.feat_2") }}</span>
            </li>
            <li class="flex items-center gap-2">
              <Icon icon="ph:check-bold" class="text-emerald-500 shrink-0" />
              <span>{{ t("org_subscription_success.feat_3") }}</span>
            </li>
          </ul>
        </div>

        <div class="space-y-3 pt-2">
          <BaseButton to="/dashboard/organizer/tournaments" variant="navy" size="lg" class="w-full justify-center font-bold">
            <Icon icon="ph:trophy-bold" class="mr-2" /> {{ t("org_subscription_success.create_event_btn") }}
          </BaseButton>

          <BaseButton to="/dashboard/organizer" variant="white" size="md" class="w-full justify-center">
            {{ t("org_subscription_success.back_to_dashboard") }}
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
definePageMeta({ layout: 'dashboard' })

useHead({
  title: computed(() => (t ? t('org_subscription_success.title', 'Berhasil Berlangganan') : 'Berhasil Berlangganan') + ' - Archeris.net')
})
</script>