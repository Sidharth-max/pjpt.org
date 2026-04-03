import express from 'express';
import Image from '../models/Image.js';

const router = express.Router();

const DOMAIN = 'https://pjpt.org';
const SITE_NAME = 'Avadhpuri Parasali Jain Tirth';
const SITE_THUMBNAIL = `${DOMAIN}/og-image.jpg`;

const VIDEO_REGEX = /\.(mp4|webm|ogg|mov)(\?.*)?$/i;

// Derive a thumbnail URL from a video URL:
// For S3-hosted videos, try replacing the extension with .jpg.
// Falls back to the site-wide OG image.
const deriveThumbnail = (videoUrl) => {
  const clean = videoUrl.split('?')[0];
  const candidate = clean.replace(/\.(mp4|webm|ogg|mov)$/i, '.jpg');
  // Only use if it looks like a real URL (not the same as the video)
  return candidate !== clean ? candidate : SITE_THUMBNAIL;
};

const esc = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.9', changefreq: 'weekly' },
  { path: '/visit', priority: '0.8', changefreq: 'monthly' },
  { path: '/events', priority: '0.9', changefreq: 'weekly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/events/dhwajarohan-2026', priority: '0.9', changefreq: 'weekly' },
];

// Sitemap index — lists both sitemaps so Google finds them from one entry point
router.get('/sitemap-index.xml', (req, res) => {
  const now = new Date().toISOString().split('T')[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/video-sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
  res.set('Content-Type', 'application/xml');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

// Main sitemap — static pages
router.get('/sitemap.xml', async (req, res) => {
  try {
    const staticEntries = staticRoutes.map(({ path, priority, changefreq }) =>
      `  <url>\n    <loc>${DOMAIN}${path}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    ).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Video sitemap — Google video sitemap spec v1.1
// All videos are grouped under the /gallery page URL (the page they appear on).
// Google requires: thumbnail_loc, title, description
// Strongly recommended: content_loc, publication_date, family_friendly, requires_subscription, uploader, platform
router.get('/video-sitemap.xml', async (req, res) => {
  try {
    const images = await Image.find({}, 'title altText category url uploadedAt').lean();
    const videos = images.filter(img => VIDEO_REGEX.test(img.url));

    if (videos.length === 0) {
      // Still return a valid empty sitemap so Google doesn't error
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
</urlset>`;
      res.set('Content-Type', 'application/xml');
      res.set('Cache-Control', 'public, max-age=3600');
      return res.send(xml);
    }

    // Group all videos under the gallery page
    const videoEntries = videos.map(v => {
      const title = esc(v.title || v.category || 'Jain Tirth Video');
      const description = esc(
        v.altText
          ? v.altText
          : `${v.category} video from ${SITE_NAME}. A sacred Jain pilgrimage site in Madhya Pradesh, India.`
      );
      const contentUrl = esc(v.url.split('?')[0]); // strip cache-busting params
      const thumbnail = esc(deriveThumbnail(v.url));
      const pubDate = new Date(v.uploadedAt).toISOString();

      return `    <video:video>
      <video:thumbnail_loc>${thumbnail}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>${description}</video:description>
      <video:content_loc>${contentUrl}</video:content_loc>
      <video:publication_date>${pubDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:requires_subscription>no</video:requires_subscription>
      <video:uploader info="${DOMAIN}/about">${esc(SITE_NAME)}</video:uploader>
      <video:platform relationship="allow">web mobile tv</video:platform>
    </video:video>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${DOMAIN}/gallery</loc>
${videoEntries}
  </url>
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating video sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  res.set('Cache-Control', 'public, max-age=86400');
  res.type('text/plain');
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${DOMAIN}/sitemap-index.xml\nSitemap: ${DOMAIN}/sitemap.xml\nSitemap: ${DOMAIN}/video-sitemap.xml`
  );
});

export default router;
