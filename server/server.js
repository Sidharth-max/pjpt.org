import './config/env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import sitemapRoutes from './routes/sitemapRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();

const resolveMediaHost = () => {
  if (process.env.AWS_PUBLIC_URL) return process.env.AWS_PUBLIC_URL;
  if (process.env.AWS_BUCKET_NAME && process.env.AWS_REGION) {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
  }
  return null;
};

const mediaHost = resolveMediaHost();
const imgSources = ["'self'", 'data:', 'https://fonts.gstatic.com', 'https://www.google-analytics.com'];
const mediaSources = ["'self'"];
const connectSources = ["'self'", 'https://www.google-analytics.com', 'https://region1.google-analytics.com', 'https://analytics.google.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

if (mediaHost) {
  imgSources.push(mediaHost);
  mediaSources.push(mediaHost);
  connectSources.push(mediaHost);
}

// Security and Performance
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": imgSources,
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      "connect-src": connectSources,
      "media-src": mediaSources,
      "frame-src": ["'self'", "https://www.google.com"],
    },
  },
}));
app.use(compression());

app.use(cors());
app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);

// Sitemap & robots.txt (before static files so catch-all doesn't intercept)
app.use('/', sitemapRoutes);

// --- Handle legacy SEO routes (Wix migrations) ---
app.use((req, res, next) => {
  // Provide 301 redirects for legacy paths that have a modern equivalent
  if (req.path === '/hi/about') {
    return res.redirect(301, '/about');
  }
  if (req.path === '/hi/event-list') {
    return res.redirect(301, '/events');
  }
  
  // Provide 410 Gone for all other dead Wix paths like /hi/blank-* or /blank-*
  const isLegacyDeadPath = /^\/(hi\/.*|blank-.*)$/i.test(req.path);
  if (isLegacyDeadPath) {
    return res.status(410).send('410 Gone - This page no longer exists.');
  }

  next();
});
// -------------------------------------------------

// Static files for production
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Handle React routing, return all requests to React app
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling fallback
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
