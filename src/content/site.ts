/**
 * Zentrale Stammdaten der Website.
 * Alle Kontaktdaten und globalen Texte werden ausschliesslich hier gepflegt.
 * Aenderungen wirken automatisch auf Seiten, Footer, SEO und JSON-LD.
 */

export const site = {
  name: "Hauruck24 & Co.",
  shortName: "Hauruck24",
  legalName: "Hauruck24 & Co.",
  /** Produktions-Domain. Anpassen, sobald die Domain final ist. */
  url: "https://www.hauruck24.de",
  locale: "de-DE",
  claim: "Umzug, Entrümpelung und Transport in Schwäbisch Gmünd",
  tagline: "Anpacken statt aufschieben",
  description:
    "Hauruck24 & Co. aus Schwäbisch Gmünd Hussenhofen: Umzüge, Entrümpelungen, Haushaltsauflösungen, Kleintransporte und Lagerraum. Persönlich erreichbar von Montag bis Samstag.",
  founded: null as string | null, // TODO Inhaber: Gründungsjahr ergänzen
  contact: {
    phoneDisplay: "0172 7312531",
    phoneHref: "+491727312531",
    faxDisplay: "07171 9989340",
    email: "info@hauruck24.de",
    /** WhatsApp erst aktivieren, wenn die Nummer wirklich per WhatsApp betreut wird. */
    whatsapp: {
      enabled: false,
      href: "https://wa.me/491727312531",
    },
  },
  address: {
    street: "Rainhalde 38",
    postalCode: "73527",
    city: "Schwäbisch Gmünd",
    district: "Hussenhofen",
    region: "Baden-Württemberg",
    country: "DE",
    lat: 48.8121,
    lng: 9.8437,
  },
  openingHours: [
    { days: "Montag bis Samstag", time: "07:30 bis 18:30 Uhr" },
    { days: "Sonntag", time: "geschlossen" },
  ],
  /** Strukturierte Öffnungszeiten für schema.org */
  openingHoursSpec: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:30",
      closes: "18:30",
    },
  ],
  social: [] as { label: string; href: string }[], // TODO Inhaber: Profile ergänzen
  creator: {
    label: "SchaeferDesigns",
    href: "https://schaeferdesigns.de",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description: string }[];
};

export const nav: NavItem[] = [
  { label: "Start", href: "/" },
  {
    label: "Leistungen",
    href: "/leistungen",
    children: [
      { label: "Umzug", href: "/leistungen/umzug", description: "Privatumzug mit Packservice und Möbelmontage" },
      { label: "Entrümpelung", href: "/leistungen/entruempelung", description: "Keller, Dachboden, Garage und Gewerbefläche" },
      { label: "Haushaltsauflösung", href: "/leistungen/haushaltsaufloesung", description: "Komplette Wohnung besenrein übergeben" },
      { label: "Kleintransporte", href: "/leistungen/kleintransporte", description: "Einzelstücke, Sperrmüll und Kurzstrecken" },
      { label: "Lagerraum", href: "/leistungen/lagerraum", description: "Möbel und Kartons sicher einlagern" },
    ],
  },
  { label: "Ablauf", href: "/ablauf" },
  { label: "Einsatzgebiet", href: "/einsatzgebiet" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export const legalNav = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Widerruf", href: "/widerruf" },
];

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
export const mapsLink = `https://www.openstreetmap.org/?mlat=${site.address.lat}&mlon=${site.address.lng}#map=17/${site.address.lat}/${site.address.lng}`;
export const routeLink = `https://www.openstreetmap.org/directions?to=${site.address.lat}%2C${site.address.lng}`;
