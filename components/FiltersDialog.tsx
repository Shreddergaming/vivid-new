'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, Wifi, Tv, UtensilsCrossed, Shirt, Fan, Dumbbell, Dog, Waves, ParkingSquare, Car, Baby, Bed, Flame, Cigarette, Coffee, Thermometer, Briefcase, Scissors, Droplets, Minus, Plus, X, Sliders } from 'lucide-react'

interface FiltersDialogProps {
    onFiltersChange: (filters: string) => void
}

interface Filters {
    priceRange: [number, number]
    bedrooms: number
    beds: number
    bathrooms: number
    petsAllowed: boolean
    amenities: string[]
}

// Mock data for the histogram - in a real app, this would come from your backend
const priceHistogram = [
    4, 6, 8, 12, 18, 24, 32, 38, 42, 36, 28, 22, 16, 12, 8, 6, 4, 3, 2, 1
]

const amenities = {
    "Essentials": [
        { id: "wifi", label: "WiFi", icon: Wifi },
        { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
        { id: "washer", label: "Washer", icon: Shirt },
        { id: "dryer", label: "Dryer", icon: Shirt },
        { id: "air-conditioning", label: "Air conditioning", icon: Fan },
        { id: "heating", label: "Heating", icon: Thermometer },
        { id: "workspace", label: "Dedicated workspace", icon: Briefcase },
        { id: "tv", label: "TV", icon: Tv },
        { id: "hair-dryer", label: "Hair dryer", icon: Scissors },
        { id: "iron", label: "Iron", icon: Flame },
    ],
    "Features": [
        { id: "pool", label: "Pool", icon: Waves },
        { id: "hot-tub", label: "Hot tub", icon: Droplets },
        { id: "free-parking", label: "Free parking", icon: ParkingSquare },
        { id: "ev-charger", label: "EV charger", icon: Car },
        { id: "crib", label: "Crib", icon: Baby },
        { id: "king-bed", label: "King bed", icon: Bed },
        { id: "gym", label: "Gym", icon: Dumbbell },
        { id: "bbq-grill", label: "BBQ grill", icon: Flame },
        { id: "breakfast", label: "Breakfast", icon: Coffee },
        { id: "indoor-fireplace", label: "Indoor fireplace", icon: Flame },
        { id: "smoking-allowed", label: "Smoking allowed", icon: Cigarette },
    ]
}

function PriceRangeSlider({ value, onChange }: {
    value: [number, number]
    onChange: (value: [number, number]) => void
}) {
    const [dragging, setDragging] = React.useState<'min' | 'max' | null>(null)
    const sliderRef = React.useRef<HTMLDivElement>(null)
    const maxPrice = 1000

    const handleMouseDown = (e: React.MouseEvent, handle: 'min' | 'max') => {
        setDragging(handle)
    }

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging || !sliderRef.current) return

            const rect = sliderRef.current.getBoundingClientRect()
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
            const percentage = x / rect.width
            const newValue = Math.round(percentage * maxPrice)

            if (dragging === 'min') {
                onChange([Math.min(newValue, value[1] - 10), value[1]])
            } else {
                onChange([value[0], Math.max(newValue, value[0] + 10)])
            }
        }

        const handleMouseUp = () => {
            setDragging(null)
        }

        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [dragging, onChange, value])

    const minPosition = `${(value[0] / maxPrice) * 100}%`
    const maxPosition = `${(value[1] / maxPrice) * 100}%`

    return (
        <div className="space-y-6">
            <div className="relative h-24" ref={sliderRef}>
                {/* Histogram */}
                <div className="absolute inset-x-0 bottom-8 h-24 flex items-end">
                    {priceHistogram.map((height, i) => (
                        <div
                            key={i}
                            className="flex-1 mx-px"
                            style={{
                                height: `${height * 2}px`,
                                backgroundColor: i >= (value[0] / maxPrice) * 20 && i <= (value[1] / maxPrice) * 20
                                    ? '#A855F7'
                                    : '#ddd'
                            }}
                        />
                    ))}
                </div>

                {/* Slider track */}
                <div className="absolute bottom-6 left-0 right-0 h-1 bg-gray-200">
                    <div
                        className="absolute h-full bg-gray-900"
                        style={{
                            left: minPosition,
                            right: `${100 - (value[1] / maxPrice) * 100}%`
                        }}
                    />
                </div>

                {/* Handles */}
                <div
                    className="absolute bottom-4 w-6 h-6 -ml-3 bg-white border-2 border-gray-900 rounded-full cursor-pointer"
                    style={{ left: minPosition }}
                    onMouseDown={(e) => handleMouseDown(e, 'min')}
                />
                <div
                    className="absolute bottom-4 w-6 h-6 -ml-3 bg-white border-2 border-gray-900 rounded-full cursor-pointer"
                    style={{ left: maxPosition }}
                    onMouseDown={(e) => handleMouseDown(e, 'max')}
                />
            </div>

            <div className="flex justify-between">
                <div className="inline-flex items-center px-4 py-2 bg-white border rounded-full">
                    <span className="text-sm">$</span>
                    <input
                        type="number"
                        value={value[0]}
                        onChange={(e) => {
                            const newValue = parseInt(e.target.value)
                            if (!isNaN(newValue)) {
                                onChange([Math.min(newValue, value[1] - 10), value[1]])
                            }
                        }}
                        className="w-16 text-sm border-none focus:outline-none focus:ring-0 p-0 ml-1"
                    />
                </div>
                <div className="inline-flex items-center px-4 py-2 bg-white border rounded-full">
                    <span className="text-sm">$</span>
                    <input
                        type="number"
                        value={value[1]}
                        onChange={(e) => {
                            const newValue = parseInt(e.target.value)
                            if (!isNaN(newValue)) {
                                onChange([value[0], Math.max(newValue, value[0] + 10)])
                            }
                        }}
                        className="w-16 text-sm border-none focus:outline-none focus:ring-0 p-0 ml-1"
                    />
                </div>
            </div>
        </div>
    )
}

export function FiltersDialog({ onFiltersChange }: FiltersDialogProps) {
    const [open, setOpen] = React.useState(false)
    const [filters, setFilters] = React.useState<Filters>({
        priceRange: [62, 404],
        bedrooms: 0,
        beds: 0,
        bathrooms: 0,
        petsAllowed: false,
        amenities: [],
    })

    const handleFilterChange = (key: keyof Filters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const handleRoomChange = (type: 'bedrooms' | 'beds' | 'bathrooms', operation: 'increment' | 'decrement') => {
        const currentValue = filters[type]
        const newValue = operation === 'increment' ? currentValue + 1 : Math.max(0, currentValue - 1)
        handleFilterChange(type, newValue)
    }

    const handleClearAll = () => {
        setFilters({
            priceRange: [62, 404],
            bedrooms: 0,
            beds: 0,
            bathrooms: 0,
            petsAllowed: false,
            amenities: [],
        })
    }

    const handleApplyFilters = () => {
        const queryParams = new URLSearchParams()

        queryParams.append('minPrice', filters.priceRange[0].toString())
        queryParams.append('maxPrice', filters.priceRange[1].toString())

        if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms.toString())
        if (filters.beds) queryParams.append('beds', filters.beds.toString())
        if (filters.bathrooms) queryParams.append('bathrooms', filters.bathrooms.toString())
        queryParams.append('petsAllowed', filters.petsAllowed.toString())

        filters.amenities.forEach(amenity => queryParams.append('amenities', amenity))

        onFiltersChange(queryParams.toString())
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="ml-auto">
                    <Sliders className="mr-2 h-4 w-4" />
                    Filters
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-0 overflow-hidden bg-white">
                <DialogHeader className="sticky top-0 z-10 bg-white px-4 py-2 border-b">
                    <div className="flex items-center justify-between">
                        <button onClick={() => setOpen(false)} className="p-2">
                            <X className="h-4 w-4" />
                        </button>
                        <DialogTitle className="text-center flex-1">Filters</DialogTitle>
                        <div className="w-8" /> {/* Spacer for alignment */}
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[calc(100vh-10rem)] px-4">
                    <div className="space-y-6 py-4">
                        <div className="space-y-4">
                            <div>
                                <Label>Price range</Label>
                                <div className="text-sm text-muted-foreground">Nightly prices before fees and taxes</div>
                            </div>
                            <PriceRangeSlider
                                value={filters.priceRange}
                                onChange={(value) => handleFilterChange('priceRange', value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Rooms and beds</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Bedrooms', key: 'bedrooms' as const },
                                    { label: 'Beds', key: 'beds' as const },
                                    { label: 'Bathrooms', key: 'bathrooms' as const },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <span>{item.label}</span>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleRoomChange(item.key, 'decrement')}
                                                disabled={!filters[item.key]}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-12 text-center">
                                                {filters[item.key] ? filters[item.key] : 'Any'}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleRoomChange(item.key, 'increment')}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Pets</h3>
                            <div className="flex items-center justify-between">
                                <span>Pets allowed</span>
                                <Button
                                    variant={filters.petsAllowed ? "default" : "outline"}
                                    onClick={() => handleFilterChange('petsAllowed', !filters.petsAllowed)}
                                >
                                    {filters.petsAllowed ? "Yes" : "No"}
                                </Button>
                            </div>
                        </div>

                        {Object.entries(amenities).map(([category, items]) => (
                            <div key={category} className="space-y-4">
                                <h3 className="text-lg font-semibold">{category}</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {items.map((amenity) => {
                                        const Icon = amenity.icon
                                        const isSelected = filters.amenities.includes(amenity.id)
                                        return (
                                            <button
                                                key={amenity.id}
                                                onClick={() => {
                                                    const newAmenities = isSelected
                                                        ? filters.amenities.filter(id => id !== amenity.id)
                                                        : [...filters.amenities, amenity.id]
                                                    handleFilterChange('amenities', newAmenities)
                                                }}
                                                className={`flex items-center gap-2 p-3 rounded-lg border transition-colors
                                                    ${isSelected
                                                        ? 'border-black bg-black/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                                <span className="text-sm">{amenity.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="sticky bottom-0 z-10 bg-white px-4 py-2 border-t flex items-center justify-between">
                    <Button variant="ghost" onClick={handleClearAll}>
                        Clear all
                    </Button>
                    <Button onClick={handleApplyFilters}>
                        Show places
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}