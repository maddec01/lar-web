---
'@lar-works/design-system': minor
---

Long values read whole. `ImageCard` titles clamp to two lines in every presentation (poster and person too) with the
full title on hover, and a missing subtitle closes up instead of leaving a blank line above the detail (story
`FileNameWithoutYear`). A single unbroken token — a file-name title (`harbour_footage_2009_FINAL`) in `ImageCard` and
`DetailHero`, an address in `DetailList wrapValues` — breaks after its separators (`_ . / : -`) instead of mid-word;
`DetailList wrapValues` labels wrap at word boundaries.

`Grid variant="posters"` columns are as wide as a catalog's poster cards (min 9.5rem, was 6.5rem), so a person's
"Appears on" posters match the catalog grid.

`DetailHero artworkSize="compact"`: artwork that is only a stand-in (no image of its own) sits as a small tile beside
the title instead of an empty poster-sized frame (story `PlaceholderArtwork`).
