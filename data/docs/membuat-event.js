export const membuat_event = {
    slug: 'membuat-event', title: 'Create and Publish Events', excerpt: 'Complete guide to designing events from draft, category configuration, to public release.', icon: 'ph:plus-square-bold', category: 'event', readTime: '9 min',
    toc: [
        { id: 'persyaratan', level: 2, text: 'Condition' },
        { id: 'siapkan-data', level: 2, text: 'Data that needs to be prepared' },
        { id: 'langkah-membuat', level: 2, text: 'Steps to Create an Event' },
        { id: 'publish', level: 2, text: 'Publishing Events' },
        { id: 'checklist-pra-rilis', level: 2, text: 'Pre-Release Checklist' },
    ],
    content: `
                    <h2 id="requirements">Requirements</h2>
                    <p>To create an event, your account must be of type <strong>Organization</strong> and have an active subscription package in accordance with the requirements of the event module to be used.</p>
                    <h2 id="prepare-data">Data that needs to be prepared</h2>
                    <ul>
                        <li>Name of event and identity of organizer.</li>
                        <li>Implementation date, location, and PIC.</li>
                        <li>Open competition categories/divisions.</li>
                        <li>Participant quota per category.</li>
                        <li>Payment scheme (free/paid) and registration deadline.</li>
                    </ul>
                    <h2 id="creation-step">Event Creation Step</h2>
                    <ol>
                        <li>Go to <strong>Organization Dashboard -> Events -> Create Event</strong>.</li>
                        <li>Fill in the basic event information and upload the banner.</li>
                        <li>Add competition categories, quotas, and technical parameters.</li>
                        <li>Configure important registrations, fees, and schedules.</li>
                        <li>Save as a draft, then review the data with the committee team.</li>
                    </ol>
                    <img src="/docs/menamcepat-category-competition.png" alt="Adding Contest Category" />
                    <h2 id="publish">Publishing Event</h2>
                    <p>After validation is complete, click <strong>Publish</strong> so that the event appears on the public page. As long as the registration period is still running, you can still make corrections to non-critical content.</p>
                    <img src="/docs/printout.png" alt="Output Event & Printout" />
                    <h2 id="pre-release-checklist">Pre-Release Checklist</h2>
                    <ul>
                        <li>Make sure all categories have quotas and schedules.</li>
                        <li>Check the registration price and payment status.</li>
                        <li>Recheck the event description to avoid multiple interpretations.</li>
                        <li>Make sure the operational team is ready to monitor incoming registration.</li>
                    </ul>
`
}
