/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['picsum.photos', 'i.pravatar.cc'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'nllylmjqgcmjjmueltux.supabase.co',
      },
    ],
  },  /* config options here */
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig; 