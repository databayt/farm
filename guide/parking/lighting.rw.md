# Parikingi: amatara

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igitekerezo cy'igishushanyo (design intent) cyo ku wa 2026-10-31. Amatara yose akoresha izuba (D-065): nta nsinga iva kuri board y'ifamu, bityo inzira yinjira ntiyongera umuriro ukenewe ku mizunguruko yayo; nta kintu kiragenerwa ingano cyangwa ngo kiboneke aho kugurwa [A].

Ibyo umuyagankuba (electrician) akeneye byose ngo amurikire inzira yinjira nijoro: amatara y'izuba yo hasi (bollards), amatara y'izuba yo ku nkingi, icyuma gifata izuba na bateri by'icyapa ubwacyo, na buri point.

English: [read this page in English](lighting.md) · Amatara mu bishushanyo: [urupapuro rwa parikingi](/en/parking#lighting) · Igihe bikorwa: [gahunda y'imirimo](plan.md)

## Mu ncamake

| Iki | Uko byateganyijwe |
|---|---|
| Amatara yo hasi (bollards) | 4, uburebure bwa hafi m 0.8, buri rimwe rifite icyuma cyaryo gifata izuba, bateri na sensori icana nimugoroba, ku gashingiro gato hakurya y'impera ya kure ya parikingi, kure y'amashami y'ibiti |
| Amatara yo ku nkingi (lanterns) | amatara abiri yo ku nkingi, akoresha izuba, buri rimwe rifite icyuma cyaryo hejuru: L1 ku irembo ry'inyuma, L2 ku irembo ry'imbere |
| Icyapa | icyuma gifata izuba cya 100 W ku mutwe w'urukuta gisharija bateri iri mu gasanduku kadatinya imvura kari inyuma y'urukuta; charge controller yacyo na timer bigaburira driver ya 24 V y'inyuguti za LED |
| Insinga | nta n'imwe mu butaka: imiyoboro migufi y'icyapa gusa, imanuka ku rukuta ikanarunyuramo |

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Ibyuma bifata izuba biri ku zuba.** Buri cyuma kibona ikirere gifunguye mu masaha yo hagati y'umunsi, kure y'amashami y'ibiti.
2. **Bigeragezwa nimugoroba.** Buri tara ryaka ubwaryo nimugoroba mbere y'uko inzira yinjira ikoreshwa nijoro.

## Intambwe

1. **Udushingiro:** agashingiro gato ka beto kuri buri tara ryo hasi, m 0.35 hakurya y'impera ya kure.
2. **Amatara yo hasi n'ayo ku nkingi:** fatisha amatara yo hasi ku dushingiro twayo n'ayo ku nkingi ku mitwe yazo.
3. **Ibikoresho by'icyapa:** fatisha icyuma ku mutwe w'urukuta n'agasanduku inyuma y'urukuta; manura insinga y'icyuma ku rukuta igere ku gasanduku, unyuze iy'inyuguti mu rukuta; huza bateri, controller na driver.
4. **Igerageza:** reka bisharijwe umunsi umwe, hanyuma urebe buri tara ryaka nimugoroba; tunganya timer y'icyapa.

## Points

[Points z'amatara](../../src/components/parking/docs-sections.tsx#ParkingLightingPoints)

## Ibibazo bitarasubizwa

1. Inyuguti zaka ijoro ryose cyangwa zizima ku isaha ya timer? Controller y'icyapa ifite timer ishobora gukora kimwe muri ibyo byombi.
2. Imyanya 1 na 2 iri munsi y'amashami y'igiti gitanga igicucu, aho itara ry'izuba ryo hasi ritasharija: ese urumuri rwa B1 rurahagije aho?
