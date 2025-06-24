/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Remove static export - not suitable for dynamic routes
  // Keep server-side rendering for proper dynamic route handling
};

module.exports = nextConfig;