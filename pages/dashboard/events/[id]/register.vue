<template>
    <div class="space-y-6">
        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h2 class="text-lg font-bold text-navy flex items-center gap-2 font-display">
                    <span
                        class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-[10px] font-black">1</span>
                    Data Pendaftaran
                </h2>
                <button v-if="step > 1" @click="step = 1"
                    class="text-xs text-primary font-bold hover:underline uppercase tracking-widest">Ubah</button>
            </div>

            <div v-if="step === 1" class="p-6 md:p-8 space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-[10px] font-black text-text-sub/50 uppercase tracking-widest ml-1">Pilih
                            Atlet</label>
                        <select v-model="form.athlete"
                            class="w-full p-4 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                            <option value="">-- Pilih Atlet --</option>
                            <option v-for="a in myAthletes" :key="a" :value="a">{{ a }}</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label
                            class="text-[10px] font-black text-text-sub/50 uppercase tracking-widest ml-1">Kategori</label>
                        <select v-model="form.category"
                            class="w-full p-4 bg-gray-50 border-gray-100 rounded-xl text-sm font-bold text-navy outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all">
                            <option value="">-- Pilih Kategori --</option>
                            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                        </select>
                    </div>
                </div>

                <div class="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-4">
                    <span class="material-symbols-outlined text-primary">info</span>
                    <p class="text-xs text-text-sub/80 leading-relaxed">
                        Pastikan data atlet sudah sesuai dengan ID Card/KTP. Perubahan data setelah pendaftaran dapat
                        dikenakan biaya administrasi.
                    </p>
                </div>

                <button @click="nextStep" :disabled="!isFormValid"
                    class="w-full py-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:grayscale text-navy font-black text-lg rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    Lanjut ke Pembayaran
                    <span class="material-symbols-outlined">arrow_forward</span>
                </button>
            </div>

            <div v-else class="p-6 md:p-8">
                <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div class="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-100 shrink-0">
                        <img src="https://i.pravatar.cc/150?u=budi" alt="Budi" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-bold text-navy text-sm">{{ form.athlete }}</h4>
                        <p class="text-[10px] text-text-sub/50 font-bold uppercase tracking-widest">{{ form.category }}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Step 2: Payment (Only shown if step is 2) -->
        <section v-if="step === 2" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-50 bg-gray-50/50">
                <h2 class="text-lg font-bold text-navy flex items-center gap-2 font-display">
                    <span
                        class="flex items-center justify-center w-6 h-6 rounded-full bg-navy text-primary text-[10px] font-black">2</span>
                    Pembayaran
                </h2>
            </div>
            <div class="p-6 md:p-8 space-y-8">
                <div>
                    <h3 class="text-xs font-black text-text-sub/50 uppercase tracking-widest mb-4">Metode Pembayaran
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div v-for="method in paymentMethods" :key="method.id" @click="form.paymentMethod = method.id"
                            class="relative p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-3"
                            :class="form.paymentMethod === method.id ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2' : 'border-gray-100 hover:border-primary/50'">
                            <div class="w-10 h-10 rounded bg-white flex items-center justify-center font-black text-[10px] border border-gray-100 shrink-0"
                                :class="method.textColor">
                                {{ method.short }}
                            </div>
                            <span class="text-sm font-bold text-navy">{{ method.name }}</span>
                            <div v-if="form.paymentMethod === method.id" class="absolute top-2 right-2">
                                <span class="material-symbols-outlined text-primary text-sm">check_circle</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 rounded-xl p-6 space-y-3">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-text-sub/70 font-medium">Biaya Pendaftaran</span>
                        <span class="font-bold text-navy">Rp 350.000</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-text-sub/70 font-medium">Biaya Layanan</span>
                        <span class="font-bold text-navy">Rp 5.000</span>
                    </div>
                    <div class="pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span class="text-base font-black text-navy uppercase tracking-widest">Total Bayar</span>
                        <span class="text-2xl font-black text-primary tabular-nums">Rp 355.000</span>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <button @click="submitRegistration" :disabled="!form.paymentMethod"
                        class="w-full py-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:grayscale text-navy font-black text-lg rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        Konfirmasi & Bayar
                        <span class="material-symbols-outlined">payments</span>
                    </button>
                    <div class="flex justify-center items-center gap-6 opacity-40 grayscale">
                        <span class="text-[8px] font-black uppercase tracking-tighter">Secure Payment Gateway</span>
                        <div class="w-px h-3 bg-navy/20"></div>
                        <span class="text-[8px] font-black uppercase tracking-tighter">SSL Encrypted</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const step = ref(1)
const form = reactive({
    athlete: '',
    category: '',
    paymentMethod: ''
})

const myAthletes = ['Budi Santoso', 'Dimas Anggara', 'Reza Pratama']
const categories = ['Recurve Men - 70m', 'Compound Men - 50m', 'Barebow Men - 30m']

const paymentMethods = [
    { id: 'bca', name: 'BCA Virtual Account', short: 'BCA', textColor: 'text-blue-600' },
    { id: 'mandiri', name: 'Mandiri Virtual Account', short: 'BMRI', textColor: 'text-blue-800' },
    { id: 'gopay', name: 'GoPay / QRIS', short: 'QRIS', textColor: 'text-primary' },
    { id: 'ovo', name: 'OVO', short: 'OVO', textColor: 'text-purple-600' }
]

const isFormValid = computed(() => form.athlete && form.category)

const nextStep = () => {
    if (isFormValid.value) step.value = 2
}

const submitRegistration = () => {
    alert('Pendaftaran berhasil! Mengalihkan ke halaman pembayaran...')
    navigateTo(`/events/1/index`)
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
