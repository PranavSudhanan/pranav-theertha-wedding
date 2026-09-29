import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The RSVP route attaches the invitation, so the PDF has to travel with
  // the serverless function — public/ alone is only served statically.
  outputFileTracingIncludes: {
    "/api/rsvp": ["./public/invitation.pdf"],
  },
};

export default nextConfig;
