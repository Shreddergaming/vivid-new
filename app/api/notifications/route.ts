import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const client = await clientPromise
        const notifications = await client.db()
            .collection('notifications')
            .find({
                userId: new ObjectId(session.user.id),
                read: false
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray()

        return NextResponse.json(notifications)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { type, message, targetId } = await request.json()
        const client = await clientPromise

        const notification = {
            userId: new ObjectId(session.user.id),
            type,
            message,
            targetId: targetId ? new ObjectId(targetId) : null,
            read: false,
            createdAt: new Date()
        }

        await client.db()
            .collection('notifications')
            .insertOne(notification)

        return NextResponse.json(notification)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
    }
} 