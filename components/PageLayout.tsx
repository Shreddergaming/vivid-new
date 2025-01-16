import React from 'react'

interface PageLayoutProps {
    children: React.ReactNode
    title: string
}

export default function PageLayout({ children, title }: PageLayoutProps) {
    return (
        <div className="md:pl-64 flex flex-col min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-purple-500">{title}</h1>
                </div>
            </header>
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}