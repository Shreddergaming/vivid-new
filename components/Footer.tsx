import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t">
            <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">EzyRent</h3>
                        <p className="text-sm text-gray-600">
                            Find your perfect rental with ease. EzyRent makes it simple to discover and book amazing places to stay.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm uppercase mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link></li>
                            <li><Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900">Careers</Link></li>
                            <li><Link href="/press" className="text-sm text-gray-600 hover:text-gray-900">Press</Link></li>
                            <li><Link href="/policies" className="text-sm text-gray-600 hover:text-gray-900">Policies</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm uppercase mb-4">Discover</h4>
                        <ul className="space-y-2">
                            <li><Link href="/trust-and-safety" className="text-sm text-gray-600 hover:text-gray-900">Trust & Safety</Link></li>
                            <li><Link href="/travel-credit" className="text-sm text-gray-600 hover:text-gray-900">Travel Credit</Link></li>
                            <li><Link href="/gift-cards" className="text-sm text-gray-600 hover:text-gray-900">Gift Cards</Link></li>
                            <li><Link href="/ezyrent-citizen" className="text-sm text-gray-600 hover:text-gray-900">EzyRent Citizen</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm uppercase mb-4">Hosting</h4>
                        <ul className="space-y-2">
                            <li><Link href="/host-your-home" className="text-sm text-gray-600 hover:text-gray-900">Host Your Home</Link></li>
                            <li><Link href="/host-an-experience" className="text-sm text-gray-600 hover:text-gray-900">Host an Experience</Link></li>
                            <li><Link href="/responsible-hosting" className="text-sm text-gray-600 hover:text-gray-900">Responsible Hosting</Link></li>
                            <li><Link href="/host-resources" className="text-sm text-gray-600 hover:text-gray-900">Host Resources</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-gray-600">
                        © {new Date().getFullYear()} EzyRent, Inc. All rights reserved.
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Facebook</span>
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Instagram</span>
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer