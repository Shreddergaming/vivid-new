'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface MessageModalProps {
    isOpen: boolean
    onClose: () => void
    hostId: string
    hostName: string
}

export function MessageModal({ isOpen, onClose, hostId, hostName }: MessageModalProps) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const { toast } = useToast()

    const handleSend = async () => {
        if (!message.trim()) return

        setSending(true)
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hostId, message })
            })

            if (response.ok) {
                toast({
                    title: "Message sent",
                    description: "Your message has been sent to the host",
                })
                onClose()
            }
        } catch (error) {
            console.error('Error sending message:', error)
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive"
            })
        } finally {
            setSending(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Message {hostName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Textarea
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSend} disabled={sending}>
                            {sending ? 'Sending...' : 'Send Message'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 