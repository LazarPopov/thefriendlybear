/** @type {import('next').NextConfig} */
const menuDownloadHeaders = [
  {
    key: "Content-Type",
    value: "application/pdf"
  },
  {
    key: "Content-Disposition",
    value: 'attachment; filename="the-friendly-bear-menu-bg.pdf"'
  },
  {
    key: "Cache-Control",
    value: "public, max-age=0, must-revalidate"
  }
];

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/files/the-friendly-bear-menu-bg.pdf",
        headers: menuDownloadHeaders
      },
      {
        source: "/files/the-friendly-bear-menu-en.pdf",
        headers: menuDownloadHeaders.map((header) =>
          header.key === "Content-Disposition"
            ? {
                ...header,
                value: 'attachment; filename="the-friendly-bear-menu-en.pdf"'
              }
            : header
        )
      }
    ];
  }
};

export default nextConfig;
