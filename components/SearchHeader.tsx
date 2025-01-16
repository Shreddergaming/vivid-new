'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, MessageSquare, LogOut, MapPin, Calendar, Users, Heart, Plane } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchInterface from '@/components/SearchInterface'

export function SearchHeader() {
    const { data: session, status } = useSession()
    const [showCompactHeader, setShowCompactHeader] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const [hasRentals, setHasRentals] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowCompactHeader(!entry.isIntersecting)
            },
            { threshold: 0 }
        )

        if (searchRef.current) {
            observer.observe(searchRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const checkUserRentals = async () => {
            if (session?.user?.id) {
                try {
                    const response = await fetch(`/api/rentals?userId=${session.user.id}`)
                    const rentals = await response.json()
                    setHasRentals(rentals.length > 0)
                } catch (error) {
                    console.error('Error checking rentals:', error)
                }
            }
        }

        checkUserRentals()
    }, [session])

    const handleSearch = (params: URLSearchParams) => {
        console.log(params.toString())
        setIsSearchOpen(false)
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vivid_full_logo_no_tagline-NAsJuyVpqO6O0Y7AINFf5vJxyDca1h.png"
                                alt="Vivid"
                                width={150}
                                height={50}
                                className="h-12 w-auto"
                            />
                        </Link>

                        <div className={`transform transition-all duration-300 ${showCompactHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                                <DialogTrigger asChild>
                                    <button className="flex items-center gap-4 px-6 py-3 rounded-full border shadow-sm hover:shadow-md bg-white text-gray-700">
                                        <MapPin className="h-4 w-4" />
                                        <span>Anywhere</span>
                                        <span className="mx-2">|</span>
                                        <Calendar className="h-4 w-4" />
                                        <span>Any week</span>
                                        <span className="mx-2">|</span>
                                        <Users className="h-4 w-4" />
                                        <span>Add guests</span>
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] p-0">
                                    <SearchInterface onSearch={handleSearch} />
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/add-rental">
                                <Button variant="ghost" size="sm" className="text-sm font-medium">
                                    List Your Property
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-56 bg-white border rounded-lg shadow-lg"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    {status === 'authenticated' ? (
                                        <>
                                            <DropdownMenuItem className="focus:bg-gray-100">
                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                <Link href="/messages">Messages</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-gray-100">
                                                <Heart className="mr-2 h-4 w-4" />
                                                <Link href="/favorites">Favorites</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-gray-100">
                                                <Plane className="mr-2 h-4 w-4" />
                                                <Link href="/trips">My Trips</Link>
                                            </DropdownMenuItem>
                                            {session?.user?.hasRentals && (
                                                <DropdownMenuItem className="focus:bg-gray-100">
                                                    <Link href="/manage-rentals">Manage Properties</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator className="bg-gray-200" />
                                            <DropdownMenuItem className="focus:bg-gray-100" onClick={() => signOut()}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem className="focus:bg-gray-100">
                                                <Link href="/login">Log in</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-gray-100">
                                                <Link href="/signup">Sign up</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-gray-200" />
                                            <DropdownMenuItem className="focus:bg-gray-100">
                                                <Heart className="mr-2 h-4 w-4" />
                                                <Link href="/favorites">Favorites</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-gray-100">
                                                <Plane className="mr-2 h-4 w-4" />
                                                <Link href="/trips">My Trips</Link>
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}