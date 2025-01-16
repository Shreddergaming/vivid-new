'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import clientPromise from '@/lib/mongodb'
import { signOut } from 'next-auth/react'

export function Navigation() {
    const { user } = useAuth()
    const [hasRentals, setHasRentals] = useState(false)

    useEffect(() => {
        const checkUserRentals = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`/api/rentals?userId=${user.id}`)
                    const rentals = await response.json()
                    setHasRentals(rentals.length > 0)
                } catch (error) {
                    console.error('Error checking rentals:', error)
                }
            }
        }

        checkUserRentals()
    }, [user])

    return (
        <nav>
            <div className="dropdown-menu">
                <Link href="/add-rental">List Your Property</Link>

                {/* Always show these links regardless of auth state */}
                <Link href="/favorites">Favorites</Link>
                <Link href="/trips">My Trips</Link>

                {/* Only show Manage Rentals if user has rentals */}
                {user && hasRentals && (
                    <Link href="/manage-rentals">Manage Rentals</Link>
                )}

                {/* Auth links */}
                {user ? (
                    <button onClick={() => signOut()}>Log out</button>
                ) : (
                    <>
                        <Link href="/login">Log in</Link>
                        <Link href="/signup">Sign up</Link>
                    </>
                )}
            </div>
        </nav>
    )
} 