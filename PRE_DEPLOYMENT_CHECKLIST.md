# Pre-Deployment Checklist ✅

Run through this checklist before deploying to Vercel.

---

## 1. Code Quality

### Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No linting errors

### Local Test
```bash
npm run dev
```
- [ ] App runs locally
- [ ] Login works
- [ ] Admin dashboard works
- [ ] Invitation system works

---

## 2. Environment Variables

### Check `.env.local` has all required variables:
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_APP_URL`

### Prepare for Vercel
Copy these values - you'll need them in Vercel:
```bash
cat .env.local
```

---

## 3. Supabase Setup

### Database Migrations
- [ ] All migrations run successfully
- [ ] Tables created: `profiles`, `invitations`
- [ ] Triggers working: `handle_new_user`, `set_invitation_token`

### Verify in SQL Editor:
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should show: profiles, invitations

-- Check columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'invitations' AND column_name = 'token';

-- Should return: token
```

### RLS Policies
- [ ] Row Level Security enabled on `profiles`
- [ ] Row Level Security enabled on `invitations`

### Admin User
- [ ] Your email has admin role in `profiles` table

```sql
SELECT email, role, status FROM public.profiles;
```

---

## 4. Git Repository

### Clean Working Directory
```bash
git status
```
- [ ] No uncommitted changes (or commit them)

### Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```
- [ ] Code pushed to GitHub
- [ ] Repository is accessible

### Verify .gitignore
- [ ] `.env*.local` in `.gitignore`
- [ ] `.env` in `.gitignore`
- [ ] `node_modules/` in `.gitignore`

---

## 5. Supabase API Keys

### Collect These Keys
Go to: **Supabase Dashboard → Settings → API**

Copy and save securely:
- [ ] Project URL
- [ ] anon public key
- [ ] service_role key (⚠️ Keep secret!)

---

## 6. Pre-Flight Test

### Test Complete Flow Locally

1. **Login as Admin:**
   - [ ] Can access `/admin`
   - [ ] Can see "Invite User" section

2. **Generate Invitation:**
   - [ ] Invitation link generated
   - [ ] Link shows `localhost:3000` domain (correct for dev)

3. **Accept Invitation (Incognito):**
   - [ ] Accept page loads
   - [ ] Shows "Invitation accepted!"
   - [ ] Redirects to login

4. **Complete OAuth:**
   - [ ] Google OAuth works
   - [ ] User lands in dashboard
   - [ ] Correct role applied

5. **Revisit Invitation Link:**
   - [ ] Shows "Already registered" message

---

## 7. Documentation Review

- [ ] Read `VERCEL_DEPLOYMENT_GUIDE.md`
- [ ] Understand deployment steps
- [ ] Know where to find Supabase keys
- [ ] Know how to update environment variables

---

## 8. Backup Current State

### Export Database Schema (Optional)
```bash
# If you have Supabase CLI
supabase db dump > backup_schema.sql
```

### Save Current Data (Optional)
In Supabase Dashboard:
- Table Editor → profiles → Export as CSV
- Table Editor → invitations → Export as CSV

---

## Ready to Deploy?

If all items are checked ✅, you're ready!

### Next Steps:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Follow `DEPLOYMENT_QUICK_START.md` or `VERCEL_DEPLOYMENT_GUIDE.md`

---

## Quick Reference

**Essential Files:**
- `VERCEL_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `DEPLOYMENT_QUICK_START.md` - 5-minute quick start
- `ENV_CONFIGURATION.md` - Environment variable details

**Need to Review:**
- [ ] Invitation flow works end-to-end
- [ ] Role-based access control works
- [ ] No console errors in browser
- [ ] Database triggers working

---

## Common Issues Before Deploy

### Issue: Build fails locally
```bash
npm run build
# Fix any errors shown
```

### Issue: Missing environment variables
```bash
# Check .env.local exists and has all 4 variables
cat .env.local
```

### Issue: Migrations not run
```sql
-- Run in Supabase SQL Editor
-- Check if token column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'invitations';
```

### Issue: Admin user not set
```sql
-- Set your email as admin
UPDATE public.profiles 
SET role = 'admin', status = 'active'
WHERE email = 'your-email@gmail.com';
```

---

## Final Checklist

Before clicking "Deploy" in Vercel:

- [ ] Build works locally
- [ ] All tests pass
- [ ] Database ready
- [ ] Admin user set up
- [ ] GitHub repo updated
- [ ] Environment variables ready
- [ ] Supabase keys accessible
- [ ] Deployment guide reviewed

**Ready? Let's deploy!** 🚀

See: `DEPLOYMENT_QUICK_START.md` for next steps.

