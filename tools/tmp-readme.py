import io
import re

p = 'README.md'
s = io.open(p, encoding='utf-8').read()


def section(name):
    start = s.index(f'## {name}\n')
    nxt = re.search(r'^## ', s[start + 3:], flags=re.M)
    end = start + 3 + nxt.start() if nxt else len(s)
    return start, end


def replace_section(name, body):
    global s
    start, end = section(name)
    s = s[:start] + body.rstrip('\n') + '\n\n' + s[end:]


s = s.replace('| Mailversand | nodemailer über eigenen SMTP-Zugang               |\n',
              '| Ausgabe     | Statischer Export (`output: "export"`)            |\n')

replace_section('Entwicklung', '''## Entwicklung und Build

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
''')

replace_section('Anfrageformular', '''## Anfrageformular

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
''')

replace_section('Deployment', '''## Deployment

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
''')

s = s.replace('''`shot.mjs` erzeugt einen Screenshot unter `tools/screens`,''', '''`node tools/probe-vorschau.mjs` legt `out-vorschau/` unter
`probe/demo/hauruck24/`, liefert es statisch aus, lädt Seiten direkt und per
Navigation und meldet jede Antwort mit Status 400 oder höher. `probe/` wird
danach gelöscht. `node tools/og-image.mjs` erzeugt `public/og.png` neu.

`shot.mjs` erzeugt einen Screenshot unter `tools/screens`,''')

s = s.replace('''- Formulardaten gehen ausschließlich an die eigene Mailadresse''', '''- Formulardaten gehen nur an die eigene Mailadresse oder, falls eingerichtet,
  an den gewählten Formular-Dienst''')

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('README aktualisiert')
