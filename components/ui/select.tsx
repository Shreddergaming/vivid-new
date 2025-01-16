import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    children: React.ReactNode
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, placeholder, children }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {value || placeholder || 'Select an option'}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-input bg-popover shadow-md">
                    {children}
                </div>
            )}
        </div>
    )
}

interface SelectItemProps {
    value: string
    children: React.ReactNode
    onSelect: (value: string) => void
}

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, onSelect }) => {
    return (
        <button
            type="button"
            className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onClick={() => onSelect(value)}
        >
            {children}
        </button>
    )
}

export const SelectTrigger = Select
export const SelectContent = ({ children }: { children: React.ReactNode }) => children
export const SelectValue = ({ children }: { children: React.ReactNode }) => <>{children}</>