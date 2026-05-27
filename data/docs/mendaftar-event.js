export const mendaftar_event = {
    slug: 'mendaftar-event', title: 'How to Register for the Event', excerpt: 'Complete step-by-step guide to registering for an archery tournament or event at archeris.net.', icon: 'ph:clipboard-text-bold', category: 'archer', readTime: '5 min',
    toc: [
        { id: 'cari-event', level: 2, text: 'Looking for Events' },
        { id: 'pilihan-kategori', level: 2, text: 'Choose a Competition Category' },
        { id: 'isi-data', level: 2, text: 'Complete Participation Data' },
        { id: 'proses-bayar', level: 2, text: 'Registration Payment' },
        { id: 'konfirmasi', level: 2, text: 'Confirm Registration' },
    ],
    content: `
                    <h2 id="search-event">Search for Events</h2>
                    <p>You can find various archery tournaments via the <strong>Events</strong> menu on the main page. Use the filter feature to search for events based on location, registration status (Open/Closed), or the type of tournament you are interested in.</p>
                    <img src="/docs/archer-dashboard-event.png" alt="Archer Event Dashboard" />

                    <h2 id="category-choice">Choose a Competition Category</h2>
                    <p>After selecting an event, you will see a list of available categories (for example: Recurve 70m, Barebow 20m, etc.). Make sure you choose a category that suits your age group and bow type. Click the <strong>Register</strong> button on the desired category.</p>

                    <h2 id="isi-data">Completing Participation Data</h2>
                    <p>The system will automatically retrieve data from your profile. However, check the following points again:</p>
                    <ul>
                        <li><strong>Home Club:</strong> Make sure the club listed matches the club you are representing for the event.</li>
                        <li><strong>Additional Data:</strong> Some events may request additional data such as jersey size or member number of certain organizations.</li>
                    </ul>

                    <h2 id="payment-process">Registration Payment</h2>
                    <p>Each registration will generate a unique invoice. You can choose various payment methods:</p>
                    <ul>
                        <li><strong>Virtual Account:</strong> Verified automatic payment (BNI, Mandiri, Permata, etc.).</li>
                        <li><strong>E-Wallet:</strong> Support QRIS, GoPay, and ShopeePay for easy mobile transactions.</li>
                    </ul>
                    <p>After successful payment, your registration status will automatically change to <strong>Paid</strong>.</p>

                    <h2 id="confirm">Registration Confirmation</h2>
                    <p>After making a payment, you do not need to send proof of transfer manually if you use the Virtual Account or E-Wallet method. Electronic tickets and participant numbers will be available on your dashboard as soon as the system verifies the transaction.</p>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">⚠️</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Important</div>
                            <div class="text-gray-600 text-sm">Make sure you complete the payment before the invoice deadline (usually 24 hours) so that your registration is not automatically forfeited by the system.</div>
                        </div>
                    </div>
`
}

