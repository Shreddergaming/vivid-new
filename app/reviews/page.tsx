'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Star } from 'lucide-react'

interface CompletedStay {
    id: string
    rentalId: string
    rental: {
        title: string
        photos: string[]
    }
    checkOut: Date
    reviewed: boolean
}

export default function ReviewsPage() {
    const { data: session } = useSession()
    const [completedStays, setCompletedStays] = useState<CompletedStay[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCompletedStays = async () => {
            try {
                const response = await fetch('/api/bookings/completed')
                if (response.ok) {
                    const data = await response.json()
                    setCompletedStays(data)
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }

        if (session?.user) fetchCompletedStays()
    }, [session])

    if (loading) return <div>Loading...</div>

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Write a Review</h1>
            <div className="grid gap-6">
                {completedStays.map((stay) => (
                    <div key={stay.id} className="border rounded-lg p-6">
                        <div className="flex gap-4">
                            <div className="relative w-24 h-24">
                                <Image
                                    src={stay.rental.photos[0]}
                                    alt={stay.rental.title}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{stay.rental.title}</h3>
                                <p className="text-sm text-gray-600">
                                    Stayed until {new Date(stay.checkOut).toLocaleDateString()}
                                </p>
                                {!stay.reviewed && (
                                    <Button
                                        className="mt-4"
                                        onClick={() => {/* Open review modal */ }}
                                    >
                                        Write a Review
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {completedStays.length === 0 && (
                    <p className="text-center text-gray-500">
                        No completed stays to review yet.
                    </p>
                )}
            </div>
        </div>
    )
} 