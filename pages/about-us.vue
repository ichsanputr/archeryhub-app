<template>
    <div class="min-h-screen bg-background-light relative overflow-hidden">
        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ── HERO SECTION ── -->
        <section class="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-navy">
            <div class="absolute inset-0 opacity-20 pointer-events-none">
                <div class="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px] -mr-48 -mt-48"></div>
                <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -ml-48 -mb-48"></div>
            </div>
            
            <div class="container mx-auto px-4 max-w-7xl relative z-10 text-center">
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-primary text-[10px] font-black tracking-widest uppercase mb-8 border border-white/10">
                    <Icon icon="ph:users-four-bold" />
                    <span>TENTANG Archeris</span>
                </div>
                <h1 class="text-white text-4xl md:text-7xl font-black tracking-tighter leading-tight max-w-5xl mx-auto mb-8">
                    Membangun Masa Depan <br />
                    <span class="text-primary italic">Panahan Indonesia.</span>
                </h1>
                <p class="text-white/60 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                    Kami hadir untuk mendigitalisasi setiap tarikan busur, memastikan setiap skor tercatat dengan presisi, 
                    dan menghubungkan komunitas panahan di seluruh nusantara.
                </p>
            </div>
        </section>

        <!-- ── VISION & MISSION (GLASS CARDS) ── -->
        <section class="py-24 md:py-32 relative">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <!-- Vision -->
                    <div class="p-12 bg-white rounded-[40px] border border-navy/5 relative group overflow-hidden">
                         <div class="absolute top-0 right-0 p-8 text- navy/5 text-8xl font-black group-hover:text-primary/10 transition-colors pointer-events-none">V</div>
                         <h2 class="text-3xl font-black text-navy uppercase tracking-tight mb-8">Visi Kami.</h2>
                         <p class="text-navy/50 text-lg leading-relaxed font-medium">
                            Menjadi platform infrastruktur digital nomor satu di Asia Tenggara yang memberdayakan ekosistem panahan 
                            melalui data yang akurat, transparansi turnamen, dan kemudahan akses bagi seluruh atlet.
                         </p>
                    </div>
                    <!-- Mission -->
                    <div class="p-12 bg-navy rounded-[40px] relative group overflow-hidden text-white">
                         <div class="absolute top-0 right-0 p-8 text-white/5 text-8xl font-black group-hover:text-primary/10 transition-colors pointer-events-none">M</div>
                         <h2 class="text-3xl font-black text-white uppercase tracking-tight mb-8">Misi Kami.</h2>
                         <ul class="space-y-6">
                            <li class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0"></div>
                                <p class="text-white/60 font-medium">Menyediakan sistem scoring real-time yang canggih dan mudah digunakan.</p>
                            </li>
                            <li class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0"></div>
                                <p class="text-white/60 font-medium">Membangun database atlet nasional yang terintegrasi dan prestisius.</p>
                            </li>
                            <li class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0"></div>
                                <p class="text-white/60 font-medium">Mendukung penyelenggara turnamen dengan alat manajemen yang profesional.</p>
                            </li>
                         </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── STORY SECTION ── -->
        <section class="pb-32">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div class="lg:col-span-7">
                        <div class="relative rounded-[48px] overflow-hidden bg-slate-200 aspect-[4/3] shadow-2xl">
                             <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1200" class="w-full h-full object-cover" />
                             <div class="absolute inset-0 bg-navy/20"></div>
                             <!-- Floating Stat -->
                             <div class="absolute bottom-12 right-12 bg-white p-8 rounded-3xl border border-navy/5 shadow-2xl max-w-xs">
                                <div class="text-navy text-4xl font-black leading-none mb-2">500+</div>
                                <div class="text-[10px] font-black text-navy/40 uppercase tracking-widest">Turnamen Terkelola</div>
                             </div>
                        </div>
                    </div>
                    <div class="lg:col-span-5">
                         <h2 class="text-4xl md:text-5xl font-black text-navy leading-tight tracking-tighter mb-8 uppercase">Berawal dari <br /> <span class="text-primary italic">Garasi Kecil.</span></h2>
                         <div class="space-y-6 text-navy/50 text-lg leading-relaxed font-medium">
                            <p>Archeris dimulai dengan visi sederhana untuk memecahkan masalah manualnya pencatatan skor di lapangan panahan tradisional.</p>
                            <p>Kini, kami telah berkembang menjadi ekosistem lengkap yang melayani ribuan atlet dan ratusan organisasi panahan di seluruh Indonesia.</p>
                            <p>Setiap baris kode yang kami tulis didedikasikan untuk presisi, transparansi, dan kemajuan olahraga panahan nasional.</p>
                         </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── CTA SECTION ── -->
        <section class="pb-32 section-padding px-4">
             <div class="max-w-7xl mx-auto bg-primary rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                 <div class="absolute inset-0 bg-navy/5 transform skew-y-12 translate-y-20"></div>
                 <h2 class="text-navy text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6 relative z-10">Jadilah Bagian dari <br /> Revolusi Digital Panahan.</h2>
                 <p class="text-navy/60 text-lg font-bold mb-12 relative z-10">Daftarkan klub atau organisasi Anda sekarang juga.</p>
                 <div class="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                     <button class="px-12 py-5 bg-navy text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-navy/20">Daftar Sekarang</button>
                     <NuxtLink to="/contact" class="px-12 py-5 bg-white text-navy rounded-2xl font-black uppercase tracking-widest text-sm border-2 border-transparent hover:border-navy transition-all active:scale-95">Hubungi Kami</NuxtLink>
                 </div>
             </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
    layout: 'landing'
})

useHead({
    title: 'Tentang Kami - Archeris',
    meta: [
        { name: 'description', content: 'Pelajari misi kami untuk mendigitalisasi panahan Indonesia dengan sistem scoring real-time dan manajemen turnamen yang presisi.' }
    ]
})
</script>

<style scoped>
.italic {
    font-style: italic;
}
</style>
