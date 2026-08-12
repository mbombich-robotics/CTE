# 2026–2027 HS Applied Engineering & Robotics — Pacing Spreadsheet

**First day:** Aug 31, 2026 · **End of S1 (last student day):** Thu Jan 21, 2027 · **Start of S2:** Jan 25, 2027 · **Last day:** Jun 11, 2027 (half day)

---

## Semester 1

| Week | Dates | Days | Unit | Notes | Content | Deliverable / Quiz |
|------|-------|------|------|-------|---------|--------------------|
| 1 | Aug 31–Sep 4 | 4 | 1 — EDP | 🔴 Sep 4 no school | Lessons 1.1–1.5: Intro to AE&R → Spaghetti Tower (no framework) → EDP Framework → Paper Glider (EDP applied) → Writing a Design Brief | D1.0 — Signed syllabus + safety contract |
| 2 | Sep 7–11 | 4 | 1 → 2 | 🔴 Labor Day Sep 7 | **L1.6** Client Interview + Design Statement; **L1.7** Concept Sketching + Decision Matrix (get approval before Fri); **L2.1** Kevin Kennedy F360 orientation video (Fri — watch twice, orientation check) | D1.1 — Design Brief (signed); Concept Sketches (approved) |
| 3 | Sep 14–18 | 5 | 2 — CAD | | **L2.2** C1 modeling video — sketch, extrude, bore; export + queue print; **L2.3** Measurement Tools Workshop — calipers, measure printed C1 against design brief; **L2.4** 3D Printing — slicer settings, orient, iterate C1 v2 | D2.1 — C1: key dimensions + iteration log; **Q1: EDP Quiz** |
| 4 | Sep 21–25 | 5 | 2 — CAD | | **L2.5: C2 Drive Wheel** — hex bore, Circular Pattern spokes, student design choice; print + iterate; intro to **L2.6: C3 Motor Mount** | D2.2 — C2: key dimensions + iteration log |
| 5 | Sep 28–Oct 2 | 5 | 2 — CAD | ⚡ Sep 30 (20-min period) | **L2.6: C3 Motor Mount** (complete) | D2.3 — C3: key dimensions + iteration log |
| 6 | Oct 5–9 | 5 | 2 — CAD | | **L2.7: C4 Deck** + CAD assemblies intro | D2.4 — C4: key dimensions + iteration log |
| 7 | Oct 12–16 | 5 | 2 — CAD | | **L2.8: C5** Front Wheel Mount; **C6** IR Sensor Mount; **C7** Ultrasonic Sensor Mount | D2.5, D2.6, D2.7 — C5, C6, C7: key dimensions + iteration logs |
| 8 | Oct 19–23 | 5 | 2 — CAD | 2nd yr: **C8: Electronics Board Mount** w/ strain relief | Final robot CAD assembly | **Q2: CAD Quiz**; D2.8 — Robot Assembly |
| 9 | Oct 26–30 | 4 | 3 — Safety | 🟡 🔴 Records Day Oct 30 | OSHA/LOTO/PPE/SDS; Matthew Henne case study; drill press, pedestal grinder, hand drill certs; CNC awareness; manufacturing processes | **Q3: Safety Quiz**; Tool Cert Cards |
| 10 | Nov 2–6 | 5 | 3 — Safety | | CNC toolpaths; cut decks | D3.1 — Toolpaths to cut deck |
| 11 | Nov 9–13 | 5 | Build | ⚡ Nov 11 (20-min period) | Robot physical assembly | |
| **12** | **Nov 16–20** | **5** | **4 — Programming** | | **L4.1 (Microcontroller Fundamentals) + A4.1 (Blink); L4.2 (Variables & Types) + A4.2** | |
| **13** | **Nov 23–24** | **2** | **4 — Programming** | **🟡 Mon–Tue only** | **L4.3 (Functions) + A4.3 (SOS with Functions)** | **D4.1 — Programming Basics: Lessons 4.1–4.3** |
| — | Nov 25–28 | — | — | 🌿 Thanksgiving Break | | |
| **14** | **Nov 30–Dec 4** | **5** | **4 — Programming** | | **Finish L4.4 (Digital Input) + A4.4 (Switches); L4.5 (PWM) + A4.5** | |
| **15** | **Dec 7–11** | **5** | **4 — Programming** | | **L4.6 (Motor Control) + A4.6** | **D4.2 — Programming Basics: Lessons 4.4–4.6; Q4: Programming Quiz** |
| 16 | Dec 14–18 | 5 | 3D Print Holiday Project | | Students design and print a small item to take home — ornament, keychain, name plate, or similar; student chooses and customizes | |
| — | Dec 21–Jan 3 | — | — | 🌿 Winter Break | | |

---

## End of Semester 1 (after Winter Break)

| Week | Dates | Days | Unit | Notes | Content | Deliverable / Quiz |
|------|-------|------|------|-------|---------|--------------------|
| 17 | Jan 4–8 | 5 | 4 — Robot Motion | | L4.6 motor.py on physical robot: drive() calibration, straight-line practice, timed turns; L4.7 IMU intro — GY-521 MPU6050 wired to I2C mux, wake sensor, read raw gyro Z | |
| 18 | Jan 11–15 | 5 | 4 — Robot Motion | ⚡ Jan 13 (20-min period) | L4.7 IMU heading hold: integrate gyro Z for yaw, implement tank_turn(deg); A4.7 IMU Navigation Challenge (scaffolded: heading hold → straight → turns → full challenge) | **D4.3 — IMU Navigation** |
| 19 | Jan 18–21 | 3 | Catch-up / Midterm | 🔴 MLK Day Jan 18 · Last student day Thu Jan 21 · Records Day Jan 22 (no students) | Catch-up + D4.3 makeups; **Q5: Midterm Exam** (covers EDP, CAD, Safety, Programming Basics) | **Q5: Midterm Exam** |

---

## Semester 2

| Week | Dates | Days | Unit | Notes | Content | Deliverable / Quiz |
|------|-------|------|------|-------|---------|--------------------|
| 20 | Jan 25–29 | 5 | 4 — Ultrasonic | S2 begins Jan 25 | L4.8 HC-SR04 I2C via TCA9548A mux — distance reading from 3 sensors; L4.9 Obstacle Avoidance — stop/turn logic; A4.8 Obstacle Detection (scaffolded) | |
| 21 | Feb 1–5 | 5 | 4 — Ultrasonic | | L4.9 Wall Following — proportional correction to maintain fixed distance from wall; A4.9 Wall Following Challenge (scaffolded) | **D4.4 — Ultrasonic: Obstacle & Wall Following** |
| 22 | Feb 8–12 | 5 | 4 — Line Following | | L4.10 OSOYOO 5-sensor IR array — wire, calibrate thresholds, binary line following; A4.10 Binary Line Following | |
| 23 | Feb 15–19 | 4 | 4 — Line Following | 🔴 Presidents Day Feb 15 | L4.11 Weighted-sensor error; proportional control first, then full PID tuning; A4.11 PID Challenge (scaffolded) | **D5.2 — Line Following Practical** |
| 24 | Feb 22–26 | 4 | 5 — AI & ML | 🔴 Feb 26 mid-winter break | L5.1 What Is AI; L5.2 Ethics in AI; L5.3 Teachable Machine | **Q6: AI Quiz** |
| 25 | Mar 1–5 | 5 | 7 — Electrical Systems | | L7.1 Intro to Electricity (charge, voltage, current); L7.2 Ohm's Law + resistance; L7.3 Series vs. parallel circuits | |
| 26 | Mar 8–12 | 5 | 7 — Electrical Systems | ⚡ Mar 10 (20-min period) | L7.4 Using a Multimeter; L7.5 Breadboarding basics; L7.6 LED Circuits; L7.7 Circuit Troubleshooting | **Q7: Electrical Systems Quiz** |
| 27 | Mar 15–19 | 5 | 8 — Mechanisms | | L8.1 Simple Machines (6 machines, IMA); L8.2 Mechanical Advantage (IMA vs AMA, lever classes); L8.3 Work, Power & Efficiency | |
| 28 | Mar 22–25 | ~3.5 | 8 — Mechanisms | 🟡 🔴 Mar 25 ½-day Records Day · Mar 26 spring break begins | L8.4 Pulleys — fixed, movable, compound; L8.5 Gears — gear ratios, multi-stage trains | |
| — | Mar 26–Apr 4 | — | — | 🌿 Spring Break | | |
| 29 | Apr 5–9 | 5 | 8 — Mechanisms | | L8.6 Maximizing Power (motor curves, stall torque); L8.7 Tug of War design-build-test; L8.8 Linkages (four-bar, DOF) | |
| 30 | Apr 12–16 | ~2 | 8 — Mechanisms | 🧪 State testing Tue–Thu | L8.9 Types of Motion; L8.10 Fix Fran's Farm capstone challenge | |
| 31 | Apr 19–23 | 5 | 8 → Servo Build | | **Q8: Unit 8 Mechanisms Quiz**; Project intro + design brief; servo control review; begin build | **Q8: Unit 8 Mechanisms Quiz** |
| 32 | Apr 26–30 | 5 | Servo Build | | Build + test + iterate | |
| 33 | May 3–7 | 5 | Servo Build | ⚡ May 5 (20-min period) | Final demo + portfolio submission | D5.3 — Servo Build Project |
| 34 | May 10–14 | 5 | Capstone | | Open-ended challenge or improvement project | |
| 35 | May 17–21 | 5 | Portfolio / Review | 🎓 May 20 last day for seniors | Portfolio completion push; all deliverables finalized; review for non-seniors | **Q9: Final Exam (seniors — before May 20)** |
| 36 | May 24–28 | 5 | Review | | EDP, CAD, Safety, Programming review for non-seniors | |
| 37 | May 31–Jun 4 | 4 | Wrap-up | 🔴 Memorial Day May 31 | Return exams; wrap-up projects; demos | |
| 38 | Jun 7–11 | 4.5 | Wrap-up / Final | Half day Jun 11 (last day) | **Q9: Final Exam (non-seniors)**; end-of-year reflection; equipment return | **Q9: Final Exam (non-seniors)** |

---

## Quiz Summary

| # | Name | Week | Scope |
|---|------|------|-------|
| Q1 | EDP Quiz | 3 | Unit 1 — Engineering Design Process |
| Q2 | CAD Quiz | 8 | Unit 2 — Fundamentals of CAD |
| Q3 | Safety Quiz | 9 | Unit 3 — Shop Safety |
| Q4 | Programming Quiz | 15 | Unit 4 — Programming, Electronics & Sensors |
| Q5 | Midterm Exam | 19 | Units 1–4 cumulative |
| Q6 | AI Quiz | 24 | Unit 5 — AI & Machine Learning |
| Q7 | Electrical Systems Quiz | 26 | Unit 7 — Electrical Systems |
| Q8 | Unit 8 Mechanisms Quiz | 31 | Unit 8 — Mechanisms |
| Q9 | Final Exam | 35 (seniors) / 38 (others) | Cumulative |

---

## Deliverable Summary

| # | Name | Week |
|---|------|------|
| D1.0 | Signed Syllabus & Safety Contract | 1 |
| D1.1 | Design Brief | 2 |
| D2.1 | C1 — Wheel Hub | 3 |
| D2.2 | C2 — Drive Wheel | 4 |
| D2.3 | C3 — Motor Sleeve Mount | 5 |
| D2.4 | C4 — Robot Deck | 6 |
| D2.5 | C5 — Omni Wheel Mount | 7 |
| D2.6 | C6 — IR Sensor Mount | 7 |
| D2.7 | C7 — Ultrasonic Sensor Mount | 7 |
| D2.8 | Robot Assembly | 8 |
| D3.1 | Tool Safety Certifications | 10 |
| D4.1 | Programming Basics: Lessons 4.1–4.3 | 13 |
| D4.2 | Programming Basics: Lessons 4.4–4.6 | 15 |
| D4.3 | IMU Navigation | 18 |
| D4.4 | Ultrasonic: Obstacle Detection & Wall Following | 21 |
| D5.2 | Line Following Practical | 23 |
| D5.3 | Servo Build Project | 33 |

---

## 2nd-Year Track (S2 Differentiation)

Students who completed the course in 2025–26 have already seen basic ultrasonic sensing and single/dual-sensor line following. When ahead of 1st-year peers, they work on the Wi-Fi and IMU extension track.

| Weeks | 1st-Year Content | 2nd-Year Extension |
|-------|-----------------|-------------------|
| 17–19 | Motor control + encoders + IMU intro | Same — encoders and IMU are new for everyone |
| 20–21 | Ultrasonic + obstacle avoidance | IMU heading hold integrated with obstacle avoidance; Wi-Fi remote control |
| 22–23 | Line following (5-sensor array, PID) | Remote PID tuning via Wi-Fi; stream live sensor data to browser dashboard |
| 24 | AI & Machine Learning | Same as 1st year — Teachable Machine is standalone, no LEO integration |
| 25–26 | 7 — Electrical Systems | Same as 1st year — electrical fundamentals are new for everyone |
| 27–30 | 8 — Mechanisms | Same as 1st year; strong students extend with full mechanism design challenge |
| 31–33 | Servo Build Project | Servo mechanism with Wi-Fi control interface; telemetry logging to browser dashboard |
