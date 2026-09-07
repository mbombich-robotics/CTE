# Fusion 360 Tool Index — CAD Video Coverage

Maps every tool taught to the video(s) where it appears. Use this to:
- Identify gaps before adding a new project
- Scope quiz items to tools that have been taught
- Track progression from orientation → part design → assembly

**Videos key:**
- **K** — Kevin Kennedy F360 for Beginners (L2.1 Orientation, watch only — concepts, not proficiency)
- **C1** — C1 Wheel Hub (scripted)
- **C1x** — C1 Export, Slice & Print (scripted) — covers Bambu Studio, not Fusion tools
- **A1** — A1 Assembly Basics (scripted)
- **C2d** — C2 Drive Wheel Hub (scripted)
- **C2r** — C2 Wheel Retaining Hub (scripted)
- **C3** — C3 Motor Mount Sleeve (scripted)

---

## Navigation & Workspace

| Tool / Concept | Key / Menu | K | C1 | A1 | C2d | C2r | C3 | Notes |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|---|
| Workspace overview (Toolbar, Browser, Timeline, ViewCube) | — | ✓ | | | | | | Orientation only in K |
| Orbit / Pan / Zoom | Middle mouse | ✓ | | | | | | |
| Bodies vs. Components vs. Sketches | — | ✓ | | ✓ | | | ✓ | Progressively deepened |
| Show / hide in Browser tree | Eye icon | | ✓ | | ✓ | | ✓ | Critical when extruding from hidden sketch |
| Save (habit) | Ctrl+S | | ✓ | ✓ | ✓ | ✓ | ✓ | Emphasized in every scripted video |

---

## Sketch Tools

| Tool / Concept | Key / Menu | K | C1 | A1 | C2d | C2r | C3 | Notes |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|---|
| New Sketch (on a plane or face) | Sketch menu | ✓ | ✓ | | ✓ | ✓ | ✓ | C3 uses two separate sketches |
| Finish Sketch | Toolbar | | ✓ | | ✓ | ✓ | ✓ | |
| Circle | Create menu | ✓ | ✓ | | ✓ | ✓ | ✓ | |
| Line | Create menu | | | | | | ✓ | Connector arm and centerline in C3 |
| Rectangle | Create menu | | | | | | ✓ | Reference geometry in C3 |
| Construction line (Sketch Palette) | Sketch Palette | | | | ✓ | ✓ | ✓ | First introduced in C2d |
| Dimension (D) | D | | ✓ | | ✓ | ✓ | ✓ | Mixed-unit math first shown in C2d |
| Mixed-unit math in Dimension | D | | | | ✓ | ✓ | | e.g. 0.374in + 0.25; 0.159in − 0.25mm |
| Horizontal/Vertical constraint | Sketch menu | | ✓ | | ✓ | ✓ | | Constrains rotation of polygons and circles |
| Coincident constraint | Sketch menu | | | | ✓ | | | Slot centerline to origin in C2d |
| Equal constraint (=) | = key | | | | | | ✓ | Four counterbore circles set equal in C3 |
| Circular Pattern (sketch) | Create menu | | ✓ | | ✓ | ✓ | | |
| Offset tool | Modify menu | | | | ✓ | ✓ | ✓ | Hub OD from wheel bore; hex clearance; motor sleeve wall |
| Circumscribed Polygon | Create menu | | | | ✓ | ✓ | | Hex bore; H/V constraint locks rotation |
| Slot tool (Center to Center) | Create menu | | | | ✓ | | | Lightening spokes on drive wheel hub |
| Mirror tool | Create menu | | | | | | ✓ | Symmetric connector arms in C3 |
| Extend tool | Modify menu | | | | | | ✓ | Closes projected arc into full circle |
| Project / Include geometry (P) | P | | | | | | ✓ | Projects motor flange onto sketch plane |
| Driven dimension (read-only) | D | | | | | | ✓ | First encountered when projecting in C3 |
| Measure tool (I) | I | | ✓ | | ✓ | ✓ | ✓ | Reads geometry from reference files |

---

## Solid Modeling Tools

| Tool / Concept | Key / Menu | K | C1 | A1 | C2d | C2r | C3 | Notes |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|---|
| Extrude — basic (E) | E | ✓ | ✓ | | ✓ | ✓ | ✓ | |
| Extrude — Cut operation | E | | ✓ | | ✓ | ✓ | ✓ | |
| Extrude — Join operation | E | | | | ✓ | | ✓ | Standoff/retaining cap in C2d; sleeve in C3 |
| Extrude — Object start face | E | | ✓ | | ✓ | ✓ | ✓ | Start extrude from a face other than sketch plane |
| Extrude — To Object extent | E | | | | | | ✓ | Cut through flange only in C3 |
| Multiple extrusions from one sketch | — | | ✓ | | ✓ | ✓ | | Key concept; sketch stays as single source of truth |
| Revolve | Solid menu | ✓ | | | | | | K only — orientation exposure |
| Fillet | Modify menu | ✓ | | | ✓ | ✓ | ✓ | First used in C2; C3 emphasizes stress concentrators |
| Chamfer | Modify menu | | | | ✓ | | | Hex bore lead-in; chamfer vs. fillet distinction |
| Offset Plane (Construct) | Construct menu | | | | ✓ | | | Locates retaining cap depth relative to shaft end |
| Timeline — Edit Feature | Double-click or right-click | | ✓ | | ✓ | | ✓ | Parametric revision without rebuild |
| Derive tool | Create menu | | ✓ | | | | | Links tap-side hub to clearance-side sketch |
| Save as External Component | Right-click in Browser | | | | | | ✓ | Converts internal component to its own file |

---

## Assembly Tools

| Tool / Concept | Key / Menu | K | C1 | A1 | C2d | C2r | C3 | Notes |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|---|
| New Assembly Design | File menu | | | ✓ | ✓ | | ✓ | |
| Insert Component | Insert menu | | | ✓ | ✓ | | ✓ | |
| Move / Align (rough positioning) | Relationships menu | | | ✓ | | | | Before applying constraints |
| Ground to origin (3 constraints) | Relationships menu | | | ✓ | ✓ | | ✓ | |
| Constraint — Concentric | Relationships menu | | | ✓ | ✓ | | ✓ | |
| Constraint — Flush / Face | Relationships menu | | | ✓ | | | ✓ | |
| Constraint — Angular | Relationships menu | | | | ✓ | | ✓ | Aligns hex flats |
| Constraint Set | Relationships menu | | | ✓ | | | | Groups all constraints for one component |
| Edge-to-Edge constraint trick | Relationships menu | | | ✓ | | | | Seats screw concentric + flush in one constraint |
| Copy / Paste component | Right-click in Browser | | | ✓ | | | | Duplicating identical fasteners |
| Section Analysis | Inspect menu | | | ✓ | ✓ | | ✓ | Validate fit from inside; used every assembly |
| Edit in Place | Pencil icon in Browser | | | | ✓ | | ✓ | Modify a component without leaving assembly |
| Common Components — Fasteners | Insert menu | | | ✓ | | | | Standard screw library |

---

## Slicer / Print Workflow (Bambu Studio)

| Tool / Concept | C1x | Notes |
|---|:-:|---|
| Export to 3MF | ✓ | Right-click body in browser |
| Bambu Studio orientation: pan/rotate/zoom | ✓ | |
| Lay flat tool | ✓ | Orient part for best overhang position |
| Printer / Filament / Process dropdowns | ✓ | Must match before slicing |
| Slice and review preview | ✓ | Check for unexpected supports |
| Send to Printer | ✓ | |
| Post-print test protocol | ✓ | Bearing fit, axle clearance, screw clearance, bore measurement |

---

## Coverage Summary by Tool Category

| Category | First introduced | Fully proficient by |
|---|---|---|
| Navigation | K (orientation) | C1 (using it to inspect) |
| Sketch — basic shapes + dimension | K (orientation) | C1 |
| Sketch — constraints | K (orientation) | C1–C2 |
| Sketch — construction lines | C2d | C2r |
| Sketch — Project geometry | C3 | C3 |
| Sketch — Polygon, Offset, Slot | C2d | C2r |
| Sketch — Mirror, Extend | C3 | C3 |
| Extrude (basic + Cut) | K (orientation) | C1 |
| Extrude (Join, Object start, To Object) | C2d | C3 |
| Fillet / Chamfer | K (orientation) | C2d |
| Derive | C1 | C1 |
| Timeline editing | C1 | C3 |
| Assembly basics | A1 | A1 |
| Section Analysis | A1 | C3 |
| Edit in Place | C2d | C3 |
| Offset Plane | C2d | C2d |
| Slicer (Bambu Studio) | C1x | C1x |

---

## Quiz Scope Notes

- **Fair game after C1**: Measure tool, circle, dimension, H/V constraint, Circular Pattern, basic Extrude, Finish Sketch, Browser tree, Timeline edit, Derive, bearing pocket cushion factor, clearance vs. interference vs. tapping hole sizes
- **Fair game after A1**: Assembly file vs. part file, Insert Component, Concentric/Flush constraints, Constraint Set, edge-to-edge trick, Section Analysis
- **Fair game after C2d/C2r**: Construction lines, Offset, Circumscribed Polygon, Slot, mixed-unit dimension, Fillet, Chamfer, Join extrusion, Object start face, Edit in Place
- **Fair game after C3**: Project geometry, driven dimensions, Mirror, Extend, Equal constraint, multi-sketch part, Offset Plane, To Object extent, Save as External Component

---

## Gaps / Not Yet Covered in Any Scripted Video

- Revolve (shown in Kennedy orientation, never applied in a project)
- Shell tool
- Thread feature
- Pattern on a body (vs. sketch circular pattern)
- Appearance / Material assignment
- Render workspace
- Drawing / Annotation workspace
- 2D Technical Drawing export

*Last updated: 2026-09-05 — covers K, C1, C1x, A1, C2d, C2r, C3. Kennedy's video is Kevin Kennedy (YouTube); all others are scripted course videos.*
