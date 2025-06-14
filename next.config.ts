import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  // Your Next.js configuration options here
  reactStrictMode: true,
  // ... other settings
};

export default withSerwist(nextConfig);
