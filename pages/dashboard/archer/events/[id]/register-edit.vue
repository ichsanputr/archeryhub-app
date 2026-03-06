<template>
    <div class="space-y-6">
        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ring-2 ring-primary/20">
            <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 class="text-lg font-bold text-navy flex items-center gap-2 font-display">
                    <span
                        class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-[10px] font-black">1</span>
                    Ubah Detail Pendaftaran
                </h2>
            </div>

            <div class="p-6 md:p-8 space-y-8">
                <div class="flex flex-col md:flex-row gap-6 items-start">
                    <div class="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <img src="https://i.pravatar.cc/150?u=budi" alt="Budi" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-grow w-full space-y-6">
                        <div>
                            <h3 class="text-xl font-black text-navy  tracking-tight">Budi Santoso</h3>
                            <p class="text-xs text-text-sub font-bold  tracking-widest opacity-50">Jakarta
                                Archery Club</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <BaseSelect v-model="form.idNumber" :items="idNumberOptions" label="ID Card / KTP" />
                            </div>
                            <div>
                                <BaseSelect v-model="form.category" :items="categoryOptions"
                                    label="Divisi & Kategori" />
                            </div>
                        </div>

                        <div class="pt-6 border-t border-gray-50">
                            <h4 class="text-xs font-black text-navy  tracking-widest mb-4">Informasi Tambahan
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <BaseSelect v-model="form.jerseySize" :items="jerseySizeOptions"
                                        label="Ukuran Jersey" />
                                </div>
                                <div>
                                    <BaseInput v-model="form.emergencyContact" label="Kontak Darurat"
                                        placeholder="Nama Kontak" />
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 pt-4">
                            <button @click="saveChanges"
                                class="px-8 py-3 bg-primary hover:bg-primary-hover text-navy font-black rounded-xl transition-all shadow-lg shadow-primary/20 grow">
                                Simpan Perubahan
                            </button>
                            <button @click="navigateTo(`/events/1/register`)"
                                class="px-8 py-3 bg-gray-50 hover:bg-gray-100 text-text-sub/50 font-bold rounded-xl transition-all">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Locked Payment Section -->
        <section
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden opacity-40 pointer-events-none grayscale">
            <div class="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 class="text-lg font-bold text-navy flex items-center gap-2 font-display">
                    <span
                        class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-[10px] font-black">2</span>
                    Pembayaran
                </h2>
            </div>
            <div class="p-8 text-center text-text-sub/50 text-sm">
                Selesaikan detail pendaftaran terlebih dahulu untuk melanjutkan ke pembayaran.
            </div>
        </section>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseInput from '~/components/common/BaseInput.vue'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Edit Pendaftaran - Dashboard'
})

const idNumberOptions = ['INA-2024-8832', 'INA-2023-1102']
const categoryOptions = ['Recurve Men - 70m', 'Compound Men - 50m']
const jerseySizeOptions = ['S', 'M', 'L', 'XL']

const form = reactive({
    idNumber: 'INA-2024-8832',
    category: 'Recurve Men - 70m',
    jerseySize: 'L',
    emergencyContact: 'Siti Aminah'
})

const saveChanges = () => {
    alert('Detail pendaftaran berhasil diperbarui!')
    navigateTo(`/events/1/register`)
}
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.font-display {
    font-family: 'Manrope', sans-serif;
}
</style>
