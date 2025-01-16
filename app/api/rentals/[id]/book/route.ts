import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { startDate, endDate, guests } = await request.json()
        const client = await clientPromise

        // Add booking logic here
        const result = await client.db().collection('bookings').insertOne({
            rentalId: new ObjectId(params.id),
            userId: session.user.id,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            guests,
            createdAt: new Date()
        })

        return NextResponse.json({ id: result.insertedId })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }
} 