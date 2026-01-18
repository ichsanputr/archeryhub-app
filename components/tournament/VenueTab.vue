<template>
    <div class="space-y-8">
        <!-- Map Card -->
        <section class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div class="h-[400px] w-full bg-gray-100">
                <!-- Google Maps Embed (GBK Archery Field Example) -->
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3966.2863412574!2d106.8023!3d-6.2165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14d30c5e3d7%3A0x6e2b10a56e7b7f1e!2sGelora%20Bung%20Karno%20Archery%20Field!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
                    width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            <div class="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between items-start">
                <div class="flex-grow space-y-4">
                    <h2 class="text-2xl font-bold text-navy">{{ venue }}</h2>
                    <div class="flex items-start gap-2 text-gray-600">
                        <span class="material-symbols-outlined text-primary shrink-0">location_on</span>
                        <p>{{ address }}</p>
                    </div>
                    <div class="flex flex-wrap gap-4 pt-2">
                        <div
                            class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span class="material-symbols-outlined text-sm">directions_car</span>
                            Terjangkau Mobil/Motor
                        </div>
                        <div
                            class="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <span class="material-symbols-outlined text-sm">train</span>
                            Dekat MRT/TransJakarta
                        </div>
                    </div>
                </div>
                <button
                    class="px-6 py-3 bg-navy text-white font-bold rounded-xl flex items-center gap-2 shadow-md hover:bg-navy-light transition-colors">
                    <span class="material-symbols-outlined">directions</span>
                    Petunjuk Arah
                </button>
            </div>
        </section>

        <!-- Facilities -->
        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-navy mb-6">Fasilitas Venue</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                <div v-for="facility in facilities" :key="facility.name"
                    class="flex flex-col items-center text-center space-y-3">
                    <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <span class="material-symbols-outlined text-2xl">{{ facility.icon }}</span>
                    </div>
                    <span class="text-sm font-bold text-navy">{{ facility.name }}</span>
                </div>
            </div>
        </section>

        <!-- Photo Gallery -->
        <section class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h3 class="text-xl font-bold text-navy mb-6">Galeri Foto</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div v-for="i in 3" :key="i"
                    class="aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group cursor-pointer">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
defineProps({
    venue: String,
    address: String
})

const facilities = [
    { name: 'Musholla', icon: 'mosque' },
    { name: 'Food Court', icon: 'restaurant' },
    { name: 'Toilet Bersih', icon: 'wc' },
    { name: 'Area Parkir', icon: 'local_parking' },
    { name: 'Pos Medis', icon: 'medical_services' },
    { name: 'WiFi Gratis', icon: 'wifi' },
    { name: 'Tribun Penonton', icon: 'chair' },
    { name: 'Charging Station', icon: 'battery_charging_full' }
]
</script>
