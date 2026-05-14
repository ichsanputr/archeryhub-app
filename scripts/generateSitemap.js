import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SITE_URL = 'https://Archeris.id';
const API_URL = 'http://localhost:8001/api/v1'; // Fallback if no .env
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

async function generateSitemap() {
    console.log('--- Archeris.id Sitemap Generator ---');
    console.log(`Site URL: ${SITE_URL}`);
    console.log(`API URL: ${API_URL}`);

    const staticPages = [
        '',
        '/archers',

        '/events',
        '/news',
        '/products',
        '/organization',
        '/contact',
        '/faq',
        '/privacy',
        '/terms',
        '/disclaimer',
        '/subscription',
    ];

    try {
        console.log('Fetching dynamic slugs from API...');
        const response = await axios.get(`${API_URL}/discovery/sitemap`);
        const data = response.data;

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // 1. Add Static Pages
        console.log(`Adding ${staticPages.length} static pages...`);
        staticPages.forEach(page => {
            xml += `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        // 2. Add Events
        if (data.events) {
            console.log(`Adding ${data.events.length} events...`);
            data.events.forEach(slug => {
                xml += `
  <url>
    <loc>${SITE_URL}/events/${slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
            });
        }

        // 3. Add Archers
        if (data.archers) {
            console.log(`Adding ${data.archers.length} archers...`);
            data.archers.forEach(username => {
                xml += `
  <url>
    <loc>${SITE_URL}/archers/${username}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
            });
        }



        // 5. Add Organizations
        if (data.organizations) {
            console.log(`Adding ${data.organizations.length} organizations...`);
            data.organizations.forEach(slug => {
                xml += `
  <url>
    <loc>${SITE_URL}/organization/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
            });
        }

        // 6. Add Products
        if (data.products) {
            console.log(`Adding ${data.products.length} products...`);
            data.products.forEach(slug => {
                xml += `
  <url>
    <loc>${SITE_URL}/products/${slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
            });
        }

        // 7. Add News
        if (data.news) {
            console.log(`Adding ${data.news.length} news articles...`);
            data.news.forEach(slug => {
                xml += `
  <url>
    <loc>${SITE_URL}/news/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
            });
        }

        xml += `
</urlset>`;

        // Ensure output directory exists
        const publicDir = path.dirname(OUTPUT_FILE);
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir, { recursive: true });
        }

        fs.writeFileSync(OUTPUT_FILE, xml);
        console.log(`\nSuccess! Sitemap generated at: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('\nError generating sitemap:');
        if (error.response) {
            console.error(`API rejected request: ${error.response.status} ${error.response.statusText}`);
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

generateSitemap();
