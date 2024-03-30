/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        port: 'https',
        hostname: 'uploadthing.com',
      },
      { port: 'https', hostname: 'utfs.io' },
    ],
  },
};

export default nextConfig;
