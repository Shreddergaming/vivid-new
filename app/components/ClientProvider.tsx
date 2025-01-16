'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '@/contexts/AuthContext'

interface ClientProviderProps {
    children: React.ReactNode
}

export function ClientProvider({ children }: ClientProviderProps) {
    return (
        <SessionProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </SessionProvider>
    )
}