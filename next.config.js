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
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['img.clerk.com', 'images.clerk.dev'],
  },
  reactStrictMode: true,
  experimental: {
    optimizeCss: false,
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
};

module.exports = nextConfig; 