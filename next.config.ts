import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure we handle client components properly
  experimental: {
    appDir: true,
  }
};

export default nextConfig;
