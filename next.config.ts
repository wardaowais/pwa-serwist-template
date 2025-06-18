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
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
  },
};

export default withSerwist(nextConfig);



