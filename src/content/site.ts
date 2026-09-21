/**
 * Zentrale Stammdaten der Website.
 * Alle Texte und Kontaktdaten werden ausschliesslich hier gepflegt.
 * Aenderungen wirken sich automatisch auf Seiten, Footer, SEO und JSON-LD aus.
 */

export const site = {
  name: "Hauruck24 & Co.",
  shortName: "Hauruck24",
  legalName: "Hauruck24 & Co.",
  /** Produktions-Domain. Bitte anpassen, sobald die Domain final ist. */
  url: "https://www.hauruck24.de",
  locale: "de-DE",
  claim: "Umzug, Entruempelung und Transport in Schwaebisch Gmuend",
  tagline: "Anpacken statt aufschieben",
  description:
    "Hauruck24 & Co. aus Schwaebisch Gmuend Hussenhofen: Umzuege, Entruempelungen, Haushaltsaufloesungen, Kleintransporte und Lagerraum. Persoenlich erreichbar von Montag bis Samstag.",
  founded: null as string | null, // TODO Inhaber: Gruendungsjahr ergaenzen
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
    city: "Schwaebisch Gmuend",
    district: "Hussenhofen",
    region: "Baden-Wuerttemberg",
    country: "DE",
    lat: 48.8121,
    lng: 9.8437,
  },
  openingHours: [
    { days: "Montag bis Samstag", time: "07:30 bis 18:30 Uhr" },
    { days: "Sonntag", time: "geschlossen" },
  ],
  /** Strukturierte Oeffnungszeiten fuer schema.org */
  openingHoursSpec: [
    {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "07:30",
      closes: "18:30",
    },
  ],
  social: [] as { label: string; href: string }[], // TODO Inhaber: Profile ergaenzen
  creator: {
    label: "SchaeferDesigns",
    href: "https://schaeferdesigns.de",
  },
} as const;

export const nav: { label: string; href: string; children?: { label: string; href: string; description: string }[] }[] = [
  { label: "Start", href: "/" },
  {
    label: "Leistungen",
    href: "/leistungen",
    children: [
      { label: "Umzug", href: "/leistungen/umzug", description: "Privatumzug mit Packservice und Moebelmontage" },
      { label: "Entruempelung", href: "/leistungen/entruempelung", description: "Keller, Dachboden, Garage und Gewerbeflaeche" },
      { label: "Haushaltsaufloesung", href: "/leistungen/haushaltsaufloesung", description: "Komplette Wohnung besenrein uebergeben" },
      { label: "Kleintransporte", href: "/leistungen/kleintransporte", description: "Einzelstuecke, Sperrmuell und Kurzstrecken" },
      { label: "Lagerraum", href: "/leistungen/lagerraum", description: "Moebel und Kartons sicher einlagern" },
    ],
  },
  { label: "Ablauf", href: "/ablauf" },
  { label: "Einsatzgebiet", href: "/einsatzgebiet" },
  { label: "Ueber uns", href: "/ueber-uns" },
  { label: "Kontakt", href: "/kontakt" },
];

export const legalNav = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "AGB", href: "/agb" },
  { label: "Widerruf", href: "/widerruf" },
];

export const fullAddress = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;
