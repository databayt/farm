# Study room: materials

Status: design intent of 2026-10-31. Sizes come from study-room.json; the electrical costs shown are the studio's placeholder prices (AS-21), and nothing else is sourced or priced [A].

What the study room needs: the table and the screen, the reading corner, and its electric devices with the Wi-Fi, as its page shows them.

Kinyarwanda: [soma uru rutonde mu Kinyarwanda](materials.rw.md) · The room drawn: [the study room page](/en/study-room) · When it is needed: [the execution plan](plan.md)

## What to buy

[The table and the screen, the reading corner and the electric devices](../../src/components/study-room/docs-sections.tsx#StudyRoomMaterials)

The floor, the battens and the linings follow the studio's list, scaled to the room ([the studio's materials](../studio/materials.md)).

## How a price becomes real

1. Start with the lines that move the total: the screen, the long table and its eight chairs, the bookshelf wall.
2. Ask for three written quotes per line, with the same specification and the same quantity.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/study-room/rails.ts`, so the page and this table show it.
