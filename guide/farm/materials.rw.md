# Ifamu: ibikoresho

> **Ubusobanuro:** iyi nyandiko yahinduwe na mudasobwa (machine draft). Igomba gusuzumwa n'umuntu uvuga Ikinyarwanda kavukire mbere yo kuyiha abakozi. Iyo hari itandukaniro, kurikiza iy'Icyongereza.

Status: 2026-10-31. Urutonde rwa buri hantu, rwateranyijwe: imibare iva mu bishushanyo bya buri hantu [E], ibiciro ni iby'agateganyo bya AS-21 kugeza habonetse ibiciro bitatu byanditse (quotes) kuri buri murongo [A].

Urutonde rw'ibyubakwa byose bya mbere, ahantu ku hantu, hanyuma ibyo imirimo ifamu isangiye ikeneye: septic system, ububiko bw'amazi na booster. Sisitemu y'umuriro izatoranywa hakurikijwe ibiciro biri ku [mashanyarazi y'ifamu](electric.md).

English: [read this list in English](materials.md) · Igihe bikenewe: [gahunda y'imirimo y'ifamu](plan.md)

## Ibyubakwa bya mbere

[Urutonde rw'ibyubakwa bya mbere](../../src/components/farm/docs-sections.tsx#FarmBom)

## Imirimo isangiwe

[Ibisangiwe n'ifamu](../../src/components/studio/docs-sections.tsx#StudioShared)

Guhuzwa n'umuyoboro w'amashanyarazi (grid), sisitemu y'imirasire y'izuba na bateri zayo ntibirahabwa ibiciro: [amashanyarazi y'ifamu](electric.md) avuga icyo gusaba EUCL n'abashyiraho sisitemu (installers) guha ibiciro.

## Uko igiciro kiba icy'ukuri

1. Hera ku mirongo ihindura igiciro cyose: ibyomekwa n'ibisenge bya sitidiyo, septic tank, ikigega cy'amazi na pompe yongera umuvuduko (booster pump), sisitemu y'imirasire y'izuba.
2. Saba ibiciro bitatu byanditse (quotes) kuri buri murongo, bifite ibisobanuro bimwe (specification) n'umubare umwe.
3. Andika buri giciro mu [gitabo cy'ibiciro](../../study/registers/prices.csv) n'itariki yacyo n'ugitanga (supplier), hanyuma ugaragaze ko umurongo wacyo wemejwe (verified).
4. Ongera wubake icyo umurongo ubarirwamo: `pnpm studio:build` kuri sitidiyo n'imirimo isangiwe, hanyuma `python3 scripts/site/prices.py` ku gice buri hantu hagura, kugira ngo urutonde rwa buri hantu n'iki giteranyo bihinduke.
