'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'

interface Trip {
    id: string
    rentalId: string
    rental: {
        id: string
        title: string
        location: string
        images: string[]
    }
    startDate: string
    endDate: string
    totalPrice: number
    status: 'upcoming' | 'completed' | 'cancelled'
}

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>([])
    const router = useRouter()

    useEffect(() => {
        fetchTrips()
    }, [])

    const fetchTrips = async () => {
        try {
            const response = await fetch('/api/trips')
            if (response.ok) {
                const data = await response.json()
                setTrips(data)
            }
        } catch (error) {
            console.error('Error fetching trips:', error)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">My Trips</h1>

            <div className="grid grid-cols-1 gap-6">
                {trips.map((trip) => (
                    <Card key={trip.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="relative w-full md:w-64 h-48">
                                <Image
                                    src={trip.rental.images[0]}
                                    alt={trip.rental.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-2">
                                            {trip.rental.title}
                                        </h2>
                                        <p className="flex items-center text-gray-600 mb-2">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {trip.rental.location}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${trip.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                                            trip.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center text-gray-600 mb-4">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold">
                                        Total paid: ${trip.totalPrice}
                                    </p>
                                    <Button
                                        onClick={() => router.push(`/rentals/${trip.rentalId}`)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {trips.length === 0 && (
                    <div className="text-center text-gray-500">
                        No trips booked yet. Start exploring rentals!
                    </div>
                )}
            </div>
        </div>
    )
}