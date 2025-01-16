import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getServerSession } from 'next-auth'

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
})

export async function POST(request: Request) {
    try {
        const session = await getServerSession()
        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as string

        if (!file || !type) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const fileKey = `verification/${session.user.id}/${type}-${Date.now()}-${file.name}`

        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: buffer,
                ContentType: file.type,
                ACL: 'private', // Keep verification docs private
            })
        )

        const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`
        return NextResponse.json({ url, type })
    } catch (error) {
        console.error('Error uploading verification file:', error)
        return new NextResponse('Error uploading file', { status: 500 })
    }
} 