import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  typedRoutes: true,
  images: { qualities: [100, 75] },
}

export default nextConfig
