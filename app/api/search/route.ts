import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = buildSearchQuery(searchParams)
        const client = await clientPromise

        const rentals = await client.db()
            .collection('rentals')
            .find(query)
            .toArray()

        return NextResponse.json(rentals)
    } catch (error) {
        return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
}

function buildSearchQuery(params: URLSearchParams) {
    const query: any = {}

    if (params.get('location')) {
        query.location = { $regex: params.get('location'), $options: 'i' }
    }

    if (params.get('minPrice')) {
        query.price = { $gte: parseInt(params.get('minPrice')!) }
    }

    if (params.get('maxPrice')) {
        query.price = { ...query.price, $lte: parseInt(params.get('maxPrice')!) }
    }

    if (params.get('guests')) {
        query.maxGuests = { $gte: parseInt(params.get('guests')!) }
    }

    return query
} 