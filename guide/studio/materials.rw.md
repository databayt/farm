# Sitidiyo: ibikoresho

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: verisiyo {{studio.rev}}, {{studio.rev_date}}, {{studio.status}}. Buri giciro ni icy'agateganyo kugeza habonetse ibiciro bitatu byanditse (quotes) kuri buri murongo [A].

Ibyo sitidiyo imwe ikeneye byose: impapuro n'ibiti by'umubaji, urutonde rwuzuye rw'ibikoresho (bill of materials) kit ku yindi, na dosiye atelier ikatiraho.

English: [read this list in English](materials.md) · Sitidiyo mu bishushanyo: [urupapuro rwa sitidiyo](/en/studio) · Igihe bikenewe: [gahunda y'imirimo](plan.md)

## Ibyo kugura

### Urutonde rw'umubaji, kuri sitidiyo

| Ikintu | Umubare |
|---|---|
| Pulayiwudi 12, impapuro 2440 × 1220, hasi | {{studio.floor_sheets}} |
| Pulayiwudi 12, impapuro 2440 × 1220, lining | {{studio.sheets_ply12}} |
| Pulayiwudi 18, impapuro 2440 × 1220 | {{studio.sheets_ply18}} |
| Pulayiwudi itinjiza amazi (marine) 18, impapuro 2440 × 1220 (ubwiherero) | {{studio.sheets_mply18}} |
| Worktop 38, 3050 × 650 | {{studio.sheets_wtop38}} |
| Ibiti byatewe umuti 38 × 50, uburebure m 2.4 | {{studio.battens}}, wongereho 10% |
| Isashi ya membrane 250 µm | {{studio.membrane_m2}} m² |
| Imbaho z'igiti (oak planks) 5 zifite underlay | {{studio.plank_m2}} m² |
| Spray foam, ishyirwaho n'umuhanga wayo | {{studio.foam_m2}} m² |
| Vis zifite amababa 5.5 × 50 | {{studio.batten_screws}} |
| Vis z'igiti 4 × 30, hasi na lining | {{studio.floor_screws}} + {{studio.lining_screws}} |
| Ibitereko bya beto (block stands) 40 × 60 cm | 4 |

### Urutonde rw'ibikoresho (bill of materials)

[Urutonde rw'ibikoresho](../../src/components/studio/docs-sections.tsx#StudioBom)

Urutonde rwuzuye n'ibiciro ni [bill of materials](../../public/designs/studio/data/bom.csv); ingano ya buri gice iri muri [cut list](../../public/designs/studio/data/cut-list.csv). Ibyo sitidiyo zombi zisangiye n'ifamu (septic tank, ikigega cy'amazi na pompe yacyo yongera umuvuduko, board yo ku kibanza) biri ku [bikoresho by'ifamu](../farm/materials.md).

### Bikorerwa i Kigali, nk'uko IKEA ibikora

[Uko bikorwa nka IKEA](../../src/components/studio/docs-sections.tsx#StudioSteps)

[Dosiye za atelier](../../src/components/studio/docs-sections.tsx#StudioDownloads)

## Uko igiciro kiba icy'ukuri

1. Hera ku mirongo ihindura igiciro cyose: ibyuma na polycarbonate (kit y'igisenge), impapuro (boards), ibikoresho by'ubwiherero (sanitaryware), heater y'amazi, n'umushahara w'abakozi.
2. Saba ibiciro bitatu byanditse (quotes) kuri buri murongo, bifite ibisobanuro bimwe (specification) n'umubare umwe kuri sitidiyo zombi.
3. Andika buri giciro mu [gitabo cy'ibiciro](../../study/registers/prices.csv) n'itariki yacyo n'ugitanga (supplier), hanyuma ugaragaze ko umurongo wacyo wemejwe (verified).
4. Ongera wubake paki ya sitidiyo (`pnpm studio:build`): urutonde rw'ibikoresho n'ibiciro byose birahinduka.
