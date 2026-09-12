/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/index.html',
        },
      ],
    }
  },
};

export default nextConfig;
