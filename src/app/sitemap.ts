import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { pageUrl } from "@/lib/deploy";

/* Beim statischen Export als Datei erzeugt. Die Vorschau entfernt sie wieder. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/leistungen/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/angebot/", priority: 0.9, changeFrequency: "monthly" },
    { path: "/kontakt/", priority: 0.8, changeFrequency: "monthly" },
    { path: "/ablauf/", priority: 0.7, changeFrequency: "monthly" },
    { path: "/einsatzgebiet/", priority: 0.7, changeFrequency: "monthly" },
    { path: "/ueber-uns/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq/", priority: 0.6, changeFrequency: "monthly" },
    { path: "/impressum/", priority: 0.3, changeFrequency: "yearly" },
    { path: "/datenschutz/", priority: 0.3, changeFrequency: "yearly" },
    { path: "/agb/", priority: 0.3, changeFrequency: "yearly" },
    { path: "/widerruf/", priority: 0.3, changeFrequency: "yearly" },
  ];

  return [
    ...core.map((entry) => ({
      url: pageUrl(entry.path),
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    })),
    ...services.map((service) => ({
      url: pageUrl(`/leistungen/${service.slug}/`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
