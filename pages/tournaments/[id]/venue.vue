<template>
    <div class="space-y-8">
        <section class="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 overflow-hidden">
            <div class="w-full h-[400px] rounded-xl overflow-hidden bg-gray-100 relative group">
                <iframe allowfullscreen="" class="w-full h-full" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3364958156157!2d106.80103731476906!3d-6.219280995497746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14d796c068d%3A0x66f6f3629395295!2sGelora%20Bung%20Karno%20Archery%20Field!5e0!3m2!1sen!2sid!4v1679900000000!5m2!1sen!2sid"
                    style="border:0;"></iframe>
                <div class="absolute bottom-4 right-4 z-10">
                    <a class="px-4 py-2 bg-white text-navy text-xs font-bold rounded-lg shadow-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
                        href="https://maps.app.goo.gl/..." target="_blank">
                        <span class="material-symbols-outlined text-red-500 text-lg">directions</span>
                        Petunjuk Arah
                    </a>
                </div>
            </div>
        </section>
        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-navy mb-4 font-display">Lapangan Panahan GBK</h2>
            <p class="text-text-sub text-sm flex items-center gap-2 mb-6">
                <span class="material-symbols-outlined text-text-sub/50">location_on</span>
                Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div v-for="facility in facilities" :key="facility.name"
                    class="flex flex-col items-center p-4 bg-gray-50 rounded-xl text-center hover:bg-white hover:shadow-md transition-all">
                    <span class="material-symbols-outlined text-primary text-3xl mb-2">{{ facility.icon }}</span>
                    <span class="text-[10px] font-bold text-navy uppercase">{{ facility.name }}</span>
                </div>
            </div>
        </section>

        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 class="text-lg font-bold text-navy mb-6 flex items-center gap-2 font-display">
                <span class="material-symbols-outlined text-primary">commute</span> Cara Ke Sana
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="transport in transportation" :key="transport.title"
                    class="p-4 border border-gray-50 rounded-xl hover:border-primary/30 transition-colors flex gap-4">
                    <div class="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy shrink-0">
                        <span class="material-symbols-outlined">{{ transport.icon }}</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-navy mb-1 text-sm">{{ transport.title }}</h4>
                        <p class="text-xs text-text-sub/70 leading-relaxed">{{ transport.desc }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
const facilities = [
    { name: 'Mushola', icon: 'mosque' },
    { name: 'Kantin', icon: 'restaurant' },
    { name: 'Medis', icon: 'medical_services' },
    { name: 'Toko Alat', icon: 'shopping_bag' },
    { name: 'Toilet', icon: 'wc' },
    { name: 'WiFi', icon: 'wifi' }
]

const transportation = [
    { title: 'MRT Jakarta', icon: 'train', desc: 'Stasiun terdekat: Istora Mandiri. Jalan kaki 10 menit via Pintu 5.' },
    { title: 'TransJakarta', icon: 'directions_bus', desc: 'Halte terdekat: Halte GBK. Koridor 1 (Blok M - Kota).' },
    { title: 'Parkir', icon: 'local_parking', desc: 'Parkir tersedia di area Parkir Timur Senayan atau Aquatic Center.' }
]
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}
</style>
