'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FaWater } from 'react-icons/fa'
import {
    BsBuilding,
    BsHouseDoor,
    BsWater,
} from "react-icons/bs"
import {
    GiCampingTent,
    GiSkis,
    GiPalmTree,
    GiSailboat,
    GiCastle,
    GiFireGem
} from "react-icons/gi"
import { FiltersDialog } from './FiltersDialog'
import { DateRange } from "react-day-picker"

interface SearchInterfaceProps {
    onSearch: (params: URLSearchParams) => void
}

type GuestCounts = {
    adults: number
    children: number
    infants: number
    pets: number
}

const categories = [
    { name: 'Beachfront', Icon: FaWater },
    { name: 'Apartments', Icon: BsBuilding },
    { name: 'Cabins', Icon: BsHouseDoor },
    { name: 'Houseboats', Icon: GiSailboat },
    { name: 'Camping', Icon: GiCampingTent },
    { name: 'Lake', Icon: BsWater },
    { name: 'Ski-in/out', Icon: GiSkis },
    { name: 'Tropical', Icon: GiPalmTree },
    { name: 'Mansions', Icon: GiCastle },
    { name: 'WOW', Icon: GiFireGem },
]

export default function SearchInterface({ onSearch }: SearchInterfaceProps) {
    const [destination, setDestination] = useState('')
    const [checkIn, setCheckIn] = useState<Date>()
    const [checkOut, setCheckOut] = useState<Date>()
    const [guestCounts, setGuestCounts] = useState<GuestCounts>({
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0
    })
    const [selectedCategory, setSelectedCategory] = useState('Beachfront')
    const [filters, setFilters] = useState('')
    const [dateRange, setDateRange] = useState<DateRange | undefined>()

    const handleSearch = () => {
        const params = new URLSearchParams(filters)
        if (destination) params.append('destination', destination)
        if (checkIn) params.append('checkIn', format(checkIn, 'yyyy-MM-dd'))
        if (checkOut) params.append('checkOut', format(checkOut, 'yyyy-MM-dd'))
        params.append('guests', String(guestCounts.adults + guestCounts.children))
        params.append('infants', String(guestCounts.infants))
        params.append('pets', String(guestCounts.pets))
        params.append('category', selectedCategory)
        onSearch(params)
    }

    const updateGuestCount = (type: keyof GuestCounts, increment: boolean) => {
        setGuestCounts(prev => {
            const newCount = increment ? prev[type] + 1 : prev[type] - 1
            return {
                ...prev,
                [type]: Math.max(type === 'adults' ? 1 : 0, Math.min(newCount, 10))
            }
        })
    }

    const totalGuests = guestCounts.adults + guestCounts.children

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center">
                    <div className="px-4 py-2">
                        <div className="text-sm font-medium mb-1">Where</div>
                        <Input
                            type="text"
                            placeholder="Search destinations"
                            value={destination}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
                            className="h-7 border-0 p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                        />
                    </div>

                    <div className="px-4 py-2 border-l">
                        <div className="text-sm font-medium mb-1">Check in</div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-7 w-full justify-start p-0 text-sm font-normal"
                                >
                                    {checkIn ? format(checkIn, "MMM d, yyyy") : "Add dates"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="bg-white rounded-lg shadow-lg p-4">
                                    <Calendar
                                        mode="range"
                                        selected={dateRange}
                                        onSelect={(range) => {
                                            setDateRange(range)
                                            if (range?.from) setCheckIn(range.from)
                                            if (range?.to) setCheckOut(range.to)
                                        }}
                                        numberOfMonths={1}
                                        className="rounded-md border"
                                        classNames={{
                                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                                            day_range_start: "day-range-start",
                                            day_range_end: "day-range-end",
                                            day_selected:
                                                "bg-purple-500 text-white hover:bg-purple-500 hover:text-white focus:bg-purple-500 focus:text-white",
                                            day_today: "bg-gray-100",
                                            day_outside: "text-gray-500 opacity-50",
                                            day_disabled: "text-gray-500 opacity-50",
                                            day_range_middle:
                                                "aria-selected:bg-purple-100 aria-selected:text-purple-900",
                                            day_hidden: "invisible",
                                        }}
                                        disabled={{ before: new Date() }}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="px-4 py-2 border-l">
                        <div className="text-sm font-medium mb-1">Check out</div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-7 w-full justify-start p-0 text-sm font-normal"
                                >
                                    {checkOut ? format(checkOut, "MMM d, yyyy") : "Add dates"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <div className="bg-white rounded-lg shadow-lg p-4">
                                    <Calendar
                                        mode="single"
                                        selected={checkOut}
                                        onSelect={setCheckOut}
                                        initialFocus
                                        disabled={(date) => date < (checkIn || new Date())}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="px-4 py-2 border-l">
                        <div className="text-sm font-medium mb-1">Who</div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-7 w-full justify-start p-0 text-sm font-normal"
                                >
                                    {totalGuests > 0
                                        ? `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}${guestCounts.infants ? `, ${guestCounts.infants} infant${guestCounts.infants !== 1 ? 's' : ''}` : ''}${guestCounts.pets ? `, ${guestCounts.pets} pet${guestCounts.pets !== 1 ? 's' : ''}` : ''}`
                                        : "Add guests"
                                    }
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4" align="end">
                                <div className="bg-white rounded-lg shadow-lg p-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">Adults</div>
                                                <div className="text-sm text-muted-foreground">Ages 13 or above</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('adults', false)}
                                                    disabled={guestCounts.adults <= 1}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span>{guestCounts.adults}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('adults', true)}
                                                    disabled={guestCounts.adults >= 10}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">Children</div>
                                                <div className="text-sm text-muted-foreground">Ages 2-12</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('children', false)}
                                                    disabled={guestCounts.children <= 0}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span>{guestCounts.children}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('children', true)}
                                                    disabled={guestCounts.children >= 10}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">Infants</div>
                                                <div className="text-sm text-muted-foreground">Under 2</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('infants', false)}
                                                    disabled={guestCounts.infants <= 0}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span>{guestCounts.infants}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('infants', true)}
                                                    disabled={guestCounts.infants >= 5}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">Pets</div>
                                                <div className="text-sm text-muted-foreground">Bringing a service animal?</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('pets', false)}
                                                    disabled={guestCounts.pets <= 0}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span>{guestCounts.pets}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => updateGuestCount('pets', true)}
                                                    disabled={guestCounts.pets >= 3}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Button
                        onClick={handleSearch}
                        size="icon"
                        className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600"
                    >
                        <Search className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full shrink-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <ScrollArea className="w-full">
                    <div className="flex space-x-8">
                        {categories.map((category) => (
                            <Button
                                key={category.name}
                                variant="ghost"
                                className={cn(
                                    "flex flex-col items-center gap-1 h-auto py-2",
                                    selectedCategory === category.name && "text-primary border-b-2 border-primary rounded-none"
                                )}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                <category.Icon className="w-6 h-6" />
                                <span className="text-xs font-normal">{category.name}</span>
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full shrink-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <FiltersDialog onFiltersChange={setFilters} />
            </div>
        </div>
    )
}