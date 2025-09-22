/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow deployment even if ESLint finds issues during build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.stockx.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.goat.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
