/** @type {import('next').NextConfig} */
const nextConfig = {
  // images, fonts and videos in public/ are cached by browsers for a year (page speed).
  // If you replace one of these files, give the new file a new name so visitors get it.
  async headers() {
    return [
      {
        source: "/:path*.:ext(webp|avif|png|jpg|jpeg|gif|svg|ico|woff|woff2|mp4|webm)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  images: {
    minimumCacheTTL: 31536000, // resized photos stay cached for a year (page speed)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "extrain-web-server.vercel.app",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
