# Unit 2 CAD — Component Checklist & Tool Progression

**Method key:** 🖨 = 3D Print · 🔲 = CNC Cut  
**Component names marked [?] need confirmation** — identified from image, not yet verified.

---

## Fusion 360 Skill Progression Summary

| # | Component | New Tools This Component |
|---|-----------|--------------------------|
| C1 | Front Wheel Hub | Sketch plane · Circle · Dimension · Extrude · Fillet |
| C2 | [Motor Mount?] | Rectangle · Stepped extrude · Hole tool |
| C3 | [Battery Holder?] | Shell · Sketch on face · Offset plane |
| C4 | Robot Deck | Rectangular pattern · Construction lines · CNC corner radius rule |
| C5 | [Sensor Bracket?] | Multi-plane sketch · Combine/Join |
| C6 | [Ultrasonic Sensor Mount?] | Mirror · Slot · Tolerance fit from real component dims |
| C7 | [Electronics Mount?] | Circular pattern · Multi-feature integration |

---

## C1 — Front Wheel Hub  🖨
**Week:** 3  
**New F360 tools:** Sketch plane selection · Circle · Dimension constraint · Extrude (one direction) · Fillet (exterior edges)  
**Key concepts:** What "fully constrained" means (lines go black) · One sketch → one extrude · File naming convention  

**Functional requirements (Level 1 must meet):**
- [ ] Axle hole diameter: [TBD — measure caster axle]
- [ ] Hub outer diameter: [TBD]
- [ ] Hub thickness: [TBD]

**Level 2 prompt:** Modify the spoke pattern or add weight-reduction cutouts. Must maintain structural integrity around the axle hole.  
**Level 3 prompt:** Completely custom hub design. Must meet same axle diameter and mounting constraints.

**Submission checklist:**
- [ ] File named `Lastname_WheelHub_v1-Base` (or `v2-[Name]` if modified)
- [ ] Sketch fully constrained before extruding
- [ ] Correct axle hole diameter
- [ ] Screenshot: top view + isometric view, both exported

---

## C2 — [Motor Mount?] 🖨  *(confirm component name)*
**Week:** 3–4  
**New F360 tools:** Rectangle tool · Multiple extrude depths (stepped extrude) · Hole tool (instead of manual circle for holes)  
**Key concepts:** Designing for bolt pass-through · Clearance vs. press-fit holes · Version naming on first iterate

**Functional requirements (Level 1 must meet):**
- [ ] Motor shaft alignment: [TBD]
- [ ] Bolt pattern: [TBD — pattern and spacing]
- [ ] Mounting surface: [TBD]

**Level 2 prompt:** [TBD — e.g., reduce material while keeping structural wall thickness, or add a cable routing notch]  
**Level 3 prompt:** [TBD — custom mount meeting same bolt pattern and shaft alignment constraints]

**Submission checklist:**
- [ ] File named `Lastname_[Component]_v1-Base`
- [ ] Hole diameters match hardware spec
- [ ] Sketch fully constrained
- [ ] Screenshot: front + isometric

---

## C3 — [Battery Holder?] 🖨  *(confirm component name)*
**Week:** 5  
**New F360 tools:** Shell (hollow out a solid) · Sketch on face (sketch directly on an extruded surface) · Offset plane  
**Key concepts:** Designing to fit a real object · Tolerance (add clearance to the actual battery dimensions) · Wire relief cutouts

**Functional requirements (Level 1 must meet):**
- [ ] Interior dimensions fit battery pack: [TBD — measure actual battery]
- [ ] Wall thickness: [TBD]
- [ ] Wire exit cutout: [TBD — location and size]

**Level 2 prompt:** [TBD — e.g., add a retention lip or locking tab]  
**Level 3 prompt:** [TBD]

**Submission checklist:**
- [ ] File named `Lastname_[Component]_v1-Base`
- [ ] Interior cavity correct dimensions (show with section view screenshot)
- [ ] Wire cutout present
- [ ] Screenshot: section view + isometric

---

## C4 — Robot Deck 🔲  *(CNC cut — polycarbonate)*
**Week:** 7  
**New F360 tools:** Rectangular pattern (hole arrays) · Construction lines (layout reference) · Sketch dimensions from origin  
**Key concepts:** CNC design rules — no sharp interior corners (add corner radius ≥ tool radius) · Component layout before sketching · Hole pattern spacing

**Functional requirements (Level 1 must meet):**
- [ ] Outer dimensions: [TBD — chassis footprint]
- [ ] Motor mount hole pattern: [TBD]
- [ ] Electronics mount standoff pattern: [TBD]
- [ ] Wire pass-through cutouts: [TBD — location/size]
- [ ] All interior corners have minimum radius: [TBD — based on CNC bit size]

**Level 2 prompt:** Redesign component layout on the deck for better weight distribution or wire management. Must maintain all required hole patterns.  
**Level 3 prompt:** Completely custom deck layout — justify every design decision in the activity guide.

**Submission checklist:**
- [ ] File named `Lastname_Deck_v1-Base`
- [ ] All hole patterns correct
- [ ] No sharp interior corners (verify with sketch fillet)
- [ ] Screenshot: top view (layout visible) + isometric

---

## C5 — [Sensor Bracket?] 🖨  *(confirm component name)*
**Week:** 6  
**New F360 tools:** Sketch on a non-XY plane · Multi-step sketch (sketch, extrude, sketch on new face, extrude again)  
**Key concepts:** L-shape and U-shape geometry · Choosing the right sketch plane for the first feature

**Functional requirements (Level 1 must meet):**
- [ ] [TBD — mounting dimensions, sensor clearance]

**Level 2 prompt:** [TBD]  
**Level 3 prompt:** [TBD]

**Submission checklist:**
- [ ] File named `Lastname_[Component]_v1-Base`
- [ ] [TBD]
- [ ] Screenshot: front + isometric

---

## C6 — [Ultrasonic Sensor Mount?] 🖨  *(confirm component name — has 2 circular holes in image)*
**Week:** 6  
**New F360 tools:** Mirror (sketch or feature) · Slot tool · Tolerance fit — dimension holes from actual HC-SR04 sensor peg diameter  
**Key concepts:** Press-fit vs. clearance fit · Referencing real component dimensions · Symmetric geometry with Mirror instead of drawing twice

**Functional requirements (Level 1 must meet):**
- [ ] Sensor peg holes: [TBD — measure HC-SR04 peg diameter, subtract clearance]
- [ ] Hole spacing: [TBD — measure between HC-SR04 pegs]
- [ ] Mount orientation: forward-facing
- [ ] Ground clearance: [TBD]

**Level 2 prompt:** [TBD — e.g., add a retention clip or angled mount for wider sweep angle]  
**Level 3 prompt:** [TBD]

**Submission checklist:**
- [ ] File named `Lastname_[Component]_v1-Base`
- [ ] Hole spacing matches HC-SR04 spec
- [ ] Mirror used (not two separate circles)
- [ ] Screenshot: front + isometric

---

## C7 — [Electronics Mount?] 🖨  *(confirm component name)*
**Week:** 8  
**New F360 tools:** Circular pattern (if standoffs are radially arranged) · Multi-feature integration (combining techniques from C1–C6)  
**Key concepts:** Designing for assembly — think about how the part installs · Standoff height and spacing for the PCB

**Functional requirements (Level 1 must meet):**
- [ ] Standoff pattern matches PCB mounting holes: [TBD]
- [ ] Standoff height clears bottom components: [TBD]
- [ ] [Additional constraints TBD]

**Level 2 prompt:** [TBD]  
**Level 3 prompt:** [TBD]

**Submission checklist:**
- [ ] File named `Lastname_[Component]_v1-Base`
- [ ] Standoff spacing verified against PCB
- [ ] Screenshot: top + isometric

---

## Open Items

- [ ] Confirm component names for C2, C3, C5, C6, C7
- [ ] Measure actual hardware for all functional requirement dimensions (axle, battery, motor bolt pattern, sensor pegs, PCB holes)
- [ ] Confirm CNC bit diameter → set minimum corner radius for C4
- [ ] Decide: Level 2/3 prompts in video tags, or activity guide only?
- [ ] Update pacing map once component names confirmed (currently lists different names from 2025-26 plan)
- [ ] Point values for each deliverable (tabled — finalize after full course is written)
