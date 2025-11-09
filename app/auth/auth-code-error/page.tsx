'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Kanban } from 'lucide-react';

/**
 * OAuth Error Page
 * Shown when the OAuth callback fails or authorization code is invalid
 */
export default function AuthCodeErrorPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10">
                    {/* Logo & Header */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-red-100 to-red-50 border border-red-200 mb-4">
                            <AlertCircle className="w-7 h-7 text-red-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Authentication Error
                        </h1>
                        <p className="text-slate-600 text-sm">Something went wrong during sign in</p>
                    </div>

                    {/* Error Message */}
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 font-medium mb-2">
                            Unable to complete authentication
                        </p>
                        <p className="text-xs text-red-700">
                            The authorization code from Google was invalid or expired. This can happen if you took too long to complete the sign-in process or if there was a network issue.
                        </p>
                    </div>

                    {/* Possible Causes */}
                    <div className="mb-8 space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900">Common causes:</h3>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400">•</span>
                                <span>The sign-in window was closed before completing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400">•</span>
                                <span>Network connection was interrupted</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400">•</span>
                                <span>Browser blocked the redirect</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400">•</span>
                                <span>Incorrect OAuth configuration</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Try Again
                        </button>

                        <button
                            onClick={() => router.push('/')}
                            className="w-full px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-all border border-slate-300"
                        >
                            Go to Home
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>Still having issues?</strong> Make sure your Supabase project is properly configured with Google OAuth credentials. Check the{' '}
                            <code className="bg-blue-100 px-1 py-0.5 rounded">SUPABASE_SETUP.md</code> file for detailed setup instructions.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    If this error persists, contact support
                </p>
            </div>
        </div>
    );
}
