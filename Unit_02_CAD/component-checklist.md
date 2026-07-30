# Unit 2 CAD — Component Checklist & Tool Progression

**Method key:** 🖨 = 3D Print · 🔲 = CNC Cut  
**Names marked [confirm]** are identified from component screenshots — verify against actual robot kit naming.

---

## Fusion 360 Skill Progression Summary

| # | Component | Print Method | New Tools This Component |
|---|-----------|:---:|--------------------------|
| C1 | Wheel Hub (simplified — inserts into soft silicone wheel) | 🖨 | Sketch plane · Circle (concentric) · Dimension · Extrude (multi-depth) · Fillet |
| C2 | Drive Wheel (spoked, hex bore — spoke design = student's artistic choice) | 🖨 | Polygon (hex bore) · Circular Pattern (spokes) · Extrude-Cut |
| C3 | Motor Mount (cylinder cradle + top plate) | 🖨 | Rectangle · Cut extrude (clamp gap) · Sketch on face |
| C4 | Robot Deck | 🔲 | Rectangular pattern · Construction lines · CNC corner radius rule · Slot tool |
| C5 | Omni Wheel Mount (front wheel assembly) | 🖨 | Multi-plane sketch · Reference geometry |
| C6 | IR Sensor Mount (U-bracket, front underside — holds IR bar for line following) | 🖨 | Mirror · Slot tool |
| C7 | Ultrasonic Sensor Mount (two-bore L-bracket, front-facing) | 🖨 | Large-bore circle · L-bracket two-face extrude |

> **Soft silicone wheels** are purchased items — students do not model them. C1 (hub) and C2 (drive wheel inner structure) insert into / attach to the silicone wheels.  
> **C2 progression:** Circular Pattern is confirmed as a C2 skill. Students choose their own spoke count and style — the constraint is that spokes must be created with Circular Pattern, not drawn individually. This gives creative buy-in before the more constrained functional components (C3–C7).

---

## C1 — Wheel Hub  🖨
**Geometry:** Flanged collar — flat ring (flange) + raised hub cylinder, 4 small bolt holes around the flange, large central bore  
**Week:** 3  
**New F360 tools:** Circle (multiple concentric) · Dimension constraint · Extrude (two depths: hub height + flange thickness) · Hole tool (4 mounting holes) · Fillet (outer flange edge)  
**Key concepts:** Fully constrained sketch (all lines black) · Multi-depth extrude · File naming convention  

**Functional requirements (Level 1 must meet):**
- [ ] Central bore diameter: [TBD — measure motor shaft or caster axle]
- [ ] Flange outer diameter: [TBD]
- [ ] Hub height: [TBD]
- [ ] Bolt hole diameter + spacing: [TBD — measure 4-hole pattern]

**Level 1 simplification:** Flat flange + hub cylinder only — no internal chamfer/fillet on bore  
**Level 2 prompt:** Add a chamfer or lead-in on the central bore; adjust bolt hole pattern for a different mounting configuration  
**Level 3 prompt:** Redesign hub for a different attachment method (press-fit, set-screw collar, etc.) — must fit the same axle diameter  

**Submission checklist:**
- [ ] File named `Lastname_WheelHub_v1-Base`
- [ ] Sketch fully constrained before extruding
- [ ] Central bore diameter matches spec
- [ ] 4 bolt holes correct diameter and spacing
- [ ] Screenshot: top view + isometric

---

## C2 — Drive Wheel  🖨
**Geometry:** Outer rim + 3 spokes (with groove detail) + central hub with hex bore; spoked design is rotationally symmetric  
**Week:** 3–4  
**New F360 tools:** Polygon tool (hex bore) · Circular Pattern (spokes) · Extrude-Cut (spoke openings)  
**Level 1 simplification (Option A):** Draw 3 spokes manually as rectangles — no Circular Pattern command. Level 2 introduces Circular Pattern.  
**Key concepts:** Hex bore for motor shaft · Spoke design for weight reduction · Symmetric features  

**Functional requirements (Level 1 must meet):**
- [ ] Outer diameter: [TBD — matches track width]
- [ ] Hex bore size: [TBD — measure motor shaft hex]
- [ ] Wheel width/thickness: [TBD]
- [ ] Spoke count: 3 (Level 1) — symmetric

**Level 2 prompt:** Replace manually drawn spokes with Circular Pattern; add the groove detail visible on Mr. B's wheel  
**Level 3 prompt:** Custom wheel design — same outer diameter and hex bore, otherwise free choice (different spoke pattern, tread features, etc.)  

**Submission checklist:**
- [ ] File named `Lastname_DriveWheel_v1-Base`
- [ ] Hex bore correct size
- [ ] Outer diameter correct
- [ ] 3 spokes present and symmetric
- [ ] Screenshot: front + isometric

---

## C3 — Motor Mount  🖨
**Geometry:** Cylindrical clamp cradle (open on one side with clamp gap) + flat rectangular mounting plate on top with 4 bolt holes; grooves/ribs on cylinder exterior  
**Week:** 4  
**New F360 tools:** Cut extrude (for clamp gap) · Sketch on face (top plate sketched on top surface of cylinder) · Rectangle  
**Key concepts:** Cut vs. Join extrude · Designing a clamp feature (gap allows bolt compression) · Sketch on an existing face  

**Functional requirements (Level 1 must meet):**
- [ ] Cylinder inner diameter: [TBD — measure motor body OD + clearance]
- [ ] Clamp gap width: [TBD]
- [ ] Mounting plate dimensions: [TBD]
- [ ] Mounting hole pattern: [TBD — 4 holes, spacing for deck mount]

**Level 2 prompt:** Add a cable relief slot on the side of the cylinder; adjust mounting plate to reduce weight while maintaining 4-hole bolt pattern  
**Level 3 prompt:** Redesign motor retention method — same motor OD and mounting plate footprint, different clamp or bracket strategy  

**Submission checklist:**
- [ ] File named `Lastname_MotorMount_v1-Base`
- [ ] Cylinder ID matches motor body (with clearance)
- [ ] Clamp gap present
- [ ] 4 mounting holes correct pattern
- [ ] Screenshot: isometric (clamp gap visible)

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

## Open Items — Measurements Needed

Before recording any video, measure these from actual hardware:

| Component | What to measure |
|-----------|----------------|
| C1 Wheel Hub | Motor shaft / axle OD · Flange OD · Hub height · Bolt hole dia + spacing |
| C2 Drive Wheel | Outer dia · Hex bore size · Wheel thickness |
| C3 Motor Mount | Motor body OD · Clamp gap · Plate dimensions · Hole spacing |
| C4 Deck | Outer dims · Notch size/position · Slot dims · All hole positions · CNC bit dia |
| C5 Axle Mount | Top plate dims · Arm spacing · Hub bore dia |
| C6 U-Bracket | Confirm purpose · Overall width · U opening · Slot dims |
| C7 Ultrasonic | HC-SR04 emitter OD · Center spacing · Block dims |

## Other Open Items

- [ ] All component names confirmed ✓ — C1 Wheel Hub, C2 Drive Wheel, C3 Motor Mount, C4 Deck, C5 Omni Wheel Mount, C6 IR Sensor Mount, C7 Ultrasonic Sensor Mount
- [ ] C2 progression confirmed ✓ — Circular Pattern required; students choose spoke count/style (artistic flair encouraged)
- [ ] C1 confirmed ✓ — inserts into purchased soft silicone wheel; teacher will simplify Level 1 geometry
- [ ] Confirm Level 2/3 placement: end-of-video tags, or activity guide only?
- [ ] Update pacing map: change component list from 6 (2025-26 names) to 7 confirmed components with correct names
- [ ] Point values per deliverable (tabled — finalize after full course is written)
- [ ] Hardware measurements still needed (see table above) before recording any videos
