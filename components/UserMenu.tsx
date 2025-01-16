'use client'

import { useCallback, useState } from "react"
import { AiOutlineMenu } from "react-icons/ai"
import { BiMessage } from "react-icons/bi"
import { FaRegHeart } from "react-icons/fa"
import { MdOutlineLuggage } from "react-icons/md"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import MenuItem from "./MenuItem"
import Avatar from "./Avatar"

const UserMenu = () => {
    const router = useRouter()
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value)
    }, [])

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div
                    onClick={toggleOpen}
                    className="p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
                >
                    <AiOutlineMenu />
                    <Avatar src={session?.user?.image} />
                </div>
            </div>
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-[200px] bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {session?.user ? (
                            <>
                                <MenuItem onClick={() => router.push('/messages')} label="Messages" />
                                <MenuItem onClick={() => router.push('/favorites')} label="Favorites" />
                                <MenuItem onClick={() => router.push('/trips')} label="My Trips" />
                                <MenuItem onClick={() => router.push('/manage-rentals')} label="My Rentals" />
                                <hr />
                                <MenuItem onClick={() => router.push('/account')} label="Account" />
                                <MenuItem onClick={() => router.push('/add-rental')} label="List your property" />
                                <MenuItem onClick={() => signOut()} label="Log out" />
                            </>
                        ) : (
                            <>
                                <MenuItem onClick={() => router.push('/login')} label="Login" />
                                <MenuItem onClick={() => router.push('/register')} label="Sign up" />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu 