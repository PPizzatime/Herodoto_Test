/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/:path*',
          destination: '/mobile.html',
        },
      ],
    }
  },
};

export default nextConfig;
