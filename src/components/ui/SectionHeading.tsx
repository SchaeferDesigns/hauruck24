import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
  as = "h2",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
}) {
  const Title = as;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Reveal>
          <span className="glass-soft inline-flex items-center gap-2 rounded-pill px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-400" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.06}>
        <Title
          id={id}
          className={cn(
            "font-display leading-[1.08]",
            as === "h1"
              ? "text-4xl sm:text-5xl lg:text-6xl"
              : "text-3xl sm:text-4xl lg:text-[2.75rem]",
          )}
        >
          {title}
        </Title>
      </Reveal>

      {lead ? (
        <Reveal delay={0.12}>
          <div
            className={cn(
              "max-w-2xl text-base leading-relaxed text-mist-300 sm:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {lead}
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
