'use client'

import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/AuthContext'

export default function ClientRoot({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <AuthProvider>
                <main className="min-h-screen bg-white">
                    <div className="max-w-[2520px] mx-auto">
                        {children}
                    </div>
                </main>
            </AuthProvider>
        </SessionProvider>
    )
} 