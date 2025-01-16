import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { DatabaseService } from '@/lib/mongodb/utils'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const data = await req.json()
        const bookingData = {
            ...data,
            userId: session.user.id,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await DatabaseService.createBooking(bookingData)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Error creating booking:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function GET(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const client = await clientPromise
        const bookings = await client.db()
            .collection('bookings')
            .find({ userId: new ObjectId(session.user.id) })
            .toArray()

        return NextResponse.json(bookings)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }
}