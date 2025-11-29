'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Kanban, Users, Shield } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

/**
 * Role Selection Page
 * Shown to users after first OAuth login to set their role
 */
export default function SelectRolePage() {
    const router = useRouter();
    const [role, setRole] = useState<'user' | 'admin'>('user');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    // Check if user already has a role set
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();

                if (!currentUser) {
                    // No session found, redirect to login
                    router.push('/auth/login');
                    return;
                }

                if (currentUser.user_metadata?.role) {
                    // User already has a role, redirect to appropriate dashboard
                    if (currentUser.user_metadata.role === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/user');
                    }
                }
            } catch (error) {
                console.error('Error checking user role:', error);
            }
        };

        checkUserRole();
    }, [supabase, router]);

    const handleSetRole = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get current user
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            if (!currentUser) {
                setError('No user session found');
                setIsLoading(false);
                return;
            }

            // Update user metadata with selected role
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    role: role,
                }
            });

            if (updateError) {
                throw updateError;
            }

            // Small delay to ensure metadata is updated
            await new Promise(resolve => setTimeout(resolve, 500));

            // Redirect based on selected role
            if (role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/user');
            }
        } catch (err) {
            console.error('Error setting role:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to set role';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
                    {/* Logo & Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 mb-4">
                            <Kanban className="w-7 h-7 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Welcome!
                        </h1>
                        <p className="text-slate-600 text-sm">Choose your role to continue</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-900 mb-3">Select Your Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                disabled={isLoading}
                                className={`p-4 rounded-lg border-2 font-medium transition-all flex flex-col items-center gap-2 ${role === 'user'
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-slate-100'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Users className="w-5 h-5" />
                                <span className="text-xs md:text-sm">User</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                disabled={isLoading}
                                className={`p-4 rounded-lg border-2 font-medium transition-all flex flex-col items-center gap-2 ${role === 'admin'
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-slate-100'
                                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Shield className="w-5 h-5" />
                                <span className="text-xs md:text-sm">Admin</span>
                            </button>
                        </div>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleSetRole}
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Setting up...</span>
                            </>
                        ) : (
                            <span>Continue</span>
                        )}
                    </button>

                    {/* Role Info Card */}
                    <div className="mt-7 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                        {role === 'user' ? (
                            <div className="flex gap-3">
                                <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">User Mode</p>
                                    <p className="text-slate-600 text-xs">Create and manage your own kanban boards. Admins can view your progress.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Admin Mode</p>
                                    <p className="text-slate-600 text-xs">Manage users and view all kanban boards. You have full control and visibility.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
