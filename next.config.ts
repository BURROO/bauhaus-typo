import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export",
  async rewrites() {
    return [
      {
        source: '/websites/:path*/',
        destination: '/websites/:path*/index.html',
      },
      {
        source: '/websites/:path*',
        destination: '/websites/:path*/index.html',
      },
    ]
  },
};

export default nextConfig;
