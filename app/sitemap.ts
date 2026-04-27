import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://planesound.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE}/`,          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/diagnosis`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/dashboard`, lastModified: now, changeFrequency: "daily",   priority: 0.8 },
  ];
}
