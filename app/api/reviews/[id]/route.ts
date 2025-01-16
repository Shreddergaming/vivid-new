import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const reviewDoc = await getDoc(doc(db, 'reviews', params.id))

        if (!reviewDoc.exists()) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 })
        }

        return NextResponse.json({ id: reviewDoc.id, ...reviewDoc.data() })
    } catch (error) {
        console.error('Error fetching review:', error)
        return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { rating, comment } = await request.json()

        await updateDoc(doc(db, 'reviews', params.id), { rating, comment })

        return NextResponse.json({ message: 'Review updated successfully' })
    } catch (error) {
        console.error('Error updating review:', error)
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await deleteDoc(doc(db, 'reviews', params.id))

        return NextResponse.json({ message: 'Review deleted successfully' })
    } catch (error) {
        console.error('Error deleting review:', error)
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }
}