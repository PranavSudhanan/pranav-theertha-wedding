import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // next dev writes AGENTS.md and CLAUDE.md into the repo root on every
  // start. Nothing here reads them, so keep them out of the tree.
  agentRules: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Photographs uploaded through the admin panel live in Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  // The RSVP route attaches the invitation, so the PDF has to travel with
  // the serverless function — public/ alone is only served statically.
  outputFileTracingIncludes: {
    "/api/rsvp": ["./public/invitation.pdf"],
  },
};

export default nextConfig;
