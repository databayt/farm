# Igikoni gikuru: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igishushanyo giteganywa (design intent) cyo ku wa 2026-10-31, cyateguwe ku guteka ku mashanyarazi. Buri gipimo cy'amashanyarazi (rating) ni agaciro k'igishushanyo kagenewe icyapa cy'ibipimo (rating plate) cy'icyuma kizahitwamo, kugeza igihe umuyagankuba (electrician) wa RURA class A azategura installation akayiha icyemezo (certificate) [A].

Ibyo umuyagankuba akeneye byose ngo ashyire amashanyarazi mu gikoni gikuru: umuriro wa three-phase, imizunguruko (circuits), first fix mbere y'uko lining zifungwa, second fix, igerageza (tests) na buri point.

English: [read this page in English](electric.md) · Insinga mu bishushanyo: [urupapuro rw'igikoni gikuru](/en/galley#electrical) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Uburyo bwose: [amashanyarazi ya sitidiyo](../studio/electric.md)

## Mu ncamake

| Iki | Igishushanyo (design) |
|---|---|
| Aho umuriro uturuka (supply) | 400 V three-phase, insinga ishyinguye mu butaka iturutse kuri board yo ku kibanza cy'ifamu ([amashanyarazi y'ifamu](../farm/electric.md)) |
| Board (tableau) | ku rukuta rw'imbere iruhande rw'urugi rw'abakozi: main switch four-pole ya 63 A ifite ikirinda imiriro itunguranye (surge protection), RCBO imwe kuri buri muzunguruko |
| Imizunguruko (circuits) | 11; range, griddle na fryer buri kimwe kiri ku muzunguruko wa three-phase ufite isolator yawo iruhande rwa cooking line |
| Umutekano | emergency stop iri iruhande rw'urugi rwa serivisi ihagarika cooking line yose inyuze muri contactor imwe; cooking line ikora gusa iyo extract fan ikora, ni interlock iri muri hood control |
| Umuriro ukenewe (demand) | 25 kWh ku munsi na 14 kW z'umuriro ntarengwa z'amabwiriza y'umuriro (power guide) zibarwa ku guteka ku mashanyarazi; hafi 8 kWh ku munsi niba cooking line itekesha gaz |

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Ibiti bibanza.** Tangira first fix gusa iyo ibiti (battens) bimaze gufatwa kandi impapuro za hasi zimaze gushyirwaho.
2. **Mbere ya insulation.** Buri conduit, buri gasanduku na buri nsinga bigomba kuba byashyizwemo, byageragejwe, byafotowe kandi byasinyweho mbere y'uko inkuta zifungwa.
3. **Mbere yo guha umuriro.** Igerageza ritsinda, kandi icyemezo cya RURA gisinywa, mbere y'uko igikoni gikuru gihabwa umuriro.

## Intambwe

1. **First fix:** agasanduku ka board iruhande rw'urugi rw'abakozi; conduit izamuka ijya mu gisenge, ikanyura muri cyo, hanyuma ikamanuka igororotse ijya kuri buri gasanduku; insinga z'umuzunguruko ku wundi, iza three-phase zijya kuri isolators za cooking line.
2. **Igerageza mbere ya lining:** continuity na insulation resistance kuri buri nsinga; fotora buri rukuta; sinya uruhushya (release).
3. **Second fix:** board, isolators, emergency stop na contactor yayo, hood control na fan yo ku gisenge, priza za IP44, amatara (battens) ya IP65 na alarm y'ubushyuhe.
4. **Icyemezo (certificate):** polarity, igihe RCBO zimara ngo zihagarike umuriro (trip times), earth rod, emergency stop na interlock ya fan bigeragejwe; icyemezo cya RURA mbere y'uko igikoni gikuru gihabwa umuriro.

## Imizunguruko (circuits)

[Imizunguruko (circuits)](../../src/components/galley/docs-sections.tsx#GalleyCircuits)

## Points

[Points z'amashanyarazi](../../src/components/galley/docs-sections.tsx#GalleyElectricPoints)

## Ibibazo bitarasubizwa

1. Guteka kuri gaz cyangwa ku mashanyarazi? Kuri gaz, range, griddle na fryer bitakaza imizunguruko yabyo ya three-phase, kandi umuriro igikoni gikuru gikoresha ku munsi ukava kuri hafi 25 kWh ukagera kuri hafi 8.
