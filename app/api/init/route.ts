import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/mongodb/init'

export async function GET() {
    try {
        await initializeDatabase()
        return NextResponse.json({ message: 'Database initialized successfully' })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to initialize database' },
            { status: 500 }
        )
    }
} 