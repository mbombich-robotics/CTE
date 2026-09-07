# Video Script — C2 Wheel Retaining Hub

---

## INTRO

[COLD OPEN — 3–4 sec, finished hub cap rotating in Fusion, clean background, no UI]

[TITLE CARD — 5 sec]
C2 — Wheel Retaining Hub
Autodesk Fusion · HS Applied Engineering & Robotics

[VERBAL]
"C2. The wheel retaining hub. This is the piece that locks the AndyMark 4-inch wheel onto the motor shaft — and the front face is a blank canvas for you to make your robot unique. Let's build it."

---

## BODY

[SCENE 1 — Motor and AndyMark wheel in the assembly visible on screen. Hub position highlighted to show the 2mm standoff gap between wheel face and motor flange.]

"Let's start with what this component actually does, because it's a little bit more than just a decoration."

"Job one: standoff. The wheel's shoulder needs to sit about two millimeters away from the motor shaft's shoulder — so the hub has a hex protrusion on the back that spaces it out. Job two: anti-rotation. Six pins on the back of the hub drop into the AndyMark wheel's hole pattern and lock the hub from spinning. Job three: retention. A ten-thirty-two screw through the center holds the hub on — and holds the wheel on the shaft."

"That's it. Everything we draw is in service of those three things."

---

[SCENE 2 — New part design open. File saved as Wheel Retaining Hub before any geometry.]

"New file — Part Design, Create New. And before I draw a single line, I'm saving. File, Save. I'm calling this the Wheel Retaining Hub and putting it in the correct project folder."

"I've got two reference files open in other tabs: the AndyMark wheel and a ten-thirty-two screw. We'll hop over to measure from both of those before we draw anything."

---

[SCENE 3 — Ten-thirty-two screw file open. Measure tool active. Two measurements taken.]

"Starting with the screw. Press I on your keyboard to open the Measure tool."

"First measurement — the screw shaft. Outside diameter of the threads is 4.998 millimeters. We need a clearance hole, so I'm using 5.8 millimeters — that's a comfortable slip fit."

"Second measurement — the screw head. Outside diameter is 9.153 millimeters. Head depth is 2.565 mm. For the counterbore, I'll go 9.5 mm wide and 3 mm deep. Write those three numbers down: 5.8, 9.5, and 3."

---

[SCENE 4 — Wheel Retaining Hub file. New sketch started on XY plane. Two circles drawn from the origin.]

"Back to our hub file. Start a new sketch on the XY plane. Using the circle tool, I'll draw two circles, both constrained to the origin."

"First circle: 5.8 millimeters. That's the clearance hole for the screw shank."

"Second circle: 9.5 millimeters. That's the counterbore — the recess the screw head will sit down into."

"Those two circles are our reference for the retention screw. Now we go measure the wheel."

---

[SCENE 5 — AndyMark wheel file open. Measure tool active. Two measurements: bolt circle diameter and individual hole diameter.]

"Over to the AndyMark wheel. Two things to measure here."

"First — the bolt circle. That's the diameter of the circle the six holes sit on. Press I, measure across the pattern. The bolt circle diameter is 1.875 inches. Notice Fusion is showing inches — that's what AndyMark used when they built this model, and that's fine. We'll let Fusion handle the conversion."

"Second — the hole diameter. Click one of the six holes. Diameter is 0.159 inches. Our pins need to be slightly smaller than that — enough to slip in without forcing. I want about a quarter millimeter of clearance, so: 0.159 inches minus 0.25 millimeters. Type that directly into the dimension field and Fusion will do the math — it comes out to 3.789 mm. That's our pin diameter."

"Write down three numbers: 1.875 inches, 0.159 inches, and 3.789 millimeters."

---

[SCENE 6 — Back in hub sketch. Construction circle drawn at 1.875 inches diameter. One pin circle drawn on the construction circle.]

"Back to our hub sketch. From the circle tool, draw a new circle from the origin and set it to 1.875 inches. Before you lock it in, switch it to a construction line in the Sketch Palette — this is a reference circle, not geometry we'll extrude."

"Now draw one non-construction circle, on the construction circle, anywhere on the circumference. Set its diameter to 3.789 millimeters. 

This is one pin — we'll pattern the rest in a moment."

---

[SCENE 7 — Circumscribed Polygon drawn. Construction line applied. H/V constraint shown. Dimension applied at 3/8 inch. Offset tool applied at -0.25mm.]

"Now the hex. Go to Create, Polygon, Circumscribed Polygon. Draw it out from the origin — make it a construction line, and make it slightly too large for now, we'll dimension it properly in a moment."

"Before adding the dimension, apply the Horizontal-Vertical constraint to one of the flats. This constrains the polygon so it can't rotate freely in the sketch."

"Here's a detail worth pausing on — I'm orienting the polygon so that one of its points faces straight up. That puts a point at twelve o'clock. And I'm aligning that twelve o'clock position with my pin circle from the last step. This matches the AndyMark wheel geometry, where one of the six holes lines up with a corner of the hex bore."

"Press D to dimension flat-to-flat. The wheel's hex bore is 3/8 inch — type that directly. Hit Enter."

"Now go to Modify, Offset. Click the construction polygon and type negative zero point two five. That's our 3-D-print clearance. The finished hex feature will be a quarter millimeter smaller than the wheel's bore — enough to slide in cleanly without slop. You'll check that when you're test fitting the parts.

---

[SCENE 8 — Circular Pattern dialog open in sketch. Pin circle selected. Center point set. Quantity set to 6.]

"Next the six pins. Go to Create, Circular Pattern. Select the pin circle, set the center point to the origin, and set the quantity to six. Fusion distributes them evenly."

"Take a look and confirm they're sitting on that construction circle — they should match the AndyMark hole pattern exactly."

"Last piece of sketch geometry — the outside of the hub. Draw a circle from the origin and set it to sixty millimeters. That gives us enough material to surround the pin pattern while keeping the hub proportional."

"Finish the sketch. Save."

---

[SCENE 9 — Extrude dialog. All profiles selected except the 5.8mm center hole. Extrude distance: 2mm.]

"First extrusion — the main disc body. Press E on your keyboard for Extrude."

"Click and drag to select all geometry, then deselect the 5.8 millimeter screw clearance hole. That through-hole runs the full depth of the hub — we don't want any material there."

"Set the distance to 4 millimeters and hit OK. The disc is done."

---

[SCENE 10 — Sketch made visible again. Extrude selects 6 pin circles and the offset hex polygon. Extrude direction: -2mm (back face).]

"Make the sketch visible again. Second extrusion — the pins and the hex insert."

"Press E and select the six pin circles and the hex polygon — these are the anti-rotation features that protrude into the back of the wheel. Set the distance to negative 2 mm. That sends them out the back face, toward the wheel."

---

[SCENE 11 — Extrude dialog. Start set to Object, outer face of disc selected. Bodies hidden. All profiles selected except center hole and 9.5mm counterbore ring. Extruded 2.5mm outward.]

"Third extrusion — the counterbore. Press E. This time, set Start to Object and click the outer face of the disc. That's where we're counterboring from."

"Now click Profiles. Hide the bodies so you can see the sketch clearly. Select the 5.8 mm center hole and the 9.5 mm counterbore ring."

Make your bodies visible again. 

Set the distance to -2.75 mm and hit OK."

"What you've built is raised bosses on the rear face and a 2.75 mm recess on the front face where the screw head sits. The screw drops in flush, the shank passes through the 5.8 hole, and the head is protected. Hide the sketch and inspect what you have."

---

[SCENE 12 — Fillet tool. Pin faces selected. Hex face selected. Fillet: 0.5mm applied. Final model rotated slowly.]

"Last step before the creative work — surface finishing. Go to Modify, Fillet."

"Click on all of the pin cylinder faces. Add the hex bore insert face as well. Set the radius to 0.5 mm. These chamfers ease the entry so the hub drops into the wheel without forcing — a small detail that makes a real difference when you're fitting it at the assembly table."

"Click OK. Spin the model. Check that everything looks the way you want it to. Hit Save."

---

## OUTRO

[SCENE 13 — Top face of the hub highlighted. New sketch started on outer face. Simple decorative geometry shown briefly. Circular pattern applied.]

"The functional design is complete. But this face —" [tap or indicate the front face] "— is yours."

"Start a new sketch on the outer face. Draw any geometry you want: a ring pattern, cutouts, flames, a robot name emboss, or a design that means something to you. If it makes sense, use the Circular Pattern to repeat it around the center and give the whole face a clean look."

"That's one approach — there are plenty of others. Pockets, raised features, organic shapes. The constraint is simple: don't compromise the counterbore or the outer edge, and make sure it still prints. Everything inside those limits is your call."

"Take the time to make it something you're proud of. This hub is what people see when they look at your robot's wheels."

[TITLE CARD — 5 sec]
C2 — Wheel Retaining Hub · Complete
Next: C3 — Motor Mount Sleeve
[Portfolio submission link / QR code]

---

## YouTube Description

C2 — Wheel Retaining Hub | Autodesk Fusion | HS Applied Engineering & Robotics

We design the wheel retaining hub for L.E.O.'s AndyMark 4" wheel. This component does three things: it spaces the wheel two millimeters off the motor, it uses a hex protrusion and six alignment pins to lock the wheel from spinning, and a single 10-32 screw retains everything on the shaft. The front face is left open for your own design.

We build the hub from a single sketch — using the Measure tool to pull dimensions directly from the wheel and screw reference files, a circumscribed polygon with Offset for the hex insert, and Circular Pattern for the six-pin bolt circle. Three targeted extrusions build the disc, the back-face features, and the counterbore in sequence.

**What you'll learn:**
- Measure tool: pulling dimensions from a manufacturer's model, including mixed inches-and-millimeter math in a single dimension field
- Construction lines as reference geometry for a bolt circle
- Circumscribed Polygon with Horizontal-Vertical constraint and Offset for a hex bore that fits a manufactured part
- Circular Pattern applied to a sketch profile for a six-hole bolt pattern
- Three-extrusion sequence from one sketch: disc body, back-face features, and counterbore boss
- Extrude from Object: building a counterbore by extruding around the recess rather than cutting into it
- Fillet on pin and hex faces for easier assembly fit

**Chapters:**
- 0:00 Introduction
- [0:00] Component overview — three jobs, one sketch
- [0:00] Measuring the screw — clearance hole and counterbore diameter
- [0:00] Sketch setup — counterbore circles
- [0:00] Measuring the AndyMark wheel — bolt circle and hole diameter
- [0:00] Construction circle and pin circle
- [0:00] Hex insert — Circumscribed Polygon, H/V constraint, Offset
- [0:00] Circular Pattern for six pins; outer circle
- [0:00] Extrusion 1 — disc body, 2mm
- [0:00] Extrusion 2 — pins and hex insert, -2mm
- [0:00] Extrusion 3 — counterbore boss, 2.5mm
- [0:00] Fillets and final inspection
- [0:00] Creative face design challenge

*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*
