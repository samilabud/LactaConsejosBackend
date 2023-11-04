/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: "http://localhost:3080",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3080",
        pathname: "/images/articles/**",
      },
    ],
  },
};

module.exports = nextConfig;
