import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Background from "@/components/layout/Background";
import Footer from "@/components/layout/Footer";
import MobileActionBar from "@/components/layout/MobileActionBar";
import Navbar from "@/components/layout/Navbar";
import SheenTracker from "@/components/layout/SheenTracker";
import { LocalBusinessJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/content/site";
import { IS_PREVIEW, SITE_URL } from "@/lib/deploy";

/* Schriften werden beim Build heruntergeladen und lokal ausgeliefert.
   Es entsteht keine Verbindung des Besuchers zu Google. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  /* Basis fuer alle absoluten Adressen. In der Vorschau mit Basispfad,
     Next.js haengt relative Metadaten-Pfade daran an. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} | ${site.claim}`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  generator: "Next.js",
  keywords: [
    "Umzug Schwäbisch Gmünd",
    "Umzugsunternehmen Schwäbisch Gmünd",
    "Entrümpelung Schwäbisch Gmünd",
    "Haushaltsauflösung Schwäbisch Gmünd",
    "Kleintransporte Schwäbisch Gmünd",
    "Lagerraum Schwäbisch Gmünd",
    "Hussenhofen",
    "Ostalbkreis",
  ],
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.creator.label,
  publisher: site.name,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: site.name,
    title: `${site.name} | ${site.claim}`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name}, ${site.claim}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.claim}`,
    description: site.description,
    images: ["/og.png"],
  },
  /* Vorschau nie indexieren, live normal */
  robots: IS_PREVIEW
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-image-preview": "large" },
      },
  category: "Umzug und Entrümpelung",
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#04070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-scroll-behavior="smooth" className={`${inter.variable} ${jakarta.variable}`}>
      <body id="top" className="min-h-dvh pb-24 antialiased lg:pb-0">
        <Background />
        <Navbar />

        <main id="inhalt" className="relative pt-24 sm:pt-28">
          {children}
        </main>

        <Footer />
        <MobileActionBar />
        <SheenTracker />

        <LocalBusinessJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
