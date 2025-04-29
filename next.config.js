/** @type {import("next").NextConfig} */
const nextConfig = {
  // Enable static image imports
  images: {
    unoptimized: true,
  },
  // Disable strict mode for development
  reactStrictMode: false,
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ensure static export
  output: "export",
};

module.exports = nextConfig;

