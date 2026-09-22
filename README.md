# Hauruck24 & Co. Website

Website für Hauruck24 & Co., Rainhalde 38, 73527 Schwäbisch Gmünd Hussenhofen.
Umzug, Entrümpelung, Haushaltsauflösung, Kleintransporte und Lagerraum.

## Technik

| Baustein    | Wahl                                              |
| ----------- | ------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)                |
| UI          | React 19, TypeScript                              |
| Styling     | Tailwind CSS 4, eigenes Glas-Designsystem         |
| Animation   | Motion (framer-motion)                            |
| Icons       | lucide-react, keine Emojis                        |
| Mailversand | nodemailer über eigenen SMTP-Zugang               |

Next.js ist bewusst auf 16.2.12 festgesetzt. In 16.3.x scheitert der Build beim
Vorrendern der internen Seite `/_global-error`.

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Produktionsbuild
npm start        # Produktionsserver
npm run typecheck
```

## Inhalte pflegen

Alle Texte und Daten liegen zentral in `src/content`:

| Datei                 | Inhalt                                                      |
| --------------------- | ----------------------------------------------------------- |
| `site.ts`             | Firmendaten, Kontakt, Öffnungszeiten, Navigation, Domain    |
| `services.ts`         | Die fünf Leistungen inklusive Detailseiten und Fragen       |
| `faq.ts`              | Allgemeine Fragen und Antworten                             |
| `areas.ts`            | Einsatzgebiet, Orte nach Gruppen                            |
| `legal/*.html`        | Rechtstexte, siehe unten                                    |

Änderungen an diesen Dateien wirken automatisch auf Seiten, Navigation, Footer,
Sitemap und strukturierte Daten.

### Rechtstexte

`src/content/legal/impressum.html`, `datenschutz.html`, `agb.html` und
`widerruf.html` sind bewusst leer. Solange eine Datei leer ist, zeigt die
zugehörige Seite den Hinweis, dass der Text in Kürze folgt.

Sobald der fertige Text vorliegt, wird er als HTML in die passende Datei
geschrieben. Erlaubt sind `h2`, `h3`, `p`, `ul`, `ol`, `li`, `strong`, `a`,
`table` und `hr`. Die Formatierung übernimmt das Stylesheet, es ist kein
zusätzliches Markup nötig.

Wichtig: Der Inhalt dieser Dateien wird ungefiltert ausgegeben. Es gehören
ausschließlich selbst erstellte oder vom Rechtstextdienst gelieferte Texte
hinein.

## Anfrageformular

Das Formular unter `/angebot` sendet an `POST /api/anfrage`. Die Route
verschickt eine E-Mail über SMTP.

1. `.env.example` nach `.env.local` kopieren
2. Zugangsdaten des eigenen Mailhosters eintragen
3. Server neu starten

Ohne Zugangsdaten bleibt das Formular funktionsfähig: es bietet dann den
Versand über das E-Mail-Programm des Besuchers an und zeigt die Telefonnummer.

Schutz gegen automatisierte Einträge: unsichtbares Köderfeld, Mindestdauer bis
zum Absenden und eine Begrenzung auf fünf Anfragen je IP in 15 Minuten.

## Datenschutz

- Keine Cookies, kein Tracking, keine Werbenetzwerke
- Schriften werden beim Build heruntergeladen und lokal ausgeliefert
- Karten laden erst nach ausdrücklicher Zustimmung
- Formulardaten gehen ausschließlich an die eigene Mailadresse

## Deployment

Die Anwendung benötigt eine Node-Laufzeit, zum Beispiel Vercel, Netlify oder
einen eigenen Server mit `npm run build && npm start`.

Vor dem Livegang anzupassen:

1. `site.url` in `src/content/site.ts` auf die echte Domain setzen
2. SMTP-Zugangsdaten hinterlegen
3. Rechtstexte in `src/content/legal` einfügen
4. `site.contact.whatsapp.enabled` auf `true` setzen, falls WhatsApp betreut wird

## Visuelle Prüfung

```bash
node tools/shot.mjs /leistungen/umzug umzug 1440 1000 full
```

Erzeugt einen Screenshot unter `tools/screens`. Der Ordner ist von der
Versionierung ausgenommen.
