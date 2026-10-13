import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   env: {
    NEXT_PUBLIC_APP_VERSION: "0.2.4",
    NEXT_PUBLIC_API_VERSION: "0.1.3",
  },
};

export default nextConfig;
