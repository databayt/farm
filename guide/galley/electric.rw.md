# Igikoni gikuru: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igishushanyo giteganywa (design intent) cyo ku wa 2026-10-31, cooking line ikoresha gaz LPG (D-065). Buri gipimo cy'amashanyarazi (rating) ni agaciro k'igishushanyo kagenewe icyapa cy'ibipimo (rating plate) cy'icyuma kizahitwamo, kugeza igihe umuyagankuba (electrician) wa RURA class A azategura installation akayiha icyemezo (certificate) [A].

Ibyo umuyagankuba akeneye byose ngo ashyire amashanyarazi mu gikoni gikuru: umuriro wa fazi imwe, imizunguruko (circuits), first fix mbere y'uko lining zifungwa, second fix, igerageza (tests) na buri point.

English: [read this page in English](electric.md) · Insinga mu bishushanyo: [urupapuro rw'igikoni gikuru](/en/galley#electrical) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Uburyo bwose: [amashanyarazi ya sitidiyo](../studio/electric.md)

## Mu ncamake

| Iki | Igishushanyo (design) |
|---|---|
| Aho umuriro uturuka (supply) | 230 V fazi imwe, insinga ishyinguye mu butaka iturutse kuri board yo ku kibanza cy'ifamu ([amashanyarazi y'ifamu](../farm/electric.md)) |
| Board (tableau) | ku rukuta rw'imbere iruhande rw'urugi rw'abakozi: main switch double-pole ya 63 A ifite ikirinda imiriro itunguranye (surge protection), RCBO imwe kuri buri muzunguruko |
| Imizunguruko (circuits) | 9; cooking line ikoresha gaz LPG ([gaz y'ifamu](../farm/gas.md)), bityo umuzunguruko umwe muto ugaburira gusa icyatsa cya range, itara ry'ifuru na vane ya gaz, ufite isolator yawo iruhande rwa cooking line |
| Umutekano | emergency stop iri iruhande rw'urugi rwa serivisi ifunga vane ya gaz n'icyatsa inyuze muri contactor imwe; cooking line ikora gusa iyo extract fan ikora, ni interlock iri muri hood control |
| Umuriro ukenewe (demand) | hafi 8 kWh ku munsi na hafi 13 kW zihujweho cooking line itekesha gaz [E, imizunguruko iri hasi]; guteka ubwako ni hafi kg 2.2 za LPG ku munsi zo mu nyandiko ya gaz |

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Ibiti bibanza.** Tangira first fix gusa iyo ibiti (battens) bimaze gufatwa kandi impapuro za hasi zimaze gushyirwaho.
2. **Mbere ya insulation.** Buri conduit, buri gasanduku na buri nsinga bigomba kuba byashyizwemo, byageragejwe, byafotowe kandi byasinyweho mbere y'uko inkuta zifungwa.
3. **Mbere yo guha umuriro.** Igerageza ritsinda, kandi icyemezo cya RURA gisinywa, mbere y'uko igikoni gikuru gihabwa umuriro.

## Intambwe

1. **First fix:** agasanduku ka board iruhande rw'urugi rw'abakozi; conduit izamuka ijya mu gisenge, ikanyura muri cyo, hanyuma ikamanuka igororotse ijya kuri buri gasanduku; insinga z'umuzunguruko ku wundi, iya range ijya kuri isolator yayo iruhande rwa cooking line.
2. **Igerageza mbere ya lining:** continuity na insulation resistance kuri buri nsinga; fotora buri rukuta; sinya uruhushya (release).
3. **Second fix:** board, isolators, emergency stop na contactor yayo kuri vane ya gaz, hood control na fan yo ku gisenge, priza za IP44, amatara (battens) ya IP65 na alarm y'ubushyuhe.
4. **Icyemezo (certificate):** polarity, igihe RCBO zimara ngo zihagarike umuriro (trip times), earth rod, emergency stop na interlock ya fan bigeragejwe; icyemezo cya RURA mbere y'uko igikoni gikuru gihabwa umuriro.

## Imizunguruko (circuits)

[Imizunguruko (circuits)](../../src/components/galley/docs-sections.tsx#GalleyCircuits)

## Points

[Points z'amashanyarazi](../../src/components/galley/docs-sections.tsx#GalleyElectricPoints)

