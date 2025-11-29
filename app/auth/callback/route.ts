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
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser()

            if (!user || !user.email) {
                // No user found or no email - redirect to error
                return NextResponse.redirect(`${origin}/auth/auth-code-error`)
            }

            // Check if user has a role already set in metadata
            const role = user.user_metadata?.role as 'admin' | 'user' | undefined

            // If role is not set, redirect to role selection
            if (!role) {
                return NextResponse.redirect(`${origin}/auth/select-role`)
            }

            // Check if user has a profile (which means they were invited)
            const { data: profile } = await supabase
                .from('profiles')
                .select('role, status')
                .eq('id', user.id)
                .single()

            // If no profile exists, create one with the selected role
            if (!profile) {
                const { error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        id: user.id,
                        email: user.email,
                        role,
                        status: 'active',
                    })

                if (createError) {
                    console.error('Error creating profile:', createError)
                    // Continue anyway, as the profile might be created by a trigger
                }
            } else if (profile.status !== 'active') {
                // Check if profile is inactive or suspended
                await supabase.auth.signOut()
                return NextResponse.redirect(`${origin}/auth/access-denied?reason=inactive`)
            }

            // User has a role - redirect based on role
            const redirectPath = role === 'admin' ? '/admin' : '/user'

            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
