import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: "0.8.0",
    NEXT_PUBLIC_API_VERSION: "0.4.0",
  },
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
