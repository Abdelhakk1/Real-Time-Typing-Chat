/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Configure for server-side rendering to handle dynamic routes properly
  output: 'standalone',
};

module.exports = nextConfig;