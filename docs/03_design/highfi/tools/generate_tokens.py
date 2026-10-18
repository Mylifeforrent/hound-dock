#!/usr/bin/env python3
"""Generate highfi/tokens.css from design_tokens.json.

This is the only permitted writer of tokens.css. The generated file is a
verbatim projection of every token value in the JSON source; no token is
renamed, added, or given a value that is not in the source.

Usage:
    python3 docs/03_design/highfi/tools/generate_tokens.py

No dependency, no network, no build system. Run from any directory.
"""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
HIGHFI = HERE.parent
REPO = HIGHFI.parents[2]
SOURCE = REPO / "docs" / "03_design" / "design_tokens.json"
TARGET = HIGHFI / "tokens.css"

ALIAS = re.compile(r"\{([^{}]+)\}")
CAMEL = re.compile(r"(?<=[a-z0-9])(?=[A-Z])")


def slug(segment: str) -> str:
    """Turn one JSON path segment into a CSS-safe kebab segment."""
    text = CAMEL.sub("-", str(segment))
    text = text.replace("_", "-").lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def var_name(path: tuple[str, ...]) -> str:
    return "--" + "-".join(slug(part) for part in path)


def walk(node: object, path: tuple[str, ...], out: list[tuple[tuple[str, ...], object]]) -> None:
    """Collect every token leaf. A leaf is a node carrying a `value` key."""
    if isinstance(node, dict):
        if "value" in node:
            value = node["value"]
            if isinstance(value, dict):
                for key, nested in value.items():
                    walk({"value": nested}, path + (key,), out)
            elif isinstance(value, list):
                out.append((path, json.dumps(value, ensure_ascii=False)))
            else:
                out.append((path, value))
            return
        for key, nested in node.items():
            if key in {"source", "frontend"}:
                continue
            walk(nested, path + (key,), out)
        return
    raise TypeError(f"unexpected token node at {'.'.join(path)}: {type(node).__name__}")


def resolve(value: object, lookup: dict[tuple[str, ...], object], where: str) -> str:
    """Render one value, replacing every {alias} with a CSS custom property."""
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    if not isinstance(value, str):
        raise TypeError(f"{where}: unsupported value {value!r}")

    def replace(match: re.Match[str]) -> str:
        target = tuple(part.strip() for part in match.group(1).split("."))
        if target not in lookup:
            raise KeyError(f"{where}: alias {{{match.group(1)}}} does not resolve")
        return f"var({var_name(target)})"

    return ALIAS.sub(replace, value)


def main() -> int:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()

    layers: list[tuple[str, dict]] = []
    for layer in ("primitive", "semantic", "component"):
        if layer not in data:
            raise KeyError(f"missing layer: {layer}")
        layers.append((layer, data[layer]))

    collected: list[tuple[str, tuple[str, ...], object]] = []
    lookup: dict[tuple[str, ...], object] = {}
    for layer, node in layers:
        leaves: list[tuple[tuple[str, ...], object]] = []
        walk(node, (layer,), leaves)
        for path, value in leaves:
            if path in lookup:
                raise ValueError(f"duplicate token path: {'.'.join(path)}")
            lookup[path] = value
            collected.append((layer, path, value))

    names: dict[str, tuple[str, ...]] = {}
    for _, path, _ in collected:
        name = var_name(path)
        if name in names:
            raise ValueError(f"CSS name collision: {name} for {path} and {names[name]}")
        names[name] = path

    lines: list[str] = []
    lines.append("/* ==========================================================================")
    lines.append("   hound-dock high-fidelity tokens — GENERATED FILE, DO NOT EDIT")
    lines.append("")
    lines.append("   Source:    docs/03_design/design_tokens.json")
    lines.append(f"   sha256:    {digest}")
    lines.append("   Generator: docs/03_design/highfi/tools/generate_tokens.py")
    lines.append("   Status:    Draft. The source is not a Frozen design system.")
    lines.append("   Layers:    primitive -> semantic -> component. Light theme only.")
    lines.append("   Rule:      every line below is projected from one JSON token value.")
    lines.append("              Regenerate; never hand-edit this file.")
    lines.append("   ========================================================================== */")
    lines.append("")
    lines.append(":root {")

    current_layer = None
    current_group = None
    total = 0
    for layer, path, value in collected:
        if layer != current_layer:
            if current_layer is not None:
                lines.append("")
            lines.append(f"  /* ---- {layer} ------------------------------------------------------- */")
            current_layer = layer
            current_group = None
        group = path[1] if len(path) > 2 else layer
        if group != current_group and len(path) > 2:
            lines.append("")
            lines.append(f"  /* {layer}.{group} */")
            current_group = group
        rendered = resolve(value, lookup, ".".join(path))
        lines.append(f"  {var_name(path)}: {rendered}; /* {'.'.join(path)} */")
        total += 1

    lines.append("}")
    lines.append("")
    lines.append(f"/* tokens projected: {total} */")
    lines.append("")

    TARGET.write_text("\n".join(lines), encoding="utf-8")
    print(f"wrote {TARGET.relative_to(REPO)} — {total} tokens, source sha256 {digest[:12]}…")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
