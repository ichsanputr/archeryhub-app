<template>
    <section class="py-24 sm:py-32 bg-navy text-white overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-16 sm:mb-24">
                <h2 class="text-3xl sm:text-6xl font-black leading-tight font-display tracking-tighter">
                    Operators rely on us.<br />
                    Archers love us.
                </h2>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 items-end">
                <!-- Stat 1 -->
                <NuxtLink :to="localePath('/blog/impact-tracking-ten-thousand-archers')" class="group relative pl-8 border-l border-dashed border-white/20 block hover:opacity-90 transition-opacity">
                    <div class="text-4xl sm:text-6xl font-black text-primary mb-2 font-display tracking-tighter group-hover:translate-x-1 transition-transform inline-block">10K+</div>
                    <div class="text-white/60 text-xs sm:text-sm tracking-widest font-bold flex items-center gap-1.5">
                        Archery Athletes 
                        <Icon icon="ph:arrow-up-right-bold" class="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-primary" />
                    </div>
                </NuxtLink>

                <!-- Stat 2 -->
                <NuxtLink :to="localePath('/blog/scale-up-five-hundred-archery-tournaments')" class="group relative pl-8 border-l border-dashed border-white/20 block hover:opacity-90 transition-opacity">
                    <div class="text-4xl sm:text-6xl font-black text-primary mb-2 font-display tracking-tighter group-hover:translate-x-1 transition-transform inline-block">500+</div>
                    <div class="text-white/60 text-xs sm:text-sm tracking-widest font-bold flex items-center gap-1.5">
                        Tournaments Organized 
                        <Icon icon="ph:arrow-up-right-bold" class="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-primary" />
                    </div>
                </NuxtLink>

                <!-- Stat 3 -->
                <NuxtLink :to="localePath('/blog/why-archers-rate-archeris-five-stars')" class="group relative pl-8 border-l border-dashed border-white/20 block hover:opacity-90 transition-opacity">
                    <div class="text-4xl sm:text-6xl font-black text-primary mb-2 font-display tracking-tighter group-hover:translate-x-1 transition-transform inline-block">4.9</div>
                    <div class="text-white/60 text-xs sm:text-sm tracking-widest font-bold flex items-center gap-1.5">
                        App Store Rating 
                        <Icon icon="ph:arrow-up-right-bold" class="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-primary" />
                    </div>
                </NuxtLink>

                <!-- Stat 4 -->
                <NuxtLink :to="localePath('/blog/big-data-scoring-one-million-arrows')" class="group relative pl-8 border-l border-dashed border-white/20 block hover:opacity-90 transition-opacity">
                    <div class="text-4xl sm:text-6xl font-black text-primary mb-2 font-display tracking-tighter group-hover:translate-x-1 transition-transform inline-block">1M+</div>
                    <div class="text-white/60 text-xs sm:text-sm tracking-widest font-bold flex items-center gap-1.5">
                        Arrows Scored 
                        <Icon icon="ph:arrow-up-right-bold" class="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-primary" />
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
const localePath = useLocalePath()
</script>

<style scoped>
</style>
