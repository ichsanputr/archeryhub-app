<template>
    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <!-- Breadcrumb -->
        <div class="mb-8">
            <Breadcrumbs :items="[{ label: 'Berita', path: '/berita' }]" :current="article.title" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <!-- Article Content -->
            <article class="lg:col-span-8">
                <div class="mb-8">
                    <div class="flex items-center gap-3 mb-4">
                        <span
                            class="bg-navy/10 text-navy dark:bg-primary/10 dark:text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {{ article.category }}
                        </span>
                        <div
                            class="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-slate-500 text-xs font-bold">
                            <Icon icon="ph:calendar-blank-bold" class="text-sm" />
                            {{ article.date }}
                        </div>
                        <div
                            class="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold">
                            <Icon icon="ph:clock-bold" class="text-sm" />
                            {{ readTime }} mnt baca
                        </div>
                    </div>
                    <h1
                        class="text-3xl md:text-4xl lg:text-5xl font-black text-navy dark:text-white leading-tight mb-6">
                        {{ article.title }}
                    </h1>

                    <div class="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div class="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                            <img :src="article.author.avatar" alt="Author" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div class="text-sm font-bold text-navy dark:text-white">{{ article.author.name }}</div>
                            <div class="text-xs text-slate-500">{{ article.author.role }}</div>
                        </div>
                        <div class="ml-auto flex items-center gap-3">
                            <span
                                class="hidden sm:block text-xs font-bold text-slate-400 uppercase tracking-wider">Bagikan:</span>
                            <div class="flex gap-2">
                                <button
                                    class="p-2 text-slate-400 hover:text-green-500 transition-all rounded-xl bg-gray-50 hover:bg-green-50">
                                    <Icon icon="ph:whatsapp-logo-bold" class="text-xl" />
                                </button>
                                <button
                                    class="p-2 text-slate-400 hover:text-blue-600 transition-all rounded-xl bg-gray-50 hover:bg-blue-50">
                                    <Icon icon="ph:facebook-logo-bold" class="text-xl" />
                                </button>
                                <button
                                    class="p-2 text-slate-400 hover:text-navy transition-all rounded-xl bg-gray-50 hover:bg-navy/10">
                                    <Icon icon="ph:link-bold" class="text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mb-10 rounded-2xl overflow-hidden shadow-lg aspect-video relative">
                    <img :src="article.image" :alt="article.title"
                        class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div
                        class="absolute bottom-4 right-4 text-white/80 text-xs bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                        Photo: {{ article.imageCredit || 'Archery Hub Documentation' }}
                    </div>
                </div>

                <!-- Article text -->
                <div class="prose prose-slate prose-lg max-w-none dark:prose-invert 
                    prose-headings:text-navy prose-headings:font-black 
                    prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-navy prose-strong:font-black">
                    <div v-html="article.content"></div>
                </div>

                <!-- Footer Share -->
                <div
                    class="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 class="font-black text-navy text-lg mb-1">Apakah artikel ini bermanfaat?</h4>
                        <p class="text-sm text-slate-500">Bagikan artikel ini ke teman panahan kamu!</p>
                    </div>
                    <div class="flex gap-3">
                        <BaseButton variant="outline" size="sm" icon="ph:whatsapp-logo-bold"
                            class="!bg-white hover:!text-green-600">WhatsApp</BaseButton>
                        <BaseButton variant="outline" size="sm" icon="ph:facebook-logo-bold"
                            class="!bg-white hover:!text-blue-600">Facebook</BaseButton>
                        <BaseButton variant="outline" size="sm" icon="ph:link-bold" class="!bg-white">Salin Link
                        </BaseButton>
                    </div>
                </div>

                <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div class="flex flex-wrap gap-2 mb-6">
                        <a v-for="tag in article.tags" :key="tag" href="#"
                            class="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                            #{{ tag }}
                        </a>
                    </div>
                </div>
            </article>

            <!-- Sidebar -->
            <aside class="lg:col-span-4 space-y-8">
                <!-- Related News -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 class="text-lg font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                        <span class="w-1 h-6 bg-primary rounded-full"></span>
                        Artikel Terkait
                    </h3>
                    <div class="space-y-6">
                        <NuxtLink v-for="item in relatedArticles" :key="item.slug" :to="`/berita/${item.slug}`"
                            class="group flex gap-4 items-start">
                            <div class="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                                <img :src="item.image" :alt="item.title"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div>
                                <h4
                                    class="font-bold text-navy dark:text-white text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                    {{ item.title }}
                                </h4>
                                <span class="text-xs text-slate-400">{{ item.date }}</span>
                            </div>
                        </NuxtLink>
                    </div>
                    <NuxtLink to="/berita"
                        class="block w-full text-center mt-6 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Lihat Semua Berita
                    </NuxtLink>
                </div>

                <!-- Upcoming Tournaments -->
                <div class="bg-navy rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                    <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                    <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                        <span class="material-symbols-outlined text-primary">emoji_events</span>
                        Turnamen Mendatang
                    </h3>
                    <div class="space-y-4 relative z-10">
                        <div v-for="t in upcomingTournaments" :key="t.id"
                            class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                            <div
                                class="bg-white/10 rounded-lg w-12 h-12 flex flex-col items-center justify-center text-center flex-shrink-0">
                                <span class="text-[10px] uppercase font-bold text-primary">{{ t.month }}</span>
                                <span class="text-lg font-bold leading-none">{{ t.day }}</span>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm leading-tight mb-0.5">{{ t.title }}</h4>
                                <div class="flex items-center gap-1 text-xs text-slate-300">
                                    <span class="material-symbols-outlined text-[10px]">location_on</span> {{ t.location
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <NuxtLink to="/events"
                        class="inline-flex items-center gap-2 text-primary text-xs font-black mt-6 hover:text-white transition-all group">
                        Lihat Kalender Turnamen
                        <Icon icon="ph:arrow-right-bold"
                            class="transform group-hover:translate-x-1 transition-transform" />
                    </NuxtLink>
                </div>

                <!-- Subscribe -->
                <div
                    class="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-6 shadow-sm border border-primary relative overflow-hidden">
                    <div class="relative z-10">
                        <h4 class="font-bold text-navy text-lg mb-2">Langganan Berita</h4>
                        <p class="text-navy/80 text-sm mb-4">Dapatkan berita panahan terbaru langsung di email Anda.</p>
                        <form class="space-y-2">
                            <input
                                class="w-full px-3 py-2 rounded-lg text-sm border-0 focus:ring-2 focus:ring-navy/50 text-slate-800"
                                placeholder="Alamat email Anda" type="email" required />
                            <button
                                class="w-full bg-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-navy-dark transition-colors">Langganan</button>
                        </form>
                    </div>
                    <span
                        class="material-symbols-outlined absolute -bottom-6 -right-6 text-[8rem] text-navy/10 rotate-12 pointer-events-none">mark_email_unread</span>
                </div>
            </aside>
        </div>
    </main>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const slug = route.params.slug

// Calculate read time
const readTime = computed(() => {
    const text = article.value.content || ''
    const wordsPerMinute = 200
    const noOfWords = text.split(/\s/g).length
    const minutes = noOfWords / wordsPerMinute
    return Math.ceil(minutes) || 1
})

// Mock data integration
const articlesData = {
    'perkembangan-panahan-indonesia-2024': {
        title: 'National Training Center Selection Results for 2025 Announced',
        category: 'National Team',
        date: 'Oct 24, 2024',
        author: {
            name: 'Editorial Team',
            role: 'Archery Hub Indonesia',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEyoMyPhTl7-9oRbs8Fqz1YZxEwczL3vvrIpNzNHGImIhte8_MRqCsmxPDpeo-GMFv4xD1UFE7CzQuZjLAaeTEFSwwGpLM5Fuuji1ri-DclVPd3XjaiZbP_HVCmNxUF4N4RvPt5eunD3D7XJwRXiE80p0b-XDjG79vpkghLPtwWffcqE__kLuIxrZg_xFXL5tPcnF3V-v_UjBTeSP3GZHOFSZ132JQ3wm91uitNtsctbagveyUjYxxYgEumBV7_uYhaBtTeHfBlCs'
        },
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o',
        imageCredit: 'PB Perpani Documentation',
        content: `
      <p class="lead font-medium text-slate-600 dark:text-slate-300 text-xl mb-6 leading-relaxed">
        The Indonesian Archery Association (PB Perpani) has officially released the list of athletes selected for the National Training Center (Pelatnas) for the upcoming 2025 season. This announcement follows a week of rigorous selection trials held at the Gelora Bung Karno Archery Field in Jakarta.
      </p>
      <p class="mb-6 text-slate-700 dark:text-slate-400 leading-relaxed">
        A total of 24 athletes across Recurve and Compound divisions have been chosen to represent Indonesia in upcoming international championships, including the SEA Games and the Archery World Cup stages. The selection process this year introduced new physical endurance parameters alongside the traditional scoring rounds.
      </p>
      <h3 class="text-2xl font-bold text-navy dark:text-white mb-4 mt-10">A New Era for Indonesian Archery</h3>
      <p class="mb-6 text-slate-700 dark:text-slate-400 leading-relaxed">
        The head coach of the National Team emphasized that this year's squad is a mix of seasoned veterans and promising young talent. The strategic decision to include younger athletes aims to build a sustainable pipeline for the 2028 Olympics.
      </p>
      <div class="bg-background-light dark:bg-gray-800 border-l-4 border-primary p-6 my-8 rounded-r-lg">
        <p class="italic text-lg text-navy dark:text-slate-200 font-medium mb-2">
          "The energy in the camp is different this year. We are seeing record-breaking scores during practice sessions from athletes as young as 17. The future looks very bright."
        </p>
        <cite class="text-sm text-slate-500 not-italic block mt-2">— Head Coach, National Archery Team</cite>
      </div>
    `,
        tags: ['Pelatnas2025', 'Recurve', 'Compound', 'ArcheryIndonesia']
    }
}

const article = computed(() => {
    return articlesData[slug] || articlesData['perkembangan-panahan-indonesia-2024']
})

const relatedArticles = [
    {
        slug: '1',
        title: "Recurve Women's Team Secures Gold at Asian Grand Prix",
        date: 'Oct 20, 2024',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQStrrmLQN-DtqrTO5KWNF3EvwOXSw-raemHMh-lxMUVAtHiqxHNMqzQoV2l1ReELlRe_dVIAkp1P8Bc8ekRqbhOn-axS6izTQXKw3d70pq-CpZHWUZoS58mGL70U_Bk96ViNRcaOaGr5wIkPrtg8w46mzrAtHgWRH6VKAUalmkrFJ8qjDltkmd-nHJs4aUfrBBphZSnivwOkhoIjzG8dpjeCtp_UOZTOnovXJP7IAWJEeWqw7Uh7-mlLVkorgyeOsSRun6CmO_8I'
    },
    {
        slug: '2',
        title: 'New Equipment Regulations for U-18 National Championship',
        date: 'Oct 18, 2024',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8OlQbcxO7uY4gwKVt6JygaktR4FjGZfJwbWiOyDIXqXr0bCnQIn3f-5m63myglDTGxdrpDHrFX2wVGOC7C8INtL7td4RDrpYhrJi0qjxPG7jixXi-Cw0fJQfRMda9sgJhfzCsFLmMhX9mvC6_gNAo5OF_MDtU5ukfm3hvRqWuHC0pbxNqSd0uWfIxLjxHXmyDnRtFg9VIz-XC2tCuvSusJKEFLjs57_DO7_uOGurALxGKsxcgIJmc_0gHV72A6BGvhiStIpWr3o'
    }
]

const upcomingTournaments = [
    { id: '1', title: 'Jakarta Open 2024', month: 'Nov', day: '15', location: 'Senayan' },
    { id: '2', title: 'Surabaya Cup', month: 'Dec', day: '05', location: 'Surabaya' },
    { id: '3', title: 'National Indoor', month: 'Jan', day: '12', location: 'Bandung' }
]

useHead({
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => `${article.value.title} - Archeryhub.id`,
    description: () => article.value.excerpt
})
</script>

<style scoped>
.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
