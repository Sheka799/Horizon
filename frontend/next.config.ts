import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SERVER_URL: process.env.SERVER_URL,
    NEXT_PUBLIC_YANDEX_SMART_CAPTCHA_CLIENT_KEY: process.env.NEXT_PUBLIC_YANDEX_SMART_CAPTCHA_CLIENT_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net'
      }
    ]
  }
};

export default nextConfig;
