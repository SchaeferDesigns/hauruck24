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
| `process.ts`          | Die vier Ablauf-Schritte (Sie tun, wir tun, Details)        |
| `loadItems.ts`        | Gegenstände für "Packen Sie den Wagen"                      |
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

Ohne Zugangsdaten bleibt das Formular funktionsfähig: es zeigt dann alle
Angaben an und bietet "Angaben kopieren", das Mailprogramm und den Anruf als
Wege an. Es erscheint kein Browser-Dialog.

Schutz gegen automatisierte Einträge: unsichtbares Köderfeld, Mindestdauer bis
zum Absenden und eine Begrenzung auf fünf Anfragen je IP in 15 Minuten.

## Gestaltungsregeln

**Glas (Blur statt Tint)**

- `glass`, `glass-strong` und `glass-soft` tragen echten Blur.
- Nie Glas in Glas verschachteln. Ein Element mit `backdrop-filter` wird zur
  "Backdrop Root", verschachteltes Glas sieht dann nur noch dessen Inhalt und
  wirkt flach. Innere Flächen nutzen `surface` oder `surface-strong`.
- Kein Vorfahre einer Glasfläche darf `opacity` unter 1, `filter`, `mask` oder
  `clip-path` tragen. Einblend-Animationen laufen deshalb auf dem Glas selbst
  (`Reveal` animiert sein direktes Kind, `.enter` für den ersten Bildschirm).
- Schwebende Panels (Auswahlliste, Kalender, Kontakt-Panel) werden per Portal
  in `body` gerendert, damit sie außerhalb jeder Glaskarte liegen.
- Prüfung: `node tools/blur-audit.mjs /pfad 1440 1000 [none|dropdown|menu]`
  meldet jede Glasfläche, deren Blur durch einen Vorfahren gebrochen wird.

**Keine Browser-Dialoge**

- Formulare mit `noValidate` und eigenen Fehlermeldungen.
- Telefon und E-Mail über `PhoneAction` und `MailAction`: am Rechner ein
  eigenes Panel mit Kopieren und ausdrücklichem Öffnen der App, auf Touch
  direktes Wählen.
- Eigene Auswahllisten (`forms/Select`), Checkboxen (`forms/Checkbox`) und
  Kalender (`forms/DatePicker`) statt nativer Browser-Elemente.

**Hover nur mit echtem Zeiger**

Hover-Effekte stehen in `@media (hover: hover) and (pointer: fine)`, damit auf
Touch-Geräten nichts hängen bleibt. Bewegung über die Eigenschaften
`translate` und `scale`, damit sie nie mit Einblend-Animationen kollidiert.

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
node tools/interactions.mjs
node tools/blur-audit.mjs / 1440 1000 dropdown
```

`shot.mjs` erzeugt einen Screenshot unter `tools/screens`, `interactions.mjs`
klickt Navbar, Wagen, Ablauf, Formular und Handy-Menü durch und meldet
Browser-Dialoge und JavaScript-Fehler. Der Screenshot-Ordner ist von der
Versionierung ausgenommen. In Git Bash vor die Befehle `MSYS_NO_PATHCONV=1`
setzen, sonst wird der Pfad `/` umgeschrieben.
