export const profil_pemanah = {
    slug: 'profil-pemanah', title: 'Athlete Profile Customization', excerpt: 'The guide organizes athlete identity information, home club, and bow type for a professional public profile.', icon: 'ph:user-circle-gear-bold', category: 'archer', readTime: '4 min',
    toc: [
        { id: 'identitas-atlet', level: 2, text: 'Identity Information' },
        { id: 'klub-komunitas', level: 2, text: 'Club Affiliates' },
        { id: 'statistik-busur', level: 2, text: 'Arc Type Settings' },
        { id: 'halaman-publik', level: 2, text: 'Public Profile View' },
    ],
    content: `
                    <h2 id="athlete-identity">Identity Information</h2>
                    <p>Via the <strong>Settings > Profile</strong> menu, you can complete your athlete's bio. Use this section to talk about your archery experience or the target you want to achieve. Don't forget to specify your domicile (City/Province) to make it easier for the committee to map participants.</p>
                    <img src="/docs/archer-customization-profile.png" alt="Archer Profile Customization" />

                    <h2 id="club-community">Club Affiliate</h2>
                    <p>Link your profile with your home club. This information is very crucial because event registration often pulls club data automatically. If your club is not yet registered on the platform, you can enter the club name manually in the registration profile description section.</p>

                    <h2 id="arc-statistics">Arc Type Settings</h2>
                    <p>You can set the main bow type you use (Recurve, Compound, Barebow, etc). This information will make it easier for the system to provide recommendations for relevant competition categories when you search for events.</p>

                    <h2 id="public-page">Public Profile View</h2>
                    <p>Your public profile page is your digital "business card." Here visitors can see:</p>
                    <ul>
                        <li>Profile photo and brief identity.</li>
                        <li>Medal history and achievements in tournaments using archeris.net.</li>
                        <li>Graph of development of qualifying scores over time.</li>
                    </ul>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">📸</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Profile Photo Tips</div>
                            <div class="text-gray-600 text-sm">Use photos while wearing full archery equipment to give the impression of a professional and credible athlete on your public profile.</div>
                        </div>
                    </div>
`
}

