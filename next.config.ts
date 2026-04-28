import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverActions: {
      allowedOrigins: [
        'a249-2409-40f0-11d1-ad16-2c93-26ed-319a-a530.ngrok-free.app',
        '3f9f-2409-40f0-11d1-ad16-2c93-26ed-319a-a530.ngrok-free.app'
      ],
    }
  },

  compress: true,

  headers: async () => [],
};

export default nextConfig;