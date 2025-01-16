// pages/api/rentals/[id]/block-days.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.query
    const { blockedDays } = req.body

    if (!Array.isArray(blockedDays)) {
        return res.status(400).json({ message: 'Invalid blocked days' })
    }

    const client = await clientPromise
    const rentalsCollection = client.db().collection('rentals')

    const rental = await rentalsCollection.findOne({ _id: new ObjectId(id as string) })

    if (!rental) {
        return res.status(404).json({ message: 'Rental not found' })
    }

    if (!session?.user?.id || rental.userId !== session.user.id) {
        return res.status(403).json({ message: 'Forbidden' })
    }

    await rentalsCollection.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { blockedDays } }
    )

    res.status(200).json({ message: 'Blocked days updated' })
}