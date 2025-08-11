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
  },
};

export default nextConfig;
