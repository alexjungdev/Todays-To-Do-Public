/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    async rewrites() {
        return [
          {
            source: '/api/auth',
            destination: `${process.env.API_URL_AUTH}`,
          },
          {
            source: '/api/database',
            destination: `${process.env.API_URL_DATABASE}`,
          },
        ];
      },
};

export default nextConfig;
