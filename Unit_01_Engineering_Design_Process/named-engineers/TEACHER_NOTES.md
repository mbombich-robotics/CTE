# Named 23 — Teacher Notes & Repeat Guide

How the 3D printer naming system works, how it was built in 2026-27, and how to run it again next year.

---

## What this is

Each of the 23 3D printers in the shop is named after an engineer or scientist. Students nominated candidates in L1.1 using a Google Form. 23 winners were selected by the teacher based on merit of the person and quality of the nomination. The results live here as a permanent gallery that students can browse all year.

---

## Files in this folder

| File | Purpose |
|---|---|
| `data.js` | All 23 engineer profiles — edit this to update any fact, add a photo, or change next year's winners |
| `index.html` | Gallery page — links to all 23 profiles |
| `profile.html` | Single-profile template — reads `?id=` from URL, renders from `data.js` |
| `TEACHER_NOTES.md` | This file |

**Live URLs (GitHub Pages):**
- Gallery: `https://mbombich-robotics.github.io/CTE/Unit_01_Engineering_Design_Process/named-engineers/index.html`
- Profile: `…/profile.html?id=chuck-hull` (replace `chuck-hull` with any engineer's `id` from `data.js`)

---

## How photos work

Photos load automatically from Wikipedia's REST API at page-load time:
```
https://en.wikipedia.org/api/rest_v1/page/summary/{wikiTitle}
```
Each engineer in `data.js` has a `wikiTitle` field. If Wikipedia has a photo for that article, it appears on the gallery tile and the profile page. No downloads needed — photos are fetched at runtime and degrade gracefully (shows colored initials) when unavailable.

**To use a local photo instead:** place the file in `named-engineers/photos/` and set `photo: 'photos/filename.jpg'` in `data.js`. The `photo` field overrides Wikipedia.

**Engineers currently without photos** (Wikipedia has no suitable image):
- Bernhard Heine (obscure historical figure)
- S. Scott Crump (living person, limited Wikipedia presence)
- Others may load but not have a portrait-style image

---

## Hub integration

During the reveal week, the hub's side card (normally "Career Connection") shows a "Class Announcement" card linking to the gallery. This is controlled by `careerConnection` in `schedule-data.json`.

**Week 2 (Sep 7–11, 2026)** — active this week:
```json
"careerConnection": {
  "name": "The Named 23",
  "role": "23 engineers & scientists — chosen by the class",
  "link": "https://mbombich-robotics.github.io/CTE/Unit_01_Engineering_Design_Process/named-engineers/index.html",
  "linkText": "See the gallery →",
  "eyebrow": "Class Announcement"
}
```

**To restore the normal Career Connection next week:** replace the above with the next PLTW career profile entry (e.g., Jeremy James or whoever comes next in the rotation). Also sync the `EMBEDDED_SCHEDULE` block in `hub.html`.

**How the hub renders custom `careerConnection` fields:**
- `eyebrow` — replaces "Career Connection" label at top of card (optional; defaults to "Career Connection")
- `linkText` — replaces "View X's full profile ›" link text (optional; defaults to auto-generated)
- These fields were added to `renderCareer()` in `hub.html` for this feature; they're backward-compatible (old entries without them still work normally)

---

## The L1.1 activity (nomination)

**Lesson file:** `Unit_01_Engineering_Design_Process/Lesson_01_Intro_to_Engineering_Design.html` — slide 12, "Mission: Name Our 23 Printers"

**Google Form:** linked from the lesson slide. Collects: Engineer name, Field, Achievement, Surprising fact, Source.

**Google Sheet:** responses go to a sheet you can export as CSV or paste into Claude for analysis.

**Nomination requirements (shown to students):**
1. Engineer's full name & field
2. What they invented or achieved (1–2 sentences)
3. Why they deserve a printer name (2–3 sentences)
4. One surprising fact
5. Source — URL or book title

**Good Nominee Criteria (shown to students):**
- Must be an engineer, scientist, or inventor — not an athlete, entertainer, or businessperson, even if they hold a patent
- Real, documented contribution to engineering, technology, or science
- Connects to a field we use — fabrication, electronics, software, robotics, or design
- No duplicates — first to submit a name claims that person

**Selection criteria (teacher — not shown to students):**
- Merit of the person: real engineering/science career; not famous for something unrelated (sports, entertainment, etc.)
- Quality of nomination: accuracy, specificity of the surprising fact, whether the source is real and cited
- Disqualify: athletes, entertainers, businesspeople without technical credentials, unverifiable claims
- Prefer: diversity across fields and eras; people with direct connections to what the class does (3D printing, robotics)

---

## 2026-27 selection notes

**Total nominations received:** 47 (some duplicates; ~32 unique individuals)

**Disqualified (not engineers/scientists):**
- LeBron James (3 nominations) — professional athlete
- Michael Jackson (1 nomination) — entertainer; holds a patent but is not an engineer
- Lynn D. Stewart (2 nominations) — businessman; one nomination cited his federal fraud conviction as the "surprising fact"
- Scott Cawthon (1 nomination) — video game developer (Five Nights at Freddy's); not an engineer by any reasonable standard
- Bill Klunk (1 nomination) — insufficient verifiable engineering credentials

**Best nomination quality (worth acknowledging publicly):**
- Willis Carrier — student cited the Brooklyn printing plant story correctly and specifically
- Burt Rutan — student found the Dodge Dart wind tunnel story; original and well-sourced
- Chuck Hull — student correctly identified the eyewash cup as the first 3D-printed object

**Special printers (highest class relevance):**
1. **Chuck Hull** — invented 3D printing (SLA, 1983); first object ever printed was an eyewash cup
2. **S. Scott Crump** — invented FDM, the exact process used by every Bambu printer in the shop
3. **Woodie Flowers** — co-founded FIRST Robotics Competition (the competition the class participates in)

**Only one woman selected (Mary Anderson — windshield wiper).** Worth a brief class discussion: this reflects who gets written into engineering history, not who has contributed. The inspiration examples on the L1.1 nomination slide deliberately include more women (Grace Hopper, Katherine Johnson, Ada Lovelace, Stephanie Kwolek, Mae Jemison, Emily Roebling) to prime a more diverse nomination pool next year.

---

## How to run this next year

### 1. Collect nominations (L1.1, same Google Form)
- Keep the form open until a deadline (suggest: end of week 2)
- Download responses as CSV or paste into Claude for analysis

### 2. Evaluate nominations
Ask Claude: *"Here are the nominations for next year's printer naming. Apply the selection criteria (must be a real engineer/scientist, merit of the person, quality of nomination) and pick 23 winners. Note disqualified entries and flag the best-written nominations."* Paste the CSV data.

### 3. Update data.js
Replace all 23 ENGINEERS entries with next year's winners. Keep the same structure — `id`, `name`, `years`, `field`, `badgeColor`, `wikiTitle`, `accomplishments`, `fact`, `source`, `sourceUrl`, `nominatedBy`. Run Claude to write all 23 entries from the winner list.

### 4. Update the Named 23 artifact (the reveal page)
The reveal artifact at `https://claude.ai/code/artifact/8b86d7ca-8d3b-40bb-9c81-d1bf1c26d37e` is a standalone presentation page used for the in-class reveal. To update it for next year, open a Claude session, paste the artifact URL, and ask Claude to update it with next year's 23 winners. Claude can read the artifact and republish to the same URL.

### 5. Update hub.html for reveal week
In `schedule-data.json`, set the reveal week's `careerConnection` to:
```json
{
  "name": "The Named 23",
  "role": "23 engineers & scientists — chosen by the class",
  "link": "https://mbombich-robotics.github.io/CTE/Unit_01_Engineering_Design_Process/named-engineers/index.html",
  "linkText": "See the gallery →",
  "eyebrow": "Class Announcement"
}
```
Sync the `EMBEDDED_SCHEDULE` block in `hub.html`. Push. Revert the following week.

### 6. Push to GitHub Pages
```
git add Unit_01_Engineering_Design_Process/named-engineers/ hub.html schedule-data.json
git commit -m "feat: Named 23 — 2027-28 printer naming results"
git push
```
Pages deploys in ~1 minute.

---

## Design details (for Claude context)

**Aesthetic:** Dark theme — `#07090f` background, `#f0b429` gold accent, `#38bdf8` blue, `#34d399` green. Fonts: Bebas Neue (display), DM Sans (body), JetBrains Mono (labels/data). Matches the Named 23 reveal artifact.

**Photo system:** Wikipedia REST API (`/api/rest_v1/page/summary/{wikiTitle}`) → `thumbnail.source`. CORS-safe, no key, free. Photos load asynchronously and fade in. Initials avatar (deterministic background color) shown while loading or when no photo exists.

**Badge system:** `badgeColor: 'gold'` = 3D Printing Pioneer, `badgeColor: 'green'` = Robotics Connection, `nominationCount >= 3` = Fan Favorite (blue badge), otherwise no badge.

**Profile navigation:** `?id={engineer-id}` URL param. Prev/Next buttons. Arrow key support (← →).

**Hub card customization:** `careerConnection` in `schedule-data.json` supports optional `eyebrow` and `linkText` fields (added 2026-09-06). Standard entries without these fields still work normally.
