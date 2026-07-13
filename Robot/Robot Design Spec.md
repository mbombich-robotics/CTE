# Robot Design Spec — HS AE&R 2026-27

*Capture design decisions here as they're made. Feeds into carrier board mounting pattern, CAD lesson files, and BOM updates.*

---

## Status
- [ ] Frame design finalized
- [x] Motor selected — AndyMark NeveRest Hex 19.2:1
- [x] Front wheels selected — TETRIX omni (passive/free spool)
- [x] Rear wheels — 3D printed custom (hub + tread)
- [ ] Front axle design confirmed (bore size pending from Pitsco)
- [ ] Electronics layout confirmed
- [ ] Carrier board hole pattern confirmed (from EE)
- [ ] Deck CAD file created (Mr. B master version)
- [ ] Electronics mount CAD file created (Mr. B master version)

---

## Frame & Chassis

| Parameter | Value | Notes |
|---|---|---|
| Overall footprint (L × W) | TBD | |
| Height (max) | TBD | |
| Frame material | TBD | |
| Deck material | Polycarbonate | CNC cut; student CAD component C5 |
| Size envelope constraint | TBD | Used for Cardboard Deck Challenge mock-up dimensions |

---

## Drivetrain

| Parameter | Value | Notes |
|---|---|---|
| Motor | AndyMark NeveRest Hex 19.2:1 | $37–49; JST-VH-2 connector; 12V; 11A stall |
| Gear ratio | 19.2:1 | ~344 RPM free speed at 12V |
| Output shaft | 3/8" hex, 1/2/3" length options, 10-32 tapped end | Confirm shaft length needed for wheel hub |
| Motor mount bolt pattern | 4× M3×0.5 on 28mm bolt circle | **Critical for C1 CAD** — students design to this spec |
| Encoder | Hall effect, built-in, 7 PPR | ~134 pulses/output shaft rev (7 × 19.2); detachable power cable included |
| Stall current | 11A | VNH5019 rated 12A continuous — adequate margin |
| Rear wheels | 3D printed custom (hub + tread), 3" diameter | Student CAD components C7 + C8; tread TPU; matches front wheel diameter for level deck |
| Front wheels | TETRIX omni 3", passive (not driven) | Pitsco $4.00/2-pack (clearance pricing — confirmed at checkout); 8mm center bore; 8× M3 on 16mm bolt circle |
| Front wheel hub | 3D printed, bolts to omni via 8× M3 holes | Contains 2× MR128-2RS bearings (8mm ID × 12mm OD × 3.5mm); 12mm OD fits within 16mm M3 bolt circle; hub fixed to shaft; wheel+hub rotates on bearings |
| Front axle | 8mm shaft fixed to frame | Shaft does not rotate; wheel+hub spins on 608 bearings; shaft retained in frame bracket; length determined by robot width |
| Wheel base (track width) | TBD | |

---

## Electronics Layout

| Component | Location on robot | Qty | Mount method |
|---|---|---|---|
| Carrier board (Pico 2W) | Electronics mount (C6) | 1 | Standoffs; hole pattern from EE |
| VNH5019 motor driver | Electronics mount (C6) | 2 | Standoffs or rail; adjacent to carrier board |
| 12V LiPo battery | Battery holder (C3) | 1 | 3D printed holder |
| KCD1 power switch | Switch holder | 1 | 3D printed holder; accessible from outside |
| Wago connectors | Wago mount | 1 block | 3D printed mount; power distribution |
| Fuse | On carrier board (polyfuse) | — | Integrated; no separate holder needed |

---

## Carrier Board Mounting

| Parameter | Value | Notes |
|---|---|---|
| Hole pattern | TBD — EE to specify | Electronics mount (C6) must match |
| Board dimensions | ~100mm × 80mm (target) | EE to confirm |
| Standoff height | TBD | Must clear components on underside of carrier board |
| Standoff size | TBD | M3 likely |

*Once EE provides the hole pattern, update this section and the C6 electronics mount CAD file.*

---

## Sensors (mounted on robot)

| Sensor | Mount | Location | Notes |
|---|---|---|---|
| TCRT5000 IR (×2) | C2 — IR sensor mount | Front underside | 15mm ground clearance; L and R |
| HC-SR04 Ultrasonic | C4 — ultrasonic mount | Front center | Forward-facing; added for scanner unit |
| Pan/tilt servo + HC-SR04 | C4 variant or separate | Front | Scanner project; may replace static mount |

---

## Size Envelope & Constraints

| Constraint | Value | Source |
|---|---|---|
| Cardboard challenge mock-up dimensions | TBD | Must match once frame is decided |
| Max footprint | TBD | |
| IR sensor ground clearance | 15mm min | Fixed by sensor spec |
| Deck height off ground | TBD | Drives wheel/caster selection |

---

## Open Decisions

- [x] **Motor selected:** AndyMark NeveRest Hex 19.2:1 — update BOM (remove REV HD Hex + REV wheels + gear cartridges)
- [ ] **Motor shaft length:** 1", 2", or 3" — depends on wheel hub depth once designed
- [x] **Wheel size confirmed:** 3" front and rear — level deck; ~1.4 m/s (~4.5 ft/s) free speed at 344 RPM
- [x] **Omni wheel bore confirmed:** 8mm center bore; 8× M3 on 16mm bolt circle — axle is 8mm shaft, free spool
- [ ] **Front axle construction:** 8mm shaft (aluminum or steel); retention method (e-clip, collar, or shoulder); frame bracket design
- [ ] **Carrier board hole pattern:** EE to provide; update C6 electronics mount spec
- [ ] **Standoff height:** Measure carrier board underside component height
- [ ] **Frame material and construction method:** Welded, bolted, plate?
- [ ] **Cardboard challenge envelope:** Finalize once robot footprint is known
- [ ] **Switch location:** Accessible from outside without flipping robot?
- [ ] **Cable routing plan:** Where do motor cables exit relative to VNH5019 headers on carrier board?
