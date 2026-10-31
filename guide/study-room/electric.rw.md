# Icyumba cyo kwigiramo: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igitekerezo cy'igishushanyo (design intent) cyo ku wa 2026-10-31. Ibipimo byose by'amashanyarazi (ratings) ni igitekerezo cy'igishushanyo kugeza igihe umuyagankuba (electrician) ufite uruhushya rwa RURA (class A) azategura aho umuriro uturuka akanaha icyumba icyemezo (certificate).

Ibyo umuyagankuba akeneye byose ngo ashyire amashanyarazi na Wi-Fi mu cyumba cyo kwigiramo: imizunguruko (circuits), first fix mbere y'uko lining zifunga, second fix, igerageza na buri point.

English: [read this page in English](electric.md) · Insinga mu bishushanyo: [urupapuro rw'icyumba cyo kwigiramo](/en/study-room#electrical) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Uburyo bwose: [amashanyarazi ya sitidiyo](../studio/electric.md)

## Mu ncamake

| Iki | Uko byateganyijwe |
|---|---|
| Aho umuriro uturuka (supply) | insinga ivuye kuri board yo ku kibanza cy'ifamu (site board), ingano yayo igenwa n'umuyagankuba akurikije uburebure bwayo ([amashanyarazi y'ifamu](../farm/electric.md)) |
| Board (tableau) | board ifatwa hejuru y'urukuta (surface unit board) ku rukuta rw'inyuma: main switch double-pole ya 32 A, surge protection (SPD) type 2, RCBO imwe (30 mA, type A) kuri buri muzunguruko |
| Imizunguruko (circuits) | 4: amatara amanitse (pendants) na fan zo ku rukuta, priza z'ameza z'intebe zose umunani, urukuta rwa screen n'inguni yo gusomeramo, n'umwe usigaye (spare) |
| Intebe | priza ebyiri (double socket) ku rukuta rw'inyuma inyuma ya buri ntebe ebyiri, bityo buri ntebe ikagira iyayo |
| Wi-Fi | access point imwe yo ku gisenge, ihabwa umuriro unyuze mu nsinga yayo uvuye kuri PoE switch y'ibiro; screen yerekana ibiri kuri mudasobwa inyuze kuri Wi-Fi (cast), aho data icomekwa hakaba ingoboka |

Nta AC ihari: ahubwo hari fan ebyiri zo ku rukuta.

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Ibiti mbere.** Tangira first fix gusa iyo ibiti (battens) bimaze gufatwa kandi impapuro za hasi zimaze gushyirwaho.
2. **Mbere ya insulation.** Buri conduit, buri gasanduku, buri nsinga na buri nsinga ya data bigomba kuba byashyizwemo, byageragejwe, byafotowe kandi byasinyweho mbere y'uko inkuta zifungwa.
3. **Mbere yo guha umuriro.** Igerageza ritsinda kandi icyemezo cya RURA gisinywa mbere y'uko icyumba gihabwa umuriro.

## Intambwe

1. **First fix:** agasanduku ka board ku rukuta rw'inyuma; conduit izamuka mu gisenge, ikanyura muri cyo, hanyuma ikamanuka igororotse ijya kuri buri gasanduku; insinga z'umuzunguruko ku wundi; insinga ya access point, aho data ya screen icomekwa n'agasanduku insinga yinjiriramo, hasi ku rukuta rw'inyuma, ku nsinga ivuye ku biro.
2. **Igerageza mbere ya lining:** continuity na insulation resistance kuri buri nsinga; fotora buri rukuta; sinya uruhushya (release).
3. **Second fix:** shyiraho board, amatara amanitse, fan zo ku rukuta, priza na access point.
4. **Icyemezo (certificate):** polarity, igihe RCBO zimara ngo zihagarike umuriro (trip times) na earth; icyemezo cya RURA mbere y'uko icyumba gihabwa umuriro.

## Imizunguruko (circuits)

[Imizunguruko (circuits)](../../src/components/study-room/docs-sections.tsx#StudyRoomCircuits)

## Points

[Points z'amashanyarazi na Wi-Fi](../../src/components/study-room/docs-sections.tsx#StudyRoomElectricPoints)
