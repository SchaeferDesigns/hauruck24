import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/deploy";

/* Beim statischen Export als Datei erzeugt. Die Vorschau entfernt sie wieder. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
