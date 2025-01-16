'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ListingCard from '@/components/ListingCard'
import SearchInterface from '@/components/SearchInterface'
import { useToast } from "@/components/ui/use-toast"
import { Listing } from '@/types'
import { SearchHeader } from "@/components/SearchHeader"

export default function ListingsPage() {
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [listingsState, setListingsState] = useState<Listing[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const response = await fetch('/api/favorites')
                if (response.ok) {
                    const data = await response.json()
                    setFavorites(new Set(data.map((fav: any) => fav.rentalId)))
                }
            } catch (error) {
                console.error('Error loading favorites:', error)
            }
        }

        loadFavorites()
    }, [])

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true)
            try {
                const response = await fetch(
                    `/api/rentals?${searchParams?.toString() || ''}`
                )
                if (response.ok) {
                    const data = await response.json()
                    setListingsState(data)
                }
            } catch (error) {
                console.error('Error fetching listings:', error)
                toast({
                    title: "Error",
                    description: "Failed to load listings",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchListings()
    }, [searchParams, toast])

    const toggleFavorite = async (id: string) => {
        try {
            if (favorites.has(id)) {
                const response = await fetch(`/api/favorites?rentalId=${id}`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    setFavorites(prev => {
                        const newFavorites = new Set(prev)
                        newFavorites.delete(id)
                        return newFavorites
                    })
                }
            } else {
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ rentalId: id })
                })
                if (response.ok) {
                    setFavorites(prev => {
                        const newFavorites = new Set(prev)
                        newFavorites.add(id)
                        return newFavorites
                    })
                }
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update favorites",
                variant: "destructive",
            })
        }
    }

    const handleSearch = (newSearchParams: URLSearchParams) => {
        router.push(`/rentals?${newSearchParams.toString()}`)
    }

    return (
        <main className="flex min-h-screen flex-col">
            <SearchHeader />
            <div className="container mx-auto px-4 pt-24 pb-8">
                <h1 className="text-3xl font-bold mb-6">Listings</h1>
                <SearchInterface onSearch={handleSearch} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {listingsState.map((listing: Listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            isFavorite={favorites.has(listing.id)}
                            onToggleFavorite={() => toggleFavorite(listing.id)}
                        />
                    ))}
                </div>
                {listingsState.length === 0 && (
                    <p className="text-center mt-6">No listings found matching your criteria.</p>
                )}
            </div>
        </main>
    )
}