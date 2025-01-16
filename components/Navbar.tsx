"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu } from 'lucide-react'
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-gray-200">
                    <Menu className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {session && (
                    <>
                        <DropdownMenuItem>
                            <Link href="/manage-rentals" className="w-full">Manage Rentals</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/profile" className="w-full">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/api/auth/signout" className="w-full">Sign Out</Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}