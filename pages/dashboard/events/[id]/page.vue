<template>
    <div class="flex flex-col gap-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl sm:text-3xl font-black text-navy tracking-tight text-center sm:text-left">Halaman
                    Event</h1>
                <p class="text-gray-500 mt-1 text-sm text-center sm:text-left">Kelola informasi yang ditampilkan di
                    halaman publik event.</p>
            </div>
            <div class="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
                <BaseButton variant="outline" icon="ph:eye" :to="`/events/${eventData.slug}`" target="_blank" size="md"
                    class="flex-1 sm:flex-none">
                    Lihat
                </BaseButton>
                <BaseButton variant="primary" icon="ph:floppy-disk" @click="saveEventPage" :loading="saving" size="md"
                    class="flex-1 sm:flex-none">
                    Simpan
                </BaseButton>
            </div>
        </div>

        <!-- Tabs Navigation -->
        <div class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                class="px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap"
                :class="activeTab === tab.id ? 'text-navy border-navy bg-gray-50' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
                <Icon :icon="tab.icon" class="text-xl" />
                {{ tab.name }}
            </button>
        </div>

        <div v-if="activeTab === 'faq'" class="space-y-6">
            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                        <Icon icon="ph:question" class="text-primary text-xl" />
                        Pertanyaan Sering Diajukan (FAQ)
                    </h2>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-400">Tampilkan Seksi FAQ</span>
                            <button @click="form.page_settings.sections.faq = !form.page_settings.sections.faq"
                                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                                :class="form.page_settings.sections.faq ? 'bg-primary' : 'bg-gray-200'">
                                <span
                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                    :class="form.page_settings.sections.faq ? 'translate-x-5.5' : 'translate-x-1'"></span>
                            </button>
                        </div>
                        <BaseButton variant="outline" size="xs" @click="addFAQField">
                            <Icon icon="ph:plus-bold" class="mr-1" /> Tambah FAQ
                        </BaseButton>
                    </div>
                </div>
                <div class="p-6 space-y-4">
                    <div v-if="form.faq?.length === 0"
                        class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p class="text-sm text-gray-500">Belum ada FAQ yang ditambahkan.</p>
                    </div>
                    <div v-else class="space-y-4">
                        <div v-for="(item, index) in form.faq" :key="index"
                            class="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group">
                            <button @click="removeFAQField(index)"
                                class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                <Icon icon="ph:trash" />
                            </button>
                            <div class="space-y-4">
                                <div class="space-y-2">
                                    <label
                                        class="text-xs font-bold text-gray-400 uppercase tracking-widest">Pertanyaan</label>
                                    <input v-model="item.question" type="text"
                                        placeholder="Contoh: Berapa biaya pendaftaran?"
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                </div>
                                <div class="space-y-2">
                                    <label
                                        class="text-xs font-bold text-gray-400 uppercase tracking-widest">Jawaban</label>
                                    <textarea v-model="item.answer" rows="3"
                                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
                                        placeholder="Tuliskan jawaban yang detail..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Main Content -->
        <div class="space-y-6">
            <!-- Informasi Tab -->
            <div v-if="activeTab === 'informasi'" class="space-y-6">
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:info" class="text-primary text-xl" />
                            Informasi Dasar
                        </h2>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-400">Tampilkan di Halaman Publik</span>
                            <button @click="form.page_settings.sections.about = !form.page_settings.sections.about"
                                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                                :class="form.page_settings.sections.about ? 'bg-primary' : 'bg-gray-200'">
                                <span
                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                    :class="form.page_settings.sections.about ? 'translate-x-5.5' : 'translate-x-1'"></span>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-gray-700">Nama Event</label>
                            <input v-model="form.name" type="text"
                                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Nama event Anda" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <label class="text-sm font-bold text-gray-700">Deskripsi (Tentang Event)</label>
                            <TiptapEditor v-model="form.description" class="min-h-[300px]" />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Tanggal Mulai</label>
                                <input v-model="form.start_date" type="datetime-local"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Tanggal Selesai</label>
                                <input v-model="form.end_date" type="datetime-local"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Tipe Lokasi</label>
                                <select v-model="form.location_type"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                    <option value="">Pilih Tipe Lokasi</option>
                                    <option v-for="discipline in disciplines" :key="discipline.id"
                                        :value="discipline.name">
                                        {{ discipline.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Status Event</label>
                                <select v-model="form.status"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                                    <option value="draft">Draft (Belum dipublikasi)</option>
                                    <option value="active">Aktif (Dipublikasikan)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-navy">
                            Divisi Kompetisi
                        </h2>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-400">Tampilkan di Halaman Publik</span>
                            <button
                                @click="form.page_settings.sections.divisions = !form.page_settings.sections.divisions"
                                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                                :class="form.page_settings.sections.divisions ? 'bg-primary' : 'bg-gray-200'">
                                <span
                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                    :class="form.page_settings.sections.divisions ? 'translate-x-5.5' : 'translate-x-1'"></span>
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <div v-if="eventCategories.length === 0" class="text-center py-12">
                            <Icon icon="ph:info" class="text-4xl text-gray-200 mx-auto mb-3" />
                            <p class="text-sm text-gray-500 mb-4">Belum ada kategori lomba yang dibuat. Tambahkan
                                kategori untuk menampilkan divisi kompetisi.</p>
                            <BaseButton variant="outline" size="sm" :to="`/dashboard/events/${eventId}/categories`">
                                <Icon icon="ph:plus-bold" class="mr-1" /> Tambah Kategori
                            </BaseButton>
                        </div>
                        <div v-else class="space-y-4">
                            <div v-for="division in groupedDivisions" :key="division.name"
                                class="border border-gray-100 rounded-xl p-5 hover:border-primary transition-colors bg-gray-50/50">
                                <div class="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 class="text-lg font-bold text-navy">{{ division.name }}</h3>
                                        <p class="text-xs text-gray-500">{{ division.categories.length }} kategori</p>
                                    </div>
                                    <span class="bg-navy text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {{ division.distance || 'Standard' }}
                                    </span>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div v-for="category in division.categories" :key="category.id"
                                        class="bg-white rounded-lg p-3 border border-gray-100 flex items-center gap-2">
                                        <Icon icon="ph:check-circle-fill"
                                            class="text-primary text-base flex-shrink-0" />
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-bold text-navy truncate">
                                                {{ category.category_name }} - {{ category.event_type_name }} - {{
                                                    category.gender_division_name }}
                                            </p>
                                            <p v-if="category.max_participants" class="text-xs text-gray-500">
                                                Maks. {{ category.max_participants }} peserta
                                            </p>
                                        </div>
                                        <span
                                            :class="category.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                                            class="px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0">
                                            {{ category.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Pendaftaran Tab -->
            <div v-if="activeTab === 'pendaftaran'" class="space-y-6">
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:ticket" class="text-primary text-xl" />
                            Biaya Pendaftaran
                        </h2>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-400">Tampilkan di Halaman Publik</span>
                            <button @click="form.page_settings.sections.fees = !form.page_settings.sections.fees"
                                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                                :class="form.page_settings.sections.fees ? 'bg-primary' : 'bg-gray-200'">
                                <span
                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                    :class="form.page_settings.sections.fees ? 'translate-x-5.5' : 'translate-x-1'"></span>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700">List Biaya Pendaftaran</label>
                                <BaseButton variant="outline" size="xs" @click="addFeeField">
                                    <Icon icon="ph:plus-bold" class="mr-1" /> Tambah Biaya
                                </BaseButton>
                            </div>
                            <div v-if="!form.fees || form.fees.length === 0"
                                class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p class="text-xs text-gray-400">Belum ada biaya pendaftaran. Tambahkan untuk memudahkan
                                    pendaftar.</p>
                            </div>
                            <div v-else class="space-y-3">
                                <div v-for="(fee, index) in form.fees" :key="index"
                                    class="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input v-model="fee.name" type="text" placeholder="Nama Biaya"
                                            class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" />
                                        <div class="relative">
                                            <span
                                                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">IDR</span>
                                            <input v-model.number="fee.amount" type="number"
                                                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm" />
                                        </div>
                                        <input v-model="fee.description" type="text" placeholder="Deskripsi (opsional)"
                                            class="md:col-span-2 w-full px-4 py-2 rounded-lg border border-gray-200 text-xs" />
                                    </div>
                                    <button @click="removeFeeField(index)" class="p-2 text-gray-400 hover:text-red-500">
                                        <Icon icon="ph:trash" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Batas Pendaftaran</label>
                                <input v-model="form.registration_deadline" type="datetime-local"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Biaya Pendaftaran (Rp)</label>
                                <input v-model.number="form.entry_fee" type="number" placeholder="350000"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Metode Pembayaran Section -->
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:credit-card" class="text-primary text-xl" />
                            Metode Pembayaran
                        </h2>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-400">Tampilkan di Halaman Publik</span>
                            <button
                                @click="form.page_settings.sections.payment_methods = !form.page_settings.sections.payment_methods"
                                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                                :class="form.page_settings.sections.payment_methods ? 'bg-primary' : 'bg-gray-200'">
                                <span
                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                    :class="form.page_settings.sections.payment_methods ? 'translate-x-5.5' : 'translate-x-1'"></span>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-sm font-bold text-gray-700">Daftar Metode Pembayaran</label>
                                <BaseButton variant="outline" size="xs" @click="addPaymentMethodField">
                                    <Icon icon="ph:plus-bold" class="mr-1" /> Tambah Metode
                                </BaseButton>
                            </div>
                            <div v-if="!form.payment_methods || form.payment_methods.length === 0"
                                class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p class="text-xs text-gray-400">Belum ada metode pembayaran. Tambahkan untuk informasi
                                    peserta.</p>
                            </div>
                            <div v-else class="space-y-3">
                                <div v-for="(method, index) in form.payment_methods" :key="index"
                                    class="flex gap-3 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div class="flex-grow space-y-3">
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input v-model="method.bank_name" type="text"
                                                placeholder="Nama Bank/E-Wallet"
                                                class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" />
                                            <input v-model="method.account_number" type="text"
                                                placeholder="Nomor Rekening/Akun"
                                                class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" />
                                        </div>
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input v-model="method.account_name" type="text"
                                                placeholder="Nama Pemilik Rekening"
                                                class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" />
                                            <select v-model="method.type"
                                                class="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm">
                                                <option value="bank">Bank Transfer</option>
                                                <option value="ewallet">E-Wallet</option>
                                                <option value="qris">QRIS</option>
                                            </select>
                                        </div>
                                        <input v-model="method.instructions" type="text"
                                            placeholder="Instruksi tambahan (opsional)"
                                            class="w-full px-4 py-2 rounded-lg border border-gray-200 text-xs" />
                                    </div>
                                    <button @click="removePaymentMethodField(index)"
                                        class="p-2 text-gray-400 hover:text-red-500">
                                        <Icon icon="ph:trash" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:emoji-events" class="text-primary text-xl" />
                            Hadiah & Guidebook
                        </h2>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-400">Tampilkan Seksi Hadiah</span>
                            <button @click="form.page_settings.sections.prizes = !form.page_settings.sections.prizes"
                                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                                :class="form.page_settings.sections.prizes ? 'bg-primary' : 'bg-gray-200'">
                                <span
                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                    :class="form.page_settings.sections.prizes ? 'translate-x-5.5' : 'translate-x-1'"></span>
                            </button>
                        </div>
                    </div>
                    <div class="p-6 space-y-5">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Total Hadiah (IDR)</label>
                                <input v-model.number="form.total_prize" type="number"
                                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-bold text-gray-700">Buku Panduan Teknis (PDF)</label>
                                <div class="flex items-center gap-2">
                                    <input type="text" :value="form.technical_guidebook_url ? 'Guidebook.pdf' : ''"
                                        readonly
                                        class="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm italic"
                                        placeholder="Belum ada file" />
                                    <input type="file" ref="guidebookInput" class="hidden" accept=".pdf"
                                        @change="handleGuidebookUpload" />
                                    <BaseButton variant="outline" size="sm" @click="$refs.guidebookInput.click()"
                                        :loading="uploadingGuidebook">Upload</BaseButton>
                                </div>
                            </div>
                        </div>
                        <div class="pt-4 border-t border-gray-100">
                            <label class="text-sm font-bold text-gray-700 mb-3 block">Detail Hadiah</label>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-600">Juara 1</label>
                                    <input v-model="form.prizes.first" type="text" placeholder="Rp 15.000.000"
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                                    <input v-model="form.prizes.first_caption" type="text"
                                        placeholder="+ Piala + Medali Emas"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-600">Juara 2</label>
                                    <input v-model="form.prizes.second" type="text" placeholder="Rp 10.000.000"
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                                    <input v-model="form.prizes.second_caption" type="text"
                                        placeholder="+ Piala + Medali Perak"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-gray-600">Juara 3</label>
                                    <input v-model="form.prizes.third" type="text" placeholder="Rp 7.500.000"
                                        class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                                    <input v-model="form.prizes.third_caption" type="text"
                                        placeholder="+ Piala + Medali Perunggu"
                                        class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Lokasi Tab -->
            <section v-if="activeTab === 'lokasi'"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                        <Icon icon="ph:map-pin" class="text-primary text-xl" />
                        Lokasi & Peta
                    </h2>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-gray-400">Tampilkan di Halaman Publik</span>
                        <button @click="form.page_settings.sections.location = !form.page_settings.sections.location"
                            class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                            :class="form.page_settings.sections.location ? 'bg-primary' : 'bg-gray-200'">
                            <span class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                :class="form.page_settings.sections.location ? 'translate-x-5.5' : 'translate-x-1'"></span>
                        </button>
                    </div>
                </div>
                <div class="p-6 space-y-5">
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 flex items-center gap-1">
                            Nama Venue
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.venue" type="text" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                            placeholder="Contoh: Lapangan Panahan GBK" />
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 flex items-center gap-1">
                            Alamat Lengkap
                            <span class="text-red-500">*</span>
                        </label>
                        <textarea v-model="form.address" rows="2" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all font-medium"
                            placeholder="Tuliskan alamat lengkap lokasi event..."></textarea>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 flex items-center gap-1">
                            Link Google Maps
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.gmaps_link" type="url" required
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                            placeholder="https://maps.app.goo.gl/pxDpbaZ1GTtXHTD28" />
                        <div v-if="gmapsEmbedUrl"
                            class="mt-4 rounded-xl overflow-hidden border border-gray-200 aspect-video">
                            <iframe width="100%" height="100%" style="border:0" loading="lazy"
                                :src="gmapsEmbedUrl"></iframe>
                        </div>
                    </div>
                    <div class="space-y-3">
                        <label class="text-sm font-bold text-gray-700">Aksesibilitas Lokasi</label>
                        <p class="text-xs text-gray-500 mb-3">Pilih opsi yang tersedia untuk lokasi ini</p>
                        <div class="flex flex-wrap gap-2">
                            <button v-for="option in locationAccessibilityOptions" :key="option" type="button"
                                @click="toggleLocationAccessibility(option)"
                                class="px-4 py-2 rounded-xl text-sm font-bold transition-all border-2" :class="form.location_accessibility?.includes(option)
                                    ? 'bg-primary text-navy border-primary shadow-sm'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-navy'">
                                <Icon :icon="getLocationAccessibilityIcon(option)" class="inline-block mr-1.5" />
                                {{ option }}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Media Tab -->
            <div v-if="activeTab === 'media'" class="space-y-6">
                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:image" class="text-primary text-xl" />
                            Banner & Logo
                        </h2>
                    </div>
                    <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-3">
                            <label class="text-sm font-bold text-gray-700">Banner (Header)</label>
                            <div v-if="form.banner_url" class="relative rounded-xl overflow-hidden aspect-video group">
                                <img :src="form.banner_url" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button @click="openMediaLibrary('banner')"
                                        class="p-2 bg-white rounded-lg text-navy font-bold text-xs">Ganti</button>
                                    <button @click="form.banner_url = ''"
                                        class="p-2 bg-red-500 rounded-lg text-white font-bold text-xs">Hapus</button>
                                </div>
                            </div>
                            <button v-else @click="openMediaLibrary('banner')"
                                class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-primary flex flex-col items-center justify-center text-gray-400">
                                <Icon icon="material-symbols:image-outline" class="text-3xl mb-2" />
                                <span class="text-xs font-bold">Pilih Banner</span>
                            </button>
                        </div>
                        <div class="space-y-3">
                            <label class="text-sm font-bold text-gray-700">Poster Event</label>
                            <div v-if="form.logo_url" class="relative rounded-xl overflow-hidden aspect-video group">
                                <img :src="form.logo_url" class="w-full h-full object-cover" />
                                <div
                                    class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button @click="openMediaLibrary('logo')"
                                        class="p-2 bg-white rounded-lg text-navy font-bold text-xs">Ganti</button>
                                    <button @click="form.logo_url = ''"
                                        class="p-2 bg-red-500 rounded-lg text-white font-bold text-xs">Hapus</button>
                                </div>
                            </div>
                            <button v-else @click="openMediaLibrary('logo')"
                                class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 hover:border-primary flex flex-col items-center justify-center text-gray-400">
                                <Icon icon="ph:image-square-bold" class="text-3xl mb-2" />
                                <span class="text-xs font-bold">Pilih Poster</span>
                            </button>
                        </div>
                    </div>
                </section>

                <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:images" class="text-primary text-xl" />
                            Galeri Event
                        </h2>
                    </div>
                    <div class="p-6 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div v-for="(image, index) in form.event_images" :key="index"
                            class="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                            <img :src="image.url" class="w-full h-full object-cover" />
                            <button @click="removeImage(index)"
                                class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon icon="ph:trash" class="text-xs" />
                            </button>
                        </div>
                        <button @click="openMediaLibrary('gallery')"
                            class="aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-primary flex items-center justify-center text-gray-400">
                            <Icon icon="ph:plus-bold" />
                        </button>
                    </div>
                </section>
            </div>

            <!-- Jadwal Tab -->
            <section v-if="activeTab === 'jadwal'"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h2 class="text-lg font-bold text-navy flex items-center gap-2">
                        <Icon icon="ph:calendar-bold" class="text-primary text-xl" />
                        Jadwal Lomba
                    </h2>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold text-gray-400">Tampilkan Seksi Jadwal</span>
                            <button
                                @click="form.page_settings.sections.schedule = !form.page_settings.sections.schedule"
                                class="relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none"
                                :class="form.page_settings.sections.schedule ? 'bg-primary' : 'bg-gray-200'">
                                <span
                                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                                    :class="form.page_settings.sections.schedule ? 'translate-x-5.5' : 'translate-x-1'"></span>
                            </button>
                        </div>
                        <BaseButton variant="outline" size="xs" @click="addScheduleField">
                            <Icon icon="ph:plus-bold" class="mr-1" /> Tambah Sesi
                        </BaseButton>
                    </div>
                </div>
                <div class="p-6 space-y-4">
                    <div v-if="form.schedules.length === 0"
                        class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p class="text-sm text-gray-400">Belum ada jadwal yang ditambahkan.</p>
                    </div>
                    <div v-else class="space-y-4">
                        <div v-for="(session, index) in form.schedules" :key="index"
                            class="bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                            <button @click="removeScheduleField(index)"
                                class="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                                <Icon icon="ph:trash" />
                            </button>
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div class="lg:col-span-2 space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 uppercase">Judul Sesi</label>
                                    <input v-model="session.title" type="text" placeholder="Contoh: Kualifikasi Recurve"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 uppercase">Hari Ke-</label>
                                    <input v-model.number="session.day_order" type="number"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 uppercase">Mulai</label>
                                    <input v-model="session.start_time" type="datetime-local"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 uppercase">Selesai</label>
                                    <input v-model="session.end_time" type="datetime-local"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 uppercase">Lokasi</label>
                                    <input v-model="session.location" type="text"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                                </div>
                                <div class="lg:col-span-3 space-y-1">
                                    <label class="text-[10px] font-bold text-gray-400 uppercase">Deskripsi
                                        (Opsional)</label>
                                    <textarea v-model="session.description" rows="2"
                                        class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
                                        placeholder="Deskripsi sesi..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Hasil Tab -->
        <div v-if="activeTab === 'hasil'" class="space-y-6">
            <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-black text-navy flex items-center gap-3">
                            <div class="p-2 bg-primary/10 rounded-lg">
                                <Icon icon="iconoir:leaderboard" class="text-primary text-xl" />
                            </div>
                            Dokumen Hasil Lomba
                        </h2>
                        <p class="text-sm text-gray-500 mt-1 font-medium">Upload dan kelola dokumen hasil lomba publik
                        </p>
                    </div>
                    <BaseButton variant="primary" size="sm" icon="ph:plus-bold"
                        @click="$refs.resultsFileInput?.click()">
                        Tambah File
                    </BaseButton>
                </div>

                <div class="p-8">
                    <!-- Upload Area (Compact when files exist) -->
                    <div v-if="!form.results || form.results.length === 0"
                        class="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                        @click="$refs.resultsFileInput?.click()" @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false" @drop.prevent="handleResultsDrop"
                        :class="isDragging ? 'border-primary bg-primary/5' : ''">
                        <div class="flex flex-col items-center gap-4">
                            <div
                                class="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl group-hover:shadow-primary/20 transition-all">
                                <Icon icon="ph:cloud-arrow-up"
                                    class="text-4xl text-gray-300 group-hover:text-primary" />
                            </div>
                            <div class="max-w-xs mx-auto">
                                <p class="text-base font-black text-navy group-hover:text-primary transition-colors">
                                    Upload Hasil Lomba</p>
                                <p class="text-sm text-gray-500 mt-1 font-medium italic">Drag & drop beberapa file di
                                    sini. Mendukung PDF, JPG, & PNG.</p>
                            </div>
                            <div class="flex gap-2">
                                <span
                                    class="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-400">Max
                                    10MB/file</span>
                            </div>
                        </div>
                    </div>

                    <!-- Uploaded Files List (Revamped) -->
                    <div v-if="form.results && form.results.length > 0" class="space-y-6">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div v-for="(file, index) in form.results" :key="index"
                                class="group relative bg-white rounded-2xl border border-gray-100 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all p-5">

                                <div class="flex gap-5">
                                    <!-- File Icon / Preview -->
                                    <div
                                        class="w-16 h-20 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                        <Icon :icon="getFileIcon(file.url)" class="text-3xl text-primary" />
                                        <span class="text-[9px] font-black text-gray-400 uppercase mt-1">{{
                                            getFileExt(file.url) }}</span>
                                    </div>

                                    <!-- File Metadata & Actions -->
                                    <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div class="space-y-3">
                                            <!-- Title Input -->
                                            <div class="space-y-1">
                                                <label
                                                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Judul
                                                    Tampilan</label>
                                                <input v-model="file.title" type="text"
                                                    placeholder="Contoh: Hasil Kualifikasi Recurve"
                                                    class="w-full px-3 py-2 text-sm font-bold text-navy bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-lg outline-none transition-all" />
                                            </div>

                                            <!-- Filename Input -->
                                            <div class="space-y-1">
                                                <label
                                                    class="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Nama
                                                    File Download</label>
                                                <div class="flex items-center gap-2">
                                                    <input v-model="file.name" type="text" placeholder="nama-file"
                                                        class="flex-1 px-3 py-2 text-[11px] font-medium text-gray-500 bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-lg outline-none transition-all" />
                                                    <span class="text-[10px] font-bold text-gray-400">.{{
                                                        getFileExt(file.url) }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Footer Actions -->
                                        <div class="flex items-center justify-between mt-4">
                                            <p
                                                class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                                                {{ formatFileSize(file.size) }}
                                            </p>
                                            <div class="flex items-center gap-2">
                                                <a :href="file.url" target="_blank"
                                                    class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                                    title="Pratinjau">
                                                    <Icon icon="ph:eye-bold" class="text-lg" />
                                                </a>
                                                <button @click="removeResultFile(index)"
                                                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Hapus">
                                                    <Icon icon="ph:trash-bold" class="text-lg" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Add More Area -->
                            <div @click="$refs.resultsFileInput?.click()"
                                class="border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer border-brand-border">
                                <div
                                    class="p-3 bg-gray-50 rounded-full group-hover:bg-primary group-hover:text-white transition-all text-gray-400">
                                    <Icon icon="ph:plus-bold" class="text-xl" />
                                </div>
                                <p
                                    class="text-xs font-black text-gray-400 mt-3 uppercase tracking-widest group-hover:text-primary">
                                    Tambah File Lagi</p>
                            </div>
                        </div>
                    </div>

                    <input ref="resultsFileInput" type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" multiple
                        @change="handleResultsUpload" />
                </div>
            </section>
        </div>

        <!-- Media Library Modal -->
        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import TiptapEditor from '~/components/common/TiptapEditor.vue'
import MediaLibrary from '~/components/common/MediaLibrary.vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Edit Event - Dashboard'
})

const route = useRoute()
const eventId = route.params.id

const { get, put, post } = useApi()
const saving = ref(false)
const eventCategories = ref([])

// Tab state
const activeTab = ref('informasi')
const tabs = [
    { id: 'informasi', name: 'Informasi', icon: 'ph:info' },
    { id: 'pendaftaran', name: 'Pendaftaran', icon: 'ph:ticket' },
    { id: 'lokasi', name: 'Lokasi', icon: 'ph:map-pin' },
    { id: 'media', name: 'Media', icon: 'ph:image' },
    { id: 'jadwal', name: 'Jadwal', icon: 'ph:calendar-bold' },
    { id: 'faq', name: 'FAQ', icon: 'ph:question' },
    { id: 'hasil', name: 'Hasil', icon: 'iconoir:leaderboard' }
]

// Media Library State
const showMediaLibrary = ref(false)
const mediaTarget = ref('') // 'banner', 'logo', or 'gallery'

const openMediaLibrary = (target) => {
    mediaTarget.value = target
    showMediaLibrary.value = true
}

const handleMediaSelect = (media) => {
    if (mediaTarget.value === 'banner') {
        form.value.banner_url = media.url
    } else if (mediaTarget.value === 'logo') {
        form.value.logo_url = media.url
    } else if (mediaTarget.value === 'gallery') {
        form.value.event_images.push({
            url: media.url,
            caption: media.caption || '',
            alt_text: media.caption || '',
            display_order: form.value.event_images.length,
            is_primary: false
        })
    }
    showMediaLibrary.value = false
}

const eventData = ref({
    slug: eventId,
    status: 'draft'
})

const locationAccessibilityOptions = [
    'Terjangkau Mobil/Motor',
    'Akses Transportasi Umum',
    'Parkir Luas',
    'Fasilitas Toilet',
    'Area Makan',
    'Tempat Duduk',
    'Akses Disabilitas',
    'Area Parkir Motor',
    'Area Parkir Mobil'
]

const getLocationAccessibilityIcon = (option) => {
    const icons = {
        'Terjangkau Mobil/Motor': 'ph:car',
        'Akses Transportasi Umum': 'ph:bus',
        'Parkir Luas': 'ph:parking',
        'Fasilitas Toilet': 'ph:toilet',
        'Area Makan': 'ph:fork-knife',
        'Tempat Duduk': 'ph:chair',
        'Akses Disabilitas': 'ph:wheelchair',
        'Area Parkir Motor': 'ph:motorcycle',
        'Area Parkir Mobil': 'ph:car-simple'
    }
    return icons[option] || 'ph:check-circle'
}

const toggleLocationAccessibility = (option) => {
    if (!form.value.location_accessibility) {
        form.value.location_accessibility = []
    }
    const index = form.value.location_accessibility.indexOf(option)
    if (index > -1) {
        form.value.location_accessibility.splice(index, 1)
    } else {
        form.value.location_accessibility.push(option)
    }
}

const form = ref({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    venue: '',
    address: '',
    gmaps_link: '',
    banner_url: '',
    logo_url: '',
    event_images: [],
    fees: [],
    payment_methods: [],
    schedules: [],
    registration_deadline: '',
    entry_fee: 0,
    location_type: '',
    status: 'draft',
    total_prize: 0,
    technical_guidebook_url: '',
    location_accessibility: [],
    prizes: {
        first: '',
        second: '',
        third: '',
        first_caption: '',
        second_caption: '',
        third_caption: ''
    },
    page_settings: {
        sections: {
            about: true,
            divisions: true,
            fees: true,
            payment_methods: true,
            prizes: true,
            schedule: true,
            location: true,
            faq: true
        }
    },
    faq: [],
    results: []
})

const disciplines = ref([])

const addFAQField = () => {
    if (!form.value.faq) form.value.faq = []
    form.value.faq.push({
        question: '',
        answer: ''
    })
}

const removeFAQField = (index) => {
    form.value.faq.splice(index, 1)
}

const addFeeField = () => {
    if (!form.value.fees) {
        form.value.fees = []
    }
    form.value.fees.push({
        name: '',
        amount: 0,
        description: ''
    })
}

const removeFeeField = (index) => {
    form.value.fees.splice(index, 1)
}

const addPaymentMethodField = () => {
    if (!form.value.payment_methods) {
        form.value.payment_methods = []
    }
    form.value.payment_methods.push({
        bank_name: '',
        account_number: '',
        account_name: '',
        type: 'bank',
        instructions: ''
    })
}

const removePaymentMethodField = (index) => {
    form.value.payment_methods.splice(index, 1)
}

const addScheduleField = () => {
    const lastSchedule = form.value.schedules.length > 0 ? form.value.schedules[form.value.schedules.length - 1] : null
    form.value.schedules.push({
        id: null,
        title: '',
        description: '',
        day_order: lastSchedule ? (lastSchedule.day_order || 1) : 1,
        sort_order: (form.value.schedules.length > 0 ? Math.max(...form.value.schedules.map(s => s.sort_order || 0)) : 0) + 1,
        location: '',
        start_time: '',
        end_time: ''
    })
}

const removeScheduleField = (index) => {
    form.value.schedules.splice(index, 1)
}

const uploadingGuidebook = ref(false)
const guidebookInput = ref(null)

const handleGuidebookUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
        const toast = useToast()
        toast.error('Hanya file PDF yang diperbolehkan')
        return
    }

    uploadingGuidebook.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `Guidebook ${form.value.name}`)

        const response = await post('/media/upload', formData, {
            headers: {
                // Fetch will handle the boundary automatically for FormData
            }
        })

        form.value.technical_guidebook_url = response.url
        const toast = useToast()
        toast.success('Buku panduan berhasil diupload')
    } catch (err) {
        console.error('Upload failed:', err)
        const toast = useToast()
        toast.error('Gagal mengupload buku panduan')
    } finally {
        uploadingGuidebook.value = false
    }
}

// Results upload handling
const isDragging = ref(false)
const resultsFileInput = ref(null)

const handleResultsUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    await uploadResultFiles(files)
}

const handleResultsDrop = async (event) => {
    isDragging.value = false
    const files = Array.from(event.dataTransfer.files || [])
    await uploadResultFiles(files)
}

const uploadResultFiles = async (files) => {
    const toast = useToast()
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
            toast.error(`File ${file.name} bukan format yang diizinkan (PDF, JPG, PNG)`)
            continue
        }

        // Validate file size
        if (file.size > maxSize) {
            toast.error(`File ${file.name} terlalu besar (max 10MB)`)
            continue
        }

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('caption', `Result - ${form.value.name}`)

            const response = await post('/media/upload', formData, {
                headers: {
                    // Fetch will handle the boundary automatically for FormData
                }
            })

            if (!form.value.results) {
                form.value.results = []
            }

            form.value.results.push({
                url: response.url,
                title: file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' '),
                name: file.name.replace(/\.[^/.]+$/, ""),
                size: file.size,
                type: file.type
            })

            toast.success(`File ${file.name} berhasil diupload`)
        } catch (err) {
            console.error('Upload failed:', err)
            toast.error(`Gagal mengupload file ${file.name}`)
        }
    }

    // Clear input
    if (resultsFileInput.value) {
        resultsFileInput.value.value = ''
    }
}

const removeResultFile = (index) => {
    form.value.results.splice(index, 1)
}

const getFileExt = (url) => {
    if (!url) return ''
    return url.split('.').pop()?.toLowerCase() || ''
}

const getFileIcon = (url) => {
    const ext = getFileExt(url)
    if (ext === 'pdf') return 'ph:file-pdf-duotone'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'ph:file-image-duotone'
    return 'ph:file-duotone'
}

const getFileName = (url) => {
    if (!url) return 'Unknown'
    return url.split('/').pop() || 'Unknown'
}

const formatFileSize = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Convert datetime string to datetime-local format
const formatToDatetimeLocal = (dateStr) => {
    if (!dateStr) return ''
    try {
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
        return ''
    }
}

// Convert datetime-local format to ISO string for API
const formatFromDatetimeLocal = (datetimeLocal) => {
    if (!datetimeLocal) return null
    try {
        return new Date(datetimeLocal).toISOString()
    } catch {
        return null
    }
}

// Google Maps embed URL
const gmapsEmbedUrl = computed(() => {
    if (!form.value.gmaps_link) return null

    try {
        const url = new URL(form.value.gmaps_link)

        // Extract coordinates from URL if available
        const coordsMatch = form.value.gmaps_link.match(/[?&]q=([^&]+)/)
        if (coordsMatch) {
            const query = decodeURIComponent(coordsMatch[1])
            return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
        }

        // For maps.app.goo.gl or goo.gl links, try to extract place name
        if (url.hostname.includes('maps.app') || url.hostname === 'goo.gl' || url.hostname.includes('google.com')) {
            // Use venue name if available, otherwise use the full link
            const searchQuery = form.value.venue || form.value.gmaps_link
            return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
        }
    } catch (e) {
        // If URL parsing fails, use venue name or link as search query
        const searchQuery = form.value.venue || form.value.gmaps_link
        return `https://www.google.com/maps?q=${encodeURIComponent(searchQuery)}&output=embed`
    }

    return null
})


const removeImage = (index) => {
    form.value.event_images.splice(index, 1)
}

const fetchEventData = async () => {
    try {
        const response = await get(`/events/${eventId}`)
        const data = response?.data || response

        if (data) {
            eventData.value = data

            // Fetch event images
            let eventImages = []
            try {
                const imagesRes = await get(`/events/${eventId}/images`)
                eventImages = imagesRes?.images || imagesRes?.data?.images || []
            } catch (err) {
                console.error('Failed to fetch event images:', err)
            }

            // Fetch event categories
            try {
                const categoriesRes = await get(`/events/${eventId}/categories`)
                eventCategories.value = categoriesRes?.events || categoriesRes?.data?.events || []
            } catch (err) {
                console.error('Failed to fetch event categories:', err)
                eventCategories.value = []
            }

            // Parse page_settings
            const pageSettings = data.page_settings ? JSON.parse(data.page_settings) : {
                sections: {
                    about: true,
                    divisions: true,
                    fees: true,
                    prizes: true,
                    schedule: true,
                    location: true,
                    faq: true
                }
            }

            // Parse FAQ
            let faq = []
            if (data.faq) {
                try {
                    faq = typeof data.faq === 'string' ? JSON.parse(data.faq) : data.faq
                } catch (e) {
                    console.error('Failed to parse FAQ:', e)
                }
            }

            // Fetch schedules
            let schedules = []
            try {
                const scheduleRes = await get(`/events/${eventId}/schedule`)
                schedules = scheduleRes?.schedules || scheduleRes?.data?.schedules || []
            } catch (err) {
                console.error('Failed to fetch schedules:', err)
            }

            form.value = {
                name: data.name || data.title || '',
                description: data.description || '',
                start_date: formatToDatetimeLocal(data.start_date),
                end_date: formatToDatetimeLocal(data.end_date),
                venue: data.venue || data.location || '',
                address: data.address || '',
                gmaps_link: data.gmaps_link || data.gmap_link || '',
                banner_url: data.banner_url || data.image || '',
                logo_url: data.logo_url || '',
                event_images: eventImages.length > 0 ? eventImages.map(img => ({
                    url: img.url || '',
                    caption: img.caption || '',
                    alt_text: img.alt_text || '',
                    display_order: img.display_order || 0,
                    is_primary: img.is_primary || false
                })) : [],
                fees: pageSettings.fees || [],
                payment_methods: pageSettings.payment_methods || [],
                schedules: schedules.map(s => ({
                    id: s.id || s.uuid,
                    title: s.title || '',
                    description: s.description || '',
                    day_order: s.day_order || 1,
                    sort_order: s.sort_order || 1,
                    location: s.location || '',
                    start_time: formatToDatetimeLocal(s.start_time),
                    end_time: formatToDatetimeLocal(s.end_time)
                })),
                registration_deadline: formatToDatetimeLocal(data.registration_deadline),
                entry_fee: data.entry_fee || 0,
                location_type: data.location_type || data.discipline_name || '',
                status: data.status || 'draft',
                total_prize: data.total_prize || 0,
                technical_guidebook_url: data.technical_guidebook_url || '',
                location_accessibility: pageSettings.location_accessibility || [],
                prizes: pageSettings.prizes || { first: '', second: '', third: '', first_caption: '', second_caption: '', third_caption: '' },
                page_settings: pageSettings,
                faq: faq,
                results: pageSettings.results || []
            }
        }
    } catch (error) {
        console.error('Failed to fetch event:', error)
    }
}

const saveEventPage = async () => {
    // Validation
    const toast = useToast()
    if (!form.value.venue || !form.value.address || !form.value.gmaps_link) {
        toast.error('Mohon lengkapi Nama Venue, Alamat, dan Link Google Maps')
        activeTab.value = 'lokasi' // Switch to location tab if any of these are missing
        return
    }

    saving.value = true
    try {
        // Prepare data for API
        const payload = {
            name: form.value.name,
            description: form.value.description,
            start_date: formatFromDatetimeLocal(form.value.start_date),
            end_date: formatFromDatetimeLocal(form.value.end_date),
            venue: form.value.venue,
            address: form.value.address,
            gmaps_link: form.value.gmaps_link,
            banner_url: form.value.banner_url,
            logo_url: form.value.logo_url,
            registration_deadline: formatFromDatetimeLocal(form.value.registration_deadline),
            entry_fee: form.value.entry_fee || 0,
            location_type: form.value.location_type,
            status: form.value.status,
            total_prize: form.value.total_prize,
            technical_guidebook_url: form.value.technical_guidebook_url,
            faq: form.value.faq,
            fees: form.value.fees,
            schedules: form.value.schedules.map(s => ({
                ...s,
                start_time: formatFromDatetimeLocal(s.start_time),
                end_time: formatFromDatetimeLocal(s.end_time)
            })),
            page_settings: JSON.stringify({
                ...form.value.page_settings,
                location_accessibility: form.value.location_accessibility || [],
                fees: form.value.fees || [],
                payment_methods: form.value.payment_methods || [],
                prizes: form.value.prizes || {},
                results: form.value.results || []
            })
        }

        await put(`/events/${eventId}`, payload)

        // Save schedules separately
        if (form.value.schedules.length > 0) {
            try {
                await put(`/events/${eventId}/schedule`, {
                    schedules: form.value.schedules.map(s => ({
                        id: s.id,
                        title: s.title,
                        description: s.description || null,
                        start_time: formatFromDatetimeLocal(s.start_time),
                        end_time: s.end_time ? formatFromDatetimeLocal(s.end_time) : null,
                        day_order: s.day_order || 1,
                        sort_order: s.sort_order || 1,
                        location: s.location || null
                    }))
                })
            } catch (err) {
                console.error('Failed to save schedules:', err)
            }
        }

        // Save event images separately
        if (form.value.event_images.length > 0) {
            try {
                await put(`/events/${eventId}/images`, {
                    images: form.value.event_images.filter(img => img.url)
                })
            } catch (err) {
                console.error('Failed to save event images:', err)
            }
        }

        // Show success notification
        const toast = useToast()
        toast.success('Halaman event berhasil diperbarui')

        // Refresh data to show updated values
        await fetchEventData()
    } catch (error) {
        console.error('Failed to save:', error)
        const toast = useToast()
        const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal menyimpan event'
        toast.error(errorMessage)
    } finally {
        saving.value = false
    }
}

// Helper functions for divisions
const getDivisionIcon = (divisionName) => {
    const name = divisionName?.toLowerCase() || ''
    if (name.includes('recurve')) return 'ph:target'
    if (name.includes('compound')) return 'ph:target-bold'
    if (name.includes('barebow')) return 'ph:target-duotone'
    return 'ph:target'
}

const getDivisionDistance = (divisionName) => {
    const name = divisionName?.toLowerCase() || ''
    if (name.includes('recurve')) return '70m'
    if (name.includes('compound')) return '50m'
    if (name.includes('barebow')) return '50m'
    return 'Standard'
}

// Group categories by division
const groupedDivisions = computed(() => {
    const groups = {}
    eventCategories.value.forEach(cat => {
        const divName = cat.division_name || 'Lainnya'
        if (!groups[divName]) {
            groups[divName] = {
                name: divName,
                distance: getDivisionDistance(divName),
                categories: []
            }
        }
        groups[divName].categories.push(cat)
    })
    return Object.values(groups)
})

onMounted(async () => {
    // Fetch disciplines for location_type dropdown
    try {
        const discRes = await get('/disciplines')
        if (discRes?.disciplines) {
            disciplines.value = discRes.disciplines
        }
    } catch (err) {
        console.error('Failed to fetch disciplines:', err)
    }
    fetchEventData()
})

useSeoMeta({
    title: 'Halaman Event - Dashboard'
})
</script>
