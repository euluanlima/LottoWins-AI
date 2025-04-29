import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // Add this line for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig

