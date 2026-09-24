/**
 * Gegenstaende fuer "Packen Sie den Wagen".
 * units ist ein grober, interner Richtwert fuer die Fuellanzeige und wird
 * nirgends als Zahl angezeigt. step gibt an, wie viele Stueck ein Tipp hinzufuegt.
 */

export type LoadItemIcon =
  | "sofa"
  | "armchair"
  | "bed"
  | "wardrobe"
  | "dresser"
  | "table"
  | "desk"
  | "shelf"
  | "washer"
  | "fridge"
  | "bike"
  | "boxes";

export type LoadItem = {
  id: string;
  label: string;
  /** Mehrzahl fuer die Ladeliste */
  plural: string;
  icon: LoadItemIcon;
  /** Breite des Stapelsymbols im Laderaum */
  size: 1 | 2 | 3;
  units: number;
  step: number;
  max: number;
};

export const loadItems: LoadItem[] = [
  { id: "sofa", label: "Sofa", plural: "Sofas", icon: "sofa", size: 3, units: 12, step: 1, max: 4 },
  { id: "sessel", label: "Sessel", plural: "Sessel", icon: "armchair", size: 2, units: 5, step: 1, max: 6 },
  { id: "bett", label: "Bett", plural: "Betten", icon: "bed", size: 3, units: 10, step: 1, max: 6 },
  { id: "schrank", label: "Schrank", plural: "Schränke", icon: "wardrobe", size: 3, units: 14, step: 1, max: 6 },
  { id: "kommode", label: "Kommode", plural: "Kommoden", icon: "dresser", size: 2, units: 5, step: 1, max: 6 },
  { id: "esstisch", label: "Esstisch", plural: "Esstische", icon: "table", size: 2, units: 7, step: 1, max: 3 },
  { id: "schreibtisch", label: "Schreibtisch", plural: "Schreibtische", icon: "desk", size: 2, units: 5, step: 1, max: 4 },
  { id: "regal", label: "Regal", plural: "Regale", icon: "shelf", size: 2, units: 5, step: 1, max: 8 },
  { id: "waschmaschine", label: "Waschmaschine", plural: "Waschmaschinen", icon: "washer", size: 1, units: 4, step: 1, max: 3 },
  { id: "kuehlschrank", label: "Kühlschrank", plural: "Kühlschränke", icon: "fridge", size: 1, units: 5, step: 1, max: 3 },
  { id: "fahrrad", label: "Fahrrad", plural: "Fahrräder", icon: "bike", size: 2, units: 3, step: 1, max: 6 },
  { id: "kartons", label: "Karton", plural: "Kartons", icon: "boxes", size: 2, units: 1, step: 5, max: 80 },
];

/** Richtwert fuer einen vollen Wagen in internen Einheiten */
export const TRUCK_CAPACITY = 100;

/** Einordnung ohne Zahlen, bewusst als grobe Orientierung formuliert */
export function loadLabel(ratio: number) {
  if (ratio <= 0) return "Noch leer. Tippen Sie an, was mitkommen soll.";
  if (ratio <= 0.25) return "Eine kleine Fuhre, oft reicht ein Kleintransport.";
  if (ratio <= 0.6) return "Ein ordentlicher Umzug.";
  if (ratio <= 1) return "Der Wagen wird gut voll.";
  return "Das wird mehr als eine Fuhre. Kein Problem, das planen wir ein.";
}
