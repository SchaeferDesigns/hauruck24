"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  ClipboardCopy,
  Mail,
  Phone,
  Send,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { FORM_ENDPOINT } from "@/lib/deploy";
import { cn } from "@/lib/utils";
import ServiceIcon from "@/components/ui/ServiceIcon";
import { PhoneAction } from "@/components/ui/ContactAction";
import Checkbox from "./Checkbox";
import DatePicker, { formatDateLong } from "./DatePicker";
import Select from "./Select";

type Values = {
  service: string;
  scope: string;
  fromAddress: string;
  fromFloor: string;
  toAddress: string;
  toFloor: string;
  date: string;
  flexible: boolean;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  website: string;
};

type FieldError = "service" | "name" | "contact" | "email" | "consent";

const emptyValues: Values = {
  service: "",
  scope: "",
  fromAddress: "",
  fromFloor: "",
  toAddress: "",
  toFloor: "",
  date: "",
  flexible: false,
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  website: "",
};

const steps = [
  { id: 0, label: "Anliegen" },
  { id: 1, label: "Details" },
  { id: 2, label: "Kontakt" },
];

const scopeOptions = [
  { value: "Einzelne Möbel oder Geräte", label: "Einzelne Möbel oder Geräte" },
  { value: "1 bis 2 Zimmer", label: "1 bis 2 Zimmer" },
  { value: "3 bis 4 Zimmer", label: "3 bis 4 Zimmer" },
  { value: "Ganzes Haus", label: "Ganzes Haus" },
  { value: "Keller, Dachboden oder Garage", label: "Keller, Dachboden oder Garage" },
  { value: "Weiß ich noch nicht", label: "Weiß ich noch nicht", description: "Wir klären es gemeinsam" },
];

const fieldClass =
  "w-full rounded-2xl border bg-white/5 px-4 py-3.5 text-[0.975rem] text-mist-50 placeholder:text-mist-500 outline-none transition-colors duration-200 focus:border-brand-400/60 focus:bg-white/8";

const labelClass = "mb-2 block text-sm font-medium text-mist-200";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

/* Steuerzeichen entfernen und Laenge begrenzen, der Wert kommt aus der Adresszeile */
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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mail" | "failed">("idle");
  const [copied, setCopied] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const prefill = useCallback((service: string, list: string) => {
    setValues((current) => ({
      ...current,
      service: services.some((entry) => entry.slug === service) ? service : current.service,
      message: list && !current.message ? `Ladeliste: ${list}` : current.message,
    }));
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors([]);
  };

  const hasError = (field: FieldError) => errors.includes(field);

  const serviceLabel =
    services.find((entry) => entry.slug === values.service)?.label ||
    (values.service === "sonstiges" ? "Etwas anderes" : "Allgemeine Anfrage");

  /* Klartext der Anfrage, fuer Mailprogramm und Zwischenablage */
  const plainText = useMemo(
    () =>
      [
        `Anfrage: ${serviceLabel}`,
        `Umfang: ${values.scope || "Nicht angegeben"}`,
        `Von: ${values.fromAddress || "Nicht angegeben"}${values.fromFloor ? `, ${values.fromFloor}` : ""}`,
        `Nach: ${values.toAddress || "Nicht angegeben"}${values.toFloor ? `, ${values.toFloor}` : ""}`,
        `Wunschtermin: ${values.date ? formatDateLong(values.date) : "Nicht angegeben"}${values.flexible ? " (flexibel)" : ""}`,
        "",
        `Name: ${values.name}`,
        `E-Mail: ${values.email || "Nicht angegeben"}`,
        `Telefon: ${values.phone || "Nicht angegeben"}`,
        "",
        values.message || "",
      ].join("\n"),
    [values, serviceLabel],
  );

  const mailtoHref = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    `Anfrage: ${serviceLabel}`,
  )}&body=${encodeURIComponent(plainText)}`;

  const errorMessage = (() => {
    if (hasError("service")) return "Bitte wählen Sie aus, worum es geht.";
    if (hasError("name")) return "Bitte geben Sie Ihren Namen an.";
    if (hasError("contact")) return "Bitte hinterlassen Sie eine Telefonnummer oder eine E-Mail-Adresse.";
    if (hasError("email")) return "Die E-Mail-Adresse sieht nicht vollständig aus.";
    if (hasError("consent")) return "Ohne Ihre Einwilligung dürfen wir die Anfrage nicht bearbeiten.";
    return null;
  })();

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });

  const goNext = () => {
    if (step === 0 && !values.service) {
      setErrors(["service"]);
      return;
    }
    setErrors([]);
    setStep((current) => Math.min(current + 1, steps.length - 1));
    scrollToForm();
  };

  const goBack = () => {
    setErrors([]);
    setStep((current) => Math.max(current - 1, 0));
    scrollToForm();
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const found: FieldError[] = [];
    if (!values.name.trim()) found.push("name");
    if (!values.email.trim() && !values.phone.trim()) found.push("contact");
    if (values.email.trim() && !isEmail(values.email.trim())) found.push("email");
    if (!values.consent) found.push("consent");

    if (found.length) {
      setErrors(found);
      return;
    }

    setErrors([]);

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
  };

  if (status === "sent") {
    return (
      <div className="glass-strong rounded-card p-8 text-center sm:p-12">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-signal-400/35 bg-signal-500/15">
          <Check aria-hidden="true" className="size-7 text-signal-300" />
        </span>
        <h2 className="mt-6 font-display text-2xl">Anfrage ist angekommen</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mist-300">
          Wir melden uns während der Öffnungszeiten von Montag bis Samstag bei Ihnen. Wenn es eilt,
          rufen Sie gern direkt an.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <PhoneAction className="btn btn-primary">
            <Phone aria-hidden="true" className="size-4" />
            {site.contact.phoneDisplay}
          </PhoneAction>
          <Link href="/" className="btn btn-ghost">
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  if (status === "mail" || status === "failed") {
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
        </p>

        <pre className="mt-6 max-h-56 overflow-auto rounded-2xl border border-white/10 bg-white/4 p-4 font-sans text-xs leading-relaxed whitespace-pre-wrap text-mist-300">
          {plainText}
        </pre>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
          </button>
          <PhoneAction className="btn btn-ghost">
            <Phone aria-hidden="true" className="size-4" />
            Anrufen
          </PhoneAction>
        </div>

        <p aria-live="polite" className="sr-only">
          {copied ? "Angaben in die Zwischenablage kopiert" : ""}
        </p>

        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-underline mt-6 cursor-pointer text-sm"
        >
          Zurück zum Formular
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-describedby="form-hinweis"
      className="glass-strong scroll-mt-28 rounded-card p-6 sm:p-8"
    >
      {/* Fortschritt */}
      <div className="mb-8">
        <ol className="flex items-center gap-2">
          {steps.map((entry, index) => (
            <li key={entry.id} className="flex flex-1 items-center gap-2 last:flex-none">
              <span
                className={cn(
                  "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors duration-300",
                  index <= step
                    ? "border-brand-400 bg-brand-400 text-night-950"
                    : "border-white/15 bg-white/5 text-mist-400",
                )}
              >
                {index < step ? <Check aria-hidden="true" className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:block",
                  index <= step ? "text-mist-50" : "text-mist-400",
                )}
              >
                {entry.label}
              </span>
              {index < steps.length - 1 ? (
                <span aria-hidden="true" className="relative h-px flex-1 overflow-hidden bg-white/12">
                  <motion.span
                    className="absolute inset-0 origin-left bg-brand-400"
                    initial={false}
                    animate={{ scaleX: index < step ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="sr-only" aria-live="polite">
          Schritt {step + 1} von {steps.length}: {steps[step].label}
        </p>
      </div>

      {values.message.startsWith("Ladeliste:") && step === 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand-400/30 bg-brand-500/10 p-4">
          <Truck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-300" />
          <p className="text-sm leading-relaxed text-mist-200">
            Ihre Ladeliste ist übernommen und steht im letzten Schritt im Nachrichtenfeld.
          </p>
        </div>
      ) : null}

      <Suspense fallback={null}>
        <PrefillFromUrl onPrefill={prefill} />
      </Suspense>

      {/* Koederfeld gegen automatisierte Eintraege */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="website">Bitte nicht ausfüllen</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => set("website", event.target.value)}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 ? (
            <fieldset aria-invalid={hasError("service") || undefined}>
              <legend className="font-display text-xl">Worum geht es?</legend>
              <p className="mt-2 text-sm text-mist-300">
                Wählen Sie die passende Leistung. Alles Weitere können Sie danach ergänzen.
              </p>

              <div role="radiogroup" aria-label="Leistung" className="mt-6 grid gap-3 sm:grid-cols-2">
                {[...services.map((entry) => ({ value: entry.slug, label: entry.label, icon: entry.icon })), { value: "sonstiges", label: "Etwas anderes", icon: null }].map(
                  (option) => {
                    const selected = values.service === option.value;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-[background-color,border-color] duration-250",
                          selected
                            ? "border-brand-400/60 bg-brand-500/12"
                            : hasError("service")
                              ? "border-red-400/40 bg-white/4"
                              : "border-white/12 bg-white/4 hover:border-white/25",
                        )}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={option.value}
                          checked={selected}
                          onChange={() => set("service", option.value)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-2xl peer-focus-visible:shadow-[0_0_0_2px_#04070d,0_0_0_4.5px_var(--color-brand-400)]"
                        />
                        <span
                          className={cn(
                            "grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-250",
                            selected
                              ? "border-brand-400/40 bg-brand-500/20 text-brand-300"
                              : "border-white/12 bg-white/5 text-mist-300",
                          )}
                        >
                          {option.icon ? (
                            <ServiceIcon name={option.icon} className="size-5" />
                          ) : (
                            <CircleAlert aria-hidden="true" className="size-5" />
                          )}
                        </span>
                        <span className="text-sm font-semibold text-mist-50">{option.label}</span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "ml-auto grid size-5 place-items-center rounded-full border transition-colors duration-250",
                            selected ? "border-brand-400 bg-brand-400" : "border-white/30",
                          )}
                        >
                          {selected ? <Check className="size-3 text-night-950" strokeWidth={3} /> : null}
                        </span>
                      </label>
                    );
                  },
                )}
              </div>

              <Select
                id="scope"
                label="Wie groß ist der Umfang?"
                value={values.scope}
                onChange={(value) => set("scope", value)}
                options={scopeOptions}
                className="mt-6"
              />
            </fieldset>
          ) : null}

          {step === 1 ? (
            <fieldset>
              <legend className="font-display text-xl">Wo und wann?</legend>
              <p className="mt-2 text-sm text-mist-300">
                Angaben helfen bei der Einschätzung. Was Sie noch nicht wissen, lassen Sie frei.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-[1.6fr_1fr]">
                <div>
                  <label className={labelClass} htmlFor="fromAddress">
                    Adresse, Abholung
                  </label>
                  <input
                    id="fromAddress"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Straße und Ort"
                    value={values.fromAddress}
                    onChange={(event) => set("fromAddress", event.target.value)}
                    className={cn(fieldClass, "border-white/12")}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="fromFloor">
                    Stockwerk
                  </label>
                  <input
                    id="fromFloor"
                    type="text"
                    placeholder="z. B. 2. OG ohne Aufzug"
                    value={values.fromFloor}
                    onChange={(event) => set("fromFloor", event.target.value)}
                    className={cn(fieldClass, "border-white/12")}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="toAddress">
                    Adresse, Ziel
                  </label>
                  <input
                    id="toAddress"
                    type="text"
                    autoComplete="off"
                    placeholder="Straße und Ort oder Entsorgung"
                    value={values.toAddress}
                    onChange={(event) => set("toAddress", event.target.value)}
                    className={cn(fieldClass, "border-white/12")}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="toFloor">
                    Stockwerk
                  </label>
                  <input
                    id="toFloor"
                    type="text"
                    placeholder="z. B. Erdgeschoss"
                    value={values.toFloor}
                    onChange={(event) => set("toFloor", event.target.value)}
                    className={cn(fieldClass, "border-white/12")}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:items-end">
                <DatePicker
                  id="date"
                  label="Wunschtermin"
                  value={values.date}
                  onChange={(value) => set("date", value)}
                />

                <Checkbox
                  checked={values.flexible}
                  onChange={(checked) => set("flexible", checked)}
                  className="py-3.5"
                >
                  Termin ist flexibel
                </Checkbox>
              </div>
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset>
              <legend className="font-display text-xl">Wie erreichen wir Sie?</legend>
              <p className="mt-2 text-sm text-mist-300">
                Name und ein Kontaktweg genügen. Den Rest klären wir im Gespräch.
              </p>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className={labelClass} htmlFor="name">
                    Name <span className="text-brand-300">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    aria-required="true"
                    aria-invalid={hasError("name") || undefined}
                    value={values.name}
                    onChange={(event) => set("name", event.target.value)}
                    className={cn(fieldClass, hasError("name") ? "border-red-400/60" : "border-white/12")}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} htmlFor="phone">
                      Telefon
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      aria-invalid={hasError("contact") || undefined}
                      value={values.phone}
                      onChange={(event) => set("phone", event.target.value)}
                      className={cn(fieldClass, hasError("contact") ? "border-red-400/60" : "border-white/12")}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">
                      E-Mail
                    </label>
                    <input
                      id="email"
                      type="text"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      aria-invalid={hasError("contact") || hasError("email") || undefined}
                      value={values.email}
                      onChange={(event) => set("email", event.target.value)}
                      className={cn(
                        fieldClass,
                        hasError("contact") || hasError("email") ? "border-red-400/60" : "border-white/12",
                      )}
                    />
                  </div>
                </div>
                <p className="-mt-1 text-xs text-mist-400">
                  Telefon oder E-Mail genügt, eins von beiden brauchen wir.
                </p>

                <div>
                  <label className={labelClass} htmlFor="message">
                    Was sollen wir wissen?
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Besonderheiten, schwere Teile, enges Treppenhaus, Halteverbot"
                    value={values.message}
                    onChange={(event) => set("message", event.target.value)}
                    className={cn(fieldClass, "resize-y border-white/12")}
                  />
                </div>

                <Checkbox
                  checked={values.consent}
                  onChange={(checked) => set("consent", checked)}
                  required
                  invalid={hasError("consent")}
                >
                  Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert
                  und verarbeitet werden. Weitere Hinweise in der{" "}
                  <Link href="/datenschutz" className="link-underline">
                    Datenschutzerklärung
                  </Link>
                  . <span className="text-brand-300">*</span>
                </Checkbox>
              </div>
            </fieldset>
          ) : null}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {errorMessage ? (
          <motion.p
            key={errorMessage}
            role="alert"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100"
          >
            <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {errorMessage}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        {step > 0 ? (
          <button type="button" onClick={goBack} className="btn btn-ghost">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Zurück
          </button>
        ) : null}

        {step < steps.length - 1 ? (
          <button type="button" onClick={goNext} className="btn btn-primary sm:ml-auto">
            Weiter
            <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-primary disabled:opacity-70 sm:ml-auto"
          >
            <Send aria-hidden="true" className="size-4" />
            {status === "sending"
              ? "Wird gesendet"
              : FORM_ENDPOINT
                ? "Anfrage senden"
                : "Anfrage abschließen"}
          </button>
        )}
      </div>

      <p id="form-hinweis" className="mt-5 text-xs leading-relaxed text-mist-500">
        Pflichtfelder sind mit einem Sternchen markiert. Ihre Angaben werden ausschließlich zur
        Bearbeitung dieser Anfrage genutzt und nicht an Dritte weitergegeben.
      </p>
    </form>
  );
}
