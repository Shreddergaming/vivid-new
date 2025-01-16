import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url)
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'Start and end dates are required' },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const rental = await client.db()
            .collection('rentals')
            .findOne({ _id: new ObjectId(params.id) })

        if (!rental) {
            return NextResponse.json(
                { error: 'Rental not found' },
                { status: 404 }
            )
        }

        const bookings = await client.db()
            .collection('bookings')
            .find({
                rentalId: new ObjectId(params.id),
                $or: [
                    {
                        startDate: {
                            $lte: new Date(endDate),
                            $gte: new Date(startDate)
                        }
                    },
                    {
                        endDate: {
                            $lte: new Date(endDate),
                            $gte: new Date(startDate)
                        }
                    }
                ]
            })
            .toArray()

        return NextResponse.json({
            available: bookings.length === 0,
            conflictingBookings: bookings
        })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to check availability' },
            { status: 500 }
        )
    }
} 