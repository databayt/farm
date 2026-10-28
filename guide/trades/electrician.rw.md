# Amabwiriza y'umuyagankuba: sitidiyo

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: verisiyo {{studio.rev}}, {{studio.rev_date}}, {{studio.status}}. Ibipimo byose by'amashanyarazi (ratings) ni ibyo igishushanyo giteganya gusa (design intent), kugeza igihe umuyagankuba (electrician) ufite uruhushya rwa RURA (class A) azategura installation, akayishyiraho, kandi akayiha icyemezo (certificate) hakurikijwe RS 565-1:2011.

Ibyo umuyagankuba (electrician) akeneye byose ngo ashyire amashanyarazi muri sitidiyo imwe ya kontineri: first fix mbere y'uko inkuta zifungwa, second fix, igerageza (tests) n'icyemezo.

Sitidiyo zombi zishyirwamo amashanyarazi kimwe, bityo aya mabwiriza akora kuri zombi.

English: [read this guide in English](electrician.md) · Gucapa: [aya mabwiriza nka PDF](../../public/guides/electrician-rw.pdf)

## Amagambo akoreshwa hano

- **End A (impera A)**: urukuta rufunze rw'impera, iruhande rw'igitanda. **End B (impera B)**: impera ifite inzugi za kontineri, iruhande rw'ubwiherero.
- **Back wall (urukuta rw'inyuma)**: urukuta rurerure rudafite aho gufungukira. **Front wall (urukuta rw'imbere)**: urukuta rurerure rufite urugi runyerera rw'ikirahure.
- Imyanya iri mu mbonerahamwe ya points ni milimetero zibarwa uhereye ku rukuta rurangiye rwa end A (x), uhereye ku rukuta rw'inyuma rurangiye (y), na hejuru uhereye hasi harangiye (z).

## Sitidiyo mu ncamake

| Iki | Igishushanyo (design) |
|---|---|
| Aho umuriro uturuka (supply) | inlet imwe ya 32 A (aho umuriro winjirira), IP67, IEC 60309 y'ubururu (2P+E), hanze ku rukuta rw'inyuma, inyuma neza ya board; isoko y'umuriro iyo ari yo yose ya 230 V |
| Breaker nkuru (main) | breaker (disjoncteur) double-pole ya 32 A (C curve) na DIN kWh check meter (mubazi yo kugenzura); tails za 6 mm² zinyura muri gland |
| Board (tableau) | imyanya 24 (modules) mu mirongo ibiri ya 12: breaker nkuru, check meter, SPD type 2, priority relay na contactor yayo, RCBO imwe (30 mA, type A) kuri buri muzunguruko (circuit) |
| Imizunguruko (circuits) | 8, kuva C1 kugeza C8 (imbonerahamwe iri hepfo) |
| Umuriro ntarengwa ukenewe (maximum demand) | 30.0 A (diversified): amatara 0.3 + fans 0.3 + priza (sockets) 16.4 + ikinini muri ibi bibiri: hob 11.6, cyangwa heater 8.7 hamwe na AC 4.3 |
| Earthing (guhuza n'ubutaka) | TT: earth rod (piquet de terre) imwe kuri buri kontineri; ntuzigere ukoresha umuriro (supply) uhuza neutral na earth (PME) |
| Inzira y'insinga (cable route) | conduit ya mm 20 mu myanya iri hagati y'ibiti (battens), itwikirwa na spray foam nyuma ya first fix |

| Ryari | Iki | Intambwe |
|---|---|---|
| Nyuma y'ibiti (battens, S03) | First fix: earth rod, conduits, udusanduku (boxes), insinga | S04 |
| Nyuma ya lining n'igikoni | Second fix: board, ibikoresho (devices), igerageza, icyemezo (certificate) | S19 |

## Ingingo eshatu zo guhagarara ukagenzura (hold points)

1. **Ibiti bibanza.** Tangira first fix gusa iyo ibiti (S03) bimaze gufatwa kandi impapuro za hasi zimaze gushyirwaho.
2. **Mbere ya foam.** Buri conduit, buri gasanduku na buri nsinga bigomba kuba byashyizwemo, byakorewe igerageza ry'insulation (insulation test), byafotowe urukuta ku rundi, kandi byasinyweho mbere ya spray foam (S05). Foam itwikira conduits: nyuma nta kindi gishobora kongerwamo, keretse ukurura insinga uzinyujije muri conduits.
3. **Mbere yo guha umuriro.** Igerageza ritsinda, kandi icyemezo cya RURA (certificate) gisinywa, mbere y'uko inlet ihabwa umuriro bwa mbere.

## S04: first fix (imirimo ya mbere)

1. Shyira agasanduku ka board ku rukuta rw'inyuma aho igikoni kiri, n'inlet hanze, inyuma yako neza: ni imyanya DB na PI mu mbonerahamwe ya points.
2. Shinga earth rod (E1) hanze ya end B, ukurure insinga yayo uyigeze kuri earth bar ya board; resistance yayo uzayipima nyuma, mu gihe cy'igerageza.
3. Zamura conduit ya mm 20 uhereye kuri board ujya mu mwanya uri mu gisenge (ceiling void), uyinyuze muri uwo mwanya, hanyuma uyimanure ugororotse ujya kuri buri gasanduku. Nta conduit ihengamye (diagonal); fata buri gasanduku ku giti (batten).
4. Kurura insinga za buri muzunguruko (circuit): 1.5 mm² kuri C1 na C6, 2.5 mm² kuri C2, C3, C5, C7 na C8, 4 mm² kuri C4.
5. Sohora C6 (amatara yo hanze) unyujije muri gland imwe iri ku gice cy'urukuta rw'imbere kidafite ikirahure (solid front strip), ku ruhande rw'igitanda; hanze, ukomeze muri conduit itangizwa n'izuba (UV-stable).
6. Ubwiherero: itara rya IP65 na fan isohora umwuka (extract fan) ya IPX4 (zone 1, hejuru ya tray kandi munsi ya m 2.25), nta priza, kandi switch yabyo iri hanze y'urugi.
7. Andika nimero (id) ya buri point ku cyuma iruhande rw'agasanduku kayo, kugira ngo umubaji akate impapuro za lining ahantu nyaho.
8. Gerageza continuity n'insulation resistance kuri buri nsinga, ufotore buri rukuta, hanyuma ni bwo usinya uruhushya rwo gushyiramo foam (release).

[Table: Imizunguruko (circuits): insinga, breaker, uburebure bw'insinga n'igabanuka rya voltage (voltage drop)](../../public/designs/studio/data/circuits.csv)

[Table: Points: icyo ari cyo, aho kiri n'uburebure bwacyo kuva hasi](../../public/designs/studio/data/points.csv)

## S19: second fix (imirimo ya kabiri)

1. Shyiraho ibigize board: breaker nkuru (main breaker) na check meter, SPD, priority relay na contactor, na RCBO zose (B6 kuri C1 na C6, B16 kuri C2, C3, C5, C7 na C8, B20 kuri C4).
2. Shyiraho ibikoresho (devices): amatara, fans, priza, aho hob icomekwa (hob outlet P9: umuriro wayo ucibwa kuri RCBO yayo muri board, igaragara uri kuri hob), n'alarms z'umwotsi n'ubushyuhe (AL1, AL2).
3. Huza (bond) na main earthing terminal: kontineri ubwayo, deck y'imbere, esikariye n'ibyuma byo ku gisenge (roof steelwork).
4. Genzura priority relay: iyo hob ikora, water heater (C5) na AC (C7) bigomba kuzima.

## Igerageza mbere yo guha umuriro

1. Continuity ya buri nsinga irinda (protective conductor).
2. Insulation resistance ya buri muzunguruko.
3. Polarity kuri buri priza no kuri buri tara.
4. Resistance ya earth electrode E1: andika agaciro kabonetse.
5. Igihe buri RCBO imara ngo ihagarike umuriro (trip time).
6. Akadirishya kerekana uko SPD imeze (status window), na priority relay indi nshuro.
7. Icyemezo cya RURA (certificate), mbere y'uko inlet ihabwa umuriro.

## Guha inlet umuriro

- Isoko y'umuriro iyo ari yo yose ya 230 V, 50 Hz ishobora guha inlet umuriro (board yo ku kibanza, generator cyangwa inverter y'imirasire y'izuba), niba irinda insinga yayo kuri 32 A cyangwa munsi yaho. Isoko y'umuriro ifamu izakoresha ni ikibazo gisubizwa mu [mabwiriza y'umuriro (power guide)](power.md).
- Mubazi ya kWh muri buri sitidiyo ni mubazi yo kugenzura (check meter) gusa, igamije gukurikirana: amashanyarazi abarirwa mu giciro cy'icyumba.

## Ibishushanyo

![E-101 Electrical layout plan](../../public/designs/studio/drawings/e-101.svg)

![E-201 Single-line diagram: inlet and unit board](../../public/designs/studio/drawings/e-201.svg)

![E-202 Circuit schedule, earthing and bonding](../../public/designs/studio/drawings/e-202.svg)
