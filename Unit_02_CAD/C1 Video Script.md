# Video Script — C1 Hub

---

## INTRO

[COLD OPEN — Full robot assembly, rotating slowly, 4 sec, no UI visible]

[TITLE CARD — 3 sec]
C1 — Wheel Hub
Autodesk Fusion · HS Applied Engineering & Robotics

[VERBAL — TTS]
"[excited] Your first project in this class starts right now! I'll introduce you to LEO, we'll look at our first component, and we'll build our first sketch."

[Intro Video]

---

## BODY

[Scene 0 — Full robot assembly, rotating slowly]

"This is [emphasis] L.E.O. — a Logic, Electronics, and Operations Platform — the robot you're building this year. [pause] LEO has four wheels, a deck, motors, and sensors — all of it comes from parts you'll design yourself in Fusion."

[SCENE 1 — Zoom to front wheel area, then isolate wheel + hub assembly]

"Your first component is the hub that mounts your front wheels on their axle. It's a small part, but it introduces some big features. [pause] Let's dig in."

"Here's the front wheel assembly. That large wheel with rollers is called an [emphasis] omni wheel — it can roll sideways as well as forward. The hub is what allows it to rotate freely on an axle."

"Let's look at the omni wheel first, because the decisions the manufacturer made are going to directly inform the decisions we make."

[SCENE 2 — Omni wheel alone, rotating. Then section view — body 1 hidden to reveal inner workings.]

"The omni wheel is actually two halves. Each half captures the shafts for these rollers."

"Each roller spins on its own small bearing. That's what allows lateral movement without the whole wheel having to slide."

"The two halves are held together with a [emphasis] counterbored screw that threads directly into the other half — no nut. The counterbore sinks the screw head flush so nothing protrudes. We're going to borrow that exact idea for our hub design."

[SCENE 3 — Omni wheel face-on, measurement callouts appearing as you speak]

"Let's take some measurements that we'll use to make our hub. Typing [emphasis] I on your keyboard opens the measurement tool."

"Let's measure the center bore — this is where our hub axle passes through. It's [emphasis] 8.0 millimeters. We'll be using an M8 bolt, which is also exactly 8mm in diameter."

"Clicking on any whitespace clears the measurements to prepare for the next. Clicking on two pieces of geometry displays measurements about their relationship."

"These screw holes sit on a circle pattern that's [emphasis] 16 millimeters in diameter — so 8mm from the center of the bore to the center of each hole. There are eight of them, evenly spaced."

"The screw holes are [emphasis] 3.6mm in diameter. These provide a [emphasis] clearance fit for M3 screws, meaning the screws will pass through the holes with no resistance. A typical clearance hole for an M3 screw is 3.4 to 3.6mm — we'll use [emphasis] 3.4mm."

"Around the center bore there's a shallow counterbore. That's designed to seat the manufacturer's own hub. We're making our own hub, so we're going to ignore it completely."

[SCENE 4 — M3 Socket Head Cap Screw isolated, rotating]

"This is the M3 socket head cap screw we'll use to mount the hub. Three dimensions matter to us right now."

"The [emphasis] thread diameter is 3 millimeters. Just like the omni wheel, our hub will need clearance holes — 3.4mm — so the screw passes through without threading into our part."

"[emphasis] Head diameter — about 5.5mm. We'll give it a [emphasis] 6mm counterbore so the head drops in cleanly with a little room."

"[emphasis] Head height — is 3mm. That becomes the [emphasis] depth of our counterbore. The goal is flush: the screw head sits exactly at the surface — not proud, not recessed."

"Later, the overall length of the screw will dictate the thickness of our hubs. [pause] You'll get very used to modifying the thickness of your parts to accommodate various screw lengths."

[SCENE 5 — Cross-section of installed wheel, bearing visible in context]

"Here's a cross-section of the wheel fully installed on the robot. You can see how the hub has two halves, held together with M3 screws."

"The final thickness of each hub keeps the screw from protruding outside of the hub. The overall length of the screw, minus the thickness of the wheel, determines the final thickness of the hubs."

"The bearings are pressed into the hub, and the axle runs through the bearings. The bearings are what allow the wheel to spin freely on a fixed axle — without them, the hub would just drag."

[SCENE 6 — Cross-section of hub alone, bearing visible]

"It's important to understand the parts of a bearing and how they work. Ball bearings have an [emphasis] outer race, an [emphasis] inner race, and rollers inside that the two races rotate about."

"The outer race may be firmly in contact with something stationary, like our hub. But care must be taken to avoid any contact with the inner race — otherwise the inner race won't rotate and our wheel won't spin."

"To do this, we'll ensure the final opening of our hub is greater than the OD of the inner race. The bearing we're using has an [emphasis] 8.0mm bore, [emphasis] 12mm OD, and it's [emphasis] 3.5mm thick."

"You can see it here pressed into each half of our hub, seated flush. The shoulder that the manufacturer made on the bore ensures the bearing's inner race won't touch it. We'll size the final opening of our hub at [emphasis] 9.3mm to ensure it also doesn't interfere with the inner race."

"The last concept to understand before we dive into the design is how the two halves work together. They're each essentially the same geometrically — they each retain a bearing, allow an 8mm shaft to pass through, and are attached to the wheel with M3 screws."

"[emphasis] The only difference is on one side the screws pass completely through. On the other side the screws have to dig in and hold everything together."

"To do this, we'll size the holes on the other side smaller so the screws [emphasis] tap — or cut — their own threads. We can do that because 3D printed plastic is soft enough to tap with a machine screw, and strong enough to hold it — as long as we don't overdrive the screws and tear out the threads."

"Tapping hole sizes can be looked up for each screw size and material type. For 3D printed plastic and M3 screws, we'll use [emphasis] 3.2mm. [pause] Remember that 3D printed holes will end up smaller than dimensioned, so we'll test this and adjust if needed."

[SCENE 7 — New design file open, sketch started on XY plane]

"Now we design. I'm going to build this entire hub from a [emphasis] single sketch — one set of geometry that we'll use to produce both halves."

"Let's start with a new file, part design. [long pause] It's a good habit to always start by saving the part file and telling it where it lives. [long pause]"

"I'm starting a sketch on the XY plane."

"First I'll draw a circle for the center bore. Single click the origin, drag it out, type [emphasis] 9.3 and hit Enter. [pause] The circle is constrained to the origin and its size is constrained by the dimension. This is the hole the axle passes through."

"Next we'll make the outer diameter of the hub. Same center, drag out — [emphasis] 25mm. This is the flange that sits against the omni wheel face."

[Scene 8]

"Now the mounting holes. Draw a circle — it doesn't matter where for now. Dimension its diameter: [emphasis] 3.4mm. Then dimension its center from the origin: [emphasis] 8mm. That places it on the 16mm bolt circle."

"Notice that the circle didn't turn black. That's because it still isn't [emphasis] fully constrained. If I grab it, I can move it side to side."

"I'll use the [emphasis] Horizontal/Vertical constraint tool to constrain the circle vertically with the origin. [pause] See how it turned black? Now it's fully constrained."

"Next I'll use the circular pattern to make more mounting holes. From the Sketch menu, select [emphasis] Circular Pattern. The tool first wants you to define the geometry for the pattern."

"Select the circle, then designate the center point of the pattern at the origin. Update the quantity to [emphasis] 4 and click OK. [pause] You now have four evenly spaced mounting holes."

"Because the first hole is the template for the pattern, you could adjust the size of that circle later and all of the circles will update automatically."

[Scene 9]

"Now the counterbores for the screw heads. I could have drawn these at the same time as the clearance holes and patterned both together — that would be more efficient. But I'm doing them separately on purpose, because the repetition is good practice."

"New circle, concentric with the first clearance hole — [emphasis] 6mm. Circular pattern again, 4, 360. [pause]"

[SCENE 10 — Sketch: bearing pocket]

"The last feature is the bearing pocket. The bearing is [emphasis] 12mm OD. If I draw exactly 12mm, what happens when I print it?"

"[emphasis] 3D printed parts have a problem with holes. The printer deposits molten filament in a ring, and that ring slightly encroaches inward as the printing continues. A 12mm hole prints closer to 11.6 or 11.7mm — tight enough that the bearing won't go in at all."

"What is the right size then? Earlier I mentioned [emphasis] clearance fit when I was making the bolt holes. But I don't really want the bearing to just slip in and out."

"For this one, we need it loose enough to press in by hand, but tight enough so it doesn't fall out. This is known as an [emphasis] interference fit."

"For most 3D printing, I use a cushion of [emphasis] 0.25mm on the diameter for a bearing pocket. 12mm plus 0.25mm equals [emphasis] 12.25mm. [pause]"

"You're going to print this part and evaluate the fit of all the holes. After testing, you'll dial in a cushion dimension that works for our printers."

[Scene 11]

"Now that we have a bunch of dimensions on this sketch, you'll notice that periodically you may need to rearrange them so they're easy to read. Take some time and make your sketch dimensions look nice. Center the number on the callout line and separate the dimensions so they don't overlap."

[Scene 12]

"The sketch is complete. Everything is constrained — as evidenced by the black lines. I have an outer flange, four clearance holes, four counterbores, and a bearing pocket. Click [emphasis] Finish Sketch."

"Next I'll extrude the main body and cut the counterbores and the bearing pocket. This is where we have to start making some decisions about [emphasis] thickness."

"On the bolt head side of the hub, we have to account for the depth of the bearing and the depth of the bolt heads. On the tap side, we need the depth of the bearing plus enough material to keep the end of the bolts from protruding."

"The overall length of the bolt is [emphasis] 23mm. The wheel is [emphasis] 10mm thick, so we only have [emphasis] 13mm to divide between the two hub halves."

"Since the bearing is 3.5mm thick and the bolt head is 3mm deep, we need a minimum of [emphasis] 6.5mm to accommodate those two features. Let's start there and see how it looks."

"I hit [emphasis] E on my keyboard to open the extrude tool. I select all geometry except for the clearance holes for the bolts. I enter [emphasis] 6.5mm for the extrude thickness and click OK. [long pause]"

"Next I want to cut counterbores, but my sketch disappeared when I finished extruding. I need that sketch geometry to make more extrusions, so I'll make it visible again by finding it in the browser tree and clicking the eyeball next to it."

"Now that the sketch is visible, I'll open the extrusion tool again by pressing E. Select the counterbore circles, type in a depth of [emphasis] 3mm and click OK. [long pause]"

"You might also notice that some geometry is inaccessible because a body is blocking it. Either rotate your model to get sketch access, or temporarily hide the body by deselecting it in the browser tree."

[Scene 13]

"Lastly I want to cut my bearing pocket. This one is a little tricky because I want to start the extrusion from somewhere other than the original sketch plane."

"Start the extrusion tool. This time use an [emphasis] object to define the start point. Click on the top face of the hub, then switch to the profile selector and pick your bearing pocket geometry. [long pause]"

"Enter the extrusion distance. You may need to make this number [emphasis] negative in some situations to ensure it cuts instead of creating material. You can always grab the blue arrow and drag to figure out the sign, then enter the number."

"For the bearing we'll use a depth of [emphasis] negative 3.5mm. [pause] Our extrusions are complete — hide your sketch again and inspect your work."

"You can see that [emphasis] 6.5mm overall thickness was just a little short, leaving some gaps. I think I can make this side a little thicker than the other side. Let's try it."

"They were both going to be 6.5, but I'll make this side [emphasis] 7.5. On the timeline at the bottom, open your first extrusion — the one where we made our base piece of material. You can right-click and select Edit Feature, or just double-click on it."

"My distance is already highlighted, so I'll just type in [emphasis] 7.5 and hit Enter. [pause] Those gaps are now gone and my part will be stronger. [pause] I just have to remember that the other hub will be [emphasis] 5.5mm thick."

[Scene 14]

"Making multiple extrusions from one sketch is a little nuanced, but the end result is one [emphasis] single sketch containing all of the geometry and dimensions. That means just one place to go make changes when you find out one of your holes is too small."

"Now I'm going to show you a trick that will allow you to make the other half of the hub using the sketch we already made. Not only will this speed up the process — the new part will [emphasis] literally be dependent on the sketch from the first part."

"So any changes you make in the first part will [emphasis] automatically update in the second part."

"Before I start, I'll update my sketch to include the [emphasis] 3.2mm holes needed for tapping our bolts. [long pause]"

"For the next step we will [emphasis] derive a new part from the sketch in this one. From the Create menu, select Derive. Since I'm only interested in the sketch, I'll make Sketch 1 visible and then select it. Notice that Sketch 1 shows up in the derive dialogue. Click OK. [long pause]"

"Notice a new part has been created. I'll save it first, giving it a new meaningful name — [emphasis] Wheel Hub Tap Side. Don't forget to specify the right folder. [long pause]"

"Now I'll make the sketch visible and build my extrusions. I'll start with the main body, which we decided would be [emphasis] 5.5mm."

"To do this in a lot fewer clicks, I'm going to hold the left mouse button and drag a selection box across all the geometry. [pause] Now I single-click just my bolt holes to deselect them, type [emphasis] 5.5 and hit Enter."

"Then I'll cut my bearing pocket — [emphasis] 3.5mm deep. [long pause] Hide the sketch and inspect your part!"

---

## OUTRO

[VERBAL — TTS]
"[excited] Your first component is done — and with a bonus, we made two. You have a fully constrained sketch and you understand why every dimension is what it is."

"Before the next video, screenshot your sketch and your two extruded parts and get it in your portfolio."

"Next up — we export C1 out of Fusion, drop it into Bambu Studio, and set it up for print. That's where your dimensions get tested against reality. [pause] Let's go."

[TITLE CARD — 5 sec]
C1 — Wheel Hub · Complete
Next: Export & Slicing
[Portfolio submission link / QR code]

---

## YouTube Description

C1 — Wheel Hub | Autodesk Fusion | HS Applied Engineering & Robotics

We design the first component of L.E.O. — the wheel hub that mounts our omni wheels on their axle. Before touching Fusion, we reverse-engineer the omni wheel to understand every design decision. Then we build a single sketch that produces both hub halves, extrude and cut all features, and use the Derive tool to link the second part to the first — so any change you make updates both automatically.

This is a real part for a real robot. Every dimension has a reason.

**What you'll learn:**
- How to read an existing part and extract design requirements from it
- Clearance holes, counterbores, and tapping holes — when to use each
- Ball bearing anatomy and how to size a bearing pocket for 3D printing
- Press fit, slip fit, and interference fit — defined and applied
- Circular Pattern, Derive, and editing existing features in the timeline
- Why 3D printed holes print smaller than designed — and how to compensate

**Chapters:**
- 0:00 Introduction — L.E.O. and the wheel hub
- [0:00] Omni wheel — structure and section view
- [0:00] Measuring the omni wheel
- [0:00] M3 screw geometry — three dimensions that drive design decisions
- [0:00] Cross-section of the installed wheel
- [0:00] Ball bearing anatomy — inner race, outer race, why clearance matters
- [0:00] Hub design concept — two halves, clearance side vs. tap side
- [0:00] Starting the sketch — center bore and outer flange
- [0:00] Mounting holes and Circular Pattern
- [0:00] Counterbores
- [0:00] Bearing pocket — interference fit and 3D printing cushion factor
- [0:00] Extruding the main body
- [0:00] Cutting counterbores and bearing pocket from a different start face
- [0:00] Editing an existing feature — parametric revision in the timeline
- [0:00] Derive — creating the tap-side hub from the same sketch

*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*
