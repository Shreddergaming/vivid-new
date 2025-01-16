'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Search, Moon, Sun } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const allListings = [
    { id: 1, title: "Cozy Apartment in Downtown", location: "New York, NY", rating: 4.8, price: 150, maxGuests: 2 },
    { id: 2, title: "Beachfront Villa", location: "Miami, FL", rating: 4.9, price: 300, maxGuests: 6 },
    { id: 3, title: "Mountain Retreat", location: "Aspen, CO", rating: 4.7, price: 200, maxGuests: 4 },
]

export default function HomePage() {
    const [location, setLocation] = useState("")
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [guests, setGuests] = useState("")
    const [filteredListings, setFilteredListings] = useState(allListings)
    const [isDarkMode, setIsDarkMode] = useState(false)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const filtered = allListings.filter(listing => {
            const matchesLocation = listing.location.toLowerCase().includes(location.toLowerCase()) ||
                listing.title.toLowerCase().includes(location.toLowerCase())
            const matchesGuests = guests === "" || listing.maxGuests >= parseInt(guests)
            return matchesLocation && matchesGuests
        })
        setFilteredListings(filtered)
    }

    return (
        <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-red-500'}`}>EzyRent</h1>
                    <div className="flex items-center space-x-4">
                        <Link href="/add-rental" passHref>
                            <Button variant="ghost">Become a Host</Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
                            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost">Log in</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link href="/login">Log in</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/signup">Sign up</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-grow p-4">
                <div className="max-w-full mx-auto">
                    <h2 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        Find your perfect rental
                    </h2>

                    {/* Search form */}
                    <form onSubmit={handleSearch} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6 mb-8`}>
                        <div className="flex flex-wrap gap-4">
                            <Input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={`flex-grow ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                                aria-label="Location"
                            />
                            <Input
                                type="date"
                                placeholder="Check-in"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className={`w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                                aria-label="Check-in date"
                            />
                            <Input
                                type="date"
                                placeholder="Check-out"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className={`w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                                aria-label="Check-out date"
                            />
                            <Input
                                type="number"
                                placeholder="Guests"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                min="1"
                                className={`w-full sm:w-auto ${isDarkMode ? 'bg-gray-700 text-white' : ''}`}
                                aria-label="Number of guests"
                            />
                            <Button type="submit" className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white">
                                <Search className="h-5 w-5 mr-2" />
                                Search
                            </Button>
                        </div>
                    </form>

                    {/* Listings */}
                    <section>
                        <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Available Listings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredListings.map((listing) => (
                                <Card key={listing.id} className={`overflow-hidden ${isDarkMode ? 'bg-gray-800 text-white' : ''}`}>
                                    <div className="relative h-48 bg-gray-200">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url('/placeholder.svg?height=300&width=400')` }}
                                            role="img"
                                            aria-label={`Image of ${listing.title}`}
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h4 className="font-semibold text-lg">{listing.title}</h4>
                                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{listing.location}</p>
                                        <div className="flex items-center mt-2">
                                            <span className="text-yellow-500 mr-1" aria-hidden="true">★</span>
                                            <span>{listing.rating}</span>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>Max guests: {listing.maxGuests}</p>
                                    </CardContent>
                                    <CardFooter className={`flex justify-between items-center p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                        <span className="font-bold">${listing.price} / night</span>
                                        <Button variant="outline">View Details</Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}