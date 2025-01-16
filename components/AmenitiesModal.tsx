'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Wifi, Tv, UtensilsCrossed, Shirt, Car, Snowflake, Bath, Home,
    Laptop, Sparkles
} from 'lucide-react'

// Organize existing amenities into categories
const amenityCategories = {
    "Entertainment": [
        "wifi",
        "tv",
        "workspace"
    ],
    "Kitchen & dining": [
        "kitchen"
    ],
    "Bathroom & laundry": [
        "washer",
        "hottub"
    ],
    "Outdoor": [
        "pool",
        "patio"
    ],
    "Parking & facilities": [
        "parking"
    ],
    "Heating & cooling": [
        "ac"
    ]
}

const amenityIcons: Record<string, React.ReactNode> = {
    'wifi': <Wifi className="h-6 w-6" />,
    'tv': <Tv className="h-6 w-6" />,
    'kitchen': <UtensilsCrossed className="h-6 w-6" />,
    'washer': <Shirt className="h-6 w-6" />,
    'parking': <Car className="h-6 w-6" />,
    'ac': <Snowflake className="h-6 w-6" />,
    'workspace': <Laptop className="h-6 w-6" />,
    'pool': <Bath className="h-6 w-6" />,
    'hottub': <Bath className="h-6 w-6" />,
    'patio': <Home className="h-6 w-6" />
}

interface AmenitiesModalProps {
    isOpen: boolean
    onClose: () => void
    amenities: string[]
}

export function AmenitiesModal({ isOpen, onClose, amenities }: AmenitiesModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                    <DialogTitle>What this place offers</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[60vh] pr-6">
                    {Object.entries(amenityCategories).map(([category, items]) => {
                        // Only show categories that have matching amenities
                        const categoryAmenities = items.filter(item =>
                            amenities.map(a => a.toLowerCase()).includes(item.toLowerCase())
                        );

                        if (categoryAmenities.length === 0) return null;

                        return (
                            <div key={category} className="mb-8">
                                <h3 className="text-lg font-semibold mb-4">{category}</h3>
                                <div className="space-y-4">
                                    {categoryAmenities.map((item) => (
                                        <div key={item} className="flex items-center gap-3">
                                            <div className="text-gray-600">
                                                {amenityIcons[item.toLowerCase()] || <Sparkles className="h-6 w-6" />}
                                            </div>
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
} 