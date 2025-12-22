import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    products: { stale: 0, revalidate: Infinity, expire: Infinity },
  },
  reactCompiler: true,
  typedRoutes: true,
  images: { qualities: [100, 75] },
}

export default nextConfig
