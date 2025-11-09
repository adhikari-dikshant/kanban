import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Admin Dashboard Layout with Server-Side Auth Protection
 * This layout wraps the admin dashboard and verifies authentication + admin role server-side
 */
export default async function AdminLayout({
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

  // Check if user has admin role
  const role = user.user_metadata?.role || 'user';

  // Redirect non-admins to user dashboard
  if (role !== 'admin') {
    redirect('/user');
  }

  // User is authenticated and has admin role, render the page
  return <>{children}</>;
}
