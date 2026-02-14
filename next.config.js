/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better error detection
  reactStrictMode: true,

  // Output standalone for Azure Static Web Apps compatibility
  output: 'standalone',

  // Environment variables accessible client-side (NEXT_PUBLIC_ prefix)
  env: {
    NEXT_PUBLIC_ENABLE_TELEMETRY: process.env.NEXT_PUBLIC_ENABLE_TELEMETRY || 'false',
  },

  // Image optimization configuration
  images: {
    unoptimized: true, // Azure SWA doesn't support Next.js image optimization
  },
};

module.exports = nextConfig;
