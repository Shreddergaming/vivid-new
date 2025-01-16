'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import ListingPreview from '@/components/ListingPreview'

interface PhotoFile {
    id: string
    file: File
    preview: string
}

export default function PhotosPage() {
    const [photos, setPhotos] = useState<PhotoFile[]>([])
    const [showPreview, setShowPreview] = useState(false)
    const [uploading, setUploading] = useState(false)
    const router = useRouter()

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newPhotos = files.map(file => ({
            id: Math.random().toString(36),
            file,
            preview: URL.createObjectURL(file)
        }))
        setPhotos(prev => [...prev, ...newPhotos])
    }

    const onDragEnd = (result: any) => {
        if (!result.destination) return
        const items = Array.from(photos)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        setPhotos(items)
    }

    const handleSubmit = async () => {
        setUploading(true)
        try {
            const uploadedUrls = await Promise.all(
                photos.map(async (photo) => {
                    const formData = new FormData()
                    formData.append('file', photo.file)
                    const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData
                    })
                    const data = await response.json()
                    return data.url
                })
            )

            // Store the photo URLs in order
            const response = await fetch('/api/listings/photos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photos: uploadedUrls })
            })

            if (response.ok) {
                router.push('/add-rental/verification')
            }
        } catch (error) {
            console.error('Error uploading photos:', error)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Upload and Arrange Photos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="mb-4"
                        />
                        <Button
                            onClick={() => setShowPreview(true)}
                            disabled={photos.length === 0}
                            className="mr-4"
                        >
                            Preview Listing
                        </Button>
                    </div>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="photos" direction="horizontal">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                >
                                    {photos.map((photo, index) => (
                                        <Draggable
                                            key={photo.id}
                                            draggableId={photo.id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="relative aspect-square"
                                                >
                                                    <Image
                                                        src={photo.preview}
                                                        alt="Property photo"
                                                        fill
                                                        className="object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => {
                                                            const newPhotos = [...photos]
                                                            newPhotos.splice(index, 1)
                                                            setPhotos(newPhotos)
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div className="mt-6">
                        <Button
                            onClick={handleSubmit}
                            disabled={photos.length === 0 || uploading}
                        >
                            {uploading ? 'Uploading...' : 'Continue to Verification'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {showPreview && (
                <ListingPreview
                    photos={photos.map(p => p.preview)}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    )
} 