/**
 * Einsatzgebiet. Reine Ortsangaben, keine Versprechen zu Fahrtkosten.
 * Bei Bedarf einfach erweitern, Sitemap und Seite ziehen sich die Liste automatisch.
 */

export const areaGroups: { title: string; note: string; places: string[] }[] = [
  {
    title: "Schwäbisch Gmünd und Stadtteile",
    note: "Kurze Wege, kurze Vorlaufzeit.",
    places: [
      "Hussenhofen",
      "Innenstadt",
      "Bettringen",
      "Straßdorf",
      "Bargau",
      "Weiler in den Bergen",
      "Rehnenhof",
      "Wetzgau",
      "Herlikofen",
      "Großdeinbach",
      "Lindach",
      "Degenfeld",
    ],
  },
  {
    title: "Ostalbkreis",
    note: "Regelmäßig im Einsatz.",
    places: [
      "Mutlangen",
      "Waldstetten",
      "Durlangen",
      "Spraitbach",
      "Täferrot",
      "Leinzell",
      "Göggingen",
      "Iggingen",
      "Heubach",
      "Böbingen an der Rems",
      "Mögglingen",
      "Bartholomä",
      "Lorch",
      "Aalen",
    ],
  },
  {
    title: "Rems-Murr-Kreis und Umgebung",
    note: "Auf Anfrage, Termin nach Absprache.",
    places: [
      "Gschwend",
      "Alfdorf",
      "Welzheim",
      "Plüderhausen",
      "Urbach",
      "Schorndorf",
      "Gaildorf",
      "Waldhausen",
    ],
  },
];

export const allPlaces = areaGroups.flatMap((g) => g.places);
