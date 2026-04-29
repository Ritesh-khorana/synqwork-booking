import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "synqwork.com" },
      { protocol: "https", hostname: "www.synqwork.com" },
    ],
  },
};

export default nextConfig;
