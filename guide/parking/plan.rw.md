# Parikingi: gahunda y'imirimo

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igitekerezo cy'igishushanyo (design intent) cyo ku wa 2026-10-31. Inzira yinjira yashushanyijwe hashingiwe kuri compound.json n'uburyo busanzwe bwo gushyira amapave y'ibyatsi (grass pavers) ku butaka bw'ibumba; ubujyakuzimu ni imibare yo gutegura kugeza umwubatsi abonye ubutaka kandi ubutaka bugapimwa [A].

Buri ntambwe yo kubaka inzira yinjira: parikingi y'ibyatsi iri imbere y'irembo ry'inyuma, impande zayo, imirongo y'amabuye n'ibihagarika imodoka, amatara n'aho amazi y'imvura ajya.

English: [read this plan in English](plan.md) · Inzira yinjira mu bishushanyo: [urupapuro rwa parikingi](/en/parking) · Izindi paji zayo: [ibikoresho](materials.md), [amatara](lighting.md), [amazi y'imvura](drainage.md) · Aho iri: [igishushanyo mbonera](../farm/master-plan.md)

## Mu ncamake

[Inzira yinjira urebye uri hejuru: irembo ry'inyuma n'urukuta ruriho icyapa, parikingi y'ibyatsi n'imyanya yayo itanu, aho imodoka zihindukirira n'aho umuhanda w'amabuye utangirira](../../src/components/parking/parking-plan.tsx#ParkingPlan)

| Iki | Uko byateganyijwe |
|---|---|
| Parikingi | ubwatsi bwo ku mapave y'ibyatsi, 22 × 6 m ifite imfuruka zihetamye, imbere gato y'irembo ry'inyuma (D-017) |
| Imyanya (bays) | itanu, buri wose ufite ubugari bwa m 2.6, ku mpera yayo y'iburengerazuba; imodoka zinjira imbere zigahagarara ku giti kizihagarika (wheel stop); impera y'iburasirazuba ifunguye, m 9, ni iy'inzira y'imodoka, aho zihindukirira n'aho umuhanda w'amabuye utangirira |
| Irembo | inzugi ebyiri z'imbaho zikomejwe na X hagati y'inkingi z'amabuye, zitandukanye m 4.4, itara (lantern) ku nkingi y'ibumoso (D-022) |
| Amatara | inyuguti za LED z'icyapa n'amatara abiri yo ku nkingi, kuri photocell ibyatsa nimugoroba ikabizimya mu gitondo, bihabwa umuriro n'insinga inyura mu muyoboro uri mu butaka (duct) ku muhanda w'amabuye |
| Amazi y'imvura (drainage) | amapave n'amabuye ari munsi yayo (sub-base) ni yo ayayobora; umuferege (overflow trench) ku mpera y'iburengerazuba ujya mu cyobo cyinjiza amazi mu butaka (soakaway pit) |

## Mbere yo gutangira

1. Emeza aho irembo riri ku gishushanyo cy'ipima (survey): parikingi, aho imodoka zihindukirira n'umuhanda w'amabuye bishushanywa bihereye kuri ryo.
2. Umwubatsi arebe ubutaka kandi apime ubutaka: sub-base irabyibuha niba ubutaka bworoshye.
3. Kora percolation test (igerageza ry'uko ubutaka bunywa amazi) aho soakaway izajya, mbere y'uko ingano yayo yemezwa.

## Intambwe

1. **Umwubatsi:** kuraho ubwatsi kandi ucukure ahantu hose hafi m 0.32.
2. **Umuyagankuba (electrician):** shyiramo duct y'amatara mbere y'uko hari ikindi kiyirenga hejuru, hafi mm 450 mu butaka munsi ya tape y'umuburo ([amatara](lighting.md)).
3. **Umwubatsi:** sindagira sub-base y'amabuye amenaguye ya hafi m 0.2, hanyuma uburiri bwa m 0.04 bw'umucanga ukomeye n'ubutaka bwo hejuru (topsoil).
4. **Umufundi:** shyiraho impande z'amabuye zizengurutse ahacukuwe kugira ngo zifate amapave.
5. **Umwubatsi:** shyiraho amapave yegeranye; uzuza imyobo yayo ubutaka bwo hejuru (topsoil) kandi uyiteremo imbuto z'ubwatsi.
6. **Umufundi:** imirongo y'amabuye ya granite (setts) hagati y'imyanya, aho imodoka zihindukirira n'umuhanda w'amabuye; fatisha ibihagarika imodoka (wheel stops).
7. **Umwubatsi:** umuferege (overflow trench) wambukiranya impera y'iburengerazuba n'icyobo cya soakaway ([amazi y'imvura](drainage.md)).
8. **Umuyagankuba:** agasanduku ku rukuta ruriho icyapa, inyuguti n'amatara; igerageza.
9. **Umuhinzi w'ubusitani:** tera ibiti bitanga igicucu; uvomere imyobo y'amapave kugeza ubwatsi bufashe.

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Duct mbere y'amapave.** Nta kintu gishyirwa hejuru y'inzira y'insinga z'amatara mbere y'uko duct yayo ishyirwamo.
2. **Soakaway nyuma ya percolation test.** Ingano yayo ni iy'agateganyo kugeza igerageza rikozwe.
3. **Nta modoka ku bwatsi vuba cyane.** Ibyumweru 6 kugeza 8 by'imvura cyangwa byo kuvomera mbere y'uko imodoka ziparika kuri bwo.

## Byarangiye iyo

1. Imyanya itanu iri ku bwatsi bwakuze, ifite imirongo yayo n'ibihagarika imodoka.
2. Icyapa n'amatara yombi byaka nimugoroba kandi bikazima ku isaha yagenwe (timer).
3. Imvura nyinshi icengera mu butaka cyangwa igatemba ijya mu muferege, kandi nta mazi y'umuhanda yinjira anyuze mu irembo.

## Ibibazo bitarasubizwa

1. Ese imyanya itanu ihagije iyo inzu yuzuye? Inzu yuzuye ni abashyitsi 22 bari mu matsinda 11 n'abakozi bagera kuri 7 (D-031): niba kimwe cya kabiri cy'amatsinda kiza mu modoka, ni imodoka 6 ku myanya 5 utabariyemo iz'abakozi.
2. Minibisi cyangwa ikamyo izanye ibicuruzwa ihindukirira he? Impera ifunguye ni 9 × 6 m n'umuhanda w'amabuye ufite ubugari bwa m 4; nk'uko byashushanyijwe, isubira inyuma isohoka mu irembo yambukiranya umuhanda rusange.
3. Gusubira inyuma usohoka: inyuma y'imodoka iparitse iba hafi m 3 uvuye ku rukuta ruriho icyapa cyangwa ku ruzitiro rw'ibiti (hedge), munsi y'uburebure bw'imodoka; imyanya iri kuri dogere 90 akenshi iba ifite hafi m 6 inyuma yayo [A].
4. Imodoka itegereje ku irembo rifunze ihagarara mu muhanda: umurongo w'irembo uri m 0.8 uvuye ku nkombe y'umuhanda.
