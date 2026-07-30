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
| 1 | Aug 31 – Sep 4 | 4 | 🔴 Sep 4 no school | **Lessons 1.1–1.5:** Intro to AE&R (1.1) → Spaghetti Tower, no framework (1.2) → EDP Framework (1.3) → Paper Glider, EDP applied (1.4) → Writing a Design Brief (1.5) · **D: Signed syllabus + safety contract** |
| 2 | Sep 7–11 | 4 | 🟡 🔴 Labor Day Sep 7 | **Lessons 1.6–1.9 — Cardboard Robot Deck Challenge:** Client Interview & Design Statement (1.6) → Concept Sketching & Decision Matrix (1.7) → Build, Test & Peer Review (1.8) → Iterate, Reflect & EDP Quiz (1.9) |

**Lesson sequence rationale:** Students attempt Spaghetti Tower *before* learning EDP (experience failure without a framework), then learn the framework, then apply it immediately to Paper Glider — "experience → framework → apply." Cardboard Robot Deck directly previews the CNC deck students will design in Fusion (Week 6–7).

---

### Unit 2 — CAD: Component-Based Approach *(Revised from 2025-26)*
> **Change from last year:** Drop the generic Fusion "30 Days" tutorial series as the primary spine. Each lesson = one actual robot component. Teach CAD hygiene explicitly before every component: plan the sketch, fully constrain, one sketch → one extrude.

**Components and fabrication method:**
| # | Component | Method | Key design constraint | Hardware |
|---|---|---|---|---|
| C1 | Wheel Hub | 3D print | Hub bore + OD — measure from provided motor model in F360 | M5 × deck |
| C2 | Drive Wheel | 3D print | Hex bore (measure from model); spokes via Circular Pattern — student's artistic choice | M5 × deck |
| C3 | Motor Sleeve Mount | 3D print | Sleeve bore = motor body OD (measure in F360); T-slot nut-capture rail on top; face screw holes | 10-32 × ½" flange (×4); M5 deck |
| C4 | Robot Deck | CNC (polycarbonate) | All mounting hole patterns from C1–C7; M5 through-holes; no sharp interior corners (CNC corner radius) | M5 (all components) |
| C5 | Omni Wheel Mount | 3D print | Axle bore for front omni wheels; multi-plane sketch | M3 × 20 hub screws (×4); M5 deck |
| C6 | IR Sensor Mount | 3D print | IR bar width + ground clearance; Mirror feature for symmetric arms; U-channel | M5 × deck |
| C7 | Ultrasonic Sensor Mount | 3D print | HC-SR04 bore dia + spacing — measure from provided sensor model in F360; L-bracket | M5 × deck |

**Level definitions (apply to all 7 components):**
- **Level 1:** Follow the instructional video; replicate Mr. B's design exactly → **C**
- **Level 2:** Modify the design (improve fit, reduce weight, add a functional feature) — challenges in the activity guide → toward **B**
- **Level 3:** Completely unique design meeting the same functional requirements — challenges in the activity guide → toward **A**
- **Level 4:** Advanced challenge (e.g., parametric design, design for a different constraint) → still **A**

**Note on measurements:** Mr. B provides Fusion 360 models of the motor and HC-SR04. Students use the F360 measuring tool to extract dimensions rather than calipers. All deck-attachment hardware is M5. Exception: omni wheel hub screws M3 × 20 (×4 per mount); motor flange screws 10-32 × ½" (×4 per motor).

**2nd-year students:** Run through all 7 components but will finish Level 1 significantly faster. When ahead, move to Level 2/3 on completed components, or pull from the continuous improvement list.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 3 | Sep 14–18 | 5 | | CAD hygiene rules + F360 orientation; **C1: Wheel Hub** — concentric circles, multi-depth extrude, file naming; **C2: Drive Wheel** begin — hex bore, Circular Pattern spokes, student design choice |
| 4 | Sep 21–25 | 5 | | C2 iterate + print; **C3: Motor Sleeve Mount** — sleeve bore (measure motor model in F360), T-slot nut-capture rail, face screw holes; version naming; **mid-unit CAD checkpoint quiz** |
| 5 | Sep 28 – Oct 2 | 5 | ⚡ Sep 30 | C3 iterate + print; **C5: Omni Wheel Mount** — multi-plane sketch, axle bore; **C6: IR Sensor Mount** — Mirror, U-channel, ground clearance |
| 6 | Oct 5–9 | 5 | | C5 + C6 iterate + print; **C7: Ultrasonic Sensor Mount** — HC-SR04 bore fit (measure in F360), L-bracket two-face extrude; all prints test-fit |
| 7 | Oct 12–16 | 5 | | **C4: Robot Deck** — layout planning using all component hole patterns, M5 through-holes, CNC corner radii, slot; CNC toolpath intro (awareness) |
| 8 | Oct 19–23 | 5 | | C4 iterate; all components test-fit on deck; **CAD quiz end of week** |

**Unit 2 deliverables:** D21–D27 — one per component; each requires screenshot + level selection + learning check Q1–Q5. All 7 required before build phase.  
**Quizzes:** Mid-unit checkpoint (Week 4) + CAD quiz (Week 8).

---

### Unit 3 — Safety & Tool Certification *(Expanded from 2025-26)*
> **Change from last year:** Unit 3 used to cover OSHA/LOTO/SDS only. Adding hands-on tool certification so students arrive at the build phase already cleared. CNC router license moves here from Week 11.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 9 | Oct 26–30 | 4 | 🟡 🔴 Records Day Oct 30 | OSHA/LOTO/PPE/SDS; Matthew Henne case study; drill press cert |
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
> **Change from last year:** Decks are cut during Safety week (Week 10) so build starts from a common baseline. Students arrive at Week 11 with all components designed and test-fit, decks already cut. Pairs instead of 3–4 person groups to reduce hiding spots. **Build is one week — programming starts immediately after.**

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 11 | Nov 9–13 | 5 | ⚡ Nov 11 (20-min day) | Assemble frame: motors, wheels, caster; mount electronics board; wire motors and battery; caliper check |

**Build gate:** Robot rolls under manual power with all components mounted before Week 12.

---

### Unit 5 — Programming Basics (MicroPython)
> **Change from last year:** Programming starts mid-November (Week 12) on the physical robot students just built. Three lessons introduce the language; two more build toward motor control. All basics wrap up before Winter Break.

**Lesson / Activity numbering:**  L5.1 + A5.1 · **L5.2 + A5.2 (Functions — new)** · L5.3 + A5.3 (Digital Input/Buttons) · L5.4 (PWM) · L5.5 (Motor Control)

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 12 | Nov 16–20 | 5 | | **L5.1** Microcontroller Fundamentals + **A5.1** Blink; **L5.2** Python Functions + **A5.2** SOS with Functions |
| 13 | Nov 23–24 | 2 | 🟡 Thanksgiving week | **L5.3** Digital Input + begin **A5.3** Switches |
| — | Nov 25–28 | — | 🌿 Thanksgiving Break | |
| 14 | Nov 30 – Dec 4 | 5 | | Finish **A5.3**; **L5.4** PWM + **A5.4** |
| 15 | Dec 7–11 | 5 | | **L5.5** Motor Control + **A5.5**; Programming Quiz; **D51** Programming Basics Q&A due |
| 16 | Dec 14–18 | 5 | | **3D Print Holiday Project** — design and print a small item to take home (ornament, keychain, name plate, etc.); student picks and customizes |
| — | ~Dec 21 – Jan 3 | — | 🌿 Winter Break | |

---

## End of Semester 1 (after Winter Break)

### Robot Tuning — Encoders & IMU
> Students return from Winter Break with programming basics complete (L5.1–L5.5). These three weeks put code on the physical robot for the first time.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 17 | Jan 4–8 | 5 | | Motor control on physical robot; drive + turn functions; encoder wiring and pulse counting |
| 18 | Jan 11–15 | 5 | ⚡ Jan 13 (20-min) | Drive-straight with encoder feedback; IMU intro — Qwiic plug-in, read yaw angle |
| 19 | Jan 18–21 | 3 | 🟡 🔴 MLK Day Jan 18 · Last student day Thu Jan 21 · Records Day Jan 22 (no students) | IMU heading hold; catch-up; **Midterm Exam** (EDP, CAD, Safety, Programming Basics) |

---

## SEMESTER 2

### Ultrasonic & Wall Following
| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 20 | Jan 25–29 | 5 | S2 begins Jan 25 | I2C ultrasonic via TCA9548A mux (3 sensors); distance measurement; obstacle detection logic |
| 21 | Feb 1–5 | 5 | | Wall following — maintain fixed distance from a wall using ultrasonic; proportional correction |

---

### Line Following
> Board has a 5-sensor IR array — weighted-error PID rather than simple threshold comparison.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 22 | Feb 8–12 | 5 | | 5-sensor IR array; per-sensor threshold calibration; binary line following |
| 23 | Feb 15–19 | 4 | 🟡 🔴 Presidents Day Feb 15 | Weighted-sensor error; PID control; tune + course practical — **wrap-up** |

---

### Mechanisms
> PLTW POE Unit 1 content — students analyze, calculate, and build mechanical systems before applying them to a servo-driven project.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 24 | Feb 22–26 | 4 | 🔴 Feb 26 mid-winter break | Simple machines intro; mechanical advantage + efficiency (POE 111/113) |
| 25 | Mar 1–5 | 5 | | Pulley systems — fixed, movable, compound (POE 114) |
| 26 | Mar 8–12 | 5 | ⚡ Mar 10 (20-min) | Gear ratios + multi-stage gear trains (POE 115) |
| 27 | Mar 15–19 | 5 | | Converting motion — cams, cranks, linkages, rotary→linear (POE 122) |
| 28 | Mar 22–25 | ~3.5 | 🟡 🔴 Mar 25 ½-day Records Day · Mar 26 spring break begins | Mechanism design challenge |
| — | Mar 26 – Apr 4 | — | 🌿 Spring Break | |

---

### Servo Build Project
> Students apply mechanism knowledge to design and build a servo-driven mechanism of their choice.

| Wk | Dates | Days | Notes | Content |
|----|-------|------|-------|---------|
| 29 | Apr 5–9 | 5 | | Project intro + design brief; servo control review; begin build |
| 30 | Apr 12–16 | ~2 | 🧪 State testing Tue–Thu | Build (limited time) |
| 31 | Apr 19–23 | 5 | | Build + test + iterate |
| 32 | Apr 26–30 | 5 | | Final demo + portfolio submission |

---

### 2nd-Year Track (S2 Differentiation)
Students who completed the course in 2025–26 have already seen basic ultrasonic and line following. Extension path runs parallel to the 1st-year sequence:

| Weeks | 1st-Year | 2nd-Year Extension |
|-------|----------|-------------------|
| 17–19 | Motor control + encoders + IMU intro | Same — new for everyone |
| 20–21 | Ultrasonic + obstacle avoidance | IMU heading hold + Wi-Fi remote control |
| 22–24 | Line following (5-sensor, PID) | Remote PID tuning via Wi-Fi; live sensor dashboard in browser |
| 25–27 | Scanner robot | Autonomous navigation: IMU heading + scanner fusion; map to OLED |
| 29–32 | Claw project | Claw with Wi-Fi control; telemetry logging |

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

1. ~~**Unit 2 component count**~~ — resolved: 7 components confirmed (C1 Wheel Hub, C2 Drive Wheel, C3 Motor Sleeve Mount, C4 Robot Deck, C5 Omni Wheel Mount, C6 IR Sensor Mount, C7 Ultrasonic Sensor Mount). Deliverables D21–D27.
2. **Group size** — reflection suggested pairs instead of 3–4. Confirm before first day so seating/equipment can be planned.
3. **AI tutor integration** — which programming lessons get tutor support? At minimum Lessons 6–9 (sensors, serial, functions). Needs tutor lesson entries created before Jan.
4. **Design brief deliverables (D8/D9)** — are these still the claw project brief + spec sheet? Or does the new component-based approach add earlier D-deliverables?
5. ~~**SEMESTER_START in app.js**~~ — updated to `2026-08-31`. Week topics now span all 38 weeks of the year.
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
