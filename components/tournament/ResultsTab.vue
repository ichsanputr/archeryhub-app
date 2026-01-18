<template>
    <div class="space-y-6">
        <!-- Leaders -->
        <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-xl font-bold text-navy">Papan Skor Live</h3>
                <select
                    class="px-4 py-2 rounded-lg border border-gray-100 text-sm font-bold text-navy outline-none focus:border-primary">
                    <option>Recurve Men</option>
                    <option>Recurve Women</option>
                    <option>Compound Men</option>
                </select>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr
                            class="text-[10px] text-gray-400 uppercase font-black tracking-widest border-b border-gray-50">
                            <th class="px-4 py-3 text-left">Peringkat</th>
                            <th class="px-4 py-3 text-left">Atlet</th>
                            <th class="px-4 py-3 text-center">X+10</th>
                            <th class="px-4 py-3 text-center">10s</th>
                            <th class="px-4 py-3 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(leader, index) in leaders" :key="index"
                            class="group hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-4">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                                    :class="index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'">
                                    {{ index + 1 }}
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                        <img :src="leader.photo" class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <p class="text-sm font-bold text-navy">{{ leader.name }}</p>
                                        <p class="text-[10px] text-gray-400 font-medium">{{ leader.club }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-4 text-center font-bold text-gray-500">{{ leader.x10 }}</td>
                            <td class="px-4 py-4 text-center font-bold text-gray-500">{{ leader.tens }}</td>
                            <td class="px-4 py-4 text-center">
                                <span class="px-3 py-1 bg-navy text-primary rounded-lg font-black text-sm">{{
                                    leader.total }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="mt-8 pt-8 border-t border-gray-50 flex justify-center">
                <button class="text-primary font-bold text-sm hover:underline">Lihat Hasil Lengkap</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const leaders = [
    { name: 'Budi Santoso', club: 'Jakarta Archery Club', x10: 12, tens: 24, total: 684, photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN1PKK-zE7gHxiw_aZW8rQ0RXGOUpoAcMX2PerB54W68JgnLtpC0teJYHN1wn5e5Hh5e7o7hzPx_gF8FzvqgkTykuPW2RnCBPrctcfBT9awfftTun8hn_I_2ZdxlhEv7PrrhUSinekRNDYnLyMPUAORFdirFzIiXQuRgcjinT9Jt1Bm_tkVNee3C9NqqYUBs1lYfaFEzgXRZeUvKrEP8FnQOWtp5St5c_s1o-sIV5ALK6iV0TBRUhB2AFDYY_qRHsVDugx540fhIw' },
    { name: 'Andi Wijaya', club: 'Surabaya Archery', x10: 10, tens: 22, total: 672, photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0' },
    { name: 'Irfan Hakim', club: 'Bandung Archery', x10: 8, tens: 20, total: 665, photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBrem4azc6WDMeDRbQw-2joq0fcWSF6QDRhvFPnW-ZtTHG4r0ECeGr8vc0pPmiT9d1nf6uWWAKZV7gq4w5KOncu3fb8KTi_XBz3tdpkVmJJmYaADUQlUXX_F7nLa_E2NafPu8ouY13kIof5Eq-of3RwBG7KLqmrOsacwZG3PTf4QMy_Kg7hNn1wy70_AypgzTCtU9fNYKdIuuk90f3tKG-PQTM6beImIzXkc9NJP7mrw7xfVZmahm9Ur0fzjDkkH2C0zP1aJy_XLg' }
]
</script>
