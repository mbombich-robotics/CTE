# Unit 2 CAD — Component Checklist & Tool Progression

**Method key:** 🖨 = 3D Print · 🔲 = CNC Cut  
**Names marked [confirm]** are identified from component screenshots — verify against actual robot kit naming.

---

## Fusion 360 Skill Progression Summary

| # | Component | Print Method | New Tools This Component |
|---|-----------|:---:|--------------------------|
| C1 | Wheel Hub | 🖨 | Sketch plane · Circle (concentric) · Dimension · Extrude (multi-depth) · Fillet |
| C2 | Drive Wheel (spoked, hex bore — spoke design = student's artistic choice; inserts into soft silicone tire) | 🖨 | Polygon (hex bore) · Circular Pattern (spokes) · Extrude-Cut |
| C3 | Motor Sleeve Mount (sleeve bore + face screws + nut-capture rail) | 🖨 | Rectangle · Channel profile extrude · Hole tool (face screws) |
| C4 | Robot Deck | 🔲 | Base sketch: return and modify frequently · Construction lines · CNC corner radius rule · Slot tool |
| C5 | Omni Wheel Mount | 🖨 | Multi-plane sketch · Reference geometry |
| C6 | IR Sensor Mount (U-bracket, front underside — holds IR bar for line following) | 🖨 | Mirror · Slot tool |
| C7 | Ultrasonic Sensor Mount (two-bore L-bracket, front-facing) | 🖨 | Large-bore circle · L-bracket two-face extrude |

> **Soft silicone wheels** are purchased items already modeled — students do not model them. C1 (hub) x2 attach to either side of Omni wheel and C2 (drive wheel inner structure) insert into the silicone wheels.  
> **C2 progression:** Circular Pattern is confirmed as a C2 skill. Students choose their own spoke count and style — the constraint is that spokes must be created with Circular Pattern, not drawn individually. This gives creative buy-in before the more constrained functional components (C3–C7).

---

## C1 — Wheel Hub  🖨
**Geometry:** Flanged collar — flat ring (flange) + raised hub cylinder, 4 small bolt holes around the flange, large central bore for bearing, clearance holes for bolt heads and nuts
**Week:** 3  
**New F360 tools:** Circle (multiple concentric) · Dimension constraint · Extrude (two depths: hub height + flange thickness) · Hole tool (4 mounting holes) · Fillet (outer flange edge)  
**Key concepts:** Fully constrained sketch (all lines black) · Multi-depth extrude · File naming convention  

**Functional requirements (Level 1 must meet):**
- [ ] Central bore diameter: [12mm nominal bearing diameter, but final fit in 3d print is empirically driven]
- [ ] Flange outer diameter: [25mm]
- [ ] Hub height: [6.5mm]
- [ ] Bolt hole diameter + spacing: [3.3mm hole size - empirically driven x 16mm pattern diameter]

**Level 1 simplification:** Flat flange + hub cylinder only — no internal chamfer/fillet on bore, nominal hole sizes not adjusted from testing
**Level 2 prompt:** Add a chamfer or lead-in on the central bore; hole sizes determined through multiple iterations and test fitting, documnet progression
**Level 3 prompt:** Redesign hub for a different attachment method (press-fit, set-screw collar, etc.) — must fit the same axle diameter  

**Submission checklist:**
- [ ] File named `Lastname_OmniWheelHub_v1-Base`
- [ ] Sketch fully constrained before extruding
- [ ] Central bore diameter matches spec
- [ ] 4 bolt holes correct diameter and spacing
- [ ] Screenshot: top view + isometric

---

## C2 — Drive Wheel Hub 🖨
**Geometry:** Outer rim + 3 spokes (with groove detail) + central hub with hex bore; spoked design is rotationally symmetric  
**Week:** 3–4  
**New F360 tools:** Polygon tool (hex bore) · Circular Pattern (spokes) · Extrude-Cut (spoke openings)  
**Level 1 simplification (Option A):** Draw 3 spokes manually as rectangles — no Circular Pattern command. Level 2 introduces Circular Pattern.  
**Key concepts:** Hex bore for motor shaft · Spoke design for weight reduction · Symmetric features  

**Functional requirements (Level 1 must meet):**
- [ ] Outer diameter: [Nominal 2.125in + (3mm) for interference fit in soft silicone, determined empirically]
- [ ] Hex bore size: [3/8" nominal flat to flat, but final fit in 3d printed part is empirically driven]
- [ ] Wheel width/thickness: [25.4mm]
- [ ] Spoke count: (Level 1) — symmetric

**Level 2 prompt:** Replace manually drawn spokes with Circular Pattern; add the groove detail visible on Mr. B's wheel  
**Level 3 prompt:** Custom wheel design — same outer diameter and hex bore, otherwise free choice (different spoke pattern, spinning rim, etc.)  

**Submission checklist:**
- [ ] File named `Lastname_DriveWheel_v1-Base`
- [ ] Hex bore correct size
- [ ] Outer diameter correct
- [ ] 3 spokes present and symmetric
- [ ] Screenshot: front + isometric

---

## C3 — Motor Sleeve Mount  🖨
**How it works:** Motor flange is removed → motor body slides into the sleeve bore → flange is reattached to motor housing through the front face of the mount → screws pass through the mount face into the flange to lock the motor axially. The rails along the top create a nut-capture channel: nuts are slid in, then bolts pass down through the deck from above into the captured nuts — no under-deck access needed.  
**Geometry:** Cylindrical sleeve bore (open front face for flange screws) + nut-capture rail channel running the full length of the top surface; rails appear as two raised walls with a slot between them  
**Week:** 4  
**New F360 tools:** Circle (sleeve bore) · T-slot profile sketch (sketch the T cross-section on the end face, Extrude-Cut the full length of the top) · Hole tool (face screw holes)  
**Key concepts:** T-slot nut-capture as a 3D-print design pattern — the bottom cavity must be wide enough for the nut head + insertion clearance; the top slot must be wide enough for the bolt shaft but narrow enough to trap the nut. Getting either dimension wrong breaks the mechanism. · Sketch a cross-section profile, then extrude-cut full length · Assembly sequence thinking: nut slides in from end before the mount is bolted to the deck  

**Functional requirements (Level 1 must meet):**
- [ ] Sleeve bore inner diameter: [TBD — motor body OD + clearance, ~0.3–0.5mm each side]
- [ ] Sleeve length: [TBD — motor body length]
- [ ] Face screw hole pattern: [TBD — match motor flange bolt circle]
- [ ] T-slot top slot width: [TBD — bolt shaft OD + clearance, but less than nut width across-flats]
- [ ] T-slot bottom cavity width: [TBD — nut width across-flats + ~0.4mm sliding clearance]
- [ ] T-slot bottom cavity depth: [TBD — nut thickness + ~0.3mm]
- [ ] T-slot length: must run full top length so nut can be inserted from either end before mounting

**Level 2 prompt:** Add a chamfer or lead-in to both ends of the rail channel so nuts seat more easily; reduce material on non-load-bearing walls while keeping rail walls at full thickness  
**Level 3 prompt:** Redesign the deck-attachment system — same sleeve bore and face screw pattern, but a different strategy for attaching to the deck (through-bolts, integrated standoffs, etc.)  

**Submission checklist:**
- [ ] File named `Lastname_SleevMount_v1-Base`
- [ ] Sleeve bore correct ID (check against motor body OD)
- [ ] Face screw holes correct pattern
- [ ] Rail channel runs full top length
- [ ] Rail channel correct width and depth (M3/M4 nut fits and slides)
- [ ] Screenshot: isometric (rail channel visible) + front face (screw holes visible)

---

## C4 — Robot Deck  🔲 *(CNC cut — polycarbonate)*
**Geometry:** Irregular flat plate — mostly rectangular with notched bottom-right corner; rectangular slot cutout; many holes of varying sizes in a grid-ish layout; rounded exterior corners  
**Week:** 7  
**New F360 tools:** Line tool (outer profile with notch) · Rectangular Pattern (hole arrays) · Fillet (exterior corners for CNC — no sharp corners) · Slot tool (for rectangular slot)  
**Key concepts:** CNC design rule — all interior corners need a fillet ≥ bit radius · Component layout before sketching · Hole grid planning with construction lines  

**Functional requirements (Level 1 must meet):**
- [ ] Outer dimensions: [TBD — chassis footprint]
- [ ] Notch location and size: [TBD]
- [ ] Rectangular slot: [TBD — location, dimensions]
- [ ] All exterior corners filleted to: [TBD — based on CNC bit diameter]
- [ ] Motor mount hole pattern: [TBD]
- [ ] Electronics standoff hole pattern: [TBD]
- [ ] Sensor mounting holes: [TBD]

**Level 2 prompt:** Redesign component layout (move holes for better weight distribution or wire routing) — must keep all required hole patterns, all corners filleted  
**Level 3 prompt:** Custom deck shape and layout — justify every design decision in the activity guide  

**Submission checklist:**
- [ ] File named `Lastname_Deck_v1-Base`
- [ ] All interior corners filleted (verify each one)
- [ ] All hole patterns correct (check against spec)
- [ ] Rectangular slot present and correct dimensions
- [ ] Screenshot: top view (full layout visible) + isometric

---

## C5 — Omni Wheel Mount  🖨
**Purpose:** Front wheel assembly — mounts at the front of the chassis and holds the front omni wheels, allowing the robot to pivot and turn smoothly while rear drive wheels push  
**Geometry:** Flat top plate (4 corner mounting holes for deck attachment) with two arms extending downward on either side, each arm holds an omni wheel hub/axle  
**Week:** 5–6  
**New F360 tools:** Multi-plane sketch (sketch on side face of extrusion) · Reference geometry (use existing body face as sketch reference)  
**Key concepts:** Thinking in assembly context — arm spacing must match the omni wheel axle width · Choosing the correct sketch plane for each feature  

**Functional requirements (Level 1 must meet):**
- [ ] Top plate dimensions: [TBD]
- [ ] Arm spacing (must match omni wheel axle width): [TBD]
- [ ] Axle bore in each arm: [TBD]
- [ ] 4 mounting holes on top plate: [TBD — match deck hole pattern]

**Level 2 prompt:** [TBD — e.g., add a cable management channel, adjust arm thickness for weight]  
**Level 3 prompt:** [TBD — custom front wheel mount geometry meeting same axle and deck mounting constraints]  

**Submission checklist:**
- [ ] File named `Lastname_OmniMount_v1-Base`
- [ ] Arm spacing matches omni wheel axle spec
- [ ] Axle bores correct diameter
- [ ] 4 mounting holes correct pattern
- [ ] Screenshot: isometric + front

---

## C6 — IR Sensor Mount  🖨
**Purpose:** Mounts at the front underside of the deck; holds the IR sensor bar at a consistent height above the ground for line following  
**Geometry:** U-shape — two vertical arms each with a flat mounting tab (one hole each) on top for deck attachment; bottom web with a narrow slot running the length (likely for IR bar wiring or bar retention)  
**Week:** 6  
**New F360 tools:** Mirror (bracket is symmetric — draw one arm, mirror it) · Slot tool (bottom channel)  
**Key concepts:** Symmetric design with Mirror instead of drawing both sides · Slot as a real F360 feature · Designing for consistent ground clearance  

**Functional requirements (Level 1 must meet):**
- [ ] Overall width: [TBD — must span IR sensor bar width]
- [ ] U opening height: [TBD — sets sensor ground clearance]
- [ ] U opening depth: [TBD — must seat IR bar securely]
- [ ] Tab mounting hole diameter: [TBD]
- [ ] Bottom slot dimensions: [TBD]

**Level 2 prompt:** Add a retention lip or press-fit feature inside the U to hold the IR bar without hardware; document the fit tolerance choice  
**Level 3 prompt:** Custom sensor mount that allows height adjustment (slotted holes in tabs) — must still hold the bar rigid during operation  

**Submission checklist:**
- [ ] File named `Lastname_IRSensorMount_v1-Base`
- [ ] Mirror used (not two separately drawn arms)
- [ ] U opening dimensions correct (bar fits without rocking)
- [ ] Slot present in bottom web
- [ ] Screenshot: isometric + front

---

## C7 — Ultrasonic Sensor Mount  🖨
**Geometry:** Vertical rectangular block — two large circular bores (side by side) through the face, with a notch/cutout between them; L-shaped foot (horizontal base with 2 mounting holes)  
**Week:** 6–7  
**New F360 tools:** Large-bore circle (working from real sensor dimensions) · L-bracket as two-face extrude · Fillet (interior between bores)  
**Key concepts:** Designing for a real component's dimensions (measure HC-SR04 emitter/receiver diameter) · Press-fit tolerance · L-bracket geometry  

**Functional requirements (Level 1 must meet):**
- [ ] Bore diameter: [TBD — measure HC-SR04 emitter/receiver OD, subtract for press-fit]
- [ ] Bore spacing (center-to-center): [TBD — measure HC-SR04]
- [ ] Block face dimensions: [TBD]
- [ ] Foot dimensions: [TBD]
- [ ] 2 mounting holes in foot: [TBD]
- [ ] Sensor must face forward when mounted

**Level 2 prompt:** Add a mounting angle (tilt the sensor face down slightly for better ground coverage); document the angle choice  
**Level 3 prompt:** Custom sensor enclosure — same bore specs, different mounting strategy  

**Submission checklist:**
- [ ] File named `Lastname_UltrasonicMount_v1-Base`
- [ ] Both bores correct diameter (check against HC-SR04 spec)
- [ ] Bore center spacing correct
- [ ] 2 foot mounting holes correct
- [ ] Screenshot: front (bores visible) + isometric

---

## Hardware Specs (confirmed)

| Component | Deck attachment | Other fasteners |
|-----------|----------------|-----------------|
| C1 Wheel Hub | M5 | — |
| C2 Drive Wheel | M5 | — |
| C3 Motor Sleeve Mount | M5 via T-slot nut | 10-32 × ½" into motor flange (×4) |
| C4 Robot Deck | — (the deck itself) | M5 through-holes for all mounts |
| C5 Omni Wheel Mount | M5 | M3 × 20 into omni wheel hubs (×4) |
| C6 IR Sensor Mount | M5 | — |
| C7 Ultrasonic Sensor Mount | M5 | — |

**Measurements:** Mr. B provides F360 models of the motor and HC-SR04. Students use **Inspect → Measure** in F360 on those provided models to get bore diameters, spacing, and body dimensions. No calipers needed for motor/sensor dims. Deck hole positions derived from the completed C1–C7 models.

## Open Items

- [x] All component names confirmed — C1–C7 ✓
- [x] C2 tool progression — Circular Pattern required; student chooses spoke design ✓
- [x] C1 simplified — inserts into soft silicone wheel ✓
- [x] Level 2/3 placement — in the activity guide (not end-of-video tags) ✓
- [x] Hardware specs — M5 deck, M3×20 omni hubs, 10-32×½" motor flange ✓
- [x] Pacing map updated — 7 components, correct names, D21–D27 ✓
- [ ] CNC bit diameter — needed to set minimum corner radius for C4 deck interior corners
- [ ] Point values per deliverable — tabled until full course is written
