# Vercel Deployment Guide 🚀

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase project
- Code pushed to GitHub repository

---

## Step 1: Prepare Your Repository

### 1.1 Create `.gitignore` (if not exists)

Ensure these are in your `.gitignore`:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env
.env.production

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### 1.2 Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Import Project

1. Go to https://vercel.com/
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Click **"Import"**

### 2.2 Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or auto-detected)
- **Output Directory:** `.next` (or auto-detected)
- **Install Command:** `npm install` (or auto-detected)

---

## Step 3: Set Environment Variables

### 3.1 Add in Vercel Dashboard

**Project Settings → Environment Variables**

Add these variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App URL (IMPORTANT: Use your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Where to find Supabase keys:**
1. Supabase Dashboard → Settings → API
2. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

**Important:** Set these for **all environments** (Production, Preview, Development)

---

## Step 4: Update Supabase Configuration

### 4.1 Update OAuth Redirect URLs

**Supabase Dashboard → Authentication → URL Configuration**

#### Site URL:
```
https://your-app.vercel.app
```

#### Redirect URLs (Add these):
```
https://your-app.vercel.app/auth/callback
https://your-app.vercel.app/auth/**
https://*.vercel.app/auth/callback
https://*.vercel.app/auth/**
```

The wildcard `*` allows preview deployments to work.

#### Additional Redirect URLs (keep these for local dev):
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/**
```

### 4.2 Update Google OAuth Configuration

**Google Cloud Console → APIs & Services → Credentials**

Add to **Authorized redirect URIs**:
```
https://your-project.supabase.co/auth/v1/callback
```

Add to **Authorized JavaScript origins**:
```
https://your-app.vercel.app
```

---

## Step 5: Deploy!

### 5.1 Initial Deployment

Click **"Deploy"** in Vercel.

Wait 2-3 minutes for build to complete.

### 5.2 Get Your Production URL

After deployment, you'll get:
```
https://your-app.vercel.app
```

### 5.3 Update Environment Variable

**IMPORTANT:** Now update the environment variable:

1. Vercel Dashboard → Settings → Environment Variables
2. Edit `NEXT_PUBLIC_APP_URL`
3. Set to: `https://your-actual-domain.vercel.app`
4. Click **"Save"**
5. **Redeploy** (Deployments → ⋮ → Redeploy)

---

## Step 6: Verify Deployment

### 6.1 Test Landing Page

Visit: `https://your-app.vercel.app`

Should see the landing page.

### 6.2 Test Login

1. Go to: `https://your-app.vercel.app/auth/login`
2. Click "Sign in with Google"
3. Should redirect to Google OAuth
4. After login, should redirect back to your app

### 6.3 Test Admin Access

1. Make sure your email is set as admin in Supabase
2. Sign in
3. Should land on `/admin` dashboard

### 6.4 Test Invitation System

1. As admin, generate an invitation link
2. Check the link shows your Vercel domain:
   ```
   https://your-app.vercel.app/auth/accept-invite?token=...
   ```
3. Open in incognito
4. Accept invitation
5. Complete sign in
6. ✅ Should work!

---

## Step 7: Set Up Admin User

### 7.1 Via Supabase SQL Editor

Run this SQL to make your email an admin:

```sql
-- Update your email to admin role
UPDATE public.profiles 
SET 
  role = 'admin',
  status = 'active'
WHERE email = 'your-email@gmail.com';

-- If profile doesn't exist yet, sign in first, then run:
-- Verify it worked
SELECT email, role, status 
FROM public.profiles 
WHERE email = 'your-email@gmail.com';
```

---

## Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain

**Vercel Dashboard → Settings → Domains**

1. Click **"Add"**
2. Enter your domain: `kanban.yourdomain.com`
3. Follow DNS setup instructions

### 8.2 Update Environment Variables

After custom domain is active:

```bash
NEXT_PUBLIC_APP_URL=https://kanban.yourdomain.com
```

**Redeploy** after changing.

### 8.3 Update Supabase

Add custom domain to Supabase redirect URLs:
```
https://kanban.yourdomain.com/auth/callback
https://kanban.yourdomain.com/auth/**
```

---

## Troubleshooting

### Issue: OAuth redirects to wrong URL

**Cause:** Environment variable not set or outdated

**Fix:**
1. Verify `NEXT_PUBLIC_APP_URL` in Vercel settings
2. Should match your actual Vercel domain
3. Redeploy after changes

### Issue: "Not invited" error for admin

**Cause:** Profile not created or role not set

**Fix:**
```sql
-- Run in Supabase SQL Editor
INSERT INTO public.profiles (id, email, role, status)
SELECT 
  id,
  email,
  'admin',
  'active'
FROM auth.users 
WHERE email = 'your-email@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin', status = 'active';
```

### Issue: Build fails on Vercel

**Cause:** Linter errors or missing dependencies

**Fix:**
```bash
# Locally, check for errors
npm run build

# If successful locally, commit and push
git add .
git commit -m "Fix build errors"
git push
```

### Issue: Environment variables not loading

**Cause:** Need redeploy after env var changes

**Fix:**
1. Vercel Dashboard → Deployments
2. Latest deployment → ⋮ (three dots)
3. Click **"Redeploy"**

### Issue: Invitation links show localhost

**Cause:** `NEXT_PUBLIC_APP_URL` not set correctly

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. Check `NEXT_PUBLIC_APP_URL`
3. Should be: `https://your-app.vercel.app`
4. **Not:** `http://localhost:3000`
5. Save and redeploy

---

## Performance Optimization

### Enable Caching

Vercel automatically handles caching, but you can optimize:

**In `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Already configured, no changes needed
}

module.exports = nextConfig
```

### Monitor Performance

1. Vercel Dashboard → Analytics
2. Check page load times
3. Monitor Core Web Vitals

---

## Security Checklist

- [ ] `SUPABASE_SERVICE_ROLE_KEY` set as environment variable (never in code)
- [ ] `.env*.local` in `.gitignore`
- [ ] Supabase RLS policies enabled
- [ ] OAuth redirect URLs restricted to your domains
- [ ] Admin user set up correctly
- [ ] Test invite-only access works

---

## Deployment Checklist

**Before deploying:**
- [ ] Code pushed to GitHub
- [ ] `.gitignore` configured
- [ ] Environment variables ready

**During deployment:**
- [ ] Project imported to Vercel
- [ ] Environment variables set
- [ ] Build succeeds

**After deployment:**
- [ ] Update `NEXT_PUBLIC_APP_URL` with actual URL
- [ ] Redeploy with updated URL
- [ ] Update Supabase redirect URLs
- [ ] Set up admin user
- [ ] Test login flow
- [ ] Test invitation system

---

## Continuous Deployment

Vercel automatically deploys on every push to main:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Deploys to production
# 4. Updates URL
```

**Preview Deployments:**
- Every PR gets a preview URL
- Test before merging to main

---

## Monitoring & Logs

### View Logs

**Vercel Dashboard → Deployments → [Your deployment] → Logs**

Or use CLI:
```bash
npx vercel logs
```

### Check Build Logs

If build fails, check:
1. Deployments → Failed deployment
2. Click to see full logs
3. Fix errors locally
4. Push and redeploy

---

## Cost & Limits

### Vercel Free Tier:
- ✅ 100GB bandwidth/month
- ✅ Unlimited personal projects
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics

### Supabase Free Tier:
- ✅ 500MB database
- ✅ 2GB file storage
- ✅ 50,000 monthly active users
- ✅ Social OAuth

Perfect for small teams and side projects!

---

## Summary

**Quick Deploy Steps:**
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Update `NEXT_PUBLIC_APP_URL` with Vercel URL
6. Update Supabase redirect URLs
7. Redeploy
8. Set up admin user
9. Test everything
10. ✅ Done!

**Your app will be live at:** `https://your-app.vercel.app`

🎉 Congratulations on deploying! 🎉

