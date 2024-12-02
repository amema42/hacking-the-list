// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Ignora ESLint durante la build
  },
  images: {
    domains: ['avatar.vercel.sh'],
  },
  typescript: {
    ignoreBuildErrors: true,  // Ignora gli errori di tipo durante la build
  },
  reactStrictMode: true,  // Puoi lasciare questa opzione come vuoi, utile per debug
};

export default nextConfig;
