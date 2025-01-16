'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Users } from 'lucide-react'

interface GuestSelectorProps {
    maxGuests: number
    value: number
    onChange: (value: number) => void
}

export function GuestSelector({ maxGuests, value, onChange }: GuestSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-white hover:bg-gray-50"
                >
                    <Users className="mr-2 h-4 w-4" />
                    {value} {value === 1 ? 'guest' : 'guests'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-white">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Guests</p>
                            <p className="text-sm text-gray-500">
                                Maximum {maxGuests} guests
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onChange(Math.max(1, value - 1))}
                                disabled={value <= 1}
                            >
                                -
                            </Button>
                            <span className="w-8 text-center">{value}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onChange(Math.min(maxGuests, value + 1))}
                                disabled={value >= maxGuests}
                            >
                                +
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
} 