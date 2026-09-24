import { services } from "@/content/services";
import { allPlaces } from "@/content/areas";
import { site } from "@/content/site";
import { SITE_URL, pageUrl } from "@/lib/deploy";

/**
 * Strukturierte Daten fuer die lokale Suche.
 * Nur belegbare Angaben. Keine Bewertungen und keine Preise,
 * solange dafuer keine echten Daten vorliegen.
 */
export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "@id": `${SITE_URL}/#organisation`,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: `${SITE_URL}/`,
    telephone: site.contact.phoneHref,
    faxNumber: site.contact.faxDisplay,
    email: site.contact.email,
    image: `${SITE_URL}/og.png`,
    priceRange: "auf Anfrage",
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.lat,
      longitude: site.address.lng,
    },
    openingHoursSpecification: site.openingHoursSpec.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.days.map((day) => `https://schema.org/${day}`),
      opens: entry.opens,
      closes: entry.closes,
    })),
    areaServed: allPlaces.map((place) => ({ "@type": "City", name: place })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Leistungen",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.label,
          description: service.teaser,
          url: pageUrl(`/leistungen/${service.slug}/`),
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: site.name,
    inLanguage: "de-DE",
    publisher: { "@id": `${SITE_URL}/#organisation` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; href: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: pageUrl(item.href === "/" ? "/" : `${item.href.replace(/\/+$/, "")}/`),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  slug,
}: {
  name: string;
  description: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: pageUrl(`/leistungen/${slug}/`),
    provider: { "@id": `${SITE_URL}/#organisation` },
    areaServed: allPlaces.slice(0, 20).map((place) => ({ "@type": "City", name: place })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
