/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignora errores de ESLint en producción
  },
  typescript: {
    ignoreBuildErrors: true,  // ✅ Ignora errores de TypeScript en producción
  },
}

module.exports = nextConfig
