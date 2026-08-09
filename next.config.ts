import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // كل صفحة تُصدَّر كـ about/index.html — يعمل على أي استضافة ثابتة عبر /about/
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
