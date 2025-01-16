'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import SearchBar from '@/components/SearchInterface'
import { FiltersDialog } from '@/components/FiltersDialog'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import ListingCard from '@/components/ListingCard'

export default function Home() {
  const router = useRouter()
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch('/api/rentals')
        if (response.ok) {
          const data = await response.json()
          setRentals(data)
        }
      } catch (error) {
        console.error('Error fetching rentals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRentals()
  }, [])

  const handleSearch = (params: URLSearchParams) => {
    router.push(`/search?${params.toString()}`)
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Image src="/vivid-logo.png" alt="Vivid" width={100} height={32} />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/add-rental">
              <Button variant="ghost">List Your Property</Button>
            </Link>
            <Button variant="ghost">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Interface */}
      <div className="bg-white py-6">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <section className="my-8">
          <div className="flex overflow-x-auto gap-8 pb-4">
            {/* Property type icons */}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured places to stay</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rentals.filter(rental => rental.featured).map((rental) => (
              <ListingCard
                key={rental.id}
                listing={rental}
                onToggleFavorite={() => {/* Add favorite logic */ }}
              />
            ))}
            {rentals.filter(rental => rental.featured).length === 0 && rentals[0] && (
              <div className="rental-card">
                {/* Show first rental as featured if no featured rentals */}
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">All places to stay</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {rentals.map((rental) => (
              <ListingCard
                key={rental.id}
                listing={rental}
                onToggleFavorite={() => {/* Add favorite logic */ }}
              />
            ))}
            {rentals.length === 0 && !loading && (
              <p className="text-gray-500 col-span-3 text-center">
                No listings available yet.
              </p>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Button className="bg-purple-500 text-white hover:bg-purple-600">
              Show more
            </Button>
          </div>
        </section>
      </main>
    </>
  )
}