import type { NextConfig } from "next";

const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export",
  // output: isExport ? "export" : undefined,
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
