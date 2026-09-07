# Video Script — DBL C1: Reverse Engineering the 608 Bearing
**YouTube:** https://youtu.be/jgspRKjkanY
**Lesson:** First CAD Drawing — Design & Build Lab  
**Tool:** Fusion 360  
**Output:** 608 bearing model ready for fidget spinner assembly  
**Estimated video length:** ~35–40 minutes

---

## Before You Record

Open on your screen:
- McMaster-Carr 608 bearing drawing (the part page with the engineering drawing view open)
- Fusion 360, blank session ready

Key values to have visible or memorized:
- OD: 22mm · ID: 8mm · Width: 7mm · Ball diameter: ≈4.762mm

---

## SEGMENT 1 — Examine the McMaster-Carr Cross Section
*~2–3 min · No Fusion yet*

**Say:**
> "Today we're modeling the bearing that you'll be using for your fidget spinner project. Before we model anything, we're going to look at the engineering drawing and the CAD model provided by McMaster-Carr. By modeling this component yourself, you should get a better understanding of how it works, and how it fits in your 3d printed part."

**Point out and narrate:**
- Let's take a look at that drawing. I pulled it from the product details page on their website. It calls out the OD, ID, and the width. Write these down on your scratch pad: ID 8mm, OD 22mm, width 7mm
- This is the CAD model that I downloaded from the McMaster-Carr website. Whenever we buy components from this vender, we can just download the part model. That allows us to test fit the part in our design before we even buy it.
- Every bearing contains an outer race, inner race, and ball bearings. You can see an inner structure that keeps the balls spaced apart. 
- This is a cross-section view--a half-profile showing the race geometry. This groove is for adding a shield or a seal to keep out dirt.
- The ball groove is a concave arc on both the inner and outer race
- The bearing has vertical and horizontal symmetry, we'll take advantage of that to recreate the part.
- Our strategy will be to create these two rectangles, add lines to create this goove, and then dimension everything from the origin
- There are six circles present here: 1, 2, 3, 4, 5, 6. We'll measure each radius, and write it down on our scratch pad. We already know two of them from the first drawing we looked at. 
- Then we'll add their vertical dimensions from the origin. Once we have that geometry locked in, we'll add the ball groove, and then use the revolve tool to create the solids for the inner and outer races all at the same time.
- Finally, we'll measure the chamfers and fillets and finish the edges on our part. 


**Key teaching point:**
> "This is called reverse engineering — the part already exists, we're capturing its geometry in a CAD model so we can design around it. Engineers do this all the time with purchased parts like fasteners, bearings, and motors when the vendor doesn't supply the CAD model."

---

## SEGMENT 2 — Create Part, Save, New Sketch
*~1–2 min*

**Steps (narrate each one):**
Let's get started.
1. File → New --> Part Design --> Create New
2. Save → name it `608_Bearing` → save to your project folder
3. Sketch → Create Sketch → click the **front plane** because we want to see the cross-section facing us

---

## SEGMENT 3 — Draw Two Rectangles (Inner and Outer Race)
*~3–4 min*

**Setup:**
> "We're drawing the right half of the cross-section only. The vertical origin axis is the axis of revolution. Everything we draw will be to the right of it. I'm going to use the origin as the datum, measuring everythin from it."

**Steps:**
1. Start with a two-point rectangle--that's the default rectangle type when you select the rectangle tool.
2. **The First rectangle is the inner race:**
   - Click roughly at the horizontal origin, drag up and to the right until the dimensions show roughly 7 tall by 2 wide--not perfect just close
   - Don't dimension yet — just sketch the approximate shape
   - Draw a second rectangle for the outer race to the right of the first, same height, leaving a small gap between them for the ball groove

> "Notice Fusion is adding constraints automatically as I draw. Those small gray icons are constraint markers — vertical, horizontal so far. It's trying to help you stay organized. Let's add a couple more. Hit the escape key to clear any selections. I hit that keys several times out of habit. Use the conincident constraint to constrain the bottom lines of the rectangles to the origin.

Now use the line tool to create the shield groove. Add four lines. We'll make it on the top of the bearing, and then mirror it for the bottom. We're just making the shape, no dimensions yet. Now trim the parts we don't want.

Now I'll add a horizontal centerline to mirror the groove. Line tool, switch to construction line type so it doesn't affect my solids, start on the left and look for the midpoint to appear. click and finish on the other side. Now select the mirror tool from the create menu, select the four groove lines, select the mirror line, click ok.

## SEGMENT 4 — Measure Six Radii, Dimension the Sketch
*~4–5 min*

> "Now we go back to the McMaster part file and measure the six radii I mentioned earlier. Get your pencil ready and write these down on your scratch pad. I'll work from the origin - out, measuring the main features, not their fillets or chamfers.


| # | Feature | Measured value (from drawing) |
|---|---------|-------------------------------|
| 1 | The inner race bore is 8mm so the radius is 4mm. Remember the radius is the distance from the center of the bearing, which is our origin.
| 2 | The Inner race outside edge radius is 6.577mm
| 3 | The Outer race inside edge is 8.423mm
| 4 | The outside edge of the shield groove is 8.549mm
| 5 | The inside of the shield groove is 9.282mm
| 6 | The Outer race Outside Diameter is 22mm so the radius is 11mm 

Go back to your drawing
1. Press **D** for Sketch Dimension
2. Click each vertical in the sketch and then the origin and type the corresponding radius value
3. After each dimension, verify the geometry snaps correctly and turns black indicating it is constrained
4. Take a moment to organize your dimensions. They should all be outside of the sketch geometry, and ordered from smallest to largest so they have a nested appearance.

Back to the McMaster file, let's get our vertical dimensions, there are three.
Bottom of the bearing to the bottom of the top groove is 6.65mm
Bottom of the bearing to the top of the groove is 6.776mm
And finally the overall height of the bearing is 7mm. I measured all of these from the bottom of the bearing, so back in my sketch I'll make all of these dimensions from the bottom line, which is also at the origin.



Finally I'll add the ball groove. The bearing balls don't press flat against the races — each race has a concave groove, called the ball groove or raceway, that cradles the ball. Back in the McMaster model I see the diameter of the ball groove is 3.803mm. So I'll make a 3.803mm circle constrained to the midpoint of this centerline, and that puts it right in the middle where it belongs. Use the trim tool again to remove what I don't want.

5. **Finish Sketch** (green checkmark or press Escape)

---

## SEGMENT 5 — Revolve
*~2–3 min*

Now let's use the revolve tool to make this sketch 3 dimensional. 
1. go to the create menu and select Revolve.
2. Select the **sketch profiles** and click on each closed region in the sketch--the inner and outer races.
3. Switch to axis selection and click the vertical origin axis
4. Click OK


The sketch rotates 360° around the centerline — and we get a 3D model of the bearing races. That's the power of the Revolve tool: we drew a 2D cross-section, and the tool created the full solid of revolution. Any shape that's rotationally symmetric — a bottle, a wheel, a shaft, a bearing — can get modeled this way.

Just a few finishing touches and we're done. Let's add the chamfers and fillets — the small angled and rounded edges on the real part."

---

## SEGMENT 10 — Measure and Apply Chamfers
*~5–6 min*

**Say:**
> "Chamfers are the small angled cuts on the sharp edges of the bearing. They prevent stress concentrations and to make it easier to press the bearing into its seat. On our model we'll chamfer four edges."

**Measure from McMaster drawing (demonstrate Measure tool or read from print):**
"I'm going to use Fusion's Measure tool to find the chamfer dimensions on our reference. A chamfer has an angle and a length."

Measure the chamfer on the outer race. Click on the chamfer face to measure the angle. It measures 90 degrees. But notice that's measured to the chamfer on the opposite side of the bearing, so the angle from the origin is actually 45 degrees. Now measure the distance from the outside edge to the inside edge of the chamfer. 0.35mm

The chamfer on the inner bore looks the same, but we'll measure it to be certain. It's a little tricker because they have a chamfer and then a fillet. I'll start by measuring the face, and that confirms the angle for this one is the same as the other. I know the inside radius of the bore is 4mm, so I can just measure the radius of the outer edge of this chamfer, and subtract 4mm to get the distance, which comes to 0.35mm. Confirmed, the two chamfers are the same. Using the same tool I'll measure these fillets. The inner bore fillet radius is 0.263mm. These others are 0.032. Write those numbers down. Chamfers are 0.35mm at 45 degrees. Fillets are 0.263 and 0.032.

Switch back to my new part. Four edges get the chamfer. Select the chamfer tool from the modify menu. Select the four edge lines — two at the bore, two at the outer diameter. Type in the distance of 0.35mm. Notice the type modifier is set to equal distance. That means it will chamfer 0.35mm in and down, which results in a 45 degree angle. You can switch that to distance and angle and see that you get the same result when you leave the angle at the default value of 45 degrees. Its good to know that's there in case you need a different angle in the future.

Now select the fillet tool from the modify menu. Select the two inside edges of the chamfer on the center bore, type in 0.263. Click the plus symbol to add another, selectfour more edges from the shield groove, type in 0.032 and hit enter.


## SEGMENT 12 — Final Save
*~1 min*

**Say:**
> "We'll skip the roller balls for now, they're a little more complex that what you need for your fidget spinner model. Be sure to save your work. The timeline at the bottom should show: a New Sketch, Revolve, Chamfers, and Fillets. That timeline is your full history — and we kept it pretty simple. If you need to modify dimensions, you can edit any of those features.


> "That's the 608 bearing — reverse engineered from McMaster-Carr's drawing into a Fusion model you made yourself. This model will go into your fidget spinner final assembly. Next lesson, we'll start designing the fidget spinner body."

---

## Notes for Recording

- **Pause before each major tool** — give students a beat to follow along
- **Name the shortcut key** every time you use one (R, L, C, D, T, Escape) — some students will be watching only
- **Zoom in** before demonstrating constraints, chamfers, and fillets — they're small and easy to miss
- **The constraint delete demo** (Segment 4) is the highest-value teaching moment — go slow, show the constraint icon, show the delete, show the before/after
- **The datum connection** (Segment 8) is worth a brief pause — this concept reappears in every future drawing
- **Don't worry if dimensions differ slightly** from these notes — read from the actual McMaster drawing on screen so students see the source

---

## YouTube Description

C1 — 608 Bearing (Reverse Engineering) | Autodesk Fusion | Design & Build Lab

We reverse engineer the 608 bearing — the standard skateboard bearing at the center of your fidget spinner — directly from McMaster-Carr's engineering drawing. Instead of extruding two circles, we draw the full cross-section profile, dimension it from the manufacturer's specs, and use the Revolve tool to create both races in one step. Then we add chamfers and fillets to match the real part's edge geometry.

This is how engineers model purchased components — every dimension comes from a real source, and the model goes straight into your assembly.

**What you'll learn:**
- How to read an engineering drawing and extract dimensions from it
- The Revolve tool — sketching a cross-section and spinning it 360°
- Why you draw only the top half and let Revolve handle symmetry
- Construction lines and the Mirror tool for symmetric geometry
- Identifying and deleting auto-added constraints that fight your sketch
- Dimensioning from the origin as a datum — the same concept used in GD&T
- Chamfer vs. fillet — what each does, when to use each, and why order matters
- Bearing anatomy: inner race, outer race, ball groove, raceway arc

**Chapters:**
- Introduction — what is reverse engineering?
- Examining the McMaster-Carr drawing — OD, ID, width, tolerances
- New part, save, create sketch on the front plane
- Drawing the two rectangles — inner race and outer race
- Relief cut on the outer race — lines and arc
- The colinear constraint problem — how to find it and delete it
- Construction centerline and Mirror — creating the bottom groove
- Ball circle — dimensioning by diameter, trimming to profile
- Measuring and dimensioning 6 radii from the drawing
- 3 horizontal dimensions from the origin (the datum concept)
- Fully constrained — what it means and how to confirm it
- Revolve — selecting profiles and axis, 360° full revolution
- Chamfers — measuring from the drawing, applying to 4 edges
- Fillets — 3 radii, 6 edges, why chamfers come first
- Save and review the finished model

*Part of the Design & Build Lab curriculum at Vicksburg Community Schools.*
