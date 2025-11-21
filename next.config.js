/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for production builds (for IPFS deployment)
  // In development mode, Next.js needs full server capabilities
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

module.exports = nextConfig;


