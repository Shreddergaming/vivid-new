import { ObjectId } from 'mongodb'

// Rental Schema
export interface RentalSchema {
    _id?: ObjectId
    title: string
    description: string
    location: string
    price: number
    maxGuests: number
    images: string[]
    amenities: string[]
    userId: ObjectId
    category: string
    rating: number
    reviewCount: number
    createdAt: Date
}

// Booking Schema
export interface BookingSchema {
    _id?: ObjectId
    rentalId: ObjectId
    userId: ObjectId
    startDate: Date
    endDate: Date
    guests: number
    status: 'pending' | 'confirmed' | 'cancelled'
    createdAt: Date
}

// Review Schema
export interface ReviewSchema {
    _id?: ObjectId
    rentalId: ObjectId
    userId: ObjectId
    rating: number
    comment: string
    createdAt: Date
}

// Favorite Schema
export interface FavoriteSchema {
    _id?: ObjectId
    rentalId: ObjectId
    userId: ObjectId
    createdAt: Date
} 