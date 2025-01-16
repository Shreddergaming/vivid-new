'use client'

import { createContext, useContext, ReactNode } from 'react'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextType {
    user: User | null
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false
})

export function AuthProvider({ children }: { children: ReactNode }) {
    // You can expand this with actual authentication logic later
    return (
        <AuthContext.Provider value={{ user: null, loading: false }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}