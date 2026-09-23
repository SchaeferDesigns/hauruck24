import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const delay = (seconds: number) => ({ "--enter-delay": `${seconds}s` }) as CSSProperties;

/**
 * Kopf fuer Unterseiten. Die Einstiegsanimation laeuft per CSS ab dem ersten
 * Paint, damit die Ueberschrift nicht auf JavaScript warten muss.
 */
export default function PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs: { name: string; href: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-10 pb-4 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[110px]"
      />

      <div className="container-page relative">
        <nav aria-label="Brotkrumen" className="enter">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-mist-400">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-1">
                  {index > 0 ? (
                    <ChevronRight aria-hidden="true" className="size-3 text-mist-500" />
                  ) : null}
                  {isLast ? (
                    <span aria-current="page" className="text-mist-200">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition-colors duration-200 hover:text-mist-100"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-7 max-w-3xl">
          {eyebrow ? (
            <span
              style={delay(0.04)}
              className="enter glass-soft inline-flex items-center gap-2 rounded-pill px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
              {eyebrow}
            </span>
          ) : null}

          <h1
            style={delay(0.1)}
            className="enter mt-5 font-display text-4xl leading-[1.06] sm:text-5xl lg:text-[3.4rem]"
          >
            {title}
          </h1>

          {lead ? (
            <p
              style={delay(0.16)}
              className="enter mt-5 text-base leading-relaxed text-mist-300 sm:text-lg"
            >
              {lead}
            </p>
          ) : null}

          {children ? (
            <div style={delay(0.22)} className="enter mt-8">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
