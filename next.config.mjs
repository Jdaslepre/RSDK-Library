/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};

export default nextConfig;
