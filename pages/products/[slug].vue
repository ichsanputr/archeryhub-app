<template>
    <div class="min-h-screen bg-[#f7f8f5] pt-16 pb-20">
        <section class="sticky top-16 z-30 border-b border-black/5 bg-white/95 backdrop-blur">
            <div class="container mx-auto max-w-7xl px-4 py-3">
                <Breadcrumbs :items="[
                    { label: 'Produk', path: '/products' },
                    { label: breadcrumbCategory }
                ]" :current="product?.name || 'Detail Produk'" />
            </div>
        </section>

        <Transition name="fade" mode="out-in">
            <ProductPageSkeleton v-if="isLoading" key="skeleton"
                class="container mx-auto max-w-7xl px-4 pt-8" />

            <div v-else-if="!product" key="not-found" class="container mx-auto max-w-7xl px-4 pt-8">
                <section class="rounded-3xl border border-black/5 bg-white p-10 text-center shadow-sm">
                    <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                        <Icon icon="ph:package-bold" class="text-2xl" />
                    </div>
                    <h2 class="text-2xl font-black text-navy">Produk tidak ditemukan</h2>
                    <p class="mt-2 text-sm text-gray-500">
                        {{ fetchError?.data?.error || 'Produk yang Anda cari tidak tersedia atau sudah dihapus.' }}
                    </p>
                    <NuxtLink href="/products"
                        class="mt-5 inline-flex items-center rounded-xl bg-navy px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-navy/90">
                        Kembali ke Produk
                    </NuxtLink>
                </section>
            </div>

            <div v-else key="content" class="container mx-auto max-w-7xl px-4 pt-8">
                <section
                    class="rounded-3xl border border-black/5 bg-gradient-to-br from-[#fffaf1] via-white to-[#f1f5ff] p-4 shadow-sm md:p-8">
                    <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_430px]">
                        <div class="space-y-4">
                            <div
                                class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-sm">
                                <img :src="selectedImage" :alt="product.name"
                                    class="h-full w-full object-cover transition duration-500 hover:scale-[1.03]" />

                                <div class="absolute left-4 top-4 flex items-center gap-2">
                                    <span
                                        class="inline-flex items-center gap-1 rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                                        {{ productCategoryLabel }}
                                    </span>
                                    <span v-if="product.sale_price"
                                        class="inline-flex rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                                        -{{ discountPercent }}%
                                    </span>
                                </div>

                                <button @click="isZoomOpen = true"
                                    class="absolute bottom-4 right-4 rounded-xl bg-white/90 p-2.5 text-navy shadow-sm hover:bg-white">
                                    <Icon icon="ph:magnifying-glass-plus-bold" class="text-lg" />
                                </button>
                            </div>

                            <div class="grid grid-cols-4 gap-2 sm:grid-cols-6">
                                <button v-for="(img, idx) in galleryImages" :key="idx" @click="selectedImage = img"
                                    :class="[
                                        'aspect-square overflow-hidden rounded-2xl border-2 bg-white transition',
                                        selectedImage === img ? 'border-primary shadow-sm' : 'border-transparent hover:border-black/10'
                                    ]">
                                    <img :src="img" :alt="`${product.name} ${idx + 1}`" class="h-full w-full object-cover" />
                                </button>
                            </div>
                        </div>

                        <aside class="space-y-5 lg:sticky lg:top-28 lg:h-fit">
                            <div class="rounded-[2rem] border border-black/5 bg-white p-5 sm:p-6 shadow-sm">
                                <div class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Pilihan Terbaik</div>
                                <h1 class="mt-2 text-xl sm:text-2xl lg:text-3xl font-black leading-tight text-navy">{{ product.name }}</h1>

                                <div class="mt-3 flex flex-wrap items-center gap-2 text-sm">
                                    <span
                                        class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                                        <span class="h-1.5 w-1.5 rounded-full" :class="product.stock > 0 ? 'bg-emerald-600' : 'bg-red-500'" />
                                        {{ product.stock > 0 ? `Stok ${product.stock}` : 'Stok Habis' }}
                                    </span>
                                    <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                        <Icon icon="ph:star-fill" /> 4.9
                                    </span>
                                </div>

                                <div class="mt-4 rounded-2xl bg-[#0f172a] p-4 sm:p-5 text-white">
                                    <div class="text-[10px] uppercase tracking-[0.18em] text-white/70">Harga Spesial</div>
                                    <div class="mt-1 flex items-end gap-2.5">
                                        <div class="text-2xl sm:text-3xl font-black">Rp {{ formatPrice(finalPrice) }}</div>
                                        <div v-if="product.sale_price" class="pb-1 text-xs text-white/60 line-through">Rp {{ formatPrice(product.price) }}</div>
                                    </div>
                                </div>

                                <div v-if="product.colors?.length" class="mt-5">
                                    <div class="mb-2 text-[10px] font-black uppercase tracking-wider text-gray-400">Pilihan Warna</div>
                                    <div class="flex flex-wrap gap-2">
                                        <button v-for="color in product.colors" :key="color" @click="selectedColor = color"
                                            :class="[
                                                'rounded-xl border px-3 py-2 text-[11px] font-bold transition',
                                                selectedColor === color ? 'border-navy bg-navy text-white' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                                            ]">
                                            {{ color }}
                                        </button>
                                    </div>
                                </div>

                                <div class="mt-5 flex items-center justify-between rounded-xl border border-black/5 bg-[#fafafa] p-3">
                                    <div class="text-[11px] font-black text-navy uppercase tracking-widest">Jumlah</div>
                                    <div class="flex items-center rounded-lg border border-black/10 bg-white overflow-hidden">
                                        <button @click="quantity = Math.max(1, quantity - 1)" class="px-2.5 py-1.5 text-navy hover:bg-gray-50">
                                            <Icon icon="ph:minus-bold" class="text-xs" />
                                        </button>
                                        <input v-model.number="quantity" type="number" min="1" :max="maxQty"
                                            class="w-10 text-center text-[11px] font-black text-navy outline-none" />
                                        <button @click="quantity = Math.min(maxQty, quantity + 1)" class="px-2.5 py-1.5 text-navy hover:bg-gray-50">
                                            <Icon icon="ph:plus-bold" class="text-xs" />
                                        </button>
                                    </div>
                                </div>

                                <div class="mt-5 grid grid-cols-2 gap-3">
                                    <button type="button" @click="handleAddToCart" :disabled="maxQty < 1 || isAddingToCart"
                                        class="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-[11px] font-black text-navy shadow-xl shadow-primary/20 transition hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                                        <Icon v-if="isAddingToCart" icon="ph:spinner" class="animate-spin text-lg shrink-0" />
                                        <Icon v-else icon="ph:shopping-cart-simple-bold" class="text-lg shrink-0" />
                                        <span class="uppercase tracking-wide">Keranjang</span>
                                    </button>
                                    <button type="button" @click="openChatDialog" :disabled="isChatStarting"
                                        class="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-navy py-3.5 text-[11px] font-black text-navy transition hover:bg-navy hover:text-white active:scale-95 disabled:opacity-60">
                                        <Icon v-if="isChatStarting" icon="ph:spinner" class="animate-spin text-lg shrink-0" />
                                        <Icon v-else icon="ph:chat-circle-dots-bold" class="text-lg shrink-0" />
                                        <span class="uppercase tracking-wide">Chat</span>
                                    </button>
                                </div>

                                <div class="mt-4 flex items-center justify-between rounded-xl border border-black/5 bg-white p-3">
                                    <div class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Bagikan</div>
                                    <div class="flex items-center gap-2">
                                        <button @click="share('facebook')" class="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition"><Icon icon="ph:facebook-logo-bold" /></button>
                                        <button @click="share('twitter')" class="rounded-lg bg-sky-50 p-2 text-sky-600 hover:bg-sky-100 transition"><Icon icon="ph:twitter-logo-bold" /></button>
                                        <button @click="share('whatsapp')" class="rounded-lg bg-green-50 p-2 text-green-600 hover:bg-green-100 transition"><Icon icon="ph:whatsapp-logo-bold" /></button>
                                        <button @click="copyLink" class="rounded-lg bg-gray-50 p-2 text-gray-500 hover:bg-gray-100 transition"><Icon icon="ph:copy-bold" /></button>
                                    </div>
                                </div>
                            </div>

                            <div class="rounded-[2rem] border border-black/5 bg-white p-5 sm:p-6 shadow-sm">
                                <div class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Informasi Penjual</div>
                                <template v-if="product.seller">
                                    <div class="mt-3 flex items-center gap-3">
                                        <template v-if="product.seller.avatar_url">
                                            <img :src="product.seller.avatar_url" :alt="product.seller.store_name" class="h-12 w-12 rounded-full object-cover border-2 border-gray-100 shrink-0" />
                                        </template>
                                        <div v-else class="h-12 w-12 rounded-full border-2 border-gray-100 bg-gray-100 flex items-center justify-center shrink-0">
                                            <Icon icon="ph:storefront-bold" class="text-gray-400 text-xl" />
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div v-if="product.seller.store_name" class="font-black text-navy text-sm truncate">{{ product.seller.store_name }}</div>
                                            <div v-if="sellerSubtitle" class="text-[10px] text-gray-400 font-bold mt-0.5">{{ sellerSubtitle }}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div v-if="product.seller.chat_response_rate || product.seller.chat_response_time"
                                        class="mt-3 flex items-center gap-4 text-[10px] font-bold text-gray-500">
                                        <div v-if="product.seller.chat_response_rate" class="flex items-center gap-1">
                                            <Icon icon="ph:check-circle-bold" class="text-emerald-500 text-sm" />
                                            {{ product.seller.chat_response_rate }} respon
                                        </div>
                                        <div v-if="product.seller.chat_response_time && product.seller.chat_response_time.toLowerCase() !== 'hitungan jam'" class="flex items-center gap-1">
                                            <Icon icon="ph:clock-bold" class="text-amber-500 text-sm" />
                                            {{ product.seller.chat_response_time }}
                                        </div>
                                    </div>
                                    <div v-if="product.seller.rating != null && product.seller.rating > 0" class="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-amber-600">
                                        <Icon icon="ph:star-fill" class="text-amber-500 text-sm" />
                                        {{ Number(product.seller.rating).toFixed(1) }} rating
                                    </div>
                                    </div>
                                </template>
                                <div v-else class="mt-3 flex items-center gap-3">
                                    <div class="h-12 w-12 rounded-full border-2 border-gray-100 bg-gray-100 flex items-center justify-center shrink-0">
                                        <Icon icon="ph:storefront-bold" class="text-gray-400 text-xl" />
                                    </div>
                                    <div class="text-[11px] text-gray-500 font-medium">Data penjual tidak tersedia</div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <section class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <div class="rounded-[2.5rem] border border-black/5 bg-white p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                            <Icon icon="ph:quotes-bold" class="text-8xl text-navy" />
                        </div>
                        <h2 class="text-lg font-black text-navy tracking-tight flex items-center gap-2">
                             <div class="w-1.5 h-6 bg-primary rounded-full"></div>
                             Deskripsi Produk
                        </h2>
                        <div class="mt-6 whitespace-pre-line leading-relaxed text-gray-600 text-sm sm:text-base">
                            {{ product.description || 'Belum ada deskripsi detail untuk produk ini.' }}
                        </div>

                        <div v-if="Object.keys(product.specifications || {}).length" class="mt-8">
                            <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Spesifikasi Detail</h3>
                            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div v-for="(value, key) in product.specifications" :key="key"
                                    class="rounded-2xl border border-gray-50 bg-[#fafafa] p-4 flex flex-col gap-1">
                                    <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400">{{ key }}</div>
                                    <div class="font-black text-navy text-sm">{{ value }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Trust Badges Relocated to Bottom -->
                        <div class="mt-12 pt-8 border-t border-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div class="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm hover:shadow-md transition duration-300">
                                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-600">
                                    <Icon icon="ph:seal-check-bold" class="text-2xl" />
                                </div>
                                <div>
                                    <div class="font-black text-navy text-sm leading-tight">100% Ori</div>
                                    <div class="text-[10px] text-gray-400 font-bold leading-tight mt-0.5">Sudah Dicek</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm hover:shadow-md transition duration-300">
                                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-amber-50 text-amber-500">
                                    <Icon icon="ph:shield-check-bold" class="text-2xl" />
                                </div>
                                <div>
                                    <div class="font-black text-navy text-sm leading-tight">Garansi 7 Hari</div>
                                    <div class="text-[10px] text-gray-400 font-bold leading-tight mt-0.5">Tukar Produk</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-sm hover:shadow-md transition duration-300">
                                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-blue-50 text-blue-500">
                                    <Icon icon="ph:rocket-launch-bold" class="text-2xl" />
                                </div>
                                <div>
                                    <div class="font-black text-navy text-sm leading-tight">Pengiriman Cepat</div>
                                    <div class="text-[10px] text-gray-400 font-bold leading-tight mt-0.5">Estimasi 1-3 Hari</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-[2rem] border border-black/5 bg-white shadow-sm overflow-hidden h-fit">
                        <div class="bg-navy px-6 py-5 flex items-center gap-3">
                            <Icon icon="ph:clipboard-text-bold" class="text-primary text-xl" />
                            <h3 class="text-xs font-black text-white tracking-[0.15em] uppercase">Ringkasan</h3>
                        </div>
                        <ul class="divide-y divide-gray-50">
                            <li class="flex items-center justify-between px-5 py-3.5">
                                <span class="flex items-center gap-2 text-xs text-gray-400">
                                    <Icon icon="ph:barcode-bold" class="text-sm" /> SKU
                                </span>
                                <span class="font-bold text-navy text-xs bg-gray-50 px-2 py-0.5 rounded-lg">{{ (product.slug || '-').toUpperCase() }}</span>
                            </li>
                            <li class="flex items-center justify-between px-5 py-3.5">
                                <span class="flex items-center gap-2 text-xs text-gray-400">
                                    <Icon icon="ph:tag-bold" class="text-sm" /> Kategori
                                </span>
                                <span class="font-bold text-navy text-xs">{{ breadcrumbCategory }}</span>
                            </li>
                            <li class="flex items-center justify-between px-5 py-3.5">
                                <span class="flex items-center gap-2 text-xs text-gray-400">
                                    <Icon icon="ph:currency-circle-dollar-bold" class="text-sm" /> Harga Jual
                                </span>
                                <span class="font-black text-navy text-sm">Rp {{ formatPrice(finalPrice) }}</span>
                            </li>
                            <li class="flex items-center justify-between px-5 py-3.5">
                                <span class="flex items-center gap-2 text-xs text-gray-400">
                                    <Icon icon="ph:sparkle-bold" class="text-sm" /> Kondisi
                                </span>
                                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Baru
                                </span>
                            </li>
                        </ul>
                    </div>
                </section>
            </div>
        </Transition>

        <div v-if="isZoomOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
            <button @click="isZoomOpen = false" class="absolute right-5 top-5 text-white">
                <Icon icon="ph:x-bold" class="text-3xl" />
            </button>
            <img :src="selectedImage" :alt="product?.name" class="max-h-[90vh] max-w-[92vw] rounded-2xl object-contain" />
        </div>

        <!-- ── Chat Dialog (floating bottom-right) ─────────────────────────── -->
        <Transition name="chat-slide">
            <div v-if="isChatOpen"
                class="fixed bottom-6 right-6 z-[200] flex flex-col w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
                style="background: #fff">

                <!-- Header -->
                <div class="flex items-center gap-3 px-4 py-3 bg-navy text-white shrink-0">
                    <div class="size-9 rounded-xl overflow-hidden bg-white/10 border border-white/20 shrink-0">
                        <img v-if="chatConv?.seller_avatar" :src="chatConv.seller_avatar" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <Icon icon="ph:storefront-bold" class="text-white/70" />
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-black leading-none truncate">{{ chatConv?.seller_name || product?.seller?.store_name || 'Penjual' }}</p>
                        <div v-if="chatConv?.product_name" class="flex items-center gap-1 mt-0.5">
                            <Icon icon="ph:package-bold" class="text-[9px] text-white/60" />
                            <span class="text-[10px] text-white/60 font-semibold truncate">{{ chatConv.product_name }}</span>
                        </div>
                    </div>
                    <button @click="closeChatDialog"
                        class="size-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition shrink-0">
                        <Icon icon="ph:x-bold" class="text-sm text-white" />
                    </button>
                </div>

                <!-- Product context bar -->
                <div v-if="chatConv?.product_name"
                    class="flex items-center gap-2.5 px-4 py-2 bg-primary/5 border-b border-primary/15 shrink-0">
                    <div class="size-7 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                        <img v-if="chatConv.product_image" :src="chatConv.product_image" class="w-full h-full object-cover" />
                        <Icon v-else icon="ph:package-bold" class="text-gray-400 text-xs m-auto mt-1" />
                    </div>
                    <p class="text-[10px] font-black text-navy truncate flex-1">{{ chatConv.product_name }}</p>
                </div>

                <!-- Messages -->
                <div ref="chatContainer"
                    class="flex-grow overflow-y-auto px-4 py-4 space-y-2.5 no-scrollbar"
                    style="background: linear-gradient(180deg,#f4f6fb 0%,#eef1f8 100%)">

                    <!-- Loading skeleton -->
                    <div v-if="chatLoadingMsg" class="space-y-3 animate-pulse">
                        <div v-for="i in 3" :key="i" class="flex" :class="i % 2 === 0 ? 'justify-end' : 'justify-start'">
                            <div class="h-9 rounded-2xl bg-white border border-gray-200"
                                :class="i % 2 === 0 ? 'w-3/4' : 'w-1/2'"></div>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="chatMessages.length === 0"
                        class="flex flex-col items-center justify-center h-full text-center py-6">
                        <Icon icon="ph:chat-circle-bold" class="text-4xl text-gray-200 mb-2" />
                        <p class="text-xs font-bold text-gray-400">Mulai percakapan</p>
                        <p class="text-[10px] text-gray-300 mt-0.5">Tanyakan tentang produk ini</p>
                    </div>

                    <!-- Messages -->
                    <div v-else v-for="msg in chatMessages" :key="msg.id"
                        class="flex flex-col"
                        :class="msg.sender_type === 'archer' ? 'items-end' : 'items-start'">
                        <div class="max-w-[85%] px-3.5 py-2.5 text-[12px] leading-relaxed font-medium shadow-sm"
                            :class="msg.sender_type === 'archer'
                                ? 'bg-navy text-white rounded-2xl rounded-tr-sm'
                                : 'bg-white text-navy border border-gray-200 rounded-2xl rounded-tl-sm'">
                            {{ msg.message }}
                        </div>
                        <div class="mt-0.5 text-[9px] font-semibold text-gray-400 flex items-center gap-1"
                            :class="msg.sender_type === 'archer' ? 'justify-end' : 'justify-start'">
                            {{ formatChatTime(msg.created_at) }}
                            <Icon v-if="msg.sender_type === 'archer'"
                                :icon="msg.is_read ? 'ph:checks-bold' : 'ph:check-bold'"
                                class="text-[9px]"
                                :class="msg.is_read ? 'text-primary' : 'text-gray-300'" />
                        </div>
                    </div>
                </div>

                <!-- Input -->
                <div class="px-3 py-3 bg-white border-t-2 border-gray-200 shrink-0">
                    <div class="flex items-end gap-2">
                        <div class="flex-grow bg-gray-50 rounded-2xl border-2 border-gray-200 focus-within:border-primary/40 focus-within:bg-white transition-all overflow-hidden">
                            <textarea v-model="chatInput" placeholder="Tulis pesan..." rows="1"
                                @keydown.enter.exact.prevent="sendChatMessage"
                                class="w-full bg-transparent border-none focus:ring-0 text-sm font-medium px-3.5 py-2.5 max-h-20 resize-none no-scrollbar text-navy placeholder:text-gray-300 outline-none" />
                        </div>
                        <button @click="sendChatMessage" :disabled="!chatInput.trim() || chatSending"
                            class="size-10 rounded-2xl bg-navy flex items-center justify-center shrink-0 shadow-md hover:bg-primary hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-40 border-2 border-navy hover:border-primary">
                            <Icon v-if="chatSending" icon="ph:spinner" class="animate-spin text-primary text-sm" />
                            <Icon v-else icon="ph:paper-plane-right-fill" class="text-primary text-sm" />
                        </button>
                    </div>
                    <p class="text-[9px] text-gray-300 font-semibold text-center mt-1.5">
                        Enter kirim · <NuxtLink :to="`/dashboard/archer/chat?conv=${chatConv?.id}`" class="text-primary hover:underline" @click.native="closeChatDialog">Buka di dashboard →</NuxtLink>
                    </p>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref, watchEffect, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'landing',
    headerTransparent: false
})

const route = useRoute()
const toast = useToast()
const { isLoggedIn, user } = useAuth()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const categoryLabels = {
    equipment: 'Peralatan',
    apparel: 'Pakaian',
    accessories: 'Aksesoris',
    training: 'Latihan',
    other: 'Lainnya'
}

useHead(() => ({
    title: product.value?.name
        ? `${product.value.name} | Produk Panahan | ArcheryHub`
        : 'Detail Produk | ArcheryHub',
    meta: [
        {
            name: 'description',
            content: product.value?.description
                ? String(product.value.description).slice(0, 160)
                : 'Lihat detail produk panahan, foto, spesifikasi, dan harga terbaru di ArcheryHub.'
        }
    ]
}))

const quantity = ref(1)
const selectedColor = ref('')
const selectedImage = ref('')
const isZoomOpen = ref(false)
const isAddingToCart = ref(false)
const isChatStarting = ref(false)

// ── Chat dialog ────────────────────────────────────────────────────────────
const isChatOpen = ref(false)
const chatConv = ref(null)
const chatMessages = ref([])
const chatInput = ref('')
const chatSending = ref(false)
const chatLoadingMsg = ref(false)
const chatContainer = ref(null)
let chatPollTimer = null

const allowedProductImages = [
    'https://images.unsplash.com/photo-1503602642458-232111445657',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
    'https://images.unsplash.com/photo-1511556820780-d912e42b4980',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d'
]

const { data: productResponse, pending: isLoading, error: fetchError } = useAsyncData(
    `product-${route.params.slug}`,
    () => $fetch(`${apiBaseUrl}/products/${route.params.slug}`),
    { lazy: true, server: true }
)

const parseJSON = (val, fallback) => {
    if (typeof val === 'string' && val.trim() !== '') {
        try {
            return JSON.parse(val)
        } catch {
            return fallback
        }
    }
    return val || fallback
}

const product = computed(() => {
    const data = productResponse.value?.data || productResponse.value
    if (!data) return null

    const p = { ...data }
    p.price = Number(p.price || 0)
    p.sale_price = p.sale_price !== null && p.sale_price !== undefined ? Number(p.sale_price) : null
    p.stock = Number(p.stock || 0)
    p.images = parseJSON(p.images, [])
    p.colors = parseJSON(p.colors, [])
    p.specifications = parseJSON(p.specifications, {})
    return p
})

const galleryImages = computed(() => {
    const imgs = []
    if (product.value?.image_url) imgs.push(product.value.image_url)
    if (Array.isArray(product.value?.images)) imgs.push(...product.value.images)

    const unique = [...new Set(imgs.filter((img) => typeof img === 'string' && img.trim() !== ''))]
    if (unique.length > 0) return unique

    return [allowedProductImages[0]]
})

const sellerAvatar = computed(() => {
    const avatar = product.value?.seller?.avatar_url
    return (typeof avatar === 'string' && avatar.trim() !== '') ? avatar : ''
})

const sellerSubtitle = computed(() => {
    const s = product.value?.seller
    if (!s) return ''
    const parts = []
    if (s.is_verified) parts.push('Terverifikasi')
    if (s.city) parts.push(s.city)
    return parts.join(' • ') || ''
})

watchEffect(() => {
    if (!selectedImage.value && galleryImages.value.length) {
        selectedImage.value = galleryImages.value[0]
    }

    if (product.value?.colors?.length && !selectedColor.value) {
        selectedColor.value = product.value.colors[0]
    }

    const safeMax = Math.max(1, Number(product.value?.stock || 1))
    if (quantity.value > safeMax) quantity.value = safeMax
})

const breadcrumbCategory = computed(() => {
    const cat = product.value?.category || ''
    return categoryLabels[cat] || 'Produk'
})

const productCategoryLabel = computed(() => categoryLabels[product.value?.category] || 'Produk')

const finalPrice = computed(() => product.value?.sale_price || product.value?.price || 0)
const maxQty = computed(() => Math.max(0, Number(product.value?.stock || 0)))

const discountPercent = computed(() => {
    if (!product.value?.sale_price || !product.value?.price) return 0
    return Math.round((1 - product.value.sale_price / product.value.price) * 100)
})

const share = (platform) => {
    const url = window.location.href
    const text = `Cek ${product.value.name} di ArcheryHub! Rp ${formatPrice(finalPrice.value)}`

    const links = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`
    }

    if (links[platform]) window.open(links[platform], '_blank')
}

const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link produk berhasil disalin')
}

const handleAddToCart = async () => {
    if (!isLoggedIn.value) {
        toast.error('Silahkan login sebagai Pemanah untuk menambah ke keranjang')
        return
    }

    if (user.value?.type !== 'archer' && user.value?.role !== 'archer') {
        toast.error('Hanya akun Pemanah yang dapat berbelanja')
        return
    }

    if (!product.value || maxQty.value < 1) {
        toast.error('Stok produk sedang tidak tersedia')
        return
    }

    isAddingToCart.value = true
    try {
        const api = useApi()
        await api.post('/cart', {
            product_id: product.value.id || product.value.uuid,
            quantity: quantity.value,
            color: selectedColor.value
        })
        toast.success('Berhasil ditambah ke keranjang')
    } catch (error) {
        if (error.response?.data?.code === 'invalid_token') {
            toast.error('Sesi anda telah berakhir, silahkan login kembali')
        } else {
            toast.error(error.response?.data?.error || 'Gagal menambah ke keranjang')
        }
    } finally {
        isAddingToCart.value = false
    }
}

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(Number(price || 0))

const openChatDialog = async () => {
    if (!isLoggedIn.value) {
        toast.error('Silahkan login sebagai Pemanah untuk memulai chat')
        navigateTo('/auth/login')
        return
    }
    const role = user.value?.role || user.value?.type || user.value?.user_type
    if (role !== 'archer') {
        toast.error('Hanya akun Pemanah yang dapat menghubungi penjual via chat')
        return
    }
    const sellerID = product.value?.seller?.uuid || product.value?.seller_id
    if (!sellerID) {
        toast.error('Informasi penjual tidak tersedia')
        return
    }

    isChatStarting.value = true
    try {
        const api = useApi()
        const conv = await api.post('/chat/conversations', {
            seller_id: sellerID,
            product_id: product.value?.slug || product.value?.uuid || product.value?.id || null,
            product_name: product.value?.name || null,
            product_image: product.value?.image_url || null,
        })
        chatConv.value = conv
        isChatOpen.value = true
        await fetchChatMessages()
        startChatPoll()
    } catch (error) {
        toast.error(error?.data?.error || 'Gagal memulai percakapan')
    } finally {
        isChatStarting.value = false
    }
}

const fetchChatMessages = async () => {
    if (!chatConv.value) return
    chatLoadingMsg.value = chatMessages.value.length === 0
    try {
        const api = useApi()
        const res = await api.get(`/chat/conversations/${chatConv.value.id}/messages`)
        chatMessages.value = res.messages || []
        scrollChatToBottom()
    } catch { /* silent */ } finally {
        chatLoadingMsg.value = false
    }
}

const sendChatMessage = async () => {
    const text = chatInput.value.trim()
    if (!text || chatSending.value || !chatConv.value) return
    chatSending.value = true
    const tmp = { id: 'tmp-' + Date.now(), sender_type: 'archer', message: text, created_at: new Date().toISOString(), is_read: false }
    chatMessages.value.push(tmp)
    chatInput.value = ''
    scrollChatToBottom()
    try {
        const api = useApi()
        const sent = await api.post(`/chat/conversations/${chatConv.value.id}/messages`, { message: text })
        const idx = chatMessages.value.findIndex(m => m.id === tmp.id)
        if (idx >= 0) chatMessages.value[idx] = sent
    } catch { toast.error('Gagal mengirim pesan') ; chatMessages.value = chatMessages.value.filter(m => m.id !== tmp.id) }
    finally { chatSending.value = false }
}

const scrollChatToBottom = () => {
    nextTick(() => { if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight })
}

const startChatPoll = () => {
    clearInterval(chatPollTimer)
    chatPollTimer = setInterval(async () => {
        if (!isChatOpen.value || !chatConv.value) return
        const api = useApi()
        try {
            const res = await api.get(`/chat/conversations/${chatConv.value.id}/messages`)
            const msgs = res.messages || []
            if (msgs.length !== chatMessages.value.length) { chatMessages.value = msgs; scrollChatToBottom() }
        } catch { /* silent */ }
    }, 5000)
}

const closeChatDialog = () => {
    isChatOpen.value = false
    clearInterval(chatPollTimer)
}

onUnmounted(() => clearInterval(chatPollTimer))

const formatChatTime = (dt) => {
    if (!dt) return ''
    return new Date(dt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.chat-slide-enter-active,
.chat-slide-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}
.chat-slide-enter-from,
.chat-slide-leave-to {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
}

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
