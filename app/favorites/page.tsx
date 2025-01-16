'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ListingCard from '@/components/ListingCard'

export default function FavoritesPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!session?.user) {
            router.push('/login')
            return
        }

        const fetchFavorites = async () => {
            try {
                const response = await fetch('/api/favorites')
                if (response.ok) {
                    const data = await response.json()
                    setFavorites(data)
                }
            } catch (error) {
                console.error('Error fetching favorites:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [session, router])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favorites.map((listing: any) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            isFavorite={true}
                            onToggleFavorite={() => {
                                // Remove from favorites list
                                setFavorites(favorites.filter((fav: any) => fav.id !== listing.id))
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500">
                    <p>No favorites yet</p>
                </div>
            )}
        </div>
    )
}