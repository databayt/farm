# Volleyball: materials

Status: design intent of 2026-10-31. Sizes come from volleyball.json and the FIVB rules; nothing for the court is sourced or priced yet [A].

What the court needs: its kit, and its net with the posts and the footings, as its page shows them.

The court drawn: [the volleyball page](/en/volleyball) · When it is needed: [the execution plan](plan.md)

## What to buy

[The kit, the net and its posts](../../src/components/volleyball/docs-sections.tsx#VolleyballMaterials)

The sandy topsoil for levelling and the grass seed for the bare patches come by the quantity the groundsman finds on the lawn.

## How a price becomes real

1. Start with the lines that move the total: the posts and their sleeves, the net and its antennae, the benches and the umbrellas.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/volleyball/rails.ts`, so the page and this table show it.
