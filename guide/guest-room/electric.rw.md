# Icyumba cy'abashyitsi: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: byemejwe ku wa 2026-10-31 (D-061): buri cyumba gifite douche yacyo, bityo heater yacyo ihabwa umuzunguruko wayo bwite. Buri gipimo cy'amashanyarazi (rating) ni icyo igishushanyo giteganya (design intent), kugeza igihe umuyagankuba (electrician) ufite uruhushya rwa RURA (class A) azategura aho umuriro uturuka (supply) akanaha icyumba icyemezo (certificate).

Ibyo umuyagankuba akeneye byose ngo ashyire amashanyarazi mu cyumba kimwe cy'abashyitsi: imizunguruko (circuits), first fix mbere y'uko lining zifungwa, second fix, igerageza (tests) na buri point.

Ibyumba bitatu bishyirwamo amashanyarazi kimwe, bityo iyi paji ikora kuri byose uko ari bitatu.

English: [read this page in English](electric.md) · Insinga mu bishushanyo: [urupapuro rw'icyumba cy'abashyitsi](/en/guest-room#electrical) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Uburyo bwose: [amashanyarazi ya sitidiyo](../studio/electric.md)

## Mu ncamake

| Iki | Igishushanyo (design) |
|---|---|
| Aho umuriro uturuka (supply) | insinga iturutse kuri board yo ku kibanza cy'ifamu, ingano yayo igenwa n'umuyagankuba hakurikijwe uburebure bwayo ([amashanyarazi y'ifamu](../farm/electric.md)) |
| Board (tableau) | board y'icyumba ubwacyo ya modules 12 ishyirwa hejuru y'urukuta (surface board) iruhande rw'igitanda: main switch double-pole ya 63 A, ikirinda imiriro itunguranye (surge protection) type 2, RCBO imwe (30 mA, type A) kuri buri muzunguruko |
| Imizunguruko (circuits) | 5: amatara na fan yo ku rukuta, priza, iteganyirizwa rya AC (AC provision), heater ya douche, umwe w'ingoboka (spare) |
| Ubwiherero | itara rya IP44 na switch yaryo; heater ihita ishyushya amazi (instant heater) ya 5.5 kW muri douche, ku muzunguruko wayo bwite, nk'iya sitidiyo (D-053), ifite isolator double-pole hanze y'urugi rw'ubwiherero |
| Inzira y'insinga (cable route) | conduit muri lining: izamuka ijya mu gisenge, ikanyura muri cyo, hanyuma ikamanuka igororotse ijya kuri buri gikoresho |
| Iruhande rw'igitanda | amatara yo ku buriri acomekwa kuri P1 na P2, kugira ngo igitanda kigire itara kuri buri ruhande (D-029) |

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Ibiti bibanza.** Tangira first fix gusa iyo ibiti (battens) bimaze gufatwa kandi impapuro za hasi zimaze gushyirwaho.
2. **Mbere ya insulation.** Buri conduit, buri gasanduku na buri nsinga bigomba kuba byashyizwemo, byakorewe igerageza ry'insulation (insulation test), byafotowe kandi byasinyweho mbere y'uko inkuta zifungwa.
3. **Mbere yo guha umuriro.** Igerageza ritsinda, kandi icyemezo cya RURA gisinywa, mbere y'uko icyumba gihabwa umuriro.

## Intambwe

1. **First fix:** shyira agasanduku ka board iruhande rw'igitanda; zamura conduit uhereye kuri ko ujya mu gisenge, uyinyuze muri cyo, hanyuma uyimanure igororotse ijya kuri buri gasanduku; kurura insinga z'umuzunguruko ku wundi.
2. **Igerageza mbere ya lining:** continuity na insulation resistance kuri buri nsinga; fotora buri rukuta; sinya uruhushya (release).
3. **Second fix:** shyiraho board, hanyuma amatara, fan yo ku rukuta, priza, heater na isolator yayo, isolator ya AC na alarm y'umwotsi.
4. **Icyemezo (certificate):** polarity, igihe RCBO zimara ngo zihagarike umuriro (trip times) na earth; icyemezo cya RURA mbere y'uko icyumba gihabwa umuriro.

## Imizunguruko (circuits)

[Imizunguruko (circuits)](../../src/components/guest-room/docs-sections.tsx#GuestRoomCircuits)

## Points

[Points z'amashanyarazi](../../src/components/guest-room/docs-sections.tsx#GuestRoomElectricPoints)

## Ibibazo bitarasubizwa

1. Heater ihita ishyushya amazi cyangwa amazi ashyushywa n'izuba (solar hot water)? Igishushanyo gishyiraho heater ya sitidiyo ku muzunguruko wayo bwite; [amashanyarazi y'ifamu](../farm/electric.md) ahitamo ibyuma bishyushya amazi bikoresheje izuba ku byumba by'abashyitsi, byakuraho uwo muzunguruko na main switch ya 63 A.
2. Ingano y'insinga izana umuriro itegereje uburebure bw'inzira yayo, buzava ku ipima.
