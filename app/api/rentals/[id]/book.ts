// pages/api/rentals/[id]/book.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId, WithId, Document } from 'mongodb'

interface Booking {
    userId: string;
    startDate: Date;
    endDate: Date;
}

interface RentalDocument extends WithId<Document> {
    bookings: Booking[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.query
    const { startDate, endDate } = req.body

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Missing start or end date' })
    }

    const client = await clientPromise
    const rentalsCollection = client.db().collection<RentalDocument>('rentals')

    const rental = await rentalsCollection.findOne({ _id: new ObjectId(id as string) })

    if (!rental) {
        return res.status(404).json({ message: 'Rental not found' })
    }

    // Check if the dates are available
    const isAvailable = checkAvailability(rental.blockedDays, rental.bookings, startDate, endDate)

    if (!isAvailable) {
        return res.status(400).json({ message: 'Selected dates are not available' })
    }

    await rentalsCollection.updateOne(
        { _id: new ObjectId(id as string) },
        {
            $push: {
                bookings: {
                    $each: [{
                        userId: session.user.id,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate)
                    }]
                }
            } as any
        }
    )

    res.status(200).json({ message: 'Booking confirmed' })
}

function checkAvailability(
    blockedDays: string[],
    bookings: Booking[],
    startDate: string,
    endDate: string
): boolean {
    const start = new Date(startDate)
    const end = new Date(endDate)

    for (const blockedDay of blockedDays) {
        const blocked = new Date(blockedDay)
        if (blocked >= start && blocked <= end) {
            return false
        }
    }

    for (const booking of bookings) {
        if (
            (start >= booking.startDate && start <= booking.endDate) ||
            (end >= booking.startDate && end <= booking.endDate) ||
            (start <= booking.startDate && end >= booking.endDate)
        ) {
            return false
        }
    }

    return true
}