# Video Script — C2 Drive Wheel Hub

---

## INTRO

[COLD OPEN — 3–4 sec, finished C2 Drive Wheel Hub rotating in Fusion, clean background, no UI]

[TITLE CARD — 3 sec]
C2 — Drive Wheel Hub
Autodesk Fusion · HS Applied Engineering & Robotics
20:50 · https://www.youtube.com/watch?v=fJOg-h7goc8

[VERBAL — TTS]
"C2. The drive wheel hub. [breath] This one connects the motor to the wheel — and it's the first component where the design decisions are partly yours. [excited] Let's go."

---

## BODY

[SCENE 1 — Full robot assembly in Fusion Three-Sixty, Animation workspace. Hub and wheel pulled away from motor to reveal hex shaft and retention screw.]

"We'll start where the requirements come from. [breath] I've switched over to the Animation workspace to pull the wheel and hub off the motor — same as we did for C1."

"What you're looking at is the three-eighths-inch hex shaft protruding from the motor, and a retention screw threaded into the end. The hub has to fit onto that hex shaft, grip the squishy wheel on the outside, and be locked down by that screw."

"Unlike C1, this component has [confident] three constraints you can't change: the hex bore size, the wheel bore size, and the shaft depth. Everything else — spoke count, spoke shape, overall style — is yours. [breath] This is the first component where you can copy and improve my design... or start completely from scratch."

"One key detail will be the standoff between the wheel and the robot. [breath] We'll accomplish that space by adding a shoulder to the inside of the hub — we'll determine its exact dimension later."

---

[SCENE 2 — Fusion Three-Sixty, NeverRest motor and Squishy wheel files open. Measure tool active.]

"I have the motor and wheel CAD files open in Fusion Three-Sixty. These will be made available to you so you can take your own measurements — or just verify mine. [breath] Press I on your keyboard to open the Measure tool."

"Starting with the wheel. The inside diameter is fifty-three point nine seven five millimeters. [breath] I like to have a scratchpad on my desk to jot numbers like this down.[breath] The depth of that bore — how far the hub has to reach inside — is twenty-five point four millimeters... exactly one inch. The overall width of the wheel is thirty-eight millimeters — that number matters when we size the standoff."

"Now the motor. The shaft is a three-eighths-inch hex. In the Measure tool, switch the secondary units field to millimeters... [breath] ...and flat to flat reads zero point three seven four inches — nine point five millimeters. Shaft length from the shoulder: one inch, twenty-five point four millimeters. [sharp intake of breath] The retention screw in the end is a ten-thirty-two — I'm getting that from the manufacturer, not from the model."

---

[SCENE 3 — New part design open, saved. Sketch started on XY plane. Construction circle at 53.975mm being drawn.]

"New part design — and the first thing I do is save it. The file is called Drive Wheel Hub, saved to my project folder... [breath] Starting a sketch on the XY plane."

"My first circle is a reference — the inside diameter of the wheel, fifty-three point nine seven five millimeters, [breath] constrained to the origin. [breath] Notice that before I click to make the circle, I can switch the line type to a construction line in the Sketch Palette. [breath] I could also make the line, select it, and change the line type later. [breath]This circle is reference geometry only, that means I can't extrude a solid from it."

"[sharp intake of breath] Here's why that matters — keeping reference geometry as a construction line keeps the sketch clean. When I go to extrude, only the lines I actually want to build from will be available to select."

---

[SCENE 4 — Offset tool applied: +2mm for hub OD. Then second offset +1mm for shoulder. Both as normal lines.]

"From the Modify menu, grab the Offset tool. Click the construction circle, drag the arrow outward... type two and hit Enter. [breath] This is the outside diameter of the hub — two millimeters larger than the wheel bore."

"That two-millimeter interference is intentional. The wheel is soft silicone, and a moderate amount of compression is what keeps it from spinning on the hub. [confident] Same concept as the bearing pocket cushion from C1 — different material, much larger gap."

"One more offset from that same outer circle — one millimeter. [breath] This thinner ring becomes the shoulder that the squishy wheel wraps over and sits between. Without a shoulder on both sides, the wheel slides right off under load."

---

[SCENE 5 — Circumscribed polygon drawn from origin. H/V constraint applied to one flat. Dimension tool with mixed-unit math.]

"Now the hex bore. Go to Create, Polygon — select Circumscribed Polygon. Constrain it to the origin and draw it out... [breath] Before I enter a dimension, I apply the Horizontal-Vertical constraint to one of the flats. That pins the rotation so the polygon can't spin freely on the sketch."

"Press D on your keyboard for dimension, then click flat to flat. [sharp intake of breath] Here's a trick — the dimension tool can mix units and do math in one shot. I type zero point three seven four inches plus zero point two five... and hit Enter. Fusion Three-Sixty converts the inches and adds the cushion in a single step. The result is nine point seven five millimeters, flat to flat."

"Why the cushion? The shaft is nine point five millimeters. If I model the bore at exactly nine point five and print it, [chuckle] the bore comes out smaller — same shrinkage we saw in C1's bearing pocket. Zero point two five is the starting estimate. You'll adjust after your first test fit."

---

[SCENE 6 — Standoff circle drawn from origin at ~20mm. Slot tool used at 12 o'clock position. Slot drawn without dimensions first.]

"One more circle from the origin[breath] about twenty millimeters in diameter. [breath]This becomes the shoulder that provides standoff between the wheel and the rest of the robot."[breath]

"Now [embarrassed to say][breath] — I said that was the last piece of geometry. [chuckle chuckle] It wasn't. [breath]This is a solid hub, and solid means unnecessary mass and a longer print. [breath]Let's remove some material by adding slots. [breath]It'll make our hub look more interesting as well.[breath] From the Create menu: [breath]pick the Slot tool —[breath] Center to Center Slot. [breath]Start the slot near the twelve o'clock position and draw it down without dimensions first."[breath]

"Press D on your keyboard to dimension: Since these dimensions are all made up, I'm going to use whole numbers. [breath]make a width dimension for the end circles, [breath] a length dimension for the construction line in the middle of the slot, and a distance from the slot end to the origin. [sharp intake of breath] [breath]To lock the rotation, [breath]use the Coincident constraint between the slot's centerline and the origin. 

"Now use the circular pattern tool to turn this slot into some spokes. [breath] You can make as many as you want [chuckle][daringly] I mean, [pause for dramatic effect] maybe."

Go ahead and change some of the dimensions and pattern variables until you like how it looks.

Double clicking on the pattern glyph will open the tool dialogue for edits.

---

[SCENE 8 — Extrude tool. Four separate extrusions shown in sequence. Body builds up on screen.]

"We're making four extrusions from this one sketch. [breath] I'll take them in order."

"Extrusion one — the outer shell and shoulder. Click and drag to select all geometry, then deselect the lightening slots and the standoff circle. Only the outer ring stays selected. Set the thickness to one millimeter and click OK..."

"Extrusion two — the hub body. Make the sketch visible again. Select the two rings that form the inner surface — the ones the wheel grips. This one goes in the opposite direction from the first. Type negative twenty-five point four and hit Enter. That depth matches the inside bore of the wheel exactly."

[SCENE 9 — Extrusions 3 and 4. Object start demonstrated. Join operation shown for standoff.]

"[clearing throat] Extrusion three — the inside shoulder. [breath]Same circle geometry as the outer shoulder, [breath]but starting from a different face. [breath]Set Start to ɑːb.dʒekt, [breath]click the far end face of the hub body, [breath]and extrude negative one millimeter... [breath]Both shoulders are now in place."[breath]

"Extrusion four — [breath]the standoff. [breath]Select the center circle and start dragging... [breath] Fusion Three-Sixty thinks it should cut. [breath]Change the Operation to Join. [breath]Now it adds material. [breath]Set the distance to fourteen millimeters for now —[breath] the exact depth gets confirmed in the assembly. [breath]This is our starting estimate."
---

[SCENE 10 — Back to base sketch. Two circles added at origin. Extrusion from inner face of standoff.]

"One thing I missed — [laughing nervously] the hub slides onto the shaft, but nothing holds it there. [breath] The retention screw needs material to clamp against. [breath] Back into the base sketch."[breath]

"Add two circles, both constrained to the origin: [breath] ten millimeters for the screw head counterbore, [breath] and five point six millimeters for the clearance hole. [confident] The ten-thirty-two screw is close to an M5 — five point six is the correct clearance diameter. [breath] If you want to verify that, look it up. [breath] That's a habit worth building."[breath]

"Finish Sketch. [breath] Create one more extrusion from the inner face of the standoff, [breath] dragging outward to fill in the end. [breath] Change Operation to Join. [breath] The exact depth gets set in the assembly — which is the next scene."

---

[SCENE 11 — Part design file. Hub body complete in browser. No finishing touches yet.]

"Before we add anything else, let's talk about where we are and what comes next."[breath]

"The hub body is built. [breath] We know we need a retaining cap to give the ten-thirty-two screw something to clamp against — [breath] but we don't know the exact depth yet. [breath] That measurement comes from the assembly — not from the part file in isolation."[breath]

"Here's the plan. [breath] We'll bring this hub into an assembly with the motor, the wheel, and the screw. [breath] Section Analysis will let us see inside and measure exactly where the screw head lands. [breath] Then we'll use Edit in Place to add the retaining cap at the correct depth — [breath] with the screw right there as a reference. [confident] No guessing."[breath]

"After that we come back here, [breath] add the fillets and chamfer, [breath] and send the file to the printer. [breath] That's the sequence."[breath]

"[confident] Save the model before we move on."

---

[SCENE 12 — Assembly file. Motor, hub, squishy wheel, and 10-32 screw inserted and constrained. Section analysis active.]

"Now we validate. [sharp intake of breath] If you haven't watched the Assembly Basics video yet, do that first — this scene uses those skills directly."[breath]

"Create a new Assembly Design in Fusion Three-Sixty. [breath] Insert the motor and apply three constraints to ground it... [breath] Insert the hub, [breath] apply a con-centric constraint on the shaft, [breath] and add an angular constraint to align the hex flats... [breath] Insert the squishy wheel and constrain it to the hub shoulder... [breath] Finally, bring in a ten-thirty-two by three-quarter-inch screw from Common Components — Fasteners."[breath] Add a con-centric constraint between the screw and the motor shaft.[breath]

"Go to Inspect — [breath]Section Analysis. [breath] Click a flat face on the motor and drag the plane to the center of the assembly... [breath] You can now see the screw, [pause] the hub bore, [pause]the shaft, [pause]and the wheel all at once. [breath] 

You might be wondering, [pause, intrigued]how much thread engagement is enough? [breath]A minimum of 3 fully engaged threads is required to reach basic holding strength, [pause]but a safe rule of thumb is to engage a length equal to one to one and a half times the screw's diameter in steel[breath] even more for softer materials. [breath]This ensures the screw breaks instead of stripping the threads.  [breath]Move the screw in until it's about halfway into the shaft threading. [breath] From this view you can see exactly how much hub material sits between the screw head and the end of the shaft."

---

[SCENE 13 — Edit in Place. Pencil icon on hub in Browser tree. Offset Plane to shaft end. Retaining cap extrusion to base of screw head.]

"To finalize the retaining cap depth, [breath] hover over the hub in the Browser tree and click the pencil icon — that puts you in Edit in Place. [breath] Everything else grays out. [breath] Only your hub is active."[breath]

"Go to Construct — Offset Plane. [breath] Click the outer face of the hub and drag the plane inward until it aligns with the end of the motor shaft. [breath] Click OK... [breath] Press E on your keyboard to extrude. [breath] Select the hex geometry, [breath] set Start to ɑːb.dʒekt — [breath] select that construction plane — [breath] and drag outward to the base of the screw head. [breath] Operation: Join. [breath] Click OK."[breath]

"The material now fills exactly the right space. [breath] The screw seats against it and clamps the hub to the shaft. [breath] Click Finish Edit. [sharp intake of breath] Save the assembly file — this is critical. [breath] When you edit a component inside an assembly and save the assembly, Fusion Three-Sixty saves those component changes too. [breath] If you only save the component file, the assembly will not reflect your changes."[breath]

"Once the assembly is saved, [breath] right-click the hub in the Browser tree and open it in its own file."

---

[SCENE 14 — Part design file reopened. Retaining cap confirmed. Fillet and chamfer tools.]

"The assembly told us what we needed. [breath] The retaining cap is in, the depth is confirmed — [breath] now we can finish the part."[breath]

"Modify — Fillet. [breath] Click the edge of the outer shoulder — one millimeter. [breath] Click the plus icon to add a selection, [breath] then click a face on the end of the hub body. [breath] Fusion Three-Sixty fillets every edge on that face at once — set those to half a millimeter. [breath] Repeat for the other shoulder face."[breath]

"For the hex bore opening, I'm switching tools. [breath] Modify — Chamfer. [confident] A chamfer creates a flat, angled face — it acts as a funnel, guiding the shaft into the bore. [breath] A fillet rounds the edge, and that's far less effective as a lead-in. [breath] Half a millimeter is enough. [breath] Click OK and inspect your work."

---

[SCENE 15 — Final hub rotating in Fusion Three-Sixty, clean view. No UI visible.]

"Spin it. [breath] Look at every face. [breath] Check that your fillets and chamfer are clean, [breath] your slots look the way you want them, [breath] and the proportions feel right. [breath] This is your design. [breath] Make sure it's one you're proud of."

---

## OUTRO

[VERBAL — TTS]
"[excited] C2 is done. [breath] One sketch, four extrusions, and the first component where the design was partly yours."[breath]

"Before the next video, your hub should be printed and test-fitted on the motor shaft. [breath] Screenshot your model and start your iteration log — that goes in your portfolio."[breath]

"Next up — [confident] C3, the motor mount sleeve. [breath] Press fit, bore tolerance, and why a tenth of a millimeter changes everything. [breath] Let's build some robots!"

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
- [0:00] Retention screw — the problem and the plan
- [0:00] Assembly — motor, hub, wheel, and screw
- [0:00] Section Analysis and Edit in Place
- [0:00] Finishing touches — fillets and chamfer
- [0:00] Final inspection

*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*
