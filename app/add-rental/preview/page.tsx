'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { useToast } from "@/components/ui/use-toast"

interface ListingData {
    title: string
    description: string
    price: number
    location: string
    photos: string[]
}

export default function PreviewPage() {
    const [listingData, setListingData] = useState<ListingData | null>(null)
    const [publishing, setPublishing] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        // Get listing data from localStorage or state management
        const data = localStorage.getItem('listingDraft')
        if (data) {
            setListingData(JSON.parse(data))
        }
    }, [])

    const handlePublish = async () => {
        setPublishing(true)
        try {
            const response = await fetch('/api/listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(listingData)
            })

            if (response.ok) {
                toast({
                    title: "Success!",
                    description: "Your listing has been published.",
                })
                localStorage.removeItem('listingDraft')
                router.push('/manage-rentals')
            }
        } catch (error) {
            console.error('Error publishing listing:', error)
            toast({
                title: "Error",
                description: "Failed to publish listing. Please try again.",
                variant: "destructive"
            })
        } finally {
            setPublishing(false)
        }
    }

    if (!listingData) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Preview Your Listing</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Main photo */}
                    <div className="relative w-full h-[400px] mb-4">
                        <Image
                            src={listingData.photos[0]}
                            alt={listingData.title}
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>

                    {/* Photo gallery */}
                    <div className="grid grid-cols-4 gap-2 mb-6">
                        {listingData.photos.slice(1).map((photo, index) => (
                            <div key={index} className="relative aspect-square">
                                <Image
                                    src={photo}
                                    alt={`Photo ${index + 2}`}
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Listing details */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">{listingData.title}</h2>
                        <p className="text-gray-600">{listingData.location}</p>
                        <p className="text-xl font-semibold">${listingData.price} / night</p>
                        <p className="text-gray-700">{listingData.description}</p>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                        >
                            Edit Listing
                        </Button>
                        <Button
                            onClick={handlePublish}
                            disabled={publishing}
                        >
                            {publishing ? 'Publishing...' : 'Publish Listing'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 