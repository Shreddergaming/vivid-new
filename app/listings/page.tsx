'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ListingCard from '@/components/ListingCard'
import SearchInterface from '@/components/SearchInterface'
import { useToast } from "@/components/ui/use-toast"
import { Listing } from '@/types'
import { SearchHeader } from "@/components/SearchHeader"

// Mock data for initialListings (replace with actual data fetching logic)
const initialListings: Listing[] = [
    // Add some mock listings here
]

export default function ListingsPage() {
    const [favorites, setFavorites] = useState<Set<string>>(new Set())
    const [listings, setListings] = useState<Listing[]>(initialListings)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()

    useEffect(() => {
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites')
        if (savedFavorites) {
            setFavorites(new Set(JSON.parse(savedFavorites)))
        }
    }, [])

    useEffect(() => {
        // Fetch listings based on search params
        const filteredListings = initialListings.filter((listing: Listing) => {
            const destination = searchParams?.get('destination')?.toLowerCase() || ''
            const guests = searchParams?.get('guests') || ''
            const minPrice = searchParams?.get('minPrice') || ''
            const maxPrice = searchParams?.get('maxPrice') || ''

            return (!destination || listing.location.toLowerCase().includes(destination)) &&
                (!guests || listing.maxGuests >= parseInt(guests) || isNaN(parseInt(guests))) &&
                (!minPrice || listing.price >= parseInt(minPrice) || isNaN(parseInt(minPrice))) &&
                (!maxPrice || listing.price <= parseInt(maxPrice) || isNaN(parseInt(maxPrice)))
        })

        setListings(filteredListings)
    }, [searchParams])

    const handleSearch = (newSearchParams: URLSearchParams) => {
        router.push(`/listings?${newSearchParams.toString()}`)
    }

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev)
            if (newFavorites.has(id)) {
                newFavorites.delete(id)
            } else {
                newFavorites.add(id)
            }
            // Save to localStorage
            localStorage.setItem('favorites', JSON.stringify([...newFavorites]))
            return newFavorites
        })
        toast({
            title: 'Favorites updated',
            description: `Listing ${favorites.has(id) ? 'removed from' : 'added to'} favorites.`,
        })
    }

    return (
        <main className="flex min-h-screen flex-col">
            <SearchHeader />
            <div className="container mx-auto px-4 pt-24 pb-8">
                <h1 className="text-3xl font-bold mb-6">Listings</h1>
                <SearchInterface onSearch={handleSearch} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {listings.map((listing: Listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            isFavorite={favorites.has(listing.id)}
                            onToggleFavorite={() => toggleFavorite(listing.id)}
                        />
                    ))}
                </div>
                {listings.length === 0 && (
                    <p className="text-center mt-6">No listings found matching your criteria.</p>
                )}
            </div>
        </main>
    )
}