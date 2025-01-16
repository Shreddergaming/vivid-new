import { Metadata } from 'next'
import { headers } from 'next/headers'

async function fetchRental(id: string) {
    const headersList = headers()
    const domain = headersList.get('host') || 'localhost:3000'
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

    const response = await fetch(`${protocol}://${domain}/api/rentals/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch rental')
    }

    return response.json()
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    try {
        const rental = await fetchRental(params.id)

        return {
            title: `${rental.title} | Vivid Rentals`,
            description: rental.description?.slice(0, 155) + '...',
            openGraph: {
                title: rental.title,
                description: rental.description?.slice(0, 155) + '...',
                images: rental.photos?.map((photo: string) => ({
                    url: photo,
                    width: 1200,
                    height: 630,
                    alt: rental.title
                })) || []
            }
        }
    } catch (error) {
        return {
            title: 'Rental | Vivid Rentals',
            description: 'View this amazing rental property'
        }
    }
}

export default function RentalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
} 