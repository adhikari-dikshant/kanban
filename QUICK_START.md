# Quick Start Guide

Get your Kanban app running with Supabase Google Auth in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies (Already Done ✓)
```bash
npm install
```

### 2. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Wait ~2 minutes for provisioning

### 3. Get Credentials
1. In Supabase Dashboard → Settings → API
2. Copy:
   - **Project URL**
   - **anon public key**

### 4. Update Environment Variables
Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Configure Google OAuth

#### A. Create Google OAuth App
1. [console.cloud.google.com](https://console.cloud.google.com)
2. New Project → "Kanban Board"
3. APIs & Services → OAuth consent screen → External
4. Fill required fields → Save
5. Credentials → Create OAuth Client ID → Web application
6. Add redirect URI:
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```
7. Copy Client ID and Client Secret

#### B. Add to Supabase
1. Supabase Dashboard → Authentication → Providers
2. Enable "Google"
3. Paste Client ID and Secret
4. Save

### 6. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Test Authentication

1. Click "Continue with Google"
2. Select role (User or Admin)
3. Sign in with Google
4. You should see your dashboard!

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Supabase credentials |
| `utils/supabase/client.ts` | Browser client |
| `utils/supabase/server.ts` | Server client |
| `middleware.ts` | Token refresh |
| `app/auth/callback/route.ts` | OAuth handler |
| `app/auth/login/page.tsx` | Login page |

## 🔒 Route Protection

Routes are protected server-side:
- `/` → Redirects based on auth status
- `/auth/login` → Login page
- `/user` → User dashboard (requires auth)
- `/admin` → Admin dashboard (requires admin role)

## 🛠️ Troubleshooting

### "redirect_uri_mismatch"
- Check Google redirect URI matches Supabase callback URL exactly

### "Invalid credentials"
- Verify `.env.local` has correct values
- Restart dev server after changes

### Not redirecting after login
- Check browser console for errors
- Verify Google OAuth is enabled in Supabase

## 📚 Documentation

- **Full Setup Guide**: `SUPABASE_SETUP.md`
- **Implementation Details**: `IMPLEMENTATION_SUMMARY.md`

## 🎯 Next Steps

- [ ] Test login flow
- [ ] Test role-based access
- [ ] Test logout
- [ ] Add production domain to Google/Supabase
- [ ] Deploy to production

## 💡 Tips

- Use Chrome DevTools → Application → Cookies to inspect session
- Check Supabase Dashboard → Logs for auth events
- First-time users see role selection page
- Roles stored in `user_metadata.role`

---

**Need help?** Check `SUPABASE_SETUP.md` for detailed troubleshooting.
