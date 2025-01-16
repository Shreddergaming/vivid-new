'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardPage() {
    const { data: session } = useSession()
    const [rentals, setRentals] = useState([])
    const [bookings, setBookings] = useState([])

    useEffect(() => {
        if (session?.user?.id) {
            // Fetch user's rentals
            fetch(`/api/rentals?userId=${session.user.id}`)
                .then(res => res.json())
                .then(data => {
                    setRentals(data || [])
                })

            // Fetch user's bookings
            fetch(`/api/bookings?userId=${session.user.id}`)
                .then(res => res.json())
                .then(data => {
                    setBookings(data || [])
                })
        }
    }, [session])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button asChild>
                    <Link href="/add-rental">List a new property</Link>
                </Button>
            </div>

            <Tabs defaultValue="listings">
                <TabsList>
                    <TabsTrigger value="listings">My Listings</TabsTrigger>
                    <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="listings" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(rentals) && rentals.map((rental: any) => (
                            <Card key={rental._id} className="p-4">
                                <h3 className="font-semibold">{rental.title}</h3>
                                <p className="text-gray-600">${rental.price}/night</p>
                            </Card>
                        ))}
                        {(!rentals || rentals.length === 0) && (
                            <p>No listings found.</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="bookings" className="mt-6">
                    <div className="space-y-4">
                        {Array.isArray(bookings) && bookings.map((booking: any) => (
                            <Card key={booking._id} className="p-4">
                                <h3 className="font-semibold">Booking Details</h3>
                                {/* Add booking details here */}
                            </Card>
                        ))}
                        {(!bookings || bookings.length === 0) && (
                            <p>No bookings found.</p>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="profile" className="mt-6">
                    <Card className="p-6">
                        <div className="flex items-center space-x-4">
                            <Image
                                src={session?.user?.image || '/placeholder.png'}
                                alt={session?.user?.name || 'Profile'}
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                            <div>
                                <h2 className="text-2xl font-semibold">{session?.user?.name}</h2>
                                <p className="text-gray-600">{session?.user?.email}</p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 