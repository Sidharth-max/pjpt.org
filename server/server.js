import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';

import connectDB from './config/db.js';
import imageRoutes from './routes/imageRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();

// Security and Performance
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https://res.cloudinary.com", "https://fonts.gstatic.com", "https://www.google-analytics.com"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
      "connect-src": ["'self'", "https://res.cloudinary.com", "https://www.google-analytics.com", "https://region1.google-analytics.com"],
      "frame-src": ["'self'", "https://www.google.com"],
    },
  },
}));
app.use(compression());

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use('/api/images', imageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/messages', messageRoutes);

// Static files for production
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
