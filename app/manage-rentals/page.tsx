'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
}

interface Listing {
    id: string;
    title: string;
    description: string;
    price: number;
    balance: number;
    status: 'active' | 'inactive';
    bookings: Booking[];
}

export default function ManageRentalsPage() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [userListings, setUserListings] = useState<Listing[]>([])
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/login')
        } else if (session.status === 'authenticated') {
            fetchUserListings()
        }
    }, [session.status, router])

    const fetchUserListings = async () => {
        try {
            const response = await fetch('/api/user/rentals')
            if (response.ok) {
                const data: Listing[] = await response.json()
                setUserListings(data)
            } else {
                console.error('Failed to fetch user listings')
            }
        } catch (error) {
            console.error('Error fetching user listings:', error)
        }
    }

    const totalBalance = userListings.reduce((sum, listing) => sum + listing.balance, 0)
    const totalTenants = userListings.filter(listing => listing.status === 'active').length
    const upcomingBookings = userListings.reduce((sum, listing) => sum + listing.bookings.length, 0)

    return (
        <div className={`p-4 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
            <div className="max-w-7xl mx-auto">
                <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Manage Your Rentals
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Tenants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{totalTenants}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{upcomingBookings}</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-6">
                    <Link href="/add-rental" passHref>
                        <Button>Add New Rental</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userListings.map((listing) => (
                        <Card key={listing.id}>
                            <CardHeader>
                                <CardTitle>{listing.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{listing.description}</p>
                                <p>Price: ${listing.price} / night</p>
                                <p>Status: {listing.status}</p>
                                <p>Balance: ${listing.balance}</p>
                                <p>Upcoming Bookings: {listing.bookings.length}</p>
                                <Link href={`/manage-rentals/${listing.id}`} passHref>
                                    <Button className="mt-4">Manage</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}