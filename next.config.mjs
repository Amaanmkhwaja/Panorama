/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io",
      "img.clerk.com",
      "subdomain",
      "files.stripe.com",
      "avatars.githubusercontent.com",
      "images.unsplash.com",
      "res.cloudinary.com",
      "pbs.twimg.com",
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
