# Ubwiherero rusange: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igitekerezo cy'igishushanyo (design intent) cyo ku wa 2026-10-31. Buri gikoresho, buri gipimo cy'amashanyarazi (rating) na buri ngano ni amahitamo y'igishushanyo umuyagankuba (electrician) agomba kwemeza; ingano ya feeder itegereje igishushanyo cya board yo ku kibanza (site board) [A].

Ibyo umuyagankuba akeneye byose ngo ashyire amashanyarazi mu bwiherero rusange: board n'imizunguruko (circuits) yayo, first fix, second fix, igerageza na buri point.

English: [read this page in English](electric.md) · Insinga mu bishushanyo: [urupapuro rw'ubwiherero rusange](/en/public-bathroom#electrical) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Uburyo bwose: [amashanyarazi ya sitidiyo](../studio/electric.md)

## Mu ncamake

| Iki | Uko byateganyijwe |
|---|---|
| Aho umuriro uturuka (supply) | feeder ivuye kuri board yo ku kibanza cy'ifamu ([amashanyarazi y'ifamu](../farm/electric.md)) |
| Board (tableau) | board ntoya ifungwa n'urufunguzo muri lobby, ku partition y'iburasirazuba y'icyumba cyo kunyaramo, hejuru y'aho umutwe ugera (D-060): main switch, surge protection, RCBO imwe ya 30 mA type A kuri buri muzunguruko; earthing ya TT ku earth rod y'inyubako ubwayo |
| Imizunguruko (circuits) | 4: amatara yo imbere na fan isohora umwuka (extract fan), itara riri hejuru y'urugi, priza y'ukora isuku, n'umwe usigaye (spare) |
| Amatara | amatara ya LED yo ku gisenge afite sensor ibona umuntu (motion sensor) muri buri cyumba; fan y'icyumba cyo kunyaramo ikora hamwe n'itara ryacyo n'iminota 15 nyuma yaho |
| Urugi | itara ryarwo riri kuri photocell na time switch biri muri board, ryaka hamwe n'amatara y'inzira guhera saa 18:00 |

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Mbere y'amakaro.** Buri conduit, buri gasanduku na buri nsinga bigomba kuba byashyizwemo kandi byageragejwe mbere y'uko lining n'amakaro bibifunga.
2. **Mbere yo guha umuriro.** Igerageza ritsinda kandi icyemezo cya RURA gisinywa mbere y'uko ubwiherero buhabwa umuriro.

## Intambwe

1. **First fix:** agasanduku ka board muri lobby, hejuru y'aho umutwe ugera; conduit izamuka mu mwanya uri mu gisenge (ceiling void), ikanyura muri wo, hanyuma ikamanuka igororotse ijya kuri buri gikoresho; insinga z'umuzunguruko ku wundi.
2. **Igerageza mbere y'amakaro:** continuity na insulation resistance kuri buri nsinga; fotora buri rukuta; sinya uruhushya (release).
3. **Second fix:** board, amatara yo ku gisenge na sensor zayo, fan y'icyumba cyo kunyaramo, itara riri hejuru y'urugi na time switch yaryo, priza y'ukora isuku.
4. **Icyemezo (certificate):** polarity, igihe RCBO zimara ngo zihagarike umuriro (trip times) na earth rod; icyemezo cya RURA mbere y'uko ubwiherero buhabwa umuriro.

## Imizunguruko (circuits)

[Imizunguruko (circuits)](../../src/components/public-bathroom/docs-sections.tsx#PublicBathroomCircuits)

## Points

[Points z'amashanyarazi](../../src/components/public-bathroom/docs-sections.tsx#PublicBathroomElectricPoints)

## Ibibazo bitarasubizwa

1. Umwanya usigaye (spare way) utegereje heater ya douche cyangwa icyuma cyumisha intoki (hand dryer): ese nyir'ifamu azongeraho kimwe muri byo?
