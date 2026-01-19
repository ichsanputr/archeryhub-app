<template>
    <div class="min-h-screen flex flex-col">
        <!-- Hero Section -->
        <div class="bg-navy pt-12 pb-16 relative overflow-hidden">
            <div class="absolute inset-0 z-0 opacity-10">
                <div class="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 bg-primary rounded-full blur-3xl opacity-20">
                </div>
                <div
                    class="absolute left-0 bottom-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20">
                </div>
            </div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="max-w-3xl">
                    <div class="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider mb-3">
                        <span class="material-symbols-outlined text-lg">gavel</span>
                        Legal
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        Legal Information & Policies
                    </h1>
                    <p class="text-slate-300 text-lg leading-relaxed max-w-2xl">
                        Transparency is key to our community. Please read our terms, policies, and disclaimers to
                        understand how we manage Archery Hub.
                    </p>
                    <p class="text-slate-400 text-sm mt-6">
                        Last updated: October 24, 2024
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-8 mb-20 relative z-20">
            <div class="flex flex-col lg:flex-row gap-10">
                <!-- Sticky Sidebar -->
                <aside class="w-full lg:w-64 flex-shrink-0 hidden lg:block">
                    <div
                        class="sticky top-24 space-y-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
                        <h3 class="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contents</h3>
                        <a href="#privacy-policy"
                            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy/5 dark:hover:bg-white/5 transition-colors"
                            :class="activeSection === 'privacy-policy' ? 'bg-navy/5 text-navy dark:text-white dark:bg-white/5' : 'text-slate-600 dark:text-slate-300'">
                            <span class="w-1.5 h-1.5 rounded-full mr-3"
                                :class="activeSection === 'privacy-policy' ? 'bg-primary' : 'bg-slate-300 group-hover:bg-navy'"></span>
                            Privacy Policy
                        </a>
                        <a href="#terms-of-service"
                            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy/5 dark:hover:bg-white/5 transition-colors"
                            :class="activeSection === 'terms-of-service' ? 'bg-navy/5 text-navy dark:text-white dark:bg-white/5' : 'text-slate-600 dark:text-slate-300'">
                            <span class="w-1.5 h-1.5 rounded-full mr-3"
                                :class="activeSection === 'terms-of-service' ? 'bg-primary' : 'bg-slate-300 group-hover:bg-navy'"></span>
                            Terms of Service
                        </a>
                        <a href="#disclaimer"
                            class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-navy/5 dark:hover:bg-white/5 transition-colors"
                            :class="activeSection === 'disclaimer' ? 'bg-navy/5 text-navy dark:text-white dark:bg-white/5' : 'text-slate-600 dark:text-slate-300'">
                            <span class="w-1.5 h-1.5 rounded-full mr-3"
                                :class="activeSection === 'disclaimer' ? 'bg-primary' : 'bg-slate-300 group-hover:bg-navy'"></span>
                            Disclaimer
                        </a>
                    </div>
                </aside>

                <!-- Content Area -->
                <div
                    class="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12">
                    <!-- Privacy Policy -->
                    <section id="privacy-policy"
                        class="scroll-mt-32 mb-16 border-b border-gray-100 dark:border-gray-700 pb-12">
                        <h2 class="text-3xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary text-4xl">policy</span>
                            Privacy Policy
                        </h2>
                        <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p class="mb-6 leading-relaxed">
                                At Archery Hub Indonesia, we take your privacy seriously. This Privacy Policy explains
                                how we collect, use, disclosure, and safeguard your information when you visit our
                                website including any other media form, media channel, mobile website, or mobile
                                application related or connected thereto.
                            </p>
                            <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. Collection of Your
                                Information</h3>
                            <p class="mb-4">We may collect information about you in a variety of ways. The information
                                we may collect on the Site includes:</p>
                            <ul class="list-disc pl-6 space-y-2 mb-6 marker:text-primary">
                                <li><strong>Personal Data:</strong> Personally identifiable information, such as your
                                    name, shipping address, email address, and telephone number, and demographic
                                    information.</li>
                                <li><strong>Derivative Data:</strong> Information our servers automatically collect when
                                    you access the Site, such as your IP address, your browser type, your operating
                                    system, your access times, and the pages you have viewed directly before and after
                                    accessing the Site.</li>
                                <li><strong>Financial Data:</strong> Financial information, such as data related to your
                                    payment method (e.g. valid credit card number, card brand, expiration date) that we
                                    may collect when you purchase, order, return, exchange, or request information about
                                    our services from the Site.</li>
                            </ul>
                            <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Use of Your Information
                            </h3>
                            <p class="mb-4">Having accurate information about you permits us to provide you with a
                                smooth, efficient, and customized experience. Specifically, we may use information
                                collected about you via the Site to:</p>
                            <ol class="list-decimal pl-6 space-y-2 mb-6 marker:text-navy marker:font-bold">
                                <li>Create and manage your account.</li>
                                <li>Process your subscription to club memberships and tournament registrations.</li>
                                <li>Email you regarding your account or order.</li>
                                <li>Enable user-to-user communications.</li>
                                <li>Fulfill and manage purchases, orders, payments, and other transactions related to
                                    the Site.</li>
                            </ol>
                        </div>
                    </section>

                    <!-- Terms of Service -->
                    <section id="terms-of-service"
                        class="scroll-mt-32 mb-16 border-b border-gray-100 dark:border-gray-700 pb-12">
                        <h2 class="text-3xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary text-4xl">gavel</span>
                            Terms of Service
                        </h2>
                        <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <p class="mb-6 leading-relaxed">
                                Please read these Terms of Service ("Terms", "Terms of Service") carefully before using
                                the Archery Hub website (the "Service") operated by Archery Hub Indonesia ("us", "we",
                                or "our").
                            </p>
                            <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. Acceptance of Terms
                            </h3>
                            <p class="mb-4">
                                By accessing or using the Service you agree to be bound by these Terms. If you disagree
                                with any part of the terms then you may not access the Service.
                            </p>
                            <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Club Directory &
                                Verification</h3>
                            <p class="mb-4">
                                Archery Hub provides a directory of archery clubs in Indonesia. While we strive to
                                verify clubs marked with the "Verified" badge, we cannot guarantee the complete accuracy
                                of all club details, including training schedules and fees.
                            </p>
                            <ol class="list-decimal pl-6 space-y-2 mb-6 marker:text-navy marker:font-bold">
                                <li><strong>Verified Badge:</strong> Indicates that the club has submitted official
                                    documentation to Archery Hub.</li>
                                <li><strong>Member Reviews:</strong> Users are responsible for the content of their
                                    reviews. We reserve the right to remove reviews that violate our community
                                    guidelines.</li>
                                <li><strong>Disputes:</strong> Any disputes between a user and a club found through our
                                    platform must be resolved directly between the parties. Archery Hub is not liable
                                    for club operations.</li>
                            </ol>
                            <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">3. Termination</h3>
                            <p class="mb-4">
                                We may terminate or suspend access to our Service immediately, without prior notice or
                                liability, for any reason whatsoever, including without limitation if you breach the
                                Terms.
                            </p>
                        </div>
                    </section>

                    <!-- Disclaimer -->
                    <section id="disclaimer" class="scroll-mt-32">
                        <h2 class="text-3xl font-bold text-navy dark:text-white mb-6 flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary text-4xl">warning</span>
                            Disclaimer
                        </h2>
                        <div
                            class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-8">
                            <p class="text-yellow-800 dark:text-yellow-200 font-medium italic">
                                "Archery involves the use of equipment that can be dangerous if mishandled. Archery Hub
                                is an informational platform and is not responsible for any injuries or accidents that
                                occur at listed clubs or events."
                            </p>
                        </div>
                        <div class="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                            <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">1. General Information
                            </h3>
                            <p class="mb-4">
                                The information provided by Archery Hub Indonesia on this website is for general
                                informational purposes only. All information on the Site is provided in good faith,
                                however we make no representation or warranty of any kind, express or implied, regarding
                                the accuracy, adequacy, validity, reliability, availability or completeness of any
                                information on the Site.
                            </p>
                            <h3 class="text-xl font-bold text-navy dark:text-white mt-8 mb-4">2. Professional Disclaimer
                            </h3>
                            <p class="mb-4">
                                The Site cannot and does not contain professional sports advice. The archery information
                                is provided for general informational and educational purposes only and is not a
                                substitute for professional advice. Accordingly, before taking any actions based upon
                                such information, we encourage you to consult with the appropriate professionals.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'landing'
})

const activeSection = ref('privacy-policy')

onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeSection.value = entry.target.id
            }
        })
    }, { threshold: 0.5 })

    document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section)
    })
})
</script>

<style scoped>
html {
    scroll-behavior: smooth;
}

.material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
