import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { DatabaseService } from '@/lib/mongodb/utils'

export async function POST(request: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { hostId, message } = await request.json()

        const result = await DatabaseService.createMessage({
            senderId: session.user.id,
            receiverId: hostId,
            content: message,
            createdAt: new Date()
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error sending message:', error)
        return new NextResponse('Error sending message', { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const hostId = searchParams.get('hostId')

        if (!hostId) {
            return new NextResponse('Host ID required', { status: 400 })
        }

        const messages = await DatabaseService.getMessages(session.user.id, hostId)
        return NextResponse.json(messages)
    } catch (error) {
        console.error('Error fetching messages:', error)
        return new NextResponse('Error fetching messages', { status: 500 })
    }
} 