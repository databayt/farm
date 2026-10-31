# Ifamu: amashanyarazi

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: inama yo ku wa 2026-10-31. Ingano y'umuriro ukenewe (loads) ni ibigereranyo [E]: igikoni gikuru gitekesha gaz LPG (D-065) kandi ibyuma bishyushya amazi (heaters) byo mu byumba by'abashyitsi biracyategerejwe guhitwamo; ibiciro ni uko byatangajwe ku matariki byatangarijweho.

Uko ifamu ikwiye kubona amashanyarazi, icyo buri buryo butwara, n'intambwe zo kubishyiraho, bigenewe nyir'ifamu n'umuyagankuba (electrician).

Inama mu murongo umwe: huza ifamu n'umuyoboro wa REG (grid / réseau), wongereho sisitemu y'imirasire y'izuba ya hafi 8 kWp ifite bateri (batteries) za hafi 15 kWh zigenewe ibintu bitagomba guhagarara na rimwe, ushyushye amazi ukoresheje izuba, kandi ugumane moteri itanga umuriro (générateur) nk'ingoboka gusa (emergency backup).

English: [read this guide in English](electric.md) · Gucapa: [aya mabwiriza nka PDF](../../public/guides/farm-electric-rw.pdf) · Igihe bikorwa: [gahunda y'imirimo y'ifamu](plan.md)

## Mu ncamake

### Ibyo ifamu ikoresha

Buri nyubako, n'ingufu ikoresha ku munsi usanzwe n'umuriro mwinshi ikurura icyarimwe. Uburyo: ingufu (power) za buri gikoresho zikubwe n'amasaha gikora, hanyuma hagakoreshwa diversity factor ku bikoresho bitajya bikorera rimwe byose [E].

| Inyubako | Ku munsi (kWh) | Ntarengwa icyarimwe (peak, kW) | Ibisobanuro |
|---|---|---|---|
| Sitidiyo, ebyiri | 16 | 20.8 | 45 A kuri buri sitidiyo, kuri 230 V (D-021, D-053); hob, heater ya douche ihita ishyushya amazi ya 5.5 kW, n'ibiteganyirijwe AC (AC provision) |
| Ibyumba by'abashyitsi, bitatu | 12 | 9 | buri cyumba gifite douche yacyo (D-029): heater muri buri cyumba, cyangwa amazi ashyushywa n'izuba (solar hot water) |
| Igikoni gikuru (galley) | 8 | 7 | guteka kuri gaz LPG (D-065): firigo, hood, heater y'amazi, amatara |
| Akabari (bar) | 5 | 5 | imashini y'ikawa (kW 3 kugeza kuri 4, D-065), firigo, amatara, umuziki |
| Icyumba cyo kwigiramo (study room) | 6 | 2 | mudasobwa zigendanwa (laptops) 8, screen (écran), fans |
| Ibiro (office), ubwiherero rusange, igikoni cy'abashyitsi | 9 | 5 | |
| Pompe: iya borehole n'iyongera umuvuduko (booster) | 5 | 2 | zikora saa sita z'amanywa, igihe izuba riva cyane |
| Amatara yo hanze, Wi-Fi, CCTV | 5 | 1 | ibintu bitagomba guhagarara na rimwe |
| **Igiteranyo cy'ifamu yose** | **hafi 66** | **hafi 42** | harimo diversity |

### Amakuru agena icyemezo

| Ingingo | Agaciro | Aho byakuwe (source) |
|---|---|---|
| Guhuzwa n'umuyoboro bwa mbere (new connection), ku ntera itarenze m 37 uvuye ku murongo w'amashanyarazi | 56,000 RWF, phase imwe cyangwa eshatu (monophasé cyangwa triphasé), harimo na mubazi (meter) | Politiki ya REG yo guhuza abakiriya (connection policy) [V ENG-18] |
| Kuva kuri m 37 kugeza kuri m 800 | 56,000 RWF hiyongereyeho ikiguzi cy'umurongo | REG [V ENG-18, ENG-19] |
| Kure kurushaho, cyangwa umuriro mwinshi kurusha uwo umurongo ushobora gutwara | umurongo wa MV (medium voltage, moyenne tension) na transformateur (transformer), byishyurwa n'umukiriya ariko bikaba umutungo wa REG | REG [V ENG-19] |
| Igihe ntarengwa cyo gutegereza | iminsi 5 y'akazi, amezi 2 iyo bisaba kwagura umurongo wa LV (low voltage, basse tension), amezi 3 iyo bisaba kwagura umurongo wa MV | RURA [V ENG-22] |
| Igiciro cy'umuriro wa REG, ubucuruzi (business) | 376 RWF/kWh hejuru ya 100 kWh ku kwezi, hiyongereyeho TVA (VAT) ya 18%: hafi 444 | RURA, guhera ku wa 1 Ukwakira 2025 [V ENG-20, ENG-21] |
| Igiciro cy'umuriro wa REG, amahoteli | 239 RWF/kWh munsi ya 660,000 kWh ku mwaka, hiyongereyeho TVA: hafi 282 | RURA [V ENG-20]; baza REG niba ifamu yemerewe iki giciro |
| Ibura ry'umuriro (outages) | hafi inshuro 17 ku mwaka, amasaha 11 yose hamwe, ku rwego rw'igihugu | Banki y'Isi (World Bank) [V ENG-23]; nta mibare ya Bugesera yabonetse |
| Umurongo w'i Gashora | feeder ya MV ya Kanazi | Itangazo rya REG rimenyesha ibura ry'umuriro [V ENG-29] |
| Izuba i Gashora | 4.35 kWh ku munsi kuri buri kWp ya panneaux solaires (solar panels), hafi 3.9 mu Gushyingo no mu Kuboza | Global Solar Atlas [V ENG-24] |
| Umusoro ku bikoresho by'imirasire y'izuba | nta TVA kuri panneaux, inverters (onduleurs), bateri za deep-cycle, ibyuma bishyushya amazi bikoresheje izuba (solar water heaters) na pompe, kugeza ku wa 30 Kamena 2028 | RRA [V ENG-25] |
| Uruhushya (licence) | ntirukenewe kuri sisitemu iri munsi ya 50 kW ikoreshwa aho yashyizwe (on site) | RURA [V ENG-26] |
| Kugurisha umuriro usagutse ku muyoboro wa REG | ntibirashoboka: net metering iracyigwa gusa | [V ENG-27] |
| Mazutu (diesel) | hafi 2,927 RWF kuri litiro | Kamena 2026 [V ENG-28, secondary] |

### Uburyo butatu

| | Umuyoboro wa REG wonyine | Imirasire y'izuba yonyine (off-grid) | Umuyoboro wa REG n'imirasire y'izuba (hybrid) |
|---|---|---|---|
| Icyo wubaka | guhuzwa n'umuyoboro (connection), board yo ku kibanza (site board) n'insinga zijya kuri buri nyubako | panneaux zibariwe ku kwezi kubi kurusha ayandi, bateri nini, moteri yo mu minsi y'ibicu | guhuzwa n'umuyoboro, panneaux za hafi 10 kWp, bateri za hafi 15 kWh |
| Ikiguzi cyo gutangira | ni cyo gito kurusha ibindi niba umurongo uri hafi | ni cyo kinini kurusha ibindi: panneaux na bateri bya 66 kWh ku munsi | kiri hagati |
| Ikiguzi cyo gukoresha | buri kWh ku giciro cya hafi 444 RWF | hafi ntacyo, ariko bateri zirasaza | izuba ritanga umuriro ku manywa; umuyoboro wa REG ugatanga usigaye |
| Iyo umuriro wa REG ubuze | byose birahagarara | nta gihinduka | bateri zikomeza gutanga umuriro kuri Wi-Fi, CCTV, firigo, pompe n'amatara amwe |
| Bikwiriye iyi famu iyo | umurongo uri hafi kandi amafaranga ari make | umurongo uri kure kandi igiciro batanze (quote) kiri hejuru cyane | umurongo ushobora kugerwaho: ni byo bishoboka cyane |

Icyo imirasire y'izuba izigama: buri kWp umuriro wayo ukoreshwa ku ifamu itanga hafi 1,589 kWh ku mwaka, zifite agaciro ka hafi 705,000 RWF ku giciro cy'ubucuruzi, cyangwa hafi 448,000 ku giciro cy'amahoteli [E, from ENG-20, ENG-24]. Kubera ko nta net metering ihari, hitamo ingano ya panneaux ihwanye n'ibyo ifamu ikoresha ku manywa, ntirenge aho.

### Inama yacu

1. **Umuyoboro wa REG mbere.** Saba guhuzwa n'umuyoboro kuri triphasé (three-phase), mu cyiciro kitari icy'ingo (non-residential); nyir'ifamu avuga ko umuyoboro wa REG ugera ku kibanza. Baza mu nyandiko niba tariff y'amahoteli ireba ifamu.
2. **Imirasire y'izuba ku manywa.** Panneaux za hafi 8 kWp kuri inverter ya hybrid (onduleur hybride) yashyizwe kuri zero export (nta muriro woherezwa ku muyoboro wa REG; igikoni gikuru gitekesha gaz, D-065): zitanga umuriro ukenerwa na pompe, amazi ashyushye, icyumba cyo kwigiramo n'ububiko bukonje.
3. **Bateri z'ibikenerwa by'ingenzi nijoro.** Bateri za LiFePO4 za hafi 15 kWh zigenewe Wi-Fi, CCTV, firigo na congélateurs (freezers), pompe n'amatara y'inzira (path lights), kugira ngo umuriro nubura ntihagire ubimenya.
4. **Izuba rishyushya amazi.** Ibyuma bishyushya amazi bikoresheje izuba (solar water heaters) ku byumba by'abashyitsi no ku bwiherero rusange; sitidiyo zigumana heater zazo zihita zishyushya amazi kuri douche, zikoresha amashanyarazi (D-053).
5. **Moteri y'ingoboka gusa.** Moteri ntoya ya mazutu (diesel) yo gukoresha iyo umuriro ubuze igihe kirekire, ishyiriweho insinga ku buryo ishobora guha umuriro board yo ku kibanza (site board); ntizigere iba isoko nyamukuru y'umuriro (main supply).
6. **Ibikoresha umuriro mwinshi bikore saa sita z'amanywa.** Vomesha pompe, shyushya amazi kandi umese ku manywa, igihe panneaux zitanga umuriro w'ubuntu.

## Ingingo zo guhagarara ukagenzura (hold points)

1. **Buri nyubako ibanza kugeragezwa no guhabwa icyemezo.** Nta nyubako ihabwa umuriro mbere y'uko igerageza ryayo ritsinda kandi umuyagankuba ufite uruhushya rwa RURA agasinya icyemezo cyayo (certificate), nk'uko bigenda kuri sitidiyo.
2. **Moteri inyuzwa kuri change-over gusa.** Iha board yo ku kibanza umuriro iyo uwa REG ubuze, ntizigere ikorana na wo icyarimwe.
3. **Zero export.** Inverter ntigurisha umuriro ku muyoboro wa REG kugeza igihe net metering itangiye gukurikizwa.

## Intambwe

1. Jyana indangamuntu (ID), icyangombwa cy'ubutaka (land title) n'uruhushya rwo kubaka (construction permit) ku ishami rya EUCL ry'i Bugesera, usabe igiciro cyanditse cyo guhuzwa n'umuyoboro (connection quote): triphasé, hafi 42 kW, n'intera kuva ku murongo w'amashanyarazi uri hafi kugeza ku irembo.
2. Saba abashyiraho sisitemu (installers) batatu bafite uruhushya rwa RURA (class D ni yo irimo imirasire y'izuba) kuguha igiciro (quote) cya sisitemu ya hybrid ya 8 kWp ifite bateri za LiFePO4 za 15 kWh, zero export, iri munsi ya 50 kW, idasoreshwa TVA (VAT-exempt).
3. Saba Ikigo cy'Imisoro n'Amahoro (RRA), mu nyandiko, kwemeza ko bateri za LiFePO4 zibarwa nka deep-cycle, kugira ngo zikomeze kudasoreshwa TVA.
4. Umuyagankuba ategura board yo ku kibanza: feeder imwe ya 63 A kuri buri sitidiyo, feeders z'izindi nyubako zose, inverter, na change-over ya moteri (igikoresho gihinduranya umuriro wa REG n'uwa moteri).
5. Hitamo ufite ibiciro (quotes) mu ntoki, ukurikije ibyatuma inama ihinduka biri hepfo, kandi wandike icyemezo mu gitabo cy'ibyemezo (decision log).

## Ibibazo bitarasubizwa

Buri kimwe muri ibi, nikimara kumenyekana, gihindura inama:

- Igiciro cyo guhuzwa n'umuyoboro (connection quote) kirenze cyane ikiguzi cya panneaux na bateri z'inyongera zakenerwa kugira ngo ifamu ibe off-grid: hitamo imirasire y'izuba yonyine.
- Net metering itangiye gukurikizwa: ongeraho panneaux, ugurishe umuriro usagutse.
- Ibura ry'umuriro ku ifamu rigaragaye ko rimara igihe kirekire kurusha imibare y'igihugu: ongera ubushobozi bwa bateri (battery capacity).
