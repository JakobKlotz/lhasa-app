/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    const isDevelopment = process.env.NEXT_ENV === 'development';
    const apiUrl = isDevelopment ? 'http://localhost:8000' : process.env.NEXT_PUBLIC_API_URL;

    return [
      {
        source: "/:path*",
        destination: apiUrl + "/:path*",
      },
      {
        source: "/docs",
        destination: apiUrl + "/docs",
      },
      {
        source: "/openapi.json",
        destination: apiUrl + "/openapi.json",
      },
    ];
  },
};

module.exports = nextConfig;