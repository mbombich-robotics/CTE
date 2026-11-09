# Claude Code — Project Notes

Durable, project-wide facts and guidance that should apply on **every** machine (home and classroom). This file is tracked in git so both clones share the same context.

For machine-specific quirks (a broken port on the classroom laptop, a local IDE tweak, etc.), use the local auto-memory instead — those files live outside the repo and don't sync.

---

## Deployment / URLs

- The public site is served at **`https://mbombich-robotics.github.io/CTE/`** — not `/lessons/`.
- Do NOT construct URLs from the git remote name (`mbombich-robotics/lessons`). The Pages path is `/CTE/`, set in the repo's GitHub Pages settings.
- Example: `photo-booth.html` at the repo root → `https://mbombich-robotics.github.io/CTE/photo-booth.html`.

---

## FRC Portfolio is frozen

All FRC students migrated to the Robotics Portfolio in April 2026. The FRC Portfolio System at `Unit_08_FIRST_Robotics_Competition/FRC_Portfolio_System/` is **frozen** — no new features, no version bumps.

**When applying:**
- New deliverable / reflection / quiz / UI work goes into the Robotics Portfolio (currently reorganized under the newer track structure), never the FRC portfolio.
- Teacher-portal changes that touch both backends are still fine.
- If the user asks for a portfolio change without naming a course, default to Robotics.
- Don't propose adding Unit 9 (or later) content to the FRC portfolio. Plan is to unify into one portfolio with selectable tracks later.

---

## MC exam writing — balance option lengths

When generating multiple-choice exam questions (final, midterm, unit quiz), **the correct answer should be neither the shortest nor the longest option**. Ideally all four options stay within ±20% of each other in word count.

**Why:** on the 2026 Spring final (41 MC questions across Units 0–5), students spotted the pattern — the correct answer was visibly the longest, most-qualified option in ~30 of 41 questions, and they gamed the exam without knowing the content. Exam was technically sound but too easy because of the length tell.

**How to apply:**
- Draft the correct content first, then write distractors of similar length and grammatical structure. Add qualifying detail to distractors so they read like plausible textbook sentences.
- Avoid obviously-wrong joke distractors ("Logging into the school WiFi") — they collapse a 4-way to a 2-way and weaken the item.
- Watch for absolutes in distractors ("always", "only when…") — those signal "wrong" to test-savvy students. Put absolutes in correct answers when truthful; let distractors be plausibly partial-truths.
- Don't stop at randomizing the correct *letter* — the length tell defeats letter balance.
- Do a final length-normalizing pass at the end of every exam build. Trim or pad until the correct answer's length is unremarkable.

---

## Portfolio quizzes — one script file per new quiz

Each new quiz (or quiz set) gets its **own** Apps Script file, e.g. `Portfolio/quiz-content-safety.js` — do NOT append new quizzes into the existing per-course `quiz-content-<course>.js` files.

- The file defines its own registry constant (e.g. `SAFETY_QUIZ_REGISTRY`); the backend's `quizDef()` lookup in `google-apps-script.js` must be taught to check it.
- The name must match `quiz-content*.js` so `.gitignore` keeps it (and its answers) out of the public repo. Never commit quiz content or answer keys.
- Tell the user which file(s) to paste into each course's Apps Script project and to deploy a new version.

---

## Notes for Claude

- Prefer this file over local auto-memory for anything durable and project-wide.
- If you learn a new project-wide fact worth persisting across machines, add it here rather than to `~/.claude/projects/…/memory/`.
- Keep this file tight — it loads in full on every session on both machines. Split into referenced topic files if it grows past ~2 pages.
