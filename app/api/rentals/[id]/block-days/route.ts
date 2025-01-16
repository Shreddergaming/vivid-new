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
        const { blockedDays } = await request.json()
        const client = await clientPromise

        const rental = await client.db()
            .collection('rentals')
            .findOne({ _id: new ObjectId(params.id), userId: session.user.id })

        if (!rental) {
            return NextResponse.json({ error: 'Rental not found or unauthorized' }, { status: 404 })
        }

        await client.db().collection('rentals').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: { blockedDays } }
        )

        return NextResponse.json({ message: 'Blocked days updated' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update blocked days' }, { status: 500 })
    }
} 