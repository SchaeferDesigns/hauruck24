"use client";

import Link from "next/link";
import { Check, Clock, Copy, ExternalLink, FileText, Mail, Phone } from "lucide-react";
import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { site } from "@/content/site";
import { telHref } from "@/lib/utils";
import Popover from "./Popover";

type Kind = "phone" | "mail";

/**
 * Telefon- und E-Mail-Links ohne ueberraschenden Browser-Dialog.
 *
 * Auf Touch-Geraeten waehlt der Link wie gewohnt direkt.
 * Am Rechner fragt der Browser bei tel: und mailto: sonst nach einer App.
 * Dort oeffnet sich stattdessen ein eigenes Panel mit Kopieren und
 * einer ausdruecklichen Option, die App zu starten.
 */
function ContactAction({
  kind,
  className,
  children,
  ariaLabel,
}: {
  kind: Kind;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const titleId = useId();

  const value = kind === "phone" ? site.contact.phoneDisplay : site.contact.email;
  const href = kind === "phone" ? telHref(site.contact.phoneHref) : `mailto:${site.contact.email}`;

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;
    event.preventDefault();
    setCopied(false);
    setOpen((current) => !current);
  };

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      /* Zwischenablage gesperrt: Text markieren, damit Strg+C reicht */
      const node = document.getElementById(`${titleId}-value`);
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [titleId, value]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <a
        ref={anchorRef}
        href={href}
        onClick={onClick}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </a>

      <Popover
        open={open}
        onClose={close}
        anchorRef={anchorRef}
        placement="bottom-center"
        ariaLabelledBy={titleId}
        className="w-[19.5rem] p-5"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand-400/25 bg-brand-500/12 text-brand-300">
            {kind === "phone" ? (
              <Phone aria-hidden="true" className="size-4" />
            ) : (
              <Mail aria-hidden="true" className="size-4" />
            )}
          </span>
          <div className="min-w-0">
            <p id={titleId} className="text-xs tracking-wide text-mist-400 uppercase">
              {kind === "phone" ? "Telefon" : "E-Mail"}
            </p>
            <p
              id={`${titleId}-value`}
              className="truncate font-display text-lg font-semibold text-mist-50 select-all"
            >
              {value}
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={copy}
            className="btn btn-primary h-11 min-h-11 w-full py-0 text-sm"
          >
            {copied ? (
              <>
                <Check aria-hidden="true" className="size-4" />
                Kopiert
              </>
            ) : (
              <>
                <Copy aria-hidden="true" className="size-4" />
                {kind === "phone" ? "Nummer kopieren" : "Adresse kopieren"}
              </>
            )}
          </button>

          <a href={href} onClick={close} className="btn btn-ghost h-11 min-h-11 w-full py-0 text-sm">
            <ExternalLink aria-hidden="true" className="size-4" />
            {kind === "phone" ? "Mit Telefon-App anrufen" : "Im Mailprogramm öffnen"}
          </a>

          {kind === "mail" ? (
            <Link href="/angebot" onClick={close} className="btn btn-quiet h-11 min-h-11 w-full py-0 text-sm">
              <FileText aria-hidden="true" className="size-4" />
              Lieber das Formular nutzen
            </Link>
          ) : null}
        </div>

        <p aria-live="polite" className="sr-only">
          {copied ? "In die Zwischenablage kopiert" : ""}
        </p>

        {kind === "phone" ? (
          <p className="mt-4 flex items-center gap-2 text-xs text-mist-400">
            <Clock aria-hidden="true" className="size-3.5 shrink-0 text-brand-400" />
            {site.openingHours[0].days}, {site.openingHours[0].time}
          </p>
        ) : null}
      </Popover>
    </>
  );
}

export function PhoneAction(props: { className?: string; children: ReactNode; ariaLabel?: string }) {
  return <ContactAction kind="phone" {...props} />;
}

export function MailAction(props: { className?: string; children: ReactNode; ariaLabel?: string }) {
  return <ContactAction kind="mail" {...props} />;
}
