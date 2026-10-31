# Parikingi: gahunda y'imirimo

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igitekerezo cy'igishushanyo (design intent) cyo ku wa 2026-10-31. Inzira yinjira yashushanyijwe hashingiwe kuri compound.json n'uburyo busanzwe bwo gukora parikingi y'amabuye mato (gravel) ku butaka bw'ibumba (D-065); ubujyakuzimu ni imibare yo gutegura kugeza umwubatsi abonye ubutaka kandi ubutaka bugapimwa [A].

Buri ntambwe yo kubaka inzira yinjira: parikingi y'amabuye mato iri imbere y'irembo ry'inyuma, imbaho ziyizengurutse, imirongo n'ibihagarika imodoka, amatara y'izuba n'aho amazi y'imvura ajya.

English: [read this plan in English](plan.md) · Inzira yinjira mu bishushanyo: [urupapuro rwa parikingi](/en/parking) · Izindi paji zayo: [ibikoresho](materials.md), [amatara](lighting.md), [amazi y'imvura](drainage.md) · Aho iri: [igishushanyo mbonera](../farm/master-plan.md)

## Mu ncamake

[Inzira yinjira urebye uri hejuru: irembo ry'inyuma n'urukuta ruriho icyapa, parikingi y'amabuye mato n'imyanya yayo itanu n'amatara yayo y'izuba, aho imodoka zihindukirira n'aho umuhanda w'amabuye utangirira](../../src/components/parking/parking-plan.tsx#ParkingPlan)

| Iki | Uko byateganyijwe |
|---|---|
| Parikingi | amabuye mato asindagiye, 22 × 6 m ifite imfuruka zihetamye, azengurutswe n'imbaho, imbere gato y'irembo ry'inyuma (D-017) |
| Imyanya (bays) | itanu, buri wose ufite ubugari bwa m 2.6, ku mpera yayo y'iburengerazuba, igaragazwa n'imirongo y'imbaho; imodoka zinjira imbere zigahagarara ku giti kizihagarika (wheel stop); impera y'iburasirazuba ifunguye, m 9, ni iy'inzira y'imodoka, aho zihindukirira n'aho umuhanda w'amabuye utangirira |
| Irembo | inzugi ebyiri z'imbaho zikomejwe na X hagati y'inkingi z'amabuye, zitandukanye m 4.4, itara ry'izuba (lantern) ku nkingi y'ibumoso (D-022) |
| Amatara | yose akoresha izuba, nta nsinga kandi nta muferege: amatara 4 yo hasi (bollards) hakurya y'impera ya kure, amatara abiri yo ku nkingi, n'icyuma gifata izuba na bateri by'icyapa ku nyuguti zacyo za LED |
| Amazi y'imvura (drainage) | amabuye mato yakira igice cy'imvura n'ishingiro ryayo rikamanura igisigaye, ku buhaname bw'ikibanza kigana ku muferege (trench) ku mpera y'iburengerazuba no ku cyobo cyinjiza amazi mu butaka (soakaway pit) |

## Mbere yo gutangira

1. Emeza aho irembo riri ku gishushanyo cy'ipima (survey): parikingi, aho imodoka zihindukirira n'umuhanda w'amabuye bishushanywa bihereye kuri ryo.
2. Umwubatsi arebe ubutaka kandi apime ubutaka: ishingiro (base) rirabyibuha niba ubutaka bworoshye.
3. Kora percolation test (igerageza ry'uko ubutaka bunywa amazi) aho soakaway izajya, mbere y'uko ingano yayo yemezwa.

## Intambwe

1. **Umwubatsi:** kuraho ubwatsi kandi ucukure ahantu hose hafi m 0.15, hasi hatunganyijwe hakurikije ubuhaname.
2. **Umwubatsi:** sasa geotextile hasi ahacukuwe.
3. **Umubaji:** fatisha imbaho zizengurutse ahacukuwe, hejuru yazo harenga mm 10 ku mabuye mato yarangiye.
4. **Umwubatsi:** sindagira ishingiro rya murram cyangwa amabuye amenaguye n'ivumbi ryayo, hafi m 0.11 mu byiciro bibiri.
5. **Umwubatsi:** sasa hafi m 0.04 z'amabuye mato y'impande ya mm 6 kugeza 14 uyasindagire.
6. **Umubaji n'umufundi:** imirongo y'imbaho hagati y'imyanya n'ibihagarika imodoka (wheel stops); amabuye ya granite (setts) y'aho imodoka zihindukirira n'ay'umuhanda w'amabuye.
7. **Umwubatsi:** umuferege (trench) wambukiranya impera y'iburengerazuba n'icyobo cya soakaway ([amazi y'imvura](drainage.md)).
8. **Umuyagankuba (electrician):** amatara y'izuba yo hasi ku dushingiro twayo, amatara ku nkingi n'icyuma, agasanduku n'inyuguti by'icyapa; buri kimwe kigeragezwa nimugoroba ([amatara](lighting.md)).
9. **Umuhinzi w'ubusitani:** tera ibiti bitanga igicucu.

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Geotextile mbere y'amabuye.** Nta buye rishyirwa ku ibumba ryambaye ubusa.
2. **Soakaway nyuma ya percolation test.** Ingano yayo ni iy'agateganyo kugeza igerageza rikozwe.
3. **Ubuhaname bugenzurwa.** Ubuhaname bw'ikibanza n'ubw'aho imodoka zihindukirira bugenzurwa na niveau mbere y'uko amabuye mato ashyirwaho.

## Byarangiye iyo

1. Imyanya itanu iri ku mabuye mato asindagiye azengurutswe n'imbaho, ifite imirongo yayo n'ibihagarika imodoka.
2. Amatara yo hasi, icyapa n'amatara yombi yo ku nkingi byaka nimugoroba ubwabyo, kandi inyuguti zikazima ku isaha yagenwe (timer).
3. Imvura nyinshi itemba ijya mu muferege no muri soakaway, kandi nta mazi y'umuhanda yinjira anyuze mu irembo.

## Ibibazo bitarasubizwa

1. Ese imyanya itanu ihagije iyo inzu yuzuye? Inzu yuzuye ni abashyitsi 22 bari mu matsinda 11 n'abakozi bagera kuri 7 (D-031): niba kimwe cya kabiri cy'amatsinda kiza mu modoka, ni imodoka 6 ku myanya 5 utabariyemo iz'abakozi.
2. Minibisi cyangwa ikamyo izanye ibicuruzwa ihindukirira he? Impera ifunguye ni 9 × 6 m n'umuhanda w'amabuye ufite ubugari bwa m 4; nk'uko byashushanyijwe, isubira inyuma isohoka mu irembo yambukiranya umuhanda rusange.
3. Gusubira inyuma usohoka: inyuma y'imodoka iparitse iba hafi m 3 uvuye ku rukuta ruriho icyapa cyangwa ku ruzitiro rw'ibiti (hedge), munsi y'uburebure bw'imodoka; imyanya iri kuri dogere 90 akenshi iba ifite hafi m 6 inyuma yayo [A].
4. Imodoka itegereje ku irembo rifunze ihagarara mu muhanda: umurongo w'irembo uri m 0.8 uvuye ku nkombe y'umuhanda.
