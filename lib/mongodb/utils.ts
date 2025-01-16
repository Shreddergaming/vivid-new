import mongoose from 'mongoose';
import { Rental } from './models/rental';
import { Booking } from './models/booking';
import { MongoClient, ObjectId } from 'mongodb'

if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined')
    throw new Error('Please add your Mongo URI to .env.local')
}

console.log('MongoDB URI exists:', !!process.env.MONGODB_URI)
console.log('MongoDB URI prefix:', process.env.MONGODB_URI?.substring(0, 20))

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

// Add this near the top of the file after the MongoDB URI check
console.log('MongoDB Connection Status:', mongoose.connection.readyState)

// Create the mongoose connection
async function connectDB() {
    try {
        if (mongoose.connection.readyState === 0) {
            console.log('Connecting to MongoDB...')
            await mongoose.connect(uri);
            console.log('Connected to MongoDB successfully');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

// Create Rental Schema
const rentalSchema = new mongoose.Schema({
    userId: String,
    propertyType: String,
    entirePlace: Boolean,
    address: String,
    unitNumber: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
        lat: Number,
        lng: Number
    },
    guests: Number,
    bedrooms: Number,
    beds: Number,
    bathrooms: Number,
    amenities: [String],
    photos: [String],
    title: String,
    description: String,
    basePrice: Number,
    weekendPrice: Number,
    weekendPremium: Number,
    discounts: {
        newListing: Boolean,
        lastMinute: Boolean,
        weekly: Boolean,
        monthly: Boolean
    },
    safety: {
        securityCamera: Boolean,
        noiseMonitor: Boolean,
        weapons: Boolean
    },
    petsAllowed: Boolean,
    status: {
        type: String,
        enum: ['active', 'inactive', 'pending'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Create model
const RentalModel = mongoose.models.Rental || mongoose.model('Rental', rentalSchema);

// Add this to your existing schema definitions
const bookingSchema = new mongoose.Schema({
    userId: String,
    rentalId: String,
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const BookingModel = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export const DatabaseService = {
    async createRental(rentalData: Partial<Rental>) {
        await connectDB();
        const rental = new RentalModel(rentalData);
        return rental.save();
    },

    async getAllRentals() {
        await connectDB();
        return RentalModel.find({ status: 'active' })
            .sort({ createdAt: -1 })
            .lean();
    },

    async getRentals(userId: string) {
        await connectDB();
        return RentalModel.find({ userId })
            .sort({ createdAt: -1 })
            .lean();
    },

    async getRentalById(id: string) {
        try {
            await connectDB()
            const rental = await RentalModel.findById(id).lean() as unknown as Rental
            if (!rental) return null

            return {
                ...rental,
                latitude: rental.coordinates?.lat || 26.1420,
                longitude: rental.coordinates?.lng || -81.7948,
                _id: rental._id?.toString() || id
            }
        } catch (error) {
            console.error('Error in getRentalById:', error)
            throw error
        }
    },

    async createBooking(bookingData: Partial<Booking>) {
        await connectDB();
        const booking = new BookingModel(bookingData);
        return booking.save();
    },

    async getBookingsByRental(rentalId: string) {
        await connectDB();
        return BookingModel.find({ rentalId }).sort({ startDate: 1 }).lean();
    },

    async getBookingsByUser(userId: string) {
        await connectDB();
        return BookingModel.find({ userId }).sort({ startDate: -1 }).lean();
    },

    async toggleFavorite(userId: string, listingId: string) {
        try {
            const client = await clientPromise
            const db = client.db()
            const favorites = db.collection('favorites')

            // Check if favorite exists
            const existingFavorite = await favorites.findOne({
                userId: new ObjectId(userId),
                listingId: new ObjectId(listingId)
            })

            if (existingFavorite) {
                // Remove favorite if it exists
                await favorites.deleteOne({
                    userId: new ObjectId(userId),
                    listingId: new ObjectId(listingId)
                })
                return { favorited: false }
            } else {
                // Add favorite if it doesn't exist
                await favorites.insertOne({
                    userId: new ObjectId(userId),
                    listingId: new ObjectId(listingId),
                    createdAt: new Date()
                })
                return { favorited: true }
            }
        } catch (error) {
            console.error('Error in toggleFavorite:', error)
            throw error
        }
    },

    async getFavoriteStatus(userId: string, listingId: string) {
        try {
            const client = await clientPromise
            const db = client.db()
            const favorite = await db.collection('favorites').findOne({
                userId: new ObjectId(userId),
                listingId: new ObjectId(listingId)
            })
            return !!favorite
        } catch (error) {
            console.error('Error in getFavoriteStatus:', error)
            throw error
        }
    },

    async getUserFavorites(userId: string) {
        try {
            const client = await clientPromise
            const db = client.db()
            const favorites = await db.collection('favorites')
                .find({ userId: new ObjectId(userId) })
                .toArray()

            // Get the actual listings
            const listingIds = favorites.map(f => new ObjectId(f.listingId))
            const listings = await db.collection('rentals')
                .find({ _id: { $in: listingIds } })
                .toArray()

            return listings
        } catch (error) {
            console.error('Error in getUserFavorites:', error)
            throw error
        }
    },

    async createMessage(messageData: {
        senderId: string
        receiverId: string
        content: string
        createdAt: Date
    }) {
        try {
            const client = await clientPromise
            const db = client.db()
            const result = await db.collection('messages').insertOne(messageData)
            return { id: result.insertedId, ...messageData }
        } catch (error) {
            console.error('Error in createMessage:', error)
            throw error
        }
    },

    async getMessages(userId: string, hostId: string) {
        try {
            const client = await clientPromise
            const db = client.db()
            const messages = await db.collection('messages')
                .find({
                    $or: [
                        { senderId: userId, receiverId: hostId },
                        { senderId: hostId, receiverId: userId }
                    ]
                })
                .sort({ createdAt: 1 })
                .toArray()
            return messages
        } catch (error) {
            console.error('Error in getMessages:', error)
            throw error
        }
    }
};

// This should log "Connected to MongoDB" when your app starts
console.log('MongoDB URI:', process.env.MONGODB_URI?.slice(0, 20) + '...') 