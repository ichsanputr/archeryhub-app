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
          <h1 class="mt-4 text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900">Terms of Service</h1>
          <p class="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl">Please read these terms carefully before using
            Archeryhub.id.</p>
        </div>
      </section>

      <!-- Content -->
      <article class="legal-content rounded-2xl border border-yellow-100 bg-white p-6 sm:p-8 shadow-sm">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Archeryhub.id (the "Service"), you agree to be bound by these Terms of Service and our
          Privacy Policy.
          If you do not agree, do not use the Service.
        </p>

        <h2>2. Use of the Service</h2>
        <ul>
          <li>You must be at least 13 years old (or the applicable age in your jurisdiction).</li>
          <li>You agree not to misuse the Service, including interfering with or disrupting its operation.</li>
          <li>You are responsible for your account activity and for maintaining the confidentiality of your credentials.
          </li>
        </ul>

        <h2>3. Content and Ownership</h2>
        <p>
          All content provided through the Service, including articles, results, and UI elements, is owned by Archery
          Hub or its
          licensors. You may not copy, modify, distribute, or create derivative works without permission.
        </p>

        <h2>4. User Submissions</h2>
        <p>
          If you submit content (such as feedback, match scores, or comments), you grant Archeryhub.id a worldwide,
          non-exclusive, royalty-free
          license to use, reproduce, and display that content for operating and improving the Service.
        </p>

        <h2>5. Prohibited Activities</h2>
        <ul>
          <li>Attempting to access data not intended for you.</li>
          <li>Reverse engineering or scraping the Service without authorization.</li>
          <li>Uploading malware or engaging in fraudulent or abusive behavior.</li>
        </ul>

        <h2>6. Disclaimers</h2>
        <p>
          The Service is provided "as is" without warranties of any kind, express or implied. We do not warrant that the
          Service will be
          uninterrupted or error-free.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Archeryhub.id and its affiliates shall not be liable for any indirect,
          incidental, special,
          consequential, or punitive damages, or any loss of profits or data.
        </p>

        <h2>8. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at any time, with or without cause or notice, including
          for violations of
          these Terms.
        </p>

        <h2>9. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. We will post changes on this page with an updated "Last Updated"
          date. Your continued
          use of the Service constitutes acceptance of the revised Terms.
        </p>

        <h2>10. Contact</h2>
        <p>
          For questions about these Terms, contact us at <NuxtLink to="mailto:hello@archeryhub.id" external
            class="text-yellow-600 hover:text-yellow-700 underline">hello@archeryhub.id</NuxtLink>.
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
  title: 'Terms of Service - Archery Hub Tournament Manager',
  meta: [
    {
      name: 'description',
      content: 'Read the terms and conditions for using Archery Hub tournament management platform.'
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