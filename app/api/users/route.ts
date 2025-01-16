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
        const user = await client.db()
            .collection('users')
            .findOne({ _id: new ObjectId(session.user.id) })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Remove sensitive information
        const { password, ...safeUser } = user
        return NextResponse.json(safeUser)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const updates = await request.json()
        const client = await clientPromise

        // Remove sensitive fields from updates
        delete updates.password
        delete updates._id
        delete updates.email // Prevent email changes through this endpoint

        await client.db()
            .collection('users')
            .updateOne(
                { _id: new ObjectId(session.user.id) },
                { $set: updates }
            )

        return NextResponse.json({ message: 'Profile updated successfully' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
} 