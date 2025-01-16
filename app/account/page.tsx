'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'

export default function AccountPage() {
    const { data: session, update } = useSession()
    const [profileImage, setProfileImage] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [bio, setBio] = useState('')

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '')
            setEmail(session.user.email || '')
            setProfileImage(session.user.image || null)
        }
    }, [session])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const formData = new FormData()
            formData.append('file', file)

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (response.ok) {
                    const { url } = await response.json()
                    setProfileImage(url)
                    // Update session with new image
                    await update({ image: url })
                }
            } catch (error) {
                console.error('Error uploading image:', error)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Add API call to update user profile
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-32 h-32">
                                <Image
                                    src={profileImage || '/placeholder.png'}
                                    alt="Profile"
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <div>
                                <Label htmlFor="photo">Profile Photo</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    className="w-full p-2 border rounded"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                />
                            </div>
                        </div>

                        <Button type="submit">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 