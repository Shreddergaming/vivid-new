export interface Rental {
    _id?: string;
    userId: string;
    propertyType: string;
    entirePlace: boolean;
    address: string;
    unitNumber?: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    amenities: string[];
    photos: string[];
    title: string;
    description: string;
    basePrice: number;
    weekendPrice: number;
    weekendPremium: number;
    discounts: {
        newListing: boolean;
        lastMinute: boolean;
        weekly: boolean;
        monthly: boolean;
    };
    safety: {
        securityCamera: boolean;
        noiseMonitor: boolean;
        weapons: boolean;
    };
    petsAllowed: boolean;
    status: 'active' | 'inactive' | 'pending';
    createdAt: Date;
    updatedAt: Date;
    latitude: number;
    longitude: number;
    nearbyPlaces?: {
        type: string;
        name: string;
        distance: string;
        walkingTime?: string;
    }[];
} 