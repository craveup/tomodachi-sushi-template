import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.cdn4dd.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "doordash-static.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    // Optimize images for better performance
    formats: ["image/webp", "image/avif"],
    deviceSizes: [120, 240, 480, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable aggressive optimization for local images
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
};

export default nextConfig;
