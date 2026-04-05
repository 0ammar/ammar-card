import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false, 
  allowedDevOrigins: ["192.168.10.67"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
};

export default nextConfig;