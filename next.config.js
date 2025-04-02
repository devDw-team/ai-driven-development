/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'nllylmjqgcmjjmueltux.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
  },
};

module.exports = nextConfig; 