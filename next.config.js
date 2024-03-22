/** @type {import('next').NextConfig} */
const nextConfig = {
  // disable type checking
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: "export",
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  }
};

module.exports = nextConfig;
