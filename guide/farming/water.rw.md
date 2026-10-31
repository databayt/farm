# Ubuhinzi: amazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: igishushanyo giteganywa (design intent) cyo ku wa 2026-10-31. Imiterere yakozwe na generator (`scripts/site/farming.mjs`); ikigega cy'amazi (tank), pompe n'isoko ni iby'ifamu, kandi bitegereje igerageza rya borehole (iriba ricukuwe) [A].

Uko amazi agera kuri buri karima: kuva ku isoko y'ifamu, ikigega na pompe, anyura mu kayunguruzo (filter), itiyo nkuru (main) n'itiyo igaburira (supply) ijya kuri robine (valve) imwe kuri buri tsinda ry'uturima (block), hanyuma itiyo y'umutwe (header) ya buri tsinda n'amatiyo abiri y'ibitonyanga (drip lines) kuri buri karima kahinzwe.

English: [read this page in English](water.md) · Ibitonyanga mu bishushanyo: [urupapuro rw'umurima](/en/farming#water) · Igihe bikorwa: [gahunda y'imirimo](plan.md) · Aho amazi aturuka: [amazi y'ifamu](../farm/water.md)

## Mu ncamake

| Iki | Igishushanyo (design) |
|---|---|
| Isoko | ikigega na pompe by'ifamu, bitegereje igerageza rya borehole ([amazi y'ifamu](../farm/water.md)) |
| Akayunguruzo n'itiyo nkuru | akayunguruzo ka disiki (disc filter) ka 1 inch, hanyuma itiyo nkuru ya mm 40 ijya ku irembo ry'umurima |
| Itiyo igaburira (supply) | itiyo ya mm 32 inyura ku nzira nkuru no mu nzira ziri hagati y'uturima, ijya kuri valve imwe kuri buri tsinda |
| Uturima | header ya buri tsinda inyura ku mpera z'uturima zireba irembo, n'amatiyo abiri y'ibitonyanga kuri buri karima kahinzwe |
| Amazi akenewe | {{farming.water.dryLow}} kugeza {{farming.water.dryHigh}} m³ ku munsi mu mezi y'izuba ryinshi, hafi {{farming.water.wet}} m³ mu gihe cy'imvura [E] |

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Borehole ibanza kugeragezwa.** Ingano y'ikigega na pompe igenwa gusa igerageza rya borehole rimaze kwerekana amazi itanga.
2. **Buri kenge gatonyanga (emitter) kagenzurwa.** Amazi y'ibitonyanga afungurwa mu isaha imwe kandi buri emitter igenzurwa mbere y'uko hagira igiterwa.

## Intambwe

1. **Itiyo nkuru:** kuva ku kigega na pompe by'ifamu, unyuze muri disc filter, itiyo nkuru ya mm 40 ijya ku irembo.
2. **Itiyo igaburira:** itiyo ya mm 32 inyura ku nzira nkuru no mu nzira ziri hagati y'uturima, valve kuri buri tsinda.
3. **Headers:** header ya buri tsinda inyura ku mpera z'uturima zireba irembo.
4. **Ibitonyanga:** amatiyo abiri y'ibitonyanga kuri buri karima kahinzwe, ava kuri header yako.
5. **Igerageza:** fungura amazi mu isaha imwe, ugenzure buri emitter, hanyuma usasire uturima ibyatsi byumye (mulch).

## Points

[Points z'amazi](../../src/components/farming/docs-sections.tsx#FarmingWaterPoints)

## Ibibazo bitarasubizwa

1. Umurima uzakoresha amazi ya borehole cyangwa ay'umuyoboro rusange (mains), kandi borehole itanga amazi angana iki kuva muri Kamena kugeza muri Kanama?
