/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone", // Revert to standalone to support dynamic API routes
  trailingSlash: false, // Keep trailingSlash: false
};

export default nextConfig;

