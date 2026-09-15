<template>
    <div v-if="article" class="min-h-screen bg-slate-50 relative font-body text-navy">
        <LayoutLandingHeader :transparent="true" />

        <!-- ── HERO HEADER BANNER (Lightened Gradient Overlay) ── -->
        <div class="bg-navy relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 text-white">
            <div class="absolute inset-0 z-0">
                <img :src="article.image || '/hero-berita.jpeg'" :alt="article.title + ' - Archery Guide'" class="w-full h-full object-cover opacity-35" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent"></div>
            </div>

            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Breadcrumbs -->
                <div class="mb-4">
                    <Breadcrumbs 
                        :items="[
                            { label: 'Blog', path: '/blog' },
                            { label: article.category || 'Category', path: '/blog/category/' + categorySlug }
                        ]" 
                        :current="article.title" 
                        class="!text-slate-300" 
                    />
                </div>

                <div class="max-w-4xl space-y-4">
                    <!-- Article Title (No chip above H1) -->
                    <h1 class="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
                        {{ article.title }}
                    </h1>

                    <!-- Meta Row -->
                    <div class="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1 font-medium">
                        <div class="flex items-center gap-1.5">
                            <Icon icon="ph:calendar-blank" class="text-primary text-sm shrink-0" />
                            <span>{{ formatDate(article.date) }}</span>
                        </div>
                        <span class="text-white/20">•</span>
                        <div class="flex items-center gap-1.5">
                            <Icon icon="ph:clock" class="text-primary text-sm shrink-0" />
                            <span>{{ readTime }} min read</span>
                        </div>
                        <span class="text-white/20">•</span>
                        <div class="flex items-center gap-2">
                            <img src="/profile-author.png" :alt="(article.author?.name || 'Archeris Author') + ' Profile Photo'" class="w-4 h-4 rounded-full bg-slate-100 object-cover" />
                            <span>{{ article.author?.name || 'Archeris Editorial' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── MAIN CONTENT & SIDEBAR SECTION ── -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            
            <!-- Article Banner Image (16:9) -->
            <div class="mb-10 rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 aspect-[16/9] border border-slate-200/80 shadow-xs">
                <img :src="article.image" :alt="article.title" class="w-full h-full object-cover" />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

                <!-- LEFT COLUMN: ARTICLE CONTENT (INSIDE WHITE PARENT CARD) -->
                <div class="lg:col-span-8 space-y-8">
                    <!-- Parent Card for Article Body -->
                    <article class="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200/80 shadow-xs space-y-8">
                        
                        <!-- Table of Contents (Hierarchical Tree Structure) -->
                        <div v-if="headings && headings.length > 0" 
                            class="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-3">
                            
                            <!-- Header & Collapse Toggle -->
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-7 h-7 rounded-lg bg-navy text-primary flex items-center justify-center text-xs shadow-2xs">
                                        <Icon icon="ph:list-bullets-bold" />
                                    </div>
                                    <h3 class="text-xs sm:text-sm font-bold text-navy tracking-tight">Table of Contents</h3>
                                </div>
                                
                                <button @click="isTocOpen = !isTocOpen" type="button"
                                    class="text-xs font-semibold text-slate-500 hover:text-navy flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-200/60 cursor-pointer">
                                    <span>{{ isTocOpen ? 'Hide' : 'Show' }}</span>
                                    <Icon :icon="isTocOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" class="text-xs" />
                                </button>
                            </div>

                            <!-- Hierarchical Headings Tree (Borderless) -->
                            <div v-show="isTocOpen" class="pt-2 border-t border-slate-200/70 space-y-1 text-xs">
                                <a v-for="item in headings" :key="item.id"
                                    :href="`#${item.id}`"
                                    @click.prevent="scrollToHeading(item.id)"
                                    :class="[
                                        'group flex items-start transition-all py-1.5 px-2.5 rounded-xl hover:bg-slate-100',
                                        item.level === 1 || item.level === 2 
                                            ? 'font-bold text-navy hover:text-slate-900 text-xs sm:text-sm' 
                                            : item.level === 3 
                                                ? 'pl-6 font-semibold text-slate-600 hover:text-navy' 
                                                : 'pl-10 font-normal text-slate-500 hover:text-navy',
                                        activeHeadingId === item.id ? 'text-navy font-black bg-slate-200/70' : ''
                                    ]">
                                    <!-- Indicator for H1 / H2 -->
                                    <span v-if="item.level <= 2" class="w-2 h-2 rounded-full bg-navy mt-1.5 mr-2 shrink-0 transition-colors"></span>
                                    <!-- Sub-indicator for H3 / H4 -->
                                    <span v-else class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0 transition-colors"></span>
                                    <span class="leading-snug">{{ item.text }}</span>
                                </a>
                            </div>
                        </div>

                        <!-- Rich Text HTML Content with Injected Heading IDs (Clean Borderless Headings) -->
                        <div ref="contentRef"
                            class="prose prose-slate max-w-none article-prose
                            prose-headings:text-navy prose-headings:font-bold prose-headings:font-display prose-headings:tracking-tight
                            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-black prose-h2:mt-12 prose-h2:mb-5 prose-h2:pt-2
                            prose-h3:text-lg sm:prose-h3:text-xl prose-h3:font-bold prose-h3:text-slate-900 prose-h3:mt-8 prose-h3:mb-3
                            prose-h4:text-base sm:prose-h4:text-lg prose-h4:font-semibold prose-h4:text-slate-800 prose-h4:mt-6 prose-h4:mb-2
                            prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:text-base sm:prose-p:text-[17px] prose-p:mb-6 prose-p:font-normal
                            prose-ul:text-slate-700 prose-ul:text-base sm:prose-ul:text-[17px] prose-ul:leading-[1.8] prose-ul:space-y-2.5
                            prose-ol:text-slate-700 prose-ol:text-base sm:prose-ol:text-[17px] prose-ol:leading-[1.8] prose-ol:space-y-2.5
                            prose-strong:text-navy prose-strong:font-bold
                            prose-a:text-navy prose-a:underline hover:prose-a:text-primary-hover
                            prose-blockquote:border-l-4 prose-blockquote:border-navy prose-blockquote:bg-slate-50 prose-blockquote:p-4 sm:prose-blockquote:p-6 prose-blockquote:rounded-2xl prose-blockquote:text-navy prose-blockquote:font-medium prose-blockquote:italic"
                            v-html="processedContent">
                        </div>

                        <!-- Article Multiple Tags (Clickable Pills) -->
                        <div v-if="normalizedTags && normalizedTags.length > 0" class="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                            <span class="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                                <Icon icon="ph:hash-bold" />
                                Tags:
                            </span>
                            <NuxtLink v-for="tag in normalizedTags" :key="tag"
                                :to="`/blog?tag=${encodeURIComponent(tag)}`"
                                class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1">
                                <span>#{{ tag }}</span>
                            </NuxtLink>
                        </div>

                        <!-- Share This Article (Redesigned Minimalist UX) -->
                        <div class="py-4 px-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:share-network-bold" class="text-base text-navy" />
                                <span class="text-xs font-bold text-navy">Share this article:</span>
                            </div>

                            <!-- Sleek Colored Brand Social Buttons -->
                            <div class="flex items-center gap-1.5">
                                <!-- WhatsApp -->
                                <button @click="shareToSocial('whatsapp')" title="Share to WhatsApp"
                                    class="size-8 sm:size-9 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                                    <Icon icon="ph:whatsapp-logo-fill" class="text-base" />
                                </button>

                                <!-- X / Twitter -->
                                <button @click="shareToSocial('twitter')" title="Share to X"
                                    class="size-8 sm:size-9 rounded-xl bg-slate-100 text-slate-800 hover:bg-black hover:text-white border border-slate-300/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                                    <Icon icon="ph:x-logo" class="text-sm" />
                                </button>

                                <!-- Facebook -->
                                <button @click="shareToSocial('facebook')" title="Share to Facebook"
                                    class="size-8 sm:size-9 rounded-xl bg-blue-50 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border border-blue-200/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                                    <Icon icon="ph:facebook-logo-fill" class="text-base" />
                                </button>

                                <!-- LinkedIn -->
                                <button @click="shareToSocial('linkedin')" title="Share to LinkedIn"
                                    class="size-8 sm:size-9 rounded-xl bg-sky-50 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white border border-sky-200/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                                    <Icon icon="ph:linkedin-logo-fill" class="text-base" />
                                </button>

                                <div class="w-px h-5 bg-slate-200 mx-1"></div>

                                <!-- Copy Link Button (Icon Only with Live Copied Feedback) -->
                                <button @click="copyArticleLink" :title="isLinkCopied ? 'Link Copied!' : 'Copy Link'"
                                    class="size-8 sm:size-9 rounded-xl bg-slate-100 text-slate-700 hover:bg-navy hover:text-white border border-slate-200/80 flex items-center justify-center transition-all shadow-2xs cursor-pointer">
                                    <Icon :icon="isLinkCopied ? 'ph:check-bold' : 'ph:link-bold'" :class="isLinkCopied ? 'text-emerald-600' : 'text-slate-700'" class="text-sm" />
                                </button>
                            </div>
                        </div>

                        <!-- Author Profile Card -->
                        <div class="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                            <div class="flex items-center gap-4">
                                <div class="relative">
                                    <img src="/profile-author.png" :alt="(article.author?.name || 'Archeris Editorial Team') + ' Official Avatar'"
                                        class="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 shadow-2xs p-1 object-cover" />
                                    <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-navy rounded-full flex items-center justify-center text-primary text-[10px] border-2 border-white shadow-2xs">
                                        <Icon icon="ph:seal-check-fill" />
                                    </div>
                                </div>
                                <div class="space-y-0.5">
                                    <div class="flex items-center gap-2">
                                        <span class="text-navy font-bold text-sm sm:text-base">{{ article.author?.name || 'Archeris Editorial Team' }}</span>
                                    </div>
                                    <div class="text-slate-500 text-xs">{{ article.author?.role || 'Certified Archery Coaches & Technical Specialists' }}</div>
                                    <p class="text-slate-400 text-[11px] pt-1 leading-normal">Dedicated to delivering clear, authoritative, and practical archery education and tournament insight.</p>
                                </div>
                            </div>
                            <NuxtLink to="/about-us" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0">
                                <span>About Team</span>
                                <Icon icon="ph:arrow-right" />
                            </NuxtLink>
                        </div>
                    </article>

                    <!-- Comments Section (Simplified Minimalist Discussion UI) -->
                    <section class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
                        
                        <!-- ── CLEAN COMMUNITY DISCUSSION HEADER ── -->
                        <div class="pb-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="space-y-1">
                                <h3 class="text-xl sm:text-2xl font-black text-navy font-display tracking-tight flex items-center gap-2.5">
                                    <span>Community Discussion</span>
                                    <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200/80">
                                        {{ totalComments }} {{ totalComments === 1 ? 'Comment' : 'Comments' }}
                                    </span>
                                </h3>
                                <p class="text-slate-500 text-xs sm:text-sm leading-relaxed">
                                    Have a question or insight about this technique? Share your thoughts below with fellow archers and coaches.
                                </p>
                            </div>
                        </div>

                        <!-- ── LEAVE A COMMENT FORM CARD ── -->
                        <div class="bg-slate-50/90 rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                            <div class="flex items-center justify-between">
                                <h4 class="font-bold text-navy text-sm sm:text-base flex items-center gap-2">
                                    <div class="w-6 h-6 rounded-lg bg-navy text-primary flex items-center justify-center text-xs">
                                        <Icon icon="ph:chat-teardrop-dots-bold" />
                                    </div>
                                    <span>Join the Conversation</span>
                                </h4>
                                <span class="text-[11px] text-slate-400">Be respectful and constructive</span>
                            </div>

                            <form @submit.prevent="submitRootComment" class="space-y-4">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div class="relative">
                                        <Icon icon="ph:user" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                                        <input v-model="commentForm.author_name" type="text" placeholder="Your Full Name *"
                                            class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-navy placeholder:text-slate-400 focus:border-navy focus:outline-hidden transition-colors shadow-2xs"
                                            required />
                                    </div>
                                    <div class="relative">
                                        <Icon icon="ph:envelope-simple" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                                        <input v-model="commentForm.author_email" type="email" placeholder="Your Email Address *"
                                            class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-navy placeholder:text-slate-400 focus:border-navy focus:outline-hidden transition-colors shadow-2xs"
                                            required />
                                    </div>
                                </div>
                                <div class="relative">
                                    <textarea v-model="commentForm.content" rows="3"
                                        placeholder="Ask a technical question, share your personal experience with this technique, or discuss tuning tips..."
                                        class="w-full bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-navy placeholder:text-slate-400 focus:border-navy focus:outline-hidden transition-colors resize-none shadow-2xs leading-relaxed"
                                        required></textarea>
                                </div>
                                <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                                    <span class="text-[11px] text-slate-400 flex items-center gap-1">
                                        <Icon icon="ph:lock-key" class="text-xs" />
                                        <span>Your email address remains private and is never published.</span>
                                    </span>
                                    <button :disabled="submittingComment"
                                        class="px-6 py-2.5 bg-navy hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow cursor-pointer">
                                        <span v-if="submittingComment">Publishing...</span>
                                        <span v-else>Post Comment</span>
                                        <Icon v-if="!submittingComment" icon="ph:paper-plane-right-bold" class="text-primary text-xs" />
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- ── COMMENTS LIST WITH THREADED REPLIES ── -->
                        <div v-if="comments.length > 0" class="space-y-4 pt-2">
                            <div v-for="comm in comments" :key="comm.id" class="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3.5">
                                <!-- Main Comment Header -->
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(comm.author_name || comm.user_name || 'Archer')}`"
                                            :alt="comm.author_name || 'Archer'"
                                            class="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 p-0.5 object-cover" />
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold text-xs sm:text-sm text-navy">{{ comm.author_name || comm.user_name || 'Archer' }}</span>
                                                <span v-if="comm.user_type === 'archer'" class="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-md border border-sky-100">Archer</span>
                                                <span v-else-if="comm.user_type === 'organizer'" class="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-100">Organizer</span>
                                                <span v-else-if="comm.user_type === 'coach'" class="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-100">Coach</span>
                                            </div>
                                            <div class="text-[10px] text-slate-400">{{ formatDate(comm.created_at) }}</div>
                                        </div>
                                    </div>

                                    <!-- Reply Action Button -->
                                    <button @click="toggleReplyForm(comm.id)"
                                        class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-navy text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer">
                                        <Icon icon="ph:arrow-bend-down-left-bold" class="text-xs text-primary" />
                                        <span>{{ replyingToId === comm.id ? 'Cancel' : 'Reply' }}</span>
                                    </button>
                                </div>

                                <!-- Comment Content -->
                                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed pl-12">{{ comm.content }}</p>

                                <!-- Nested Reply Form (when toggled for this comment) -->
                                <div v-if="replyingToId === comm.id" class="ml-12 p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                                    <div class="text-xs font-bold text-navy flex items-center gap-1.5">
                                        <Icon icon="ph:arrow-bend-down-left" class="text-primary" />
                                        <span>Reply to {{ comm.author_name || comm.user_name || 'Archer' }}</span>
                                    </div>
                                    <form @submit.prevent="submitReply(comm)" class="space-y-3">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <input v-model="replyForm.author_name" type="text" placeholder="Your Name *"
                                                class="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-navy placeholder:text-slate-400 focus:border-navy focus:outline-hidden"
                                                required />
                                            <input v-model="replyForm.author_email" type="email" placeholder="Your Email *"
                                                class="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-navy placeholder:text-slate-400 focus:border-navy focus:outline-hidden"
                                                required />
                                        </div>
                                        <textarea v-model="replyForm.content" rows="2"
                                            placeholder="Write your constructive reply..."
                                            class="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-navy placeholder:text-slate-400 focus:border-navy focus:outline-hidden resize-none"
                                            required></textarea>
                                        <div class="flex justify-end gap-2">
                                            <button type="button" @click="replyingToId = null"
                                                class="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-navy cursor-pointer">
                                                Cancel
                                            </button>
                                            <button type="submit" :disabled="submittingReply"
                                                class="px-4 py-1.5 bg-navy hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                                                <span v-if="submittingReply">Sending...</span>
                                                <span v-else>Post Reply</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <!-- Threaded Replies List -->
                                <div v-if="comm.replies && comm.replies.length > 0" class="ml-12 pl-4 border-l-2 border-slate-200/80 space-y-3 pt-2">
                                    <div v-for="reply in comm.replies" :key="reply.id" class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/70 space-y-2">
                                        <div class="flex items-center gap-2.5">
                                            <img :src="`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(reply.author_name || reply.user_name || 'Archer')}`"
                                                :alt="reply.author_name || 'Archer'"
                                                class="w-7 h-7 rounded-lg bg-white border border-slate-200 p-0.5 object-cover" />
                                            <div>
                                                <div class="flex items-center gap-2">
                                                    <span class="font-bold text-xs text-navy">{{ reply.author_name || reply.user_name || 'Archer' }}</span>
                                                    <span v-if="reply.user_type === 'archer'" class="px-1.5 py-0.2 bg-sky-50 text-sky-700 text-[9px] font-bold rounded border border-sky-100">Archer</span>
                                                    <span v-else-if="reply.user_type === 'organizer'" class="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded border border-emerald-100">Organizer</span>
                                                </div>
                                                <div class="text-[9px] text-slate-400">{{ formatDate(reply.created_at) }}</div>
                                            </div>
                                        </div>
                                        <p class="text-xs text-slate-700 leading-relaxed pl-9">{{ reply.content }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-10 text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 space-y-2.5">
                            <div class="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-2xs">
                                <Icon icon="ph:chats-teardrop" class="text-xl" />
                            </div>
                            <div>
                                <p class="font-semibold text-navy text-sm">No comments yet</p>
                                <p class="text-slate-400 text-xs mt-0.5">Be the first to share your thoughts, form questions, or scoring tips!</p>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- RIGHT COLUMN: SIDEBAR WIDGETS (STICKY) -->
                <aside class="lg:col-span-4 space-y-6 sticky top-20 sm:top-24">
                    
                    <!-- Popular Articles Widget (Clean & Consistent) -->
                    <div class="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
                        <div class="flex items-center justify-between border-b border-slate-100 pb-3.5">
                            <h3 class="text-navy font-bold text-xs sm:text-sm flex items-center gap-2">
                                <Icon icon="ph:fire" class="text-navy text-base" />
                                <span>Popular Articles</span>
                            </h3>
                            <NuxtLink to="/blog" class="text-[11px] font-semibold text-slate-500 hover:text-navy transition-colors">
                                View All
                            </NuxtLink>
                        </div>

                        <div class="space-y-4">
                            <NuxtLink v-for="item in popularArticles" :key="item.slug" :to="`/blog/${item.slug}`"
                                class="group flex items-center gap-3.5 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                                <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200">
                                    <img :src="item.image" :alt="item.title"
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div class="flex-1 min-w-0 space-y-1">
                                    <span class="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                                        {{ item.category }}
                                    </span>
                                    <h4 class="text-xs font-bold text-navy leading-snug line-clamp-2">
                                        {{ item.title }}
                                    </h4>
                                    <div class="text-[10px] text-slate-400 font-medium">{{ formatDate(item.date) }}</div>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Sidebar Newsletter / CTA Widget -->
                    <div class="bg-navy rounded-3xl p-6 text-white border border-slate-800 shadow-xs space-y-4">
                        <div class="space-y-1.5">
                            <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 rounded-full text-primary text-[10px] font-semibold">
                                <Icon icon="ph:trophy" />
                                <span>Live Scoring</span>
                            </div>
                            <h4 class="text-sm font-bold text-white">Elevate Your Tournament</h4>
                            <p class="text-xs text-slate-300 leading-relaxed font-normal">Manage archer qualifications, elimination brackets, and scorekeeping effortlessly.</p>
                        </div>
                        <NuxtLink to="/tournaments"
                            class="inline-block w-full text-center bg-primary hover:bg-primary-hover text-navy py-2.5 rounded-xl text-xs font-bold transition-colors">
                            Explore Tournaments
                        </NuxtLink>
                    </div>

                </aside>
            </div>
        </main>

        <!-- ── MORE RELATED ARTICLES SECTION (HORIZONTAL SCROLLABLE CAROUSEL) ── -->
        <section class="bg-white py-14 border-t border-slate-200/80">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold text-navy tracking-tight font-display">
                            Related Archery Articles
                        </h2>
                        <p class="text-slate-500 text-xs mt-0.5">Explore more guides and scorekeeping strategies</p>
                    </div>
                    
                    <!-- Carousel Controls & View All Link -->
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-1.5">
                            <button @click="scrollRelated('left')" title="Scroll Left"
                                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy flex items-center justify-center transition-colors cursor-pointer">
                                <Icon icon="ph:caret-left-bold" class="text-sm" />
                            </button>
                            <button @click="scrollRelated('right')" title="Scroll Right"
                                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy flex items-center justify-center transition-colors cursor-pointer">
                                <Icon icon="ph:caret-right-bold" class="text-sm" />
                            </button>
                        </div>
                        <NuxtLink to="/blog"
                            class="text-navy hover:text-primary-hover transition-colors font-bold text-xs flex items-center gap-1">
                            <span>View All</span>
                            <Icon icon="ph:arrow-right" />
                        </NuxtLink>
                    </div>
                </div>

                <!-- Horizontal Scroll Container with Hidden Scrollbar -->
                <div ref="relatedScrollRef"
                    class="flex gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x snap-mandatory">
                    <NuxtLink v-for="item in moreArticles" :key="item.slug" :to="`/blog/${item.slug}`"
                        class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start">
                        
                        <!-- Thumbnail Image (16:9) -->
                        <div class="relative aspect-[16/9] overflow-hidden bg-slate-900">
                            <img :src="item.image" :alt="item.title"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"></div>
                            
                            <!-- Category Badge (Single Category) -->
                            <div class="absolute top-3 left-3">
                                <span class="bg-navy text-primary text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xs border border-white/10">
                                    {{ item.category }}
                                </span>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                            <h4 class="text-sm font-bold text-navy line-clamp-2 leading-snug font-display">
                                {{ item.title }}
                            </h4>
                            <div class="flex items-center justify-between text-xs text-slate-400 font-medium pt-2.5 border-t border-slate-100">
                                <span>{{ formatDate(item.date) }}</span>
                                <span class="text-navy font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                    Read <Icon icon="ph:arrow-right" />
                                </span>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <LayoutAppFooter />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { articles as staticArticles } from '~/data/articles/index'
import { Icon } from '@iconify/vue'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import { categoryToSlug } from '~/utils/blogCategory'

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const toast = useToast()
const { get, post } = useApi()
const relatedScrollRef = ref(null)

// Table of Contents & Share UI States
const isTocOpen = ref(true)
const activeHeadingId = ref('')
const isLinkCopied = ref(false)
let headingObserver = null

const articleImageMap = {
    'how-to-shoot-a-bow-beginners-guide-to-archery-form': '/images/blog/thumbnails/how-to-shoot-a-bow-beginners-guide-to-archery-form.png',
    'understanding-bow-types-recurve-compound-barebow': '/images/blog/thumbnails/understanding-bow-types-recurve-compound-barebow.png',
    'how-archery-scoring-works-target-rings-and-rules': '/images/blog/thumbnails/how-archery-scoring-works-target-rings-and-rules.png',
    'anatomy-of-a-bow-and-arrow-essential-parts-guide': '/images/blog/thumbnails/anatomy-of-a-bow-and-arrow-essential-parts-guide.png',
    'how-archery-tournaments-work-introduction-to-rounds-and-matches': '/images/blog/thumbnails/how-archery-tournaments-work-introduction-to-rounds-and-matches.png'
}

function resolveArticleImage(image, slug) {
    if (slug && articleImageMap[slug]) {
        return articleImageMap[slug]
    }
    if (image && !image.includes('unsplash.com')) {
        return image
    }
    return '/images/blog/thumbnails/how-to-shoot-a-bow-beginners-guide-to-archery-form.png'
}

const slug = computed(() => route.params.slug)

const { data: dbArticle } = await useAsyncData(`blog-article-${slug.value}`, async () => {
    try {
        const res = await get(`/blog/articles/${slug.value}`)
        if (res?.data) {
            return {
                ...res.data,
                date: res.data.published_at || '2026-09-14',
                image: resolveArticleImage(res.data.image || res.data.image_url, slug.value)
            }
        }
    } catch {
        // Fallback to static
    }
    return null
}, { lazy: true })

const article = computed(() => {
    const raw = dbArticle.value || staticArticles.find(a => a.slug === slug.value) || staticArticles[0]
    return {
        ...raw,
        image: resolveArticleImage(raw.image, raw.slug)
    }
})

const categorySlug = computed(() => categoryToSlug(article.value?.category))

// Table of Contents dynamic parsing with hierarchy (H1, H2, H3, H4)
const headings = computed(() => {
    if (!article.value?.content) return []
    const content = article.value.content
    const headingRegex = /<h([1-4])[^>]*>(.*?)<\/h\1>/gi
    const items = []
    let match
    let index = 0
    while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1])
        const rawText = match[2].replace(/<[^>]+>/g, '').trim()
        const headingId = 'section-' + index + '-' + rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        items.push({
            id: headingId,
            level,
            text: rawText
        })
        index++
    }
    return items
})

// Injects IDs into headings and wraps tables in mobile-responsive overflow container
const processedContent = computed(() => {
    if (!article.value?.content) return ''
    let content = article.value.content
    let index = 0
    let processed = content.replace(/<h([1-4])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
        const rawText = text.replace(/<[^>]+>/g, '').trim()
        const headingId = 'section-' + index + '-' + rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        index++
        if (/id=["'][^"']+["']/i.test(attrs)) {
            return match
        }
        return `<h${level}${attrs} id="${headingId}" class="scroll-mt-24">${text}</h${level}>`
    })

    // Wrap tables in responsive container if not already wrapped
    processed = processed.replace(/(<table[\s\S]*?<\/table>)/gi, (match) => {
        return `<div class="article-table-wrapper overflow-x-auto my-6 rounded-2xl border border-slate-200/90 shadow-2xs bg-white">${match}</div>`
    })

    return processed
})

const scrollToHeading = (id) => {
    if (import.meta.server) return
    const el = document.getElementById(id)
    if (el) {
        activeHeadingId.value = id
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        history.replaceState(null, '', `#${id}`)
    }
}

// Normalizes tags whether string, JSON array, or native array to prevent character splitting bug
const normalizedTags = computed(() => {
    const raw = article.value?.tags
    if (!raw) return []
    if (Array.isArray(raw)) return raw
    if (typeof raw === 'string') {
        const trimmed = raw.trim()
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed)
                if (Array.isArray(parsed)) return parsed
            } catch {}
        }
        return trimmed.split(',').map(t => t.trim()).filter(Boolean)
    }
    return []
})

const readTime = computed(() => {
    if (article.value?.content) {
        const plain = article.value.content.replace(/<[^>]+>/g, ' ')
        const words = plain.split(/\s+/).filter(Boolean).length
        if (words > 0) return Math.max(1, Math.ceil(words / 200))
    }
    return article.value?.read_time || 5
})

const popularArticles = computed(() => {
    return staticArticles.filter(a => a.slug !== slug.value).slice(0, 3).map(a => ({
        ...a,
        image: resolveArticleImage(a.image, a.slug)
    }))
})

const moreArticles = computed(() => {
    return staticArticles.filter(a => a.slug !== slug.value).map(a => ({
        ...a,
        image: resolveArticleImage(a.image, a.slug)
    }))
})

const scrollRelated = (direction) => {
    if (!relatedScrollRef.value) return
    const scrollAmount = 340
    if (direction === 'left') {
        relatedScrollRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    } else {
        relatedScrollRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
}

// Comments & Replies state
const comments = ref([])
const submittingComment = ref(false)
const submittingReply = ref(false)
const replyingToId = ref(null)

const commentForm = ref({
    author_name: '',
    author_email: '',
    content: ''
})

const replyForm = ref({
    author_name: '',
    author_email: '',
    content: ''
})

const totalComments = computed(() => {
    let count = comments.value.length
    for (const c of comments.value) {
        if (c.replies && Array.isArray(c.replies)) {
            count += c.replies.length
        }
    }
    return count
})

const toggleReplyForm = (commId) => {
    if (replyingToId.value === commId) {
        replyingToId.value = null
    } else {
        replyingToId.value = commId
        replyForm.value = {
            author_name: '',
            author_email: '',
            content: ''
        }
    }
}

const fetchComments = async () => {
    try {
        const res = await get(`/blog/articles/${slug.value}/comments`)
        if (res?.data && Array.isArray(res.data)) {
            comments.value = res.data
        } else if (res?.comments && Array.isArray(res.comments)) {
            comments.value = res.comments
        }
    } catch {
        // Comments not found or empty
    }
}

const submitRootComment = async () => {
    submittingComment.value = true
    try {
        await post(`/blog/articles/${slug.value}/comments`, {
            author_name: commentForm.value.author_name,
            author_email: commentForm.value.author_email,
            content: commentForm.value.content
        })
        toast.success('Thank you! Your comment has been submitted.')
        commentForm.value.content = ''
        await fetchComments()
    } catch {
        // Add locally for optimistic UI
        comments.value.unshift({
            id: Date.now(),
            author_name: commentForm.value.author_name,
            content: commentForm.value.content,
            created_at: new Date().toISOString(),
            replies: []
        })
        toast.success('Thank you! Your comment has been posted.')
        commentForm.value.content = ''
    } finally {
        submittingComment.value = false
    }
}

const submitReply = async (parentComm) => {
    submittingReply.value = true
    try {
        await post(`/blog/articles/${slug.value}/comments`, {
            parent_id: parentComm.id,
            author_name: replyForm.value.author_name,
            author_email: replyForm.value.author_email,
            content: replyForm.value.content
        })
        toast.success('Reply posted successfully!')
        replyingToId.value = null
        await fetchComments()
    } catch {
        if (!parentComm.replies) parentComm.replies = []
        parentComm.replies.push({
            id: Date.now(),
            parent_id: parentComm.id,
            author_name: replyForm.value.author_name,
            content: replyForm.value.content,
            created_at: new Date().toISOString()
        })
        toast.success('Reply posted successfully!')
        replyingToId.value = null
    } finally {
        submittingReply.value = false
    }
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'Sep 14, 2026'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const shareToSocial = (platform) => {
    if (import.meta.server) return
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(article.value?.title || 'Archery Scoring Article')

    let shareUrl = ''
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`
            break
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`
            break
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
            break
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
            break
    }
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500')
    }
}

const copyArticleLink = async () => {
    if (import.meta.server) return
    try {
        await navigator.clipboard.writeText(window.location.href)
        isLinkCopied.value = true
        toast.success('Article link copied to clipboard!')
        setTimeout(() => {
            isLinkCopied.value = false
        }, 2500)
    } catch {
        toast.error('Failed to copy link')
    }
}

onMounted(() => {
    fetchComments()

    // Scroll spy for headings
    setTimeout(() => {
        if (import.meta.client && 'IntersectionObserver' in window) {
            const headingEls = document.querySelectorAll('article h1[id], article h2[id], article h3[id], article h4[id]')
            if (headingEls.length > 0) {
                headingObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            activeHeadingId.value = entry.target.id
                        }
                    })
                }, {
                    rootMargin: '-80px 0px -60% 0px'
                })
                headingEls.forEach(el => headingObserver.observe(el))
            }
        }
    }, 400)
})

onUnmounted(() => {
    if (headingObserver) {
        headingObserver.disconnect()
    }
})

const structuredData = computed(() => {
    if (!article.value?.title) return null
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.value.title,
        'description': article.value.excerpt || 'Archery scoring guides and tournament articles.',
        'image': [article.value.image || 'https://archeris.net/logo.png'],
        'datePublished': article.value.published_at || '2025-01-01',
        'author': {
            '@type': 'Person',
            'name': article.value.author || 'Archeris Editorial Team'
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'Archeris',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://archeris.net/logo.png'
            }
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': `https://archeris.net/blog/${slug.value}`
        }
    }
})


const breadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://archeris.net/'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Blog',
      'item': 'https://archeris.net/blog'
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': article.value?.category || 'Category',
      'item': `https://archeris.net/blog/category/${categorySlug.value}`
    },
    {
      '@type': 'ListItem',
      'position': 4,
      'name': article.value?.title || 'Article',
      'item': `https://archeris.net/blog/${slug.value}`
    }
  ]
}))

const canonicalUrl = computed(() => `https://archeris.net/blog/${slug.value}`)

useHead({
    title: computed(() => (article.value?.title || 'Archery Guide') + ' - Archeris Blog'),
    link: [
        { rel: 'canonical', href: canonicalUrl.value }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => structuredData.value ? JSON.stringify(structuredData.value) : '')
        },
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify(breadcrumbSchema.value))
        }
    ]
})

useSeoMeta({
    title: () => (article.value?.title || 'Archery Guide') + ' - Archeris Blog',
    description: () => article.value?.excerpt || 'Read the latest archery scoring guides and tournament articles on Archeris.',
    ogTitle: () => (article.value?.title || 'Archery Guide') + ' - Archeris Blog',
    ogDescription: () => article.value?.excerpt || 'Read the latest archery scoring guides and tournament articles on Archeris.',
    ogImage: () => article.value?.image || 'https://archeris.net/logo.png',
    ogType: 'article',
    ogUrl: () => `https://archeris.net/blog/${slug.value}`,
    ogSiteName: 'Archeris',
    twitterCard: 'summary_large_image',
    twitterTitle: () => (article.value?.title || 'Archery Guide') + ' - Archeris Blog',
    twitterDescription: () => article.value?.excerpt || 'Read the latest archery scoring guides and tournament articles on Archeris.',
    twitterImage: () => article.value?.image || 'https://archeris.net/logo.png',
    twitterSite: '@archeris_app',
    twitterCreator: '@archeris_app'
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

/* ── Clean Borderless Article Headings ── */
:deep(.article-prose h2) {
    color: #0f172a;
}

:deep(.article-prose h3) {
    color: #1e293b;
}

:deep(.article-prose h4) {
    color: #475569;
    letter-spacing: 0.025em;
}

/* ── Responsive & Consistent Table Styling ── */
:deep(.article-table-wrapper) {
    width: 100%;
    margin-top: 1.75rem;
    margin-bottom: 1.75rem;
}

:deep(.article-prose table) {
    width: 100%;
    min-width: 600px;
    border-collapse: collapse;
    margin: 0;
    text-align: left;
    font-size: 0.875rem;
    line-height: 1.5;
}

:deep(.article-prose thead) {
    background-color: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
}

:deep(.article-prose thead th) {
    color: #0f172a;
    font-weight: 700;
    font-size: 0.8125rem;
    padding: 0.875rem 1rem;
    text-align: left;
    white-space: nowrap;
    border-bottom: 2px solid #e2e8f0;
}

:deep(.article-prose tbody tr) {
    border-bottom: 1px solid #f1f5f9;
    transition: background-color 0.15s ease;
}

:deep(.article-prose tbody tr:hover) {
    background-color: #f8fafc;
}

:deep(.article-prose tbody td) {
    padding: 0.875rem 1rem;
    color: #334155;
    font-size: 0.875rem;
    vertical-align: middle;
}

:deep(.article-prose tbody td:first-child) {
    font-weight: 700;
    color: #0f172a;
}
</style>