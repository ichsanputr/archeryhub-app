export const modul_news = {
    slug: 'modul-news', title: 'News & Publications Module', excerpt: 'A complete guide on how to manage news content, announcements and educational articles to build community engagement on archeris.net.', icon: 'ph:newspaper-clipping-bold', category: 'platform', readTime: '5 min',
    toc: [
        { id: 'pengenalan-news', level: 2, text: 'Introduction to News Module' },
        { id: 'membuat-berita', level: 2, text: 'Creating New Content' },
        { id: 'kategori-status', level: 2, text: 'Category & Publication Level' },
        { id: 'media-seo', level: 2, text: 'Media & SEO Optimization' },
        { id: 'tampilan-publik', level: 2, text: 'Public Interaction & Display' },
    ],
    content: `
                    <h2 id="pengenalan-news">Introduction to the News Module</h2>
                    <p>The News Module is a strategic communication tool for Organizations to convey important information to all visitors and visitors to the platform. Not only for official announcements, this module is also ideal for sharing match results reports, event documentation, and educational tips about the world of archery.</p>

                    <h2 id="creating-news">Creating New Content</h2>
                    <p>Through the Organization dashboard, you can create articles with a rich text editor (Rich Text Editor). Some of the main points in making news include:</p>
                    <img src="/docs/create-new-news.png" alt="Create New News" />
                    <ul>
                        <li><strong>News Title:</strong> Use a title that is short but informative and attracts the reader's interest.</li>
                        <li><strong>News Content:</strong> You can add text formats (bold, italic), lists (bullets/numbers), and internal or external links.</li>
                        <li><strong>Quote (Excerpt):</strong> Write a 1-2 sentence summary that will appear on the news list page as a brief overview of the contents of the article.</li>
                    </ul>

                    <h2 id="category-status">Category & Publication Level</h2>
                    <p>To make it easier for readers to navigate, each news item is grouped into certain categories:</p>
                    <ul>
                        <li><strong>Event:</strong> News related to the opening of registration, changes to the schedule, or technical information about the competition.</li>
                        <li><strong>Announcements:</strong> General information regarding the platform's organization or policies.</li>
                        <li><strong>Achievements:</strong> Highlights tournament winners or achievements of coached athletes.</li>
                        <li><strong>Other:</strong>Educational articles or technical archery tips.</li>
                    </ul>
                    <p>Each article also has a <strong>Draft</strong> status for temporary storage or <strong>Published</strong> for immediate public display.</p>

                    <h2 id="media-seo">Media & SEO Optimization</h2>
                    <p>Build interesting content not only through text, but also visuals and readability in search engines:</p>
                    <ul>
                        <li><strong>Main Image:</strong> You can upload or select a photo from the Media Library to be used as a news cover (thumbnail).</li>
                        <li><strong>Tagging System:</strong> Add relevant tags (such as #tournament, #barebow) to make it easier to search for similar news.</li>
                        <li><strong>SEO Meta Data:</strong> You can manually set meta titles and descriptions to ensure your news appears neat when shared on social media or appears in search engines.</li>
                    </ul>

                    <h2 id="public-view">Interaction & Public View</h2>
                    <p>On the visitor side (public page), each news item is equipped with interactive features to increase the reach of the content:</p>
                    <ul>
                        <li><strong>Author & Date Information:</strong> Shows the credibility of the organization as a source of information.</li>
                        <li><strong>Estimated Reading Duration:</strong> Gives readers an idea of ​​the length of the article.</li>
                        <li><strong>Share Features:</strong> Share buttons directly to WhatsApp, Facebook, or copy the link to make it easier to disseminate information.</li>
                        <li><strong>Related Articles:</strong> Display other relevant news recommendations on the side to keep readers connected to your content.</li>
                        <li><strong>Newsletter Subscription:</strong> Visitors can register their email to subscribe to the latest news updates from your organization.</li>
                    </ul>

                    <div class="not-prose bg-primary/10 border border-primary/20 rounded-2xl p-5 mt-8 flex gap-4">
                        <div class="text-primary text-2xl shrink-0">📈</div>
                        <div>
                            <div class="font-bold text-navy text-sm mb-1">Content Strategy</div>
                            <div class="text-gray-600 text-sm">News stories accompanied by high-quality images and appropriate tags tend to get 2x more readers on the archeris.net platform.</div>
                        </div>
                    </div>
`
}

