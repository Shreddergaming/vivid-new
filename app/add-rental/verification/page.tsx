'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

interface VerificationFile {
    id: string
    file: File
    preview: string
    type: 'id' | 'selfie'
}

export default function VerificationPage() {
    const [files, setFiles] = useState<VerificationFile[]>([])
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handleFileUpload = (type: 'id' | 'selfie') => async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const newFile = {
                id: Math.random().toString(36),
                file,
                preview: URL.createObjectURL(file),
                type
            }
            setFiles(prev => [...prev.filter(f => f.type !== type), newFile])
        }
    }

    const handleSubmit = async () => {
        if (files.length !== 2) return
        setUploading(true)

        try {
            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    const formData = new FormData()
                    formData.append('file', file.file)
                    formData.append('type', file.type)
                    const response = await fetch('/api/verification/upload', {
                        method: 'POST',
                        body: formData
                    })
                    return response.json()
                })
            )

            // Submit verification request
            const response = await fetch('/api/verification/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: uploadedFiles })
            })

            if (response.ok) {
                router.push('/add-rental/preview')
            }
        } catch (error) {
            console.error('Error uploading verification:', error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Verify Your Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label>Government-issued ID</Label>
                        <p className="text-sm text-gray-500 mb-2">
                            Upload a clear photo of your ID (passport, driver's license, etc.)
                        </p>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload('id')}
                            className="mb-2"
                        />
                        {files.find(f => f.type === 'id') && (
                            <div className="relative w-full h-48">
                                <Image
                                    src={files.find(f => f.type === 'id')!.preview}
                                    alt="ID Preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <Label>Selfie with ID</Label>
                        <p className="text-sm text-gray-500 mb-2">
                            Take a photo of yourself holding your ID next to your face
                        </p>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload('selfie')}
                            className="mb-2"
                        />
                        {files.find(f => f.type === 'selfie') && (
                            <div className="relative w-full h-48">
                                <Image
                                    src={files.find(f => f.type === 'selfie')!.preview}
                                    alt="Selfie Preview"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={files.length !== 2 || uploading}
                        className="w-full"
                    >
                        {uploading ? 'Uploading...' : 'Submit Verification'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
} 