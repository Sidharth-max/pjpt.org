# Staging vs Production — pjpt.org

## Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| **Staging** | `pjpt.funcrisp.store` | `main` | Test changes before going live |
| **Production** | `pjpt.org` | `main` | Live site — real users |

---

## CRITICAL: Production Safety Rules

**Never push or deploy directly to production without first validating on staging.**

- All feature work and bug fixes must be tested on `pjpt.funcrisp.store` first
- Production (`pjpt.org`) should only be updated after staging sign-off
- Do NOT change env vars, nginx config, or PM2 config on production without review
- Do NOT run `deploy.sh` on the production server for untested changes
- Do NOT enable `ALLOW_MEDIA_UPLOAD=true` or `ALLOW_MEDIA_DELETE=true` on production without explicit approval

---

## Staging Server Setup

MongoDB runs in Docker on staging. To start it:

```bash
docker-compose up -d
```

MongoDB will be available at `mongodb://localhost:27017/pjpt`.

Set up `.env` from the provided template:

```bash
cp .env.staging.example .env
# Edit .env and fill in JWT_SECRET and ADMIN_PASSWORD
```

Uploaded files will be saved to `uploads/images/` on disk and served at `https://pjpt.funcrisp.store/uploads/images/...`.

### Deploy to Staging

```bash
# SSH into staging server
ssh ubuntu@pjpt.funcrisp.store

cd /home/ubuntu/pjpt.org
git pull
npm install
npm run build
pm2 restart pjpt-server
```

---

## Production Server Setup

Production uses the same stack but with:
- A secured MongoDB instance (not open port 27017)
- Real AWS S3 credentials
- SSL via Let's Encrypt / Certbot
- `ALLOW_MEDIA_UPLOAD` and `ALLOW_MEDIA_DELETE` flags set per admin decision

### Deploy to Production

Only after staging is validated:

```bash
# SSH into production server
ssh ubuntu@pjpt.org

cd /home/ubuntu/pjpt.org
./deploy.sh
```

---

## Environment Variables Checklist

Before deploying to either environment, verify `.env` has the correct values:

| Variable | Staging | Production |
|----------|---------|------------|
| `MONGO_URI` | `mongodb://localhost:27017/pjpt` | Secured URI |
| `VITE_API_URL` | `https://pjpt.funcrisp.store/` | `https://pjpt.org/` |
| `ALLOW_MEDIA_UPLOAD` | `false` (default) | Confirm with admin |
| `ALLOW_MEDIA_DELETE` | `false` (default) | Confirm with admin |
| `NODE_ENV` | `production` | `production` |

---

## Git Workflow

All changes must go through `main`. No other branches are used for deployment.

1. Make and test changes locally
2. Verify on staging (`pjpt.funcrisp.store`) — pull and deploy there first
3. Only push to `main` once everything checks out on staging
4. Production (`pjpt.org`) is updated by running `./deploy.sh` on the server after the push

```bash
# After verifying on staging:
git add <files>
git commit -m "your message"
git push origin main

# Then on production server:
ssh ubuntu@pjpt.org
cd /home/ubuntu/pjpt.org && ./deploy.sh
```

**Never push broken code to `main`** — both staging and production pull from the same branch.

---

## What NOT to Do

- Do not commit `.env` files — they contain real credentials
- Do not push untested changes directly to `main`
- Do not test destructive operations (delete images/events) on production
- Do not point staging's `VITE_API_URL` to the production API
- Do not share JWT secrets or admin passwords between environments
