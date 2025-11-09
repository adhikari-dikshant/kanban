import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Sign Out Route Handler
 * Handles user logout and clears the session cookies
 */
export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out the user
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // Redirect to login page
  return NextResponse.redirect(new URL('/auth/login', request.url))
}
