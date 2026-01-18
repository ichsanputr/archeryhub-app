<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
                <h1 class="text-3xl font-black text-navy tracking-tight uppercase italic">Pengaturan Turnamen</h1>
                <p class="text-text-sub font-medium mt-1">Konfigurasi detail event, pendaftaran, dan aturan
                    pertandingan.</p>
            </div>
            <div class="flex gap-3">
                <button
                    class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-navy font-black text-sm hover:bg-primary-hover transition-all shadow-lg border border-primary/20">
                    <span class="material-symbols-outlined text-[20px]">save</span>
                    Simpan Perubahan
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Sidebar Navigation for Settings -->
            <div class="lg:col-span-1 space-y-2">
                <button v-for="section in sections" :key="section.id" @click="activeSection = section.id"
                    class="w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-left"
                    :class="activeSection === section.id ? 'bg-navy text-primary shadow-lg shadow-navy/20' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'">
                    <span class="material-symbols-outlined">{{ section.icon }}</span>
                    <div class="flex flex-col">
                        <span class="font-black text-xs uppercase tracking-widest">{{ section.label }}</span>
                        <span class="text-[9px] font-bold opacity-60 leading-tight">{{ section.desc }}</span>
                    </div>
                </button>
            </div>

            <!-- Content Area -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Basic Info Section -->
                <div v-if="activeSection === 'general'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                    <div class="space-y-1">
                        <h3 class="text-xl font-black text-navy uppercase tracking-tight italic">Informasi Dasar</h3>
                        <p class="text-xs text-gray-400 font-medium">Informasi utama yang akan ditampilkan pada halaman
                            publik.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Nama
                                Turnamen</label>
                            <input type="text" value="2024 State Indoor Championship"
                                class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label
                                class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Penyelenggara</label>
                            <input type="text" value="Archery Hub Official"
                                class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Lokasi
                                (Venue)</label>
                            <input type="text" value="Jakarta Indoor Stadium"
                                class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Tipe
                                Event</label>
                            <select
                                class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
                                <option>Indoor Archery</option>
                                <option>Outdoor Archery</option>
                                <option>Target Archery</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Deskripsi
                            Turnamen</label>
                        <textarea rows="4"
                            class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">Turnamen tahunan ke-5 yang diselenggarakan oleh Archery Hub untuk mencari bibit atlet muda berprestasi di tingkat nasional.</textarea>
                    </div>
                </div>

                <!-- Registration Section Sample -->
                <div v-if="activeSection === 'registration'"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">
                    <div class="space-y-1">
                        <h3 class="text-xl font-black text-navy uppercase tracking-tight italic">Pendaftaran & Biaya
                        </h3>
                        <p class="text-xs text-gray-400 font-medium">Kelola periode pendaftaran dan harga tiket masuk.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Buka
                                Pendaftaran</label>
                            <input type="date" value="2024-10-01"
                                class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-[10px] font-black text-navy uppercase tracking-widest ml-1">Tutup
                                Pendaftaran</label>
                            <input type="date" value="2024-12-01"
                                class="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-navy focus:ring-2 focus:ring-primary outline-none transition-all">
                        </div>
                    </div>

                    <div
                        class="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-xs font-black text-navy uppercase tracking-widest">Late
                                Registration</span>
                            <span class="text-[10px] font-bold text-gray-500">Aktifkan biaya tambahan setelah masa
                                berakhir</span>
                        </div>
                        <div class="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                            <div class="absolute right-1 top-1 w-4 h-4 bg-navy rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

const activeSection = ref('general')
const sections = [
    { id: 'general', label: 'Umum', icon: 'settings', desc: 'Informasi dasar turnamen' },
    { id: 'registration', label: 'Pendaftaran', icon: 'app_registration', desc: 'Biaya dan periode daftar' },
    { id: 'rules', label: 'Aturan', icon: 'gavel', desc: 'Format skor dan kategori' },
    { id: 'display', label: 'Tampilan', icon: 'palette', desc: 'Banner dan warna tema' },
    { id: 'danger', label: 'Lainnya', icon: 'warning', desc: 'Hapus atau arsipkan event' },
]
</script>

<style scoped>
.text-navy {
    color: #0f172a;
}

.text-text-sub {
    color: #4b5563;
}

.bg-navy {
    background-color: #0f172a;
}
</style>
