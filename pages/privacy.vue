<template>
  <div class="min-h-screen py-10">
    <Container>
      <!-- Header Section -->
      <section
        class="mb-8 relative overflow-hidden rounded-2xl border border-yellow-100 bg-gradient-to-r from-yellow-50 via-white to-orange-50">
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
        <div class="relative p-6 sm:p-8">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-3 py-1 text-sm text-yellow-700 shadow-sm backdrop-blur">
            Legal
          </div>
          <h1 class="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">Privacy Policy</h1>
          <p class="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl">Your privacy matters. This page explains what we
            collect, why, and how we protect your data.</p>
        </div>
      </section>

      <!-- Content -->
      <article class="legal-content rounded-2xl border border-yellow-100 bg-white p-6 sm:p-8 shadow-sm">
        <p>
          This Privacy Policy describes how Archeryhub.id ("we", "us", "our") collects, uses, and shares information
          when
          you use our
          website and services (collectively, the "Services"). By using the Services, you agree to the collection and
          use of information
          in accordance with this policy.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li><strong>Account information</strong>: name, email address, and any details you voluntarily provide.</li>
          <li><strong>Usage data</strong>: pages visited, actions taken, device info, approximate location (based on
            IP).</li>
          <li><strong>Cookies</strong> and similar technologies to remember preferences and improve performance.</li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>Provide and improve the Services, including personalization and feature development.</li>
          <li>Communicate with you about updates, security notices, and support.</li>
          <li>Monitor performance, prevent fraud/abuse, and ensure platform integrity.</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share limited data with trusted service providers who help us
          operate the
          Services (e.g., hosting, analytics, email). These providers are obligated to protect your information and use
          it only as instructed.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain information for as long as necessary to provide the Services, comply with legal obligations, resolve
          disputes,
          and enforce agreements. You may request deletion of your account data; we will process such requests in
          accordance with applicable law.
        </p>

        <h2>Your Choices</h2>
        <ul>
          <li>Opt out of non-essential emails using unsubscribe links.</li>
          <li>Control cookies via your browser settings.</li>
          <li>Request access, correction, or deletion of your data by contacting us.</li>
        </ul>

        <h2>Security</h2>
        <p>
          We use reasonable administrative, technical, and physical safeguards to protect your information. No method of
          transmission
          or storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>International Transfers</h2>
        <p>
          Your data may be processed in countries other than your own. Where required, we implement appropriate
          safeguards for such transfers.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          Our Services are not directed to children under 13 (or the applicable age in your jurisdiction). We do not
          knowingly collect
          personal information from children. If you believe a child has provided us data, please contact us to remove
          it.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the new version on this page and update the
          "Last Updated" date.
          Your continued use of the Services after changes indicates your acceptance.
        </p>

        <p>
          For questions about this policy or your data, contact us at <a href="mailto:hello@archeryhub.id"
            class="text-yellow-600 hover:text-yellow-700 underline">hello@archeryhub.id</a>.
        </p>

        <p class="last-updated">Last Updated: {{ new Date().toLocaleDateString() }}</p>
      </article>
    </Container>
  </div>
</template>

<script setup>
import Container from '~/components/Container.vue'

// Use landing layout
definePageMeta({
  layout: 'landing'
})

// Set page meta
const route = useRoute()
useHead({
  title: 'Privacy Policy - Archery Hub Tournament Manager',
  meta: [
    {
      name: 'description',
      content: 'Learn about how Archery Hub collects, uses, and protects your personal information and data.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://archeryhub.id${route.path}`
    }
  ]
})
</script>

<style scoped>
.legal-content {
  color: #374151;
}

.legal-content h2 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  color: #111827;
}

.legal-content p {
  margin-bottom: 1rem;
}

.legal-content ul {
  margin-bottom: 1rem;
  padding-left: 1.25rem;
  list-style: disc;
}

.legal-content li {
  margin-bottom: 0.5rem;
}

.legal-content strong {
  font-weight: 600;
}

.legal-content .last-updated {
  margin-top: 1.5rem;
  color: #6B7280;
  font-size: 0.875rem;
}
</style>