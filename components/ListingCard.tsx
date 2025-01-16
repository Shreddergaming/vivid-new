'use client'

import { memo } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useToast } from "@/components/ui/use-toast"

interface ListingCardProps {
    listing: {
        _id: string
        id: string
        title: string
        description: string
        price: number
        photos?: string[]
        location: string
        basePrice?: number
    }
    onToggleFavorite?: () => void
    isFavorite?: boolean
}

export const ListingCard = memo(function ListingCard({
    listing,
    onToggleFavorite,
    isFavorite = false
}: ListingCardProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const { toast } = useToast()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [favorited, setFavorited] = useState(isFavorite)

    const images = listing.photos || []
    const price = listing.price || listing.basePrice || 0

    const handleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!session) {
            toast({
                title: "Please login",
                description: "You need to be logged in to save favorites",
            })
            return
        }

        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId: listing.id })
            })

            if (response.ok) {
                setFavorited(!favorited)
                if (onToggleFavorite) onToggleFavorite()
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
        }
    }

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        )
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        )
    }

    return (
        <Card
            className="group cursor-pointer w-full"
            onClick={() => {
                console.log('Clicking listing with ID:', listing.id, listing._id);
                router.push(`/rentals/${listing._id || listing.id}`)
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-square">
                {images.length > 0 ? (
                    <Image
                        src={images[currentImageIndex]}
                        alt={listing.title}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                    </div>
                )}

                {/* Image Navigation */}
                {isHovered && images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </>
                )}

                {/* Favorite Button */}
                <button
                    onClick={handleFavorite}
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full transition-colors hover:bg-white"
                >
                    <Heart
                        className={`h-4 w-4 ${favorited ? 'fill-red-500 stroke-red-500' : 'stroke-gray-600'}`}
                    />
                </button>

                {/* Image Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3">
                <h3 className="font-semibold text-sm truncate">{listing.title}</h3>
                <p className="text-xs text-gray-600 truncate">{listing.location}</p>
                <p className="text-sm mt-1">
                    <span className="font-semibold">${price}</span> / night
                </p>
            </div>
        </Card>
    )
})