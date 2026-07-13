# 2026–2027 HS Applied Engineering & Robotics — Pacing Map

**First day:** Aug 31, 2026  
**Last day:** Jun 11, 2027 (half day)  
**End of Semester 1 (last student day):** Thu Jan 21, 2027  
**Records Day / Semester break:** Fri Jan 22, 2027 (staff only — no students)  
**Start of Semester 2:** Mon Jan 25, 2027  
**Semester 1:** 88 instructional days | **Semester 2:** 91.5 instructional days | **Total:** 180.5 days  
**8th Grade Group 1:** Aug 31 – Jan 21 | **8th Grade Group 2:** Jan 25 – Jun 11

### Key: Calendar Flags
- ⚡ 20-min period day (counts as full day, less instruction time per period)
- 🟡 Short week (2–4 days)
- 🔴 No school / holiday
- 🧪 State testing (limited real instruction)
- 🌿 Break

---

## SEMESTER 1
### Unit 1 — Engineering Design Process & Teambuilding
*Goal: EDP foundation, design brief skills, teamwork habits. Project replaced with robot-adjacent challenge.*

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 1 | Aug 31 – Sep 4 | 5 | | Intro, syllabus/safety rules, EDP overview; Paper Glider + Spaghetti Tower rapid prototype challenges |
| 2 | Sep 7–11 | 4 | 🟡 🔴 Labor Day Sep 7 | **Cardboard Robot Deck Challenge** — teams receive component blocks (battery, Arduino, motor controller mock-ups) and design/build a prototype deck from cardboard within a size envelope. Full EDP cycle: design brief → sketches → build → drop test → iterate. **EDP quiz end of week.** |

**Why cardboard deck instead of phone stand:** Directly previews the CNC deck students will design in Fusion (Week 6–7). Teaches component placement, spatial constraints, and iterative design with zero tools. The "customer requirements" are the robot's actual needs.

---

### Unit 2 — CAD: Component-Based Approach *(Revised from 2025-26)*
> **Change from last year:** Drop the generic Fusion "30 Days" tutorial series as the primary spine. Each lesson = one actual robot component. Teach CAD hygiene explicitly before every component: plan the sketch, fully constrain, one sketch → one extrude.

**Components and fabrication method:**
| # | Component | Method | Key design constraint |
|---|---|---|---|
| 1 | Motor mount | 3D print | Shaft alignment, bolt pattern |
| 2 | IR sensor mount | 3D print | 15mm ground clearance |
| 3 | Battery holder | 3D print | Wire relief cutouts |
| 4 | Ultrasonic sensor mount | 3D print | Forward-facing, secure fit |
| 5 | Robot deck | CNC cut (polycarbonate) | Component layout, wire pass-throughs, hole patterns |
| 6 | Electronics mount | CNC cut | Standoff spacing, Arduino + motor controller positioning |

**Level definitions (apply to all 6 components):**
- **Level 1:** Follow the instructional video; replicate Mr. B's design exactly → **C**
- **Level 2:** Modify the design (improve fit, reduce weight, add a functional feature) → toward **B**
- **Level 3:** Completely unique design meeting the same functional requirements → toward **A**
- **Level 4:** Advanced challenge (e.g., parametric design, design for a different constraint) → still **A**

**2nd-year students:** Run through all components but will finish Level 1 significantly faster. When ahead, move to Level 2/3 on completed components, or pull from the continuous improvement list.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 3 | Sep 14–18 | 5 | | CAD hygiene rules + F360 orientation; **C1: Motor Mount** — extrude, holes, bolt pattern, constraints |
| 4 | Sep 21–25 | 5 | | Motor mount: tolerance fit, iterate, 3D print; version naming (v1-Base, v2-FitFix); **mid-unit CAD checkpoint quiz** |
| 5 | Sep 28 – Oct 2 | 5 | ⚡ Sep 30 | **C2: IR Sensor Mount** — 15mm ground clearance constraint, positioning; print + test |
| 6 | Oct 5–9 | 5 | | **C3: Battery Holder** — wire relief features; print + test; **C4: Ultrasonic Sensor Mount** — forward-facing, secure fit |
| 7 | Oct 12–16 | 4 | 🟡 🔴 Records Day Oct 13 | **C5: Robot Deck** — hole patterns, wire pass-throughs, component layout; CNC toolpath intro (awareness) |
| 8 | Oct 19–23 | 5 | | **C6: Electronics Mount** — standoffs, Arduino + motor controller spacing; CNC awareness continued; **CAD quiz end of week** |

**Unit 2 deliverable:** All 6 components modeled, fabricated/test-fit, saved with version names.  
**Quizzes:** Mid-unit checkpoint (Week 4) + CAD quiz (Week 8).

---

### Unit 3 — Safety & Tool Certification *(Expanded from 2025-26)*
> **Change from last year:** Unit 3 used to cover OSHA/LOTO/SDS only. Adding hands-on tool certification so students arrive at the build phase already cleared. CNC router license moves here from Week 11.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 9 | Oct 26–30 | 5 | | OSHA/LOTO/PPE/SDS + Matthew Henne + Lac-Mégantic case reviews; drill press cert |
| 10 | Nov 2–6 | 5 | | Pedestal grinder cert; hand drill cert; **CNC awareness** (Year 1: safety, what the machine does, toolpath concepts — not independent operation); safety quiz |

**Unit 3 deliverable:** Signed certification card for each tool. All certs required before build phase.  
**Safety quiz** end of Week 10.

**CNC progression across years (same machine, deeper responsibility each year):**
- Year 1: Awareness — safety rules, observe operation, understand toolpaths conceptually
- Year 2: Operator — load and run jobs independently, monitor cuts
- Year 3: Programmer — create toolpaths in CAM, set feeds/speeds, generate G-code

**2nd-year safety track:** Skip foundational OSHA/case review content (already tested); earn additional individual tool certifications instead. Exact additional certs TBD.

---

### Robot Build — Physical Assembly
> **Change from last year:** Students arrive with all 5 components already designed and test-fit. Build phase starts from a common baseline — no group is still designing their motor mounts while another group is cutting decks. Pairs instead of 3–4 person groups to reduce hiding spots.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 11 | Nov 9–13 | 5 | ⚡ Nov 11 (20-min day) | Cut decks on CNC (all groups); motor mount final print |
| 12 | Nov 16–20 | 5 | | Assemble frame: motors, wheels, caster; caliper measurements |
| 13 | Nov 23–24 | 2 | 🟡 Thanksgiving week | Wire electronics; battery + Arduino mount |
| — | Nov 25–28 | — | 🌿 Thanksgiving Break | |
| 14 | Nov 30 – Dec 4 | 5 | | Wiring complete; motor test; troubleshooting |
| 15 | Dec 7–11 | 5 | | Robot rolling under manual control; begin sensor wiring |
| 16 | Dec 14–18 | 5 | | Build buffer / holiday 3D print projects (ornaments, etc.) if ahead of schedule |
| — | ~Dec 21 – Jan 3 | — | 🌿 Winter Break | |

---

## SEMESTER 2

### Unit 5 — Programming & Electronics (Arduino)
> **Change from last year:** Programming starts Semester 2 with a working physical robot in hand. Iterative chunk approach — small deliverables with check-ins, not one large spec. AI tutor active for guided coding steps.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 17 | Jan 4–8 | 5 | | Lessons 1–3: Arduino intro, IDE setup, digital outputs, variables |
| 18 | Jan 11–15 | 5 | ⚡ Jan 13 (20-min) | Lessons 4–5: Control structures, loops; **Quiz: Lessons 1–5** |
| 19 | Jan 18–22 | 3 | 🟡 🔴 MLK Day Jan 18 + Records Day Jan 22 — **last week of S1** | Finish Lesson 5; review; last student day = Thu Jan 21 |
| 20 | Jan 25–29 | 5 | | Lessons 8–9: Serial monitor, functions; robot motor control code |
| 21 | Feb 1–5 | 5 | | Robot drives: basic motor sketch on physical robot; encoder intro |

---

### Line Following
| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 22 | Feb 8–12 | 5 | | IR sensor wiring + analogRead; threshold calibration |
| 23 | Feb 15–19 | 4 | 🟡 🔴 Presidents Day Feb 15 | PID control intro; tune on Track 1 |
| 24 | Feb 22–26 | 5 | | Track 1 practical (complete in under 1 min); begin Track 2 tuning |

---

### Scanner Robot
| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 25 | Mar 1–5 | 5 | | Ultrasonic sensor: HC-SR04 wiring, distance measurement |
| 26 | Mar 8–12 | 5 | ⚡ Mar 10 (20-min) | Servo control; 180° sweep; data arrays |
| 27 | Mar 15–19 | 5 | | Scanning algorithm; obstacle detection logic |
| 28 | Mar 22–25 | ~3.5 | 🟡 Pre-spring break | Scanner practical / portfolio submission |
| — | Mar 26 – Apr 4 | — | 🌿 Spring Break | |

---

### Claw Project & Design Brief
| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 29 | Apr 5–9 | 5 | | Claw intro: servos + gripper mechanics; design brief D8 |
| 30 | Apr 12–16 | ~2 real | 🧪 State testing Tue–Thu | Work time; state testing days = independent coding |
| 31 | Apr 19–23 | 5 | | Claw build + wiring; potentiometer control |
| 32 | Apr 26–30 | 5 | | Claw practical; design brief D9 due |

---

### Capstone, Portfolio & Review
| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 33 | May 3–7 | 5 | ⚡ May 5 (20-min) | Open-ended challenge or improvement project |
| 34 | May 10–14 | 5 | | Portfolio completion push; all deliverables finalized |
| 35 | May 17–21 | 5 | 🎓 May 20 = last day for seniors | Review: EDP, CAD, safety, programming — plan last senior assignment to be completable before May 20 |
| 36 | May 24–28 | 5 | | Final exam |
| 37 | May 31 – Jun 4 | 4 | 🟡 🔴 Memorial Day May 31 | Return exams; wrap-up projects; demos |
| 38 | Jun 7–11 | 4.5 | Half day Jun 11 (last day) | End-of-year reflection; equipment return |

---

## Open Questions to Resolve

1. **Unit 2 component count** — 5 components listed (motor mount, IR mount, battery holder, deck, electronics). Is that the right set for the build? Any missing?
2. **Group size** — reflection suggested pairs instead of 3–4. Confirm before first day so seating/equipment can be planned.
3. **AI tutor integration** — which programming lessons get tutor support? At minimum Lessons 6–9 (sensors, serial, functions). Needs tutor lesson entries created before Jan.
4. **Design brief deliverables (D8/D9)** — are these still the claw project brief + spec sheet? Or does the new component-based approach add earlier D-deliverables?
5. **SEMESTER_START in app.js** — currently set to `2026-02-02` (old). Needs to be updated before students log in. Affects week number display and "overdue" flags.
6. **8th grade pacing** — once this map is solid, the 8th grade version compresses it to ~18 weeks (Semester 1 only). Which units get cut vs. shortened?
7. **D&B Lab** — separate pacing map needed; doesn't share this unit structure.

## Leveled Difficulty System
Every assignment has up to 4 levels. Students choose their level — grade reflects what they complete.

| Level | Grade | What it looks like (example: motor mount) |
|---|---|---|
| 1 | C | Follow instructional video; replicate Mr. B's design exactly |
| 2 | → B | Minor modifications or functional improvements |
| 3 | → A | Significant redesign or completely unique design |
| 4 | still A | Extra challenge; no grade benefit — for students who want to push |

**Still to design:** Level 2/3/4 definitions for each unit (CAD components, safety certs, programming challenges, robot build).

## 2nd-Year Student Track (design in progress)
- **Safety:** Skip foundational content if test already passed → earn additional tool certs instead
- **CAD:** Repeat full unit (new approach), but will move faster → need divergence plan for when they're ahead
- **Programming/Build:** TBD — likely skip basics, jump to advanced challenges
- **All other units:** TBD

## Quiz Schedule (all quizzes built into portfolio system)
More quizzes than 2025-26. Every unit gets at least one; long units get a mid-unit checkpoint.
- **EDP quiz** — end of Week 2
- **CAD checkpoint quiz** — ~Week 5 (mid-unit)
- **CAD quiz** — end of Week 8
- **Safety quiz** — end of Week 10
- **Programming quiz (Lessons 1–5)** — Week 18
- **Programming quiz (Lessons 6–9)** — ~Week 20
- Additional quizzes TBD: line following, scanner, claw units
*Quiz content for each needs to be added to quiz-content.js before the unit starts.*

---

## Curriculum Change Log (from 2025-26 Reflection)
- **CAD unit redesigned** — component-based lessons replace generic "30 Days" tutorial series
- **Safety unit expanded** — drill press, grinder, hand tools certification added; all certs before build
- **Group size reduced** — pairs recommended to reduce accountability gaps
- **Build phase prerequisites** — tool certs + 5 components designed before any physical build begins
- **Documentation** — Fusion 360 version naming enforced (v1-Base, v2-Gusset) replaces worksheet-based iteration log
