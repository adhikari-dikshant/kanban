# Supabase Google Auth Setup Guide

This guide will walk you through setting up Supabase Google OAuth authentication for the Kanban application.

## Prerequisites

- A Google Cloud account
- A Supabase account (free tier works fine)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Fill in:
   - Project name: `kanban-board` (or your preferred name)
   - Database password: Generate a strong password
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the sidebar
2. Navigate to **API** section
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

4. Open `.env.local` file in your project root
5. Replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
```

## Step 3: Create Google OAuth Credentials

### 3.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click on the project dropdown (top left) and select "New Project"
3. Name it `Kanban Board Auth` (or your preferred name)
4. Click "Create"

### 3.2 Configure OAuth Consent Screen

1. In the left sidebar, navigate to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required fields:
   - App name: `Kanban Board`
   - User support email: Your email
   - Developer contact email: Your email
5. Click "Save and Continue"
6. Skip "Scopes" section (click "Save and Continue")
7. Add test users (your email) if in testing mode
8. Click "Save and Continue"

### 3.3 Create OAuth 2.0 Client ID

1. Navigate to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. Select **Application type**: Web application
4. Name it: `Kanban Board Web Client`
5. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```
6. Add **Authorized redirect URIs**:
   ```
   https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
   ```

   **Important**: Replace `YOUR-PROJECT-ID` with your actual Supabase project ID from the URL

7. Click "Create"
8. **Copy the Client ID and Client Secret** (you'll need these next)

## Step 4: Configure Google Provider in Supabase

1. Go back to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Find "Google" in the list and click to expand it
4. Enable the toggle switch
5. Paste your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
6. Click "Save"

## Step 5: Configure Redirect URLs in Supabase

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URLs to **Redirect URLs**:
   ```
   http://localhost:3000/**
   https://your-production-domain.com/**
   ```
3. Click "Save"

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. You should be redirected to the login page

4. Select a role (User or Admin)

5. Click "Continue with Google"

6. Sign in with your Google account

7. You should be redirected back to your application and authenticated!

## Troubleshooting

### "redirect_uri_mismatch" Error

This means your redirect URI in Google Cloud Console doesn't match Supabase's callback URL.

**Solution**:
- Double-check the redirect URI in Google Cloud Console
- It should be: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
- Make sure there are no trailing slashes or typos

### "Invalid credentials" Error

**Solution**:
- Verify your `.env.local` file has the correct Supabase URL and anon key
- Restart your dev server after changing `.env.local`
- Check that the Google Client ID and Secret are correctly entered in Supabase

### User gets logged in but role doesn't persist

**Solution**:
- On first login, users may need to select their role at `/auth/select-role`
- The role is stored in Supabase user metadata
- Clear your browser cookies and localStorage, then try logging in again

### "Access blocked: This app's request is invalid"

**Solution**:
- Make sure your OAuth consent screen is properly configured
- Add your email as a test user in Google Cloud Console
- Publish your app if you want it available to all users

## Production Deployment

When deploying to production:

1. Add your production domain to Google Cloud Console:
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`

2. Add your production domain to Supabase:
   - Authentication → URL Configuration → Redirect URLs
   - Add: `https://your-domain.com/**`

3. Update your environment variables in your hosting platform (Vercel, Netlify, etc.)

## Security Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (it's meant for client-side use)
- All sensitive operations are protected by Row Level Security (RLS) in Supabase
- Google OAuth uses PKCE flow for additional security

## Next Steps

- Set up Supabase database tables for storing boards and cards
- Implement Row Level Security (RLS) policies
- Add email verification
- Configure email templates in Supabase
- Add password reset functionality

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure both Google and Supabase configurations match exactly
