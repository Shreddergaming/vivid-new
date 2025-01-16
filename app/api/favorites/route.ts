import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { DatabaseService } from '@/lib/mongodb/utils'

export async function POST(request: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { listingId } = await request.json()
        const userId = session.user.id

        // Use non-static method
        const result = await DatabaseService.toggleFavorite(userId, listingId)

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error toggling favorite:', error)
        return new NextResponse('Error toggling favorite', { status: 500 })
    }
} 