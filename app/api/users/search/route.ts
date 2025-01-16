import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prismadb'

export async function GET(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.email) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json([])
    }

    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } }
            ],
            NOT: {
                id: session.user.id // Exclude current user
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true
        }
    })

    return NextResponse.json(users)
} 