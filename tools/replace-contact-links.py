"""
Ersetzt tel:- und mailto:-Anker durch PhoneAction und MailAction.
Einmaliges Umbau-Skript, veraendert nur die uebergebenen Dateien.
"""

import io
import re
import sys

PHONE_ATTR = "href={telHref(site.contact.phoneHref)}"
MAIL_ATTR = "href={`mailto:${site.contact.email}`}"
IMPORT_LINE = 'import { MailAction, PhoneAction } from "@/components/ui/ContactAction";\n'


def convert(source: str) -> tuple[str, int]:
    count = 0
    for attr, component in ((PHONE_ATTR, "PhoneAction"), (MAIL_ATTR, "MailAction")):
        while True:
            pos = source.find(attr)
            if pos == -1:
                break
            start = source.rfind("<a", 0, pos)
            if start == -1 or not source[start + 2].isspace():
                raise ValueError("Kein oeffnendes <a gefunden")
            end = source.find("</a>", pos)
            if end == -1:
                raise ValueError("Kein schliessendes </a> gefunden")

            opening = source[start:pos] + source[pos + len(attr):]
            # Attribut samt umgebendem Leerraum entfernen
            head = source[start:pos].rstrip()
            tail = source[pos + len(attr):end]
            tail = tail.lstrip("\n ").lstrip()
            block = f"<{component}" + head[2:] + (" " if not head[2:].endswith("\n") else "") + tail
            block = re.sub(r"<" + component + r"\s*\n\s*className", "<" + component + " className", block, count=1)
            source = source[:start] + block + f"</{component}>" + source[end + 4:]
            count += 1
    return source, count


def fix_imports(source: str) -> str:
    uses_phone = "<PhoneAction" in source
    uses_mail = "<MailAction" in source
    if not (uses_phone or uses_mail):
        return source

    names = ", ".join(n for n, used in (("MailAction", uses_mail), ("PhoneAction", uses_phone)) if used)
    line = f'import {{ {names} }} from "@/components/ui/ContactAction";\n'
    source = re.sub(r'import \{[^}]*\} from "@/components/ui/ContactAction";\n', "", source)

    # Nach dem letzten Import einfuegen
    imports = list(re.finditer(r"^import .*?;\n", source, flags=re.M | re.S))
    insert_at = imports[-1].end() if imports else 0
    source = source[:insert_at] + line + source[insert_at:]

    # telHref-Import entfernen, wenn nicht mehr benutzt
    if "telHref(" not in source:
        source = re.sub(r'import \{ telHref \} from "@/lib/utils";\n', "", source)
        source = re.sub(r"import \{ cn, telHref \} from \"@/lib/utils\";\n", 'import { cn } from "@/lib/utils";\n', source)
    return source


if __name__ == "__main__":
    for path in sys.argv[1:]:
        text = io.open(path, encoding="utf-8").read()
        text, n = convert(text)
        text = fix_imports(text)
        io.open(path, "w", encoding="utf-8", newline="").write(text)
        print(f"{path}: {n} Link(s) ersetzt")
