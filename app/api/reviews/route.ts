import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { rentalId, rating, comment } = await request.json()
        const client = await clientPromise

        const result = await client.db().collection('reviews').insertOne({
            rentalId: new ObjectId(rentalId),
            userId: new ObjectId(session.user.id),
            rating,
            comment,
            createdAt: new Date()
        })

        return NextResponse.json({ id: result.insertedId })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const rentalId = searchParams.get('rentalId')

        if (!rentalId) {
            return NextResponse.json({ error: 'Rental ID is required' }, { status: 400 })
        }

        const client = await clientPromise
        const reviews = await client.db()
            .collection('reviews')
            .find({ rentalId: new ObjectId(rentalId) })
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json(reviews)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
}