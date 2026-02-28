import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@dofinity/mosaic-core",
    "@dofinity/mosaic-auth",
    "openai",
    "winston",
    "events",
    "dotenv",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize server-only packages to avoid webpack resolution issues
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : config.externals ? [config.externals] : []),
        "@dofinity/mosaic-core",
        "@dofinity/mosaic-auth",
        "winston",
        "dotenv",
        "events",
        "openai",
        /^@dofinity\/.*/,
      ];
    }
    return config;
  },
};

export default nextConfig;
