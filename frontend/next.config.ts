import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //to allow image from cloudinary
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
