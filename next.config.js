/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    // Stub optional packages that are not installed
    config.resolve.alias = {
      ...config.resolve.alias,
      '@safe-global/safe-apps-sdk': false,
      '@safe-global/safe-apps-provider': false,
      'pino-pretty': false,
      'encoding': false,
    }
    return config
  },
}

module.exports = nextConfig
