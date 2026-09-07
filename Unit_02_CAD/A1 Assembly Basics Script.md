# Video Script — A1 Assembly Basics

---

## INTRO

[COLD OPEN — 3–4 sec, fully assembled omni wheel + hub + bearings + screws, rotating slowly in Fusion, clean background, no UI]

[TITLE CARD — 3 sec]
A1 — Assembly Basics
Autodesk Fusion · HS Applied Engineering & Robotics
Duration: 10:49 · https://www.youtube.com/watch?v=HaHvBqocwYI

[VERBAL — TTS]
"A1, assembly basics. [pause] You've built the parts — now we put them together in Fusion and learn the tools you'll use on every assembly from here on. [pause] Let's go."

---

## BODY

[SCENE 1 — New assembly file open. Empty canvas. Browser tree visible on left.]

"A part design file holds one component. An [emphasis] assembly file holds many — and defines how they relate to each other. Go to File → New → [emphasis] Assembly Design. The workspace looks similar, but the browser tree is organized differently."

"The first component you insert becomes the [emphasis] anchor for the whole assembly. Everything else will be positioned relative to it. Start by bringing in the omni wheel — Insert → Insert Component, navigate to your file, click OK. [long pause]"

"Right now the wheel is floating. Before we constrain it, I'll show you a few tools to get it [emphasis] roughly positioned first — so you're not trying to apply constraints to geometry that's backwards or upside down."

[SCENE 2 — Move and align tools demonstrated to rough-position the omni wheel near origin. Then grounded to origin with 3 constraints.]

"Your component is inserted at the origin of the assembly. These handles let you drag and rotate components without applying permanent constraints. These are your rough-placement tools. [pause] Get the component close to where you want it, oriented the right direction — then you'll apply constraints."

"To [emphasis] ground the omni wheel to the origin [pause], which will keep it from moving around[pause], I'll apply two constraints. Open the Constraint tool — in the [emphasis] Relationships menu, [long pause]Constrain Components. [pause] You'll need to make the origin visible by clicking it's visibility icon in the tree. [long pause]I'm constraining a flat face on the wheel to an origin plane, [pause] then the [emphasis]center bore axis to the Z axis. [long pause] One more constraint would keep the wheel from rotating, but I'm ok with that movement for now. "

"From now on, [emphasis] everything else positions itself relative to the wheel. One grounded component is always the starting point."

---

[SCENE 3 — Hub component (clearance side) inserted. Constraint Set created. Two constraints shown: axis + face.]

"Insert the first hub component — the [emphasis] clearance side. Drop it in and click OK. [long pause]"

"Rather than applying constraints one at a time, I'll use a [emphasis] Constraint Set. In the Constraint dialog, a set groups all the constraints for this component into one entry in the browser tree. [pause] This keeps your timeline readable — one set per component instead of a stack of individual constraints."

"[emphasis] Constraint one: concentric. Click the cylindrical face of the hub bore and the bearing race surface on the wheel. [pause] The hub snaps to the axis — if it's backward, click Flip. [emphasis] Constraint two: flush. Click the flat face of the hub against the face of the omni wheel. [long pause] Click OK — the hub is fully constrained, one set, two constraints."

[SCENE 4 — Second hub (tap side) inserted. Same constraint set method repeated, briefly.]

"Insert the tap-side hub. Same process — constraint set, concentric, then flush against the opposite face of the wheel. [long pause] Both hubs are now in position."

---

[SCENE 5 — M3 screw inserted. Three copies made (4 total). Constraint Set opened. Edge-to-edge trick demonstrated on first screw.]

"Insert one [emphasis] M3 socket head cap screw. Drop it anywhere for now — we're going to copy it. [pause] Right-click the screw in the browser and click Copy, then paste three times. [long pause] You now have four screws — one for each mounting hole."

"Insert one [emphasis] M3 by 20mm socket head cap screw. [long pause]Drop it anywhere for now —[pause] we're going to copy it. [pause] Right-click the screw in the tree and click [emphasis]Copy, [pause]then paste. Do this two more times. [long pause] You now have four screws — one for each mounting hole."

"Here's the constraint trick for screws. Open a Constraint Set. For Component 1, click the [emphasis] circular edge at the floor of the counterbore on the hub — that's the inner circle where the flat bottom of the counterbore meets the cylindrical wall. It's important that we selected this component first, because the first component you select becomes the parent component for the set. For Component 2, click the [emphasis] circular edge on the underside of one of the screw heads."

"Two circles — same axis, same plane — and Fusion creates an [emphasis] Edge-to-Edge constraint. [long pause] One constraint. The screw is concentric with the hole [emphasis] and seated against the counterbore floor simultaneously. No separate flush constraint needed."

[SCENE 6 — Remaining three screws added to the same constraint set. Screenshot shows "Multiple Components" in the constraint dialog.]

"Now I'll add the other three screws to the [emphasis] same constraint set. [long pause]Click the plus icon in the constraint dialog and repeat the edge-to-edge selection for each screw. [long pause] Notice that when you have multiple parts in a constraint set — you'll see [emphasis] Multiple Components in the geometry field."

"Click OK. [long pause] One constraint set — four screws, all seated and concentric. [pause] Any time you have identical fasteners in a pattern, this is how you handle them."
---

[SCENE 7 — Bearing inserted. Copied once (two total, one per hub half). Constraint set: axis + face for each.]

"Insert one bearing. Copy it once — you need two, one for each hub half. [long pause]"

"Constraint set for the first bearing: [emphasis] concentric — the outer race of the bearing to the bearing pocket on the hub. Then [emphasis] flush — the face of the bearing to the floor of the pocket. [long pause] Repeat for the second bearing on the tap-side hub. [long pause]"

"The bearings should sit flush in the pockets with the inner race centered. [pause] If either bearing looks slightly off, check which face you selected for the flush constraint — the pocket floor, not the hub face."

---

[SCENE 8 — Inspect → Section Analysis. Plane selected. Arrow dragged to center of assembly. Section view active.]

"Now we validate. Go to [emphasis] Inspect → Section Analysis. Click a flat face — I'll use one of the origin planes — and drag the blue arrow to the center of the assembly. [long pause] Click OK."

"You're now looking at a [emphasis] cross-section through the middle of the assembly. Every internal feature is visible: the bearing races, the bore, the screw heads seated in their counterbores, and the bolt pattern through the wheel. [pause] This is the view that tells you whether your design actually works."

"Check that the screw heads are fully recessed — not proud of the surface. Check that the bearings are seated flush in both pockets. [pause] Check that the center bore clears the bearing inner race on both sides. If anything looks wrong here, it will definitely be wrong on the robot."

[SCENE 9 — Closeup of section view with callouts. Then section analysis turned off and assembly shown fully assembled.]

"Turn off the section analysis by going back to Inspect → Section Analysis and clicking Delete. [long pause] The assembly is complete."

"For C2, you'll build this same kind of assembly around the drive wheel hub — the skills you just used are the ones you'll apply there."

---

## OUTRO

[VERBAL — TTS]
"[excited] That's A1 — your first Fusion assembly, fully constrained and validated with Section Analysis."

"Before the next video, your hub and wheel should be assembled in Fusion and checked with Section Analysis. Screenshot the section view and add it to your portfolio."

"Next up — [emphasis] C2, the drive wheel hub. Your first component with real design choices — spoke count, spoke shape, and the geometry for the hex shaft. [pause] Let's go."

[TITLE CARD — 5 sec]
A1 — Assembly Basics · Complete
Next: C2 — Drive Wheel Hub
[Portfolio submission link / QR code]

---

## YouTube Description

A1 — Assembly Basics | Autodesk Fusion | HS Applied Engineering & Robotics

You've built the C1 hub — now we assemble it. We bring the omni wheel, both hub halves, four M3 screws, and two bearings into a Fusion assembly and constrain everything in place. Along the way we cover the tools that make assembly efficient: rough-placement before constraining, constraint sets to keep the browser clean, and a two-circle edge trick that seats a screw concentric and flush in a single constraint. We close with Section Analysis to validate the design from the inside.

These are the assembly skills you'll use on every component from here forward.

**What you'll learn:**
- Assembly files vs. part design files — what's different and why it matters
- Move and Align: rough-positioning before constraining
- Grounding a component to the origin with three constraints
- Constraint sets: grouping all constraints for a component into one browser entry
- The edge-to-edge screw trick: one constraint for concentric + flush simultaneously
- Constraining multiple identical components (all four screws) in a single set
- Section Analysis: seeing inside the assembly to verify fit and clearance

**Chapters:**
- 0:00 Introduction
- [0:00] Assembly files — what's different from part design
- [0:00] Inserting and rough-positioning the omni wheel
- [0:00] Grounding to the origin — three constraints
- [0:00] Hub halves — constraint sets for clean assembly trees
- [0:00] M3 screws — the edge-to-edge trick, one constraint per screw
- [0:00] Multiple Components in one constraint set
- [0:00] Bearings — concentric and flush
- [0:00] Section Analysis — validating the design from the inside
- [0:00] Save the assembly

*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*
