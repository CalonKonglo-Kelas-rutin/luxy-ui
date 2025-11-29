import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'causal-inessa-luxy-v2-f5f26f3b.koyeb.app',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
