/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
      return [
        {
          source: "/:path*",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/:path*"
              : "/",
        },
        {
          source: "/docs",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/docs"
              : "/docs",
        },
        {
          source: "/openapi.json",
          destination:
            process.env.NODE_ENV === "development"
              ? "http://127.0.0.1:8000/openapi.json"
              : "/openapi.json",
        },
      ];
    },
    outputFileTracingExcludes: {
      '*': [
        "**/*.pyc",
        "**/__pycache__/**",
        ".env",
        ".git/**",
        ".venv/**",
        "automations/**",
        "docs/**",
        "logdir/**",
        "tests/**",
        "prisma/migrations/**",
        "Dockerfile",
        "README.md",
        "pytest.ini",
        "package.json",
        ".next",
        "node_modules",
        ".vercel_cache/**",
        "env/lib/python*/site-packages/**"
      ]
    }
  };
  
  module.exports = nextConfig;