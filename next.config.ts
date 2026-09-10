import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Parallel local agents may set CC_DIST=.next-<name>. Do not leave those trees in the root.
  distDir: process.env.CC_DIST || ".next",
};

export default nextConfig;
