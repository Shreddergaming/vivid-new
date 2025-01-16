'use client'

interface ListingPreviewProps {
    photos: string[]
    onClose: () => void
}

export default function ListingPreview({ photos, onClose }: ListingPreviewProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg max-w-4xl w-full">
                {/* Preview content */}
            </div>
        </div>
    )
} 