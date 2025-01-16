import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/mongodb/utils'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    console.log('API Route Hit:', params.id)

    try {
        const rental = await DatabaseService.getRentalById(params.id)

        if (!rental) {
            console.log('Rental not found')
            return new NextResponse('Rental not found', { status: 404 })
        }

        console.log('Rental found:', rental)
        return NextResponse.json(rental)
    } catch (error) {
        console.error('Error in rental route:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}