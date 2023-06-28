/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
    ],
  },
  experimental: {
    appDir: true
  }
}


module.exports = nextConfig
