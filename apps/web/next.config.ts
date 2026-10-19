import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   env: {
    NEXT_PUBLIC_APP_VERSION: "0.6.2",
    NEXT_PUBLIC_API_VERSION: "0.3.0",
  },
};

export default nextConfig;
