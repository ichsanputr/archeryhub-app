export const paket_berlangganan = {
    slug: 'paket-berlangganan', title: 'Subscription Systems & Plans', excerpt: 'Complete information regarding package options, exclusive features, as well as a guide to subscription procedures for organizations at archeris.net.', icon: 'ph:crown-bold', category: 'subscription', readTime: '8 min',
    toc: [
        { id: 'tipe-paket', level: 2, text: 'Organization Package Type' },
        { id: 'perbandingan-fitur', level: 2, text: 'Standard vs Elite Features' },
        { id: 'fitur-eksklusif', level: 2, text: 'Elite Package Benefits' },
        { id: 'alur-langganan', level: 2, text: 'Subscription Procedures' },
        { id: 'metode-pembayaran', level: 2, text: 'Payment Method' },
        { id: 'kelola-berlangganan', level: 2, text: 'Subscription Management' },
    ],
    content: `
                    <h2 id="package-type">Organization Package Type</h2>
                    <p>archeris.net provides two main package options for Organizations (Event Organizers) to accommodate various scales of archery championships:</p>
                    <img src="/docs/organization- selection-paket.png" alt="Organizational Package Options" />
                    <div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                        <div class="border border-gray-100 rounded-2xl p-5 bg-white shadow-sm border-t-4 border-t-navy">
                            <div class="font-bold text-navy h-8">💼 Standard Package</div>
                            <div class="text-2xl font-black text-navy mb-2">Rp 30,000<span class="text-xs font-normal text-gray-400">/month</span></div>
                            <p class="text-xs text-gray-500 mb-4">Suitable for local clubs or internal championships with limited participants.</p>
                            <ul class="text-xs space-y-2 text-gray-600">
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Max. 50 Participants / Event</li>
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Standard Digital Scoring</li>
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Public Live Results</li>
                                <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Media Storage 1 GB</li>
                            </ul>
                        </div>
                        <div class="border border-primary/30 rounded-2xl p-5 bg-primary/5 shadow-md border-t-4 border-t-primary relative overflow-hidden">
                            <div class="absolute top-2 right-2 bg-primary text-navy text-[10px] font-black px-2 py-0.5 rounded-full ">Most Popular</div>
                            <div class="font-bold text-navy h-8">👑 Elite Package</div>
                            <div class="text-2xl font-black text-navy mb-2">Rp 80,000<span class="text-xs font-normal text-gray-400">/month</span></div>
                            <p class="text-xs text-navy/70 mb-4">Professional solutions for large tournaments, open tournaments and national scale.</p>
                            <ul class="text-xs space-y-2 text-navy/80">
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span> Unlimited Participants</li>
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span>Match Finals Management</li>
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span> Automated Payment Integration</li>
                                <li class="flex items-center gap-2"><span class="text-primary font-bold">✓</span> 5 GB Media Storage</li>
                            </ul>
                        </div>
                    </div>

                    <h2 id="feature-comparison">Standard vs Elite Features</h2>
                    <div class="not-process overflow-x-auto my-6">
                        <table class="w-full text-sm border-collapse">
                            <head>
                                <tr class="bg-navy text-left text-white font-bold">
                                    <th class="px-4 py-3 rounded-tl-xl border-b border-white/10">Main Features</th>
                                    <th class="px-4 py-3 border-b border-white/10 text-center">Standard</th>
                                    <th class="px-4 py-3 rounded-tr-xl border-b border-white/10 text-center">Elite</th>
                                </tr>
                            </head>
                            <tbody class="divide-y divide-gray-100 bg-white">
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Participant Capacity</td><td class="px-4 py-3 text-center">Max. 50</td><td class="px-4 py-3 text-center font-bold text-primary">Unlimited</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Digital Scoring & Leaderboard</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Elimination Bracket (Complaints)</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Match Finals Management</td><td class="px-4 py-3 text-center text-gray-300">○</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Automatic Payment Integration</td><td class="px-4 py-3 text-center text-gray-300">○</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Advanced Analytics & Reports</td><td class="px-4 py-3 text-center text-gray-300">○</td><td class="px-4 py-3 text-center text-green-600 text-lg">●</td></tr>
                                <tr><td class="px-4 py-3 text-gray-700 font-medium">Media Storage</td><td class="px-4 py-3 text-center">1 GB</td><td class="px-4 py-3 text-center">5 GB</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <h2 id="exclusive-features">Elite Package Benefits</h2>
                    <p>With the Elite plan, organizers get access to critical features that make managing large-scale tournaments easier:</p>
                    <ul>
                        <li><strong>Payment Automation:</strong> You don't need to manually verify proof of transfer. Participants pay via Virtual Account/E-wallet, and the registration status will change automatically.</li>
                        <li><strong>Match Finals Exclusivity:</strong> Special feature to manage the medal round with a more detailed scoring system to be displayed on the monitor screen at the venue.</li>
                        <li><strong>Financial Dashboard:</strong> Monitor cash inflow from event registration in real-time through detailed reports.</li>
                    </ul>

                    <h2 id="subscription-flow">Subscription Procedures</h2>
                    <p>Follow these steps to activate your organization plan:</p>
                    <ol>
                        <li>Sign in to your <strong>Organization Dashboard</strong>.</li>
                        <li>Select the <strong>Subscription</strong> menu from the navigation sidebar.</li>
                        <li>Determine the appropriate package (Standard or Elite) and select the period (Monthly).</li>
                        <li>Click <strong>Upgrade Now</strong> or <strong>Pay Now</strong>.</li>
                        <li>The system will issue a <strong>Subscription Invoice</strong> that you can pay via the available digital methods.</li>
                    </ol>

                    <h2 id="payment-method">Payment Method</h2>
                    <p>Payment for subscription packages is processed via the archeris.net payment gateway with a choice of methods:</p>
                    <ul>
                        <li><strong>Virtual Account (VA):</strong> Available for Bank BNI, Mandiri, Permata, BRI, and others.</li>
                        <li><strong>QRIS & E-Wallet:</strong> Full support for instant payments via GoPay, ShopeePay, Dana, etc.</li>
                    </ul>

                    <h2 id="manage-subscriptions">Subscription Management</h2>
                    <p>The status of your subscription can be monitored at any time. The subscription page will display the number of days remaining before the package ends. You can also enable the <strong>Auto-Renewal</strong> feature (if available) or download old invoices in the Billing History tab for organizational accounting reporting purposes.</p>
                    <img src="/docs/organization-riwayat-tagihan-paket.png" alt="History of Package Bills" />

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">💡</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">New User Promo</div>
                            <div class="text-gray-600 text-sm">Newly registered organizations get the opportunity to try the Standard Package for FREE for the first 3 months as part of the national archery digitalization program.</div>
                        </div>
                    </div>
`
}

