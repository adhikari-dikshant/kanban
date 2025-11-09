# Invite-Only System Setup Guide

This guide explains how to set up and use the invite-only authentication system that has been integrated into your Kanban application.


# Supabase Setup Checklist
## 1. Create a Supabase Project (5 minutes)
Go to https://supabase.com
Sign up or log in
Click "New Project"
Fill in:
Name: kanban-board (or whatever you prefer)
Database Password: Generate a secure password (save it somewhere safe)
Region: Choose the one closest to you
Click "Create new project"
Wait ~2 minutes for it to provision
2. Get Your API Credentials (1 minute)
In your Supabase project dashboard, click the ⚙️ Settings icon (bottom left sidebar)
Go to API section
You'll see two important values:
Project URL - looks like https://abcdefghijk.supabase.co
anon public key - a long JWT token starting with eyJhbGc...
Copy both of these
Put them in your .env.local file:
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

3. Enable Google OAuth Provider (2 minutes)
In Supabase dashboard, go to Authentication (left sidebar)
Click Providers
Find Google in the list
Click to expand it
Toggle the switch to Enable
Don't save yet! You need Google credentials first...
4. Get Google OAuth Credentials (5 minutes)
A. Create Google Cloud Project
Go to https://console.cloud.google.com
Click project dropdown (top) → New Project
Name: Kanban Board
Click Create

B. Configure OAuth Consent Screen
Left sidebar: APIs & Services → OAuth consent screen
Choose External (unless you have Google Workspace)
Click Create
Fill in:
App name: Kanban Board
User support email: Your email
Developer contact email: Your email
Click Save and Continue (skip scopes, just keep clicking through)
C. Create OAuth Client
Left sidebar: APIs & Services → Credentials
Click + Create Credentials → OAuth client ID
Application type: Web application
Name: Kanban Board Web Client
Authorized redirect URIs - Click + Add URI and paste:
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
⚠️ IMPORTANT: Replace YOUR-PROJECT-ID with your actual Supabase project ID from step 2 Example: If your URL is https://abcdefghijk.supabase.co, then use:
https://abcdefghijk.supabase.co/auth/v1/callback
Click Create
Copy the Client ID and Client Secret that appear

5. Add Google Credentials to Supabase (1 minute)
Go back to Supabase dashboard → Authentication → Providers → Google
Paste:
Client ID (from Google)
Client Secret (from Google)
Click Save
6. Configure Redirect URLs (1 minute)
Still in Supabase, go to Authentication → URL Configuration
Under Redirect URLs, add:
http://localhost:3000/**
Click Save


# Phase 1: Supabase Configuration
## 1.1 Disable Public Signups
In Supabase Dashboard → Authentication → Settings
Toggle OFF "Allow new users to sign up"
This prevents unauthorized Google OAuth signups
## 1.2 Create Database Schema Create two new tables in Supabase SQL Editor: Table 1: profiles - Extended user information
Links to auth.users via user ID
Stores role (user/admin), status, invitation timestamps
Automatically created when user accepts invite (via trigger)
Table 2: invitations - Track all sent invitations
Stores email, invited_by, status (pending/accepted/expired)
Has expiration date (default 30 days)
Allows admins to resend or revoke invitations
### 1.3 Set Up Row Level Security (RLS)
Enable RLS on both tables
Admins can: view all, create invitations, update/delete invitations
Users can: view only their own profile
Non-invited users: cannot access anything
### 1.4 Create Database Trigger
Auto-create profile when user accepts invitation
Copies metadata from auth.users to profiles table
Sets initial role based on invitation dat

## 🎯 What's Been Implemented

Your app now has an **invite-only** authentication system where:
- ✅ Only admins can invite new users
- ✅ Regular users cannot sign up without an invitation
- ✅ Google OAuth is still used, but requires an invitation first
- ✅ User roles (user/admin) are determined by the invitation
- ✅ Non-invited users are blocked at the OAuth callback

---

## 📋 Implementation Checklist

### Phase 1: Database Setup (Required)

**1. Run the database migrations in Supabase:**

Go to your Supabase Dashboard → SQL Editor and run these files **in order**:

```sql
-- 1. First, run: supabase/migrations/001_create_profiles_table.sql
-- This creates the profiles table with RLS policies

-- 2. Then, run: supabase/migrations/002_create_invitations_table.sql
-- This creates the invitations table

-- 3. Finally, run: supabase/migrations/003_create_triggers.sql
-- This creates triggers to auto-create profiles when users sign up
```

**How to run:**
1. Open each `.sql` file
2. Copy the entire content
3. Paste into Supabase SQL Editor
4. Click "Run"
5. Verify no errors appear

### Phase 2: Environment Variables (Required)

**Add your Service Role Key:**

1. Go to Supabase Dashboard → Settings → API
2. Copy the `service_role` key (⚠️ Keep this secret!)
3. Add to your `.env.local`:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-key-here
```

4. Restart your dev server: `npm run dev`

### Phase 3: Make Yourself the First Admin (Critical!)

**Run this SQL in Supabase to make your account an admin:**

```sql
-- Replace 'your-email@gmail.com' with your actual Google email
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

**Important:** This gives YOUR Google account admin privileges so you can invite others!

### Phase 4: Disable Public Signups in Supabase (Required)

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Scroll to **"User Signups"**
3. **Toggle OFF** "Enable email signups"
4. **Toggle OFF** "Enable phone signups"
5. Leave Google OAuth **enabled**
6. Click **Save**

This prevents anyone from signing up without an invitation!

---

## 🚀 How to Use the System

### As an Admin

**1. Invite a New User**

Option A: Using the API (for now, until UI is built):

```bash
curl -X POST http://localhost:3000/api/admin/invite \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "email": "user@example.com",
    "role": "user",
    "message": "Welcome to the team!"
  }'
```

Option B: Build the admin UI (files provided but not yet integrated):
- `components/admin/InviteUserForm.tsx` - Ready to use
- Just import and add to your admin dashboard

**2. View All Invitations**

```bash
curl http://localhost:3000/api/admin/invitations \
  -H "Cookie: your-session-cookie"
```

**3. Revoke an Invitation**

```bash
curl -X DELETE http://localhost:3000/api/admin/invitations/{invitation-id} \
  -H "Cookie: your-session-cookie"
```

### As a New User

1. Admin sends you an invitation to your email
2. You receive an email from Supabase with a magic link
3. Click the link → redirected to Google OAuth
4. Sign in with Google
5. Your account is created with the role specified in the invitation
6. Access the appropriate dashboard (user or admin)

### As a Non-Invited User

1. Try to sign in with Google OAuth
2. OAuth completes successfully
3. Callback handler checks for invitation
4. **No invitation found** → Sign out + redirect to "Access Denied" page
5. Message explains: "Invitation Required"

---

## 🔒 Security Features

### What's Protected

✅ **Server-side verification** - Invitation check happens on the server (cannot be bypassed)
✅ **RLS policies** - Database enforces who can create/view invitations
✅ **Role enforcement** - Roles set by admin, not user-selectable
✅ **Status checks** - Inactive/suspended users blocked
✅ **OAuth + Invitations** - Both are required for access

### What Happens on Login

```
User clicks "Sign in with Google"
  ↓
Google OAuth (successful)
  ↓
Callback handler runs
  ↓
Check: Does user have a profile?
  ├─ NO → Check: Valid invitation exists?
  │   ├─ YES → Create profile (via trigger)
  │   └─ NO → Sign out + "Access Denied"
  └─ YES → Check: Status = active?
      ├─ YES → Redirect to dashboard
      └─ NO → Sign out + "Access Denied"
```

---

## 📁 New Files Created

### Database Schema
- `supabase/migrations/001_create_profiles_table.sql`
- `supabase/migrations/002_create_invitations_table.sql`
- `supabase/migrations/003_create_triggers.sql`

### Utilities
- `utils/supabase/admin.ts` - Service role client (⚠️ Server-side only!)

### API Endpoints
- `app/api/admin/invite/route.ts` - Send invitations
- `app/api/admin/invitations/route.ts` - List invitations
- `app/api/admin/invitations/[id]/route.ts` - Revoke/resend invitations

### Pages
- `app/auth/access-denied/page.tsx` - Shown to non-invited users
- `app/auth/set-password/page.tsx` - (Not yet implemented)

### Modified Files
- `app/auth/login/page.tsx` - Added "invite-only" notice
- `app/auth/callback/route.ts` - Verifies invitation before allowing access
- `.env.local` - Added SUPABASE_SERVICE_ROLE_KEY

---

## 🧪 Testing the System

### Test 1: Admin Can Invite

1. Log in as admin (your account)
2. Call the invite API with a test email
3. Check the email inbox for invitation
4. Verify invitation appears in Supabase `invitations` table

### Test 2: Invited User Can Access

1. Have someone click the invitation link
2. They sign in with Google
3. They get redirected to the app
4. Their profile is created in `profiles` table
5. Invitation status changes to "accepted"

### Test 3: Non-Invited User is Blocked

1. Try logging in with a Google account that wasn't invited
2. Google OAuth succeeds
3. Callback handler checks for invitation
4. No invitation found → Redirected to "Access Denied"
5. User cannot access the app

### Test 4: Role-Based Access Works

1. Invite a user with role "user"
2. They log in → Redirected to `/user` dashboard
3. Try accessing `/admin` → Blocked by server-side layout
4. Invite another user with role "admin"
5. They log in → Can access `/admin`

---

## 🛠️ Troubleshooting

### "Service role key is missing"

**Fix:**
1. Get key from Supabase Dashboard → Settings → API
2. Add to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY=...`
3. Restart server: `npm run dev`

### "Cannot read profiles table"

**Fix:**
1. Run database migrations in order (001, 002, 003)
2. Verify tables exist in Supabase Table Editor
3. Check RLS policies are enabled

### "I'm not an admin"

**Fix:**
Run the SQL from Phase 3 with your actual email address to make yourself admin.

### "Invitation email not received"

**Fix:**
1. Check Supabase email settings (Authentication → Email Templates)
2. Verify SMTP is configured or use Supabase's default sender
3. Check spam folder
4. Test with a different email provider

### "Access Denied" even though I was invited

**Fix:**
1. Check `invitations` table - is your email there with status "pending"?
2. Check `profiles` table - does a profile exist for your user ID?
3. Run the trigger manually: Re-invite the user
4. Check browser console for errors

---

## 📊 Database Schema Reference

### `profiles` table
```sql
id               UUID (PK, FK to auth.users)
email            TEXT
first_name       TEXT
last_name        TEXT
role             TEXT (user|admin)
invited_at       TIMESTAMPTZ
confirmed_at     TIMESTAMPTZ
last_sign_in_at  TIMESTAMPTZ
status           TEXT (active|inactive|suspended)
created_at       TIMESTAMPTZ
updated_at       TIMESTAMPTZ
```

### `invitations` table
```sql
id          UUID (PK)
email       TEXT
invited_by  UUID (FK to auth.users)
invited_at  TIMESTAMPTZ
accepted_at TIMESTAMPTZ
status      TEXT (pending|accepted|expired|revoked)
expires_at  TIMESTAMPTZ
role        TEXT (user|admin)
message     TEXT
created_at  TIMESTAMPTZ
updated_at  TIMESTAMPTZ
```

---

## 🎨 Next Steps (Optional)

### Build Admin UI for Invitations

Components are ready in `components/admin/`:
- `InviteUserForm.tsx` - Form to invite users
- `InvitationsTable.tsx` - Manage invitations
- `UsersTable.tsx` - Manage users

Just import and add to `app/admin/page.tsx`

### Add Email Customization

Edit email templates in Supabase:
- Authentication → Email Templates → Invite user

### Set Up Invitation Expiry Cleanup

Create a Supabase Edge Function to run daily:
```sql
SELECT expire_old_invitations();
```

### Add Audit Logging

Track admin actions:
- Who invited whom
- When invitations were revoked
- Role changes

---

## ✅ Quick Start Checklist

- [ ] Run database migrations (001, 002, 003)
- [ ] Add SUPABASE_SERVICE_ROLE_KEY to `.env.local`
- [ ] Make yourself admin (run SQL from Phase 3)
- [ ] Disable public signups in Supabase Dashboard
- [ ] Test: Try logging in (should work as admin)
- [ ] Test: Invite a test user via API
- [ ] Test: Have test user accept invitation
- [ ] Test: Try logging in without invitation (should be blocked)

---

## 🆘 Need Help?

- Check the database tables in Supabase Table Editor
- View auth logs in Supabase Dashboard → Logs
- Check browser console for client-side errors
- Check terminal for server-side errors
- Verify RLS policies are enabled

---

**You're all set!** Your Kanban app is now invite-only. Only users you invite can access it.
