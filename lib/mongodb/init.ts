import clientPromise from './mongodb'

export async function setupIndexes() {
    const client = await clientPromise
    const db = client.db()

    // Rentals indexes
    await db.collection('rentals').createIndexes([
        { key: { location: 1 } },
        { key: { price: 1 } },
        { key: { maxGuests: 1 } }
    ])

    // Bookings indexes
    await db.collection('bookings').createIndexes([
        { key: { userId: 1 } },
        { key: { rentalId: 1 } },
        { key: { startDate: 1, endDate: 1 } }
    ])

    // Favorites indexes
    await db.collection('favorites').createIndexes([
        { key: { userId: 1 } },
        { key: { rentalId: 1 } }
    ])

    // Users indexes
    await db.collection('users').createIndexes([
        { key: { email: 1 }, unique: true }
    ])

    // Notifications indexes
    await db.collection('notifications').createIndexes([
        { key: { userId: 1 } },
        { key: { read: 1 } },
        { key: { createdAt: -1 } }
    ])
} 