/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: '/',
          destination: '/mobile.html',
        },
        {
          source: '/:path*',
          destination: '/mobile.html',
        },
      ],
    }
  },
};

export default nextConfig;
