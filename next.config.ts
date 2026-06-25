import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    FASTAPI_URL: process.env.FASTAPI_URL ?? "http://localhost:8000",
  },
};

export default nextConfig;
