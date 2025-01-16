'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
// ... (other imports)

interface PropertySubmissionFormProps {
    isDarkMode: boolean;
}

export default function PropertySubmissionForm({ isDarkMode }: PropertySubmissionFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [bedrooms, setBedrooms] = useState('1')
    const [bathrooms, setBathrooms] = useState('1')
    const [maxGuests, setMaxGuests] = useState('1')
    const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' })
    const [images, setImages] = useState<File[]>([])
    const [blockedDates, setBlockedDates] = useState<Date[]>([])

    const { data: session } = useSession()
    const router = useRouter()

    // ... (existing functions)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!session) {
            alert('You must be logged in to add a rental')
            router.push('/login')
            return
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('category', category)
        formData.append('location', JSON.stringify(location))
        formData.append('bedrooms', bedrooms)
        formData.append('bathrooms', bathrooms)
        formData.append('maxGuests', maxGuests)
        formData.append('blockedDates', JSON.stringify(blockedDates))
        images.forEach((image, index) => {
            formData.append(`image${index}`, image)
        })

        try {
            const response = await fetch('/api/rentals/add', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                router.push('/manage-rentals')
            } else {
                console.error('Failed to create listing')
            }
        } catch (error) {
            console.error('Error creating listing:', error)
        }
    }

    // ... (rest of the component)
}