"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Mail,
  Phone,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { cn, telHref } from "@/lib/utils";
import ServiceIcon from "@/components/ui/ServiceIcon";

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
  "Einzelne Möbel oder Geräte",
  "1 bis 2 Zimmer",
  "3 bis 4 Zimmer",
  "Ganzes Haus",
  "Keller, Dachboden oder Garage",
  "Weiß ich noch nicht",
];

const fieldClass =
  "w-full rounded-2xl border border-white/12 bg-white/5 px-4 py-3.5 text-[0.975rem] text-mist-50 placeholder:text-mist-500 transition-colors duration-200 focus:border-brand-400/60 focus:bg-white/8";

const labelClass = "mb-2 block text-sm font-medium text-mist-200";

export default function QuoteForm({ initialService = "" }: { initialService?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({ ...emptyValues, service: initialService });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "fallback">("idle");
  const startedAt = useRef<number>(Date.now());
  const headingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setError(null);
  };

  /* Ausweichweg, falls der Serverversand nicht eingerichtet ist */
  const mailtoHref = useMemo(() => {
    const serviceLabel =
      services.find((entry) => entry.slug === values.service)?.label || "Allgemeine Anfrage";
    const lines = [
      `Leistung: ${serviceLabel}`,
      `Umfang: ${values.scope || "Nicht angegeben"}`,
      `Von: ${values.fromAddress || "Nicht angegeben"}${values.fromFloor ? `, ${values.fromFloor}` : ""}`,
      `Nach: ${values.toAddress || "Nicht angegeben"}${values.toFloor ? `, ${values.toFloor}` : ""}`,
      `Wunschtermin: ${values.date || "Nicht angegeben"}${values.flexible ? " (flexibel)" : ""}`,
      "",
      `Name: ${values.name}`,
      `E-Mail: ${values.email || "Nicht angegeben"}`,
      `Telefon: ${values.phone || "Nicht angegeben"}`,
      "",
      values.message || "",
    ];

    return `mailto:${site.contact.email}?subject=${encodeURIComponent(
      `Anfrage: ${serviceLabel}`,
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
  }, [values]);

  const goNext = () => {
    if (step === 0 && !values.service) {
      setError("Bitte wählen Sie aus, worum es geht.");
      return;
    }
    setError(null);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.name.trim()) {
      setError("Bitte geben Sie Ihren Namen an.");
      return;
    }
    if (!values.email.trim() && !values.phone.trim()) {
      setError("Bitte hinterlassen Sie eine E-Mail-Adresse oder eine Telefonnummer.");
      return;
    }
    if (!values.consent) {
      setError("Ohne Ihre Einwilligung dürfen wir die Anfrage nicht verarbeiten.");
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt.current }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        configured?: boolean;
        error?: string;
      };

      if (data.ok) {
        setStatus("sent");
        return;
      }

      if (data.configured === false) {
        setStatus("fallback");
        return;
      }

      setStatus("idle");
      setError(data.error || "Die Anfrage konnte nicht gesendet werden.");
    } catch {
      setStatus("fallback");
    }
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
          <a href={telHref(site.contact.phoneHref)} className="btn btn-primary">
            <Phone aria-hidden="true" className="size-4" />
            {site.contact.phoneDisplay}
          </a>
          <Link href="/" className="btn btn-ghost">
            Zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  if (status === "fallback") {
    return (
      <div className="glass-strong rounded-card p-8 sm:p-10">
        <span className="grid size-12 place-items-center rounded-full border border-brand-400/35 bg-brand-500/15">
          <CircleAlert aria-hidden="true" className="size-6 text-brand-300" />
        </span>
        <h2 className="mt-5 font-display text-2xl">Senden gerade nicht möglich</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-mist-300">
          Ihre Angaben sind nicht verloren. Über die folgende Schaltfläche öffnet sich Ihr
          E-Mail-Programm mit allem, was Sie eingetragen haben. Alternativ erreichen Sie uns
          telefonisch.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={mailtoHref} className="btn btn-primary">
            <Mail aria-hidden="true" className="size-4" />
            Als E-Mail öffnen
          </a>
          <a href={telHref(site.contact.phoneHref)} className="btn btn-ghost">
            <Phone aria-hidden="true" className="size-4" />
            {site.contact.phoneDisplay}
          </a>
        </div>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-underline mt-6 text-sm"
        >
          Zurück zum Formular
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass-strong rounded-card p-6 sm:p-8">
      {/* Fortschritt */}
      <div className="mb-8">
        <ol className="flex items-center gap-2">
          {steps.map((entry, index) => (
            <li key={entry.id} className="flex flex-1 items-center gap-2">
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
                <span aria-hidden="true" className="h-px flex-1 bg-white/12" />
              ) : null}
            </li>
          ))}
        </ol>
        <p ref={headingRef} className="sr-only" aria-live="polite">
          Schritt {step + 1} von {steps.length}: {steps[step].label}
        </p>
      </div>

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
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 ? (
            <fieldset>
              <legend className="font-display text-xl">Worum geht es?</legend>
              <p className="mt-2 text-sm text-mist-300">
                Wählen Sie die passende Leistung. Sie können später noch alles ergänzen.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services.map((service) => {
                  const selected = values.service === service.slug;
                  return (
                    <label
                      key={service.slug}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors duration-250",
                        selected
                          ? "border-brand-400/60 bg-brand-500/12"
                          : "border-white/12 bg-white/4 hover:border-white/25",
                      )}
                    >
                      <input
                        type="radio"
                        name="service"
                        value={service.slug}
                        checked={selected}
                        onChange={() => set("service", service.slug)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-250",
                          selected
                            ? "border-brand-400/40 bg-brand-500/20 text-brand-300"
                            : "border-white/12 bg-white/5 text-mist-300",
                        )}
                      >
                        <ServiceIcon name={service.icon} className="size-5" />
                      </span>
                      <span className="text-sm font-semibold text-mist-50">{service.label}</span>
                      {selected ? (
                        <Check aria-hidden="true" className="ml-auto size-4 text-brand-300" />
                      ) : null}
                    </label>
                  );
                })}

                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors duration-250",
                    values.service === "sonstiges"
                      ? "border-brand-400/60 bg-brand-500/12"
                      : "border-white/12 bg-white/4 hover:border-white/25",
                  )}
                >
                  <input
                    type="radio"
                    name="service"
                    value="sonstiges"
                    checked={values.service === "sonstiges"}
                    onChange={() => set("service", "sonstiges")}
                    className="sr-only"
                  />
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/5 text-mist-300">
                    <CircleAlert aria-hidden="true" className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-mist-50">Etwas anderes</span>
                </label>
              </div>

              <div className="mt-6">
                <label className={labelClass} htmlFor="scope">
                  Wie groß ist der Umfang?
                </label>
                <select
                  id="scope"
                  value={values.scope}
                  onChange={(event) => set("scope", event.target.value)}
                  className={cn(fieldClass, "appearance-none")}
                >
                  <option value="">Bitte wählen</option>
                  {scopeOptions.map((option) => (
                    <option key={option} value={option} className="bg-night-800">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
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
                    className={fieldClass}
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
                    className={fieldClass}
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
                    className={fieldClass}
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
                    className={fieldClass}
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="date">
                    Wunschtermin
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={values.date}
                    onChange={(event) => set("date", event.target.value)}
                    className={cn(fieldClass, "[color-scheme:dark]")}
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-3 self-end rounded-2xl border border-white/12 bg-white/4 px-4 py-3.5">
                  <input
                    type="checkbox"
                    checked={values.flexible}
                    onChange={(event) => set("flexible", event.target.checked)}
                    className="size-5 shrink-0 accent-[#ff9522]"
                  />
                  <span className="text-sm text-mist-200">Termin ist flexibel</span>
                </label>
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
                    required
                    autoComplete="name"
                    value={values.name}
                    onChange={(event) => set("name", event.target.value)}
                    className={fieldClass}
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
                      value={values.phone}
                      onChange={(event) => set("phone", event.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="email">
                      E-Mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={(event) => set("email", event.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>

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
                    className={cn(fieldClass, "resize-y")}
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/12 bg-white/4 p-4">
                  <input
                    type="checkbox"
                    checked={values.consent}
                    onChange={(event) => set("consent", event.target.checked)}
                    className="mt-0.5 size-5 shrink-0 accent-[#ff9522]"
                    required
                  />
                  <span className="text-sm leading-relaxed text-mist-300">
                    Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage
                    gespeichert und verarbeitet werden. Weitere Hinweise in der{" "}
                    <Link href="/datenschutz" className="link-underline">
                      Datenschutzerklärung
                    </Link>
                    . <span className="text-brand-300">*</span>
                  </span>
                </label>
              </div>
            </fieldset>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : null}

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
            className="btn btn-primary sm:ml-auto disabled:opacity-70"
          >
            <Send aria-hidden="true" className="size-4" />
            {status === "sending" ? "Wird gesendet" : "Anfrage senden"}
          </button>
        )}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-mist-500">
        Pflichtfelder sind mit einem Sternchen markiert. Ihre Angaben werden ausschließlich zur
        Bearbeitung dieser Anfrage genutzt und nicht an Dritte weitergegeben.
      </p>
    </form>
  );
}
