# Quick Deployment to Vercel ⚡

## 5-Minute Deploy

### 1. Push to GitHub (if not already)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click "Deploy" (don't add env vars yet)

### 3. Add Environment Variables

**After first deployment**, go to:
**Project Settings → Environment Variables**

Add these 4 variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Get Supabase keys from:**
Supabase Dashboard → Settings → API

### 4. Redeploy

**Deployments → ⋮ → Redeploy**

### 5. Update Supabase

**Supabase Dashboard → Authentication → URL Configuration**

Add to **Redirect URLs:**
```
https://your-app.vercel.app/auth/callback
https://your-app.vercel.app/auth/**
```

### 6. Set Admin User

**Supabase SQL Editor:**

```sql
UPDATE public.profiles 
SET role = 'admin', status = 'active'
WHERE email = 'your-email@gmail.com';
```

### 7. Test!

1. Visit: `https://your-app.vercel.app`
2. Sign in with Google
3. Generate invitation
4. ✅ Done!

---

## Need Help?

See `VERCEL_DEPLOYMENT_GUIDE.md` for detailed instructions.

