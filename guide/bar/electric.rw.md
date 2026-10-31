# Akabari: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igishushanyo giteganywa (design intent) cyo ku wa 2026-10-31. Buri gipimo cy'amashanyarazi (rating) ni agaciro k'igishushanyo kagenewe icyapa cy'ibipimo (rating plate) cy'icyuma kizahitwamo, kugeza igihe umuyagankuba (electrician) wa RURA class A azategura installation akayiha icyemezo (certificate) [A].

Ibyo umuyagankuba akeneye byose ngo ashyire amashanyarazi mu kabari: aho umuriro uturuka (supply), imizunguruko (circuits), first fix mbere y'uko lining zifungwa, second fix, igerageza (tests) na buri point.

English: [read this page in English](electric.md) · Insinga mu bishushanyo: [urupapuro rw'akabari](/en/bar#electrical) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Uburyo bwose: [amashanyarazi ya sitidiyo](../studio/electric.md)

## Mu ncamake

| Iki | Igishushanyo (design) |
|---|---|
| Aho umuriro uturuka (supply) | 230 V single-phase, insinga ishyinguye mu butaka iturutse kuri board yo ku kibanza cy'ifamu ([amashanyarazi y'ifamu](../farm/electric.md)) |
| Board (tableau) | ku rukuta rw'inyuma aho binjirira: main switch double-pole ya 40 A ifite ikirinda inkuba n'imiriro itunguranye (surge protection), RCBO imwe kuri buri muzunguruko |
| Imizunguruko (circuits) | 7: amatara yo imbere, priza za back bar, imashini ya kawa yonyine ku wayo ifite switched spur iruhande rwayo, firigo, heater y'amazi, hanze (itara riri munsi ya flap), umwe w'ingoboka (spare) |
| Umuriro ukenewe (demand) | amabwiriza y'umuriro (power guide) aha akabari 5 kWh ku munsi n'umuriro ntarengwa wa 5 kW, harimo 3 kugeza 4 kW z'imashini ya kawa ya two-group (D-065) [E] |

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Ibiti bibanza.** Tangira first fix gusa iyo ibiti (battens) bimaze gufatwa kandi impapuro za hasi zimaze gushyirwaho.
2. **Mbere ya insulation.** Buri conduit, buri gasanduku na buri nsinga bigomba kuba byashyizwemo, byageragejwe, byafotowe kandi byasinyweho mbere y'uko inkuta zifungwa.
3. **Mbere yo guha umuriro.** Igerageza ritsinda, kandi icyemezo cya RURA gisinywa, mbere y'uko akabari gahabwa umuriro.

## Intambwe

1. **First fix:** agasanduku ka board aho binjirira; conduit izamuka ijya mu gisenge, ikanyura muri cyo, hanyuma ikamanuka igororotse ijya kuri buri gasanduku; insinga z'umuzunguruko ku wundi; umuzunguruko wo hanze unyura muri gland ujya ku itara riri munsi ya flap.
2. **Igerageza mbere ya lining:** continuity na insulation resistance kuri buri nsinga; fotora buri rukuta; sinya uruhushya (release).
3. **Second fix:** board, spur y'imashini ya kawa, priza, priza za firigo, aho heater icomekwa, amatara yo imbere n'inyuma.
4. **Icyemezo (certificate):** polarity, igihe RCBO zimara ngo zihagarike umuriro (trip times) na earth; icyemezo cya RURA mbere y'uko akabari gahabwa umuriro.

## Imizunguruko (circuits)

[Imizunguruko (circuits)](../../src/components/bar/docs-sections.tsx#BarCircuits)

## Points

[Points z'amashanyarazi](../../src/components/bar/docs-sections.tsx#BarElectricPoints)

## Ibibazo bitarasubizwa

1. Ni iyihe mashini ya kawa? Igipimo cyayo (rating) ni cyo kigena umuzunguruko wa kawa n'igice kinini cy'umuriro ntarengwa w'akabari wa hafi 5 kW.
