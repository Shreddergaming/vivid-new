import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/mongodb/utils'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const listing = await DatabaseService.getRentalById(params.id)
        if (!listing) {
            return new NextResponse('Listing not found', { status: 404 })
        }
        return NextResponse.json(listing)
    } catch (error) {
        console.error('Error fetching listing:', error)
        return new NextResponse('Error fetching listing', { status: 500 })
    }
} 