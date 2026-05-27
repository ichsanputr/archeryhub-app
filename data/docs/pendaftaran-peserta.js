export const pendaftaran_peserta = {
    slug: 'pendaftaran-peserta', title: 'Registration of Participants to the Event', excerpt: 'Guide to individual registration, data validation, and participant payment status.', icon: 'ph:clipboard-text-bold', category: 'event', readTime: '5 min',
    toc: [
        { id: 'daftar-individu', level: 2, text: 'Individual List' },
        { id: 'validasi-pendaftaran', level: 2, text: 'Validation of Registration Data' },
        { id: 'status-pembayaran', level: 2, text: 'Payment Status' },
    ],
    content: `
                    <h2 id="individual-list">Individual List</h2>
                    <p>Archers can register for the event by selecting the appropriate category, then filling in the registration form provided by the organizing committee.</p>
                    <h2 id="validate-registration">Validation of Registration Data</h2>
                    <ul>
                        <li>Make sure the category is appropriate to the participant's age and type of bow.</li>
                        <li>Check the participant's identity and contact data again before submitting the registration.</li>
                        <li>Make sure supporting documents (if requested) have been uploaded correctly.</li>
                    </ul>
                    <h2 id="payment-status">Payment Status</h2>
                    <p>For paid events, registration will be considered valid after payment has been successfully verified by the system or committee. Save your invoice as proof of transaction.</p>
`
}
