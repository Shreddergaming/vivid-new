import { Inter } from 'next/font/google'
import './globals.css'
import Providers from "@/components/Providers"
import { SearchHeader } from "@/components/SearchHeader"
import { Toaster } from "@/components/ui/toaster"
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "Vivid",
  description: "Find your perfect rental",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <SearchHeader />
          {children}
          <Toaster />
        </Providers>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry`}
        />
      </body>
    </html>
  )
}