import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prismadb'

export async function POST(request: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await request.json()
        const { files } = body

        // Update user verification status
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                verificationStatus: 'PENDING',
                verificationDocuments: {
                    create: files.map((file: any) => ({
                        type: file.type,
                        url: file.url,
                        uploadedAt: new Date()
                    }))
                }
            }
        })

        return NextResponse.json({ status: 'PENDING' })
    } catch (error) {
        console.error('Error submitting verification:', error)
        return new NextResponse('Error submitting verification', { status: 500 })
    }
} 