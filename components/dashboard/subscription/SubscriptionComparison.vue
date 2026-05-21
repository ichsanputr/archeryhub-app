<template>
    <div class="space-y-6">
        <div class="flex items-center gap-3">
            <div
                class="size-8 bg-navy border border-navy rounded-lg flex items-center justify-center text-btn-inverse shadow-sm">
                <Icon icon="ph:scales-bold" class="text-lg" />
            </div>
            <h2 class="text-lg font-extrabold text-navy">{{ t('subscription.comparison.title', 'Perbandingan Detail') }}</h2>
        </div>

        <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden overflow-x-auto">
            <table class="w-full text-left min-w-[600px]">
                <thead>
                    <tr class="bg-slate-50/50 border-b border-gray-100">
                        <th class="px-8 py-5 text-[10px] font-black text-gray-400 tracking-[0.2em]">{{ t('subscription.comparison.feature_header', 'Fitur Utama') }}</th>
                        <th
                            class="px-8 py-5 text-center text-xs font-black text-navy tracking-widest border-l border-gray-50">
                            {{ t('subscription.comparison.standard_header', 'Standar') }}</th>
                        <th
                            class="px-8 py-5 text-center text-xs font-black text-primary tracking-widest border-l border-gray-50 bg-primary/5">
                            {{ t('subscription.comparison.elite_header', 'Elite') }}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="row in data" :key="row.feature" class="group hover:bg-slate-50/30 transition-colors">
                        <td class="px-8 py-4">
                            <div class="flex items-center gap-4">
                                <Icon :icon="row.icon"
                                    class="text-lg text-gray-400 group-hover:text-primary transition-colors" />
                                <span class="text-sm font-bold text-navy/80">{{ row.feature }}</span>
                            </div>
                        </td>
                        <td class="px-8 py-4 text-center border-l border-gray-100">
                            <template v-if="typeof row.basic === 'boolean'">
                                <Icon :icon="row.basic ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                    class="text-xl mx-auto" :class="row.basic ? 'text-green-500' : 'text-gray-200'" />
                            </template>
                            <span v-else class="text-xs font-black text-navy/60">{{ row.basic }}</span>
                        </td>
                        <td class="px-8 py-4 text-center border-l border-gray-100 bg-primary/5">
                            <template v-if="typeof row.elite === 'boolean'">
                                <Icon :icon="row.elite ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                    class="text-xl mx-auto" :class="row.elite ? 'text-primary' : 'text-gray-200'" />
                            </template>
                            <span v-else class="text-xs font-black text-navy">{{ row.elite }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="p-4 bg-slate-50/50 text-center border-t border-gray-50">
                    <div class="text-[10px] text-gray-400 font-bold tracking-[0.2em]">{{ t('subscription.comparison.downgrade_note', '* Downgrade akan berlaku setelah periode tagihan berjalan berakhir.') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

defineProps({
    data: Array
})
</script>
