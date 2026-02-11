/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/v0-sales-engineer-prep",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
