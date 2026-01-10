/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@myglambeauty/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'image2url.com',
      },
    ],
  },
};

module.exports = nextConfig;
