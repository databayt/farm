# Guest room: materials

Status: design intent of 2026-10-31. Sizes come from guest-room.json; the costs shown are the studio's placeholder prices (AS-21), and nothing is sourced yet [A].

What one guest room needs: its furniture, its bedding and lamps, and its electric devices, as its page shows them.

The rooms drawn: [the guest room page](/en/guest-room) · When it is needed: [the execution plan](plan.md)

## What to buy

[The bed, the room and the veranda, and the electric devices](../../src/components/guest-room/docs-sections.tsx#GuestRoomMaterials)

The floor, the battens and the linings follow the studio's list, scaled to the room ([the studio's materials](../studio/materials.md)).

## How a price becomes real

1. Start with the lines that move the total: the bed and its mattress, the wardrobe, the electric devices.
2. Ask for three written quotes per line, with the same specification and the quantity for three rooms.
3. Record each quote in the [prices register](../../study/registers/prices.csv) with its date and supplier, and mark its line verified.
4. Write the price on its card in `src/components/guest-room/rails.ts`, so the page and this table show it.
