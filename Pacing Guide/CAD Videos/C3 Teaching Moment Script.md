# Video Script — C3: Teaching Moment

---

## INTRO

[TITLE CARD — 3 sec]
C3 — Motor Mount Sleeve (Part 2)
Autodesk Fusion · HS Applied Engineering & Robotics
https://www.youtube.com/watch?v=R2XTm9G-uFg

In the last video I made the motor mount and started the validation process. In this video we'll look at cross sections of the part with the installed motor and fix any obvious problems. Then we'll do some cosmetic work before sending it to the 3d printer!

---

## BODY

[SCENE 1 — Assembly file open. Section Analysis active. Motor flange (green) overlapping with printed pocket (pink).]

Before I send parts to the printer, I do a section analysis to look at the fit. This is why.

Right here — you can see the green is the motor flange, and the pink is the pocket we created for it. There's about a quarter millimeter of overlap. This part would absolutely fail the first test fit. We wouldn't even know which part was the problem, because the pocket failing would affect everything downstream.

So let's talk about what caused it and how to fix both issues I found.

---

[SCENE 2 — Assembly browser tree visible. Motor mount component highlighted. "Active" indicator shown.]

First, an important concept if you're working in a hybrid design — meaning you built the motor mount directly inside the assembly rather than as a separate external file.

Right now, the main assembly is what's active — not the motor mount part itself. If I made a sketch or an extrusion right now to fix this problem, it would go into the assembly, not into the motor mount. We'd 3D print the part, it still wouldn't fit, and we'd have no idea why.

Before making any edits to the motor mount, you have to activate it first. Click the radial button that appears when you hover over the part file in the tree. Now any changes you make go directly into that component.

That risk is one of the trade-offs with the hybrid approach. Once we finish this fix, I'll export the motor mount as an external component — that way every future edit is unambiguously to the part file, and this confusion goes away.

---

[SCENE 3 — Motor mount activated. First sketch opened. Offset tool applied to flange outline. Pocket extrusion reopened and selection corrected.]

With the motor mount active, open the first sketch. Find the projected flange outline — the circle that defines the pocket edge — and apply a quarter millimeter offset, pushing it away from the flange geometry. That adds the clearance we need.

Now open the pocket extrusion from the timeline. The selection is hard to see because the sketch is hidden behind the body. Make all bodies invisible, make the selection, finish teh extrusion, then bring the bodies back and hide the sketch.

Go back into Section Analysis. You should now see a visible gap where the flange sits in the pocket. The clearance should be obvious.

---

[SCENE 4 — Browser tree open. Multiple bodies visible. Extrusion with "New Body" operation found in timeline. Changed to "Join." Lines disappear from model.]

The second issue is these lines you see on the surface of the model. Lines like this mean Fusion Three-Sixty is treating different sections of the part as separate bodies. That's a problem when you export for 3D printing — the slicer may see them as separate objects and it introduces unecessary complication if that was not the design intent.

Open the Bodies folder in the browser. If you see more than one body listed, something wasn't joined.

Go back through the timeline and find the extrusion that has "New Body" as the operation instead of "Join." Mine was the sleeve extrusion — I accidentally created a new body instead of merging it with the face. Change the operation to Join and click OK.

The lines disappear. One body. That's what the file needs to look like before it goes to the printer.

---

## WRAP

Two quick fixes — a quarter millimeter of clearance on the flange pocket, and an extra body on the sleeve extrusion. Section Analysis caught the first one before I even ran it. The multiple bodies showed up as surface lines.

Get in the habit of checking these sources for error before every print.

---

---

[SCENE 5 — Assembly file. Common Components > Fasteners. 10-32 screw inserted and constrained. M5 screw and flanged nut added.]

With the clearance and body issues resolved, I want to verify the fasteners before this goes to the printer. I don't need to constrain every screw — because the part has symmetry. Checking one side tells me what I need to know.

Let's ground the motor mount so it doesn't around.

First, the 10-32 screws that attach the motor flange to the mount. Go to Common Components, Fasteners, and bring in the 10-32. Use the edge-to-edge constraint —  constrain the circular edge of the bottom of the countersink hole and the circular edge on the underside of the screw head. One constraint, seats the screw concentric and flush.

You'll notice right away that the screw is too long. That's useful information — make a note of it so you select the right length when you do the actual assembly. 

Make the section analysis visible. The clearance hole for the screw shaft is clearly not big enough. Activate the motor mount component, go to the base sketch, and make it larger--try a half mm. Make sure all four circles are teh same. In my sketch, they all had their own quarter millimeter offset, so I'll delete those dimensions and apply and equal constraint to them. check the cross section again. Looks good.

Next, the M5-20 screw for the top mounting holes. This one goes through the deck, so apply an offset of six millimeters — the deck thickness — to the edge-to-edge constraint. That positions the screw as it would actually sit with the deck in place. Bring in the M5 flanged nut and constrain it to the same screw. About a millimeter of thread sticks out past the nut — that's acceptable. Check the clearance on both sides of the nut. If there's space on both sides and the nut isn't overhanging the inner wall, the geometry is correct.

---

[SCENE 6 — Right-click on motor mount in browser tree. Export dialog. File opens in standalone file.]

Now we export the motor mount and make it a permanent standalone file. Right-click the motor mount in the browser tree and click Export. Give it a name — I'm using a version number since I have multiple iterations — and save it to your project folder in the cloud. Deselect the option to export to your computer. You want this to live in the cloud project so it's accessible from the assembly.

Give it a moment to upload. Then go to File, Open, navigate to your project folder, and open the motor mount. It should open in its own file with the full timeline intact.

From this point forward, any changes you make to the motor mount happen in this file. There's no doubt about which part is active. This is the cleaner long-term workflow, and it eliminates the risk we talked about earlier.

---

[SCENE 7 — Standalone part file open. Fillet tool on faces. Large fillet on front flange edge. Appearance applied.]

Last step: cosmetic finishing. In the standalone file, go to Modify — Fillet. First start with the faces — and select every surface that you want to smooth. Type in half a millimeter and let Fusion apply fillets to all of them at once.

Before you click OK, add one more fillet on the front face-to-flange edge. This is a structurally loaded junction, so give it as much radius as the geometry allows without interfering with the nut. In my version that's about ten millimeters — yours may differ. Just drag the fillet out until it looks right.

After finishing that fillet, check your work. If you notice a face that still looks sharp, fix it. Like the lead-in on the motor flange opening here — add a separate fillet to that face at one millimeter. That edge sees the motor sliding into it; a chamfer or fillet here makes assembly smoother.

Optional but useful: right-click the file in the browser, click Appearance, and assign a color. I use red for all 3D printed parts. That way, in any assembly file, you can tell at a glance which components are printed and which are purchased or CNC'd.

---

## YouTube Description

C3 — Motor Mount Sleeve (Part 2) | Autodesk Fusion | HS Applied Engineering & Robotics

Part 2 of the C3 Motor Mount picks up after the modeling is complete. Before the file goes to the printer, Section Analysis reveals two problems: a quarter-millimeter interference between the motor flange and the printed pocket, and a missed Join operation leaving the model as multiple separate bodies. Both are fixed here.

After corrections, we verify the fasteners in the assembly, export the motor mount as a standalone external file, and add cosmetic finishing in the part file before sending to print.

**What you'll learn:**
- Why Section Analysis is non-negotiable before every print — and what interference looks like
- The "active component" trap in hybrid assembly design — editing the assembly instead of the part
- How to spot a missing Join: surface lines on the model and multiple bodies in the browser
- Quick fixes: sketch offset for pocket clearance, changing New Body → Join in the timeline
- Fastener verification: checking one screw per hole pattern when you have symmetry
- Edge-to-edge constraint with an offset for a screw that passes through a deck panel
- Exporting a component as a standalone cloud file — the clean workflow for future edits
- Face fillets in one operation, plus targeted fillets on high-stress junctions
- Appearance colors to identify 3D printed parts in assembly files

**Chapters:**
- 0:00 Introduction
- [0:00] Section Analysis — finding the quarter-millimeter interference
- [0:00] The active component trap — why edits went to the wrong part
- [0:00] Fix 1: sketch offset for pocket clearance
- [0:00] Fix 2: changing New Body to Join — surface lines explained
- [0:00] Fastener verification — 10-32 and M5 screws, nut clearance check
- [0:00] Export as external file — and why this eliminates the active-component risk
- [0:00] Finishing: face fillets, structural junction fillet, appearance color

*Part 1 — full modeling sequence — is the previous video.*
*Part of the HS Applied Engineering & Robotics curriculum at Vicksburg Community Schools.*
