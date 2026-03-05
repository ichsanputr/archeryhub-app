<template>
    <div class="bg-background-light min-h-screen flex flex-col">

        <!-- ── Fixed dot-grid background ── -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.035]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 40px 40px;">
        </div>

        <!-- ══════════════════════════════════════
             HERO HEADER — Full Width
             ══════════════════════════════════════ -->
        <!-- ── Hero Section ── -->
        <section
            class="relative min-h-[32rem] w-full overflow-hidden bg-navy-dark pt-28 sm:pt-36 pb-12 sm:pb-20 flex items-end">
            <img :src="useImageOrDefault(club.bannerUrl || club.logoUrl, club.name)"
                class="w-full h-full object-cover object-center opacity-80" :alt="club.name" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/40 to-transparent"></div>

            <div
                class="relative w-full p-8 sm:p-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-end justify-between gap-8 z-10">
                <div class="text-white space-y-4 w-full sm:w-auto">
                    <div class="flex flex-wrap items-center gap-4">
                        <span
                            class="px-4 py-1 bg-primary text-navy-dark text-[10px] font-black rounded-full capitalize tracking-[0.2em]">Profil
                            Resmi Klub</span>
                        <div v-if="club.abbreviation" class="flex items-center gap-1 text-primary">
                            <Icon icon="ph:shield-star-fill" class="text-lg" />
                            <span class="text-[10px] font-extrabold uppercase tracking-widest">{{ club.abbreviation
                            }}</span>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
                        <div
                            class="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 sm:border-[6px] border-white/20 shadow-2xl overflow-hidden bg-white shrink-0 group">
                            <img :src="useImageOrDefault(club.logoUrl, club.name)"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                :alt="club.name" />
                        </div>
                        <h1
                            class="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-[0.9] text-white">
                            {{ club.name }}
                        </h1>
                    </div>

                    <div class="flex items-center gap-6 pt-4">
                        <div class="flex items-center gap-2">
                            <span class="text-white/60 text-[10px] font-black uppercase tracking-widest">Lokasi</span>
                            <span class="font-bold flex items-center gap-2 text-sm">{{ club.city || 'Indonesia' }}
                                🇮🇩</span>
                        </div>
                        <div v-if="club.established" class="w-px h-4 bg-white/20"></div>
                        <div v-if="club.established" class="flex items-center gap-2">
                            <span class="text-white/60 text-[10px] font-black uppercase tracking-widest">Berdiri</span>
                            <span class="font-bold uppercase tracking-widest text-sm text-primary">{{ club.established
                                }}</span>
                        </div>
                        <div v-if="club.memberCount" class="w-px h-4 bg-white/20"></div>
                        <div v-if="club.memberCount" class="flex items-center gap-2">
                            <span class="text-white/60 text-[10px] font-black uppercase tracking-widest">Anggota</span>
                            <span class="font-bold uppercase tracking-widest text-sm text-primary">{{ club.memberCount
                            }}+</span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-end gap-3 w-full md:w-auto">
                    <div class="flex gap-3 w-full md:w-auto">
                        <BaseButton v-if="!membership" variant="primary" size="md" icon="ph:plus-bold"
                            :loading="isJoining" @click="joinClub"
                            class="shadow-xl shadow-primary/20 whitespace-nowrap !rounded-xl text-navy-dark flex-1 md:flex-none">
                            Gabung
                        </BaseButton>
                        <div v-else-if="membership && membership.status === 'active' && membership.club_id === club.id"
                            class="px-8 py-4 bg-primary text-navy font-black text-xs flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-primary/10 flex-1 md:flex-none">
                            <Icon icon="ph:check-circle-fill" class="text-base" />
                            ANGGOTA AKTIF
                        </div>
                        <div v-else-if="membership && membership.status === 'pending' && membership.club_id === club.id"
                            class="px-8 py-4 bg-white/5 border border-white/10 text-white/60 font-black text-xs flex items-center justify-center gap-2 rounded-xl backdrop-blur-md flex-1 md:flex-none">
                            <Icon icon="ph:clock-bold" class="text-base" />
                            MENUNGGU PERSETUJUAN
                        </div>
                        <button @click="openShareDialog"
                            class="size-14 rounded-xl border border-white/10 hover:border-primary hover:bg-primary transition-all flex items-center justify-center group backdrop-blur-md shrink-0">
                            <Icon icon="ph:share-network-bold" class="text-xl text-white group-hover:text-navy" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── Main Content ── -->
        <div class="bg-white rounded-t-[3rem] -mt-12 relative z-20">
            <main class="max-w-7xl mx-auto px-6 md:px-12 py-24">
                <div class="space-y-24">
                    <!-- About Section -->
                    <div class="space-y-8">
                        <h3 class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                            Tentang Klub <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <div class="md:col-span-8">
                                <p class="text-sm md:text-xl text-navy/80 leading-relaxed font-light">
                                    {{ club.description || defaultDesc }}
                                </p>
                            </div>
                            <div class="md:col-span-4 space-y-6">
                                <div v-if="club.headCoach"
                                    class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                    <div class="p-3 bg-white rounded-xl shadow-sm">
                                        <Icon icon="ph:sketch-logo" class="text-xl text-navy" />
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">
                                            Pelatih Kepala</p>
                                        <h5 class="font-bold text-navy mt-1">{{ club.headCoach }}</h5>
                                    </div>
                                </div>
                                <div v-if="club.registrationNumber"
                                    class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4">
                                    <div class="p-3 bg-white rounded-xl shadow-sm">
                                        <Icon icon="ph:fingerprint" class="text-xl text-navy" />
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">
                                            Registrasi</p>
                                        <h5 class="font-bold text-navy mt-1">{{ club.registrationNumber }}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Facilities & Schedules -->
                    <div v-if="club.schedules?.length || club.facilities?.length" class="space-y-12">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <!-- Schedules -->
                            <div v-if="club.schedules?.length" class="space-y-8">
                                <h3
                                    class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                    Jadwal Latihan <span class="h-px flex-1 bg-gray-100"></span>
                                </h3>
                                <div class="space-y-4">
                                    <div v-for="schedule in club.schedules" :key="schedule.day"
                                        class="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <span class="text-xs font-black text-navy uppercase tracking-widest">{{
                                            schedule.day }}</span>
                                        <span
                                            class="px-4 py-1.5 bg-navy text-primary text-[10px] font-black rounded-full capitalize tracking-widest">{{
                                                schedule.time }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Facilities -->
                            <div v-if="club.facilities?.length" class="space-y-8">
                                <h3
                                    class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                    Fasilitas <span class="h-px flex-1 bg-gray-100"></span>
                                </h3>
                                <div class="flex flex-wrap gap-3">
                                    <span v-for="f in club.facilities" :key="f"
                                        class="px-5 py-3 bg-white border border-gray-100 rounded-2xl text-xs font-black text-navy shadow-sm hover:border-primary transition-colors uppercase tracking-wider">
                                        {{ f }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Members Section -->
                    <div class="space-y-12">
                        <div class="flex items-center justify-between">
                            <h3
                                class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4 flex-1">
                                Atlet Aktif <span class="h-px flex-1 bg-gray-100"></span>
                            </h3>
                        </div>

                        <div class="overflow-x-auto bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <table class="w-full text-left border-collapse min-w-[600px]">
                                <thead>
                                    <tr class="bg-gray-50/50 border-b border-gray-100">
                                        <th
                                            class="px-6 py-4 text-[10px] font-black text-navy/60 uppercase tracking-[0.2em] w-16">
                                            No</th>
                                        <th
                                            class="px-6 py-4 text-[10px] font-black text-navy/60 uppercase tracking-[0.2em]">
                                            Nama Atlet</th>
                                        <th
                                            class="px-8 py-4 text-[10px] font-black text-navy/60 uppercase tracking-[0.2em]">
                                            Divisi</th>
                                        <th
                                            class="px-6 py-4 text-[10px] font-black text-navy/60 uppercase tracking-[0.2em] text-right">
                                            Aksi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50">
                                    <template v-if="club.topMembers?.length">
                                        <tr v-for="(member, idx) in club.topMembers" :key="member.id"
                                            class="group hover:bg-gray-50/30 transition-colors">
                                            <td class="px-6 py-5">
                                                <span class="text-xs font-bold text-navy/20">{{ (memberPage - 1) *
                                                    memberLimit + idx + 1 }}</span>
                                            </td>
                                            <td class="px-6 py-5">
                                                <NuxtLink
                                                    :to="`/archers/${member.username || member.slug || member.uuid}`"
                                                    class="flex items-center gap-4">
                                                    <div
                                                        class="w-10 h-10 rounded-full overflow-hidden border border-gray-100 shrink-0">
                                                        <img :src="useImageOrDefault(member.avatar, member.name)"
                                                            :alt="member.name" class="w-full h-full object-cover" />
                                                    </div>
                                                    <span
                                                        class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                                            member.name }}</span>
                                                </NuxtLink>
                                            </td>
                                            <td class="px-8 py-5">
                                                <span
                                                    class="px-3 py-1 bg-navy/5 text-navy text-[10px] font-black rounded-full capitalize tracking-widest whitespace-nowrap">{{
                                                        member.division || 'Archer' }}</span>
                                            </td>
                                            <td class="px-6 py-5 text-right">
                                                <NuxtLink
                                                    :to="`/archers/${member.username || member.slug || member.uuid}`"
                                                    class="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 text-navy/40 group-hover:bg-navy group-hover:text-primary transition-all">
                                                    <Icon icon="ph:caret-right-bold" />
                                                </NuxtLink>
                                            </td>
                                        </tr>
                                    </template>
                                    <tr v-else>
                                        <td colspan="4" class="py-12 text-center bg-gray-50/50">
                                            <Icon icon="ph:users-three-light"
                                                class="text-4xl text-gray-200 mx-auto mb-3" />
                                            <p class="text-[10px] font-black text-navy/20 uppercase tracking-widest">
                                                Belum
                                                ada anggota terdaftar</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 pt-8">
                            <button @click="memberPage--" :disabled="memberPage === 1"
                                class="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-navy hover:bg-navy hover:text-primary disabled:opacity-30 transition-all">
                                <Icon icon="ph:caret-left-bold" />
                            </button>
                            <button v-for="p in totalPages" :key="p" @click="memberPage = p"
                                class="w-12 h-12 rounded-xl font-black text-sm border transition-all"
                                :class="memberPage === p ? 'bg-navy text-primary border-navy' : 'border-gray-100 text-navy/40 hover:border-navy'">
                                {{ p }}
                            </button>
                            <button @click="memberPage++" :disabled="memberPage === totalPages"
                                class="w-12 h-12 rounded-xl border border-gray-100 flex items-center justify-center text-navy hover:bg-navy hover:text-primary disabled:opacity-30 transition-all">
                                <Icon icon="ph:caret-right-bold" />
                            </button>
                        </div>
                    </div>

                    <!-- Achievements & News -->
                    <!-- Achievements Row -->
                    <div class="space-y-12">
                        <h3 class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                            Prestasi Terbaru <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <template v-if="club.achievements?.length">
                                <div v-for="event in club.achievements" :key="event.id"
                                    class="group cursor-pointer bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:border-primary transition-all flex flex-col gap-4"
                                    @click="router.push(`/news/${event.slug}`)">
                                    <span class="text-[10px] font-black tracking-widest text-navy/20 uppercase">{{
                                        formatDate(event.published_at) }}</span>
                                    <h4
                                        class="text-xl font-black text-navy group-hover:text-primary transition-colors leading-tight">
                                        {{ event.title }}</h4>
                                    <p class="text-sm text-navy/60 line-clamp-2 leading-relaxed">{{ event.excerpt }}</p>
                                </div>
                            </template>
                            <div v-else
                                class="col-span-full py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <Icon icon="ph:trophy-light" class="text-4xl text-gray-200 mx-auto mb-3" />
                                <p class="text-[10px] font-black text-navy/20 uppercase tracking-widest">Belum ada
                                    prestasi</p>
                            </div>
                        </div>
                    </div>

                    <!-- News Row -->
                    <div class="space-y-12">
                        <h3 class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                            Berita & Artikel <span class="h-px flex-1 bg-gray-100"></span>
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <template v-if="club.news?.length">
                                <div v-for="item in club.news" :key="item.id"
                                    class="group cursor-pointer bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:border-primary transition-all flex flex-col gap-4"
                                    @click="router.push(`/news/${item.slug}`)">
                                    <span class="text-[10px] font-black tracking-widest text-navy/20 uppercase">{{
                                        formatDate(item.published_at) }}</span>
                                    <h4
                                        class="text-xl font-black text-navy group-hover:text-primary transition-colors leading-tight">
                                        {{ item.title }}</h4>
                                    <p class="text-sm text-navy/60 line-clamp-2 leading-relaxed">{{ item.excerpt }}</p>
                                </div>
                            </template>
                            <div v-else
                                class="col-span-full py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <Icon icon="ph:newspaper-light" class="text-4xl text-gray-200 mx-auto mb-3" />
                                <p class="text-[10px] font-black text-navy/20 uppercase tracking-widest">Belum ada
                                    berita</p>
                            </div>
                        </div>
                    </div>

                    <!-- Revamped Location & Contact Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <!-- Left: Contact & Social -->
                        <div class="space-y-12">
                            <h3
                                class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                Kontak Resmi <span class="h-px flex-1 bg-gray-100"></span>
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <a v-if="club.phone" :href="`tel:${club.phone}`"
                                    class="p-6 bg-white border border-gray-100 rounded-3xl flex items-center gap-5 hover:border-primary transition-all shadow-sm group">
                                    <div
                                        class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors shrink-0">
                                        <Icon icon="ph:phone-bold" class="text-xl" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[10px] font-black text-navy/30 uppercase tracking-widest">Telepon
                                        </p>
                                        <p class="font-bold text-navy mt-0.5 truncate">{{ club.phone }}</p>
                                    </div>
                                </a>

                                <a v-if="club.website" :href="club.website" target="_blank"
                                    class="p-6 bg-white border border-gray-100 rounded-3xl flex items-center gap-5 hover:border-primary transition-all shadow-sm group">
                                    <div
                                        class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-navy group-hover:bg-navy group-hover:text-white transition-colors shrink-0">
                                        <Icon icon="ph:globe-bold" class="text-xl" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[10px] font-black text-navy/30 uppercase tracking-widest">Website
                                        </p>
                                        <p class="font-bold text-navy mt-0.5 truncate">
                                            {{ club.website.replace('https://', '').replace('http://', '') }}
                                        </p>
                                    </div>
                                </a>

                                <template v-if="club.socialMedia?.length">
                                    <a v-for="social in club.socialMedia" :key="social.platform"
                                        :href="getSocialUrl(social)" target="_blank"
                                        class="p-6 bg-white border border-gray-100 rounded-3xl flex items-center gap-5 hover:border-primary transition-all shadow-sm group">
                                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0"
                                            :class="getPlatformIconBagde(social.platform)">
                                            <Icon :icon="getSocialIcon(social.platform)" class="text-xl" />
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-[10px] font-black text-navy/30 uppercase tracking-widest">{{
                                                social.platform }}</p>
                                            <p class="font-bold text-navy mt-0.5 truncate">{{ social.username }}</p>
                                        </div>
                                    </a>
                                </template>
                            </div>
                        </div>

                        <!-- Right: Location (Revamped like event detail) -->
                        <div class="space-y-12">
                            <h3
                                class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                Lokasi Latihan <span class="h-px flex-1 bg-gray-100"></span>
                            </h3>
                            <div
                                class="bg-white rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
                                <div class="h-48 md:h-64 w-full bg-gray-50 relative group">
                                    <iframe v-if="gmapsEmbedUrl" :src="gmapsEmbedUrl" width="100%" height="100%"
                                        style="border:0;" allowfullscreen="" loading="lazy"
                                        referrerpolicy="no-referrer-when-downgrade">
                                    </iframe>
                                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                                        <div class="text-center">
                                            <Icon icon="ph:map-pin-light" class="text-5xl text-gray-200 mb-2 mx-auto" />
                                            <p class="text-[10px] font-black text-navy/20 uppercase tracking-widest">
                                                Peta belum tersedia</p>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="club.address"
                                    class="p-6 md:p-8 flex flex-col md:flex-row items-start gap-4 md:gap-6 bg-white">
                                    <div class="p-3 md:p-4 bg-gray-50 rounded-2xl shrink-0">
                                        <Icon icon="ph:map-pin-fill" class="text-xl md:text-2xl text-navy" />
                                    </div>
                                    <div class="min-w-0">
                                        <h4 class="text-base md:text-lg font-bold text-navy leading-snug mb-1">{{
                                            club.address }}</h4>
                                        <p
                                            class="text-[10px] md:text-xs font-black text-navy/30 uppercase tracking-[0.1em]">
                                            {{
                                                club.formattedLocation }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Dynamic Sections (FAQ, Gallery) ── -->
                    <template v-if="club.sections?.length">
                        <div v-for="(section, sIdx) in club.sections" :key="sIdx" class="space-y-12">
                            <h3
                                class="text-sm font-black uppercase tracking-[0.4em] text-navy/30 flex items-center gap-4">
                                {{ section.title }} <span class="h-px flex-1 bg-gray-100"></span>
                            </h3>

                            <p v-if="section.content"
                                class="text-base md:text-xl text-navy/80 leading-relaxed font-light max-w-2xl">
                                {{ section.content }}
                            </p>

                            <!-- FAQ -->
                            <div v-if="section.type === 'faq'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div v-for="(item, iIdx) in section.items" :key="iIdx"
                                    class="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-primary/40 transition-all">
                                    <h4 class="font-black text-navy text-lg mb-4 flex items-start gap-3">
                                        <Icon icon="ph:question-bold" class="text-primary mt-1 shrink-0" />
                                        {{ item.question }}
                                    </h4>
                                    <p class="text-navy/60 text-sm md:text-base leading-relaxed pl-8">{{ item.answer }}
                                    </p>
                                </div>
                            </div>

                            <!-- Gallery -->
                            <div v-if="section.type === 'gallery'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div v-for="(img, iIdx) in (section.images ? section.images.split(',') : [])"
                                    :key="iIdx"
                                    class="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group">
                                    <img :src="img.trim()"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </main>
        </div>



        <!-- Dialogs -->
        <AppDialog v-model:show="showJoinConfirmDialog" title="Gabung Klub"
            :message="`Apakah Anda yakin ingin bergabung dengan ${club.name}? Permintaan Anda akan dikirim ke pengurus klub untuk disetujui.`"
            confirm-text="Ya, Gabung Sekarang" icon="ph:user-plus-bold" @confirm="confirmJoin" />

        <AppDialog v-model:show="showLoginRequiredDialog" title="Login Diperlukan"
            message="Anda harus masuk ke akun Archer Anda untuk dapat bergabung dengan klub ini."
            confirm-text="Login Sekarang" icon="ph:lock-key-bold" @confirm="router.push('/auth/login')" />

        <AppDialog v-model:show="showArcherRequiredDialog" title="Tipe Akun Tidak Sesuai"
            message="Maaf, saat ini hanya akun dengan tipe 'Archer' yang dapat bergabung dengan klub. Silakan gunakan akun Archer Anda."
            confirm-text="Mengerti" icon="ph:warning-circle-bold" @confirm="showArcherRequiredDialog = false" />

        <!-- Share Dialog -->
        <Transition name="modal">
            <div v-if="showShareDialog" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div @click="closeShareDialog" class="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-sm"></div>
                <div class="relative w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 z-10">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-black text-[#0f172a]">Bagikan Klub</h3>
                        <button @click="closeShareDialog"
                            class="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-[#0f172a] hover:bg-gray-200 transition-colors">
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>

                    <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                        <div
                            class="w-14 h-14 rounded-3xl overflow-hidden border-2 border-primary flex-shrink-0 bg-white">
                            <img :src="useImageOrDefault(club.logoUrl, club.name)" class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p class="text-xs text-[#64748b] font-bold uppercase tracking-wider mb-0.5">Klub Panahan</p>
                            <p class="font-black text-[#0f172a] text-base">{{ club.name }}</p>
                            <p class="text-xs text-[#64748b]">{{ club.formattedLocation }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-4 gap-3 mb-6">
                        <button v-for="plat in platforms" :key="plat.id" @click="shareTo(plat.id)"
                            class="flex flex-col items-center gap-2 group">
                            <div :class="`w-12 h-12 rounded-xl ${plat.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all`"
                                v-html="plat.iconHtml"></div>
                            <span class="text-[9px] font-black text-[#64748b] uppercase tracking-wider">{{ plat.name
                                }}</span>
                        </button>
                    </div>

                    <div class="flex gap-2">
                        <input type="text" readonly :value="shareUrl"
                            class="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-[#64748b] outline-none" />
                        <button @click="copyLink"
                            class="px-4 py-3 bg-[#0f172a] text-white rounded-xl text-xs font-black hover:bg-[#1a365d] transition-colors whitespace-nowrap">
                            {{ copied ? '✓ Tersalin' : 'Salin' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import AppDialog from '~/components/common/AppDialog.vue'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'landing' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const { isLoggedIn, user } = useAuth()
const toast = useToast()
const isJoining = ref(false)
const showJoinConfirmDialog = ref(false)
const showLoginRequiredDialog = ref(false)
const showArcherRequiredDialog = ref(false)
const membership = ref(null)
const memberPage = ref(1)
const memberLimit = 12
const defaultDesc = 'Klub panahan yang berdedikasi untuk mengembangkan bakat dan prestasi atlet di Indonesia.'

// SSR: Fetch club data
const { data: clubData, error } = await useAsyncData(
    `club-${route.params.slug}`,
    async () => {
        const response = await $fetch(`${config.public.apiBaseUrl}/clubs/${route.params.slug}`, {
            params: { member_page: memberPage.value, member_limit: memberLimit }
        })
        return response
    },
    { watch: [memberPage] }
)

if (error.value || !clubData.value || !clubData.value.name) {
    throw createError({ statusCode: 404, statusMessage: 'Klub tidak ditemukan', fatal: true })
}

const isArcher = computed(() =>
    isLoggedIn.value && (user.value?.role === 'archer' || user.value?.user_type === 'archer')
)

const parseFacilities = (d) => {
    if (!d) return []
    if (Array.isArray(d)) return d
    try { const p = JSON.parse(d); return Array.isArray(p) ? p : [] } catch { return d.split(',').map(f => f.trim()).filter(Boolean) }
}
const parseSchedules = (d) => {
    if (!d) return []
    if (Array.isArray(d)) return d
    try { const p = JSON.parse(d); return Array.isArray(p) ? p : [] } catch { return [] }
}
const parseSocialMedia = (d) => {
    if (!d) return []
    if (Array.isArray(d)) return d
    try { const p = JSON.parse(d); return Array.isArray(p) ? p : [] } catch { return [] }
}

const totalPages = computed(() => Math.ceil((club.value?.memberCount || 0) / memberLimit))

const club = computed(() => {
    const data = clubData.value || {}
    let socials = parseSocialMedia(data.social_media).filter(s => s.username && s.username !== 'null')

    // Add individual social columns if they exist and aren't in the list
    const platforms = ['whatsapp', 'instagram', 'facebook', 'tiktok', 'twitter', 'youtube']
    platforms.forEach(plat => {
        const val = data[`social_${plat}`]
        if (val && val !== 'null' && !socials.find(s => s.platform === plat)) {
            socials.push({ platform: plat, username: val })
        }
    })

    return {
        id: data.id || data.uuid || 0,
        name: data.name || '',
        slug: data.slug || route.params.slug,
        abbreviation: data.abbreviation || '',
        city: data.city || '',
        province: data.province || '',
        formattedLocation: [data.city, data.province].filter(Boolean).join(', '),
        established: data.established ? new Date(data.established).getFullYear().toString() : '',
        bannerUrl: data.banner_url || '',
        logoUrl: data.logo_url || data.avatar_url || '',
        memberCount: data.member_count || data.members || 0,
        description: data.description || '',
        facilities: parseFacilities(data.facilities),
        phone: data.phone || data.social_whatsapp || '',
        email: data.email || '',
        address: data.address || '',
        website: data.website || '',
        headCoach: data.head_coach_name || '',
        registrationNumber: data.registration_number || '',
        schedules: parseSchedules(data.schedules || data.training_schedule),
        recentEvents: data.recent_events || [],
        achievements: data.achievements || [],
        news: data.news || [],
        topMembers: data.top_members || [],
        sections: (data.sections || []).filter(s => s.title?.toLowerCase() !== 'apa kata anggota'),
        socialMedia: socials,
        registrationConfig: data.registration_config,
        google_maps_link: data.google_maps_link || data.gmaps_link || ''
    }
})

const gmapsEmbedUrl = computed(() => {
    if (!club.value?.google_maps_link && !club.value?.address) return null

    try {
        const link = club.value.google_maps_link
        if (link && link.includes('google.com/maps/embed')) return link

        const searchQuery = club.value.address || club.value.formattedLocation || link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    } catch (e) {
        return null
    }
})

useHead({
    title: computed(() => club.value.name ? `${club.value.name} — Archeryhub.id` : 'Profil Klub — Archeryhub.id'),
    link: [{ rel: 'canonical', href: useRequestURL().href }]
})

const getSocialIcon = (platform) => ({
    instagram: 'ph:instagram-logo-fill',
    facebook: 'ph:facebook-logo-fill',
    twitter: 'ph:twitter-logo-fill',
    youtube: 'ph:youtube-logo-fill',
    tiktok: 'ph:tiktok-logo-fill',
}[platform] || 'ph:link-bold')

const getSocialUrl = (social) => {
    const base = {
        instagram: `https://instagram.com/${social.username?.replace('@', '')}`,
        facebook: social.username?.startsWith('http') ? social.username : `https://facebook.com/${social.username}`,
        twitter: `https://twitter.com/${social.username?.replace('@', '')}`,
        youtube: `https://youtube.com/@${social.username}`,
        tiktok: `https://tiktok.com/@${social.username?.replace('@', '')}`,
        whatsapp: `https://wa.me/${social.username?.replace(/[^0-9]/g, '')}`,
    }
    return base[social.platform] || social.username
}

const showShareDialog = ref(false)
const copied = ref(false)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

const openShareDialog = () => showShareDialog.value = true
const closeShareDialog = () => { showShareDialog.value = false; copied.value = false }

const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', bg: 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.038 3.069l-.669 2.445 2.511-.659c.722.451 1.591.696 2.891.696 3.128 0 5.768-2.586 5.768-5.766 0-3.18-2.585-5.766-5.762-5.766zm3.369 8.303c-.144.405-.842.755-1.168.807-.326.052-.728.093-2.185-.484-1.85-.733-3.038-2.613-3.13-2.733-.093-.12-.76-.997-.76-1.996 0-1 .475-1.5.692-1.742.176-.192.42-.312.693-.312s.273.012.396.024c.123 0 .285-.048.438.312.153.36.525 1.261.57 1.356.045.093.076.204.015.324-.312.612-.342.66-.45.804-.108.144-.225.216-.108.408.117.192.52.852 1.118 1.38.77.684 1.411.897 1.613.997.202.102.321.084.441-.054.12-.138.514-.594.651-.798.136-.204.272-.171.459-.102.187.069 1.187.561 1.391.663z"/></svg>' },
    { id: 'facebook', name: 'Facebook', bg: 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>' },
    { id: 'twitter', name: 'X', bg: 'bg-slate-50 text-slate-800 hover:bg-slate-800 hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { id: 'copy', name: 'Salin', bg: 'bg-gray-100 text-slate-600 hover:bg-[#0f172a] hover:text-white', iconHtml: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10"/></svg>' }
]

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value)
        copied.value = true
        setTimeout(() => copied.value = false, 2000)
    } catch { }
}

const shareTo = (platform) => {
    if (platform === 'copy') return copyLink()
    const text = encodeURIComponent(`Lihat profil klub panahan ${club.value.name} di Archeryhub.id`)
    const url = encodeURIComponent(shareUrl.value)
    let link = ''
    if (platform === 'whatsapp') link = `https://wa.me/?text=${text}%20${url}`
    else if (platform === 'facebook') link = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    else if (platform === 'twitter') link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    if (link) { window.open(link, '_blank', 'noopener,noreferrer'); closeShareDialog() }
}

const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

const getPlatformIconBagde = (platform) => {
    const badges = {
        instagram: 'bg-pink-50 text-pink-600',
        facebook: 'bg-blue-50 text-blue-600',
        twitter: 'bg-slate-50 text-slate-900',
        youtube: 'bg-red-50 text-red-600',
        tiktok: 'bg-slate-50 text-slate-950',
        whatsapp: 'bg-green-50 text-green-600',
    }
    return badges[platform] || 'bg-gray-50 text-gray-600'
}

const joinClub = async () => {
    if (!isLoggedIn.value) {
        showLoginRequiredDialog.value = true
        return
    }

    if (!isArcher.value) {
        showArcherRequiredDialog.value = true
        return
    }

    // Check if custom registration form exists
    if (club.value.registrationConfig) {
        try {
            const config = JSON.parse(club.value.registrationConfig)
            if (config.fields && config.fields.length > 0) {
                router.push(`/clubs/${club.value.slug}/registration`)
                return
            }
        } catch { }
    }

    showJoinConfirmDialog.value = true
}

const confirmJoin = async () => {
    isJoining.value = true
    try {
        await $fetch(`${config.public.apiBaseUrl}/clubs/join/${club.value.id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${useCookie('auth_token').value}` }
        })
        toast.success('Permintaan bergabung telah dikirim!')
        membership.value = { status: 'pending', club_id: club.value.id, club_name: club.value.name }
    } catch (err) {
        toast.error(err.data?.error || 'Gagal mengirim permintaan.')
    } finally {
        isJoining.value = false
    }
}

onMounted(async () => {
    if (isLoggedIn.value) {
        try {
            const memberResp = await $fetch(`${config.public.apiBaseUrl}/clubs/my/membership`, {
                headers: { 'Authorization': `Bearer ${useCookie('auth_token').value}` }
            })
            if (memberResp?.data) membership.value = memberResp.data
        } catch { }
    }
})
</script>
