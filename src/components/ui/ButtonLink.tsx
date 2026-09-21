import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "quiet";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  quiet: "btn-quiet",
};

/**
 * Einheitlicher CTA. Interne Ziele laufen ueber next/link,
 * externe und tel:/mailto: Ziele ueber ein normales Anchor-Element.
 */
export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  ariaLabel,
  prefetch,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  prefetch?: boolean;
}) {
  const classes = cn("btn", variantClass[variant], className);
  const isInternal = href.startsWith("/") || href.startsWith("#");

  if (!isInternal) {
    const isExternalPage = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(isExternalPage ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel} prefetch={prefetch}>
      {children}
    </Link>
  );
}
