'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    guestName: string;
}

interface Rental {
    id: string;
    title: string;
    description: string;
    price: number;
    location: string;
    status: 'active' | 'inactive';
    bookings: Booking[];
}

export default function ManageRentalPage({ params }: { params: { id: string } }) {
    const [rental, setRental] = useState<Rental | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session.status === 'unauthenticated') {
            router.push('/login')
        } else if (session.status === 'authenticated') {
            fetchRentalDetails()
        }
    }, [session.status, router, params.id])

    const fetchRentalDetails = async () => {
        try {
            const response = await fetch(`/api/rentals/${params.id}`)
            if (response.ok) {
                const data: Rental = await response.json()
                setRental(data)
            } else {
                console.error('Failed to fetch rental details')
            }
        } catch (error) {
            console.error('Error fetching rental details:', error)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setRental(prev => prev ? { ...prev, [name]: value } : null)
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRental(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' } : null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!rental) return

        try {
            const response = await fetch(`/api/rentals/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rental),
            })

            if (response.ok) {
                setIsEditing(false)
                await fetchRentalDetails()
            } else {
                console.error('Failed to update rental')
            }
        } catch (error) {
            console.error('Error updating rental:', error)
        }
    }

    if (!rental) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Rental: {rental.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={rental.title}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={rental.description}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="price">Price per night</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={rental.price}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={rental.location}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    value={rental.status}
                                    onChange={handleSelectChange}
                                    disabled={!isEditing}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        {isEditing ? (
                            <div className="mt-4 space-x-2">
                                <Button type="submit">Save Changes</Button>
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </div>
                        ) : (
                            <Button type="button" onClick={() => setIsEditing(true)} className="mt-4">Edit Rental</Button>
                        )}
                    </form>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    {rental.bookings.length > 0 ? (
                        <ul className="space-y-4">
                            {rental.bookings.map((booking) => (
                                <li key={booking.id} className="border p-4 rounded">
                                    <p><strong>Guest:</strong> {booking.guestName}</p>
                                    <p><strong>Check-in:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                                    <p><strong>Check-out:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No bookings yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}