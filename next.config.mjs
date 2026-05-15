/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.lnr.fr" },
      { protocol: "https", hostname: "**.lnr.fr" },
    ],
  },
}

export default nextConfig
