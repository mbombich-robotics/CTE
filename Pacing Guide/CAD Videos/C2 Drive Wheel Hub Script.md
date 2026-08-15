# Video Script — C2 Drive Wheel Hub

---

## INTRO

[COLD OPEN — 3–4 sec, finished C2 Drive Wheel Hub rotating in Fusion, clean background, no UI]

[TITLE CARD — 3 sec]
C2 — Drive Wheel Hub
Autodesk Fusion · HS Applied Engineering & Robotics

[VERBAL — TTS]
"C2, the drive wheel hub. [pause] This one connects the motor to the wheel — and it's the first component where the design decisions are partly yours. [pause] Let's go."

---

## BODY

[SCENE 1 — Full robot assembly in Fusion, Animation workspace. Hub and wheel pulled away from motor to reveal hex shaft and retention screw.]

"We'll start where the requirements come from. [pause] I've switched to the Animation workspace to pull the wheel and hub off the motor — the same way we did for C1."

"What you're looking at is the [emphasis] 3/8-inch hex shaft protruding from the motor, and a [emphasis] retention screw threaded into the end of it. The hub has to fit on that hex shaft, grip the squishy wheel on the outside, and be locked down by that screw."

"Unlike C1, this component has [emphasis] three constraints you can't change: the hex bore size, the wheel bore size, and the shaft depth. Everything else — spoke count, spoke shape, overall style — is yours. [pause] This is the first component where you can copy and improve my design, or start over completely."

---

[SCENE 2 — Fusion 360, NeverRest motor and Squishy wheel files open. Measure tool active (I on keyboard).]

"I have the motor and wheel CAD files open. These will be made available to you so that you can take your own measurements or verify mine. [pause] Press [emphasis] I to open the Measure tool."

"Starting with the wheel. The inside diameter is [emphasis] 53.975 millimeters. The depth of that bore — how far the hub has to reach inside — is [emphasis] 25.4 millimeters, exactly one inch. The overall width of the wheel is [emphasis] 38 millimeters — that number matters when we figure out the standoff."

"Now the motor. The shaft is a [emphasis] 3/8-inch hex. In the Measure tool, switch the secondary units field to millimeters — now I can see that flat to flat is [emphasis] 0.374 inches, or [emphasis] 9.5 millimeters. The shaft length from the shoulder is [emphasis] one inch — 25.4 millimeters. [pause] The retention screw in the end is a [emphasis] 10-32 — I'm getting that from the manufacturer, not from the model."

---

[SCENE 3 — New part design open, saved. Sketch started on XY plane. Construction circle at 53.975mm being drawn.]

"New part design — and the first thing I do is [emphasis] save. The file is called [emphasis] Drive Wheel Hub, saved to my project folder. [long pause] I'm starting a sketch on the XY plane."

"My first circle is a reference — the inside diameter of the wheel, [emphasis] 53.975 millimeters, constrained to the origin. Before I do anything else, I switch it to a [emphasis] construction line in the Sketch Palette. [pause] This circle is geometry only. I will not extrude from it."

"[emphasis] Here's why that matters — by keeping my reference geometry as a construction line, I keep my sketch clean. When I go to extrude, only the lines I actually want to build from will be available to select."

---

[SCENE 4 — Offset tool applied twice: +2mm for hub OD, then +1mm for shoulder. Both as normal lines.]

"From the Modify menu, select [emphasis] Offset. Click the construction circle and drag the arrow outward. Type [emphasis] 2 and hit Enter. [long pause] This is the outside diameter of the hub — [emphasis] 2 millimeters larger than the wheel bore."

"That 2-millimeter interference is intentional. The wheel is soft silicone, so a moderate amount of compression is what keeps it from spinning on the hub. [pause] This is the same concept as the bearing pocket from C1 — different material, much larger cushion."

"One more offset from that same outer circle — [emphasis] 1 millimeter. [pause] This thinner ring becomes the shoulder that the squishy wheel wraps over. Without a shoulder on both sides, the wheel slides off under load."

---

[SCENE 5 — Circumscribed polygon drawn from origin. H/V constraint applied to one flat. Dimension tool with mixed-unit math.]

"Now the hex bore. Go to Create → Polygon → [emphasis] Circumscribed Polygon, constrain it to the origin, and draw it out. [pause] Before I enter a dimension, I apply the [emphasis] Horizontal/Vertical constraint to one flat — that pins the rotation so the polygon doesn't spin freely."

"Press [emphasis] D for dimension and click flat to flat. Here's a trick: the dimension tool can mix units and do math. I type [emphasis] 0.374 inches plus 0.25 and hit Enter. [long pause] Fusion converts the inches and adds the cushion in one step — the result is [emphasis] 9.75 millimeters, flat to flat."

"Why the cushion? The shaft is 9.5mm. If I model the bore at exactly 9.5mm and print it, the bore comes out smaller — same reason we added cushion to the bearing pocket in C1. [pause] 0.25mm is a starting point. You may need to adjust after your first print."

---

[SCENE 6 — Standoff circle drawn from origin at ~20mm. Slot tool used. Slot dimensioned and constrained. Circular pattern applied.]

"One more circle from the origin — about [emphasis] 20 millimeters in radius. This becomes the shoulder that positions the hub at the right depth on the shaft. [soft] We'll dial in the exact dimension later in the assembly."

"I said that was the last piece of geometry. [pause] It isn't — this is a solid hub without spoke cutouts, and that means unnecessary weight and a longer print. From the Create menu: Slot → [emphasis] Center to Center Slot. Place one slot near the 12 o'clock position and draw it without dimensions first."

"Dimension the slot: a width for the slot ends, and a distance from the slot center to the origin. [pause] To lock the slot's rotation, I need the [emphasis] Coincident constraint between the slot centerline and the origin — [soft] not Horizontal/Vertical, which constrains position. If the wrong constraint doesn't work, that's your signal to try the other one."

[SCENE 7 — Circular Pattern applied to slot. Quantity being adjusted. Pattern complete. Finish Sketch clicked.]

"With one slot fully constrained, go to Sketch → [emphasis] Circular Pattern. Select all the slot geometry, set the center to the origin, and adjust the quantity. [pause] This is where you make a design choice."

"More spokes means more wall segments for the printer to build, which means longer print time. [pause] I'm using [emphasis] six — but this is your call. Whatever you pick, be deliberate: too few and the hub looks unfinished, too many and you're adding print time without adding strength."

"Click OK and [emphasis] Finish Sketch. Every line should be black — fully constrained. If anything is still blue, find it and constrain it before moving on."

---

[SCENE 8 — Extrude tool. Four separate extrusions shown in sequence. Body builds up on screen.]

"We're making [emphasis] four extrusions from this one sketch. I'll take them in order."

"[emphasis] Extrusion one — the outer shell and shoulder. Click and drag to select all geometry, then deselect the lightening slots and the standoff circle. Only the outer ring remains. Set the thickness to [emphasis] 1 millimeter. [long pause]"

"[emphasis] Extrusion two — the hub body. Make the sketch visible, select the two rings that form the inner surface — the ones the wheel grips. This one goes in the [emphasis] opposite direction from the first. Type [emphasis] negative 25.4 and hit Enter. [long pause] That depth matches the inside bore of the wheel exactly."

[SCENE 9 — Extrusions 3 and 4 continued. Object start demonstrated. Join operation shown.]

"[emphasis] Extrusion three — the inside shoulder. Same geometry as the outer shoulder, but I start it from a [emphasis] different face. Set Start to Object, click the far end face of the hub body, then select the shoulder ring. Extrude [emphasis] negative 1 millimeter. [long pause] Now both shoulders are in place."

"[emphasis] Extrusion four — the standoff. Select the center circle, start dragging, and Fusion thinks it should cut — change Operation to [emphasis] Join. Now it adds material. Set the distance to [emphasis] 14 millimeters for now. [pause] The exact depth gets confirmed in the assembly — this is our starting estimate."

---

[SCENE 10 — Fillet tool on outer edges. Face selection demonstrated. Chamfer tool on hex bore.]

"Now we smooth the shape. Modify → [emphasis] Fillet. Click the edge of the outer shoulder — [emphasis] 1 millimeter. [pause] Click the plus icon to add a selection, then click a [emphasis] face on the end of the hub body — Fusion fillets every edge on that face at once. Set it to [emphasis] 0.5 millimeters. Repeat for the other shoulder face."

"For the hex bore, I'm switching to [emphasis] Chamfer — Modify → Chamfer. A chamfer makes a flat angled face, which acts as a [emphasis] funnel when you're pressing the hub onto the shaft. A fillet rounds the edge, which is less effective as a lead-in. [pause] Half a millimeter is enough. Click OK and inspect."

---

[SCENE 11 — Back to base sketch. Two circles added (10mm, 5.6mm). Extrusion added from standoff face. Clip shows cap of material filling in end of hub.]

"One thing I missed: the hub slides onto the shaft, but nothing [emphasis] holds it there. The retention screw needs material to clamp against — between the screw head and the end of the shaft."

"Go back to the base sketch. Add two circles, both constrained to the origin: [emphasis] 10 millimeters for the screw head counterbore, and [emphasis] 5.6 millimeters for the screw clearance hole. [pause] The 10-32 screw is close to an M5 — 5.6mm is the correct clearance diameter. If you want to verify that, look it up. That's a habit worth building."

"Finish sketch and create one more extrusion — from the inner face of the standoff, dragging outward to fill in the end. [long pause] Change Operation to Join. The exact depth will be set once you can see the assembly — we'll cover that in the next scene. [pause] For now, let the extrusion go past the end and we'll trim it in context."

---

[SCENE 12 — Assembly file. Motor, hub, squishy wheel, and 10-32 screw inserted and constrained. Section analysis shown. Edit-in-place used to adjust retaining cap depth.]

"Now we validate the design. If you haven't worked through the Assembly Introduction video, do that first — this scene uses those skills directly."

"Create a new Assembly Design, insert the motor, and apply three constraints to ground it. [long pause] Insert the hub, constrain its center bore to the shaft, and add an angular constraint to align the hex flats. [long pause] Insert the squishy wheel and constrain it to the hub shoulder. [long pause] Finally, bring in a [emphasis] 10-32 by 3/4-inch screw from Common Components → Fasteners."

"Go to Inspect → [emphasis] Section Analysis. Click a flat face on the motor and drag the plane to the center of the assembly. [long pause] You can now see the screw, the hub bore, the shaft, and the wheel — all at once. Move the screw in until it's about halfway into the shaft threading. [pause] From this view, you can see exactly how much hub material sits between the screw head and the end of the shaft — and whether the squishy wheel clears the deck."

[SCENE 13 — Edit in Place. Pencil icon on hub in browser tree. Construction plane offset to align with shaft end. Retaining cap extrusion to base of screw head.]

"To finalize the retaining cap depth, hover over the hub in the browser tree and click the [emphasis] pencil icon — that puts you in Edit in Place. Everything else grays out; only your hub is active."

"Go to Construct → [emphasis] Offset Plane, click the outer face of the hub, and drag the plane inward until it lines up with the [emphasis] end of the motor shaft. Click OK. [long pause] Now create an extrusion: select the hex geometry, set Start to [emphasis] Object and select that construction plane, and drag outward to the [emphasis] base of the screw head. Operation: Join. Click OK. [long pause]"

"The material now fills exactly the right space — the screw will seat against it and clamp the hub to the shaft. [pause] Click Finish Edit."

"[emphasis] Save the assembly file — this is important. When you edit a component inside an assembly and save the assembly, Fusion saves those component changes too. [pause] If you only save the component file and not the assembly, the assembly won't reflect your changes."

"Once the assembly is saved, right-click the hub in the browser and open it in its own file."

---

[SCENE 14 — Final hub rotating in Fusion, clean view. No UI other than the 3D model.]

"Spin it. Look at every face. [pause] Check that your fillets and chamfer are clean, your slots look the way you want them, and the proportions feel right. [pause] This is your design. Make sure it's one you're proud of."

---

## OUTRO

[VERBAL — TTS]
"[excited] C2 is done. One sketch, four extrusions, and the first component where the design was partly yours."

"Before the next video, your hub should be printed and test-fitted on the motor shaft. Screenshot your model and start your iteration log — that goes in your portfolio."

"Next up — [emphasis] C3, the motor mount sleeve. Press fit, bore tolerance, and why a tenth of a millimeter changes everything. [pause] Let's go."

[TITLE CARD — 5 sec]
C2 — Drive Wheel Hub · Complete
Next: C3 — Motor Mount Sleeve
[Portfolio submission link / QR code]

---

## YouTube Description

C2 — Drive Wheel Hub | Autodesk Fusion | HS Applied Engineering & Robotics

We design the drive wheel hub — the part that connects L.E.O.'s motor to its squishy wheel. This component is driven by hard constraints: the wheel's inside diameter, the 3/8-inch hex shaft, and a 10-32 retention screw. But spoke count, spoke shape, and overall style are yours to decide. This is the first component with creative latitude.

We build the hub from a single sketch — using construction lines, the Offset tool, a circumscribed polygon for the hex bore, and the Slot tool for lightening spokes. Then we validate the design in an assembly using Section Analysis and Edit in Place to confirm the retaining cap depth before export.

**What you'll learn:**
- Construction lines as reference geometry — what they're for and when to use them
- Offset tool: deriving a hub diameter from the wheel's inside bore in one step
- Circumscribed polygon for hex bores — and how to mix units inside the dimension tool
- Slot tool and Circular Pattern for spokes — how spoke count affects print time
- Fillet vs. chamfer — which one to use as a lead-in on a hex bore
- Section Analysis: seeing your design in the context of a full assembly
- Edit in Place: modifying a component without leaving the assembly file

**Chapters:**
- 0:00 Introduction
- [0:00] Component overview — what's fixed and what's yours to design
- [0:00] Measuring the wheel and motor in Fusion
- [0:00] Sketch — construction circle and Offset for hub OD and shoulder
- [0:00] Sketch — circumscribed polygon with mixed-unit dimension
- [0:00] Sketch — standoff circle, Slot tool, and Circular Pattern
- [0:00] Four extrusions from one sketch
- [0:00] Fillets and chamfer — and why chamfer wins on the hex bore
- [0:00] Retention screw feature — the thing I almost forgot
- [0:00] Assembly — motor, hub, wheel, and screw
- [0:00] Section Analysis and Edit in Place
- [0:00] Final inspection

*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*
