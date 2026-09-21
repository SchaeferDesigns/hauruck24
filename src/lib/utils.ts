export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Telefonnummer fuer tel: Links normalisieren */
export function telHref(value: string) {
  return `tel:${value.replace(/[^+\d]/g, "")}`;
}
