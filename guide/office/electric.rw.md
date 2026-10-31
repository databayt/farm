# Ibiro: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igitekerezo cy'igishushanyo (design intent) cyo ku wa 2026-10-31. Ibipimo byose by'amashanyarazi (ratings) ni igitekerezo cy'igishushanyo kugeza igihe umuyagankuba (electrician) ufite uruhushya rwa RURA (class A) azategura aho umuriro uturuka akanaha ibiro icyemezo (certificate); nta kintu cya network kirashakirwa aho kiva cyangwa ngo gihabwe igiciro.

Ibyo umuyagankuba akeneye byose ngo ashyire amashanyarazi mu biro, n'umuyoboro wa network ifamu itangiriraho: imizunguruko (circuits), akabati kari kuri UPS yako, first fix na second fix, igerageza na buri point.

English: [read this page in English](electric.md) · Insinga na network mu bishushanyo: [urupapuro rw'ibiro](/en/office#electrical) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Uburyo bwose: [amashanyarazi ya sitidiyo](../studio/electric.md)

## Mu ncamake

| Iki | Uko byateganyijwe |
|---|---|
| Aho umuriro uturuka (supply) | insinga ivuye kuri board yo ku kibanza cy'ifamu (site board), ingano yayo igenwa n'umuyagankuba akurikije uburebure bwayo ([amashanyarazi y'ifamu](../farm/electric.md)) |
| Board (tableau) | board ifatwa hejuru y'urukuta (surface unit board) ku rukuta rw'inyuma: main switch double-pole ya 32 A, surge protection (SPD) type 2, RCBO imwe (30 mA, type A) kuri buri muzunguruko |
| Imizunguruko (circuits) | 4: amatara, priza (sockets), akabati ka network na UPS yako, n'umwe usigaye (spare) |
| Network | akabati gato ko ku rukuta: router imwe ya 4G ifite SIM ya sosiyete ya kabiri nk'ingoboka (failover), PoE switch na edge gateway, ari na yo ifata amashusho ya kamera |
| Bivuye kuri switch | access point yo ku gisenge y'ibiro, aho data icomekwa ku meza manini, n'insinga yo hanze ijya kuri access points na kamera ziri ahandi ku ifamu |

Akabati na UPS yako bifite umuzunguruko wabyo bwite, bityo Wi-Fi na kamera by'ifamu bikomeza gukora kuri bateri iyo umuriro ubuze.

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Ibiti mbere.** Tangira first fix gusa iyo ibiti (battens) bimaze gufatwa kandi impapuro za hasi zimaze gushyirwaho.
2. **Mbere ya insulation.** Buri conduit, buri gasanduku, buri nsinga na buri nsinga ya data bigomba kuba byashyizwemo, byageragejwe, byafotowe kandi byasinyweho mbere y'uko inkuta zifungwa.
3. **Mbere yo guha umuriro.** Igerageza ritsinda kandi icyemezo cya RURA gisinywa mbere y'uko ibiro bihabwa umuriro.
4. **Nta radio mbere y'isuzuma.** Nta router, access point cyangwa kamera bigurwa mbere y'isuzuma ry'umuyoboro wa telefoni (signal survey).

## Intambwe

1. **First fix:** agasanduku ka board ku rukuta rw'inyuma; conduit izamuka mu gisenge, ikanyura muri cyo, hanyuma ikamanuka igororotse ijya kuri buri gasanduku; insinga z'umuzunguruko ku wundi; insinga za data kuva ku kabati kugeza kuri access point no ku meza manini, n'aho insinga yo hanze yinjirira.
2. **Igerageza mbere ya lining:** continuity na insulation resistance kuri buri nsinga; fotora buri rukuta; sinya uruhushya (release).
3. **Second fix:** shyiraho board, amatara na priza; manika akabati na router, switch, gateway na UPS yako.
4. **Icyemezo (certificate):** polarity, igihe RCBO zimara ngo zihagarike umuriro (trip times) na earth; icyemezo cya RURA mbere y'uko ibiro bihabwa umuriro; hanyuma igerageza rya mbere rya network.

## Imizunguruko (circuits)

[Imizunguruko (circuits)](../../src/components/office/docs-sections.tsx#OfficeCircuits)

## Points

[Points z'amashanyarazi](../../src/components/office/docs-sections.tsx#OfficeElectricPoints)

## Points za network

[Points za network](../../src/components/office/docs-sections.tsx#OfficeNetworkPoints)

## Ibibazo bitarasubizwa

1. Ikibanza kibona umuyoboro wa telefoni umeze ute? Router na access points bitegereje isuzuma.
2. Ese umuzunguruko wo gukonjesha uzagaruka ku murongo usigaye (spare, C4)?
