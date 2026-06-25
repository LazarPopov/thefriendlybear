/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "friendlybear.bg"
          }
        ],
        destination: "https://www.friendlybear.bg/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;
