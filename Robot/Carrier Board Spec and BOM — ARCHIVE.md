# Carrier Board Spec & BOM
## VHS Applied Engineering & Robotics 2026-27

**Last updated:** 2026-06-17
**Quantity:** 24 boards
**EE outline doc:** `VHS_26_27_Bot_Board_Outline.pdf`

---

## 1 General

### 1.1 Approach to Layout

1.1.1 Provide robust power and GND planes

1.1.2 Labeling

- 1.1.2.1 Connectors/headers clearly labeled
- 1.1.2.2 Pin 1 clearly identified on all connectors
- 1.1.2.3 Power and GND pins labeled
- 1.1.2.4 GPIO pads labeled GP## / FUNCTION (e.g. `GP14 / SPARE`)
- 1.1.2.5 Board version number and date on silkscreen

### 1.2 Mis-wiring Tolerance

1.2.1 Circuitry to prevent damage for reversed polarity on power connection

### 1.3 Software Development Languages Supported

1.3.1 MicroPython

1.3.2 CircuitPython

1.3.3 C/C++

### 1.4 Usage Phases

1.4.1 Intro phase (workstation): boards used standalone at student workstations for electronics and programming fundamentals

1.4.2 Robot phase: same 24 boards mount onto robots; all peripherals connect via on-board headers

1.4.3 Carrier board is the sole controller — no separate Arduino or MCU on the robot

---

## 2 Functions/Capability

### 2.1 Power

2.1.1 Board main power: 5.5-24V DC @ max 10A RMS

2.1.2 OTS 5V DC-DC converter: 5.5-24V input, 3A output

2.1.3 3.3V 1.5A linear regulator

2.1.4 Power input connector: 5.5mm/2.1mm barrel jack

2.1.5 USB power: Pico 2W powered from its micro-USB during workstation phase

### 2.2 Controller: Pico 2W

2.2.1 Dual core (RP2350)

2.2.2 WiFi / BLE

2.2.3 C/C++, MicroPython, CircuitPython support

2.2.4 0.1" receptacle (2x20) module plugin

2.2.5 0.1" pin header (2x20) for pin access

2.2.6 Reset button wired to Pico RUN pin

### 2.3 Visual Indicators

2.3.1 5V power LED

2.3.2 3.3V power LED

2.3.3 GPIO state indicator LEDs x28 (one per Pico GPIO; shows pin high/low)

### 2.4 Programming / USB

2.4.1 Type-down USB micro-B extension connector wired from Pico 2W native micro-USB port to board edge

2.4.2 Used for code upload, serial monitor, and powering Pico from laptop during workstation phase

### 2.5 On-Board User Interface

2.5.1 Tactile pushbuttons x3 — each wired to a dedicated GPIO with pull-up resistor and debounce cap

2.5.2 Potentiometer, 10 kOhm, PCB-mount — wired to ADC-capable GPIO (shares ADC channel via jumper per 2.8)

2.5.3 WS2812B LED strip header: 3-pin (DATA, 5V, GND) — external strip connects here for capstone unit; single pixel also works

2.5.4 Piezo buzzer, passive — PWM-driven

2.5.5 OLED header: 4-pin female (VCC, GND, SDA, SCL); 0.96" SSD1306 module plugs in; shares I2C bus with Qwiic connector

### 2.6 Motor Control Capabilities

2.6.1 2x Pololu VNH5019 Motor Driver Carrier daughter card headers

2.6.2 2x onboard brushed motor circuitry (not populated)

2.6.3 2x stepper motor support circuitry (not populated)

2.6.4 2x servo motor interfaces (3-pin 0.1" header)

- 2.6.4.1 PWM
- 2.6.4.2 GND
- 2.6.4.3 Jumper-selectable 3V3 or 5V power

2.6.5 VNH5019 EN pins: hardwired high (not connected to Pico GPIO) — confirm with EE

2.6.6 VNH5019 DIAG pins: not connected to Pico GPIO — confirm with EE

### 2.7 Sensor/Accessories Interfaces

2.7.1 Ultrasonic distance sensor headers: 3x 4-pin (GND, VCC, SDA, SCL) — one per sensor

- 2.7.1.1 Headers route to TCA9548A I2C multiplexer (see 2.7.2), not directly to Pico GPIO
- 2.7.1.2 Compatible with Lonely Binary HC-SR04 TK50 (I2C mode, J1 populated); 3.3V-5V

2.7.2 TCA9548A 8-channel I2C multiplexer

- 2.7.2.1 Connects to carrier board I2C bus (GP0/GP1)
- 2.7.2.2 Channels 0-2 feed ultrasonic sensor headers
- 2.7.2.3 Channels 3-7 reserved for future expansion
- 2.7.2.4 Can be integrated on carrier board or connected as external module via Qwiic — EE to decide

2.7.3 Qwiic (SparkFun) / STEMMA QT (Adafruit) connector (4-pin JST SH)

- 2.7.3.1 GND
- 2.7.3.2 3V3
- 2.7.3.3 I2C data (GP0)
- 2.7.3.4 I2C clock (GP1)

2.7.4 IR sensor interfaces x2 (3-pin 0.1" header) — left and right

- 2.7.4.1 VCC (3V3)
- 2.7.4.2 GND
- 2.7.4.3 OUT (digital or ADC-capable GPIO)

### 2.8 ADC Capabilities

2.8.1 3 general ADC inputs (GP26, GP27, GP28 — all available ADC pins on Pico 2W)

2.8.2 Analog voltage divider and filter component per interface

2.8.3 3-pin 0.1" header per ADC interface

- 2.8.3.1 Analog input
- 2.8.3.2 GND
- 2.8.3.3 Jumper-selectable 3V3 or 5V

2.8.4 Jumper per channel: selectable between on-board signal (pot on GP26; motor current sense on GP27/GP28) or external header

### 2.9 Mechanical

2.9.1 Type-down USB micro-B extension cable from Pico 2W

2.9.2 Insulated mounting holes for M3 fasteners (minimum 4 corners)

2.9.3 Keep-out areas for VNH5019 Motor Driver Carrier supports

2.9.4 Board dimensions TBD — EE to determine; must coordinate with robot deck CNC layout (student CAD C5/C6)

### 2.10 GPIO Pin Map

26 GPIO available on Pico 2W header. 24 assigned, 2 spare. GP23, GP24, GP25, GP29 are internal to the Pico W and not available.

| GPIO | Function | Notes |
|---|---|---|
| GP0 | I2C0_SDA (OLED + Qwiic + TCA9548A) | Shared I2C bus |
| GP1 | I2C0_SCL (OLED + Qwiic + TCA9548A) | Shared I2C bus |
| GP2 | MOTOR1_INA | VNH5019 #1 direction |
| GP3 | MOTOR1_INB | VNH5019 #1 direction |
| GP4 | MOTOR1_PWM | VNH5019 #1 speed; PWM-capable |
| GP5 | MOTOR2_INA | VNH5019 #2 direction |
| GP6 | MOTOR2_INB | VNH5019 #2 direction |
| GP7 | MOTOR2_PWM | VNH5019 #2 speed; PWM-capable |
| GP8 | ENC1_A | Motor 1 encoder; interrupt-capable |
| GP9 | ENC1_B | Motor 1 encoder; interrupt-capable |
| GP10 | ENC2_A | Motor 2 encoder; interrupt-capable |
| GP11 | ENC2_B | Motor 2 encoder; interrupt-capable |
| GP12 | SERVO1_PWM | PWM-capable |
| GP13 | SERVO2_PWM | PWM-capable; same slice as GP12 — same freq, independent duty cycle |
| GP14 | SPARE | — |
| GP15 | SPARE | — |
| GP16 | IR_LEFT | TCRT5000 left; digital or analog |
| GP17 | IR_RIGHT | TCRT5000 right; digital or analog |
| GP18 | BTN1 | Active low; pull-up + debounce cap |
| GP19 | BTN2 | Active low; pull-up + debounce cap |
| GP20 | BTN3 | Active low; pull-up + debounce cap |
| GP21 | WS2812B_DATA | Strip header data line |
| GP22 | BUZZER | PWM-capable; different slice from motors/servos |
| GP23 | — | Internal: Pico W SMPS power save |
| GP24 | — | Internal: Pico W VBUS sense |
| GP25 | — | Internal: Pico W WiFi LED |
| GP26 | ADC0 | Jumper: on-board pot OR external header |
| GP27 | ADC1 | Jumper: motor 1 current sense OR external header |
| GP28 | ADC2 | Jumper: motor 2 current sense OR external header |
| GP29 | — | Internal: VSYS/3 voltage monitor |

**Budget summary:** 26 GPIO available, 24 assigned, **2 spare** (GP14, GP15). Ultrasonic sensors on I2C via TCA9548A — no GPIO consumed. EN and DIAG pins on VNH5019 headers present on connector but not routed to Pico GPIO (see 2.6.5, 2.6.6).

---

## 3 BOM — Per Board

### 3.1 MCU

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| Raspberry Pi Pico 2W | SparkFun / Raspberry Pi | 1 | $7.70 | $7.70 | Socketed |

### 3.2 Power

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| OTS 5V DC-DC converter (5.5-24V in, 3A out) | Digikey | 1 | ~$2.00 | $2.00 | EE to select specific part |
| 3.3V 1.5A linear regulator | Digikey | 1 | ~$0.75 | $0.75 | EE to select specific part |
| Filter capacitors (bulk) | Digikey | ~6 | $0.05 | $0.30 | Input/output filtering |
| Reversed-polarity protection | Digikey | 1 | ~$0.50 | $0.50 | EE to confirm method |
| Barrel jack (5.5mm/2.1mm) | Digikey | 1 | $0.50 | $0.50 | Robot battery input |
| 5V power LED + resistor | Digikey | 1 | $0.10 | $0.10 | |
| 3.3V power LED + resistor | Digikey | 1 | $0.10 | $0.10 | |

### 3.3 USB / Programming

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| USB micro-B type-down connector | Digikey | 1 | $0.50 | $0.50 | Board-edge extension of Pico micro-USB |

### 3.4 MCU Socket

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| 20-pin female receptacle header | Digikey | 2 | $0.40 | $0.80 | Pico 2W socket |
| 20-pin male pin header | Digikey | 2 | $0.20 | $0.40 | Pin access breakout |
| Reset button (tactile) | Digikey | 1 | $0.20 | $0.20 | Wired to RUN pin |

### 3.5 Visual Indicators

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| LED (GPIO state indicators) | Digikey | 28 | $0.05 | $1.40 | One per GPIO |
| Current-limiting resistors (GPIO LEDs) | Digikey | 28 | $0.01 | $0.28 | |

### 3.6 On-Board User Interface

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| Tactile pushbutton | Digikey | 3 | $0.20 | $0.60 | With pull-up resistors |
| Potentiometer, 10 kOhm, PCB-mount | Digikey | 1 | $1.00 | $1.00 | |
| 3-pin male header (WS2812B strip) | Digikey | 1 | $0.15 | $0.15 | DATA, 5V, GND; strip is a separate peripheral |
| Piezo buzzer, passive | Digikey | 1 | $0.75 | $0.75 | PWM-driven |
| 4-pin female header (OLED) | Digikey | 1 | $0.25 | $0.25 | SSD1306 module plugs in |
| Qwiic / STEMMA QT connector (JST SH 4-pin) | SparkFun / Digikey | 1 | $0.50 | $0.50 | |

### 3.7 Motor & Servo Headers

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| VNH5019 daughter card headers | Digikey | 2 sets | $0.50 | $1.00 | EE to confirm exact pinout/spacing |
| 3-pin male header (servo) | Digikey | 2 | $0.15 | $0.30 | |
| Voltage select jumpers (servo power) | Digikey | 2 | $0.10 | $0.20 | 3V3 or 5V |

### 3.8 Sensor Headers

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| 4-pin male header (ultrasonic I2C) | Digikey | 3 | $0.20 | $0.60 | GND, VCC, SDA, SCL; routed to TCA9548A |
| 3-pin male header (IR sensor) | Digikey | 2 | $0.15 | $0.30 | Left + right |

### 3.9 ADC Interfaces

| Part | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| 3-pin male header (ADC) | Digikey | 3 | $0.15 | $0.45 | Analog in, GND, power |
| Analog voltage divider resistors | Digikey | 6 | $0.02 | $0.12 | 2 per channel |
| Filter capacitors (ADC) | Digikey | 3 | $0.05 | $0.15 | 1 per channel |
| Voltage select jumpers (ADC power) | Digikey | 3 | $0.10 | $0.30 | 3V3 or 5V per channel |
| Signal select jumpers (pot/current sense vs external) | Digikey | 3 | $0.10 | $0.30 | On-board or external per channel |

### 3.10 PCB

| Item | Vendor | Qty | Unit Cost | Extended | Notes |
|---|---|---|---|---|---|
| PCB fabrication (2-layer) | JLCPCB | 24 | ~$1.50 | ~$36 | Dimensions TBD; order 30 for spares |
| Misc passives (resistors, caps) | Digikey | bulk | — | ~$1.00 | Pull-ups, debounce, decoupling |

---

## 4 Per-Board Cost Summary

| Category | Cost |
|---|---|
| Pico 2W | $7.70 |
| Power section | ~$4.25 |
| USB / programming | ~$0.50 |
| MCU socket + reset | ~$1.40 |
| GPIO state LEDs (28x) | ~$1.68 |
| User interface (buttons, pot, NeoPixel, buzzer, OLED header, Qwiic) | ~$3.35 |
| Motor & servo headers | ~$1.50 |
| Sensor headers (ultrasonic x3 + IR x2) | ~$0.90 |
| ADC interfaces | ~$1.32 |
| PCB | ~$1.50 |
| Misc passives | ~$1.00 |
| **Total per board** | **~$23-27** |

---

## 5 Separate Peripheral Costs

| Item | Qty/robot | Total (x24) | Pack size | Packs needed | Pack price | Total cost | Notes |
|---|---|---|---|---|---|---|---|
| SSD1306 OLED module (0.96") | 1 | 24 | — | — | ~$2.50 ea | ~$60 | Plugs into OLED header |
| WS2812B LED strip | shared | ~10 strips | — | — | ~$14.07 ea | ~$141 | Capstone unit; plugs into strip header |
| Lonely Binary HC-SR04 TK50 (I2C ultrasonic) | 3 | 72 | 5/pack | 15 packs | $14.24 | ~$214 | J1 populated for I2C mode |
| AITRIP TCA9548A I2C multiplexer | 1 | 24 | 6/pack | 4 packs | $9.59 | ~$38 | External module or integrate on carrier board |

---

## 6 24-Board Project Total

| Item | Cost |
|---|---|
| 24 carrier boards (assembled) | ~$555-650 |
| 24 OLED modules | ~$60 |
| 72 TK50 ultrasonic sensors (15 packs) | ~$214 |
| 24 TCA9548A mux boards (4 packs) | ~$38 |
| **Total** | **~$867-962** |

*Prototype run (5 boards before committing to 24): ~$80-100 additional one-time cost.*

---

## 7 Open Questions / Decisions

- [ ] **TCA9548A placement:** Integrate chip on carrier board vs. external breakout module — EE to decide; affects BOM and carrier board layout
- [ ] **VNH5019 EN/DIAG routing:** Proposed — EN hardwired high, DIAG not connected. GPIO budget is 2 spare with this approach. Confirm with EE before layout.
- [ ] **ADC jumper scheme:** Proposed — GP26 jumper selects pot vs external; GP27 jumper selects motor 1 current sense vs external; GP28 jumper selects motor 2 current sense vs external. Confirm with EE.
- [ ] **Servo PWM slices:** GP12 and GP13 share a PWM slice — same frequency, independent duty cycle. Adequate for standard servos (all 50 Hz). Confirm no use case requires different servo frequencies.
- [ ] **Buck converter / linear reg parts:** EE to select specific parts; update BOM once confirmed
- [ ] **Reversed-polarity protection approach:** EE to confirm method (P-channel MOSFET, Schottky, or TVS)
- [ ] **VNH5019 header pinout:** EE to verify against actual VNH5019 module pin spacing and order
- [ ] **Board dimensions:** EE to determine based on component placement; must coordinate with robot deck CNC layout (C5/C6)
- [ ] **Mounting hole pattern:** Finalize once board outline is set
- [ ] **Prototype validation:** Order 5 prototype boards before committing to full run of 24
- [x] ~~**Servo count**~~ — confirmed: 2 headers
- [x] ~~**On-board UI scope**~~ — confirmed in scope: buttons, pot, NeoPixel, buzzer, OLED header included
- [x] ~~**USB-C bridge IC**~~ — resolved: type-down micro-B extension from Pico native port
- [x] ~~**HC-SR04 level shifting**~~ — resolved: switched to TK50 I2C sensors (3.3V-5V native); no level shifting needed
- [x] ~~**Ultrasonic GPIO pins**~~ — resolved: I2C via TCA9548A frees GP14 and GP15; 3x 4-pin I2C headers on carrier board route to mux
- [x] ~~**TK50 sensor price**~~ — confirmed: $14.24/5-pack (~$2.85/sensor); 15 packs for 24 robots (~$214)
