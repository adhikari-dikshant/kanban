import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * User Dashboard Layout with Server-Side Auth Protection
 * This layout wraps the user dashboard and verifies authentication server-side
 */
export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Server-side auth check - ALWAYS use getUser() not getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/auth/login');
  }

  // Check if user has the correct role (optional - if role is stored in metadata)
  const role = user.user_metadata?.role || 'user';

  // Redirect admins to admin dashboard
  if (role === 'admin') {
    redirect('/admin');
  }

  // User is authenticated and has user role, render the page
  return <>{children}</>;
}
