/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove output config to allow default server-side rendering
  // which properly handles dynamic routes
};

module.exports = nextConfig;