'use client'

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
    checkIn: Date | null
    checkOut: Date | null
    onCheckInChange: (date: Date | null) => void
    onCheckOutChange: (date: Date | null) => void
    className?: string
}

export function DateRangePicker({
    checkIn,
    checkOut,
    onCheckInChange,
    onCheckOutChange,
    className,
}: DateRangePickerProps) {
    const [isCheckInOpen, setIsCheckInOpen] = useState(false)
    const [isCheckOutOpen, setIsCheckOutOpen] = useState(false)

    return (
        <div className={cn("grid grid-cols-2", className)}>
            <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "justify-start text-left font-normal border-r-0 rounded-r-none bg-white hover:bg-gray-50",
                            !checkIn && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "MMM d, yyyy") : "Check-in"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                        mode="single"
                        selected={checkIn as Date}
                        onSelect={(date) => {
                            onCheckInChange(date || null)
                            setIsCheckInOpen(false)
                            setIsCheckOutOpen(true)
                        }}
                        disabled={(date) =>
                            date < new Date() || (checkOut ? date >= checkOut : false)
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "justify-start text-left font-normal border-l-0 rounded-l-none bg-white hover:bg-gray-50",
                            !checkOut && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "MMM d, yyyy") : "Check-out"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                        mode="single"
                        selected={checkOut as Date}
                        onSelect={(date) => {
                            onCheckOutChange(date || null)
                            setIsCheckOutOpen(false)
                        }}
                        disabled={(date) =>
                            date < (checkIn || new Date())
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
} 