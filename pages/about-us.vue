<template>
    <div class="min-h-screen bg-[#F8FAFC] relative overflow-hidden pb-24">
        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.02]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 30px 30px;">
        </div>

        <!-- ── MAIN HEADER & INTRO ── -->
        <section class="relative pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="container mx-auto px-4 max-w-6xl text-center">
                <h1 class="text-navy text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                    Digitizing the <br />
                    <span class="text-primary-text bg-navy px-6 py-2 rounded-2xl inline-block mt-2 transform -rotate-1">Future</span> of Archery.
                </h1>
                <p class="text-slate-600 text-lg md:text-xl font-bold max-w-3xl mx-auto leading-relaxed mt-6">
                    We build modern digital infrastructure for tournament organizers, athletes, and archery communities worldwide. Recording every score, sorting brackets, and mapping targets with absolute precision.
                </p>
            </div>
        </section>

        <!-- ── VISION, MISSION & STORY (UNIFIED SECTION) ── -->
        <section class="py-12 relative">
            <div class="container mx-auto px-4 max-w-6xl">
                <!-- Vision & Mission Column Layout (No heavy cards) -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-gray-100 pt-16">
                    <!-- Left: Core Mission & Vision -->
                    <div class="lg:col-span-5 space-y-12">
                        <div>
                            <span class="text-xs font-black tracking-widest text-primary bg-navy px-3 py-1 rounded-full uppercase">Our Vision</span>
                            <p class="text-navy text-2xl font-black tracking-tight mt-4 leading-snug">
                                To serve as the definitive digital foundation for modern archery—fostering transparent tournaments, accurate rankings, and global accessibility.
                            </p>
                        </div>

                        <div>
                            <span class="text-xs font-black tracking-widest text-primary bg-navy px-3 py-1 rounded-full uppercase">Our Mission</span>
                            <ul class="mt-6 space-y-4 text-slate-600 font-medium">
                                <li class="flex items-start gap-3">
                                    <Icon icon="ph:check-circle-fill" class="text-navy text-xl shrink-0 mt-0.5" />
                                    <span>Engineering real-time digital scoring systems that eliminate manual scorekeeper overhead.</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <Icon icon="ph:check-circle-fill" class="text-navy text-xl shrink-0 mt-0.5" />
                                    <span>Establishing a standardized, verifiable national database for athletes and their achievements.</span>
                                </li>
                                <li class="flex items-start gap-3">
                                    <Icon icon="ph:check-circle-fill" class="text-navy text-xl shrink-0 mt-0.5" />
                                    <span>Providing tournament organizers with professional-grade configuration tools for target maps and brackets.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Right: Story & Milestones (Clean layout with image) -->
                    <div class="lg:col-span-7 lg:pl-8 space-y-8">
                        <div class="relative rounded-3xl overflow-hidden bg-slate-200 aspect-[16/10] shadow-xl border border-gray-100">
                            <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1200"
                                class="w-full h-full object-cover" alt="Archery range" />
                            <div class="absolute inset-0 bg-navy/10"></div>
                            
                            <!-- Small overlay badge -->
                            <div class="absolute bottom-6 right-6 bg-navy text-white px-6 py-4 rounded-2xl border border-white/10 shadow-lg">
                                <div class="text-primary text-3xl font-black leading-none">500+</div>
                                <div class="text-[9px] font-bold uppercase tracking-widest text-white/50 mt-1">Tournaments Managed</div>
                            </div>
                        </div>

                        <div class="space-y-4 text-slate-600 font-medium text-base sm:text-lg leading-relaxed">
                            <h3 class="text-2xl font-black text-navy tracking-tight mb-4">Precision in Every Line of Code.</h3>
                            <p>
                                What started as a simple concept to replace paper scorecards has evolved into a comprehensive digital ecosystem. Today, we empower tournament administrators, line operators, and archery athletes.
                            </p>
                            <p>
                                At its core, Archeris replicate 100% of the tournament configuration and management features of Ianseo—the global World Archery scoring software—including qualification rounds, target face assignments, and head-to-head elimination matching. We take it a step further by offering a fully centralized, cloud-native platform with real-time public leaderboards, unified athlete profiles, and digital payments in a sleek, user-friendly UI.
                            </p>
                            <p>
                                Every detail, from age division classifications to dynamic head-to-head elimination matching, is optimized to support the growth and professionalism of the sport.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── CTA SECTION ── -->
        <section class="pt-16 px-4">
            <div class="max-w-6xl mx-auto bg-navy text-white rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden shadow-xl border border-white/5">
                <div class="absolute inset-0 opacity-[0.02]" style="background-image: var(--motif-pattern);"></div>
                <h2 class="text-white text-3xl md:text-5xl font-black tracking-tight mb-4 relative z-10">
                    Empower Your Next Tournament.
                </h2>
                <p class="text-slate-400 text-sm md:text-base font-medium mb-8 relative z-10 max-w-xl mx-auto">
                    register your organizer to access real-time score keeping, target map configuration, and dynamic brackets.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <NuxtLink :to="localePath('/auth/login')"
                        class="px-8 py-3.5 bg-primary text-navy rounded-xl font-black tracking-wider text-xs hover:bg-primary-hover hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-primary/10">
                        Get Started
                    </NuxtLink>
                    <NuxtLink to="/news"
                        class="px-8 py-3.5 bg-white/5 text-white rounded-xl font-bold tracking-wider text-xs border border-white/10 hover:bg-white/10 transition-all">
                        Read Latest News
                    </NuxtLink>
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

const localePath = useLocalePath()

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
