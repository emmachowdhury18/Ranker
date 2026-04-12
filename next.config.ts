import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: process.env.NODE_ENV === 'production' ? '/Ranker' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
