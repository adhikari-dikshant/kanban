import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Kanban } from 'lucide-react';

export default async function Home() {
    const supabase = await createClient();

    // Server-side auth check
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // If user is authenticated, redirect based on role
    if (user) {
        const role = user.user_metadata?.role || 'user';

        if (role === 'admin') {
            redirect('/admin');
        } else {
            redirect('/user');
        }
    }

    // If not authenticated, redirect to login
    redirect('/auth/login');
}
