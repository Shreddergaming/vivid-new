'use client'

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react'
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react'

interface AuthContextType {
    user: any | null
    signIn: (provider?: string) => Promise<void>
    signOut: () => Promise<void>
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession()
    const [user, setUser] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        if (status === 'loading') {
            setIsLoading(true)
        } else {
            setIsLoading(false)
            setUser(session?.user || null)
        }
    }, [session, status])

    const signIn = useCallback(async (provider?: string) => {
        try {
            await nextAuthSignIn(provider)
        } catch (error) {
            console.error('Sign in error:', error)
        }
    }, [])

    const signOut = useCallback(async () => {
        try {
            await nextAuthSignOut()
            setUser(null)
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }, [])

    const value = {
        user,
        signIn,
        signOut,
        isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}