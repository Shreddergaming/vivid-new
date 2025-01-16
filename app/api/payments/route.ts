import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
})

export async function POST(request: Request) {
    const session = await getServerSession()
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { amount, bookingId } = await request.json()

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            metadata: {
                bookingId,
                userId: session.user.id
            }
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret
        })
    } catch (error) {
        return NextResponse.json({ error: 'Payment failed' }, { status: 500 })
    }
} 