import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    formats: ['image/webp', 'image/avif']
  },
  compress: true,
}

export default nextConfig
