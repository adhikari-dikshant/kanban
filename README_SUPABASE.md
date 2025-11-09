# Kanban Board with Supabase Google OAuth

A production-ready Kanban board application with secure Google OAuth authentication powered by Supabase and Next.js 16 App Router.

## ✨ Features

### Authentication
- 🔐 **Google OAuth** - Secure sign-in with Google accounts
- 🛡️ **Server-Side Auth** - All authentication checks happen on the server
- 🔄 **Auto Token Refresh** - Sessions automatically renewed via middleware
- 🍪 **HTTP-Only Cookies** - Secure session storage (not accessible via JavaScript)
- 👥 **Role-Based Access** - User and Admin roles with different permissions

### Application
- 📋 **Kanban Boards** - Create and manage multiple boards
- 📝 **Task Cards** - Add, edit, and organize tasks
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ⚡ **Fast Performance** - Built with Next.js 16 and Turbopack

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Google account
- A Supabase account (free tier works)

### 1. Clone & Install
```bash
git clone <your-repo>
cd kanban
npm install
```

### 2. Set Up Supabase
Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

Quick version:
1. Create Supabase project
2. Get API credentials
3. Create `.env.local` with credentials
4. Configure Google OAuth in Supabase

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get up and running in 5 minutes
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed Supabase + Google OAuth setup
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical implementation details

## 🏗️ Project Structure

```
kanban/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Google OAuth login page
│   │   ├── callback/route.ts       # OAuth callback handler
│   │   ├── signout/route.ts        # Logout endpoint
│   │   ├── select-role/page.tsx    # Role selection for new users
│   │   └── auth-code-error/page.tsx # OAuth error page
│   ├── user/
│   │   ├── layout.tsx              # User dashboard layout (protected)
│   │   └── page.tsx                # User dashboard
│   ├── admin/
│   │   ├── layout.tsx              # Admin dashboard layout (protected)
│   │   └── page.tsx                # Admin dashboard
│   ├── layout.tsx                  # Root layout with AuthProvider
│   └── page.tsx                    # Home page (redirects)
├── components/
│   ├── Board.tsx                   # Kanban board component
│   ├── Card.tsx                    # Task card component
│   └── ui/                         # Shadcn UI components
├── lib/
│   ├── context/
│   │   └── AuthContext.tsx         # Authentication context
│   └── types/
│       └── index.ts                # TypeScript types
├── utils/
│   └── supabase/
│       ├── client.ts               # Browser Supabase client
│       └── server.ts               # Server Supabase client
├── middleware.ts                   # Token refresh middleware
└── .env.local                      # Environment variables (not in git)
```

## 🔒 Security Features

### Server-Side Authentication
- All auth checks happen on the server (cannot be bypassed)
- Routes protected with Server Components and Layouts
- Middleware automatically refreshes tokens

### Session Management
- Sessions stored in HTTP-only cookies
- Tokens automatically refreshed before expiration
- PKCE flow for OAuth (prevents code interception)

### Role-Based Access Control
- Users can only access `/user` dashboard
- Admins can access `/admin` dashboard
- Roles stored in Supabase (cannot be modified client-side)

## 🎯 User Flows

### First-Time Login
```
1. Visit app → Redirected to /auth/login
2. Select role (User or Admin)
3. Click "Continue with Google"
4. Authorize with Google
5. Redirected to dashboard
```

### Returning User
```
1. Visit app
2. Middleware checks session
3. Auto-redirected to appropriate dashboard
```

### Logout
```
1. Click "Logout" button
2. Server clears session
3. Redirected to login page
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login with Google works
- [ ] User role assignment works
- [ ] Admin can access admin dashboard
- [ ] User cannot access admin dashboard
- [ ] Logout clears session
- [ ] Session persists across tabs
- [ ] Token refresh happens automatically
- [ ] Unauthorized access redirects to login

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings > Environment Variables
```

### Other Platforms
Set these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Update redirect URLs in:
- Google Cloud Console (add production domain)
- Supabase Dashboard (add production domain)

## 📝 Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Get these from: Supabase Dashboard → Settings → API

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Auth**: Supabase Auth with Google OAuth
- **UI**: React 19, Tailwind CSS 4, Shadcn UI
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS with Radix UI primitives

## 📦 Key Dependencies

```json
{
  "@supabase/supabase-js": "Latest",
  "@supabase/ssr": "Latest",
  "next": "16.0.1",
  "react": "19.2.0"
}
```

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error
The redirect URI in Google Cloud Console doesn't match Supabase's callback URL.

**Fix**: Ensure Google redirect URI is exactly:
```
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
```

### "Invalid credentials" Error
Environment variables are missing or incorrect.

**Fix**:
1. Check `.env.local` has correct values
2. Restart dev server: `npm run dev`

### Build Errors
Placeholder environment variables cause build failures.

**Fix**: Replace placeholders in `.env.local` with real Supabase credentials

### More Issues?
See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) → Troubleshooting section

## 🔄 Migration from Old Auth

The old localStorage-based auth has been replaced with Supabase. Users will need to:
1. Re-authenticate with Google
2. Select their role again
3. Old boards/cards remain in localStorage (for now)

To migrate data to Supabase database:
- See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) → Data Migration

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://support.google.com/cloud/answer/6158849)
- [Next.js App Router Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Your License Here]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Auth powered by [Supabase](https://supabase.com)
- UI components from [Shadcn UI](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

**Questions?** Check the docs in this repo or open an issue!
