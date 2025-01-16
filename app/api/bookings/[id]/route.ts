import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const bookingDoc = await getDoc(doc(db, 'bookings', params.id))

        if (!bookingDoc.exists()) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json({ id: bookingDoc.id, ...bookingDoc.data() })
    } catch (error) {
        console.error('Error fetching booking:', error)
        return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
    }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const { status } = await request.json()

        await updateDoc(doc(db, 'bookings', params.id), { status })

        return NextResponse.json({ message: 'Booking updated successfully' })
    } catch (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await deleteDoc(doc(db, 'bookings', params.id))

        return NextResponse.json({ message: 'Booking cancelled successfully' })
    } catch (error) {
        console.error('Error cancelling booking:', error)
        return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 })
    }
}