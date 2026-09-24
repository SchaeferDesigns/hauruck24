"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Popover from "@/components/ui/Popover";

export type SelectOption = { value: string; label: string; description?: string };

/**
 * Eigene Auswahlliste nach dem Muster "Select-only Combobox" (WAI-ARIA APG).
 * Der Fokus bleibt auf der Schaltflaeche, die aktive Option wird per
 * aria-activedescendant angesagt. Bedienung: Pfeiltasten, Pos1, Ende,
 * Enter, Leertaste, Escape und Tippen der Anfangsbuchstaben.
 */
export default function Select({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Bitte wählen",
  invalid = false,
  className,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  className?: string;
}) {
  const autoId = useId();
  const baseId = id ?? autoId;
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const typeahead = useRef({ text: "", timer: 0 });

  const [open, setOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const [active, setActive] = useState(Math.max(0, selectedIndex));

  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const openList = useCallback(
    (start?: number) => {
      setActive(start ?? Math.max(0, selectedIndex));
      setOpen(true);
    },
    [selectedIndex],
  );

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  /* Aktive Option sichtbar halten */
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${baseId}-opt-${active}`)}`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open, baseId]);

  const findByText = (text: string) => {
    const lower = text.toLowerCase();
    const from = open ? active + 1 : selectedIndex + 1;
    for (let offset = 0; offset < options.length; offset += 1) {
      const index = (from + offset) % options.length;
      if (options[index].label.toLowerCase().startsWith(lower)) return index;
    }
    return -1;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = options.length - 1;

    /* Anfangsbuchstaben tippen */
    if (event.key.length === 1 && /\S/.test(event.key) && !event.ctrlKey && !event.metaKey) {
      window.clearTimeout(typeahead.current.timer);
      typeahead.current.text += event.key;
      typeahead.current.timer = window.setTimeout(() => (typeahead.current.text = ""), 600);
      const match = findByText(typeahead.current.text);
      if (match >= 0) {
        if (open) setActive(match);
        else onChange(options[match].value);
      }
      return;
    }

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList(event.key === "ArrowUp" ? Math.max(0, selectedIndex - 1) : undefined);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((index) => Math.min(last, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Tab":
        choose(active);
        break;
    }
  };

  return (
    <div className={className}>
      <span id={labelId} className="mb-2 block text-sm font-medium text-mist-200">
        {label}
      </span>

      <button
        ref={buttonRef}
        id={baseId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${baseId}`}
        aria-activedescendant={open ? `${baseId}-opt-${active}` : undefined}
        aria-invalid={invalid || undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-white/5 px-4 py-3.5 text-left text-[0.975rem] transition-colors duration-200",
          open
            ? "border-brand-400/60 bg-white/8"
            : invalid
              ? "border-red-400/50"
              : "border-white/12 hover:border-white/24",
        )}
      >
        <span className={cn("truncate", selected ? "text-mist-50" : "text-mist-500")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronsUpDown aria-hidden="true" className="size-4 shrink-0 text-mist-400" />
      </button>

      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={buttonRef}
        matchWidth
        minWidth={240}
        offset={8}
        role="none"
        focusOnOpen={false}
        sheetOnMobile
        sheetTitle={label}
        className="p-1.5"
      >
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          tabIndex={-1}
          className="flex flex-col gap-0.5 outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === active;
            return (
              <li
                key={option.value}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                onPointerEnter={() => setActive(index)}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-[0.95rem] transition-colors duration-150",
                  isActive ? "bg-white/10 text-mist-50" : "text-mist-200",
                  isSelected && "text-brand-200",
                )}
              >
                <span>
                  <span className="block">{option.label}</span>
                  {option.description ? (
                    <span className="mt-0.5 block text-xs text-mist-400">{option.description}</span>
                  ) : null}
                </span>
                {isSelected ? (
                  <Check aria-hidden="true" className="size-4 shrink-0 text-brand-300" />
                ) : null}
              </li>
            );
          })}
        </ul>
      </Popover>
    </div>
  );
}
