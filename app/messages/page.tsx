'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Avatar from "@/components/Avatar"
import { SearchHeader } from "@/components/SearchHeader"

interface User {
    id: string
    name: string
    email: string
    image?: string
}

interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    timestamp: Date
}

export default function MessagesPage() {
    const { data: session } = useSession()
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')

    // Search for users
    const handleSearch = async () => {
        try {
            const response = await fetch(`/api/users/search?q=${searchQuery}`)
            const data = await response.json()
            setUsers(data)
        } catch (error) {
            console.error('Error searching users:', error)
        }
    }

    // Send a message
    const sendMessage = async () => {
        if (!selectedUser || !newMessage.trim()) return

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: selectedUser.id,
                    content: newMessage
                })
            })

            if (response.ok) {
                setNewMessage('')
                // Refresh messages
                fetchMessages()
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    // Fetch messages for selected user
    const fetchMessages = async () => {
        if (!selectedUser) return

        try {
            const response = await fetch(`/api/messages?userId=${selectedUser.id}`)
            const data = await response.json()
            setMessages(data)
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }

    useEffect(() => {
        if (selectedUser) {
            fetchMessages()
        }
    }, [selectedUser])

    return (
        <main className="flex min-h-screen flex-col">
            <SearchHeader />
            <div className="container mx-auto px-4 pt-24">
                <Card className="grid grid-cols-12 gap-4 h-[calc(100vh-150px)]">
                    {/* Users sidebar */}
                    <div className="col-span-4 border-r p-4">
                        <div className="flex gap-2 mb-4">
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch}>Search</Button>
                        </div>
                        <div className="overflow-y-auto h-[calc(100vh-250px)]">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 
                                        ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
                                >
                                    <Avatar src={user.image} />
                                    <div>
                                        <p className="font-semibold">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                            {users.length === 0 && searchQuery && (
                                <p className="text-center text-gray-500 mt-4">No users found</p>
                            )}
                        </div>
                    </div>

                    {/* Chat area */}
                    <div className="col-span-8 flex flex-col">
                        {selectedUser ? (
                            <>
                                <div className="p-4 border-b flex items-center gap-3">
                                    <Avatar src={selectedUser.image} />
                                    <div>
                                        <p className="font-semibold">{selectedUser.name}</p>
                                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`mb-4 ${message.senderId === session?.user?.id ? 'text-right' : 'text-left'}`}
                                        >
                                            <div
                                                className={`inline-block p-3 rounded-lg ${message.senderId === session?.user?.id
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 border-t">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Type a message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        />
                                        <Button onClick={sendMessage}>Send</Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a user to start messaging
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </main>
    )
} 