import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

const DOMAIN = 'https://pjpt.org';

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.9', changefreq: 'weekly' },
  { path: '/visit', priority: '0.8', changefreq: 'monthly' },
  { path: '/events', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/events/dhwajarohan-2026', priority: '0.9', changefreq: 'weekly' },
];

router.get('/sitemap.xml', async (req, res) => {
  try {
    const events = await Event.find({}, '_id createdAt').lean();

    const staticEntries = staticRoutes.map(({ path, priority, changefreq }) =>
      `  <url>\n    <loc>${DOMAIN}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    ).join('\n');

    const eventEntries = events.map(evt =>
      `  <url>\n    <loc>${DOMAIN}/events/${evt._id}</loc>\n    <lastmod>${new Date(evt.createdAt).toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    ).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${eventEntries}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  res.set('Cache-Control', 'public, max-age=86400');
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${DOMAIN}/sitemap.xml`);
});

export default router;
