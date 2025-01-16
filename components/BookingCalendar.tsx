'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { addDays, format } from 'date-fns'

interface BookingCalendarProps {
    basePrice: number
    onBookNow: (startDate: Date, endDate: Date) => void
    existingBookings?: Array<{
        startDate: Date
        endDate: Date
    }>
}

export function BookingCalendar({ basePrice, onBookNow, existingBookings }: BookingCalendarProps) {
    const [date, setDate] = useState<{
        from: Date
        to: Date | undefined
    }>({
        from: new Date(),
        to: addDays(new Date(), 1)
    })

    const numberOfNights = date.to
        ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24))
        : 0

    const totalPrice = basePrice * numberOfNights

    const disabledDays = [
        { before: new Date() },
        ...(existingBookings?.map(booking => ({
            from: new Date(booking.startDate),
            to: new Date(booking.endDate)
        })) || [])
    ];

    return (
        <div className="border rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-2xl font-semibold">${basePrice}</span>
                    <span className="text-gray-600"> / night</span>
                </div>
                <div className="text-sm text-gray-600">
                    ★ 4.9 · 42 reviews
                </div>
            </div>

            <Calendar
                mode="range"
                selected={date}
                onSelect={(range: any) => setDate(range)}
                numberOfMonths={2}
                disabled={disabledDays}
            />

            <div className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span>${basePrice} × {numberOfNights} nights</span>
                    <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                </div>
            </div>

            <Button
                className="w-full"
                onClick={() => date.to && onBookNow(date.from, date.to)}
            >
                Book Now
            </Button>
        </div>
    )
}