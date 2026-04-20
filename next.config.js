/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "skyborne-images.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
