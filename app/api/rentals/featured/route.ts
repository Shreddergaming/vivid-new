import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/mongodb/utils'

export async function GET() {
    try {
        const rentals = await DatabaseService.getAllRentals()
        return NextResponse.json(rentals)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 })
    }
} 