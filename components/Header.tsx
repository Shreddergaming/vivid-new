'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, MessageSquare, LogOut, Heart, Plane } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from 'react'

export function Header() {
    const { data: session, status } = useSession()
    const [hasRentals, setHasRentals] = useState(false)

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

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vivid_full_logo_no_tagline-NAsJuyVpqO6O0Y7AINFf5vJxyDca1h.png"
                            alt="Vivid"
                            width={150}
                            height={50}
                            className="h-12 w-auto"
                        />
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/add-rental">
                            <Button variant="ghost" size="sm" className="text-sm font-medium">
                                List Your Property
                            </Button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Image
                                src="/placeholder.svg?height=32&width=32"
                                alt="Profile"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
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
                                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                                    {status === 'authenticated' ? (
                                        <>
                                            <DropdownMenuItem className="hover:bg-gray-100">
                                                <MessageSquare className="mr-2 h-4 w-4" />
                                                <Link href="/messages">Messages</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-gray-100">
                                                <Heart className="mr-2 h-4 w-4" />
                                                <Link href="/favorites">Favorites</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-gray-100">
                                                <Plane className="mr-2 h-4 w-4" />
                                                <Link href="/trips">My Trips</Link>
                                            </DropdownMenuItem>
                                            {session?.user?.hasRentals && (
                                                <DropdownMenuItem className="hover:bg-gray-100">
                                                    <Link href="/manage-rentals">Manage Properties</Link>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="hover:bg-gray-100" onClick={() => signOut()}>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem className="hover:bg-gray-100">
                                                <Link href="/login">Log in</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-gray-100">
                                                <Link href="/signup">Sign up</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="hover:bg-gray-100">
                                                <Heart className="mr-2 h-4 w-4" />
                                                <Link href="/favorites">Favorites</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="hover:bg-gray-100">
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
        </header>
    )
}