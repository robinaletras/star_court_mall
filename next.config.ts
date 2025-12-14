import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Vercel deployment (recommended for Next.js)
  // No special config needed - Vercel handles it automatically
  
  // For static export (Firebase Hosting, Netlify, etc.)
  // Note: This won't work with dynamic routes that need SSR
  // output: 'export',
  
  // For standalone deployment (Docker, custom server)
  // output: 'standalone',
};

export default nextConfig;
