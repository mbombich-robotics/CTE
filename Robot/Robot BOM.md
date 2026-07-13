# Robot BOM — HS Applied Engineering & Robotics

**Robot count:** 24 (12 pairs)  
**Last updated:** 2026-06-14  
*Living document — update as robot design evolves for 2026-27.*  
*Controller: custom carrier board (Pico 2W RP2350) — see [Carrier Board Spec and BOM.md](Carrier%20Board%20Spec%20and%20BOM.md)*

---

## Section 1 — Drive & Mechanical

| Part | Vendor | Qty/Robot | Total (×24) | Unit Cost | Notes |
|---|---|---|---|---|---|
| AndyMark NeveRest Hex 19.2:1 Gearmotor | AndyMark | 2 | 48 | $37–49 | 3/8" hex shaft; JST-VH-2 connector; hall effect encoder built-in (7 PPR ~134 pulses/output rev); 4× M3×0.5 on 28mm bolt circle; shaft length TBD |
| TETRIX Omni Wheel 3" (pack of 2) | Pitsco Education | 1 pack | 12 packs (24 wheels — 2/robot) | $4.00/pack | Front wheels; passive/free spool; 3" diameter; 8mm center bore; 8× M3 on 16mm bolt circle; clearance pricing confirmed at checkout |
| MR128-2RS Bearing (8mm ID × 12mm OD × 3.5mm) | Amazon (uxcell) | 4 | 96 | ~$0.91/ea ($9.09/10-pack) | 2 per front wheel hub; 12mm OD clears 16mm M3 bolt circle with 2mm to spare; double rubber sealed |
| Front axle shaft (8mm rod) | McMaster-Carr / Amazon | 1 | 24 | TBD | Aluminum or steel; fixed to frame; does not rotate |
| Front axle retention (collar or e-clip) | McMaster-Carr | 2 | 48 | TBD | Retains shaft in frame bracket |
| Front wheel hub | 3D print | PLA | 2 | — | Bolts to omni via 8× M3 holes; seats 2× 608 bearings; rotates on fixed shaft; teacher-designed or bonus CAD task |

---

## Section 2 — Electronics & Power

| Part | Vendor | Qty/Robot | Total (×24) | Unit Cost | Notes |
|---|---|---|---|---|---|
| Carrier Board (Pico 2W + custom PCB) | — | 1 | 24 | ~$22–25 | See [Carrier Board Spec and BOM.md](Carrier%20Board%20Spec%20and%20BOM.md); includes 12V→5V regulation, polyfuse, VNH5019 headers, servo headers, encoder headers, on-board UI |
| Pololu VNH5019 Motor Driver Carrier (1451) | Pololu | 2 | 48 | $33.81 | Recurring; single H-bridge (1 per motor) — 2 independent controllers so one fried controller = one motor repair, not full robot; plugs into carrier board headers |
| Seasider 12V 2600mAh LiPo Battery | Amazon | 1 | 24 | $19.99 | Recurring |
| KCD1 Rocker Switch | Amazon | 1 | ~24 | ~$0.40 | Main power switch; holder is a custom CAD part |

---

## Section 3 — Wiring, Connectors & Assembly

| Part | Vendor | Qty/Robot | Total (×24) | Unit Cost | Notes |
|---|---|---|---|---|---|
| Jumper Wires, M-M long | Amazon | shared | 20 packs | $3.99/pack | Sensor connections |
| Jumper Wires, general | Amazon | shared | 10 packs | $9.40/pack | |
| Wago Connectors | Amazon | shared | 1 box | $30.49 | Power distribution terminal; holder is custom CAD part |
| 4-pin 0.1" Header | Digikey | varies | bulk | $0.20/ea | |
| 4-pin 0.1" Connector Housing | Digikey | varies | bulk | $0.14/ea | |
| 0.1" Crimp Pins | Digikey | varies | 1000 | $0.04/ea | |
| 0.1" Straight Pin Headers (M + F) | Amazon | varies | 2 packs | $9.99/pack | |
| USB-C Cable (laptop → carrier board) | Amazon | 1 | 24 | ~$6.00 | Programming cable; replaces old PC-to-Nano micro-USB |
| Velcro Tape | Amazon | shared | 1 roll | $15.19 | Cable management |

---

## Section 4 — Sensors & Expansion (per project module)

*Not all sensors on every robot simultaneously. Installed/removed per unit.*

| Part | Vendor | Qty/Robot | Total (×24) | Unit Cost | Module |
|---|---|---|---|---|---|
| TCRT5000 IR Sensor Module (10-pack) | Amazon | 1 | 2 packs (20) | $8.79/10-pack | Line Following |
| HC-SR04 Ultrasonic Distance Sensor | SparkFun | 1 | 10 ordered | $5.25 | Scanner Robot |
| Pan/Tilt Bracket Kit (single attachment) | SparkFun | 1 | 20 | $11.50 | Scanner mount |
| Pololu Micro Gripper Kit w/ position feedback | Pololu | 1 | 20 | $29.95 | Claw Project; recurring |
| Servo (SG90 or MG90S) | — | 1–2 | — | — | Claw + Scanner; **source not yet on materials request** |
| GY-521 MPU-6050 IMU (6-pack) | Amazon | 1 | 4 packs (24) | $14.79/6-pack | Advanced / optional |
| SparkFun 9DoF IMU ICM-20948 (Qwiic) | SparkFun | 1 | 20 | $20.85 | Advanced |
| VL53L1X Time-of-Flight Sensor (Qwiic) | SparkFun | 1 | 20 | $28.45 | Advanced |
| SparkFun RGB & Gesture Sensor APDS-9960 | SparkFun | 1 | 20 | $3.99 | Advanced |
| WS2812B LED Strip (300 LED/16.4 ft) | Amazon | shared | 10 | $14.07 | Optional / capstone |

---

## Section 5 — Custom Fabricated Parts (Student CAD → Unit 2)

*Designed by students in Unit 2; fabricated during Robot Build phase.*

| Part | Fabrication Method | Material | Qty/Robot | Unit 2 Component # | Notes |
|---|---|---|---|---|---|
| Motor Mount | 3D print | PLA | 2 (one per motor) | C1 | 4× M3×0.5 on 28mm bolt circle; 3/8" hex shaft clearance |
| IR Sensor Mount | 3D print | PLA | 1 | C2 | 15 mm ground clearance constraint |
| Battery Holder | 3D print | PLA | 1 | C3 | Wire relief cutouts |
| Ultrasonic Sensor Mount | 3D print | PLA | 1 | C4 | Forward-facing, secure fit |
| Robot Deck | CNC cut | Polycarbonate | 1 | C5 | Hole patterns, wire pass-throughs, component layout |
| Electronics Mount | CNC cut | Polycarbonate | 1 | C6 | Standoff spacing, carrier board + VNH5019 modules |
| KCD1 Switch Holder | 3D print | PLA | 1 | — | Pre-fab provided OR early-finisher bonus task |
| Wago Connector Block Mount | 3D print | PLA | 1 | — | Pre-fab provided OR early-finisher bonus task |
| Protoboard Mount | 3D print | PLA | 1 | — | Pre-fab provided OR early-finisher bonus task |
| Rear Wheel Hub | 3D print | PLA | 2 | C7 | 3/8" hex bore; mates motor shaft to tread |
| Rear Wheel Tread | 3D print | TPU | 2 | C8 | Flexible; snaps/bonds onto hub; diameter TBD |

---

## Open Questions

- [x] **Motor selected:** AndyMark NeveRest Hex 19.2:1 — REV HD Hex, gear cartridges, and REV wheels removed from BOM
- [ ] **Motor shaft length:** 1", 2", or 3" — confirm once wheel hub depth is designed
- [ ] **Omni wheel bore:** Check Pitsco/TETRIX CAD files — needed before front axle hardware can be specified
- [ ] **Omni wheel size:** 3" or 4" — coordinate with rear wheel diameter for level deck
- [ ] **Rear wheel diameter:** TBD — determine target ground speed and work backwards from 344 RPM free speed
- [ ] **IR sensor qty:** TCRT5000 modules — line following typically needs 2 sensors (left + right). Are these dual-sensor modules, or do students need 2 per robot?
- [ ] **HC-SR04 qty:** Only 10 ordered for 20 robots. 1 per pair? Confirm intended qty per robot.
- [ ] **Servo source:** Needed for both claw and scanner; not on the materials request. Add to 2026-27 order.
- [ ] **IMU redundancy:** GY-521 (Amazon) and SparkFun 9DoF (ICM-20948) both listed. Two different solutions — which is primary for 2026-27?
