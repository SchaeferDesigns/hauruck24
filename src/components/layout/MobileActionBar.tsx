"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Phone } from "lucide-react";
import { site } from "@/content/site";
import { telHref } from "@/lib/utils";

/**
 * Feste Aktionsleiste am unteren Rand, nur auf kleinen Displays.
 * Anrufen und Angebot sind damit auf jeder Unterseite einen Daumen entfernt.
 */
export default function MobileActionBar() {
  const pathname = usePathname();
  const onQuotePage = pathname === "/angebot";

  return (
    <div className="fixed inset-x-0 bottom-0 z-80 px-3 pb-3 lg:hidden">
      <div className="glass-strong flex items-center gap-2 rounded-pill p-2">
        <a
          href={telHref(site.contact.phoneHref)}
          className="btn btn-ghost h-12 min-h-12 flex-1 px-3 py-0 text-sm"
        >
          <Phone aria-hidden="true" className="size-4" />
          Anrufen
        </a>

        {onQuotePage ? (
          <a href="#anfrage" className="btn btn-primary h-12 min-h-12 flex-1 px-3 py-0 text-sm">
            <FileText aria-hidden="true" className="size-4" />
            Zum Formular
          </a>
        ) : (
          <Link href="/angebot" className="btn btn-primary h-12 min-h-12 flex-1 px-3 py-0 text-sm">
            <FileText aria-hidden="true" className="size-4" />
            Angebot
          </Link>
        )}
      </div>
    </div>
  );
}
