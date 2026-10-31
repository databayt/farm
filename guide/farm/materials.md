# The farm: materials

Status: placeholders of 2026-10-31: every price is an assumption until three quotes per line [A].

What the farm's shared works need: the septic system, the water storage and the booster. The power system is chosen from quotes on [the farm's electric](electric.md).

When it is needed: [the farm's execution plan](plan.md)

## What to buy

[Shared with the farm](../../src/components/studio/docs-sections.tsx#StudioShared)

The grid connection, the solar system and its batteries are not priced yet: [the farm's electric](electric.md) says what to ask EUCL and the installers to quote.

## How a price becomes real

1. Start with the lines that move the total: the septic tank, the storage tank and the booster pump, the solar system.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Rebuild what the line belongs to (`pnpm studio:build` for the shared works), so its totals update.
