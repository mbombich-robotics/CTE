# Video Script — DBL C1: Reverse Engineering the 608 Bearing
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
> "Before we model anything, we look at what we're modeling. This is the engineering drawing for the 608 bearing from McMaster-Carr. Every measurement we need is on this drawing — we don't guess, we read it."

**Point out and narrate:**
- The cross-section view (the half-profile showing the race geometry)
- OD, ID, and width callouts
- The fillet radii labeled on the races (the small rounded transitions)
- The chamfer callouts — note the angle and the distance
- The ball groove — a concave arc on both the inner and outer race
- "Notice the drawing is symmetric top-to-bottom — we'll model only the top half and let the Revolve tool create the other half."

**Key teaching point:**
> "This is called reverse engineering — the part already exists, we're capturing its geometry in a CAD model so we can design around it. Engineers do this constantly with purchased parts: fasteners, bearings, motors. If you don't model it, you're guessing at tolerances."

---

## SEGMENT 2 — Create Part, Save, New Sketch
*~1–2 min*

**Steps (narrate each one):**
1. File → New Design (or Ctrl+N)
2. Browser → right-click Components → New Component → name it `608_Bearing`
3. Activate the component (click the radio button next to it)
4. File → Save → name it `608_Bearing` → save to your project folder
5. Sketch → Create Sketch → click the **front plane** (XZ plane — the vertical plane, because we want to see the cross-section facing us)

**Say:**
> "We save first, before doing any work. Fusion autosaves, but saving gives us a named file in the right place."

> "We're drawing on the front plane because the revolve axis will be horizontal — the center bore of the bearing runs left-to-right. Our cross-section sketch will sit in this plane, and when we revolve, it'll spin around that horizontal axis."

---

## SEGMENT 3 — Draw Two Rectangles (Inner and Outer Race)
*~3–4 min*

**Setup:**
> "We're drawing the top half of the cross-section only. The horizontal line at y=0 is the axis of revolution. Everything we draw will be above it."

**Steps:**
1. Press **R** to activate Rectangle (2-Point Rectangle)
2. **First rectangle — inner race:**
   - Click roughly at the origin, drag up and to the right
   - Draw a rectangle in the upper-left of the sketch area
   - Don't dimension yet — just sketch the approximate shape
3. **Second rectangle — outer race:**
   - Draw a second rectangle to the right of the first, same height, leaving a small gap between them for the ball groove
   - The two rectangles represent the cross-sections of the inner race and outer race

**Say:**
> "Both rectangles will eventually be dimensioned to exact values — inner race height is half the bearing width (3.5mm), and the two widths combined with the ball groove gap will equal the full radial depth. Right now I'm just establishing the topology — the sketch doesn't need to be right-sized yet, just right-shaped."

> "Notice Fusion is already adding constraints automatically as I draw. Those small orange icons are constraint markers — vertical, horizontal, coincident. It's trying to help you stay organized."

---

## SEGMENT 4 — Relief Cut on Outer Race, Trim, Colinear Constraint Issue
*~5–6 min*

**Setup:**
> "The bearing balls don't press flat against the races — each race has a concave groove, called the ball groove or raceway, that cradles the ball. On the inside face of the outer race, we need to cut a small relief — an arc that matches the ball's curvature."

**Steps:**
1. Press **L** to activate Line tool
2. Draw two short angled lines on the **inner face of the outer race** (the left edge of the right rectangle) to block out the relief cut shape — a notch that the arc will be trimmed into
   - Two short lines angling inward from the top and bottom of that edge
3. Press **C** for Circle (or use the arc tool) to draw the relief arc in the notch
4. Press **T** for Trim — trim away the original edge line between the two angled lines

**Demonstrate the Colinear Constraint issue:**
> "Watch what happens when I try to trim this. Fusion added a Colinear constraint between these two line segments — it's treating them as part of the same continuous line, which means trimming one removes the geometry I want to keep."

**Show how to delete a constraint:**
1. Click on the colinear constraint marker (the small orange symbol on the sketch)
2. Press Delete
3. Now retry the trim — it works

**Say:**
> "This is one of the most common sketching issues beginners hit — Fusion tries to be helpful by adding constraints automatically, and sometimes those constraints fight what you're trying to do. The fix is: identify the constraint, select it, delete it. Don't fight the trim tool — fix the constraint first."

---

## SEGMENT 5 — Centerline and Mirror the Relief Cut
*~3–4 min*

**Steps:**
1. Press **L** for Line
2. In the Sketch Palette (right side panel), check **Construction** — this makes the line a reference/centerline that doesn't contribute to the solid body
3. Draw a **horizontal construction line** through the center of the sketch, along y=0 (or through the midpoints of both rectangles if they're not yet on the axis)
4. Select the relief cut geometry (the two angled lines and the arc)
5. Sketch menu → **Mirror** → select the centerline as the mirror line → confirm

**Say:**
> "The construction line acts as our mirror axis. Because the bearing is symmetric — the ball sits exactly in the middle — the bottom groove is identical to the top groove, just flipped. Mirror saves us from re-drawing it and guarantees it's exactly symmetric."

6. Trim away the leftover edge where the mirrored geometry overlaps the original rectangle edge

---

## SEGMENT 6 — Ball Circle: Sketch, Dimension, Trim
*~3–4 min*

**Steps:**
1. Press **C** for Circle
2. Click on the **centerline** (construction line) as the center — snap to the midpoint between the two rectangles on the centerline
3. Draw a circle — this represents the cross-section of one bearing ball
4. Dimension the circle: **Sketch → Sketch Dimension (D)** → click the circle → type the ball diameter
   - Ball diameter: **≈ 4.762 mm** (from the McMaster drawing — confirm your value)
   - Or use the radius: 2.381 mm

**Say:**
> "The ball sits between the two races, rolling in those groove profiles we just drew. In the cross-section, the ball appears as a circle. We'll use this circle to trim the groove arcs to the correct depth — the groove should match the ball's curvature."

5. Adjust the radius of the relief arc (if needed) to match the ball radius — dimension it now using the measure tool or direct dimension
6. Trim the portions of the rectangles that overlap with the ball circle (both the inner and outer rectangle edges where the ball would intersect)

**Say:**
> "After trimming, the circle is also a construction line — or we leave it as reference — since we're not revolving the ball. The ball groove profile in the races is what we keep."

---

## SEGMENT 7 — Measure Six Radii, Dimension the Sketch
*~4–5 min*

**Say:**
> "Now we go back to the McMaster drawing and read off all the radii. These are the curved transitions in the cross-section — the fillets and groove arcs. I'm going to use Fusion's Measure tool to check each one on the reference drawing... actually, we're reading them directly from the McMaster-Carr print."

**Switch to McMaster-Carr drawing. Point to and read each radius:**

| # | Feature | Measured value (from drawing) |
|---|---------|-------------------------------|
| 1 | Inner bore edge — chamfer start radius | _____ mm |
| 2 | Inner race ball groove (raceway) arc | _____ mm |
| 3 | Inner race outer shoulder transition | _____ mm |
| 4 | Outer race inner shoulder transition | _____ mm |
| 5 | Outer race ball groove (raceway) arc | _____ mm |
| 6 | Outer race OD edge — chamfer start | _____ mm |

**Back in Fusion:**
1. Press **D** for Sketch Dimension
2. Click each arc in the sketch → type the corresponding radius value
3. After each dimension, verify the geometry snaps correctly and stays black (constrained)

**Say:**
> "Notice I'm dimensioning radii, not diameters. The dimension tool on a curved line defaults to radius — which is what we want, because the drawing lists them as radii too. If it shows a diameter, click the little toggle in the dimension dialog to switch to radius."

---

## SEGMENT 8 — Measure Three Horizontal Dimensions from Origin
*~3–4 min*

**Say:**
> "The horizontal dimensions tell us where everything sits radially — how far each feature is from the center axis. Think of it like this: the origin is the center of the bearing shaft, and every distance we measure from there is a radius."

**Connecting to drafting concepts:**
> "In formal engineering drawing, this is exactly what a datum is. The datum is the reference point — usually an edge, a surface, or the center axis — from which all other measurements are made. Here our datum is the centerline of the bearing. Dimensioning from the origin is the same strategy."

**Measure on the McMaster drawing:**

| # | Feature | Distance from center axis |
|---|---------|--------------------------|
| 1 | Inner bore radius | 4.0 mm (= ID/2 = 8mm/2) |
| 2 | Ball center radius | _____ mm (from drawing) |
| 3 | Outer race OD radius | 11.0 mm (= OD/2 = 22mm/2) |

**In Fusion:**
1. Press **D** for Sketch Dimension
2. Click the vertical edge or point → click the origin (or the Y-axis line) → type the distance
3. Repeat for all three radial positions
4. Watch the sketch turn from blue (under-constrained) to black (fully constrained)

**Say:**
> "Once every line is black and the status bar says 'Fully Constrained,' we're ready to finish the sketch. Every measurement has been transferred from the real part's engineering drawing into the sketch. What we have now is a precise 2D cross-section of half the bearing."

5. **Finish Sketch** (green checkmark or press Escape)

---

## SEGMENT 9 — Revolve
*~2–3 min*

**Steps:**
1. Create → **Revolve**
2. Select the **sketch profiles** — click on each closed region in the sketch (inner race region, outer race region — two separate profiles). Hold Ctrl to multi-select.
3. For **Axis**, click the horizontal centerline (or the X-axis if it aligns with the sketch centerline)
4. Type of revolution: **Full** (360°)
5. Operation: **New Body** (or New Component — it should already be inside the component we created)
6. Click OK

**Say:**
> "Watch this. The sketch rotates 360° around the centerline — and we get a 3D model of the bearing races. That's the power of Revolve: we drew a 2D cross-section, and the tool created the full solid of revolution. Any shape that's rotationally symmetric — a bottle, a wheel, a shaft, a bearing — gets modeled this way."

> "The model doesn't look polished yet. It's missing the chamfers and fillets — the small angled and rounded edges on the real part. We'll add those next."

---

## SEGMENT 10 — Measure and Apply Chamfers
*~5–6 min*

**Say:**
> "Chamfers are the small angled cuts on the sharp edges of the bearing. They're there to prevent stress concentrations — sharp 90° corners are where cracks start — and to make it easier to press the bearing into its seat. On our model we'll add chamfers to four edges."

**Measure from McMaster drawing (demonstrate Measure tool or read from print):**
> "I'm going to use Fusion's Measure tool — under Inspect → Measure — to find the chamfer dimensions on our reference. Actually, for this one we'll read them from the McMaster drawing."

**Read two chamfer specs:**
- Chamfer 1 (bore edges — inner ring): distance = _____ mm, angle = _____ °
- Chamfer 2 (OD edges — outer ring): distance = _____ mm, angle = _____ °

**Apply in Fusion:**
1. Modify → **Chamfer**
2. Click the **two edges of the bore** (top and bottom lip of the inner hole) — these are the edges at the inner bore on each face
3. Set distance and angle to match the drawing values for chamfer 1
4. OK

5. Modify → **Chamfer** again
6. Click the **two edges of the OD** (outer radius, both faces)
7. Set distance and angle for chamfer 2
8. OK

**Say:**
> "Four edges total — two at the bore, two at the outer diameter, each face gets one. The chamfers are small. If you're zoomed out they'll barely be visible, but zoom in and you'll see the angled cut. That's what the real part has."

---

## SEGMENT 11 — Measure and Apply Fillets
*~5–6 min*

**Say:**
> "Fillets are the rounded transitions — instead of a sharp inside corner, you get a small arc. On the bearing races, fillets appear at the shoulder transitions, where the ball groove blends into the flat face of the race. We have three unique fillet radii, and we'll apply each to two edges — six total."

**Measure from the real part (show Measure tool approach):**
> "I'm going to switch to Inspect → Measure, then click on an edge in the model to confirm what we drew in the sketch, then apply the right value to each edge group."

**Three fillet groups:**
- Fillet group A: [describe which two edges] — radius = _____ mm
- Fillet group B: [describe which two edges] — radius = _____ mm  
- Fillet group C: [describe which two edges] — radius = _____ mm

**Apply:**
1. Modify → **Fillet**
2. Select edges for group A → type radius → OK
3. Repeat for groups B and C

**Say:**
> "Notice that fillets come AFTER chamfers. If you add fillets first and then try to chamfer, you might get geometry conflicts. In general: chamfers and fillets are the last step before saving, and chamfers usually go before fillets."

---

## SEGMENT 12 — Final Save
*~1 min*

**Say:**
> "Last step — save. Not just Ctrl+S, but also check the browser panel. You should see one component, one body inside it. The timeline at the bottom should show: New Component, New Sketch, Revolve, two Chamfers, three Fillets. That timeline is your full history — if you need to change a dimension later, you can right-click any step and edit it."

1. Ctrl+S (save)
2. Show the finished model — rotate it to show the full 3D bearing
3. Orbit to show the cross-section view one more time

**Closing:**
> "That's the 608 bearing — reverse engineered from McMaster-Carr's drawing into a Fusion 360 model you made yourself. This model goes into your fidget spinner assembly so you can design the bearing seat to exact tolerances. Next lesson, we'll start designing around it."

---

## Notes for Recording

- **Pause before each major tool** — give students a beat to follow along
- **Name the shortcut key** every time you use one (R, L, C, D, T, Escape) — some students will be watching only
- **Zoom in** before demonstrating constraints, chamfers, and fillets — they're small and easy to miss
- **The constraint delete demo** (Segment 4) is the highest-value teaching moment — go slow, show the constraint icon, show the delete, show the before/after
- **The datum connection** (Segment 8) is worth a brief pause — this concept reappears in every future drawing
- **Don't worry if dimensions differ slightly** from these notes — read from the actual McMaster drawing on screen so students see the source
