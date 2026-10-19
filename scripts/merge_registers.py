#!/usr/bin/env python3
"""Merge research-agent CSVs from study/registers/incoming/ into the canonical registers.

    python3 scripts/merge_registers.py            # merge and report
    python3 scripts/merge_registers.py --clean    # also delete the merged incoming files

Rows are keyed by `id`; an incoming row replaces a canonical row with the same id. Rows are
never dropped: two sources with the same URL keep both ids (documents cite them) and get a
"same URL as" note. The report lists rows that break the evidence rules in CLAUDE.md.
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REG = ROOT / "study" / "registers"
INCOMING = REG / "incoming"

COLUMNS = {
    "sources": ["id", "claim", "title", "organization", "url", "published", "accessed", "reliability", "notes"],
    "prices": ["id", "product", "unit", "price_rwf", "price_type", "market_location", "observed", "source_id", "label", "notes"],
    "suppliers": ["id", "name", "category", "location", "offerings", "public_contact", "url", "prices_published",
                  "certification", "source_id", "verified", "notes"],
    "buyers": ["id", "name", "category", "location", "buys", "direct_from_farms", "public_contact", "url", "approach",
               "source_id", "status", "notes"],
}
PREFIX_ORDER = ["LOC", "MKT", "CRP", "LVS", "BUY", "REG", "ENG", "FIN"]


def kind_of(path: Path) -> str | None:
    stem = path.stem  # e.g. "crp-sources", "buy-buyers"
    for kind in COLUMNS:
        if stem.endswith("-" + kind):
            return kind
    return None


def sort_key(row_id: str):
    prefix = row_id.split("-")[0]
    rank = PREFIX_ORDER.index(prefix) if prefix in PREFIX_ORDER else len(PREFIX_ORDER)
    digits = "".join(ch for ch in row_id.split("-", 1)[-1] if ch.isdigit())
    return (rank, row_id.split("-", 1)[-1].rstrip("0123456789"), int(digits) if digits else 0, row_id)


def read_csv(path: Path) -> tuple[list[str], list[dict]]:
    with path.open(newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        rows = [{k.strip(): (v or "").strip() for k, v in row.items() if k is not None} for row in reader]
        return [h.strip() for h in (reader.fieldnames or [])], rows


def main(clean: bool) -> int:
    problems: list[str] = []
    merged_files: list[Path] = []
    for kind, cols in COLUMNS.items():
        canonical = REG / f"{kind}.csv"
        rows: dict[str, dict] = {}
        if canonical.exists():
            _, existing = read_csv(canonical)
            rows.update({r["id"]: r for r in existing if r.get("id")})
        for path in sorted(INCOMING.glob(f"*-{kind}.csv")):
            header, incoming = read_csv(path)
            missing = [c for c in cols if c not in header]
            extra = [c for c in header if c not in cols]
            if missing or extra:
                problems.append(f"{path.name}: header mismatch (missing {missing}, extra {extra})")
            for r in incoming:
                if not r.get("id"):
                    problems.append(f"{path.name}: a row without an id was skipped: {list(r.values())[:3]}")
                    continue
                if r["id"] in rows and rows[r["id"]] != r and path.stem.split("-")[0].upper() != r["id"].split("-")[0]:
                    problems.append(f"{path.name}: id {r['id']} collides with another file's row")
                rows[r["id"]] = {c: r.get(c, "") for c in cols}
            merged_files.append(path)

        if kind == "sources":
            by_url: dict[str, list[str]] = {}
            for rid, r in rows.items():
                url = r.get("url", "").rstrip("/").lower()
                if url:
                    by_url.setdefault(url, []).append(rid)
            for ids in by_url.values():
                if len(ids) > 1:
                    for rid in ids:
                        others = ", ".join(i for i in ids if i != rid)
                        note = rows[rid].get("notes", "")
                        tag = f"same URL as {others}"
                        if tag not in note:
                            rows[rid]["notes"] = f"{note}; {tag}".strip("; ")
            for rid, r in rows.items():
                if not r.get("url"):
                    problems.append(f"sources {rid}: no URL")
                if not r.get("accessed"):
                    problems.append(f"sources {rid}: no accessed date")
                if r.get("reliability") not in {"A", "B", "C", "D"}:
                    problems.append(f"sources {rid}: reliability '{r.get('reliability')}' is not A–D")
        if kind == "prices":
            for rid, r in rows.items():
                if r.get("label") not in {"V", "E", "A", "U", "[V]", "[E]", "[A]", "[U]"}:
                    problems.append(f"prices {rid}: label '{r.get('label')}' is not V/E/A/U")
                if not r.get("observed"):
                    problems.append(f"prices {rid}: no observation date")
                if not r.get("source_id"):
                    problems.append(f"prices {rid}: no source id")
        if kind in ("suppliers", "buyers"):
            for rid, r in rows.items():
                if not r.get("url") and not r.get("source_id"):
                    problems.append(f"{kind} {rid}: neither URL nor source id")
            if kind == "buyers":
                for rid, r in rows.items():
                    if r.get("status", "").lower() not in {"prospect", ""}:
                        problems.append(f"buyers {rid}: status '{r.get('status')}' (only 'prospect' is allowed before contact)")

        if rows:
            with canonical.open("w", newline="", encoding="utf-8") as fh:
                writer = csv.DictWriter(fh, fieldnames=cols, quoting=csv.QUOTE_MINIMAL)
                writer.writeheader()
                for rid in sorted(rows, key=sort_key):
                    writer.writerow(rows[rid])
            print(f"{kind:9} {len(rows):4} rows -> {canonical.relative_to(ROOT)}")

    # Every source ID cited in a research document should resolve.
    _, src_rows = read_csv(REG / "sources.csv") if (REG / "sources.csv").exists() else ([], [])
    known = {r["id"] for r in src_rows}
    import re
    cited: dict[str, set[str]] = {}
    for doc in (ROOT / "study").rglob("*.md"):
        for sid in re.findall(r"\b(?:LOC|MKT|CRP|LVS|BUY|REG|ENG|FIN)-\d{2,3}\b", doc.read_text(encoding="utf-8")):
            cited.setdefault(sid, set()).add(doc.relative_to(ROOT).as_posix())
    unresolved = sorted(set(cited) - known, key=sort_key)
    for sid in unresolved:
        problems.append(f"cited but not in sources.csv: {sid} ({', '.join(sorted(cited[sid]))})")
    print(f"cited source ids: {len(cited)} · unresolved: {len(unresolved)}")

    if problems:
        print(f"\n{len(problems)} problem(s):")
        for p in problems:
            print(f"  - {p}")
    else:
        print("\nno problems found")

    if clean:
        for path in merged_files:
            path.unlink()
        if INCOMING.exists() and not any(INCOMING.iterdir()):
            INCOMING.rmdir()
        print(f"removed {len(merged_files)} incoming file(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main("--clean" in sys.argv[1:]))
