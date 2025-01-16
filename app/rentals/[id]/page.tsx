'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Star, ChevronDown, Wifi, Tv, Utensils, Car, Bath, Snowflake, MessageCircle, Sparkles, UtensilsCrossed, Waves, Laptop, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DateRangePicker } from "@/components/DateRangePicker"
import { GuestSelector } from "@/components/GuestSelector"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { ImageGallery } from "@/components/ImageGallery"
import { AmenitiesModal } from "@/components/AmenitiesModal"
import { LocationSection } from '@/components/LocationSection'
import { DatabaseService } from '@/lib/mongodb/utils'

interface Review {
    id: string
    userId: string
    userName: string
    userImage: string
    rating: number
    comment: string
    createdAt: Date
}

interface RatingStats {
    overall: number
    cleanliness: number
    accuracy: number
    checkIn: number
    communication: number
    location: number
    value: number
}

interface Host {
    id: string
    name: string
    image: string
    joinedDate: Date
}

interface Rental {
    id: string
    title: string
    description: string
    photos: string[]
    basePrice: number
    location: string
    bedrooms: number
    bathrooms: number
    guests: number
    amenities: string[]
    reviews?: Review[]
    averageRating?: number
    cleaningFee?: number
    serviceFee?: number
    host: {
        id: string
        name: string
        image: string
        joinedDate: Date
    }
    ratingStats?: RatingStats
    isNew?: boolean
    latitude: number
    longitude: number
    nearbyPlaces?: {
        type: string
        name: string
        distance: string
        walkingTime?: string
        coordinates?: {
            lat: number
            lng: number
        }
    }[]
}

const normalizeAmenityName = (name: string) => name.toLowerCase().replace(/\s+/g, '');

async function getRental(id: string) {
    try {
        const rental = await DatabaseService.getRentalById(id)
        if (!rental) {
            throw new Error('Rental not found')
        }
        return rental
    } catch (error) {
        console.error('Error fetching rental:', error)
        throw error
    }
}

export default function RentalPage({ params }: { params: { id: string } }) {
    const [rental, setRental] = useState<Rental | null>(null);
    const [loading, setLoading] = useState(true)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [showAllAmenities, setShowAllAmenities] = useState(false)
    const [checkIn, setCheckIn] = useState<Date | null>(null)
    const [checkOut, setCheckOut] = useState<Date | null>(null)
    const [guests, setGuests] = useState(1)
    const { data: session } = useSession()
    const [showAmenities, setShowAmenities] = useState(false)
    const [total, setTotal] = useState(0)
    const [nights, setNights] = useState(0)
    const [baseTotal, setBaseTotal] = useState(0)
    const [cleaningFee, setCleaningFee] = useState(0)
    const [serviceFee, setServiceFee] = useState(0)

    // Map of amenity names to icons
    const amenityIcons: Record<string, React.ReactNode> = {
        'wifi': <Wifi className="h-6 w-6" />,
        'tv': <Tv className="h-6 w-6" />,
        'kitchen': <UtensilsCrossed className="h-6 w-6" />,
        'washer': <Waves className="h-6 w-6" />,
        'parking': <Car className="h-6 w-6" />,
        'ac': <Snowflake className="h-6 w-6" />,
        'workspace': <Laptop className="h-6 w-6" />,
        'pool': <Waves className="h-6 w-6" />,
        'hottub': <Bath className="h-6 w-6" />,
        'patio': <Home className="h-6 w-6" />,
    }

    useEffect(() => {
        const fetchRental = async () => {
            try {
                if (!params?.id) return
                const response = await fetch(`/api/rentals/${params.id}`)
                if (!response.ok) return
                const data = await response.json()
                console.log('Fetched rental data:', data)
                setRental(data)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }
        if (params?.id) fetchRental()
    }, [params?.id])

    useEffect(() => {
        if (checkIn && checkOut) {
            const nightsCount = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
            const baseTotalAmount = nightsCount * (rental?.basePrice || 0)
            const cleaningFeeAmount = rental?.cleaningFee || 0
            const serviceFeeAmount = Math.floor(baseTotalAmount * 0.15)

            setNights(nightsCount)
            setBaseTotal(baseTotalAmount)
            setCleaningFee(cleaningFeeAmount)
            setServiceFee(serviceFeeAmount)
            setTotal(baseTotalAmount + cleaningFeeAmount + serviceFeeAmount)
        }
    }, [checkIn, checkOut, rental?.basePrice, rental?.cleaningFee])

    if (loading) return <div>Loading...</div>
    if (!rental) return <div>Rental not found</div>

    const truncatedDescription = rental.description.slice(0, 250) + '...'
    const displayedAmenities = showAllAmenities ? rental.amenities : rental.amenities.slice(0, 6)
    const handleMessageHost = () => {
        window.location.href = `/messages?host=${rental?.host.id}`
    }

    function normalizeAmenityName(amenity: string) {
        return amenity.toLowerCase()
            .replace(/\s+/g, '')
            .replace(/-/g, '')
    }

    console.log('Rental coordinates:', {
        latitude: rental?.latitude,
        longitude: rental?.longitude
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-4">{rental?.title}</h1>
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                    {rental?.isNew ? (
                        <>
                            <span className="font-medium">New</span>
                            <span>·</span>
                        </>
                    ) : (
                        <>
                            <Star className="h-4 w-4" />
                            <span>{rental.averageRating}</span>
                            <span>·</span>
                        </>
                    )}
                    <span className="underline">{rental.reviews?.length || 0} reviews</span>
                    <span>·</span>
                    <span>{rental.location}</span>
                </div>
            </div>

            {/* Photo Grid */}
            <ImageGallery images={rental.photos} title={rental.title} />

            <div className="grid grid-cols-3 gap-12">
                <div className="col-span-2">
                    {/* Host Info */}
                    <div className="flex justify-between items-start pb-6 border-b">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Entire home hosted by {rental.host?.name || 'Host'}
                            </h2>
                            <p className="text-gray-600">
                                {rental.guests} guests · {rental.bedrooms} bedrooms ·
                                {rental.bathrooms} baths
                            </p>
                        </div>
                        {rental.host?.image ? (
                            <Image
                                src={rental.host.image}
                                alt={rental.host?.name || 'Host'}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full" />
                        )}
                    </div>

                    {/* Description */}
                    <div className="py-6 border-b">
                        <div className={cn(
                            "text-gray-600 whitespace-pre-line",
                            !showFullDescription && "max-h-[250px] overflow-hidden relative"
                        )}>
                            {rental.description}
                            {!showFullDescription && rental.description.length > 250 && (
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                            )}
                        </div>
                        {rental.description.length > 250 && (
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="mt-4 font-semibold underline"
                            >
                                Show {showFullDescription ? 'less' : 'more'}
                            </button>
                        )}
                    </div>

                    {/* Amenities */}
                    <div className="py-6 border-b">
                        <h2 className="text-xl font-semibold mb-6">What this place offers</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {displayedAmenities.map((amenity) => (
                                <div key={amenity} className="flex items-center gap-3">
                                    <div className="text-gray-600">
                                        {amenityIcons[amenity.toLowerCase()] || <Sparkles className="h-6 w-6" />}
                                    </div>
                                    <span>{amenity}</span>
                                </div>
                            ))}
                        </div>
                        {rental.amenities.length > 6 && (
                            <Button
                                variant="outline"
                                className="mt-6 w-full"
                                onClick={() => setShowAmenities(true)}
                            >
                                Show all {rental.amenities.length} amenities
                            </Button>
                        )}
                    </div>

                    {/* Reviews Section */}
                    <div className="py-8 border-b">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="h-5 w-5" />
                            {rental.isNew ? (
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    <span className="font-semibold">New listing</span>
                                </div>
                            ) : (
                                <>
                                    <span className="font-semibold text-xl">
                                        {rental.averageRating?.toFixed(2)}
                                    </span>
                                    <span>·</span>
                                    <span className="font-semibold">
                                        {rental.reviews?.length} reviews
                                    </span>
                                </>
                            )}
                        </div>

                        {rental.ratingStats && !rental.isNew && (
                            <div className="grid grid-cols-2 gap-x-16 gap-y-4 mb-8">
                                {[
                                    { label: 'Cleanliness', value: rental.ratingStats.cleanliness },
                                    { label: 'Accuracy', value: rental.ratingStats.accuracy },
                                    { label: 'Check-in', value: rental.ratingStats.checkIn },
                                    { label: 'Communication', value: rental.ratingStats.communication },
                                    { label: 'Location', value: rental.ratingStats.location },
                                    { label: 'Value', value: rental.ratingStats.value }
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <span>{label}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-32 h-1 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-full bg-gray-800 rounded-full"
                                                    style={{ width: `${(value / 5) * 100}%` }}
                                                />
                                            </div>
                                            <span>{value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {rental.reviews?.length === 0 && (
                            <div className="text-center py-8">
                                <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                                <p className="text-gray-600">
                                    This home is brand new to Vivid. Book a stay and be the first to review it.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Host Section */}
                    <div className="py-8">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                {rental.host?.image ? (
                                    <Image
                                        src={rental.host.image}
                                        alt={rental.host?.name || 'Host'}
                                        width={64}
                                        height={64}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                                )}
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        Hosted by {rental.host?.name || 'Host'}
                                    </h3>
                                    <p className="text-gray-600">
                                        {rental.host?.joinedDate ? (
                                            `Joined in ${new Date(rental.host?.joinedDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                year: 'numeric'
                                            })}`
                                        ) : 'New Host'}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={handleMessageHost}
                            >
                                <MessageCircle className="h-4 w-4" />
                                Message Host
                            </Button>
                        </div>
                    </div>

                    {rental.latitude && rental.longitude ? (
                        <LocationSection
                            lat={rental.latitude}
                            lng={rental.longitude}
                            address={rental.location}
                            nearbyPlaces={[]}
                        />
                    ) : (
                        <div className="py-8 border-b">
                            <h2 className="text-xl font-semibold">Location not available</h2>
                        </div>
                    )}
                </div>

                {/* Booking Card */}
                <div className="relative">
                    <div className="sticky top-8 border rounded-xl p-6 shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-2xl font-bold">${rental.basePrice}</span>
                                <span className="text-gray-600"> night</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                <span>{rental.averageRating || 'New'}</span>
                            </div>
                        </div>

                        <div className="border rounded-lg mb-4">
                            <DateRangePicker
                                checkIn={checkIn}
                                checkOut={checkOut}
                                onCheckInChange={setCheckIn}
                                onCheckOutChange={setCheckOut}
                            />
                            <GuestSelector
                                maxGuests={rental.guests}
                                value={guests}
                                onChange={setGuests}
                            />
                        </div>

                        <Button
                            className="w-full mb-4"
                            onClick={async () => {
                                if (!session) {
                                    toast({
                                        title: "Please login",
                                        description: "You need to be logged in to make a reservation",
                                    })
                                    return
                                }
                                if (!checkIn || !checkOut) {
                                    toast({
                                        title: "Select dates",
                                        description: "Please select check-in and check-out dates",
                                    })
                                    return
                                }
                                // Add booking logic here
                            }}
                        >
                            Reserve
                        </Button>

                        {/* Price breakdown */}
                        {checkIn && checkOut && (
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="underline">
                                        ${rental.basePrice} × {nights} nights
                                    </span>
                                    <span>${baseTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Cleaning fee</span>
                                    <span>${cleaningFee}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="underline">Vivid service fee</span>
                                    <span>${serviceFee}</span>
                                </div>
                                <div className="flex justify-between pt-4 border-t font-semibold">
                                    <span>Total before taxes</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AmenitiesModal
                isOpen={showAmenities}
                onClose={() => setShowAmenities(false)}
                amenities={rental.amenities}
            />
        </div>
    )
}