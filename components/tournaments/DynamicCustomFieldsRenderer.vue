<template>
    <div v-if="filteredFields.length > 0" class="grid grid-cols-1 md:grid-cols-12 gap-4">
        <template v-for="field in filteredFields" :key="field.uuid">
            <!-- ========================================== -->
            <!-- 1. SECTION HEADING BLOCK -->
            <!-- ========================================== -->
            <div
                v-if="field.element_type === 'heading'"
                :class="getGridColClass(field.col_span || 12)"
                class="pt-3 pb-1"
            >
                <div class="border-b border-slate-200 pb-2.5">
                    <h3 class="text-base sm:text-lg font-black text-navy tracking-tight flex items-center gap-2">
                        <span class="size-2 rounded-full bg-primary inline-block"></span>
                        <span>{{ field.label_id }}</span>
                    </h3>
                    <div v-if="field.description_id" class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                        {{ field.description_id }}
                    </div>
                </div>
            </div>

            <!-- ========================================== -->
            <!-- 2. DIVIDER LINE BLOCK -->
            <!-- ========================================== -->
            <div
                v-else-if="field.element_type === 'divider'"
                :class="getGridColClass(field.col_span || 12)"
                class="py-1"
            >
                <hr class="border-t border-slate-200 my-1.5" />
            </div>

            <!-- ========================================== -->
            <!-- 3. SPACER / VERTICAL GAP BLOCK -->
            <!-- ========================================== -->
            <div
                v-else-if="field.element_type === 'spacer'"
                :class="getGridColClass(field.col_span || 12)"
                :style="{ height: field.style_config?.height || '24px' }"
            ></div>

            <!-- ========================================== -->
            <!-- 4. NOTICE / ALERT CALLOUT BLOCK -->
            <!-- ========================================== -->
            <div
                v-else-if="field.element_type === 'notice'"
                class="rounded-2xl p-4 sm:p-5 border shadow-2xs"
                :class="[getGridColClass(field.col_span || 12), getNoticeStyle(field.style_config?.variant || 'info')]"
            >
                <div class="flex items-start gap-3">
                    <Icon :icon="getNoticeIcon(field.style_config?.variant || 'info')" class="text-xl shrink-0 mt-0.5" />
                    <div class="text-xs sm:text-sm leading-relaxed">
                        <div class="font-bold">{{ field.label_id }}</div>
                        <div v-if="field.description_id" class="opacity-90 mt-1">{{ field.description_id }}</div>
                    </div>
                </div>
            </div>

            <!-- ========================================== -->
            <!-- 5. INPUT DATA FIELD (WITH MULTI-COLUMN) -->
            <!-- ========================================== -->
            <div
                v-else
                :class="getGridColClass(field.col_span || 12)"
                class="flex flex-col gap-1.5"
            >
                <!-- Label -->
                <label class="text-navy text-xs sm:text-sm font-bold ml-0.5 flex items-center gap-1">
                    {{ field.label_id }}
                    <span v-if="field.is_required" class="text-rose-500 font-bold">*</span>
                </label>

                <!-- Description / Help text -->
                <div v-if="field.description_id" class="text-xs text-slate-500 ml-0.5 mb-0.5 leading-relaxed">
                    {{ field.description_id }}
                </div>

                <!-- Text & Number Inputs -->
                <div v-if="['text', 'number'].includes(field.field_type)">
                    <BaseInput
                        :model-value="getValue(field.field_key)"
                        :type="field.field_type === 'number' ? 'number' : 'text'"
                        :placeholder="field.placeholder_id || 'Masukkan ' + field.label_id"
                        :disabled="disabled"
                        :required="field.is_required"
                        @update:model-value="val => updateValue(field.field_key, val)"
                    />
                </div>

                <!-- Textarea -->
                <div v-else-if="field.field_type === 'textarea'">
                    <textarea
                        :value="getValue(field.field_key)"
                        :placeholder="field.placeholder_id || 'Tuliskan catatan Anda di sini...'"
                        :disabled="disabled"
                        :required="field.is_required"
                        rows="3"
                        class="w-full p-3.5 rounded-xl border border-slate-200 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 text-xs sm:text-sm font-medium text-navy outline-none transition-all placeholder:text-slate-400"
                        @input="e => updateValue(field.field_key, e.target.value)"
                    ></textarea>
                </div>

                <!-- Custom Select Dropdown using BaseSelect -->
                <div v-else-if="field.field_type === 'select'">
                    <BaseSelect
                        :model-value="getValue(field.field_key) || ''"
                        :items="formatSelectOptions(field.options)"
                        :placeholder="field.placeholder_id || '-- Pilih Salah Satu --'"
                        :disabled="disabled"
                        @update:model-value="val => updateValue(field.field_key, val)"
                    />
                </div>

                <!-- Custom Radio Button Group -->
                <div v-else-if="field.field_type === 'radio'" class="flex flex-wrap gap-2.5 pt-1">
                    <button
                        v-for="opt in field.options"
                        :key="opt"
                        type="button"
                        :disabled="disabled"
                        @click="updateValue(field.field_key, opt)"
                        class="h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer"
                        :class="getValue(field.field_key) === opt ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'"
                    >
                        <Icon :icon="getValue(field.field_key) === opt ? 'ph:radio-button-fill' : 'ph:circle-bold'" class="text-base" />
                        <span>{{ opt }}</span>
                    </button>
                </div>

                <!-- Custom Checkbox Multi-Select -->
                <div v-else-if="field.field_type === 'checkbox'" class="flex flex-wrap gap-2.5 pt-1">
                    <button
                        v-for="opt in field.options"
                        :key="opt"
                        type="button"
                        :disabled="disabled"
                        @click="toggleCheckbox(field.field_key, opt, !isCheckboxChecked(field.field_key, opt))"
                        class="h-11 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer"
                        :class="isCheckboxChecked(field.field_key, opt) ? 'border-navy bg-navy text-primary shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'"
                    >
                        <Icon :icon="isCheckboxChecked(field.field_key, opt) ? 'ph:check-square-fill' : 'ph:square-bold'" class="text-base" />
                        <span>{{ opt }}</span>
                    </button>
                </div>

                <!-- Date Picker -->
                <div v-else-if="field.field_type === 'date'">
                    <BaseInput
                        :model-value="getValue(field.field_key) || ''"
                        type="date"
                        :placeholder="field.placeholder_id || 'YYYY-MM-DD'"
                        :disabled="disabled"
                        :required="field.is_required"
                        icon="ph:calendar-blank-bold"
                        @update:model-value="val => updateValue(field.field_key, val)"
                    />
                </div>

                <!-- Date Range Picker -->
                <div v-else-if="field.field_type === 'daterange'" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                        <span class="text-[11px] font-bold text-slate-500">Mulai (Start)</span>
                        <BaseInput
                            :model-value="getValue(field.field_key + '_start') || ''"
                            type="date"
                            :disabled="disabled"
                            :required="field.is_required"
                            icon="ph:calendar-blank-bold"
                            @update:model-value="val => updateValue(field.field_key + '_start', val)"
                        />
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-[11px] font-bold text-slate-500">Selesai (End)</span>
                        <BaseInput
                            :model-value="getValue(field.field_key + '_end') || ''"
                            type="date"
                            :disabled="disabled"
                            :required="field.is_required"
                            icon="ph:calendar-blank-bold"
                            @update:model-value="val => updateValue(field.field_key + '_end', val)"
                        />
                    </div>
                </div>

                <!-- Time Picker -->
                <div v-else-if="field.field_type === 'time'">
                    <BaseInput
                        :model-value="getValue(field.field_key) || ''"
                        type="time"
                        :disabled="disabled"
                        :required="field.is_required"
                        icon="ph:clock-bold"
                        @update:model-value="val => updateValue(field.field_key, val)"
                    />
                </div>

                <!-- DateTime Picker -->
                <div v-else-if="field.field_type === 'datetime'">
                    <BaseInput
                        :model-value="getValue(field.field_key) || ''"
                        type="datetime-local"
                        :disabled="disabled"
                        :required="field.is_required"
                        icon="ph:calendar-check-bold"
                        @update:model-value="val => updateValue(field.field_key, val)"
                    />
                </div>

                <!-- File Upload Input -->
                <div v-else-if="field.field_type === 'file'" class="mt-1">
                    <div v-if="getValue(field.field_key)" class="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
                        <div class="flex items-center gap-2 min-w-0">
                            <Icon icon="ph:file-check-bold" class="text-lg text-emerald-600 shrink-0" />
                            <a :href="getValue(field.field_key)" target="_blank" class="font-bold underline truncate">
                                Berkas Terlampir
                            </a>
                        </div>
                        <button
                            v-if="!disabled"
                            type="button"
                            @click="updateValue(field.field_key, '')"
                            class="text-rose-500 hover:text-rose-700 text-xs font-bold shrink-0 ml-2 cursor-pointer"
                        >
                            Hapus / Ganti
                        </button>
                    </div>

                    <div v-else class="relative">
                        <input
                            type="file"
                            :disabled="disabled || uploadingFields[field.field_key]"
                            :accept="field.style_config?.file_config?.allowed_types === 'images' ? 'image/*' : field.style_config?.file_config?.allowed_types === 'docs' ? '.pdf,.doc,.docx' : 'image/*,.pdf,.doc,.docx'"
                            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                            @change="e => handleFileUpload(e, field.field_key)"
                        />
                        <div class="border-2 border-dashed border-primary/40 hover:border-primary rounded-xl p-4 text-center bg-primary/5 hover:bg-primary/10 transition-all">
                            <Icon
                                :icon="uploadingFields[field.field_key] ? 'svg-spinners:90-ring-with-bg' : 'ph:cloud-arrow-up-bold'"
                                class="text-2xl text-navy mx-auto mb-1"
                            />
                            <div class="text-xs sm:text-sm font-bold text-navy">
                                {{ uploadingFields[field.field_key] ? 'Sedang mengunggah berkas...' : (field.placeholder_id || 'Klik atau seret file ke sini') }}
                            </div>
                            <div class="text-xs text-slate-500 mt-0.5">
                                {{ field.style_config?.file_config?.allowed_types === 'images' ? 'Mendukung format gambar (JPG, PNG, WEBP)' : field.style_config?.file_config?.allowed_types === 'docs' ? 'Mendukung dokumen PDF atau Word' : 'Mendukung JPG, PNG, atau PDF' }} (Maks {{ field.style_config?.file_config?.max_size_mb || 5 }}MB)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'

const props = defineProps({
    fields: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: Object,
        default: () => ({})
    },
    categoryIds: {
        type: [String, Array],
        default: () => []
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const config = useRuntimeConfig()
const uploadingFields = ref({})

function formatSelectOptions(options) {
    if (!options || !Array.isArray(options)) return []
    return options.map(opt => {
        if (typeof opt === 'object' && opt !== null) {
            return {
                label: opt.label || opt.name || String(opt.value),
                value: opt.value !== undefined ? opt.value : opt.label
            }
        }
        return {
            label: String(opt),
            value: String(opt)
        }
    })
}

function getGridColClass(colSpan) {
    switch (colSpan) {
        case 6: return 'col-span-12 md:col-span-6'
        case 4: return 'col-span-12 md:col-span-4'
        case 3: return 'col-span-12 md:col-span-3'
        case 8: return 'col-span-12 md:col-span-8'
        case 12:
        default: return 'col-span-12'
    }
}

function getNoticeStyle(variant) {
    switch (variant) {
        case 'warning': return 'bg-amber-50 text-amber-900 border-amber-200'
        case 'danger': return 'bg-rose-50 text-rose-900 border-rose-200'
        case 'success': return 'bg-emerald-50 text-emerald-900 border-emerald-200'
        case 'info':
        default: return 'bg-sky-50 text-sky-900 border-sky-200'
    }
}

function getNoticeIcon(variant) {
    switch (variant) {
        case 'warning': return 'ph:warning-octagon-bold'
        case 'danger': return 'ph:warning-circle-bold'
        case 'success': return 'ph:check-circle-bold'
        case 'info':
        default: return 'ph:info-bold'
    }
}

// Filter fields that are active and match applicable category IDs
const filteredFields = computed(() => {
    if (!props.fields || props.fields.length === 0) return []

    const selectedCats = Array.isArray(props.categoryIds)
        ? props.categoryIds
        : (props.categoryIds ? [props.categoryIds] : [])

    return props.fields.filter(f => {
        if (!f.is_active) return false
        // If field has specific applies_to_category_ids, check match
        if (f.applies_to_category_ids && f.applies_to_category_ids.length > 0) {
            if (selectedCats.length === 0) return true
            return f.applies_to_category_ids.some(cid => selectedCats.includes(cid))
        }
        return true
    })
})

function getValue(key) {
    return props.modelValue ? props.modelValue[key] : undefined
}

function updateValue(key, val) {
    const updated = { ...(props.modelValue || {}) }
    if (val === '' || val === null || val === undefined) {
        delete updated[key]
    } else {
        updated[key] = val
    }
    emit('update:modelValue', updated)
}

function isCheckboxChecked(key, opt) {
    const current = getValue(key)
    if (Array.isArray(current)) return current.includes(opt)
    return false
}

function toggleCheckbox(key, opt, checked) {
    let current = getValue(key)
    if (!Array.isArray(current)) current = []
    const next = [...current]

    if (checked) {
        if (!next.includes(opt)) next.push(opt)
    } else {
        const idx = next.indexOf(opt)
        if (idx >= 0) next.splice(idx, 1)
    }

    updateValue(key, next)
}

async function handleFileUpload(e, fieldKey) {
    const file = e.target.files?.[0]
    if (!file) return

    uploadingFields.value[fieldKey] = true
    const formData = new FormData()
    formData.append('file', file)

    try {
        const token = useCookie('token').value
        const headers = {}
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        const res = await $fetch(`${config.public.apiBaseUrl}/media/upload`, {
            method: 'POST',
            body: formData,
            headers
        })
        if (res && res.url) {
            updateValue(fieldKey, res.url)
        }
    } catch (err) {
        console.error('File upload error:', err)
        alert('Gagal mengunggah berkas: ' + (err.data?.error || err.message))
    } finally {
        uploadingFields.value[fieldKey] = false
    }
}
</script>
