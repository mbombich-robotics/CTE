# Video Script — C3 Motor Mount Sleeve

---

## INTRO

[COLD OPEN — 3–4 sec, finished C3 Motor Mount rotating in Fusion, clean background, no UI]

[TITLE CARD — 3 sec]
C3 — Motor Mount Sleeve
Autodesk Fusion · HS Applied Engineering & Robotics
https://www.youtube.com/watch?v=kgx1Czwajkg

[VERBAL — TTS]
"C3. [breath] The motor mount — the part that decides where the motor lives, and by extension, the height of the entire robot. [breath] Let's build some robots!"

---

## BODY

[SCENE 1 — Full robot assembly in Fusion Three-Sixty. Motor pulled away from deck to reveal mounting flange and shaft.]

"The NeverRest motor has to mount to the underside of the robot deck. [breath] The motor mount is what makes that connection — and the geometry here determines the height of the robot."[breath]

"Height is a function of two things: the wheel diameter, and the thickness of the surface between the motor and the underside of the deck. [confident] Increase that thickness, and the robot rides higher. [breath] That relationship is worth understanding before you commit to any dimensions."[breath]

"The hard constraint here isn't the deck — it's the motor flange. [breath] The flange geometry drives most of the design decisions: its mounting holes, its bolt circle, its overall diameter. [breath] We'll be using M5 bolts and flanged nuts to mount it — four per motor." We'll use four 10-32 screws to assemble the motor to our mount.

---

[SCENE 2 — Several design sketches or reference images of motor mount styles side by side. Sleeve design highlighted.]

"[clearing throat] Before we start modeling, let's talk about your options — because there's more than one way to do this."[breath]

"I'll be building a one-piece sleeve design. [breath] The motor slides into a printed tube that's integrated with the mounting face. [breath] Simple, stiff, and it keeps the motor aligned with no extra hardware."[breath]

"A two-piece design is also common: a face-mount flange plus a C-clamp that wraps around the back of the motor. [breath] Both pieces bolt through to the deck. [breath] The advantage is that you never have to disassemble the motor — but the C-clamp requires flexible material or careful tolerance work to snap onto the motor body."[breath]

"[sharp intake of breath] Here's the trade-off with the one-piece sleeve: to install the motor, you have to remove the flange. [breath] Four bolts — straightforward. [breath] Angle the flange and shaft through the gap in the mount, slide the motor into the sleeve, then reassemble the flange to the gearbox and bolt it to the face. [breath] We'll walk through that during assembly validation."

---

[SCENE 3 — New part design open. Motor CAD file inserted as reference. Sketch started on motor flange face. Project tool active.]

"In the file menu, click new. This time we're using the hybrid design — save it first. [breath] Motor Mount, project folder."[breath]

"Insert the NeverRest motor CAD file constrain it to the origin. You'll need to make two constraints with the flange to the origin planes, and one axial constraint between the x or y axis and the motor's shaft. 

Now create a new component--the motor mount itself. Deselect External and name the part, Motor Mount. By making the part internal to this design, we can borrow the geometry from other components, like the motor flange.

Start a sketch on the flat face of the flange — the face that will press against the 3D printed mount. [breath] I'm going to borrow some of the geometry already available in this part. To do that, Press P on your keyboard to Project or include geometry. Select all of the flange geometry by clicking on the flange face--you'll see all of the geometry appear. [breath]then click OK. [breath] Fusion Three-Sixty traces every edge onto the sketch plane."

Now take a closer look at that motor flange. The face we just projected doesn't include the outside edge, because they have a fillet on the edge. Add an offset of 0.25mm to account for that fillet. Now select all geometry and change the line type to construction--I only want this geometry for reference. 

"Press D on your keyboard and click one of the four small mounting holes. [breath] Fusion Three-Sixty will tell you this is a driven dimension — it means the size is locked to the projected geometry. [breath] You can read it, but not change it. [breath] The four mounting holes measure just over four millimeters. [breath] The other small holes — the socket head clearances — measure five point eight millimeters."[breath]

"[sharp intake of breath] Here's a discrepancy worth knowing about. [breath] The manufacturer's spec sheet says those four mounting screws sit on a twenty-eight millimeter bolt circle. [breath] The CAD file shows twenty-nine. [breath] It's not unusual — but it can cause fit problems when you 3D print the mount. [breath] We'll compensate by using a slightly larger offset around those holes, giving a looser fit."[breath]

"Delete these four circles. [breath] [monotone]They exist on the motor flange, but we won't use them. [breath] 

Referring back to the manufacturer's specs, The other mounting holes are tapped for 10-32 bolts, and are on a one and a half inch by half inch rectangle. [breath] I'll use the rectangle tool to verify that dimension before proceeding. [breath] The measurements match. [breath]

"Let's add some offsets to this reference geometry to define our mounting surface. [breath]a zero point two five millimeter offset provides a gap to keep the motor parts from binding against 3D printed plastic. [breath] We'll do this with the flange perimeter and the rest of the holes that we're using."

I've defined the mounting surface for the motor flange, now I'll add an offset that creates the pocket that it will sit in. This will end up being the main structure of the fsce mount, so I'll extend it at least 4mm.

[Counterbores]
Now I'll make four circles for the mounting bolt counterbores, constrained concentrically to the four outer circles. I'll make them large, and only dimension the last one. Hit escape. Hold the control key, and select all four. Hit the equal sign on your keyboard or click the equal constraint.

"Now we need to define the geometry that attaches this mount to the deck. [breath] I'll start by making some reference gemoetry to visualize the wheels and deck. [breath] The wheel is a four inch diameter circle constrained concentrically to the motor shaft. [breath] The deck is a 6mm rectangle that sits above the wheel. [breath] The omni wheel is a 3 inch circle. I'll add a line that represents the ground, and add tangent constraints between my wheels and the ground."

"I have plenty of room for the motor, I just need to make sure I can mount my omni wheel. [breath] This looks about right, let's constrain it with a dimension and make it a whole number."

"Finally we add the connection between the flange and the deck. [breath] I'll use the extend tool to extend these two lines up to the deck. [breath] I'll finish this solid by adding a line across the top. [breath] Solid confirmed by the blue shading. [breath] 

---

[SCENE 4 — Sketch finished. Extrude tool open. Face thickness calculation explained. Six-millimeter extrusion shown.]

"Finish Sketch. [breath] Before we extrude, we need to know how thick to make the face."[breath]

"[confident] Here's the logic. [breath] Structural 3D printed parts need at least three to four millimeters to hold up under load — that's the structural minimum. [breath] But this face also has to countersink the screw heads. [breath] Measure one of the screws — the head depth is two point five six five millimeters. [breath] Round up to three."[breath]

"Three millimeters for the screw head, three millimeters for structural integrity. [breath] Total face thickness: six millimeters. [breath] Select all the flange geometry and extrude six millimeters. [breath] This is the face of the motor mount. [breath] Everything else builds from here."[breath]

"Now cut the counterbores. [breath] Make the sketch visible again, select just the four mounting hole circles, [breath] and extrude negative three millimeters into the face — enough to recess the screw heads flush. [breath] Change Operation to Cut. [breath] Click OK."

These counterbores don't look right for a 10-32 screw head. Let's double check those dimensions. 

The screw head is 9.153 mm. I'll add 0.25mm and then round up to 9.5. 

Yeah, I set these to 5.8, not even close. 

Easy fix, though. There, those look right. Always have a critical eye. That would have wasted a lot of 3d printing time.

Now let's extrude the pocket that the motor flange sits in. The motor flange is about 9mm thick. 


---

[SCENE 5 — New sketch created on the end face of the first extrusion. Project tool active on motor body outer circle. Offset and Extend tools shown.]

"Now we need the sleeve — the tube that supports the back end of the motor, and the top flange that connects the motor mount to the deck. To add that geometry, I have two options: go back into the base sketch, or start a new sketch on the end face of the first extrusion."[breath]

"Going back into the base sketch is usually my preference — it keeps everything in one place. [breath] But in this case, the motor body circle I'm about to project is very close in proximity to geometry that's already in that sketch. [breath] Putting them in the same sketch would make it harder to select the correct geometry on this next extrusion. [confident] So this time, a new sketch is the cleaner call."[breath]

"Click the back face of the body we just created and start a new sketch. [breath] Press P on your keyboard to project.  Select the two verticle lines and the top line, we'll use them for reference. Make the motor visible again, and then hover over the outside circle of the motor body, [breath] and click OK. [breath] Fusion may produce a partial arc — that's fine."[breath] Select all of that geometry and switch the linetype to construction.

"Apply a 0.25mm offset to that arc. [breath] Switch the offset line to a solid line type. [breath] Then use the Extend tool to close it into a full circle — [breath] click any open end of the arc and this tool closes the gap. [breath] Click the circle to confirm it highlights as a solid, closed loop."[breath]

Just like on the flange we'll give this a wall thickness of 4mm. Offset the sleeve circle outward by four millimeters.  Four millimeters is enough to hold the motor without flexing under load — and thin enough to keep the part from being unnecessarily heavy."

---

[SCENE 6 — Sketch showing gap geometry. Line tool drawing connector arm. Mirror tool shown. M5 nut inserted for reference measurement.]

I also need a flange at the top of the mount to connect it to the deck. And I need to connect the sleeve to the top flange. I'll start with an 8 millimeter rectangle at the top--that will be the flange. Then I'll use the line tool to make a connector from the sleeve to the top flange. 

"To keep it symmetrical, I'll make a centerline and mirror the geometry. Make a centerline using the line tool, [breath] construction line, [breath] hover near the midpoint until the midpoint symbol appears, [breath] then make a vertical line. Select the mirror tool from the create menu. Select the line. Define the mirror plane--the centerline we just made. Click OK."

"Open the M5 flanged nut file and measure it with the Inspect tool. [breath] The widest dimension is eleven point eight millimeters — call it twelve. [breath] The connector arm has to sit far enough from the outside edge of the top flange that the nut doesn't overhang the inner wall. [breath] Press D on your keyboard to dimension that distance. [breath] Fourteen millimeters is the target — twelve for the nut, two for breathing room."[breath]


---

[SCENE 7 — Finish Sketch. Two separate extrusions shown in sequence. Parametric change demonstrated.]

"Finish Sketch and hit save."[breath]

"Two extrusions. [breath] First: select just the top flange. [breath] Extrude thirty-five millimeters. [breath] This gap is that gives you room to insert the motor during assembly."[breath]

"Make the sketch visible again. [breath] Set Start to object — [breath] click the end face of the first extrusion. [breath] Select the sleeve circle the connector arm. [breath] Extrude sixty millimeters. [breath] We'll validate that length in the assembly — sixty is a reasonable estimate. [breath] Click OK."[breath]

"[confident] Here's where the parametric approach pays off. [breath] If thirty-five millimeters isn't enough assembly room, double-click that first extrusion in the timeline and change the number. [breath] The sleeve position, the overall height, the connector arm geometry — everything follows automatically. [breath] No rebuild required."

---

[SCENE 8 — New sketch on top face of motor mount. Rectangular construction pattern. Circles at corners. Extrude-Cut to Object.]

"[clearing throat] Last feature: the four bolt holes on the top flange. This will assemble the whole motor mount to the deck.

"Start a new sketch on the top face of the motor mount. [breath] We'll make a hole pattern using whole numbers — because these same dimensions have to match the holes you cut  into the deck later."[breath]

"I'll draw a construction rectangle and then put the holes on the four corners. [breath] Offset it fifteen millimeters from the back edge, [breath] and set the front-to-back length to seventy-five millimeters--that's an estimate for now. 

The top flange is 56mm and some change. A bolt on each side will be roughly centered in that 14mm gap we left outside of the connector. So 56 minus two 7mm halfway points leaves us with around 42 mm. Set the width of the rectangle to exactly 42mm.  [breath] 

Apply a Horizontal-Vertical constraint between the center of this rectangle and the center of the top face to lock it symmetric. Watch and listen carefully, hit the escape key to clear all selections. I try to do that everytime I pick a new tool. Now, while holding down the shift key, dray your cursor over the middle of the line until the midpoint glyph appears, then click. Do the same thing for the other midpoint. Now your hole pattern is centered on the flange. Let's measure where it landed. Right around 7mm, perfect.

"Add four circles at the corners of the rectangle. [breath] Dimension one to five point eight millimeters--that's clearance for the M5 screw. [breath] Hold Control and select all four, [breath] then apply the Equal constraint. [breath] Finish Sketch."[breath]

"Press E on your keyboard. [breath] Select the four circles. [breath] Change Extent type to object, click the underside of the top flange, and Fusion cuts exactly through the flange — no deeper. [breath] Click OK."

In the next video I'll start by showing you some errors that I made during a previous attempt to make this part. I fixed some of them for this video, but not all of them, so if you're following along with me, be sure to watch carefully to see what you still need to fix. I'll then give the part some cosmetic finishes.

Before I go, I'll create a section analysis. Go to the inspect menu and pick section analysis. Click on a face and drag the arrow until you get a good cross section of the features you're inspecting. Zooming in will make the arrow more granular, or you can enter a dimension. I'll start with a cross section of the 10-32 mounting holes. Hit save before the next video!

---

[SCENE 9 — Fillet tool. Several edge selections shown. Face selections for larger radii.]

"Now we finish the part. [breath] Modify — Fillet."[breath]

"Start with the main structural edges — half a millimeter on most faces keeps the surfaces clean and removes sharp edges. [breath] For the edges around the nut access channel, go to one millimeter — those faces see more stress. [breath] And for the junction between the front face and the top flange, [breath] drag the fillet out to four millimeters."[breath]

"[confident] Sharp edges on 3D printed parts aren't just a safety issue — they're stress concentrators. [breath] Every inside corner is a potential crack initiation point under load. [breath] This part mounts a motor that takes real force. [breath] Round everything you can."[breath]

"Click OK and inspect the part. [breath] Save before we move to the assembly."

---

[SCENE 10 — Browser tree. Right-click to save as external component. New Assembly Design opened. Motor, mount, deck inserted and constrained. Section Analysis active.]

"Right-click the motor mount in the Browser tree and select Save As External Component. [breath] Same name, same project folder. [breath] Save the part file."[breath]

"Create a new Assembly Design in Fusion Three-Sixty. [breath] Save it — Motor Mount Assembly."[breath]

"Insert the motor and apply three constraints to ground it to the origin. [breath] Insert the motor mount and constrain it to the motor flange — [breath] con-centric on the center bore, [breath] and flush on the face. [breath] Insert the deck panel and constrain it to the top face of the motor mount."[breath]

"Go to Inspect — Section Analysis. [breath] Drag the section plane through the center of the assembly. [breath] [sharp intake of breath] Check these things in order: [breath] the sleeve inner diameter clears the motor body with no interference, [breath] the connector arms clear the motor flange when it's bolted on, [breath] the mounting hole pattern on the top face will align with the deck, [breath] and the overall height from the deck underside to the wheel centerline matches your expectations."[breath]

"If anything fails that check, use Edit in Place to fix it — [breath] hover over the motor mount in the Browser tree and click the pencil icon. [breath] Adjust the extrusion lengths or hole positions, click Finish Edit, and save the assembly."

---

[SCENE 11 — Final motor mount rotating in Fusion Three-Sixty, clean view. No UI visible.]

"Spin it. [breath] Clean fillets, no sharp corners. [breath] The mounting face is symmetric. [breath] The sleeve is centered on the motor axis. [breath] The gap is big enough to install the motor — or it will be once you verify that in a test fit."[breath]

"This is the part that sets the robot's stance. [breath] Make sure it's right before you print it."

---

## OUTRO

[VERBAL — TTS]
"[excited] C3 is done. [breath] One sketch, two extrusions, and a parametric gap you can tune without rebuilding the whole part."[breath]

"Before the next video, print the motor mount and do a dry fit with the motor and a set of M5 bolts. [breath] Check the flange pocket depth, the nut clearance, and the sleeve fit. [breath] Log every measurement in your iteration notes — that goes in your portfolio."[breath]

"Next up — [confident] C4, the robot deck. [breath] The first CNC part — and the one everything else mounts to. [breath] Let's go."

[TITLE CARD — 5 sec]
C3 — Motor Mount Sleeve · Complete
Next: C4 — Robot Deck
[Portfolio submission link / QR code]

---

## YouTube Description

C3 — Motor Mount Sleeve (Part 1) | Autodesk Fusion | HS Applied Engineering & Robotics

We design the motor mount — the part that decides the height of the robot. This component is driven by the NeverRest motor flange geometry: a one-piece sleeve style that integrates the mounting face with a tube the motor slides into. Along the way we cover design trade-offs (one-piece vs. two-piece clamp), a real discrepancy between the manufacturer's spec sheet and their own CAD file, and how a parametric gap makes assembly clearances easy to tune without rebuilding the part.

Part 1 covers the full modeling sequence through the mounting hole pattern. Fastener verification, error correction, export, and finishing are in Part 2.

**What you'll learn:**
- Design options — one-piece sleeve, two-piece clamp, C-clamp, and the trade-offs for each
- Projecting geometry from an inserted component into a sketch
- Driven dimensions — reading a locked value and why it happens
- Spec vs. CAD discrepancy — how to compensate with a larger offset
- Designing for assembly: the 35mm gap that lets you insert the motor flange at an angle
- M5 nut clearance check — measuring hardware before committing to a dimension
- Mirror tool for symmetric connector arms
- Parametric thinking: how changing one extrusion updates the whole part
- Whole-number hole patterns — why it matters when the deck has to match

**Chapters:**
- 0:00 Introduction
- [0:00] What the motor mount does — and why it determines robot height
- [0:00] Design options — sleeve, two-piece clamp, and the assembly trade-off
- [0:00] Project flange geometry — driven dimensions and the bolt-circle discrepancy
- [0:00] Face thickness — screw head depth + structural minimum = six millimeters
- [0:00] Sleeve design — new sketch on the end face, project motor body, wall thickness
- [0:00] Assembly gap, connector arms, and M5 nut clearance
- [0:00] Two extrusions — parametric gap and sleeve length
- [0:00] Mounting holes — whole-number rectangular pattern, cut to object

*Continued in C3 Part 2 — error correction, fastener check, export, and finishing*
*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*
