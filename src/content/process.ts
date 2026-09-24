export type ProcessStep = {
  icon: "call" | "inspect" | "calendar" | "done";
  title: string;
  text: string;
  /** Was der Kunde tut */
  you: string;
  /** Was Hauruck24 tut */
  we: string;
  detail: string;
  /** Zusatzpunkte fuer die ausfuehrliche Ansicht auf /ablauf */
  more: string[];
};

export const processSteps: ProcessStep[] = [
  {
    icon: "call",
    title: "Anfragen",
    text: "Kurz anrufen oder das Formular ausfüllen. Je genauer die Angaben, desto belastbarer die erste Einschätzung.",
    you: "Beschreiben, was ansteht und bis wann.",
    we: "Melden uns zeitnah und klären offene Fragen.",
    detail: "Dauer: wenige Minuten",
    more: [
      "Telefon, E-Mail oder Formular, ganz wie es Ihnen passt",
      "Fotos oder ein kurzes Video helfen bei der Einschätzung",
      "Auch kurzfristige Anfragen prüfen wir",
    ],
  },
  {
    icon: "inspect",
    title: "Ansehen und Angebot",
    text: "Bei größeren Aufträgen kommen wir vorbei und schauen uns alles an. Danach wissen Sie, was die Sache kostet.",
    you: "Zeigen Räume, Zugang und Besonderheiten.",
    we: "Nehmen den Umfang auf und erstellen das Angebot.",
    detail: "Vor Ort oder nach Fotos",
    more: [
      "Besichtigung zu einem Termin, der Ihnen passt",
      "Angebot auf Basis des tatsächlichen Umfangs",
      "Die Besichtigung verpflichtet Sie zu nichts",
    ],
  },
  {
    icon: "calendar",
    title: "Termin fixieren",
    text: "Wunschtermin bestätigen, offene Punkte klären, Zugang und Parkmöglichkeit besprechen.",
    you: "Bestätigen Termin und Angebot.",
    we: "Planen Team, Fahrzeug und Material.",
    detail: "Montag bis Samstag möglich",
    more: [
      "Halteverbot rechtzeitig klären, wenn die Straße eng ist",
      "Sondergut wie Klavier oder Tresor vorher ansprechen",
      "Einen Ansprechpartner für den Tag festlegen",
    ],
  },
  {
    icon: "done",
    title: "Wir packen an",
    text: "Wir tragen, fahren, räumen und entsorgen. Am Ende gehen wir gemeinsam durch und Sie geben Ihr Okay.",
    you: "Sind erreichbar und nehmen am Ende ab.",
    we: "Erledigen den Auftrag wie besprochen.",
    detail: "Abnahme gemeinsam",
    more: [
      "Kurze Abstimmung vor dem Start",
      "Getrennte Entsorgung über zugelassene Annahmestellen",
      "Gemeinsamer Rundgang zum Schluss",
    ],
  },
];
