export type Service = {
  slug: string;
  label: string;
  title: string;
  lead: string;
  icon: "truck" | "trash" | "home" | "package" | "warehouse";
  /** Kurzbeschreibung für Karten und Übersichten */
  teaser: string;
  /** Konkrete Leistungsbausteine */
  includes: string[];
  /** Typische Anlässe, damit Besucher sich wiedererkennen */
  cases: string[];
  /** Fragen, die vor der Anfrage im Kopf herumgehen */
  faq: { q: string; a: string }[];
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "umzug",
    label: "Umzug",
    title: "Umzug in und um Schwäbisch Gmünd",
    lead: "Wir tragen, fahren und bauen auf, damit Ihr Umzugstag planbar bleibt.",
    icon: "truck",
    teaser:
      "Wohnungsumzug mit eigenem Fahrzeug, Tragehilfe, Möbelmontage und Termin auch am Samstag.",
    includes: [
      "Beladen, Transport und Entladen mit eigenem Fahrzeug",
      "Möbel ab- und wieder aufbauen",
      "Tragehilfe für schwere Einzelteile wie Waschmaschine oder Schrank",
      "Transportsicherung mit Decken, Gurten und Folie",
      "Verpacken von Einzelstücken auf Wunsch",
      "Entsorgung der Möbel, die nicht mitkommen",
    ],
    cases: [
      "Erste eigene Wohnung oder Umzug in eine größere Wohnung",
      "Umzug innerhalb von Schwäbisch Gmünd oder in den Nachbarort",
      "Seniorenumzug in eine betreute Wohnform",
      "Nur die schweren Teile, den Rest erledigen Sie selbst",
    ],
    faq: [
      {
        q: "Können wir nur die schweren Möbel beauftragen?",
        a: "Ja. Viele Kunden packen Kartons selbst und buchen uns für Schrank, Sofa, Waschmaschine und Klavier. Sagen Sie in der Anfrage einfach, welche Teile es sind.",
      },
      {
        q: "Wie früh sollte ich anfragen?",
        a: "Zum Monatsanfang und Monatsende sind die Termine am schnellsten vergeben. Fragen Sie an, sobald der Termin grob steht. Kurzfristige Anfragen prüfen wir trotzdem.",
      },
      {
        q: "Brauche ich Umzugskartons?",
        a: "Gepackte Kartons beschleunigen den Umzugstag deutlich. Sprechen Sie uns an, wenn Sie Kartons oder Packmaterial benötigen.",
      },
    ],
    seoTitle: "Umzug Schwäbisch Gmünd | Umzugsservice mit Tragehilfe",
    seoDescription:
      "Umzug in Schwäbisch Gmünd und Umgebung: Transport, Tragehilfe, Möbelmontage und Termine von Montag bis Samstag. Angebot kostenlos anfragen.",
  },
  {
    slug: "entruempelung",
    label: "Entrümpelung",
    title: "Entrümpelung von Keller, Dachboden und Garage",
    lead: "Wir räumen, sortieren und entsorgen, Sie bekommen eine leere Fläche zurück.",
    icon: "trash",
    teaser:
      "Keller, Dachboden, Garage, Gartenhaus oder Gewerbefläche zügig räumen und fachgerecht entsorgen.",
    includes: [
      "Räumen von Keller, Dachboden, Garage, Schuppen und Gartenhaus",
      "Trennen von Sperrmüll, Metall, Holz, Elektro und Restmüll",
      "Abtransport und Abgabe bei zugelassenen Annahmestellen",
      "Demontage von Regalen, Einbauten und alten Möbeln",
      "Besenreine Übergabe der geräumten Fläche",
      "Wertanrechnung bei verwertbarem Inhalt auf Anfrage",
    ],
    cases: [
      "Keller muss vor dem Auszug leer sein",
      "Dachboden ist über Jahre zugewachsen",
      "Garage wird vermietet oder verkauft",
      "Gewerbefläche oder Lager wird übergeben",
    ],
    faq: [
      {
        q: "Muss ich vorher selbst sortieren?",
        a: "Nein. Sagen Sie uns, was bleiben soll, alles andere übernehmen wir. Wenn Sie vorher aussortieren, sinkt der Aufwand und damit der Preis.",
      },
      {
        q: "Was passiert mit dem geräumten Inhalt?",
        a: "Wir trennen nach Materialart und geben die Fraktionen bei zugelassenen Annahmestellen ab. Brauchbares wird nach Möglichkeit weiterverwendet statt entsorgt.",
      },
      {
        q: "Kann ich beim Termin dabei sein?",
        a: "Sie können dabei sein, müssen es aber nicht. Viele Kunden übergeben nur den Schlüssel und bekommen die Fläche fertig zurück.",
      },
    ],
    seoTitle: "Entrümpelung Schwäbisch Gmünd | Keller, Dachboden, Garage",
    seoDescription:
      "Entrümpelung in Schwäbisch Gmünd: Keller, Dachboden, Garage und Gewerbefläche räumen, sortieren und fachgerecht entsorgen. Kostenlose Einschätzung anfragen.",
  },
  {
    slug: "haushaltsaufloesung",
    label: "Haushaltsauflösung",
    title: "Haushaltsauflösung mit besenreiner Übergabe",
    lead: "Ein Ansprechpartner für den kompletten Haushalt, vom ersten Karton bis zur Schlüsselübergabe.",
    icon: "home",
    teaser:
      "Komplette Wohnung oder Haus auflösen, Unterlagen sichern, Wertsachen aussortieren, besenrein übergeben.",
    includes: [
      "Vollständige Räumung von Wohnung, Haus oder Pflegezimmer",
      "Persönliche Unterlagen und Fotos gesondert sichern",
      "Verwertbares aussortieren und anrechnen",
      "Demontage von Küche, Einbauschränken und Bodenbelägen auf Anfrage",
      "Entsorgung nach Materialart über zugelassene Annahmestellen",
      "Besenreine Übergabe für Vermieter oder Makler",
    ],
    cases: [
      "Auflösung nach einem Todesfall",
      "Umzug eines Angehörigen ins Pflegeheim",
      "Verkauf oder Neuvermietung einer Immobilie",
      "Erbengemeinschaft benötigt eine leere Wohnung",
    ],
    faq: [
      {
        q: "Wir wohnen weit weg, geht das trotzdem?",
        a: "Ja. Die Abstimmung läuft dann per Telefon und E-Mail, Fotos oder ein Video der Räume genügen für eine erste Einschätzung. Für den Termin brauchen wir nur den Zugang.",
      },
      {
        q: "Wie gehen Sie mit persönlichen Dingen um?",
        a: "Unterlagen, Fotos, Schmuck und Ähnliches legen wir zur Seite und übergeben sie Ihnen. Sagen Sie vorher, worauf wir besonders achten sollen.",
      },
      {
        q: "Wird der Wert des Hausrats angerechnet?",
        a: "Wenn verwertbarer Hausrat vorhanden ist, rechnen wir ihn im Angebot an. Das prüfen wir bei der Besichtigung, damit die Zahl im Angebot belastbar ist.",
      },
    ],
    seoTitle: "Haushaltsauflösung Schwäbisch Gmünd | besenrein übergeben",
    seoDescription:
      "Haushaltsauflösung in Schwäbisch Gmünd und Umgebung: komplette Räumung, Wertanrechnung, Entsorgung und besenreine Übergabe. Jetzt Angebot anfragen.",
  },
  {
    slug: "kleintransporte",
    label: "Kleintransporte",
    title: "Kleintransporte und Einzelstücke",
    lead: "Ein Stück, ein Termin, ein Anruf. Auch kurzfristig, wenn der Kalender es zulässt.",
    icon: "package",
    teaser:
      "Sofa, Küchengerät, Baumarktfracht oder Sperrmüll: schnell abgeholt und dorthin gebracht, wo es hin soll.",
    includes: [
      "Abholung und Lieferung von Einzelmöbeln und Großgeräten",
      "Transport von Baumarkt, Möbelhaus oder Kleinanzeigen zu Ihnen nach Hause",
      "Sperrmüll zur Annahmestelle bringen",
      "Tragen in das obere Geschoss oder aus dem Keller",
      "Altgerät mitnehmen, wenn das neue geliefert wird",
      "Transportsicherung inklusive",
    ],
    cases: [
      "Gekauftes Sofa passt nicht ins Auto",
      "Waschmaschine muss in den zweiten Stock",
      "Alte Matratzen und Sperrmüll müssen weg",
      "Ein einzelnes Möbelstück zieht in eine andere Wohnung",
    ],
    faq: [
      {
        q: "Lohnt sich das auch für ein einzelnes Teil?",
        a: "Genau dafür ist der Kleintransport gedacht. Nennen Sie Maße, Gewicht, Stockwerk und beide Adressen, dann bekommen Sie zügig eine Einschätzung.",
      },
      {
        q: "Geht das noch diese Woche?",
        a: "Kurzfristige Termine sind je nach Auslastung möglich. Rufen Sie an, telefonisch klärt sich das am schnellsten.",
      },
      {
        q: "Helfen Sie beim Tragen in den vierten Stock?",
        a: "Ja. Bitte geben Sie das Stockwerk und die Treppenbreite mit an, damit wir mit der passenden Mannschaft kommen.",
      },
    ],
    seoTitle: "Kleintransporte Schwäbisch Gmünd | Möbeltaxi und Abholung",
    seoDescription:
      "Kleintransporte in Schwäbisch Gmünd: Möbel abholen, liefern, tragen und Sperrmüll entsorgen. Schnelle Termine von Montag bis Samstag.",
  },
  {
    slug: "lagerraum",
    label: "Lagerraum",
    title: "Lagerraum und Einlagerung",
    lead: "Die Zwischenlösung für die Lücke zwischen Auszug und Einzug.",
    icon: "warehouse",
    teaser:
      "Möbel und Kartons trocken einlagern, wenn der Einzugstermin später liegt als der Auszug.",
    includes: [
      "Einlagerung von Möbeln, Kartons und Hausrat",
      "Transport zum Lager und später zur neuen Adresse",
      "Kurze und längere Lagerzeit möglich",
      "Zugang nach Absprache",
      "Kombination mit Umzug oder Haushaltsauflösung",
      "Verfügbarkeit und Fläche auf Anfrage",
    ],
    cases: [
      "Zwischen Auszug und Einzug liegen mehrere Wochen",
      "Sanierung, die Möbel müssen vorübergehend raus",
      "Erbfall, die Entscheidung über den Hausrat braucht Zeit",
      "Zeitweiliger Auslandsaufenthalt",
    ],
    faq: [
      {
        q: "Wie lange kann ich einlagern?",
        a: "Von wenigen Tagen bis über mehrere Monate. Sagen Sie uns den geplanten Zeitraum, dann prüfen wir die Verfügbarkeit.",
      },
      {
        q: "Wie viel Platz brauche ich?",
        a: "Als Faustregel gilt: eine Zweizimmerwohnung braucht weniger Fläche, als die meisten schätzen. Wir schauen es gemeinsam an und planen realistisch.",
      },
      {
        q: "Komme ich an mein Lagergut?",
        a: "Zugang ist nach Absprache möglich. Melden Sie sich vorher, damit der Termin passt.",
      },
    ],
    seoTitle: "Lagerraum Schwäbisch Gmünd | Möbel einlagern",
    seoDescription:
      "Lagerraum in Schwäbisch Gmünd: Möbel und Kartons trocken einlagern, mit Transport hin und zurück. Verfügbarkeit jetzt anfragen.",
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const serviceSlugs = services.map((s) => s.slug);
