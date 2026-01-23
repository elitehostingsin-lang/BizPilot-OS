import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.twblocks.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://awofmvawjtaarkugxxww.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3b2ZtdmF3anRhYXJrdWd4eHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODQ3ODEsImV4cCI6MjA4NDU2MDc4MX0.5LdZqE2qxN516JcegFhKiU7k7jA7iJ4ri8B92wG10CQ',
  },
};

export default nextConfig;
