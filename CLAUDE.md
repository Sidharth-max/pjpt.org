# CLAUDE.md — Avadhpuri Parasali Jain Tirth (pjpt.org)

## Project Overview

This is a full-stack web application for **Avadhpuri Parasali Jain Tirth**, a Jain pilgrimage site. It features a public-facing site with gallery, events, and contact forms, plus a password-protected admin panel for content management.

**Staging server:** `pjpt.funcrisp.store` | **Production server:** `pjpt.org`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router v6 |
| Styling | Tailwind CSS 3.4 with custom design tokens |
| Animations | Framer Motion |
| Backend | Node.js, Express 5 (ES modules) |
| Database | MongoDB 7 via Mongoose 9 |
| Auth | JWT (single admin account) |
| Storage | AWS S3 (fallback: local `/uploads/`) |
| PWA | Vite Plugin PWA + Workbox |
| Process Mgr | PM2 |
| Reverse Proxy | Nginx |

---

## Repository Structure

```
pjpt.org/
├── src/                    # React frontend
│   ├── components/         # Navbar, Footer, VideoPlayer, LotusWatermark, ScrollToTop
│   ├── pages/              # Home, About, Gallery, Visit, Events, Contact, Admin
│   │   └── events/         # Dhwajarohan2026.jsx (special event page)
│   ├── contexts/           # LanguageContext.jsx (En/Hi toggle)
│   ├── i18n/               # translations.js (English + Hindi strings)
│   ├── services/           # api.js (Axios client for all API calls)
│   ├── data/               # content.js, history.js (static copy)
│   ├── styles/             # globals.css (CSS variables)
│   ├── App.jsx             # Router setup
│   └── main.jsx            # Entry point + media protection JS
├── server/                 # Express backend
│   ├── config/             # db.js, s3Client.js, env.js
│   ├── middleware/         # authMiddleware.js (JWT protect())
│   ├── models/             # Message.js, Event.js, Image.js
│   └── routes/             # auth.js, images.js, events.js, messages.js, sitemap.js
├── public/                 # Static assets, manifest.json
├── dist/                   # Production build output (gitignored)
├── uploads/                # Local fallback for media storage
├── mongo-data/             # MongoDB Docker volume
├── vite.config.js          # Vite + PWA caching config
├── tailwind.config.js      # Custom colors/fonts
├── nginx.conf              # Nginx reverse proxy config
├── ecosystem.config.cjs    # PM2 production config
├── docker-compose.yml      # MongoDB for staging
└── deploy.sh               # Deployment script
```

---

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Copy env file (never commit real credentials)
cp .env.example .env  # Edit with real values
```

### Running Locally

```bash
# Frontend only (Vite dev server)
npm run dev

# Frontend + Backend concurrently
npm run dev:all

# Backend only
npm start
```

The backend runs on **port 5000**. The Vite dev server uses its default port. The frontend proxies API calls to `VITE_API_URL` (defaults to `http://localhost:5000` in dev).

### Building

```bash
npm run build    # Builds frontend to /dist
```

### Production Start

```bash
pm2 start ecosystem.config.cjs   # Starts server/server.js on port 5000
```

Nginx serves `/dist` for frontend and proxies `/api/*` to `localhost:5000`.

---

## Environment Variables

**Backend (root `.env`):**
```
PORT=5000
MONGO_URI=<mongodb connection string>
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_BUCKET_NAME=pjpt-gallery
AWS_PUBLIC_URL=https://pjpt-gallery.s3.ap-south-1.amazonaws.com
ALLOW_MEDIA_UPLOAD=false
ALLOW_MEDIA_DELETE=false
ADMIN_PASSWORD=<password>
JWT_SECRET=<secret>
```

**Frontend (Vite — must use `VITE_` prefix):**
```
VITE_API_URL=https://pjpt.funcrisp.store/
VITE_ADMIN_PASSWORD=<password>
VITE_ALLOW_MEDIA_UPLOAD=false
VITE_ALLOW_MEDIA_DELETE=false
```

`ALLOW_MEDIA_UPLOAD` and `ALLOW_MEDIA_DELETE` are feature flags. When `false`, upload/delete operations in the admin panel are disabled.

---

## API Reference

All routes are prefixed with `/api`.

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | No | Login with admin password, returns JWT |

### Images
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/images` | No | List images (filter: `?category=Temple`) |
| POST | `/images/upload` | Yes | Upload image (multipart: title, category, altText, file) |
| DELETE | `/images/:id` | Yes | Delete image |

**Categories:** `Temple`, `Idol`, `Festivals`, `Events`, `Nature`

### Events
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/events` | No | List events (filter: `?featured=true`) |
| GET | `/events/:id` | No | Get event by ID |
| POST | `/events` | Yes | Create event (supports image upload) |
| PUT | `/events/:id` | Yes | Update event |
| DELETE | `/events/:id` | Yes | Delete event |

### Messages
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/messages` | Yes | List contact form submissions |
| POST | `/messages` | No | Submit contact form |
| DELETE | `/messages/:id` | Yes | Delete message |

### Auth Header Format
```
Authorization: Bearer <jwt_token>
```
Token is stored in `sessionStorage` as `adminToken` on the frontend.

---

## Database Models

### Image
```js
{ title, category, url, publicId, altText, uploadedAt }
```

### Event
```js
{ title, date, description, category, isFeatured, image, createdAt }
```

### Message
```js
{ name, email, phone, message, createdAt }
```

---

## Internationalization (i18n)

The site supports **English and Hindi**. Language is managed via `LanguageContext` (React Context API).

- Translations live in `src/i18n/translations.js`
- Toggle is in `Navbar.jsx` (En/Hi button)
- Hindi uses the **Noto Sans Devanagari** font
- When adding new UI strings, add both `en` and `hi` keys to `translations.js`

---

## Styling Conventions

**Custom Tailwind tokens** (defined in `tailwind.config.js`):

```
Colors: gold-primary, gold-light, text-primary, text-secondary, bg-light, bg-dark
Fonts: Cinzel (headings), Cormorant Garamond (body serif), Noto Sans Devanagari (Hindi)
Letter spacing: tracking-wide → 0.08em
```

Use these tokens instead of raw hex values to maintain the temple's aesthetic.

---

## PWA & Caching Strategy

Configured in `vite.config.js`:
- **API routes** (`/api/*`): NetworkFirst, 10s timeout
- **Media assets** (images/videos): CacheFirst, 30-day expiration
- **Google Fonts**: StaleWhileRevalidate

The service worker auto-updates. The manifest is manually maintained at `public/manifest.json`.

---

## Media Protection

`src/main.jsx` injects client-side protections:
- Disables right-click context menu on images and videos
- Blocks Ctrl+S (save page) and Ctrl+U (view source)

Do not remove these; they are intentional site requirements.

---

## File Storage

Images are stored on **AWS S3** by default. The `s3Client.js` config falls back to local `/uploads/images/` if S3 is not configured.

- S3 URLs use `AWS_PUBLIC_URL` env var as base
- Local uploads are served via `GET /uploads/*` Express route
- `publicId` field on Image model stores the S3 key for deletion

---

## Key Conventions

1. **ES Modules throughout** — both frontend and backend use `import`/`export`, no CommonJS `require()` (except `ecosystem.config.cjs` which must be `.cjs`)
2. **No test suite** — there are no tests; be careful with changes to API routes and auth middleware
3. **Single admin user** — no user registration system; auth is one password from env var
4. **Feature flags via env** — check `ALLOW_MEDIA_UPLOAD`/`ALLOW_MEDIA_DELETE` before adding upload/delete UI
5. **Admin.jsx is large** — `src/pages/Admin.jsx` (~58KB) handles login, images, events, and messages in one file. Be careful editing it.
6. **App.jsx has time-based routing** — the Home page automatically switches post-April 9, 2026 (end of Dhwajarohan event)
7. **Hindi font requires Devanagari** — always use `font-devanagari` class for Hindi text

---

## Deployment

```bash
# On the server (Ubuntu)
cd /home/ubuntu/pjpt.org
git pull
npm install
npm run build
pm2 restart pjpt-server
```

Nginx serves the built `/dist` directory and proxies `/api` to PM2-managed Express on port 5000. MongoDB runs in Docker (`docker-compose up -d`).

---

## Notes for AI Assistants

- The `.env` file exists on the server and contains real credentials — never commit it or log its contents
- `ALLOW_MEDIA_UPLOAD=false` means upload is intentionally disabled in staging; don't "fix" it without asking
- The Dhwajarohan2026 page is a temporary special event page — its routing logic in `App.jsx` has a date condition
- When modifying API routes, update `src/services/api.js` to match
- When adding translations, always add both `en` and `hi` entries to `src/i18n/translations.js`
- The staging URL is `pjpt.funcrisp.store`; production is `pjpt.org`
