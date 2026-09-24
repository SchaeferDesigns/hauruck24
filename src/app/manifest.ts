import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { withBase } from "@/lib/deploy";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}, ${site.claim}`,
    short_name: site.shortName,
    description: site.description,
    start_url: withBase("/"),
    scope: withBase("/"),
    display: "standalone",
    background_color: "#04070d",
    theme_color: "#04070d",
    lang: "de",
    icons: [{ src: withBase("/icon.svg"), sizes: "any", type: "image/svg+xml" }],
  };
}
