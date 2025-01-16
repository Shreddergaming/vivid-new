'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface ImageGalleryProps {
    images: string[]
    title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [showGallery, setShowGallery] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    const next = () => setCurrentIndex((i) => (i + 1) % images.length)
    const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length)

    return (
        <>
            {/* Main Grid */}
            <div className="grid grid-cols-4 gap-2 mb-8 rounded-lg overflow-hidden cursor-pointer">
                <div
                    className="col-span-2 row-span-2 relative aspect-square"
                    onClick={() => setShowGallery(true)}
                >
                    <Image
                        src={images[0]}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={true}
                        className="object-cover hover:opacity-90 transition"
                    />
                </div>
                {images.slice(1, 5).map((photo, index) => (
                    <div
                        key={index}
                        className="relative aspect-square"
                        onClick={() => {
                            setCurrentIndex(index + 1)
                            setShowGallery(true)
                        }}
                    >
                        <Image
                            src={photo}
                            alt={`${title} - ${index + 2}`}
                            fill
                            className="object-cover hover:opacity-90 transition"
                        />
                    </div>
                ))}
            </div>

            {/* Gallery Modal */}
            <Dialog open={showGallery} onOpenChange={setShowGallery}>
                <DialogContent className="max-w-5xl h-[80vh] p-0">
                    <div className="relative h-full">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 z-10"
                            onClick={() => setShowGallery(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src={images[currentIndex]}
                                alt={`${title} - ${currentIndex + 1}`}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2"
                            onClick={prev}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={next}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                            <span className="bg-black/50 text-white px-4 py-2 rounded-full">
                                {currentIndex + 1} / {images.length}
                            </span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 