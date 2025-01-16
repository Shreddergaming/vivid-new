import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DatabaseService } from '@/lib/mongodb/utils';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        console.log('Session:', session);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        console.log('Rental Data:', data);

        const rentalData = {
            ...data,
            userId: session.user.id,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await DatabaseService.createRental(rentalData);
        console.log('Created Rental:', result);

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Detailed error:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: 'Failed to create rental', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to create rental' }, { status: 500 });
    }
}

export async function GET() {
    try {
        console.log('Fetching all rentals...')
        const rentals = await DatabaseService.getAllRentals()
        console.log('Rentals found:', rentals.length)
        return NextResponse.json(rentals)
    } catch (error) {
        console.error('Error fetching rentals:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}