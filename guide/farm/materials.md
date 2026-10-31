# The farm: materials

Status: 2026-10-31. Every place's bill, summed: quantities from each place's drawings [E], prices placeholders under AS-21 until three quotes per line [A].

The whole first build's bill, place by place, then what the farm's shared works need: the septic system, the water storage and the booster. The power system is chosen from quotes on [the farm's electric](electric.md).

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · When it is needed: [the farm's execution plan](plan.md)

## The first build

[The first build's bill](../../src/components/farm/docs-sections.tsx#FarmBom)

## The shared works

[Shared with the farm](../../src/components/studio/docs-sections.tsx#StudioShared)

The grid connection, the solar system and its batteries are not priced yet: [the farm's electric](electric.md) says what to ask EUCL and the installers to quote.

## How a price becomes real

1. Start with the lines that move the total: the studios' linings and roof kits, the septic tank, the storage tank and the booster pump, the solar system.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Rebuild what the line belongs to: `pnpm studio:build` for the studios and the shared works, then `python3 scripts/site/prices.py` for a part every place buys, so each place's bill and this sum update.
