/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["fonts.googleapis.com", "fonts.gstatic.com"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
