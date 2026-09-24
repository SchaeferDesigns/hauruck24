import io

p = 'src/components/forms/QuoteForm.tsx'
s = io.open(p, encoding='utf-8').read()


def rep(old, new):
    global s
    assert old in s, old[:90]
    s = s.replace(old, new)


rep('import Link from "next/link";\nimport { useEffect, useMemo, useRef, useState } from "react";',
    'import Link from "next/link";\nimport { useSearchParams } from "next/navigation";\nimport { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";')
rep('import { cn } from "@/lib/utils";', 'import { FORM_ENDPOINT } from "@/lib/deploy";\nimport { cn } from "@/lib/utils";')

rep('''export default function QuoteForm({
  initialService = "",
  initialList = "",
}: {
  initialService?: string;
  initialList?: string;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({
    ...emptyValues,
    service: services.some((entry) => entry.slug === initialService) ? initialService : "",
    message: initialList ? `Ladeliste: ${initialList}` : "",
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");''',
'''/* Steuerzeichen entfernen und Laenge begrenzen, der Wert kommt aus der Adresszeile */
const cleanParam = (value: string | null, max: number) =>
  (value ?? "")
    .split("")
    .map((char) => (char.charCodeAt(0) < 32 ? " " : char))
    .join("")
    .trim()
    .slice(0, max);

/**
 * Liest ?leistung= und ?liste= aus der Adresse, zum Beispiel aus
 * "Packen Sie den Wagen". Liegt in eigenem Suspense-Rahmen, damit das
 * Formular selbst statisch vorgerendert bleibt.
 */
function PrefillFromUrl({ onPrefill }: { onPrefill: (service: string, list: string) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    onPrefill(cleanParam(params.get("leistung"), 40), cleanParam(params.get("liste"), 600));
  }, [params, onPrefill]);
  return null;
}

export default function QuoteForm() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(emptyValues);
  const [errors, setErrors] = useState<FieldError[]>([]);
  /* "mail": ohne Formular-Dienst geht die Anfrage per E-Mail-Programm,
     Kopieren oder Anruf raus. "failed": Dienst eingerichtet, aber nicht erreichbar. */
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mail" | "failed">("idle");''')

rep('''  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
''', '''  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const prefill = useCallback((service: string, list: string) => {
    setValues((current) => ({
      ...current,
      service: services.some((entry) => entry.slug === service) ? service : current.service,
      message: list && !current.message ? `Ladeliste: ${list}` : current.message,
    }));
  }, []);
''')

rep('''    setStatus("sending");
    setErrors([]);

    try {
      const response = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          date: values.date ? formatDateLong(values.date) : "",
          startedAt: startedAt.current,
        }),
      });

      const data = (await response.json()) as { ok: boolean; configured?: boolean; error?: string };

      if (data.ok) {
        setStatus("sent");
        scrollToForm();
        return;
      }

      setStatus("fallback");
      scrollToForm();
    } catch {
      setStatus("fallback");
      scrollToForm();
    }
  };''', '''    setErrors([]);

    /* Statische Website ohne eigenen Server: ohne eingerichteten Formular-Dienst
       geht die Anfrage ueber das E-Mail-Programm, die Zwischenablage oder das Telefon. */
    if (!FORM_ENDPOINT) {
      setStatus("mail");
      scrollToForm();
      return;
    }

    /* Koederfeld gefuellt oder in unter drei Sekunden abgeschickt: kein Mensch */
    if (values.website || Date.now() - startedAt.current < 3000) {
      setStatus("sent");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          leistung: serviceLabel,
          umfang: values.scope,
          von: [values.fromAddress, values.fromFloor].filter(Boolean).join(", "),
          nach: [values.toAddress, values.toFloor].filter(Boolean).join(", "),
          termin: values.date ? formatDateLong(values.date) : "",
          flexibel: values.flexible,
          name: values.name,
          email: values.email,
          telefon: values.phone,
          nachricht: values.message,
          einwilligung: values.consent,
          _subject: `Anfrage über die Website: ${serviceLabel}`,
        }),
      });

      setStatus(response.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
    scrollToForm();
  };''')

rep('''  if (status === "fallback") {
    return (
      <div className="glass-strong rounded-card p-8 sm:p-10">
        <span className="grid size-12 place-items-center rounded-full border border-brand-400/35 bg-brand-500/15">
          <CircleAlert aria-hidden="true" className="size-6 text-brand-300" />
        </span>
        <h2 className="mt-5 font-display text-2xl">Online-Versand gerade nicht möglich</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist-300">
          Ihre Angaben sind nicht verloren. Kopieren Sie sie mit einem Klick und fügen Sie sie in
          eine E-Mail an{" "}
          <span className="font-semibold text-mist-100">{site.contact.email}</span> ein, oder
          öffnen Sie direkt Ihr Mailprogramm. Telefonisch sind wir ebenso erreichbar.
        </p>''', '''  if (status === "mail" || status === "failed") {
    return (
      <div className="glass-strong scroll-mt-28 rounded-card p-8 sm:p-10">
        <span className="grid size-12 place-items-center rounded-full border border-brand-400/35 bg-brand-500/15">
          {status === "failed" ? (
            <CircleAlert aria-hidden="true" className="size-6 text-brand-300" />
          ) : (
            <Send aria-hidden="true" className="size-6 text-brand-300" />
          )}
        </span>
        <h2 className="mt-5 font-display text-2xl">
          {status === "failed" ? "Online-Versand gerade nicht möglich" : "Letzter Schritt: abschicken"}
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist-300">
          {status === "failed"
            ? "Ihre Angaben sind nicht verloren. "
            : "Ihre Anfrage ist fertig, aber noch nicht versendet. "}
          Öffnen Sie sie mit einem Klick in Ihrem E-Mail-Programm oder kopieren Sie die Angaben
          und senden Sie sie an{" "}
          <span className="font-semibold text-mist-100">{site.contact.email}</span>. Telefonisch
          sind wir ebenso erreichbar.
        </p>''')

rep('''        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <button type="button" onClick={copyText} className="btn btn-primary">
            {copied ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                Kopiert
              </>
            ) : (
              <>
                <ClipboardCopy aria-hidden="true" className="size-4" />
                Angaben kopieren
              </>
            )}
          </button>
          <a href={mailtoHref} className="btn btn-ghost">
            <Mail aria-hidden="true" className="size-4" />
            Mailprogramm
          </a>''', '''        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a href={mailtoHref} className="btn btn-primary">
            <Mail aria-hidden="true" className="size-4" />
            Als E-Mail öffnen
          </a>
          <button type="button" onClick={copyText} className="btn btn-ghost">
            {copied ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                Kopiert
              </>
            ) : (
              <>
                <ClipboardCopy aria-hidden="true" className="size-4" />
                Angaben kopieren
              </>
            )}
          </button>''')

rep('''            {status === "sending" ? "Wird gesendet" : "Anfrage senden"}''', '''            {status === "sending"
              ? "Wird gesendet"
              : FORM_ENDPOINT
                ? "Anfrage senden"
                : "Anfrage abschließen"}''')

# Vorbefuellung aus der Adresse im Formular einhaengen
rep('''      {/* Koederfeld gegen automatisierte Eintraege */}''', '''      <Suspense fallback={null}>
        <PrefillFromUrl onPrefill={prefill} />
      </Suspense>

      {/* Koederfeld gegen automatisierte Eintraege */}''')

io.open(p, 'w', encoding='utf-8', newline='').write(s)
ctrl = [hex(ord(c)) for c in s if ord(c) < 32 and c not in '\n\r\t']
print('QuoteForm umgebaut, Steuerzeichen:', ctrl)
