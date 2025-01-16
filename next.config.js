/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'v0.blob.com',
                pathname: '/**',
            }
        ],
        domains: ['placehold.co'],
        domains: [
            'vivid-rentals.s3.us-east-2.amazonaws.com',
            'lh3.googleusercontent.com', // For Google OAuth profile pictures
        ]
    },
}

module.exports = nextConfig