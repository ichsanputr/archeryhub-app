<template>
    <div class="space-y-6">
        <!-- Filters -->
        <div class="space-y-4">
            <!-- Cari Atlet -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div class="relative w-full">
                    <span
                        class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input type="text" placeholder="Cari atlet atau klub..."
                        class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm text-sm">
                </div>
            </div>

            <!-- Tipe / Divisi -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tipe / Divisi</p>
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button v-for="cat in categories" :key="cat" @click="activeCategory = cat"
                        class="px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap shadow-sm border"
                        :class="activeCategory === cat ? 'bg-navy text-primary border-navy' : 'bg-white text-gray-500 border-gray-100 hover:border-navy hover:text-navy'">
                        {{ cat }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Athletes Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="athlete in athletes" :key="athlete.id"
                class="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-primary transition-all hover:shadow-md">
                <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-50 bg-gray-100 shrink-0">
                        <img :src="athlete.photo" :alt="athlete.name" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <div class="flex items-center gap-1">
                            <h3 class="font-bold text-navy truncate">{{ athlete.name }}</h3>
                            <span v-if="athlete.verified"
                                class="material-symbols-outlined text-[14px] text-blue-500">verified</span>
                        </div>
                        <p class="text-xs text-gray-500 font-medium">{{ athlete.club }}</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    <span
                        class="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">{{
                        athlete.division }}</span>
                    <span
                        class="px-2 py-1 bg-gray-50 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">{{
                        athlete.category }}</span>
                </div>

                <div class="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div class="flex items-center gap-1 text-gray-400">
                        <span class="material-symbols-outlined text-sm">trophy</span>
                        <span class="text-[10px] font-bold">{{ athlete.rank }}nd Rank</span>
                    </div>
                    <button class="text-primary font-bold text-xs hover:underline flex items-center gap-1">
                        Profil <span class="material-symbols-outlined text-sm">north_east</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-2 pt-8">
            <button class="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-navy transition-colors">
                <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button v-for="i in 3" :key="i" class="w-10 h-10 rounded-lg border font-bold text-sm"
                :class="i === 1 ? 'bg-navy text-primary border-navy' : 'border-gray-100 text-gray-400 hover:text-navy'">
                {{ i }}
            </button>
            <button class="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-navy transition-colors">
                <span class="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
    </div>
</template>

<script setup>
const activeCategory = ref('Semua')
const categories = ['Semua', 'Recurve Men', 'Recurve Women', 'Compound Men', 'Compound Women']

const athletes = [
    {
        id: 1,
        name: 'Budi Santoso',
        club: 'Jakarta Archery Club',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN1PKK-zE7gHxiw_aZW8rQ0RXGOUpoAcMX2PerB54W68JgnLtpC0teJYHN1wn5e5Hh5e7o7hzPx_gF8FzvqgkTykuPW2RnCBPrctcfBT9awfftTun8hn_I_2ZdxlhEv7PrrhUSinekRNDYnLyMPUAORFdirFzIiXQuRgcjinT9Jt1Bm_tkVNee3C9NqqYUBs1lYfaFEzgXRZeUvKrEP8FnQOWtp5St5c_s1o-sIV5ALK6iV0TBRUhB2AFDYY_qRHsVDugx540fhIw',
        division: 'Recurve',
        category: 'Men 70m',
        rank: 2,
        verified: true
    },
    {
        id: 2,
        name: 'Anisa Rahma',
        club: 'Bandung Archery Team',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBrem4azc6WDMeDRbQw-2joq0fcWSF6QDRhvFPnW-ZtTHG4r0ECeGr8vc0pPmiT9d1nf6uWWAKZV7gq4w5KOncu3fb8KTi_XBz3tdpkVmJJmYaADUQlUXX_F7nLa_E2NafPu8ouY13kIof5Eq-of3RwBG7KLqmrOsacwZG3PTf4QMy_Kg7hNn1wy70_AypgzTCtU9fNYKdIuuk90f3tKG-PQTM6beImIzXkc9NJP7mrw7xfVZmahm9Ur0fzjDkkH2C0zP1aJy_XLg',
        division: 'Recurve',
        category: 'Women 70m',
        rank: 5,
        verified: true
    },
    {
        id: 3,
        name: 'Andi Wijaya',
        club: 'Surabaya Archery',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0',
        division: 'Compound',
        category: 'Men 50m',
        rank: 1,
        verified: false
    }
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>