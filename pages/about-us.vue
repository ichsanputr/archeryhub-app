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
                <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -ml-48 -mb-48">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10 text-center">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-primary text-[10px] font-black tracking-widest mb-8 border border-white/10">
                    <Icon icon="ph:users-four-bold" />
                    <span>ABOUT Archeris</span>
                </div>
                <h1
                    class="text-white text-4xl md:text-7xl font-black tracking-tighter leading-tight max-w-5xl mx-auto mb-8">
                    Building the Future of <br />
                    <span class="text-primary italic">Modern Archery.</span>
                </h1>
                <p class="text-white/60 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                    We are here to digitize every shot, ensure every score is recorded with precision, and connect the archery community across the globe.
                </p>
            </div>
        </section>

        <!-- ── VISION & MISSION (GLASS CARDS) ── -->
        <section class="py-24 md:py-32 relative">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <!-- Vision -->
                    <div class="p-12 bg-white rounded-[40px] border border-navy/5 relative group overflow-hidden">
                        <div
                            class="absolute top-0 right-0 p-8 text-navy/5 text-8xl font-black group-hover:text-primary/10 transition-colors pointer-events-none">
                            V</div>
                        <h2 class="text-3xl font-black text-navy tracking-tight mb-8">Our Vision.</h2>
                        <p class="text-navy/50 text-lg leading-relaxed font-medium">
                            To become the number one digital infrastructure platform empowering the archery ecosystem through accurate data, tournament transparency, and seamless accessibility for all athletes.
                        </p>
                    </div>
                    <!-- Mission -->
                    <div class="p-12 bg-navy rounded-[40px] relative group overflow-hidden text-white">
                        <div
                            class="absolute top-0 right-0 p-8 text-white/5 text-8xl font-black group-hover:text-primary/10 transition-colors pointer-events-none">
                            M</div>
                        <h2 class="text-3xl font-black text-white tracking-tight mb-8">Our Mission.</h2>
                        <ul class="space-y-6">
                            <li class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0"></div>
                                <p class="text-white/60 font-medium">Provide a sophisticated and easy-to-use real-time scoring system.</p>
                            </li>
                            <li class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0"></div>
                                <p class="text-white/60 font-medium">Build an integrated and prestigious national athlete database.</p>
                            </li>
                            <li class="flex gap-4">
                                <div class="w-2 h-2 rounded-full bg-primary mt-3 flex-shrink-0"></div>
                                <p class="text-white/60 font-medium">Support tournament organizers with professional-grade management tools.</p>
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
                            <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1200"
                                class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-navy/20"></div>
                            <!-- Floating Stat -->
                            <div
                                class="absolute bottom-12 right-12 bg-white p-8 rounded-3xl border border-navy/5 shadow-2xl max-w-xs">
                                <div class="text-navy text-4xl font-black leading-none mb-2">500+</div>
                                <div class="text-[10px] font-black text-navy/40 tracking-widest">Tournaments Managed</div>
                            </div>
                        </div>
                    </div>
                    <div class="lg:col-span-5">
                        <h2 class="text-4xl md:text-5xl font-black text-navy leading-tight tracking-tighter mb-8 ">
                            Starting from a <br /> <span class="text-primary italic">Small Garage.</span></h2>
                        <div class="space-y-6 text-navy/50 text-lg leading-relaxed font-medium">
                            <p>Archeris began with a simple vision to solve the problems of manual scorekeeping on traditional archery ranges.</p>
                            <p>Today, we have grown into a complete ecosystem serving thousands of athletes and hundreds of archery organizations worldwide.</p>
                            <p>Every line of code we write is dedicated to precision, transparency, and the global advancement of modern archery.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── CTA SECTION ── -->
        <section class="pb-32 section-padding px-4">
            <div
                class="max-w-7xl mx-auto bg-primary rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
                <div class="absolute inset-0 bg-navy/5 transform skew-y-12 translate-y-20"></div>
                <h2 class="text-navy text-4xl md:text-6xl font-black tracking-tighter mb-6 relative z-10">
                    Be Part of the <br /> Archery Digital Revolution.</h2>
                <p class="text-navy/60 text-lg font-bold mb-12 relative z-10">Register your club or organization today.</p>
                <div class="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                    <button
                        class="px-12 py-5 bg-navy text-white rounded-2xl font-black tracking-widest text-sm hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-navy/20">Register Now</button>
                    <NuxtLink to="/contact"
                        class="px-12 py-5 bg-white text-navy rounded-2xl font-black tracking-widest text-sm border-2 border-transparent hover:border-navy transition-all active:scale-95">
                        Contact Us</NuxtLink>
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
    title: 'About Us - Archeris',
    meta: [
        { name: 'description', content: 'Learn about our mission to digitize archery with real-time scoring systems and precise tournament management.' }
    ]
})
</script>

<style scoped>
.italic {
    font-style: italic;
}
</style>
