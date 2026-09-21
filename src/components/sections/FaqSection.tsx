import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FaqSection({
  items,
  eyebrow = "Häufige Fragen",
  title = "Was Kunden vor der Anfrage wissen wollen",
  lead,
  withLink = false,
  defaultOpen = 0,
}: {
  items: AccordionItem[];
  eyebrow?: string;
  title?: string;
  lead?: string;
  withLink?: boolean;
  defaultOpen?: number | null;
}) {
  return (
    <section id="faq" className="section-pad">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
            {withLink ? (
              <Link
                href="/faq"
                className="link-underline mt-6 inline-flex items-center gap-1.5 text-base font-medium"
              >
                Alle Fragen und Antworten
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            ) : null}
          </div>

          <Accordion items={items} defaultOpen={defaultOpen} />
        </div>
      </div>
    </section>
  );
}
