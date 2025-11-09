import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * OAuth Callback Route Handler
 * Handles the OAuth callback from Google and exchanges the authorization code for a session
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if there's a pending role stored (from login page)
      // Note: This will be read from cookie/storage on client-side
      // For server-side, we'll use a default role of 'user'
      // The client will update this via AuthContext after first login

      // Get the current user to update their metadata
      const { data: { user } } = await supabase.auth.getUser()

      // Only set role if not already set
      if (user && !user.user_metadata?.role) {
        await supabase.auth.updateUser({
          data: {
            role: 'user', // Default role, can be changed later
          }
        })
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
