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
| Ausgabe     | Statischer Export (`output: "export"`)            |

Next.js ist bewusst auf 16.2.12 festgesetzt. In 16.3.x scheitert der Build beim
Vorrendern der internen Seite `/_global-error`.

## Entwicklung und Build

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # Live nach out/
npm run build:vorschau   # Vorschau für /demo/hauruck24/ nach out-vorschau/
npm start                # out/ lokal statisch ausliefern
npm run typecheck
```

Die Website ist ein rein statischer Export ohne eigenen Server.

| Befehl | Ergebnis |
| --- | --- |
| `npm run build` | Live-Build für die Domainwurzel nach `out/`: Sitemap, robots.txt, Canonical, indexierbar, `.htaccess` für Apache |
| `NEXT_PUBLIC_BASE_PATH=/pfad npm run build` | Vorschau für diesen Pfad nach `out/`, so ruft das Hochladewerkzeug den Build auf |
| `npm run build:vorschau` | Vorschau für `https://schaeferdesigns.de/demo/hauruck24/` nach `out-vorschau/` |

Vorschau heißt: alle Pfade beginnen mit dem Basispfad, alle Seiten `noindex`,
keine Sitemap, keine robots.txt, keine `.htaccess`, kein Canonical.

Jeder Build prüft sein Ergebnis selbst (`scripts/check-build.mjs`) und endet
mit Fehler, wenn ein Pfad nicht passt, eine Route oder ein Altpfad keine
eigene Datei hat oder eine Datei größer als 24 MB ist. Einzeln aufrufbar mit
`npm run check:live` und `npm run check:vorschau`.

Hinweise:

- Next.js 16.2 legt die Seitendaten für die Navigation unter Windows in
  Unterordnern ab. `scripts/build.mjs` legt sie flach, so wie der Browser sie
  anfragt. Die Prüfung meldet verschachtelte `__next.*`-Ordner als Fehler.
- Git Bash schreibt `/demo/...` in Umgebungsvariablen zu
  `C:/Program Files/Git/demo/...` um. Die Build-Skripte führen das zurück.
- Altpfade der früheren Website stehen in `scripts/altpfade.json` und werden
  als echte Weiterleitungsdateien erzeugt, live zusätzlich als 301 in der `.htaccess`.
- Next.js ist auf 16.2.12 festgesetzt. In 16.3.x scheitert der Build beim
  Vorrendern der internen Seite `/_global-error`.

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

Ohne eigenen Server gibt es zwei Wege:

1. **Standard:** Nach "Anfrage abschließen" zeigt das Formular alle Angaben
   und bietet "Als E-Mail öffnen", "Angaben kopieren" und den Anruf an.
2. **Mit Formular-Dienst:** `NEXT_PUBLIC_FORM_ENDPOINT` beim Build setzen
   (siehe `.env.example`). Das Formular sendet dann JSON per POST dorthin und
   zeigt bei Status 2xx die Bestätigung. Geeignet sind ein eigenes PHP-Skript
   beim Hoster, ein Cloudflare Worker oder ein Formular-Dienst mit
   Serverstandort in der EU (Auftragsverarbeitungsvertrag nötig).

Schutz gegen automatisierte Einträge: unsichtbares Köderfeld und Mindestdauer
bis zum Absenden.

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
- Formulardaten gehen nur an die eigene Mailadresse oder, falls eingerichtet,
  an den gewählten Formular-Dienst

## Deployment

- **Live:** Inhalt von `out/` in die Domainwurzel laden. Auf Apache sorgt die
  mitgelieferte `.htaccess` für die 404-Seite, die Weiterleitungen der
  Altpfade und Sicherheits-Header.
- **Vorschau:** Inhalt von `out-vorschau/` nach `public/demo/hauruck24/` der
  Cloudflare-Pages-Seite kopieren.

Vor dem Livegang:

1. `site.url` in `src/content/site.ts` auf die echte Domain setzen
2. Rechtstexte in `src/content/legal` einfügen
3. Optional `NEXT_PUBLIC_FORM_ENDPOINT` für den Formular-Versand setzen
4. `site.contact.whatsapp.enabled` auf `true` setzen, falls WhatsApp betreut wird

## Visuelle Prüfung

```bash
node tools/shot.mjs /leistungen/umzug umzug 1440 1000 full
node tools/interactions.mjs
node tools/blur-audit.mjs / 1440 1000 dropdown
```

`node tools/probe-vorschau.mjs` legt `out-vorschau/` unter
`probe/demo/hauruck24/`, liefert es statisch aus, lädt Seiten direkt und per
Navigation und meldet jede Antwort mit Status 400 oder höher. `probe/` wird
danach gelöscht. `node tools/og-image.mjs` erzeugt `public/og.png` neu.

`shot.mjs` erzeugt einen Screenshot unter `tools/screens`, `interactions.mjs`
klickt Navbar, Wagen, Ablauf, Formular und Handy-Menü durch und meldet
Browser-Dialoge und JavaScript-Fehler. Der Screenshot-Ordner ist von der
Versionierung ausgenommen. In Git Bash vor die Befehle `MSYS_NO_PATHCONV=1`
setzen, sonst wird der Pfad `/` umgeschrieben.
