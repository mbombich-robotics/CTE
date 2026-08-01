# Robotics Class - 9-Week Curriculum
## Line Following, Ultrasonic Scanner & Servo Claw

---

## Overview

Students will complete three progressive robot features over 9 weeks, building skills in sensors, actuators, programming, and mechanical design.

**Platform**: Arduino RP2040 (Raspberry Pi Pico with Arduino framework)

### Project Progression
1. **Weeks 1-2**: Complete Line Following Robot
2. **Weeks 3-5**: Servo-Powered Scanning Ultrasonic Sensor
3. **Weeks 6-8**: Servo-Powered Claw
4. **Week 9**: Integration & Demonstration

---

## Weekly Structure

Each week follows this pattern:
- **Lesson Day(s)**: Concept introduction, demonstration
- **Build Day(s)**: Hands-on construction with instructions
- **Practice/Debug**: Testing, troubleshooting, iteration
- **Friday**: Weekly reflection submission

---

## Phase 1: Line Following Completion (Weeks 1-2)

### Week 1: Line Following Refinement

**Learning Objectives:**
- Understand IR sensor calibration
- Implement PID control basics
- Debug sensor-based navigation

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | PID control concepts, tuning parameters |
| Tue | Build/Code | Implement/refine line following algorithm |
| Wed | Testing | Track testing, calibration |
| Thu | Iteration | Improve performance based on testing |
| Fri | Reflection | Submit weekly reflection + practical prep |

**Deliverable: Line Following Practical Exercise**
- Navigate a test track with turns and intersections
- Graded on: completion, speed, consistency
- Points: 50

---

### Week 2: Line Following Mastery

**Learning Objectives:**
- Optimize robot performance
- Handle edge cases (gaps, sharp turns)
- Document the engineering process

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | Advanced line following: intersections, recovery |
| Tue | Build/Code | Implement advanced features |
| Wed | Testing | Practice on competition track |
| Thu | Final Prep | Last optimizations |
| Fri | Practical | Timed line following challenge |

**Deliverable: Line Following Final Practical**
- Timed run on standardized track
- Graded on: completion time, accuracy, recovery from errors
- Points: 75

---

## Phase 2: Scanning Ultrasonic Sensor (Weeks 3-5)

### Week 3: Ultrasonic Sensor Fundamentals

**Learning Objectives:**
- Understand ultrasonic distance measurement
- Read HC-SR04 sensor with Arduino
- Convert time-of-flight to distance

**Components Needed:**
- HC-SR04 ultrasonic sensor
- SG90 or MG90S servo motor
- Mounting bracket (3D printed or kit)
- Jumper wires

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | How ultrasonic sensors work, timing diagrams |
| Tue | Build | Wire ultrasonic sensor, basic distance reading |
| Wed | Code | Write distance measurement function, serial output |
| Thu | Testing | Accuracy testing at various distances |
| Fri | Reflection | Document sensor behavior, submit reflection |

**Deliverable: Ultrasonic Sensor Lab Report**
- Wiring diagram (hand-drawn or digital)
- Code with comments
- Distance accuracy data table
- Points: 40

---

### Week 4: Servo Control & Scanning Mechanism

**Learning Objectives:**
- Control servo motor position
- Design scanning mount in CAD (optional)
- Integrate servo with ultrasonic sensor

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | Servo motor operation, PWM control, sweep library |
| Tue | Build | Mount servo, attach ultrasonic sensor |
| Wed | Code | Implement scanning sweep (0° to 180°) |
| Thu | CAD (optional) | Design custom mount in TinkerCAD/Fusion 360 |
| Fri | Reflection | Document build process, submit reflection |

**Deliverable: Scanner Assembly**
- Physical scanner mechanism (mounted and functional)
- Sweep code that moves sensor side to side
- CAD design file (bonus points if 3D printed)
- Points: 50 (+ 15 bonus for CAD)

---

### Week 5: Scanning Algorithm & Obstacle Detection

**Learning Objectives:**
- Build distance map from scan data
- Identify nearest obstacle and its direction
- Make navigation decisions based on scan

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | Data structures for scan data, finding min/max |
| Tue | Code | Store distances at each angle, create scan array |
| Wed | Code | Implement obstacle detection algorithm |
| Thu | Testing | Test in obstacle course environment |
| Fri | Practical | Scanning practical exercise |

**Deliverable: Scanning Practical Exercise**
- Robot scans environment and identifies:
  - Nearest obstacle distance and direction
  - Clearest path direction
- Serial output showing scan results
- Points: 75

---

## Phase 3: Servo-Powered Claw (Weeks 6-8)

### Week 6: Claw Mechanism Design

**Learning Objectives:**
- Understand gripper mechanisms
- Design considerations for servo-powered claws
- CAD design basics (if not done in Week 4)

**Components Needed:**
- SG90 or MG90S servo motor
- Claw kit OR 3D printed claw parts
- Mounting hardware

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | Gripper types, linkage mechanisms, torque requirements |
| Tue | CAD/Design | Design or select claw mechanism |
| Wed | Build | Assemble claw mechanism |
| Thu | Build | Mount claw to robot arm/chassis |
| Fri | Reflection | Document design choices, submit reflection |

**Deliverable: Claw Design Document**
- Sketch or CAD of claw mechanism
- Parts list with sources
- Explanation of design choices
- Points: 50

---

### Week 7: Claw Control Programming

**Learning Objectives:**
- Control claw open/close with servo
- Implement grip strength considerations
- Add user input control (button/serial)

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | Servo position control, grip pressure, stall current |
| Tue | Code | Basic open/close functions |
| Wed | Code | Add button or serial control |
| Thu | Testing | Grip testing with various objects |
| Fri | Reflection | Document code and testing, submit reflection |

**Deliverable: Claw Control Code**
- Working code with open(), close(), and partial grip functions
- Comments explaining each section
- Video of claw operation
- Points: 50

---

### Week 8: Integrated Claw Operations

**Learning Objectives:**
- Combine scanning and claw for object retrieval
- Implement pick-and-place sequence
- Debug integrated systems

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Lesson | State machines, sequencing robot actions |
| Tue | Code | Integrate scanner + claw + drive |
| Wed | Code | Implement pick-up sequence |
| Thu | Testing | Practice object retrieval |
| Fri | Practical | Claw practical exercise |

**Deliverable: Claw Practical Exercise**
- Pick up object from designated location
- Transport to target zone
- Place object accurately
- Points: 75

---

## Phase 4: Integration & Demonstration (Week 9)

### Week 9: Final Integration

**Learning Objectives:**
- Combine all systems into cohesive robot
- Demonstrate problem-solving and engineering process
- Present work professionally

**Daily Breakdown:**

| Day | Activity | Details |
|-----|----------|---------|
| Mon | Integration | Combine all features, resolve conflicts |
| Tue | Testing | Full system testing |
| Wed | Polish | Final improvements, prepare demonstration |
| Thu | Presentations | Individual demonstrations to class |
| Fri | Presentations | Complete demonstrations, final reflections |

**Deliverable: Final Robot Demonstration**
- Robot demonstrates all three capabilities:
  1. Line following
  2. Obstacle scanning
  3. Object manipulation with claw
- Individual presentation explaining your work
- Points: 100

---

## Grading Summary

### Weekly Reflections (20 points each)
| Week | Topic | Points |
|------|-------|--------|
| 1 | Line Following Refinement | 20 |
| 2 | Line Following Mastery | 20 |
| 3 | Ultrasonic Sensor Basics | 20 |
| 4 | Servo & Scanning Build | 20 |
| 5 | Scanning Algorithm | 20 |
| 6 | Claw Design | 20 |
| 7 | Claw Programming | 20 |
| 8 | Integrated Systems | 20 |
| 9 | Final Integration | 20 |
| | **Subtotal** | **180** |

### Deliverables
| Deliverable | Week | Points |
|-------------|------|--------|
| Line Following Practical #1 | 1 | 50 |
| Line Following Final Practical | 2 | 75 |
| Ultrasonic Sensor Lab Report | 3 | 40 |
| Scanner Assembly | 4 | 50 (+15 bonus) |
| Scanning Practical | 5 | 75 |
| Claw Design Document | 6 | 50 |
| Claw Control Code | 7 | 50 |
| Claw Practical | 8 | 75 |
| Final Demonstration | 9 | 100 |
| | **Subtotal** | **565** |

### Participation & Professionalism
| Category | Points |
|----------|--------|
| Daily engagement | 25 |
| Lab safety & cleanup | 15 |
| Collaboration | 15 |
| | **Subtotal** | **55** |

---

| **Category** | **Points** |
|--------------|------------|
| Weekly Reflections | 180 |
| Deliverables | 565 |
| Participation | 55 |
| **TOTAL** | **800** |
| CAD Bonus (optional) | +15 |
| **Maximum Possible** | **815** |

---

## Weekly Reflection Requirements

Same format as FRC class - submitted every Friday via portfolio website:

1. **Work Log** (5 pts)
   - 3+ specific tasks YOU completed with dates
   - Use "I" statements

2. **Evidence** (5 pts)
   - 2+ photos of YOUR work
   - Screenshots of YOUR code
   - Videos of YOUR robot testing

3. **Challenges & Solutions** (5 pts)
   - Technical problems encountered
   - How you solved them (or what help you need)

4. **Goals** (5 pts)
   - 3 specific goals for next week

---

## Practical Exercise Rubrics

### Line Following Practical (Weeks 1-2)

| Criteria | Excellent | Good | Satisfactory | Needs Work |
|----------|-----------|------|--------------|------------|
| Completion | Finishes track | Minor issues | Multiple retries | Cannot complete |
| Speed | Fast, consistent | Good pace | Slow but steady | Very slow/stops |
| Recovery | Handles all errors | Recovers usually | Some recovery | Poor recovery |
| Consistency | 3/3 runs similar | 2/3 consistent | Variable | Unpredictable |

### Scanning Practical (Week 5)

| Criteria | Excellent | Good | Satisfactory | Needs Work |
|----------|-----------|------|--------------|------------|
| Scan Quality | Accurate distances | Minor errors | Some inaccuracies | Unreliable |
| Detection | Identifies all obstacles | Most obstacles | Some obstacles | Poor detection |
| Decision | Correct path choice | Usually correct | Sometimes correct | Incorrect |
| Output | Clear, formatted | Readable | Basic | Confusing |

### Claw Practical (Week 8)

| Criteria | Excellent | Good | Satisfactory | Needs Work |
|----------|-----------|------|--------------|------------|
| Pickup | Secure grip every time | Usually secure | Sometimes drops | Cannot grip |
| Transport | Smooth, controlled | Minor wobble | Some issues | Unstable |
| Placement | Accurate position | Close to target | In general area | Misses target |
| Sequence | Autonomous operation | Mostly auto | Manual steps | Fully manual |

---

## Materials & Components List

### Already Have (from Line Following)
- Arduino RP2040 board
- Motor driver
- DC motors & wheels
- Chassis
- IR line sensors
- Battery pack

### New Components Needed

**For Ultrasonic Scanner:**
| Item | Qty | Notes |
|------|-----|-------|
| HC-SR04 Ultrasonic Sensor | 1 | 5V compatible |
| SG90 Servo | 1 | Or MG90S for more torque |
| Sensor mount bracket | 1 | 3D print or purchase |
| Jumper wires | 6+ | Male-to-female |

**For Claw:**
| Item | Qty | Notes |
|------|-----|-------|
| SG90 or MG90S Servo | 1 | Depends on claw design |
| Claw mechanism kit | 1 | OR 3D printed parts |
| Mounting hardware | varies | Screws, standoffs |

---

## Code Resources

### Ultrasonic Sensor Basic Code
```cpp
// HC-SR04 with Arduino RP2040
const int trigPin = 2;
const int echoPin = 3;

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

long getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long distance = duration * 0.034 / 2; // cm
  return distance;
}

void loop() {
  Serial.print("Distance: ");
  Serial.print(getDistance());
  Serial.println(" cm");
  delay(100);
}
```

### Servo Sweep Code
```cpp
#include <Servo.h>

Servo scanServo;
const int servoPin = 4;

void setup() {
  scanServo.attach(servoPin);
}

void sweep() {
  for (int angle = 0; angle <= 180; angle += 10) {
    scanServo.write(angle);
    delay(50);
    // Read ultrasonic here
  }
  for (int angle = 180; angle >= 0; angle -= 10) {
    scanServo.write(angle);
    delay(50);
    // Read ultrasonic here
  }
}

void loop() {
  sweep();
  delay(1000);
}
```

### Claw Control Code
```cpp
#include <Servo.h>

Servo clawServo;
const int clawPin = 5;
const int OPEN_POS = 0;
const int CLOSED_POS = 90;

void setup() {
  clawServo.attach(clawPin);
  openClaw();
}

void openClaw() {
  clawServo.write(OPEN_POS);
}

void closeClaw() {
  clawServo.write(CLOSED_POS);
}

void gripPartial(int percent) {
  int pos = map(percent, 0, 100, OPEN_POS, CLOSED_POS);
  clawServo.write(pos);
}

void loop() {
  // Control logic here
}
```

---

## Differentiation

### For Advanced Students
- Implement full autonomous object retrieval
- Add LCD display showing scan data
- Design custom 3D printed parts
- Implement PID for smoother servo movement

### For Students Needing Support
- Provide pre-assembled components
- Step-by-step code templates with blanks to fill
- Pair with advanced student for debugging
- Reduce practical requirements (partial credit)

---

## Safety Notes

1. **Electrical Safety**
   - Always disconnect power before wiring changes
   - Check polarity before connecting components
   - Don't exceed servo current limits

2. **Mechanical Safety**
   - Keep fingers clear of moving parts
   - Secure loose wires away from wheels
   - Use appropriate tools for assembly

3. **Battery Safety**
   - Monitor battery voltage
   - Don't leave charging unattended
   - Store properly when not in use

---

## Web Portfolio Integration

Students use the same portfolio system as the FRC class, with project-specific deliverables. See [Robotics_Portfolio_System](Robotics_Portfolio_System/) folder for the adapted version.

---

## Curriculum Planning TODO

### Test Security Protocol (Final Exam)
The Apps Script backend currently exposes two leakage paths students could exploit before / during the final exam:
- `?action=getQuizMeta&quizId=final_exam` returns all question text and MC options to anyone who knows the API URL (which is in the public `app.js`).
- `?action=checkQuiz&email=ANYONE&quizId=final_exam` returns any other student's answers + scores with no authentication.

Before relying on the final exam at high stakes, draft a protocol that includes some combination of:
- A teacher-controlled "quiz open window" (`quizOpenAt` / `quizCloseAt` in Config) gating `getQuizMeta` and `submitQuiz`.
- Stripping the raw answer text from `checkQuiz` responses (return score/feedback only).
- Optional: forward the student's Google ID token from the portfolio frontend and have the backend verify it matches the queried email.
- A physical-room protocol (no phones, lockdown browser, etc.) for in-class administration.
- Random question subsetting per attempt so a dump of the full bank doesn't equal a dump of any single student's exam.

See git commit `5962f71` for the final exam implementation. Question content lives in `quiz-content.js` (gitignored) and on the deployed Apps Script — not on GitHub.
