# Video Script — C1 Export, Slice & Print

---

## INTRO

[COLD OPEN — 3 sec, C1 solid body rotating in Fusion, clean background, no UI]

[TITLE CARD — 3 sec]
C1 — Export, Slice & Print
Autodesk Fusion · Bambu Studio · HS Applied Engineering & Robotics

[VERBAL — TTS]
"C1 is modeled. [pause] Now we get it out of Fusion, into the slicer, and onto the printer. This video is short — the slicer is just a middleman. What matters is what happens after the print comes off the bed. [pause] Let's go."

---

## BODY

[SCENE 1 — Fusion, C1 body selected in browser tree]

"In Fusion, right-click the body in the browser tree and select [emphasis] Export. Set the type to [emphasis] 3MF and click Export. By default the file will go to your download folder."

"Why 3MF over STL? It carries more information and handles curved surfaces more cleanly. [pause] Bambu Studio prefers it."

[SCENE 2 — Bambu Studio open, file dragged onto build plate]

"Open Bambu Studio and select the Prepare tab at the top. In the toolbar, click the add icon, [pause] and then navigate to your downloads folder and find your component file. Double click the file, [pause] or you can drag the file onto the build plate. [pause] Because we are using the 3mf file type, Bambu Studio wants to know how many colors you plan to print with. For now, just leave it at the default of 1. Take a moment to get familiar with the environment. You can pan by clicking and dragging with the right mouse button. You can rotate and tilt by clicking and dragging with the left mouse button. The scroll wheel is used for zooming in and out. You can click and drag you part file around on the build plate. Note that the origin is at the front left corner of the build plate."

"One decision matters most here — [emphasis] orientation. This part has overhangs on both sides. What that means [long pause], for example, [long pause] is that it will print the bearing pocket, but when it gets to the bottom of the pocket, that layer will print with nothing under it and those layer lines will sag, which [sad]isn't pretty. Shorter overhangs are manageable, so for [emphasis]this part, we'll try printing it with the bolt counterbores facing down."

"The easiest way to flip this part over is with the lay flat tool. Make sure your part is selected, click on the lay flat tool, and then click on the face that you want to be facing the build plate. Look closely as I click the top face and you can see the part is flipping. Leave the bearing side up."

"Repeat the previous steps to export the other half of your hub, put it on the build plate, and orient it properly."

[SCENE 3 — Settings panel visible, printer and filament dropdowns highlighted]

"Before you slice, you need to confirm three settings at the top of the screen — [emphasis] printer, [emphasis] filament, and [emphasis] process. These tell Bambu Studio exactly what hardware and material you're working with."

"The [emphasis] printer dropdown is on the left. Click it and select the profile that matches the printer you're using. [long pause] There are profiles for each of our printer models — make sure you pick the right one, because nozzle size and bed dimensions are different between them."

"Next is the [emphasis] filament dropdown. Select the profile that matches the material loaded in that printer. [long pause] If you're not sure what filament is loaded, check the spool or ask before you print — wrong filament settings can ruin a print or damage the printer."

"The [emphasis] process profile is on the right. This is the class profile for this type of print. Select the one labeled for this class. [long pause] It already has layer height, infill, and support settings dialed in — [soft] don't change them unless you have a specific reason and you've checked with me first."

"With all three set, click [emphasis] Slice. [long pause] Review the preview — you're looking for clean layers and no unexpected support material inside the bearing pocket or counterbores. If something looks wrong, check your orientation first."

"Click [emphasis] Send to Printer and confirm the job. [long pause]"

"While it prints — let's talk about what you're going to do with it."

[SCENE 4 — Physical bearing, M3 screw, and calipers on desk]

"When the print comes off the bed, you have [emphasis] three tests and a measurement log to complete."

"[emphasis] Test one — bearing fit. Press your bearing into the pocket. Does it go in with light pressure and stay put? That's your target. If it won't go in, your pocket is too small — increase the cushion dimension. If it falls out, it's too large — decrease it."

"[emphasis] Test two — axle clearance. Pass an M8 bolt through the center bore. It should spin freely with no wobble. [pause] 9.3mm is your slip fit target."

"[emphasis] Test three — screw clearance. Drop an M3 screw through the clearance holes. It should pass through with no resistance. [pause] If it threads in, your hole is too small."

[SCENE 5 — Deliverable table shown on screen]

"For each test, you record what you designed, what you [emphasis] actually measured with calipers, what happened, and what you changed. [pause] That log is your deliverable for C1."

"Here's what the table looks like. [long pause]"

"Fill in [emphasis] every row. If a fit didn't work, note the change you made and print again. [pause] Iteration is the job — one print is rarely the answer."

---

## OUTRO

[VERBAL — TTS]
"Export, slice, print, measure, iterate — [pause] that's the loop you'll run on every component. C1 is your first pass at it."

"Completed iteration log goes in your portfolio. Before the next video, your bearing should fit."

"Next up — [emphasis] C2, the drive wheel. Hex bore, circular spokes, your first real design choice. [pause] Let's go."

[TITLE CARD — 5 sec]
C1 — Export, Slice & Print · Complete
Next: C2 — Drive Wheel
[Portfolio submission link / QR code]

---

## YouTube Description

C1 — Export, Slice & Print | Autodesk Fusion · Bambu Studio | HS Applied Engineering & Robotics

C1 is modeled — now we get it into the printer. We export from Fusion as a 3MF file, orient the part correctly in Bambu Studio, and send it to print. Then we test the real print against our design dimensions and record everything in an iteration log. This is the loop you'll run on every component: design, print, measure, adjust.

**What you'll learn:**
- How to export a part from Fusion as a 3MF file
- Why print orientation affects hole quality
- How to measure a printed part with calipers and compare to design intent
- How to evaluate bearing fit, axle clearance, and screw clearance
- How to record design changes in an iteration log

**Chapters:**
- 0:00 Introduction
- [0:00] Exporting from Fusion — Save as Mesh, 3MF format
- [0:00] Bambu Studio — import, orient, and slice
- [0:00] The three tests — bearing, axle, and screw
- [0:00] Filling out the iteration log

*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*

---

## DELIVERABLE TABLE

*Display on screen during Scene 5. Students fill this in after printing.*

| Dimension | Designed | Measured | Result | Change Made |
|-----------|----------|----------|--------|-------------|
| Center bore | 9.30mm | | Slip / Tight / Loose | |
| Outer diameter | 25.00mm | | | |
| Bearing pocket | 12.25mm | | Fits / Won't go in / Falls out | |
| Counterbore diameter | 6.00mm | | | |
| Overall thickness | 7.50mm | | | |
| Clearance hole | 3.40mm | | Pass / Threads in | |
| Tap hole | 3.20mm | | Catches / Strips / Won't catch | |
