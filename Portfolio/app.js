// Robotics Portfolio - Main Application (Google Auth Edition)

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================
// Placeholder image (data URI - won't be blocked by firewalls)
const PLACEHOLDER_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QaG90bzwvdGV4dD48L3N2Zz4=';

// Track param from URL - set by class hub pages (?track=hsaer / aer8th / dbl)
// Overrides stored course for returning students in multiple classes.
const URL_TRACK = new URLSearchParams(window.location.search).get('track') || null;

const CONFIG = {
    // App version - update when deploying changes
    VERSION: 'v2.14.2',

    // Backend URL - swapped at login via setBackendForCourse(); default is HS AE&R
    SHEETS_API_URL: 'https://script.google.com/macros/s/AKfycbyDV5If2s_zHp2louBI8pE2J3rnC46q7OXEUWkGKCVgLP05iWjNN0x-4UKGzuBBGRLw/exec',

    // One entry per course track - keys match state.student.course
    BACKEND_URLS: {
        hsaer:  'https://script.google.com/macros/s/AKfycbxKkugJxRzBOUzSF52btnOa8PmE_B87Fi0vJSA8s-L179KWlA71jUgUhjdUMzNomRgE/exec',
        aer8th: 'https://script.google.com/macros/s/AKfycbz9JkbfmqlgDdcpCBSIiEifnTu6HK1Q1-KJi0KYdB16u-UnLVZZdxeDPqeHQErrvE-y/exec',
        dbl:    'https://script.google.com/macros/s/AKfycbxdoDufO0qoot1SekT6O8l8pPCCQLcOY49vxnb0SnNqd4ebtrRYgOyb-LLmk0-Tj-BCfw/exec',
    },

    // Google OAuth Client ID
    GOOGLE_CLIENT_ID: '1002661691088-8g0dskdehhmgc8jigbua15l3ih7td4ka.apps.googleusercontent.com',

    // First day of school - update each year
    SEMESTER_START: new Date('2026-08-31'),

    // Point values
    POINTS: {
        WEEKLY_REFLECTION: 20,
        TOTAL_POSSIBLE: 1285
    },

    // Auto-save interval in milliseconds
    AUTO_SAVE_INTERVAL: 30000
};
function setBackendForCourse(course) {
    CONFIG.SHEETS_API_URL = CONFIG.BACKEND_URLS[course] || CONFIG.BACKEND_URLS.hsaer;
}

// ============================================
// WEEK TOPICS
// ============================================
const WEEK_TOPICS = {
    // Unit 1 — Engineering Design Process (Aug 31 – Sep 11)
    1:  { title: 'Engineering Design Process', phase: 'edp', unit: '01', focus: 'Intro, Spaghetti Tower challenge, EDP framework, Paper Glider, Design Brief workshop' },
    2:  { title: 'Cardboard Robot Deck Challenge', phase: 'edp', unit: '01', focus: 'Client interview, concept sketching, build, iterate — EDP quiz end of week. Labor Day Mon Sep 7.' },
    // Unit 2 — CAD: Component-Based (Sep 14 – Oct 23)
    3:  { title: 'CAD: C1 Wheel Hub + C2 Drive Wheel', phase: 'cad', unit: '02', focus: 'F360 orientation; CAD hygiene rules; C1 Wheel Hub — concentric circles, multi-depth extrude; C2 Drive Wheel begin — hex bore, Circular Pattern spokes' },
    4:  { title: 'CAD: C2 finish + C3 Motor Sleeve Mount', phase: 'cad', unit: '02', focus: 'C2 iterate + print; C3 Motor Sleeve Mount — sleeve bore, T-slot nut-capture rail, face screw holes; version naming. Mid-unit checkpoint quiz.' },
    5:  { title: 'CAD: C3 print + C4 Deck begin + Assembly', phase: 'cad', unit: '02', focus: 'C3 iterate + print; C4 Robot Deck — outer profile + motor mount holes only; start assembly file (deck + C3 linked + constrained). Sep 30 is a 20-min period day.' },
    6:  { title: 'CAD: C5 Omni Wheel Mount + Assembly', phase: 'cad', unit: '02', focus: 'C5 Omni Wheel Mount — multi-plane sketch, axle bore; insert into assembly, drag to position, edit deck sketch to add C5 holes, constrain C5' },
    7:  { title: 'CAD: C6 IR Mount + C7 Ultrasonic Mount', phase: 'cad', unit: '02', focus: 'C6 IR Sensor Mount + C7 Ultrasonic Mount; same assembly workflow for each — insert → position → edit deck sketch → constrain. Records Day Oct 13 — 4-day week.' },
    8:  { title: 'CAD: Assembly Final + CNC + Quiz', phase: 'cad', unit: '02', focus: 'Run Interference Check on full assembly; fix collisions; finalize C4 deck; CNC toolpath intro + deck CNC cut; all-component test-fit; CAD quiz end of week' },
    // Unit 3 — Safety & Tool Certification (Oct 26 – Nov 6)
    9:  { title: 'Safety: Foundations + Drill Press', phase: 'safety', unit: '03', focus: 'OSHA, LOTO, PPE, SDS; Matthew Henne + Lac-Mégantic case reviews; drill press cert' },
    10: { title: 'Safety: Tool Certs + Quiz', phase: 'safety', unit: '03', focus: 'Pedestal grinder cert, hand drill cert, CNC awareness (Year 1: observe only); safety quiz' },
    // Robot Build — Physical Assembly (Nov 9–13)
    11: { title: 'Build: Robot Assembly', phase: 'build', unit: 'build', focus: 'Assemble frame: motors, wheels, caster; mount electronics board; wire motors and battery; caliper check. Nov 11 = 20-min period day.' },
    // Unit 4 — Programming Basics (Nov 16 – Dec 18)
    12: { title: 'L4.1 Microcontroller Fundamentals + L4.2 Functions', phase: 'programming', unit: '04', focus: 'L4.1 Microcontroller Fundamentals + A4.1 Blink; L4.2 Python Functions + A4.2 SOS with Functions' },
    13: { title: 'L4.3 Digital Input', phase: 'programming', unit: '04', focus: 'L4.3 Digital Input + begin A4.3 Switches. Short week — Thanksgiving Mon–Wed only.' },
    14: { title: 'L4.4 PWM', phase: 'programming', unit: '04', focus: 'Finish A4.3 Switches; L4.4 PWM + A4.4' },
    15: { title: 'L4.5 Motor Control + D51', phase: 'programming', unit: '04', focus: 'L4.5 Motor Control + A4.5; Programming Quiz; D51 Programming Basics due end of week' },
    16: { title: '3D Print Holiday Project', phase: 'programming', unit: '04', focus: 'Design and 3D print a small item to take home — ornament, keychain, name plate. Winter Break ~Dec 21.' },
    // Robot Tuning — Encoders & IMU (Jan 4–21)
    17: { title: 'Robot Tuning: Motor Control + Encoders', phase: 'tuning', unit: '04', focus: 'Motor control on physical robot; drive + turn functions; encoder wiring and pulse counting' },
    18: { title: 'Robot Tuning: Encoder Feedback + IMU', phase: 'tuning', unit: '04', focus: 'Drive-straight with encoder feedback; IMU intro — Qwiic plug-in, read yaw angle. Jan 13 = 20-min period day.' },
    19: { title: 'Robot Tuning: IMU Heading + Midterm', phase: 'tuning', unit: '04', focus: 'IMU heading hold; catch-up; Midterm Exam (EDP, CAD, Safety, Programming Basics). MLK Day Jan 18 — last student day Thu Jan 21.' },
    // Ultrasonic & Wall Following (Jan 25 – Feb 5)
    20: { title: 'Ultrasonic: Distance + Obstacle Detection', phase: 'ultrasonic', unit: '04', focus: 'I2C ultrasonic via TCA9548A mux (3 sensors); distance measurement; obstacle detection logic. S2 begins Jan 25.' },
    21: { title: 'Wall Following', phase: 'ultrasonic', unit: '04', focus: 'Maintain fixed distance from a wall using ultrasonic; proportional correction' },
    // Line Following (Feb 8–19)
    22: { title: 'Line Following: IR Array + Calibration', phase: 'linefollow', unit: '04', focus: '5-sensor IR array; per-sensor threshold calibration; binary line following' },
    23: { title: 'Line Following: PID + Practical', phase: 'linefollow', unit: '04', focus: 'Weighted-sensor error; PID control; tune + course practical. Presidents Day Feb 15 — 4-day week.' },
    // Mechanisms (Feb 22 – Mar 25)
    24: { title: 'AI & Machine Learning', phase: 'ai', unit: '05', focus: 'L5.1 What Is AI (Day 1); L5.2 Ethics in AI (Day 2); Activity 5.3 Teachable Machine (Days 3–4). AI Quiz Day 1 of Week 25. Feb 26 mid-winter break.' },
    25: { title: 'AI Quiz + Mechanisms: Simple Machines', phase: 'mechanisms', unit: '04', focus: 'AI Quiz (Day 1); simple machines intro; mechanical advantage + efficiency (POE 111/113)' },
    26: { title: 'Mechanisms: Pulley Systems + Gear Ratios Intro', phase: 'mechanisms', unit: '04', focus: 'Pulley systems — fixed, movable, compound (POE 114); intro to gear ratios (POE 115). Mar 10 = 20-min period day.' },
    27: { title: 'Mechanisms: Gear Trains + Converting Motion', phase: 'mechanisms', unit: '04', focus: 'Gear ratios + multi-stage gear trains (POE 115 complete); cams, cranks, linkages, rotary→linear motion (POE 122)' },
    28: { title: 'Mechanisms: Design Challenge', phase: 'mechanisms', unit: '04', focus: 'Mechanism design challenge. Short week before Spring Break (Mar 26–Apr 4).' },
    // Servo Build Project (Apr 5–30)
    29: { title: 'Servo Project: Intro + Design Brief', phase: 'servo', unit: '04', focus: 'Project intro + design brief; servo control review; begin build' },
    30: { title: 'Servo Project: Build', phase: 'servo', unit: '04', focus: 'Build (limited time — state testing Tue–Thu)' },
    31: { title: 'Servo Project: Build + Test + Iterate', phase: 'servo', unit: '04', focus: 'Build + test + iterate' },
    32: { title: 'Servo Project: Final Demo', phase: 'servo', unit: '04', focus: 'Final demo + portfolio submission' },
    // Capstone, Portfolio & Review (May 3 – Jun 11)
    33: { title: 'Capstone: Open Challenge', phase: 'final', unit: '04', focus: 'Open-ended improvement project. May 5 = 20-min period day.' },
    34: { title: 'Portfolio Completion Push', phase: 'final', unit: '04', focus: 'All deliverables finalized; portfolio review' },
    35: { title: 'Review: Full Year', phase: 'final', unit: '04', focus: 'EDP, CAD, safety, programming review. Last day for seniors May 20.' },
    36: { title: 'Final Exam', phase: 'final', unit: '04', focus: 'Final exam week' },
    37: { title: 'Wrap-Up', phase: 'final', unit: '04', focus: 'Return exams; wrap-up projects; demos. Memorial Day May 31.' },
    38: { title: 'End of Year', phase: 'final', unit: '04', focus: 'End-of-year reflection; equipment return. Half day Jun 11.' }
};

const WEEK_LABELS = {
    33: 'Capstone · Week 33',
    34: 'Portfolio Push · Week 34',
    35: 'Review · Week 35',
    36: 'Final Exam · Week 36',
    37: 'Wrap-Up · Week 37',
    38: 'End of Year · Week 38'
};

function weekLabel(w) {
    return WEEK_LABELS[w] || `Week ${w}`;
}

// skipReflectionWeeks is now stored in state.config and loaded from the backend at runtime.

// ============================================
// DELIVERABLES DATA
// ============================================
const DELIVERABLES = [
    {
        id: 0,
        title: 'Career Ready Practices Reflection',
        unit: '06',
        points: 20,
        phase: 'foundations',
        alwaysOpen: true,
        description: 'Research an engineering or trades career, analyze real take-home pay and a monthly budget, then write a personal reflection connecting the work to your future.',
        requirements: [
            'Research at least 3 careers or trades using bls.gov/ooh and record salary, education, and job growth data',
            'Complete a paycheck breakdown and monthly budget analysis using the SmartAsset paycheck calculator',
            'Answer all 5 reflection prompts with 2–4 sentences each',
            'Connect at least one prompt specifically to work or skills from this class'
        ]
    },
    // ── Unit 1: Engineering Design Process ──────────────────────────────
    {
        id: 11,
        title: 'Design Brief',
        unit: '01',
        week: 1,
        phase: 'edp',
        type: 'googleDoc',
        description: 'Create a formal design brief in Google Docs. Your document lives in your Google Drive and serves as the official record of your design requirements.',
        requirements: [
            'Client & End User — specifically named, not vague',
            'Problem Statement — describes the problem, not the solution',
            'At least 3 measurable criteria ("The solution must…")',
            'At least 2 realistic constraints ("The solution must not…")',
            'Design Statement — 2–3 sentences synthesizing all four sections',
            'Three distinct concept sketches with your name visible on each'
        ]
    },
    {
        id: 12,
        title: 'Robot Deck Design Record',
        unit: '01',
        week: 2,
        points: 50,
        phase: 'edp',
        description: 'Document your design process from concept to prototype.',
        requirements: [
            'Photo of your concept sketch with decision matrix annotations',
            'Photo of your completed cardboard prototype',
            'One documented iteration: what changed, why you changed it, and what improved'
        ]
    },
    // ── Unit 2: CAD — Component-Based (D21–D27) ─────────────────────────
    // Points are placeholder (50 each) — to be finalized once full course is written
    {
        id: 21,
        title: 'C1 — Wheel Hub',
        unit: '02',
        week: 3,
        points: 50,
        phase: 'cad',
        hasLevelSelect: true,
        description: 'Submit your completed Wheel Hub model with screenshots and learning check answers.',
        requirements: [
            'Screenshot: isometric view showing the hub cylinder, flange, and all 4 mounting holes',
            'Screenshot: top view showing the central bore and fully constrained sketch (or a note that sketch was fully constrained before extruding)',
            'File saved as Lastname_WheelHub_v1-Base (or higher version if you iterated)',
            'Learning Check Q1–Q5 answered below'
        ],
        questions: [
            'What does "fully constrained" mean in Fusion 360? How can you tell when a sketch is fully constrained?',
            'The hub uses two different extrude depths — one for the flange, one for the hub cylinder. What does each depth represent, and why are both needed?',
            'If the central bore is 0.3mm too small, what happens when you try to press the bearing in? What would you do to fix it?',
            'Why do 3D-printed bores often need to be slightly larger than the nominal size of the part that goes inside? What causes this?',
            'You added a Fillet to the outer edge of the flange. Would the hub still function without it? Why include it anyway?'
        ]
    },
    {
        id: 22,
        title: 'C2 — Drive Wheel',
        unit: '02',
        week: 4,
        points: 50,
        phase: 'cad',
        hasLevelSelect: true,
        description: 'Submit your completed Drive Wheel model with screenshots and learning check answers.',
        requirements: [
            'Screenshot: isometric view showing the spoke pattern, hex bore, and outer rim',
            'Screenshot: front view showing spoke symmetry',
            'File saved as Lastname_DriveWheel_v1-Base',
            'Learning Check Q1–Q5 answered below'
        ],
        questions: [
            'What two things do you define when using Circular Pattern? Why is it better than drawing each spoke individually?',
            'Why does the hub use a hex bore instead of a round bore? What would happen if the bore were round?',
            'What is Extrude-Cut? Give a specific example of where you used it on the Drive Wheel.',
            'The outer diameter must create an interference fit with the silicone tire. Explain in your own words what interference fit means and why it holds without glue or fasteners.',
            'If you modeled the outer diameter exactly equal to the tire\'s inner diameter, would it press on securely or slip off? Why?'
        ]
    },
    {
        id: 23,
        title: 'C3 — Motor Sleeve Mount',
        unit: '02',
        week: 4,
        points: 50,
        phase: 'cad',
        hasLevelSelect: true,
        description: 'Submit your completed Motor Sleeve Mount model with screenshots and learning check answers.',
        requirements: [
            'Screenshot: isometric view showing the sleeve bore, T-slot rail, and face screw holes',
            'Screenshot: end face view showing the T-slot cross-section clearly',
            'File saved as Lastname_SleevMount_v1-Base',
            'Learning Check Q1–Q5 answered below'
        ],
        questions: [
            'Describe how the T-slot nut-capture channel works. Why must the top slot be narrower than the bottom cavity?',
            'You sketched the T-slot profile on the end face, then extruded it the full length. Why use this approach instead of drawing the final T-shape directly in the original outer profile?',
            'If you left out the face screw holes, what would prevent the motor from sliding out of the sleeve during operation?',
            'A student makes the T-slot bottom cavity exactly the width of the nut with zero clearance. What problem will they run into when trying to install the nut?',
            'List the assembly steps for installing the motor. Why must the nut be inserted into the T-slot before the mount is bolted to the deck?'
        ]
    },
    {
        id: 24,
        title: 'C4 — Robot Deck (Final)',
        unit: '02',
        week: 8,
        points: 75,
        phase: 'cad',
        hasLevelSelect: true,
        description: 'Submit your finalized Robot Deck file and full assembly screenshot after passing Interference Check. This deliverable is due at the end of Week 8 — the deck is modified throughout Weeks 5–7 as each component is added to the assembly.',
        requirements: [
            'Screenshot: top view of the finalized deck showing all component hole patterns (C3, C5, C6, C7)',
            'Screenshot: full assembly isometric view with all 5 components (deck + C3 + C5 + C6 + C7) constrained',
            'Interference Check: zero collisions confirmed before submitting',
            'File version trail: v1-Base → v2-C5 → v3-C6 → v4-C7 → v5-Final (or equivalent)',
            'Learning Check Q1–Q5 answered below'
        ],
        questions: [
            'What is a Fusion 360 assembly file? How is it different from a regular part file?',
            'Describe the full workflow for adding mounting holes to the deck for a new component. List every step in order.',
            'You dragged C5 freely in the assembly to find a good position, then edited the deck sketch to add C5 holes and saved. What happens in the assembly automatically after you save the deck file?',
            'Every interior corner of the deck must be filleted to at least the CNC bit radius. What happens physically during CNC machining if a corner is sharper than the bit?',
            'The Interference Check shows two components overlapping. Name two possible causes and describe how you would fix each one.'
        ]
    },
    {
        id: 25,
        title: 'C5 — Omni Wheel Mount',
        unit: '02',
        week: 6,
        points: 50,
        phase: 'cad',
        hasLevelSelect: true,
        description: 'Submit your completed Omni Wheel Mount and an updated assembly screenshot showing C5 constrained to the deck.',
        requirements: [
            'Screenshot: isometric view of the Omni Wheel Mount showing both arms and axle bores',
            'Screenshot: assembly isometric showing C5 constrained in position on the deck',
            'File saved as Lastname_OmniMount_v1-Base',
            'Learning Check Q1–Q5 answered below'
        ],
        questions: [
            'You needed to sketch on a side face of the mount body — a different plane from the original sketch. What F360 method lets you start a sketch on an existing face?',
            'If the two arms are spaced too far apart, what happens to the axle? What happens if they are too close together?',
            'What does a joint or constraint do in Fusion 360? What does the assembly look like if you insert a component but never constrain it?',
            'You positioned C5 freely in the assembly before drilling holes in the deck. Why is this better than calculating the hole location from a drawing or estimating?',
            'The M3×20 screws pass through the mount arms into the omni wheel hub flanges. Why should the holes in the arms be slightly larger than 3mm?'
        ]
    },
    {
        id: 26,
        title: 'C6 — IR Sensor Mount',
        unit: '02',
        week: 7,
        points: 50,
        phase: 'cad',
        hasLevelSelect: true,
        description: 'Submit your completed IR Sensor Mount and an updated assembly screenshot showing C6 constrained to the deck.',
        requirements: [
            'Screenshot: isometric view of the IR Sensor Mount showing the U-bracket arms and bottom web',
            'Screenshot: assembly isometric showing C6 in position (front underside of deck)',
            'File saved as Lastname_IRSensorMount_v1-Base',
            'Learning Check Q1–Q5 answered below'
        ],
        questions: [
            'What does the Mirror tool do in Fusion 360? What two things do you need to define to use it?',
            'You used Mirror instead of drawing both arms separately. What advantage does this give you if you need to change the arm thickness or spacing later?',
            'The bracket height controls sensor ground clearance. Why does clearance matter for line following performance? What happens if the sensor is mounted too high?',
            'What is a Slot feature in Fusion 360? Where did you use it on the IR Sensor Mount and why is it a better choice than a rectangle in that location?',
            'You moved C6 into position in the assembly before editing the deck sketch to add holes. Why is positioning the part in the assembly better than guessing the hole location from a drawing?'
        ]
    },
    {
        id: 27,
        title: 'C7 — Ultrasonic Sensor Mount',
        unit: '02',
        week: 7,
        points: 50,
        phase: 'cad',
        hasLevelSelect: true,
        description: 'Submit your completed Ultrasonic Sensor Mount and the final assembly screenshot with all 5 components constrained. This is the last component before the deck is finalized.',
        requirements: [
            'Screenshot: front view of the Ultrasonic Mount showing both sensor bores',
            'Screenshot: isometric view showing the L-bracket geometry',
            'Screenshot: full assembly showing all 5 components (deck + C3 + C5 + C6 + C7) before final interference check',
            'File saved as Lastname_UltrasonicMount_v1-Base',
            'Learning Check Q1–Q5 answered below'
        ],
        questions: [
            'You measured the HC-SR04 sensor bores using Inspect → Measure on the provided model. Name one advantage of measuring the 3D model compared to using a physical caliper.',
            'What is press-fit tolerance? If you model the bore diameter exactly equal to the sensor housing OD, will the sensor press-fit or be loose after 3D printing? Explain why.',
            'The mount is an L-bracket shape. Describe how you created it using extrudes on two different faces — which face did each extrude start on?',
            'What would happen to the robot\'s obstacle detection if the sensor were tilted 20° to one side instead of facing straight ahead?',
            'After completing C7 and the Interference Check passes with zero collisions, what is the next step? Why is the Interference Check the gate before that step?'
        ]
    },
    // ── Unit 3: Safety Certification ────────────────────────────────────
    {
        id: 31,
        title: 'Tool Safety Certifications',
        unit: '03',
        week: 10,
        points: 50,
        phase: 'safety',
        description: 'Complete all required shop safety certifications before the build phase. Each certification requires passing the safety rules check and an observed hands-on demonstration with Mr. Bombich.',
        requirements: [
            'Drill press certification — safety rules + supervised demonstration',
            'Pedestal grinder certification — safety rules + supervised demonstration',
            'Hand drill certification — safety rules + supervised demonstration',
            'Safety quiz passed (end of Week 10) — OSHA, PPE, LOTO, SDS',
            'Signed certification card on file before Week 11 build phase begins'
        ]
    },
    // ── Unit 4: Programming Basics ───────────────────────────────────────
    {
        id: 51,
        title: 'Programming Basics — Check Your Understanding',
        unit: '04',
        points: 80,
        phase: 'programming',
        description: 'Answer Q1–Q5 from Activities 4.1, 4.2, 4.3, 4.4, and 4.5. Answer from memory — you may look up syntax in the Pico 2W Reference, but not back at the activity guides.',
        requirements: [
            '4.1 Q1: What does while True: do, and why does every robot program need one?',
            '4.1 Q2: Why do we write Pin("LED", Pin.OUT) instead of Pin(25, Pin.OUT) on the Pico 2W?',
            '4.1 Q3: What is the REPL? Name one situation where you\'d use it instead of writing a full program in the editor.',
            '4.1 Q4: You want the LED to blink every 200 ms. What value do you pass to time.sleep()? What function could you use instead to avoid the conversion?',
            '4.1 Q5: Identify and write the corrected lines for the two bugs in the debug snippet from Activity 4.1.',
            '4.2 Q1: What Python keyword starts every function definition?',
            '4.2 Q2: In def blink(duration_ms):, what is duration_ms? When you write blink(400), what value does duration_ms hold while the function runs?',
            '4.2 Q3: What does DRY stand for? Describe one specific example from Activity 4.2 where using a function let you follow the DRY principle.',
            '4.2 Q4: Can a function call another function? Trace the chain of calls that happens when your code executes sos() — list every function that runs and in what order.',
            '4.2 Q5: Identify and write the corrected lines for the two bugs in the debug snippet from Activity 4.2.',
            '4.3 Q1: What does sw2.value() return when SW_2 is not pressed? When pressed? Why those specific values?',
            '4.3 Q2: Why can\'t you configure a pin as Pin.IN without also setting a pull resistor? What happens if you leave it out?',
            '4.3 Q3: SW_2 uses Pin.PULL_DOWN. If you changed it to Pin.PULL_UP, what would you need to change in the if statement to keep the same behavior? Why?',
            '4.3 Q4: The LED stays on all the time and nothing changes when you press the switch. List the three most likely causes you would check first.',
            '4.3 Q5: Identify and write the corrected lines for the two bugs in the debug snippet from Activity 4.3.',
            '4.4 Q1: What does PWM stand for? Explain how rapid on/off switching simulates lower power without changing voltage.',
            '4.4 Q2: duty_u16() accepts values 0–65535. What value gives 75% duty cycle? Show your calculation.',
            '4.4 Q3: What does freq() control in a PWM signal? Would you notice a difference between freq(10) and freq(1000) on an LED? Explain.',
            '4.4 Q4: Write the line inside set_brightness(percent) that calculates the duty value. Why is int() required?',
            '4.4 Q5: Identify the two bugs in the debug snippet from Activity 4.4 and write the corrected version of each line.',
            '4.5 Q1: What does duty_u16() accept and what values map to stopped, half-speed, and full speed? Show the calculation for half-speed.',
            '4.5 Q2: In set_speed(pct), the line pct = max(0, min(100, pct)) clamps the input. Trace what happens when you call set_speed(150) — what value does pct hold after that line, and why?',
            '4.5 Q3: After calling set_speed(75), you call get_speed(). What does it return? Explain what happened to _speed during both calls.',
            '4.5 Q4: You call set_speed(50) but the motor does not spin. List three distinct things you would check first, in order.',
            '4.5 Q5: Identify and write the corrected lines for the two bugs in the debug snippet from Activity 4.5.'
        ]
    },
    // ── Unit 4: Line Following Practical ────────────────────────────────
    {
        id: 52,
        title: 'Line Following Practical',
        unit: '04',
        week: 23,
        points: 75,
        phase: 'linefollow',
        description: 'Demonstrate PID-tuned line following on the course, then answer the reflection questions. Practical demonstration to Mr. Bombich must be completed before the end of Week 23.',
        requirements: [
            'Robot completes the course lap without losing the line (practical demonstration signed off by Mr. Bombich)',
            'Explain how you determined your Kp value — what happened when it was too low? Too high?',
            'Describe the role of the derivative term (Kd): what does it prevent, and how did adding it change your robot\'s behavior?',
            'What is per-sensor threshold calibration and why must it be done before running PID line following?',
            'Describe one specific iteration you made to your code or hardware during tuning and what improved'
        ]
    },
    // ── Unit 4: Servo Build Project ──────────────────────────────────────
    {
        id: 53,
        title: 'Servo Mechanism Project',
        unit: '04',
        week: 32,
        points: 100,
        phase: 'servo',
        description: 'Design, build, and program a mechanism driven by one or more servo motors. Final demo and submission due end of Week 32.',
        requirements: [
            'Design brief: problem statement, at least 3 measurable criteria, at least 2 constraints',
            'Photo or short video of your completed mechanism in operation',
            'MicroPython code submitted — servo sweeps through the required range, organized with functions, no dead code',
            'Explain your design rationale: how did you choose your servo horn position, linkage geometry, or range of motion?',
            'Document at least one iteration: what didn\'t work, what you changed, and what improved'
        ]
    },
    // ── Unit 5: AI & Machine Learning ───────────────────────────────────
    {
        id: 54,
        title: 'Teachable Machine Project',
        unit: '05',
        week: null,
        points: 50,
        phase: 'ai',
        description: 'Train a 3-class image classifier using Google Teachable Machine, deliberately build a biased model to observe its failure modes, then answer the reflection questions.',
        requirements: [
            'Name your 3 image classes and explain why each produces visually distinct training samples',
            'Describe what happened when you tested with an unexpected or ambiguous input — was the failure in the algorithm, the training data, or both?',
            'Describe the biased model you built in Step 6 — which class suffered most, and why does training sample count affect accuracy?',
            'Identify who bears responsibility when a biased model causes real harm: the data collector, the engineer who deployed it, or the company?',
            'What would you do differently in a production model compared to this 5-minute classroom activity?'
        ]
    },
];

// ============================================
// CODE RESOURCES
// ============================================
const RESOURCES = {
    micropython: {
        title: 'MicroPython Quick Reference',
        content: `
## MicroPython Quick Reference

### Variables & Types
` + '```python' + `
x = 10          # int
y = 3.14        # float
name = "LED"    # str
flag = True     # bool (capital T/F)
` + '```' + `

### Arithmetic Operators
| Operator | Meaning | Example |
|----------|---------|---------|
| ` + '`+` `-` `*` `/`' + ` | Basic math | 5 + 3 → 8 |
| ` + '`//`' + ` | Integer division | 7 // 2 → 3 |
| ` + '`%`' + ` | Remainder | 7 % 2 → 1 |
| ` + '`**`' + ` | Exponent | 2 ** 3 → 8 |

### Type Conversions
` + '```python' + `
int(3.9)     # → 3  (truncates, does not round)
float(5)     # → 5.0
str(42)      # → "42"
` + '```' + `

### Conditionals
` + '```python' + `
if x > 0:
    print("positive")
elif x == 0:
    print("zero")
else:
    print("negative")
` + '```' + `

### Loops
` + '```python' + `
while True:           # runs forever
    do_something()

for i in range(5):    # 0, 1, 2, 3, 4
    print(i)
` + '```' + `

### Functions
` + '```python' + `
def blink(duration_ms):
    led.value(1)
    time.sleep_ms(duration_ms)
    led.value(0)
    time.sleep_ms(100)

blink(400)   # call with argument
` + '```' + `

### Scope & global
` + '```python' + `
_speed = 0           # module-level variable

def set_speed(pct):
    global _speed    # must declare to write to it
    _speed = pct

def get_speed():
    return _speed    # reading is fine without global
` + '```' + `

### Clamp Pattern
` + '```python' + `
# Keep a value between lo and hi
value = max(lo, min(hi, value))

# Example - clamp 0 to 100
pct = max(0, min(100, pct))
` + '```' + `
`
    },
    pico_hw: {
        title: 'Pico 2W Hardware Reference',
        content: `
## Pico 2W Hardware Reference

### Built-in LED
` + '```python' + `
from machine import Pin
led = Pin("LED", Pin.OUT)   # use "LED" - not a number
led.value(1)    # on
led.value(0)    # off
led.toggle()    # flip state
` + '```' + `

### Digital GPIO
` + '```python' + `
from machine import Pin
btn = Pin(15, Pin.IN, Pin.PULL_DOWN)
val = btn.value()   # 0 = not pressed, 1 = pressed (PULL_DOWN)
` + '```' + `

### PWM
` + '```python' + `
from machine import Pin, PWM
pwm = PWM(Pin(16))
pwm.freq(1000)          # frequency in Hz
pwm.duty_u16(32768)     # 0 to 65535

# duty_u16 quick reference
# 0%  = 0      25% = 16384
# 50% = 32768  75% = 49152   100% = 65535
# Formula: percent * 655  (approx 655.35)
` + '```' + `

### I2C (Qwiic / STEMMA QT)
` + '```python' + `
from machine import I2C, Pin
i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400_000)
devices = i2c.scan()   # returns list of addresses
` + '```' + `

### Timing
` + '```python' + `
import time
time.sleep(1)         # 1 second
time.sleep_ms(500)    # 500 milliseconds
time.sleep_us(100)    # 100 microseconds
time.ticks_ms()       # current ms count (for timing)
` + '```' + `
`
    },
    leo_pins: {
        title: 'L.E.O. Platform - Pin Reference',
        content: `
## L.E.O. Platform - Pin Reference

**L.E.O.** = Logic, Electronics, and Operations

> Pin assignments are defined by the carrier board. Import from motor.py rather than hardcoding GPIO numbers directly.

### Motor Driver Pins
| Signal | GPIO | Notes |
|--------|------|-------|
| Left IN1 | GP2 | Direction |
| Left IN2 | GP3 | Direction |
| Left PWM | GP4 | Speed (0-65535) |
| Right IN1 | GP5 | Direction |
| Right IN2 | GP6 | Direction |
| Right PWM | GP7 | Speed (0-65535) |

*Confirm against your carrier board before running motor code.*

### I2C Bus
| Signal | GPIO |
|--------|------|
| SDA | GP0 |
| SCL | GP1 |

### Using motor.py
` + '```python' + `
import motor

motor.set_speed('left', 60)    # left motor at 60%
motor.set_speed('right', 60)   # right motor at 60%
motor.stop()                   # both motors off

speed = motor.get_speed('left')  # returns current %
` + '```' + `
`
    },
    pltw_sheet: {
        title: 'PLTW Reference Sheet',
        content: `
## PLTW Reference Sheet

### Mechanical Advantage
**MA = Load Force / Effort Force**

- MA > 1: multiplies your force (easier lift, slower motion)
- MA < 1: trades force for speed (harder lift, faster motion)
- MA = 1: changes direction only

### Efficiency
**Efficiency (%) = (Work Output / Work Input) x 100**

- Always <= 100% (friction steals energy)
- Ideal (theoretical) machines assume 100% efficiency

### Work & Power
| Formula | Units |
|---------|-------|
| W = F x d | Joules (J) |
| P = W / t | Watts (W) |
| P = F x v | Watts (W) |

### Pulley Systems
| Type | IMA | Effect |
|------|-----|--------|
| Fixed | 1 | Direction change only |
| Movable | 2 | Halves effort force |
| Compound (n movable) | 2n | Multiplies MA |

### Gear Ratio
**GR = Driven Teeth / Driver Teeth**

- GR > 1: output slower, more torque
- GR < 1: output faster, less torque
- Multi-stage: multiply each stage GR together

### Inclined Plane
**IMA = Length of slope / Rise height**

### Common Conversions
| From | To | Factor |
|------|-----|--------|
| ft-lb | J | x 1.356 |
| hp | W | x 745.7 |
| rpm | rad/s | / 9.549 |
`
    },
    thonny: {
        title: 'Thonny Setup & Troubleshooting',
        content: `
## Thonny Setup & Common Errors

### First-Time Setup
1. Open Thonny -> **Tools -> Options -> Interpreter**
2. Select **MicroPython (Raspberry Pi Pico)**
3. Port: auto-detected (COMx on Windows)
4. Click OK - red stop button appears at the bottom

### Running Code
- **F5 / Run**: runs in memory - lost on power off
- **Save to Pico as main.py**: File -> Save As -> select Pico -> name it **main.py** (runs automatically on boot)

### Common Errors
| Error | Likely Cause |
|-------|-------------|
| ` + '`NameError: name "x" is not defined`' + ` | Variable used before assignment; spelling typo |
| ` + '`SyntaxError`' + ` | Missing colon after def/if/while; bad indentation |
| ` + '`IndentationError`' + ` | Mixed tabs and spaces; body not indented |
| ` + '`AttributeError: "NoneType"`' + ` | Called method on a function that returned None |

### If the Pico Won't Connect
1. Unplug the USB cable
2. Hold BOOTSEL button on Pico -> plug USB back in -> release
3. Pico appears as USB drive (RPI-RP2)
4. Drag a fresh MicroPython .uf2 file onto the drive
5. Pico reboots - reconnect in Thonny

### REPL Tips
- Click **Stop/Restart** (red button) to get the >>> prompt
- Type one line at a time to test quickly
- Ctrl+C stops a running program
- Ctrl+D soft-resets (re-runs main.py)
`
    }
};

// ============================================
// GRADING RUBRICS
// ============================================
const RUBRICS = {
    4: {
        categories: [
            { name: 'Customized CAD Model', points: 20, criteria: [
                'Screenshot shows the ultrasonic sensor mount',
                'Evidence of personalization beyond the base model',
                'Modification is meaningful, not trivial'
            ]},
            { name: 'CAD Assembly Screenshot', points: 15, criteria: [
                'Screenshot shows Servo Mount + Servo Motor + Sensor Mount together',
                'All three components are visible and properly assembled'
            ]},
            { name: 'Sweep Code', points: 15, criteria: [
                'Code sweeps servo 0° to 180°',
                'Brief explanation of how the code works'
            ]}
        ]
    },
    5: {
        categories: [
            { name: 'Commented Code', points: 25, criteria: [
                'Key section of code (loop() or motor function) pasted in portfolio',
                'Inline comments explain what each part does and why',
                'Comments are specific — not just restating the code'
            ]},
            { name: 'Run Time', points: 25, criteria: [
                'Longest continuous run without collision recorded by teacher',
                'Top third of class earns full 25 pts',
                'Multiple attempts allowed — best run counts'
            ]},
            { name: 'Tuning Explanation', points: 15, criteria: [
                'Identifies which constants were adjusted (THRESHOLD, TURN_TIME, DRIVE_SPEED, etc.)',
                'States what values were tried and what was finally used',
                'Explains the reasoning behind the changes'
            ]},
            { name: 'Problem & Solution', points: 10, criteria: [
                'Describes at least one specific problem encountered during development or tuning',
                'Explains what caused it and how it was resolved'
            ]}
        ]
    }
};

function renderRubricCard(deliverableId) {
    const rubric = RUBRICS[deliverableId];
    if (!rubric) return '';
    const totalPts = rubric.categories.reduce((sum, c) => sum + c.points, 0);
    return `
        <div class="card" style="margin-bottom: 20px; border-left: 3px solid #8b5cf6;">
            <h4 style="margin-bottom: 0; cursor: pointer; display: flex; align-items: center; justify-content: space-between;"
                onclick="const d=this.nextElementSibling; const a=d.style.display==='none'?'block':'none'; d.style.display=a; this.querySelector('.toggle-icon').textContent=a==='none'?'▸':'▾';">
                <span><i class="fas fa-star"></i> Grading Rubric (${totalPts} pts)</span>
                <span class="toggle-icon" style="font-size: 16px;">▸</span>
            </h4>
            <div style="display: none; margin-top: 12px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--gray-200);">
                            <th style="text-align: left; padding: 8px;">Category</th>
                            <th style="text-align: center; padding: 8px; width: 60px;">Points</th>
                            <th style="text-align: left; padding: 8px;">What I'm Looking For</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rubric.categories.map(cat => `
                            <tr style="border-bottom: 1px solid var(--gray-100); vertical-align: top;">
                                <td style="padding: 8px; font-weight: 600;">${cat.name}</td>
                                <td style="padding: 8px; text-align: center; font-weight: 600;">${cat.points}</td>
                                <td style="padding: 8px;">
                                    <ul style="margin: 0; padding-left: 18px;">
                                        ${cat.criteria.map(c => `<li style="margin-bottom: 4px;">${c}</li>`).join('')}
                                    </ul>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ============================================
// APPLICATION STATE
// ============================================
let state = {
    student: null,
    weeklyReflections: {},
    deliverables: {},
    evidence: [],
    codeSnippets: [],
    viewedFeedback: [],  // Track which feedback notifications have been viewed
    currentWeek: 1,
    selectedWeek: 1,
    config: {
        skipReflectionWeeks: [8],  // default — overwritten by backend on load
        skipDeliverableWeeks: [],
        expectedVersion: null,
        reflectionDueDates: {},
        deliverableDueDates: {},
        quizEnabled: false,
        quizKey: 'claw'
    },
    quiz: {
        loaded: false,      // true once we've checked the backend
        submitted: false,   // true if this student already submitted
        grades: null,
        aiTotal: null
    }
};

let autoSaveTimer = null;
let isDirty = false;
let formInitialized = false; // Track if reflection form has been populated
let tokenClient = null; // Google OAuth2 token client
let accessToken = null; // Store access token for Drive API

// ============================================
// GOOGLE SIGN-IN INITIALIZATION
// ============================================
let googleRetryCount = 0;
const MAX_GOOGLE_RETRIES = 50; // 5 seconds max

window.onload = function () {
    // Display app version
    const versionEl = document.getElementById('appVersion');
    if (versionEl) versionEl.textContent = CONFIG.VERSION;

    // Set portfolio title based on track param
    const TRACK_TITLES = { hsaer: 'HS AE&R Portfolio', aer8th: '8th Grade Portfolio', dbl: 'D&B Lab Portfolio' };
    const titleEl = document.getElementById('portfolioTitle');
    if (titleEl && URL_TRACK) titleEl.textContent = TRACK_TITLES[URL_TRACK] || 'AE&R Portfolio';

    // Display version on sign-in modal
    const signinVersionEl = document.getElementById('signinVersion');
    if (signinVersionEl) signinVersionEl.textContent = `Version ${CONFIG.VERSION}`;

    // Show sign-in modal on page load
    document.getElementById('signinModal').classList.add('active');

    // Init navigation and static components immediately
    initNavigation();
    initDeliverables();

    // Wire sign-out button
    document.getElementById('signOutBtn').addEventListener('click', signOut);

    // Load gapi client for Drive API
    if (typeof gapi !== 'undefined') {
        gapi.load('client', initGapiClient);
    }

    // Wait for Google Identity Services to load
    waitForGoogleSignIn();
};

function waitForGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
        initGoogleOAuth();
    } else if (googleRetryCount < MAX_GOOGLE_RETRIES) {
        googleRetryCount++;
        setTimeout(waitForGoogleSignIn, 100);
    } else {
        // Show error message after timeout
        const signInBtn = document.getElementById('googleSignInBtn');
        if (signInBtn) {
            signInBtn.innerHTML = `
                <div style="color: #ef4444; text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-circle"></i><br>
                    Google Sign-In failed to load.<br>
                    <small style="color: #6b7280;">Check if ad blocker is enabled</small><br>
                    <button onclick="location.reload()" style="margin-top: 12px; padding: 8px 16px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px; background: white;">
                        Retry
                    </button>
                </div>
            `;
        }
        console.error('Google Identity Services failed to load after 5 seconds');
    }
}

function initGoogleOAuth() {
    // Initialize the token client for OAuth2 (needed for Drive API)
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        scope: 'email profile https://www.googleapis.com/auth/drive.file',
        callback: handleTokenResponse
    });

    // Create custom sign-in button
    const signInBtn = document.getElementById('googleSignInBtn');
    signInBtn.innerHTML = `
        <button class="google-signin-btn" style="
            display: flex; align-items: center; gap: 12px;
            padding: 12px 24px; border: 1px solid #dadce0; border-radius: 4px;
            background: white; cursor: pointer; font-size: 14px; font-family: 'Roboto', sans-serif;
        ">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style="width: 18px; height: 18px;">
            <span style="color: #3c4043;">Sign in with Google</span>
        </button>
    `;
    signInBtn.querySelector('button').addEventListener('click', () => {
        tokenClient.requestAccessToken();
    });
}

async function initGapiClient() {
    await gapi.client.init({});
    console.log('Google API client initialized');
}

// ============================================
// GOOGLE AUTH HANDLERS
// ============================================
async function handleTokenResponse(tokenResponse) {
    if (tokenResponse.error) {
        console.error('Token error:', tokenResponse.error);
        showToast('Sign-in failed: ' + tokenResponse.error, 'error');
        return;
    }

    // Store access token for Drive API
    accessToken = tokenResponse.access_token;

    // Set token for gapi client
    if (typeof gapi !== 'undefined' && gapi.client) {
        gapi.client.setToken({ access_token: accessToken });
    }

    // Fetch user info using the access token
    try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userInfo = await userInfoResponse.json();
        const email = userInfo.email;
        const name = userInfo.name;

        // Dismiss sign-in modal
        document.getElementById('signinModal').classList.remove('active');

        // If a track param is present, point to the right backend before loading —
        // otherwise a returning DBL/8AER student would hit the default HS AER sheet.
        if (URL_TRACK) setBackendForCourse(URL_TRACK);

        // Attempt cloud load
        const cloudData = await loadStudentFromCloud(email);
        if (cloudData && cloudData.student) {
            // Returning student
            state = cloudData;
            state.student.name = name;
            // Ensure required collections exist — guards against malformed cloud records
            // where a top-level field is missing (Object.values/entries on undefined throws)
            if (!state.weeklyReflections || typeof state.weeklyReflections !== 'object') state.weeklyReflections = {};
            if (!state.deliverables || typeof state.deliverables !== 'object') state.deliverables = {};
            if (!Array.isArray(state.evidence)) state.evidence = [];
            if (!Array.isArray(state.codeSnippets)) state.codeSnippets = [];
            if (!Array.isArray(state.viewedFeedback)) state.viewedFeedback = [];
            // config is not persisted in cloud state — restore default so it's never undefined
            state.config = { skipReflectionWeeks: [8], skipDeliverableWeeks: [], expectedVersion: null, quizEnabled: false, quizKey: 'claw', reflectionDueDates: {}, deliverableDueDates: {} };
            state.quiz = { loaded: false, submitted: false, grades: null, aiTotal: null };
            // URL_TRACK overrides stored course — lets a student in two classes
            // open each class hub and land in the correct portfolio for that session.
            setBackendForCourse(URL_TRACK || state.student.course || 'hsaer');
            restoreEvidenceLocal();
            calculateCurrentWeek();
            hideAllModals();
            onAuthenticated();
        } else if (cloudData && cloudData.loadError) {
            // Server unreachable — show persistent banner, don't treat as new student
            hideAllModals();
            showOutageBanner(email, name);
        } else {
            // New student — show profile modal
            document.getElementById('profileEmail').textContent = email;
            document.getElementById('profileModal').classList.add('active');
            state.student = { email, name };
            initProfileForm();
        }
    } catch (error) {
        console.error('Failed to get user info:', error);
        showToast('Failed to get user info', 'error');
    }
}

// ============================================
// GOOGLE DRIVE FUNCTIONS
// ============================================
const DRIVE_FOLDER_NAME = 'Portfolio Evidence';
let driveFolderId = null;

async function getOrCreateDriveFolder() {
    if (driveFolderId) return driveFolderId;
    if (!accessToken) {
        console.error('No access token for Drive');
        return null;
    }

    try {
        // Search for existing folder
        const searchResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const searchResult = await searchResponse.json();

        if (searchResult.files && searchResult.files.length > 0) {
            driveFolderId = searchResult.files[0].id;
            console.log('Found existing Drive folder:', driveFolderId);
            return driveFolderId;
        }

        // Create new folder
        const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: DRIVE_FOLDER_NAME,
                mimeType: 'application/vnd.google-apps.folder'
            })
        });
        const folder = await createResponse.json();
        driveFolderId = folder.id;
        console.log('Created Drive folder:', driveFolderId);

        // Set folder sharing to domain with link
        await setDomainSharing(driveFolderId);

        return driveFolderId;
    } catch (error) {
        console.error('Failed to get/create Drive folder:', error);
        return null;
    }
}

async function uploadToDrive(file, weekNumber) {
    const folderId = await getOrCreateDriveFolder();
    if (!folderId) {
        showToast('Could not access Google Drive', 'error');
        return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `Week${weekNumber}_${timestamp}_${file.name}`;

    try {
        // Create file metadata
        const metadata = {
            name: filename,
            parents: [folderId]
        };

        // Use multipart upload
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        const uploadResponse = await fetch(
            'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,thumbnailLink',
            {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: form
            }
        );
        const uploadedFile = await uploadResponse.json();

        if (uploadedFile.error) {
            console.error('Drive upload error:', uploadedFile.error);
            showToast('Upload failed: ' + uploadedFile.error.message, 'error');
            return null;
        }

        // Set file sharing to domain with link
        await setDomainSharing(uploadedFile.id);

        console.log('Uploaded to Drive:', uploadedFile);

        // Construct thumbnail URL using Google's thumbnail endpoint
        // This format works reliably for domain-shared files
        const thumbUrl = `https://drive.google.com/thumbnail?id=${uploadedFile.id}&sz=w400`;

        return {
            id: uploadedFile.id,
            name: uploadedFile.name,
            webViewLink: uploadedFile.webViewLink,
            thumbnailLink: thumbUrl
        };
    } catch (error) {
        console.error('Drive upload failed:', error);
        showToast('Upload failed', 'error');
        return null;
    }
}

async function setDomainSharing(fileId) {
    try {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: 'reader',
                type: 'domain',
                domain: 'vicksburgschools.org' // Your school domain
            })
        });
        console.log('Set domain sharing for:', fileId);
    } catch (error) {
        console.error('Failed to set sharing:', error);
        // Fall back to "anyone with link" if domain sharing fails
        try {
            await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    role: 'reader',
                    type: 'anyone'
                })
            });
            console.log('Fell back to anyone-with-link sharing for:', fileId);
        } catch (e) {
            console.error('Failed to set any sharing:', e);
        }
    }
}

function signOut() {
    const email = state.student ? state.student.email : '';
    google.accounts.id.revoke(email, () => {
        stopAutoSave();
        state = {
            student: null,
            weeklyReflections: {},
            deliverables: {},
            evidence: [],
            codeSnippets: [],
            currentWeek: 1,
            selectedWeek: 1
        };
        isDirty = false;
        formInitialized = false;

        // Reset sidebar
        document.getElementById('saveStatus').style.display = 'none';
        document.getElementById('signOutBtn').style.display = 'none';
        document.getElementById('studentName').textContent = 'Not Signed In';
        document.getElementById('projectBadge').textContent = 'No Project';
        document.getElementById('avatarInitials').textContent = '--';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0 / 800 pts';

        // Re-render sign-in button and show modal
        google.accounts.id.renderButton(
            document.getElementById('googleSignInBtn'),
            { theme: 'outline', size: 'large', width: 300, text: 'signin_with' }
        );
        document.getElementById('signinModal').classList.add('active');

        showToast('You have been signed out.', 'info');
    });
}

// ============================================
// CLOUD STORAGE
// ============================================
async function loadStudentFromCloud(email) {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        console.log('Google Sheets not configured — starting fresh');
        return null;
    }

    try {
        const response = await fetch(
            CONFIG.SHEETS_API_URL + '?action=load&email=' + encodeURIComponent(email)
        );
        const data = await response.json();
        return (data && data.student) ? data : null;
    } catch (error) {
        console.error('Failed to load from cloud:', error);
        return { loadError: true };
    }
}

async function saveToCloud() {
    if (CONFIG.SHEETS_API_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
        console.log('Google Sheets not configured — cannot save');
        return;
    }
    if (!state.student) return;

    captureReflectionFormData();
    setSaveIndicator('saving');

    // Prepare evidence without base64 data to reduce payload size
    const evidenceForSync = (state.evidence || []).map(e => ({
        ...e,
        data: undefined // Strip base64 data for cloud sync
    }));

    try {
        const response = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain' // Required for Google Apps Script CORS
            },
            body: JSON.stringify({
                action: 'sync',
                student: state.student,
                weeklyReflections: state.weeklyReflections,
                deliverables: state.deliverables,
                evidence: evidenceForSync,
                codeSnippets: state.codeSnippets,
                viewedFeedback: state.viewedFeedback || [],
                timestamp: new Date().toISOString()
            })
        });

        const result = await response.json();

        if (result.success) {
            isDirty = false;
            setSaveIndicator('saved');
            console.log('Synced successfully:', result.timestamp, 'Backend:', result.backendVersion);
        } else {
            console.error('Sync returned error:', result.error);
            setSaveIndicator('error');
            showToast('Sync failed: ' + (result.error || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Save to cloud failed:', error);
        setSaveIndicator('error');
        showToast('Connection error - changes saved locally', 'warning');
    }
}

// ============================================
// AUTO-SAVE
// ============================================
function startAutoSave() {
    stopAutoSave();
    autoSaveTimer = setInterval(() => {
        if (isDirty) saveToCloud();
    }, CONFIG.AUTO_SAVE_INTERVAL);
}

function stopAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}

function saveEvidenceLocal() {
    if (state.student && state.evidence.length > 0) {
        try {
            localStorage.setItem('evidence_' + state.student.email, JSON.stringify(state.evidence));
        } catch (e) {
            console.warn('localStorage full — evidence not saved locally:', e);
        }
    }
}

function restoreEvidenceLocal() {
    if (!state.student) return;
    try {
        const stored = localStorage.getItem('evidence_' + state.student.email);
        if (!stored) return;
        const localEvidence = JSON.parse(stored);
        // Restore base64 data for any items missing it (stripped during cloud sync)
        state.evidence.forEach(item => {
            if (!item.data) {
                const match = localEvidence.find(l => l.filename === item.filename && l.uploadedAt === item.uploadedAt);
                if (match) item.data = match.data;
            }
        });
        // Add any local items not yet in cloud state
        localEvidence.forEach(localItem => {
            const exists = state.evidence.some(e => e.filename === localItem.filename && e.uploadedAt === localItem.uploadedAt);
            if (!exists) state.evidence.push(localItem);
        });
    } catch (e) {
        console.warn('Failed to restore evidence from localStorage:', e);
    }
}

function markDirty() {
    isDirty = true;
    setSaveIndicator('pending');
}

function setSaveIndicator(status) {
    const statusDiv = document.getElementById('saveStatus');
    const icon = document.getElementById('saveIcon');
    const text = document.getElementById('saveText');
    statusDiv.style.display = 'block';

    const styles = {
        saving:  { cls: 'fas fa-sync-alt fa-spin', color: '#1a73e8', label: 'Saving...' },
        saved:   { cls: 'fas fa-check-circle',     color: '#4caf50', label: 'Saved' },
        pending: { cls: 'fas fa-circle',           color: '#fbbc04', label: 'Unsaved changes' },
        error:   { cls: 'fas fa-exclamation-circle', color: '#ea4335', label: 'Save failed' }
    };

    const s = styles[status] || styles.pending;
    icon.className = s.cls;
    icon.style.color = s.color;
    text.textContent = s.label;
    text.style.color = s.color;
}

// ============================================
// PROFILE SETUP (first sign-in only)
// ============================================
function initProfileForm() {
    const form = document.getElementById('profileForm');
    // Clone to clear any stale event listeners
    const fresh = form.cloneNode(true);
    form.parentNode.replaceChild(fresh, form);

    // Pre-fill course from URL param; lock dropdown so student can't pick wrong track
    if (URL_TRACK) {
        const courseSelect = fresh.querySelector('#setupCourse');
        if (courseSelect) {
            courseSelect.value = URL_TRACK;
            courseSelect.disabled = true;
        }
    }

    fresh.addEventListener('submit', (e) => {
        e.preventDefault();
        const courseSelect = document.getElementById('setupCourse');
        const course = URL_TRACK || courseSelect.value;
        state.student = {
            name: state.student.name,
            email: state.student.email,
            course: course,
            period: document.getElementById('setupPeriod').value,
            createdAt: new Date().toISOString()
        };
        setBackendForCourse(course);
        document.getElementById('profileModal').classList.remove('active');
        onAuthenticated();
        showToast('Welcome! Your portfolio is ready.', 'success');
    });
}

// ============================================
// ON AUTHENTICATED — called after sign-in is fully resolved
// ============================================
async function onAuthenticated() {
    document.getElementById('signOutBtn').style.display = 'inline-flex';

    initWeeklyReflectionForm();
    initEvidenceUpload();
    attachDirtyListeners();

    calculateCurrentWeek();

    // Load correct skip-week config before first render so the upcoming list
    // doesn't flash stale items. Fall through to updateUI() regardless.
    await fetchConfig();
    updateUI();

    startAutoSave();
    markDirty(); // ensure first state is persisted

    // Continue polling every 5 min
    setInterval(fetchConfig, 5 * 60 * 1000);
}

async function fetchConfig() {
    try {
        const res = await fetch(CONFIG.SHEETS_API_URL + '?action=getConfig&_t=' + Date.now());
        const cfg = await res.json();
        if (cfg.error) return;

        state.config.skipReflectionWeeks  = (cfg.skipReflectionWeeks  || []).map(Number);
        state.config.skipDeliverableWeeks = (cfg.skipDeliverableWeeks || []).map(Number);
        state.config.quizEnabled          = cfg.quizEnabled === true || cfg.quizEnabled === 'true';
        state.config.quizKey              = cfg.quizKey || 'claw';
        state.config.reflectionDueDates   = cfg.reflectionDueDates  || {};
        state.config.deliverableDueDates  = cfg.deliverableDueDates || {};

        const expected = cfg.expectedVersion;
        if (expected && expected !== CONFIG.VERSION) {
            // Always show the banner — never auto-reload. Auto-reload caused a
            // login vortex when the teacher portal had pushed an older expected
            // version than the deployed code.
            showUpdateBanner();
        }

        updateUI();
    } catch(e) { /* silent — keep existing config */ }
}

function showUpdateBanner() {
    if (document.getElementById('updateBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'updateBanner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#f59e0b;color:#1a1a1a;text-align:center;padding:12px 20px;font-weight:600;z-index:9999;font-size:14px;';
    banner.innerHTML = '⚠️ A new version of the portfolio is available. <a href="#" onclick="location.reload()" style="color:#1a1a1a;text-decoration:underline;font-weight:700;">Refresh the page</a> to update — your draft is auto-saved.';
    document.body.prepend(banner);
}

// ============================================
// DIRTY TRACKING
// ============================================
function attachDirtyListeners() {
    document.querySelectorAll('input, textarea, select').forEach(el => {
        el.addEventListener('input',  markDirty);
        el.addEventListener('change', markDirty);
    });

    // Watch for dynamically added contribution rows
    const contribList = document.getElementById('contributionList');
    if (contribList) {
        new MutationObserver(() => {
            contribList.querySelectorAll('input').forEach(input => {
                if (!input.dataset.dirtyListened) {
                    input.addEventListener('input', markDirty);
                    input.dataset.dirtyListened = 'true';
                }
            });
        }).observe(contribList, { childList: true, subtree: true });
    }
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });
}

function navigateTo(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `${pageId}Page`);
    });

    if (pageId === 'dashboard') updateUI();
    if (pageId === 'quiz') loadQuizPage();
}

// ============================================
// UI UPDATES
// ============================================
function updateUI() {
    if (!state.student) return;

    document.getElementById('avatarInitials').textContent = getInitials(state.student.name);
    document.getElementById('studentName').textContent = state.student.name;

    const COURSE_DISPLAY = { hsaer: 'HS AE&R', aer8th: '8th Grade AE&R', dbl: 'Design & Build Lab' };
    const course = URL_TRACK || state.student.course || 'hsaer';
    document.getElementById('projectBadge').textContent = COURSE_DISPLAY[course] || course;

    const completedDeliverables = Object.values(state.deliverables).filter(d => d.status === 'completed').length;
    document.getElementById('completedCount').textContent = completedDeliverables;
    document.getElementById('totalPoints').textContent = calculatePoints();

    const progress = calculateProgress();
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `${calculatePoints()} / ${CONFIG.POINTS.TOTAL_POSSIBLE} pts`;

    updateDashboardDeliverables();
    updateDeliverablesList();
    updateFeedbackNotification();

    const quizNav = document.getElementById('quizNavItem');
    if (quizNav) {
        quizNav.style.display = (state.config.quizEnabled || state.quiz.submitted) ? 'flex' : 'none';
        const quizLabel = quizNav.querySelector('span');
        if (quizLabel) {
            const QUIZ_LABELS = { claw: 'Claw Quiz', final_exam: 'Final Exam' };
            quizLabel.textContent = QUIZ_LABELS[state.config.quizKey] || 'Quiz';
        }
    }
}

function updateDashboardDeliverables() {
    const list = document.getElementById('dashboardDeliverablesList');
    if (!list) return;

    const unitGroups = [
        { key: '01', label: 'Unit 1 — Engineering Design Process' },
        { key: '02', label: 'Unit 2 — Fundamentals of CAD' },
        { key: '03', label: 'Unit 3 — Shop Safety' },
        { key: '04', label: 'Unit 4 — Programming, Electronics & Sensors' },
        { key: '05', label: 'Unit 5 — AI & Machine Learning' },
        { key: '06', label: 'Unit 6 — Career Readiness' },
    ];

    const skipWeeks = state.config.skipDeliverableWeeks || [];

    list.innerHTML = unitGroups.map(u => {
        const unitDeliverables = DELIVERABLES.filter(d =>
            d.unit === u.key && !d.hidden && !skipWeeks.includes(d.id)
        );
        if (!unitDeliverables.length) return '';
        return `
            <div style="margin-bottom: 24px;">
                <div style="font-size: 0.72rem; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 1px; padding-bottom: 6px; margin-bottom: 4px; border-bottom: 1px solid var(--border);">${u.label}</div>
                ${unitDeliverables.map(d => renderDashboardRow(d)).join('')}
            </div>
        `;
    }).join('');

    list.querySelectorAll('[data-dash-id]').forEach(row => {
        row.addEventListener('click', () => openDeliverableForm(parseInt(row.dataset.dashId)));
    });
}

function renderDashboardRow(d) {
    const status = state.deliverables[d.id]?.status || 'pending';
    const isAssigned = d.alwaysOpen || status === 'completed' || !!((state.config.deliverableDueDates || {})[d.id]);
    const isCompleted = status === 'completed';
    const isClickable = !isCompleted && isAssigned;

    const icon = isCompleted
        ? `<i class="fas fa-check-circle" style="color:var(--success);"></i>`
        : isAssigned
            ? `<i class="far fa-circle" style="color:#f59e0b;"></i>`
            : `<i class="far fa-circle" style="color:var(--gray-300);"></i>`;

    const titleStyle = isCompleted
        ? 'color:var(--gray-400);text-decoration:line-through;'
        : isClickable ? 'color:var(--primary);font-weight:500;' : 'color:var(--gray-400);';

    const optionalTag = d.optional ? ' <span style="font-size:0.72rem;color:var(--gray-400);">(optional)</span>' : '';

    return `<div
        ${isClickable ? `data-dash-id="${d.id}"` : ''}
        style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid var(--border);cursor:${isClickable ? 'pointer' : 'default'};"
        ${isClickable ? `onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background=''"` : ''}>
        <span style="width:20px;text-align:center;flex-shrink:0;">${icon}</span>
        <span style="flex:1;font-size:0.95rem;${titleStyle}">${d.title}${optionalTag}</span>
        <span style="font-size:0.85rem;color:var(--gray-500);white-space:nowrap;">${d.points} pts</span>
    </div>`;
}

function updateFeedbackNotification() {
    const notification = document.getElementById('feedbackNotification');
    const list = document.getElementById('feedbackNotificationList');
    const viewed = state.viewedFeedback || [];

    const gradedItems = [];

    // Check reflections for teacher feedback
    Object.entries(state.weeklyReflections).forEach(([week, reflection]) => {
        if (reflection.submitted && (reflection.teacherGrade !== undefined || reflection.teacherFeedback)) {
            const key = `reflection-${week}`;
            if (!viewed.includes(key)) {
                gradedItems.push({
                    type: 'reflection',
                    key: key,
                    week: week,
                    label: `${weekLabel(week)} Reflection`,
                    grade: reflection.teacherGrade,
                    hasFeedback: !!reflection.teacherFeedback
                });
            }
        }
    });

    // Check deliverables for teacher feedback
    Object.entries(state.deliverables).forEach(([id, deliverable]) => {
        if (deliverable.status === 'completed' && (deliverable.teacherGrade !== undefined || deliverable.teacherFeedback)) {
            const key = `deliverable-${id}`;
            if (!viewed.includes(key)) {
                const title = DELIVERABLES.find(d => d.id == id)?.title || `Deliverable ${id}`;
                gradedItems.push({
                    type: 'deliverable',
                    key: key,
                    id: id,
                    label: title,
                    grade: deliverable.teacherGrade,
                    hasFeedback: !!deliverable.teacherFeedback
                });
            }
        }
    });

    if (gradedItems.length === 0) {
        notification.style.display = 'none';
        return;
    }

    notification.style.display = 'block';
    list.innerHTML = gradedItems.map(item => `
        <a href="#" onclick="event.preventDefault(); markFeedbackViewed('${item.key}'); ${item.type === 'reflection' ? `navigateTo('weekly'); selectWeek(${item.week});` : `navigateTo('deliverables'); openDeliverable(${item.id});`}"
           style="display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: white; border-radius: 8px; text-decoration: none; color: inherit;">
            <i class="fas ${item.type === 'reflection' ? 'fa-calendar-check' : 'fa-file-alt'}" style="color: var(--success);"></i>
            <div style="flex: 1;">
                <div style="font-weight: 500;">${item.label}</div>
                <div style="font-size: 12px; color: var(--gray-500);">
                    ${item.grade !== undefined ? `Grade: ${item.grade}` : ''}
                    ${item.grade !== undefined && item.hasFeedback ? ' • ' : ''}
                    ${item.hasFeedback ? 'Written feedback available' : ''}
                </div>
            </div>
            <i class="fas fa-chevron-right" style="color: var(--gray-400);"></i>
        </a>
    `).join('');
}

function markFeedbackViewed(key) {
    if (!state.viewedFeedback) state.viewedFeedback = [];
    if (!state.viewedFeedback.includes(key)) {
        state.viewedFeedback.push(key);
        markDirty();
    }
}

function getCurrentPhase() {
    if (state.currentWeek <= 3)  return { name: 'Engineering Design', key: 'edp' };
    if (state.currentWeek <= 11) return { name: 'CAD & Manufacturing', key: 'cad' };
    if (state.currentWeek <= 13) return { name: 'Line Following', key: 'linefollow' };
    if (state.currentWeek <= 18) return { name: 'Ultrasonic Scanner', key: 'scanner' };
    if (state.currentWeek <= 22) return { name: 'Servo Claw', key: 'claw' };
    return { name: 'Final Demo', key: 'final' };
}

function calculatePoints() {
    let points = 0;
    Object.keys(state.weeklyReflections).forEach(week => {
        const reflection = state.weeklyReflections[week];
        if (reflection.submitted) {
            // Use teacher grade if available, otherwise use default points
            if (reflection.teacherGrade !== undefined) {
                points += Number(reflection.teacherGrade) || 0;
            } else {
                points += CONFIG.POINTS.WEEKLY_REFLECTION;
            }
        }
    });
    DELIVERABLES.forEach(d => {
        const deliverable = state.deliverables[d.id];
        if (deliverable?.status === 'completed') {
            // Use teacher grade if available, otherwise use default points
            if (deliverable.teacherGrade !== undefined) {
                points += Number(deliverable.teacherGrade) || 0;
            } else {
                points += d.points;
            }
        }
    });
    return points;
}

function calculateProgress() {
    return Math.round((calculatePoints() / CONFIG.POINTS.TOTAL_POSSIBLE) * 100);
}

function calculateCurrentWeek() {
    const now = new Date();
    const diffTime = now - CONFIG.SEMESTER_START;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7) + 1;
    state.currentWeek = Math.min(Math.max(1, diffWeeks), 38);
}

function updatePhaseIndicators() {
    const phases = ['linefollow', 'scanner', 'claw', 'final'];
    const phaseElements = {
        linefollow: document.getElementById('phaseLineFollow'),
        scanner:    document.getElementById('phaseScanner'),
        claw:       document.getElementById('phaseClaw'),
        final:      document.getElementById('phaseFinal')
    };

    const currentIndex = phases.indexOf(getCurrentPhase().key);

    phases.forEach((phase, index) => {
        const el = phaseElements[phase];
        if (!el) return;
        if (index < currentIndex)      { el.textContent = 'Complete';    el.style.color = '#4caf50'; }
        else if (index === currentIndex) { el.textContent = 'In Progress'; el.style.color = '#1a73e8'; }
        else                            { el.textContent = 'Upcoming';   el.style.color = '#9aa0a6'; }
    });
}

function updateUpcoming() {
    const list = document.getElementById('upcomingList');
    const upcoming = [];

    if (!state.config.skipReflectionWeeks.includes(state.currentWeek) && !state.weeklyReflections[state.currentWeek]?.submitted) {
        upcoming.push({ title: `${weekLabel(state.currentWeek)} Reflection`, due: 'Friday', points: 20, overdue: false });
    }

    const currentDeliverable = DELIVERABLES.find(d => !d.hidden && d.week === state.currentWeek);
    if (currentDeliverable && !currentDeliverable.optional
            && !state.config.skipDeliverableWeeks.includes(currentDeliverable.id)
            && state.deliverables[currentDeliverable.id]?.status !== 'completed') {
        upcoming.push({ title: currentDeliverable.title, due: `End of Week ${state.currentWeek}`, points: currentDeliverable.points, overdue: false });
    }

    for (let week = 1; week < state.currentWeek; week++) {
        if (!state.config.skipReflectionWeeks.includes(week) && !state.weeklyReflections[week]?.submitted) {
            upcoming.unshift({ title: `${weekLabel(week)} Reflection`, due: 'OVERDUE', points: 20, overdue: true });
        }
        // Check for overdue deliverables from previous weeks (skip optional and skipped weeks)
        const overdueDeliverable = DELIVERABLES.find(d => !d.hidden && d.week === week);
        if (overdueDeliverable && !overdueDeliverable.optional
                && !state.config.skipDeliverableWeeks.includes(overdueDeliverable.id)
                && !!state.config.deliverableDueDates[overdueDeliverable.id]
                && state.deliverables[overdueDeliverable.id]?.status !== 'completed') {
            upcoming.unshift({ title: overdueDeliverable.title, due: 'OVERDUE', points: overdueDeliverable.points, overdue: true });
        }
    }

    list.innerHTML = upcoming.length === 0
        ? '<p style="color: var(--success); padding: 20px; text-align: center;"><i class="fas fa-check-circle"></i> All caught up!</p>'
        : upcoming.map(item => `
            <div class="upcoming-item ${item.overdue ? 'overdue' : ''}">
                <div class="title">${item.title}</div>
                <div class="due-date">${item.due}</div>
                <div class="points">${item.points} pts</div>
            </div>
        `).join('');
}

function updateWeekButtons() {
    document.querySelectorAll('.week-btn').forEach(btn => {
        const week = parseInt(btn.dataset.week);
        const skipped    = state.config.skipReflectionWeeks.includes(week);
        const isSubmitted = !!state.weeklyReflections[week]?.submitted;
        const hasDate     = !!state.config.reflectionDueDates[week];
        btn.style.display = skipped ? 'none' : '';
        btn.classList.toggle('completed',    isSubmitted);
        btn.classList.toggle('active',       week === state.selectedWeek);
        btn.classList.toggle('not-assigned', !isSubmitted && !hasDate && !skipped);
    });
}

function updateWeekTopic() {
    const topic = WEEK_TOPICS[state.selectedWeek];
    const topicEl = document.getElementById('weekTopic');
    if (topic && topicEl) {
        topicEl.innerHTML = `
            <div class="card" style="background: var(--primary-light); border-left: 4px solid var(--primary);">
                <h4 style="margin-bottom: 5px;">${weekLabel(state.selectedWeek)}: ${topic.title}</h4>
                <p style="color: var(--gray-600); margin: 0;">Focus: ${topic.focus}</p>
            </div>
        `;
    }
}

function renderDeliverableCard(d) {
    const status = state.deliverables[d.id]?.status || 'pending';
    const isCurrent = d.week === state.currentWeek;
    const isAssigned = d.alwaysOpen || status === 'completed' || !!state.config.deliverableDueDates[d.id];
    return `
        <div class="deliverable-card ${status} ${isCurrent ? 'current' : ''} ${!isAssigned ? 'not-assigned' : ''}" data-id="${d.id}">
            <div class="deliverable-number">${status === 'completed' ? '<i class="fas fa-check"></i>' : formatDeliverableLabel(d.id)}</div>
            <div class="deliverable-info">
                <div class="deliverable-title">${d.title}</div>
                <div class="deliverable-meta">
                    <span>Unit ${d.unit || '?'}</span>
                    <span>${formatPhase(d.phase)}</span>
                    <span class="deliverable-points">${d.points} pts</span>
                </div>
            </div>
            <div class="deliverable-status status-${status}">${formatStatus(status)}</div>
        </div>
    `;
}

function updateDeliverablesList() {
    const list = document.getElementById('deliverablesList');
    const activePhase = document.querySelector('.phase-tab.active')?.dataset.phase || 'all';

    const filtered = (activePhase === 'all' ? DELIVERABLES : DELIVERABLES.filter(d => d.phase === activePhase))
        .filter(d => !d.hidden && !state.config.skipDeliverableWeeks.includes(d.id));

    if (activePhase === 'all') {
        const unitGroups = [
            { key: '01', label: 'Unit 1 — Engineering Design Process' },
            { key: '02', label: 'Unit 2 — Fundamentals of CAD' },
            { key: '03', label: 'Unit 3 — Shop Safety' },
            { key: '04', label: 'Unit 4 — Programming, Electronics & Sensors' },
            { key: '05', label: 'Unit 5 — AI & Machine Learning' },
            { key: '06', label: 'Unit 6 — Career Readiness' },
        ];
        list.innerHTML = unitGroups.map(u => {
            const unitDeliverables = filtered.filter(d => d.unit === u.key);
            if (!unitDeliverables.length) return '';
            return `
                <div class="unit-group">
                    <h4 class="unit-group-label">${u.label}</h4>
                    ${unitDeliverables.map(d => renderDeliverableCard(d)).join('')}
                </div>
            `;
        }).join('');
    } else {
        list.innerHTML = filtered.map(d => renderDeliverableCard(d)).join('');
    }

    list.querySelectorAll('.deliverable-card').forEach(card => {
        card.addEventListener('click', () => openDeliverableForm(parseInt(card.dataset.id)));
    });

    document.querySelectorAll('.phase-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.phase-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            updateDeliverablesList();
        });
    });
}

// ============================================
// WEEKLY REFLECTIONS
// ============================================
function initWeeklyReflectionForm() {
    document.querySelectorAll('.week-btn').forEach(btn => {
        btn.addEventListener('click', () => selectWeek(parseInt(btn.dataset.week)));
    });

    const addContrib = document.getElementById('addContribution');
    if (addContrib) addContrib.addEventListener('click', addContributionRow);

    const reflForm = document.getElementById('weeklyReflectionForm');
    if (reflForm) reflForm.addEventListener('submit', submitWeeklyReflection);

    const saveDraft = document.getElementById('saveReflectionDraft');
    if (saveDraft) saveDraft.addEventListener('click', saveReflectionDraft);

    document.querySelectorAll('.rubric-options input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            updateRubricScore();
            markDirty();
        });
    });

    if (document.getElementById('reflectionWeek')) selectWeek(state.currentWeek);
}

function selectWeek(week) {
    // Only capture form data if form has been populated (not on initial load)
    if (formInitialized) {
        captureReflectionFormData();
    }

    state.selectedWeek = week;
    document.getElementById('reflectionWeek').value = week;
    updateWeekButtons();
    updateWeekTopic();

    const existingData = state.weeklyReflections[week];
    if (existingData) {
        loadReflectionData(existingData);
    } else {
        clearReflectionForm();
    }

    // Mark form as initialized after first load
    formInitialized = true;
}

function addContributionRow() {
    const list = document.getElementById('contributionList');
    const newItem = document.createElement('div');
    newItem.className = 'contribution-item';
    newItem.innerHTML = `
        <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
        <input type="text" class="contrib-task" placeholder="I worked on..." required>
        <button type="button" class="btn btn-small" onclick="this.parentElement.remove()" style="padding: 8px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    list.appendChild(newItem);
}

function loadReflectionData(data) {
    const contribList = document.getElementById('contributionList');
    contribList.innerHTML = '';

    (data.contributions || []).forEach((contrib, index) => {
        const item = document.createElement('div');
        item.className = 'contribution-item';
        item.innerHTML = `
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" value="${contrib.date}" required>
            <input type="text" class="contrib-task" value="${contrib.task}" required>
            ${index >= 3 ? '<button type="button" class="btn btn-small" onclick="this.parentElement.remove()" style="padding: 8px;"><i class="fas fa-times"></i></button>' : ''}
        `;
        contribList.appendChild(item);
    });

    while (contribList.children.length < 3) addContributionRow();

    document.getElementById('evidenceLinks').value = data.evidenceLinks || '';
    document.getElementById('challenges').value = data.challenges || '';
    document.getElementById('solutions').value = data.solutions || '';

    const goalInputs = document.querySelectorAll('.goal-input');
    (data.goals || []).forEach((goal, index) => {
        if (goalInputs[index]) goalInputs[index].value = goal;
    });

    // Restore rubric selections
    if (data.rubric) {
        const rubricFields = ['Detail', 'Evidence', 'ProblemSolving', 'Goals'];
        rubricFields.forEach(field => {
            const value = data.rubric[field.toLowerCase()] || data.rubric[field.charAt(0).toLowerCase() + field.slice(1)];
            if (value) {
                const radio = document.querySelector(`input[name="rubric${field}"][value="${value}"]`);
                if (radio) radio.checked = true;
            }
        });
        updateRubricScore();
    } else {
        // Clear rubric if no data
        document.querySelectorAll('.rubric-options input[type="radio"]').forEach(r => r.checked = false);
        updateRubricScore();
    }

    // Restore evidence thumbnails for the selected week from state
    const preview = document.getElementById('evidencePreview');
    preview.innerHTML = '';
    state.evidence
        .filter(ev => ev.week === state.selectedWeek && (ev.data || ev.thumbnailLink))
        .forEach(ev => {
            const imgSrc = ev.thumbnailLink || ev.data;
            const thumb = document.createElement('div');
            thumb.className = 'evidence-thumb';
            thumb.innerHTML = `
                <img src="${imgSrc}" alt="Evidence" onerror="this.src='${PLACEHOLDER_IMG}'">
                <button type="button" class="remove-btn" onclick="removeEvidence('${ev.driveId || ''}', this.parentElement)">
                    <i class="fas fa-times"></i>
                </button>
            `;
            preview.appendChild(thumb);
        });

    // Hide validation errors when loading
    document.getElementById('validationErrors').style.display = 'none';

    // Show teacher feedback if available
    showTeacherFeedback(data);
}

function showTeacherFeedback(data) {
    const feedbackCard = document.getElementById('teacherFeedbackCard');
    const gradeDisplay = document.getElementById('teacherGradeDisplay');
    const feedbackText = document.getElementById('teacherFeedbackText');

    if (data.submitted && (data.teacherGrade !== undefined || data.teacherFeedback)) {
        feedbackCard.style.display = 'block';
        gradeDisplay.textContent = data.teacherGrade !== undefined ? data.teacherGrade : '--';
        feedbackText.textContent = data.teacherFeedback || 'No written feedback yet.';
    } else {
        feedbackCard.style.display = 'none';
    }
}

function clearReflectionForm() {
    document.getElementById('weeklyReflectionForm').reset();
    document.getElementById('contributionList').innerHTML = `
        <div class="contribution-item">
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
            <input type="text" class="contrib-task" placeholder="I wired the..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
            <input type="text" class="contrib-task" placeholder="I coded the..." required>
        </div>
        <div class="contribution-item">
            <input type="date" class="contrib-date" min="2020-01-01" max="2030-12-31" required>
            <input type="text" class="contrib-task" placeholder="I tested/debugged..." required>
        </div>
    `;
    document.getElementById('evidencePreview').innerHTML = '';

    // Clear rubric selections
    document.querySelectorAll('.rubric-options input[type="radio"]').forEach(r => r.checked = false);
    updateRubricScore();

    // Hide validation errors
    document.getElementById('validationErrors').style.display = 'none';

    // Hide teacher feedback
    document.getElementById('teacherFeedbackCard').style.display = 'none';
}

function getReflectionFormData() {
    const contributions = [];
    document.querySelectorAll('.contribution-item').forEach(item => {
        const date = item.querySelector('.contrib-date').value;
        const task = item.querySelector('.contrib-task').value;
        if (date && task) {
            // Reject dates with unreasonable years (prevents year-10000 data corruption)
            const year = parseInt(date.substring(0, 4));
            if (year >= 2020 && year <= 2030) {
                contributions.push({ date, task });
            }
        }
    });

    const goals = [];
    document.querySelectorAll('.goal-input').forEach(input => {
        if (input.value) goals.push(input.value);
    });

    // Get rubric scores
    const rubric = {
        detail: parseInt(document.querySelector('input[name="rubricDetail"]:checked')?.value) || 0,
        evidence: parseInt(document.querySelector('input[name="rubricEvidence"]:checked')?.value) || 0,
        problemSolving: parseInt(document.querySelector('input[name="rubricProblemSolving"]:checked')?.value) || 0,
        goals: parseInt(document.querySelector('input[name="rubricGoals"]:checked')?.value) || 0
    };
    rubric.total = rubric.detail + rubric.evidence + rubric.problemSolving + rubric.goals;

    return {
        week: state.selectedWeek,
        contributions,
        evidenceLinks: document.getElementById('evidenceLinks').value,
        challenges: document.getElementById('challenges').value,
        solutions: document.getElementById('solutions').value,
        goals,
        rubric,
        updatedAt: new Date().toISOString()
    };
}

function captureReflectionFormData() {
    if (!state.selectedWeek) return;
    if (!document.getElementById('evidenceLinks')) return;
    const data = getReflectionFormData();
    const existing = state.weeklyReflections[state.selectedWeek];
    if (existing) {
        data.submitted = existing.submitted;
        data.submittedAt = existing.submittedAt;
        // Preserve teacher feedback (read-only from student perspective)
        data.teacherGrade = existing.teacherGrade;
        data.teacherFeedback = existing.teacherFeedback;
    }
    state.weeklyReflections[state.selectedWeek] = data;
}

function saveReflectionDraft() {
    const data = getReflectionFormData();
    data.submitted = false;
    // Preserve teacher feedback (read-only from student perspective)
    const existing = state.weeklyReflections[data.week];
    if (existing) {
        data.teacherGrade = existing.teacherGrade;
        data.teacherFeedback = existing.teacherFeedback;
    }
    state.weeklyReflections[data.week] = data;
    markDirty();
    showToast('Draft saved!', 'success');
}

function validateReflection(data) {
    const errors = [];
    const MIN_TASK_LENGTH = 15;
    const MIN_TEXT_LENGTH = 30;
    const MIN_GOAL_LENGTH = 10;

    // Check contributions count
    if (data.contributions.length < 3) {
        errors.push('Add at least 3 work contributions');
    }

    // Check contribution task lengths
    data.contributions.forEach((c, i) => {
        if (c.task.length < MIN_TASK_LENGTH) {
            errors.push(`Contribution ${i + 1} needs more detail (${c.task.length}/${MIN_TASK_LENGTH} characters)`);
        }
    });

    // Check challenges and solutions
    if (data.challenges.length < MIN_TEXT_LENGTH) {
        errors.push(`Challenges needs more detail (${data.challenges.length}/${MIN_TEXT_LENGTH} characters)`);
    }
    if (data.solutions.length < MIN_TEXT_LENGTH) {
        errors.push(`Solutions needs more detail (${data.solutions.length}/${MIN_TEXT_LENGTH} characters)`);
    }

    // Check goals
    data.goals.forEach((g, i) => {
        if (g.length < MIN_GOAL_LENGTH) {
            errors.push(`Goal ${i + 1} needs more detail (${g.length}/${MIN_GOAL_LENGTH} characters)`);
        }
    });

    // Evidence (photos/links) is optional — not validated.

    // Check rubric is completed
    if (data.rubric.total === 0) {
        errors.push('Complete the self-assessment rubric');
    }

    return errors;
}

function showValidationErrors(errors) {
    const container = document.getElementById('validationErrors');
    const list = document.getElementById('errorList');

    if (errors.length === 0) {
        container.style.display = 'none';
        return;
    }

    list.innerHTML = errors.map(e => `<li>${e}</li>`).join('');
    container.style.display = 'block';
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateRubricScore() {
    const detail = parseInt(document.querySelector('input[name="rubricDetail"]:checked')?.value) || 0;
    const evidence = parseInt(document.querySelector('input[name="rubricEvidence"]:checked')?.value) || 0;
    const problemSolving = parseInt(document.querySelector('input[name="rubricProblemSolving"]:checked')?.value) || 0;
    const goals = parseInt(document.querySelector('input[name="rubricGoals"]:checked')?.value) || 0;
    const total = detail + evidence + problemSolving + goals;

    const scoreEl = document.getElementById('rubricScore');
    if (scoreEl) {
        scoreEl.innerHTML = `<strong>Self-Assessment Total:</strong> ${total} / 16 points`;
        scoreEl.style.color = total >= 12 ? 'var(--success)' : total >= 8 ? 'var(--warning)' : 'var(--gray-600)';
    }
}

function submitWeeklyReflection(e) {
    e.preventDefault();

    if (!state.config.reflectionDueDates[state.selectedWeek]) {
        showToast('This reflection hasn\'t been assigned yet.', 'error');
        return;
    }

    const data = getReflectionFormData();

    // Validate
    const errors = validateReflection(data);
    showValidationErrors(errors);

    if (errors.length > 0) {
        showToast('Please fix the errors before submitting', 'error');
        return;
    }

    data.submitted = true;
    data.submittedAt = new Date().toISOString();
    // Preserve teacher feedback (read-only from student perspective)
    const existing = state.weeklyReflections[data.week];
    if (existing) {
        data.teacherGrade = existing.teacherGrade;
        data.teacherFeedback = existing.teacherFeedback;
    }
    state.weeklyReflections[data.week] = data;
    saveToCloud(); // immediate save on submission
    updateUI();

    // Hide validation errors on success
    document.getElementById('validationErrors').style.display = 'none';

    showCelebration(`${weekLabel(data.week)} Reflection Submitted!`);
}

// ============================================
// EVIDENCE UPLOAD
// ============================================
function initEvidenceUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput  = document.getElementById('evidenceFiles');
    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary)';
    });
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '';
    });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));
}

async function handleFiles(files) {
    const preview = document.getElementById('evidencePreview');

    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        // Show uploading placeholder
        const thumb = document.createElement('div');
        thumb.className = 'evidence-thumb uploading';
        thumb.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--gray-100);">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: var(--gray-400);"></i>
            </div>
        `;
        preview.appendChild(thumb);

        // Upload to Google Drive
        const driveFile = await uploadToDrive(file, state.selectedWeek);

        if (driveFile) {
            // Success - update thumbnail with Drive image
            thumb.classList.remove('uploading');
            thumb.innerHTML = `
                <img src="${driveFile.thumbnailLink}" alt="Evidence" onerror="this.src='${PLACEHOLDER_IMG}'">
                <button type="button" class="remove-btn" onclick="removeEvidence('${driveFile.id}', this.parentElement)">
                    <i class="fas fa-times"></i>
                </button>
            `;

            state.evidence.push({
                type: 'weekly',
                week: state.selectedWeek,
                driveId: driveFile.id,
                filename: driveFile.name,
                thumbnailLink: driveFile.thumbnailLink,
                webViewLink: driveFile.webViewLink,
                uploadedAt: new Date().toISOString()
            });
            markDirty();
            showToast('Photo uploaded to Google Drive', 'success');
        } else {
            // Failed - remove placeholder
            thumb.remove();
        }
    }
}

function removeEvidence(driveId, element) {
    // Remove from state
    state.evidence = state.evidence.filter(e => e.driveId !== driveId);
    // Remove from DOM
    element.remove();
    markDirty();
    // Note: We don't delete from Drive - student keeps ownership
}

function compressImage(dataURL, callback) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale down to max 1200px width while maintaining aspect ratio
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Export as JPEG at 80% quality (significantly smaller than PNG)
        callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataURL;
}

function loadEvidenceGallery() {
    const gallery = document.getElementById('evidenceGallery');

    if (state.evidence.length === 0) {
        gallery.innerHTML = '<p class="placeholder-text">No evidence uploaded yet.</p>';
        return;
    }

    gallery.innerHTML = state.evidence.map(item => {
        // Support both new Drive-based and legacy base64 evidence
        const imgSrc = item.thumbnailLink || item.data || '${PLACEHOLDER_IMG}';
        const viewLink = item.webViewLink || '#';

        return `
            <div class="gallery-item" data-type="${item.type}">
                <a href="${viewLink}" target="_blank" title="View full size">
                    <img src="${imgSrc}" alt="${item.filename || 'Evidence'}" onerror="this.src='${PLACEHOLDER_IMG}'">
                </a>
                <div class="gallery-item-info">
                    <div class="date">${item.uploadedAt ? new Date(item.uploadedAt).toLocaleDateString() : 'Unknown'}</div>
                    <div class="caption">Week ${item.week || '?'}</div>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// DELIVERABLES
// ============================================
function initDeliverables() {
    document.getElementById('closeDeliverableModal').addEventListener('click', () => {
        document.getElementById('deliverableModal').classList.remove('active');
    });
}

function openDeliverableForm(id) {
    const deliverable = DELIVERABLES.find(d => d.id === id);
    const existing = state.deliverables[id] || {};

    const modal = document.getElementById('deliverableModal');
    const content = document.getElementById('deliverableFormContent');

    content.innerHTML = `
        <h2><i class="fas fa-clipboard-list"></i> ${deliverable.title}</h2>
        <p style="color: var(--gray-600); margin-bottom: 20px;">${deliverable.description}</p>

        <div style="display: flex; gap: 16px; margin-bottom: 20px;">
            <span style="background: var(--primary-light); color: var(--primary); padding: 6px 12px; border-radius: 20px; font-size: 14px;">
                ${deliverable.unit ? 'Unit ' + deliverable.unit : 'Week ' + deliverable.week}
            </span>
            <span style="background: #e8f5e9; color: var(--success); padding: 6px 12px; border-radius: 20px; font-size: 14px;">
                ${deliverable.points} points
            </span>
        </div>

        <div class="card" style="background: var(--gray-50);">
            <h4 style="margin-bottom: 12px;">Requirements</h4>
            <ul style="margin-left: 20px;">
                ${deliverable.requirements.map(r => `<li style="margin-bottom: 8px;">${r}</li>`).join('')}
            </ul>
        </div>

        ${renderRubricCard(id)}

        <form id="deliverableForm" style="margin-top: 20px;">

            ${deliverable.hasLevelSelect ? `
            <div class="form-group">
                <label>Completion Level</label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 6px;">
                    ${[['L1','Level 1 — Replicate exactly'],['L2','Level 2 — Modify + document'],['L3','Level 3 — Custom design']].map(([val, label]) => `
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 16px;border:2px solid ${existing.level===val?'var(--primary)':'var(--gray-200)'};border-radius:8px;font-weight:${existing.level===val?'600':'400'};transition:border-color 0.15s;">
                        <input type="radio" name="cadLevel" value="${val}" ${existing.level===val?'checked':''} style="accent-color:var(--primary);">
                        ${label}
                    </label>`).join('')}
                </div>
            </div>` : ''}

            ${deliverable.questions?.length ? `
            <div class="form-group">
                <label>Learning Check — Q1–Q5</label>
                <p style="font-size:13px;color:var(--gray-500);margin-bottom:14px;margin-top:4px;">Answer in your own words (2–4 sentences each). Answer from what you built — not from notes.</p>
                ${deliverable.questions.map((q, i) => `
                <div style="margin-bottom:16px;">
                    <label for="cad-q${i+1}" style="font-size:14px;font-weight:500;margin-bottom:6px;display:block;">Q${i+1}: ${q}</label>
                    <textarea id="cad-q${i+1}" rows="3" placeholder="Your answer…" style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:13px;resize:vertical;box-sizing:border-box;">${existing['q'+(i+1)]||''}</textarea>
                </div>`).join('')}
            </div>` : ''}

            ${deliverable.timeLimit ? `
            <div class="form-group">
                <label for="completionTime">Completion Time (seconds)</label>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="number" id="completionTime" min="0" max="${deliverable.timeLimit * 2}" step="1"
                           value="${existing.completionTime || ''}"
                           placeholder="e.g. 45"
                           style="width: 120px;">
                    <span style="color: var(--gray-500); font-size: 14px;">
                        Time limit: ${deliverable.timeLimit} seconds (${Math.floor(deliverable.timeLimit / 60)}:${String(deliverable.timeLimit % 60).padStart(2, '0')})
                    </span>
                </div>
            </div>
            ` : ''}


            ${id === 0 ? `
            <div style="margin-bottom:8px;">

              <!-- top bar -->
              <div style="background:var(--gray-50);border-radius:8px;padding:10px 16px;margin-bottom:20px;border:1px solid var(--gray-200);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                <span style="font-size:13px;color:var(--gray-600);">Work through all three days — your draft saves automatically.</span>
                <a href="../../Unit_06_Career_Ready_Practices/CRP_Student_Activity.html" target="_blank"
                   style="font-size:13px;color:var(--primary);font-weight:600;white-space:nowrap;">Printable Version ↗</a>
              </div>

              <!-- DAY 1 -->
              <div style="background:var(--gray-800);color:#fff;padding:12px 16px;border-radius:8px;margin-bottom:14px;">
                <h3 style="margin:0;font-size:15px;font-weight:700;">Day 1 — Where Could This Take You?</h3>
                <p style="margin:3px 0 0;font-size:12px;opacity:.75;">Research at least 3 careers or trades on bls.gov/ooh — engineering AND trades both qualify.</p>
              </div>
              <div class="card" style="margin-bottom:20px;border-left:3px solid var(--primary);overflow-x:auto;">
                <p style="font-size:13px;color:var(--gray-500);margin-bottom:10px;">Browse Architecture &amp; Engineering, Installation &amp; Repair, or Construction &amp; Extraction. Electricians, welders, HVAC techs, CNC machinists, and plumbers all qualify. "Connection to This Class" = something you actually did — motors, wiring, programming, CAD, sensors.</p>
                <div style="overflow-x:auto;">
                  <table style="width:100%;border-collapse:collapse;font-size:13px;min-width:620px;">
                    <thead>
                      <tr style="border-bottom:2px solid var(--gray-200);">
                        <th style="padding:7px 6px;text-align:left;font-size:11px;color:var(--gray-500);font-weight:600;">#</th>
                        <th style="padding:7px 6px;text-align:left;font-size:11px;color:var(--gray-500);font-weight:600;">Career / Trade Title</th>
                        <th style="padding:7px 6px;text-align:left;font-size:11px;color:var(--gray-500);font-weight:600;">Median Annual Salary</th>
                        <th style="padding:7px 6px;text-align:left;font-size:11px;color:var(--gray-500);font-weight:600;">Education / Training</th>
                        <th style="padding:7px 6px;text-align:left;font-size:11px;color:var(--gray-500);font-weight:600;">10-Yr Growth</th>
                        <th style="padding:7px 6px;text-align:left;font-size:11px;color:var(--gray-500);font-weight:600;">Connection to This Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${[1,2,3].map(n => `
                      <tr style="border-bottom:1px solid var(--gray-100);">
                        <td style="padding:5px 6px;font-weight:700;color:var(--gray-400);">${n}</td>
                        <td style="padding:4px 3px;"><input type="text" id="d0C${n}Title" value="${existing['career'+n+'Title']||''}" placeholder="e.g. Electrician" style="width:100%;padding:5px;border:1px solid var(--gray-200);border-radius:4px;font-size:12px;min-width:110px;"></td>
                        <td style="padding:4px 3px;"><input type="text" id="d0C${n}Salary" value="${existing['career'+n+'Salary']||''}" placeholder="$61,590" style="width:80px;padding:5px;border:1px solid var(--gray-200);border-radius:4px;font-size:12px;"></td>
                        <td style="padding:4px 3px;"><input type="text" id="d0C${n}Edu" value="${existing['career'+n+'Edu']||''}" placeholder="Apprenticeship" style="width:100%;padding:5px;border:1px solid var(--gray-200);border-radius:4px;font-size:12px;min-width:100px;"></td>
                        <td style="padding:4px 3px;"><input type="text" id="d0C${n}Growth" value="${existing['career'+n+'Growth']||''}" placeholder="11%" style="width:48px;padding:5px;border:1px solid var(--gray-200);border-radius:4px;font-size:12px;"></td>
                        <td style="padding:4px 3px;"><input type="text" id="d0C${n}Connect" value="${existing['career'+n+'Connect']||''}" placeholder="Motor wiring, sensors…" style="width:100%;padding:5px;border:1px solid var(--gray-200);border-radius:4px;font-size:12px;min-width:120px;"></td>
                      </tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- DAY 2 -->
              <div style="background:var(--gray-800);color:#fff;padding:12px 16px;border-radius:8px;margin-bottom:14px;">
                <h3 style="margin:0;font-size:15px;font-weight:700;">Day 2 — The Real Numbers</h3>
                <p style="margin:3px 0 0;font-size:12px;opacity:.75;"><a href="https://smartasset.com/taxes/paycheck-calculator" target="_blank" style="color:#adf;">smartasset.com/taxes/paycheck-calculator</a> (Michigan, Single) &nbsp;·&nbsp; <a href="https://www.nerdwallet.com/cost-of-living-calculator" target="_blank" style="color:#adf;">nerdwallet.com/cost-of-living-calculator</a></p>
              </div>

              <!-- Part A: Paycheck -->
              <div class="card" style="margin-bottom:14px;border-left:3px solid var(--success);">
                <h4 style="margin-bottom:10px;font-size:14px;"><i class="fas fa-dollar-sign"></i> Part A — Your Paycheck</h4>
                <p style="font-size:13px;color:var(--gray-500);margin-bottom:12px;">Pick the career you want to analyze in depth. Enter its median salary into the SmartAsset calculator (Michigan, Single filing status) and record the results.</p>
                <div class="form-group" style="margin-bottom:12px;">
                  <label style="font-size:13px;font-weight:600;">Career chosen for this analysis</label>
                  <input type="text" id="d0Career" value="${existing.careerTitle||''}" placeholder="e.g. Electrician"
                         style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:14px;margin-top:4px;box-sizing:border-box;">
                </div>
                <div style="display:flex;gap:12px;flex-wrap:wrap;">
                  <div style="flex:1;min-width:130px;">
                    <label style="display:block;font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:4px;">Median Annual Salary (BLS)</label>
                    <input type="number" id="d0Salary" value="${existing.medianSalary||''}" placeholder="e.g. 61590"
                           style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:14px;box-sizing:border-box;">
                  </div>
                  <div style="flex:1;min-width:130px;">
                    <label style="display:block;font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:4px;">Monthly Take-Home (Net Pay)</label>
                    <input type="number" id="d0MonthlyNet" value="${existing.monthlyNet||''}" placeholder="e.g. 3800"
                           class="d0-net-input"
                           style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:14px;box-sizing:border-box;">
                  </div>
                </div>
              </div>

              <!-- Part B: Monthly Budget -->
              <div class="card" style="margin-bottom:14px;border-left:3px solid #f59e0b;">
                <h4 style="margin-bottom:8px;font-size:14px;"><i class="fas fa-wallet"></i> Part B — Monthly Budget</h4>
                <p style="font-size:13px;color:var(--gray-500);margin-bottom:10px;">Use your monthly take-home as your income. Michigan averages shown as a guide — adjust for your situation.</p>
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                  <thead>
                    <tr style="border-bottom:2px solid var(--gray-200);">
                      <th style="text-align:left;padding:6px 8px;font-size:12px;color:var(--gray-500);font-weight:600;">Category</th>
                      <th style="text-align:center;padding:6px 8px;font-size:12px;color:var(--gray-500);font-weight:600;">Monthly ($)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Housing <span style="font-size:11px;color:var(--gray-400);">~$950–1,100</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgHousing" value="${existing.budgHousing||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Transportation <span style="font-size:11px;color:var(--gray-400);">~$400–600</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgTransport" value="${existing.budgTransport||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Groceries <span style="font-size:11px;color:var(--gray-400);">~$250–350</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgGroceries" value="${existing.budgGroceries||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Utilities <span style="font-size:11px;color:var(--gray-400);">~$150–200</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgUtilities" value="${existing.budgUtilities||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Cell phone <span style="font-size:11px;color:var(--gray-400);">~$50–80</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgPhone" value="${existing.budgPhone||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Health insurance / co-pays <span style="font-size:11px;color:var(--gray-400);">~$100–200</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgHealth" value="${existing.budgHealth||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Savings <span style="font-size:11px;color:var(--gray-400);">goal: 10–20% of take-home</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgSavings" value="${existing.budgSavings||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-bottom:1px solid var(--gray-100);"><td style="padding:5px 8px;">Personal / Entertainment <span style="font-size:11px;color:var(--gray-400);">~$100–200</span></td><td style="padding:4px 8px;text-align:center;"><input type="number" id="d0BudgEntertain" value="${existing.budgEntertain||''}" placeholder="0" class="d0-budget-input" style="width:84px;padding:5px;text-align:center;border:1px solid var(--gray-200);border-radius:4px;font-size:13px;"></td></tr>
                    <tr style="border-top:2px solid var(--gray-200);background:var(--gray-50);">
                      <td style="padding:7px 8px;font-weight:700;font-size:13px;">Total Monthly Expenses</td>
                      <td style="padding:7px 8px;text-align:center;font-weight:700;" id="d0BudgTotal">—</td>
                    </tr>
                    <tr style="background:var(--gray-50);">
                      <td style="padding:7px 8px;font-weight:700;font-size:13px;">Remaining After Expenses</td>
                      <td style="padding:7px 8px;text-align:center;font-weight:700;" id="d0BudgRemaining">—</td>
                    </tr>
                  </tbody>
                </table>
                <div style="margin-top:14px;">
                  <label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px;">Budget Check</label>
                  <p style="font-size:12px;color:var(--gray-500);margin-bottom:6px;">1) Does your budget balance? If not, what would you cut first?&nbsp;&nbsp;2) If an unexpected expense hit ($800 car repair, medical bill) — where does that money come from?</p>
                  <textarea id="d0BudgetResp" rows="3" placeholder="Answer both questions in 2–4 sentences…" style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:13px;resize:vertical;box-sizing:border-box;">${existing.budgetResp||''}</textarea>
                </div>
              </div>

              <!-- Part C: Location -->
              <div class="card" style="margin-bottom:20px;border-left:3px solid var(--primary);">
                <h4 style="margin-bottom:8px;font-size:14px;"><i class="fas fa-map-marker-alt"></i> Part C — Location Matters</h4>
                <p style="font-size:13px;color:var(--gray-500);margin-bottom:12px;">Compare your salary in Kalamazoo, MI to one other city using the NerdWallet cost-of-living calculator. What would you need to earn there to maintain the same lifestyle?</p>
                <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:10px;">
                  <div style="flex:2;min-width:140px;">
                    <label style="display:block;font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:4px;">City you compared to Kalamazoo</label>
                    <input type="text" id="d0CompCity" value="${existing.compCity||''}" placeholder="e.g. Austin, TX"
                           style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:14px;box-sizing:border-box;">
                  </div>
                  <div style="flex:1;min-width:120px;">
                    <label style="display:block;font-size:12px;font-weight:600;color:var(--gray-600);margin-bottom:4px;">Salary needed there ($)</label>
                    <input type="number" id="d0CompSalary" value="${existing.compSalary||''}" placeholder="e.g. 82000"
                           style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:14px;box-sizing:border-box;">
                  </div>
                </div>
                <textarea id="d0LocationResp" rows="2" placeholder="What does this tell you about where you might want to live after training or graduation?" style="width:100%;padding:8px;border:1px solid var(--gray-200);border-radius:6px;font-size:13px;resize:vertical;box-sizing:border-box;">${existing.locationResp||''}</textarea>
              </div>

              <!-- DAY 3 -->
              <div style="background:var(--gray-800);color:#fff;padding:12px 16px;border-radius:8px;margin-bottom:14px;">
                <h3 style="margin:0;font-size:15px;font-weight:700;">Day 3 — Your Engineering Career Plan</h3>
                <p style="margin:3px 0 0;font-size:12px;opacity:.75;">Write 2–4 sentences per prompt. This is Deliverable 0 — submit it here when done.</p>
              </div>
              <div class="card" style="margin-bottom:8px;border-left:3px solid var(--primary);">
                <div class="form-group">
                  <label for="d0Prompt1">Prompt 1 — Career Interest</label>
                  <p style="font-size:12px;color:var(--gray-500);margin-bottom:6px;margin-top:-4px;">Which career or trade interests you most, and why? Connect your answer to something specific you built or learned in this class.</p>
                  <textarea id="d0Prompt1" rows="4" placeholder="Write 2–4 sentences…">${existing.prompt1||''}</textarea>
                </div>
                <div class="form-group">
                  <label for="d0Prompt2">Prompt 2 — Education Path</label>
                  <p style="font-size:12px;color:var(--gray-500);margin-bottom:6px;margin-top:-4px;">What education or training would you need? Be specific (e.g., apprenticeship, associate degree, bachelor's).</p>
                  <textarea id="d0Prompt2" rows="4" placeholder="Write 2–4 sentences…">${existing.prompt2||''}</textarea>
                </div>
                <div class="form-group">
                  <label for="d0Prompt3">Prompt 3 — Financial Reality</label>
                  <p style="font-size:12px;color:var(--gray-500);margin-bottom:6px;margin-top:-4px;">What would your monthly take-home be on a starting salary in this field? Was it more or less than you expected, and why does it matter?</p>
                  <textarea id="d0Prompt3" rows="4" placeholder="Write 2–4 sentences…">${existing.prompt3||''}</textarea>
                </div>
                <div class="form-group">
                  <label for="d0Prompt4">Prompt 4 — Financial Goal</label>
                  <p style="font-size:12px;color:var(--gray-500);margin-bottom:6px;margin-top:-4px;">Name one specific financial goal for your first year of working. Include an amount and a purpose — not just "save money."</p>
                  <textarea id="d0Prompt4" rows="4" placeholder="Write 2–4 sentences…">${existing.prompt4||''}</textarea>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label for="d0Prompt5">Prompt 5 — Career Ready Skills</label>
                  <p style="font-size:12px;color:var(--gray-500);margin-bottom:6px;margin-top:-4px;">Name one Career Ready skill you practiced in this class and give a specific example of when you used it.</p>
                  <textarea id="d0Prompt5" rows="4" placeholder="Write 2–4 sentences…">${existing.prompt5||''}</textarea>
                </div>
              </div>
            </div>
            ` : ''}

            ${deliverable.type === 'googleDoc'
                ? renderDocDeliverableUI(id, deliverable, existing)
                : `
            ${id !== 0 && !deliverable.questions?.length ? `
            <div class="form-group">
                <label for="deliverableContent">Your Submission</label>
                <textarea id="deliverableContent" rows="8" placeholder="Describe what you did, paste your code, explain your process...">${existing.content || ''}</textarea>
            </div>` : ''}

            ${id !== 0 ? `
            <div class="form-group">
                <label>
                    Photos / Screenshots
                    <span style="font-weight: normal; color: var(--gray-500); font-size: 13px;">— if applicable</span>
                </label>
                <div id="deliverablePhotoZone"
                    style="border: 2px dashed var(--gray-300); border-radius: 8px; padding: 16px; text-align: center; cursor: pointer; color: var(--gray-500); font-size: 14px;"
                    onclick="document.getElementById('deliverablePhotoInput').click()"
                    ondragover="event.preventDefault(); this.style.borderColor='var(--primary)';"
                    ondragleave="this.style.borderColor='var(--gray-300)';"
                    ondrop="event.preventDefault(); this.style.borderColor='var(--gray-300)'; handleDeliverablePhotos(event.dataTransfer.files, ${id});">
                    <i class="fas fa-camera" style="font-size: 20px; margin-bottom: 6px; display: block;"></i>
                    Click or drag photos here
                </div>
                <input type="file" id="deliverablePhotoInput" accept="image/*" multiple style="display: none;"
                    onchange="handleDeliverablePhotos(this.files, ${id}); this.value='';">
                <div id="deliverablePhotoPreview" style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                    ${(existing.photos || []).map(p => `
                        <div class="evidence-thumb" style="position: relative; width: 80px; height: 80px; border-radius: 6px; overflow: hidden;">
                            <img src="${p.thumbnailLink}" alt="${p.filename}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${PLACEHOLDER_IMG}'">
                            <a href="${p.webViewLink}" target="_blank" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.2s; color: white; font-size: 18px; text-decoration: none;"
                               onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
                                <i class="fas fa-expand"></i>
                            </a>
                            <button type="button" onclick="removeDeliverablePhoto('${p.driveId}', ${id}, this.closest('.evidence-thumb'))"
                                style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}

            <div class="form-group">
                <label for="deliverableLinks">Supporting Documentation</label>
                <textarea id="deliverableLinks" rows="3" placeholder="Links, notes, or brief code snippets">${existing.links || ''}</textarea>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="saveDeliverableDraft(${id})">
                    <i class="fas fa-save"></i> Save Draft
                </button>
                ${id === 0 ? `<button type="button" class="btn btn-secondary" onclick="checkD0Work()">
                    <i class="fas fa-comments"></i> Check My Work
                </button>` : ''}
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-paper-plane"></i> Submit
                </button>
            </div>`}
        </form>
        ${id === 0 ? '<div id="d0FeedbackResult" style="margin-top:16px;"></div>' : ''}
    `;

    // Attach dirty listeners to form inputs
    content.querySelectorAll('textarea, input').forEach(el => {
        el.addEventListener('input', markDirty);
    });

    // Live budget total/remaining for D0
    if (id === 0) {
        const budgetInputIds = ['d0BudgHousing','d0BudgTransport','d0BudgGroceries','d0BudgUtilities','d0BudgPhone','d0BudgHealth','d0BudgSavings','d0BudgEntertain'];
        function updateBudgetTotals() {
            const net = parseFloat(document.getElementById('d0MonthlyNet')?.value) || 0;
            const total = budgetInputIds.reduce((sum, bid) => sum + (parseFloat(document.getElementById(bid)?.value) || 0), 0);
            const remaining = net - total;
            const totalEl = document.getElementById('d0BudgTotal');
            const remainEl = document.getElementById('d0BudgRemaining');
            if (totalEl) totalEl.textContent = total > 0 ? '$' + total.toLocaleString() : '—';
            if (remainEl) {
                if (net > 0 || total > 0) {
                    remainEl.textContent = (remaining >= 0 ? '+$' : '-$') + Math.abs(remaining).toLocaleString();
                    remainEl.style.color = remaining >= 0 ? 'var(--success)' : 'var(--danger)';
                } else {
                    remainEl.textContent = '—';
                    remainEl.style.color = '';
                }
            }
        }
        content.querySelectorAll('.d0-budget-input, .d0-net-input').forEach(el => el.addEventListener('input', updateBudgetTotals));
        updateBudgetTotals();
    }

    document.getElementById('deliverableForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitDeliverable(id);
    });

    modal.classList.add('active');
}

// ============================================
// DELIVERABLE PHOTO UPLOAD
// ============================================
async function handleDeliverablePhotos(files, deliverableId) {
    const preview = document.getElementById('deliverablePhotoPreview');
    if (!preview) return;

    for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;

        const thumb = document.createElement('div');
        thumb.className = 'evidence-thumb';
        thumb.style.cssText = 'position: relative; width: 80px; height: 80px; border-radius: 6px; overflow: hidden; background: var(--gray-100); display: flex; align-items: center; justify-content: center;';
        thumb.innerHTML = `<i class="fas fa-spinner fa-spin" style="font-size: 20px; color: var(--gray-400);"></i>`;
        preview.appendChild(thumb);

        const driveFile = await uploadToDrive(file, state.selectedWeek);
        if (driveFile) {
            if (!state.deliverables[deliverableId]) state.deliverables[deliverableId] = {};
            if (!state.deliverables[deliverableId].photos) state.deliverables[deliverableId].photos = [];
            state.deliverables[deliverableId].photos.push({
                driveId: driveFile.id,
                filename: driveFile.name,
                thumbnailLink: driveFile.thumbnailLink,
                webViewLink: driveFile.webViewLink,
                uploadedAt: new Date().toISOString()
            });
            thumb.innerHTML = `
                <img src="${driveFile.thumbnailLink}" alt="${driveFile.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${PLACEHOLDER_IMG}'">
                <a href="${driveFile.webViewLink}" target="_blank" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.2s; color: white; font-size: 18px; text-decoration: none;"
                   onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0"><i class="fas fa-expand"></i></a>
                <button type="button" onclick="removeDeliverablePhoto('${driveFile.id}', ${deliverableId}, this.closest('.evidence-thumb'))"
                    style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.6); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 11px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-times"></i>
                </button>
            `;
            markDirty();
            showToast('Photo uploaded', 'success');
        } else {
            thumb.remove();
        }
    }
}

function removeDeliverablePhoto(driveId, deliverableId, element) {
    if (state.deliverables[deliverableId]?.photos) {
        state.deliverables[deliverableId].photos = state.deliverables[deliverableId].photos.filter(p => p.driveId !== driveId);
    }
    element.remove();
    markDirty();
}

const CAD_DELIVERABLE_IDS = [21, 22, 23, 24, 25, 26, 27];

function collectCadDeliverableData() {
    return {
        level: document.querySelector('input[name="cadLevel"]:checked')?.value || '',
        q1: document.getElementById('cad-q1')?.value || '',
        q2: document.getElementById('cad-q2')?.value || '',
        q3: document.getElementById('cad-q3')?.value || '',
        q4: document.getElementById('cad-q4')?.value || '',
        q5: document.getElementById('cad-q5')?.value || '',
    };
}

function saveDeliverableDraft(id) {
    const completionTimeEl = document.getElementById('completionTime');
    state.deliverables[id] = {
        ...state.deliverables[id],
        content: document.getElementById('deliverableContent')?.value || '',
        links: document.getElementById('deliverableLinks')?.value || '',
        completionTime: completionTimeEl ? parseInt(completionTimeEl.value) || null : null,
        ...(id === 0 ? collectDeliverable0CustomData() : {}),
        ...(CAD_DELIVERABLE_IDS.includes(id) ? collectCadDeliverableData() : {}),
        // photos are written to state live on upload, preserved here via spread
        status: 'in-progress',
        updatedAt: new Date().toISOString()
    };
    saveToCloud();
    updateUI();
    showToast('Draft saved!', 'success');
}

function formatCadDeliverableContent(id, customData) {
    const deliverable = DELIVERABLES.find(d => d.id === id);
    const levelLabel = { L1: 'Level 1 — Replicate exactly', L2: 'Level 2 — Modify + document', L3: 'Level 3 — Custom design' };
    let out = `=== ${deliverable.title} ===\n`;
    out += `Completion Level: ${levelLabel[customData.level] || customData.level || '(not set)'}\n\n`;
    (deliverable.questions || []).forEach((q, i) => {
        out += `Q${i+1}: ${q}\n`;
        out += `A: ${customData['q'+(i+1)] || '(not answered)'}\n\n`;
    });
    return out.trim();
}

function collectDeliverable0CustomData() {
    const g = id => (document.getElementById(id)?.value || '').trim();
    const n = id => parseInt(document.getElementById(id)?.value) || 0;
    return {
        // Day 1 research table
        career1Title:   g('d0C1Title'),  career1Salary: g('d0C1Salary'), career1Edu: g('d0C1Edu'), career1Growth: g('d0C1Growth'), career1Connect: g('d0C1Connect'),
        career2Title:   g('d0C2Title'),  career2Salary: g('d0C2Salary'), career2Edu: g('d0C2Edu'), career2Growth: g('d0C2Growth'), career2Connect: g('d0C2Connect'),
        career3Title:   g('d0C3Title'),  career3Salary: g('d0C3Salary'), career3Edu: g('d0C3Edu'), career3Growth: g('d0C3Growth'), career3Connect: g('d0C3Connect'),
        // Day 2 paycheck
        careerTitle:    g('d0Career'),
        medianSalary:   n('d0Salary'),
        monthlyNet:     n('d0MonthlyNet'),
        // Day 2 budget
        budgHousing:    n('d0BudgHousing'),   budgTransport: n('d0BudgTransport'),
        budgGroceries:  n('d0BudgGroceries'), budgUtilities: n('d0BudgUtilities'),
        budgPhone:      n('d0BudgPhone'),      budgHealth:    n('d0BudgHealth'),
        budgSavings:    n('d0BudgSavings'),    budgEntertain: n('d0BudgEntertain'),
        budgetResp:     g('d0BudgetResp'),
        // Day 2 location
        compCity:       g('d0CompCity'),  compSalary: n('d0CompSalary'),
        locationResp:   g('d0LocationResp'),
        // Day 3 prompts
        prompt1: g('d0Prompt1'), prompt2: g('d0Prompt2'), prompt3: g('d0Prompt3'),
        prompt4: g('d0Prompt4'), prompt5: g('d0Prompt5'),
    };
}

function formatDeliverable0Content(d) {
    const fmt = v => v ? '$' + Number(v).toLocaleString() : '—';
    const budgetTotal = ['budgHousing','budgTransport','budgGroceries','budgUtilities','budgPhone','budgHealth','budgSavings','budgEntertain']
        .reduce((sum, k) => sum + (Number(d[k]) || 0), 0);
    const budgetRemaining = (d.monthlyNet || 0) - budgetTotal;

    const careerRow = n => [d['career'+n+'Title'], d['career'+n+'Salary'], d['career'+n+'Edu'], d['career'+n+'Growth'], d['career'+n+'Connect']]
        .map(v => v || '—').join(' | ');

    return [
        'CAREER READY PRACTICES — UNIT 00',
        '',
        '=== DAY 1: CAREER RESEARCH ===',
        'Format: Title | Median Salary | Education | 10-Yr Growth | Connection to Class',
        '1. ' + careerRow(1),
        '2. ' + careerRow(2),
        '3. ' + careerRow(3),
        '',
        '=== DAY 2: PAYCHECK & BUDGET ===',
        `Career analyzed: ${d.careerTitle || '—'}`,
        `Median Annual Salary: ${fmt(d.medianSalary)}`,
        `Monthly Take-Home (Net Pay): ${fmt(d.monthlyNet)}`,
        '',
        'Monthly Budget:',
        `  Housing: ${fmt(d.budgHousing)}`,
        `  Transportation: ${fmt(d.budgTransport)}`,
        `  Groceries: ${fmt(d.budgGroceries)}`,
        `  Utilities: ${fmt(d.budgUtilities)}`,
        `  Cell phone: ${fmt(d.budgPhone)}`,
        `  Health insurance: ${fmt(d.budgHealth)}`,
        `  Savings: ${fmt(d.budgSavings)}`,
        `  Entertainment: ${fmt(d.budgEntertain)}`,
        `  TOTAL EXPENSES: ${fmt(budgetTotal)}`,
        `  REMAINING: ${budgetRemaining >= 0 ? '+' : ''}${fmt(budgetRemaining)}`,
        '',
        d.budgetResp ? 'Budget check response: ' + d.budgetResp : '',
        '',
        `Location comparison: Kalamazoo, MI vs. ${d.compCity || '(not entered)'}`,
        d.compSalary ? `Salary needed in ${d.compCity}: ${fmt(d.compSalary)}` : '',
        d.locationResp ? 'Location reflection: ' + d.locationResp : '',
        '',
        '=== DAY 3: REFLECTION PROMPTS ===',
        'PROMPT 1 — CAREER INTEREST:',
        d.prompt1 || '(not answered)',
        '',
        'PROMPT 2 — EDUCATION PATH:',
        d.prompt2 || '(not answered)',
        '',
        'PROMPT 3 — FINANCIAL REALITY:',
        d.prompt3 || '(not answered)',
        '',
        'PROMPT 4 — FINANCIAL GOAL:',
        d.prompt4 || '(not answered)',
        '',
        'PROMPT 5 — CAREER READY SKILLS:',
        d.prompt5 || '(not answered)',
    ].filter(line => line !== null && line !== undefined).join('\n');
}

function submitDeliverable(id) {
    const deliverable = DELIVERABLES.find(d => d.id === id);
    if (deliverable?.type === 'googleDoc') {
        submitGoogleDocDeliverable(id);
        return;
    }
    if (!deliverable?.alwaysOpen && state.deliverables[id]?.status !== 'completed' && !state.config.deliverableDueDates[deliverable?.id]) {
        showToast('This deliverable hasn\'t been assigned yet.', 'error');
        return;
    }
    const content = document.getElementById('deliverableContent')?.value || '';
    const completionTimeEl = document.getElementById('completionTime');
    const photos = state.deliverables[id]?.photos || [];

    // Deliverable 0: all five prompts must have meaningful text
    if (id === 0) {
        const d0 = collectDeliverable0CustomData();
        if (!d0.careerTitle) { showToast('Please enter the career or trade you chose', 'error'); return; }
        const prompts = [d0.prompt1, d0.prompt2, d0.prompt3, d0.prompt4, d0.prompt5];
        const short = prompts.findIndex(p => !p || p.length < 50);
        if (short >= 0) { showToast(`Prompt ${short + 1} needs more detail (at least 50 characters)`, 'error'); return; }
    } else if (CAD_DELIVERABLE_IDS.includes(id)) {
        const cadData = collectCadDeliverableData();
        if (!cadData.level) {
            showToast('Please select your completion level (Level 1, 2, or 3)', 'error');
            return;
        }
        if (!cadData.q1 || cadData.q1.length < 30) {
            showToast('Q1 needs more detail (at least 30 characters)', 'error');
            return;
        }
        if (photos.length === 0) {
            showToast('Please upload at least one screenshot', 'error');
            return;
        }
    } else {
        if (!content || content.length < 50) {
            showToast('Please provide more detail (at least 50 characters)', 'error');
            return;
        }
    }

    const customData = id === 0 ? collectDeliverable0CustomData() : CAD_DELIVERABLE_IDS.includes(id) ? collectCadDeliverableData() : {};
    let finalContent = id === 0 ? formatDeliverable0Content(customData) : CAD_DELIVERABLE_IDS.includes(id) ? formatCadDeliverableContent(id, customData) : content;

    // Append photo links to content for Sheets storage
    if (photos.length > 0) {
        finalContent += '\n\n--- PHOTOS ---\n' + photos.map(p => p.webViewLink).join('\n');
    }

    state.deliverables[id] = {
        content: finalContent,
        links: document.getElementById('deliverableLinks')?.value || '',
        completionTime: completionTimeEl ? parseInt(completionTimeEl.value) || null : null,
        ...customData,
        photos,
        status: 'completed',
        submittedAt: new Date().toISOString()
    };

    saveToCloud(); // immediate save on submission
    updateUI();
    document.getElementById('deliverableModal').classList.remove('active');
    showCelebration(`${deliverable.title} Submitted!`);
}

// ============================================
// D0 FEEDBACK (CHECK MY WORK)
// ============================================
async function checkD0Work() {
    const panel = document.getElementById('d0FeedbackResult');
    if (!panel) return;

    const d0 = collectDeliverable0CustomData();
    if (!d0.careerTitle) {
        panel.innerHTML = `<p style="color:var(--danger,#c62828);font-size:14px;">Enter the career or trade you chose before checking your work.</p>`;
        return;
    }

    panel.innerHTML = `
        <div style="text-align:center;padding:24px;color:var(--gray-500,#888);">
            <i class="fas fa-spinner fa-spin" style="font-size:20px;margin-bottom:10px;display:block;"></i>
            Checking your work…
        </div>`;
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const content = formatDeliverable0Content(d0);
    try {
        const res = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'getStudentAIFeedback', deliverableId: 0, content })
        });
        const data = await res.json();
        console.log('[checkD0Work] backend response:', data);
        if (data.success && data.grades) {
            panel.innerHTML = renderD0FeedbackPanel(data.grades);
        } else {
            panel.innerHTML = `<p style="color:var(--danger,#c62828);font-size:14px;">Feedback unavailable: ${data.error || 'no details returned'}. Check the browser console for more info.</p>`;
        }
    } catch(e) {
        console.error('[checkD0Work] fetch/parse error:', e);
        panel.innerHTML = `<p style="color:var(--danger,#c62828);font-size:14px;">Feedback unavailable: ${e.message}. Check the browser console for more info.</p>`;
    }
}

function renderD0FeedbackPanel(grades) {
    const criteria = [
        { key: 'cr_career',    label: 'Career Interest & Class Connection' },
        { key: 'cr_education', label: 'Education / Training Path' },
        { key: 'cr_financial', label: 'Financial Literacy' },
        { key: 'cr_goal',      label: 'Financial Goal Specificity' },
        { key: 'cr_skills',    label: 'Career Ready Skills' },
    ];
    const total = criteria.reduce((sum, c) => sum + (grades[c.key]?.score || 0), 0);
    const maxTotal = criteria.reduce((sum, c) => sum + (grades[c.key]?.max || 4), 0);

    const rows = criteria.map(c => {
        const g = grades[c.key] || { score: 0, max: 4, feedback: '' };
        const pct = g.max > 0 ? g.score / g.max : 0;
        const color = pct >= 0.75 ? 'var(--success, #2e7d32)' : pct >= 0.5 ? 'var(--warning, #f57c00)' : 'var(--danger, #c62828)';
        return `
            <div style="border:1px solid var(--gray-200,#e0e0e0);border-radius:8px;padding:12px 14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-weight:600;font-size:14px;">${c.label}</span>
                    <span style="font-weight:700;font-size:15px;color:${color};">${g.score}/${g.max}</span>
                </div>
                <p style="font-size:13px;color:var(--gray-700,#444);margin:0;line-height:1.5;">${g.feedback}</p>
            </div>`;
    }).join('');

    return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--gray-100,#f5f5f5);border-radius:8px;margin-bottom:4px;">
            <span style="font-weight:700;">Total</span>
            <span style="font-weight:700;font-size:18px;">${total} / ${maxTotal}</span>
        </div>
        ${rows}
        <p style="font-size:12px;color:var(--gray-500,#999);margin-top:8px;">This feedback is a guide — your teacher assigns the final grade.</p>
    `;
}

// ============================================
// GOOGLE DOC DELIVERABLES
// ============================================

const DOC_RUBRIC_CRITERIA = {
    11: [
        { key: 'problem_id',             label: 'Client & End User',     max: 4 },
        { key: 'criteria_completeness',  label: 'Criteria (quantity)',   max: 4 },
        { key: 'criteria_quality',       label: 'Criteria (quality)',    max: 4 },
        { key: 'constraints',            label: 'Constraints',           max: 4 },
        { key: 'design_statement',       label: 'Design Statement',      max: 4 },
    ]
};

function renderDocDeliverableUI(id, deliverable, existing) {
    const docId  = existing?.docId  || '';
    const docUrl = existing?.docUrl || '';
    const hasDoc = !!docId;
    const isSubmitted = existing?.status === 'completed';

    const createBtn = hasDoc
        ? ''
        : `<button type="button" class="btn btn-primary" onclick="createDeliverableDoc(${id})" id="createDocBtn">
               <i class="fas fa-file-alt"></i> Create My ${deliverable.title}
           </button>`;

    const docLink = hasDoc
        ? `<div style="margin-bottom:16px;">
               <a href="${docUrl}" target="_blank" rel="noopener"
                  style="display:inline-flex;align-items:center;gap:8px;padding:10px 16px;background:var(--gray-100);border:1px solid var(--gray-300);border-radius:8px;color:var(--primary);text-decoration:none;font-weight:600;font-size:14px;">
                   <i class="fas fa-external-link-alt"></i> Open My ${deliverable.title} in Google Docs
               </a>
           </div>`
        : '';

    const feedbackSection = hasDoc && !isSubmitted
        ? `<div style="margin-bottom:16px;">
               <button type="button" class="btn btn-secondary" onclick="requestDocFeedback(${id})" id="docFeedbackBtn">
                   <i class="fas fa-comments"></i> Get AI Feedback
               </button>
               <div id="docFeedbackResult" style="margin-top:16px;"></div>
           </div>`
        : hasDoc && isSubmitted
        ? `<div id="docFeedbackResult" style="margin-top:0;"></div>`
        : '';

    const submitBtn = hasDoc && !isSubmitted
        ? `<div class="form-actions">
               <button type="button" class="btn btn-primary" onclick="submitDeliverable(${id})">
                   <i class="fas fa-paper-plane"></i> Submit
               </button>
           </div>`
        : isSubmitted
        ? `<div style="display:flex;align-items:center;gap:8px;color:var(--success,#2e7d32);font-weight:600;margin-top:8px;">
               <i class="fas fa-check-circle"></i> Submitted
           </div>`
        : '';

    const instructions = `
        <div style="background:var(--gray-50,#fafafa);border:1px solid var(--gray-200);border-radius:8px;padding:14px 16px;margin-bottom:20px;font-size:13px;color:var(--gray-600);">
            <strong>How it works:</strong>
            <ol style="margin:8px 0 0 16px;padding:0;line-height:1.8;">
                <li>Click <strong>Create My ${deliverable.title}</strong> — your personal copy opens in Google Docs.</li>
                <li>Read the yellow instruction boxes, then <strong>delete them</strong> as you complete each section.</li>
                <li>Fill in all sections. Photos go directly into the doc.</li>
                <li>Click <strong>Get AI Feedback</strong> to check your work before submitting.</li>
                <li>When you're satisfied, click <strong>Submit</strong>.</li>
            </ol>
        </div>`;

    return `
        ${instructions}
        <div id="docDeliverableArea">
            ${createBtn}
            ${docLink}
            ${feedbackSection}
            ${submitBtn}
        </div>`;
}

async function createDeliverableDoc(id) {
    const btn = document.getElementById('createDocBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating…'; }

    try {
        const res = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' }, // Required for Google Apps Script CORS
            body: JSON.stringify({
                action: 'createDeliverableDoc',
                email: state.user?.email || '',
                deliverableId: id,
                studentName: state.user?.name || '',
                projectName: state.config?.projectName || ''
            })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Unknown error');

        state.deliverables[id] = {
            ...state.deliverables[id],
            docId:  data.docId,
            docUrl: data.editUrl,
            status: 'in-progress',
            updatedAt: new Date().toISOString()
        };
        await saveToCloud();

        // Re-open the form so the doc link and feedback button appear
        window.open(data.editUrl, '_blank');
        openDeliverableForm(id);
    } catch (err) {
        showToast('Could not create document: ' + err.message, 'error');
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-file-alt"></i> Create My Document'; }
    }
}

async function requestDocFeedback(id) {
    const btn    = document.getElementById('docFeedbackBtn');
    const panel  = document.getElementById('docFeedbackResult');
    const docId  = state.deliverables[id]?.docId;
    if (!docId) { showToast('No document linked yet.', 'error'); return; }
    if (btn)   { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking…'; }
    if (panel) { panel.innerHTML = ''; }

    try {
        const res = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' }, // Required for Google Apps Script CORS
            body: JSON.stringify({
                action: 'getDocAIFeedback',
                email: state.user?.email || '',
                deliverableId: id,
                docId
            })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Unknown error');

        const criteria = DOC_RUBRIC_CRITERIA[id] || [];
        if (panel) panel.innerHTML = renderDocFeedbackPanel(data.grades, criteria);
    } catch (err) {
        if (panel) panel.innerHTML = `<p style="color:var(--danger,#c62828);font-size:14px;">${err.message}</p>`;
    } finally {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-comments"></i> Get AI Feedback'; }
    }
}

function renderDocFeedbackPanel(grades, criteria) {
    const total    = criteria.reduce((sum, c) => sum + (grades[c.key]?.score || 0), 0);
    const maxTotal = criteria.reduce((sum, c) => sum + (c.max || 4), 0);

    const rows = criteria.map(c => {
        const g    = grades[c.key] || { score: 0, max: c.max || 4, feedback: '' };
        const pct  = g.max > 0 ? g.score / g.max : 0;
        const color = pct >= 0.75 ? 'var(--success,#2e7d32)' : pct >= 0.5 ? 'var(--warning,#f57c00)' : 'var(--danger,#c62828)';
        return `
            <div style="border:1px solid var(--gray-200,#e0e0e0);border-radius:8px;padding:12px 14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-weight:600;font-size:14px;">${c.label}</span>
                    <span style="font-weight:700;font-size:15px;color:${color};">${g.score}/${g.max}</span>
                </div>
                <p style="font-size:13px;color:var(--gray-700,#444);margin:0;line-height:1.5;">${g.feedback || ''}</p>
            </div>`;
    }).join('');

    return `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--gray-100,#f5f5f5);border-radius:8px;margin-bottom:4px;">
            <span style="font-weight:700;">Total</span>
            <span style="font-weight:700;font-size:18px;">${total} / ${maxTotal}</span>
        </div>
        ${rows}
        <p style="font-size:12px;color:var(--gray-500,#999);margin-top:8px;">This feedback is a guide — your teacher assigns the final grade.</p>`;
}

async function submitGoogleDocDeliverable(id) {
    const docId  = state.deliverables[id]?.docId;
    const docUrl = state.deliverables[id]?.docUrl;
    const deliverable = DELIVERABLES.find(d => d.id === id);

    if (!docId) {
        showToast('Create your document first.', 'error');
        return;
    }

    state.deliverables[id] = {
        ...state.deliverables[id],
        docId,
        docUrl,
        content: docUrl, // store URL as content so Sheets has a reference
        status: 'completed',
        submittedAt: new Date().toISOString()
    };
    await saveToCloud();
    updateUI();
    document.getElementById('deliverableModal').classList.remove('active');
    showCelebration(`${deliverable.title} Submitted!`);
}

// ============================================
// CODE LIBRARY
// ============================================
function initCodeLibrary() {
    document.getElementById('codeSnippetForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveCodeSnippet();
    });
}

function saveCodeSnippet() {
    const snippet = {
        id: Date.now(),
        title: document.getElementById('snippetTitle').value,
        category: document.getElementById('snippetCategory').value,
        code: document.getElementById('snippetCode').value,
        notes: document.getElementById('snippetNotes').value,
        createdAt: new Date().toISOString()
    };

    state.codeSnippets.push(snippet);
    markDirty();
    document.getElementById('codeSnippetForm').reset();
    loadCodeSnippets();
    showToast('Code snippet saved!', 'success');
}

function loadCodeSnippets() {
    const list = document.getElementById('snippetsList');

    if (state.codeSnippets.length === 0) {
        list.innerHTML = '<p class="placeholder-text">No code snippets saved yet.</p>';
        return;
    }

    list.innerHTML = state.codeSnippets.map(s => `
        <div class="card" style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="margin-bottom: 5px;">${s.title}</h4>
                    <span style="font-size: 12px; color: var(--gray-600);">${formatCategory(s.category)}</span>
                </div>
                <button class="btn btn-small btn-secondary" onclick="copySnippet(${s.id})">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <pre style="background: var(--gray-900); color: #fff; padding: 12px; border-radius: 6px; margin-top: 10px; overflow-x: auto; font-size: 12px;"><code>${escapeHtml(s.code)}</code></pre>
            ${s.notes ? `<p style="margin-top: 8px; font-size: 13px; color: var(--gray-600);"><strong>Notes:</strong> ${s.notes}</p>` : ''}
        </div>
    `).join('');
}

function copySnippet(id) {
    const snippet = state.codeSnippets.find(s => s.id === id);
    if (snippet) {
        navigator.clipboard.writeText(snippet.code);
        showToast('Copied to clipboard!', 'success');
    }
}

// ============================================
// RESOURCES
// ============================================
function showResource(key) {
    const resource = RESOURCES[key];
    if (!resource) return;

    const modal = document.getElementById('resourceModal');
    const content = document.getElementById('resourceContent');

    let html = resource.content
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/```cpp([\s\S]*?)```/g, '<pre style="background:#1e1e1e;color:#ddd;padding:15px;border-radius:8px;overflow-x:auto;"><code>$1</code></pre>')
        .replace(/```([\s\S]*?)```/g, '<pre style="background:#1e1e1e;color:#ddd;padding:15px;border-radius:8px;overflow-x:auto;"><code>$1</code></pre>')
        .replace(/`(.*?)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;">$1</code>')
        .replace(/^\| (.*) \|$/gm, (match) => {
            const cells = match.split('|').filter(c => c.trim());
            return '<tr>' + cells.map(c => `<td style="padding:8px;border:1px solid #ddd;">${c.trim()}</td>`).join('') + '</tr>';
        })
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>');

    content.innerHTML = `<h2>${resource.title}</h2>${html}`;
    modal.classList.add('active');
}

// ============================================
// UTILITIES
// ============================================
function hideAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

function getInitials(name) {
    if (!name) return '--';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function formatPhase(phase) {
    const names = {
        edp: 'Engineering Design', foundations: 'Foundations',
        cad: 'CAD', mfg: 'Manufacturing', safety: 'Shop Safety',
        linefollow: 'Line Following', scanner: 'Ultrasonic Scanner',
        claw: 'Servo Claw', final: 'Final Demo', ai: 'AI & Machine Learning'
    };
    return names[phase] || phase;
}

function formatStatus(status) {
    const labels = { pending: 'Not Started', 'in-progress': 'In Progress', completed: 'Completed' };
    return labels[status] || status;
}

function formatDeliverableLabel(id) {
    if (id === 0) return '0';
    return `${Math.floor(id / 10)}.${id % 10}`;
}

function formatCategory(cat) {
    const names = { linefollow: 'Line Following', ultrasonic: 'Ultrasonic Sensor', servo: 'Servo Control', claw: 'Claw Mechanism', motors: 'Motor Control', other: 'Other' };
    return names[cat] || cat;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showOutageBanner(email, name) {
    const existing = document.getElementById('outageBanner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'outageBanner';
    banner.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
        background: #92400e; color: #fef3c7;
        padding: 14px 20px; display: flex; align-items: center; gap: 12px;
        font-size: 14px; font-weight: 500; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    banner.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="font-size: 18px; flex-shrink:0;"></i>
        <span style="flex:1;">
            <strong>Unable to load your portfolio.</strong>
            The server may be temporarily unavailable — your work is safe.
            Refresh the page to try again, or wait a moment and click Retry.
        </span>
        <button onclick="retryCloudLoad('${email}','${name.replace(/'/g,"\\'")}');this.closest('#outageBanner').remove();"
            style="background:#d97706; color:#fff; border:none; border-radius:6px;
                   padding:8px 16px; cursor:pointer; font-weight:600; white-space:nowrap;">
            Retry
        </button>
    `;
    document.body.prepend(banner);
}

async function retryCloudLoad(email, name) {
    const cloudData = await loadStudentFromCloud(email);
    if (cloudData && cloudData.student) {
        state = cloudData;
        state.student.name = name;
        restoreEvidenceLocal();
        calculateCurrentWeek();
        hideAllModals();
        onAuthenticated();
    } else if (cloudData && cloudData.loadError) {
        showOutageBanner(email, name);
        showToast('Still unable to reach the server — try again in a moment.', 'error');
    } else {
        // New student (no record found)
        document.getElementById('profileEmail').textContent = email;
        document.getElementById('profileModal').classList.add('active');
        state.student = { email, name };
        initProfileForm();
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showCelebration(message) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
        <div style="font-size: 120px; animation: egyptian 0.6s ease-in-out infinite;">🤖</div>
        <div style="color: white; font-size: 28px; font-weight: bold; margin-top: 20px; text-align: center; padding: 0 20px;">
            ${message}
        </div>
        <div style="color: #10b981; font-size: 18px; margin-top: 10px;">
            <i class="fas fa-check-circle"></i> Submitted successfully!
        </div>
    `;

    // Add Egyptian walk animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes egyptian {
            0%, 100% { transform: translateX(-30px) skewY(-5deg); }
            25% { transform: translateX(0px) skewY(5deg) scaleX(-1); }
            50% { transform: translateX(30px) skewY(-5deg); }
            75% { transform: translateX(0px) skewY(5deg) scaleX(-1); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Click to dismiss or auto-dismiss after 3 seconds
    overlay.addEventListener('click', () => overlay.remove());
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.style.animation = 'fadeIn 0.3s ease reverse';
            setTimeout(() => overlay.remove(), 300);
        }
    }, 3000);
}

// Expose for inline onclick handlers
window.showToast = showToast;
window.retryCloudLoad = retryCloudLoad;
window.saveDeliverableDraft = saveDeliverableDraft;
window.copySnippet = copySnippet;
window.showResource = showResource;

// ============================================
// AI FEEDBACK MODULE (test mode only)
// ============================================
const AI_FEEDBACK_ENABLED = window.location.pathname.includes('test');

if (AI_FEEDBACK_ENABLED) {
    // Inject AI feedback modal into the page
    document.addEventListener('DOMContentLoaded', () => {
        const modalHtml = `
            <div class="modal" id="aiFeedbackModal">
                <div class="modal-content modal-large">
                    <button class="modal-close" onclick="document.getElementById('aiFeedbackModal').classList.remove('active')">&times;</button>
                    <div id="aiFeedbackContent">
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-robot" style="font-size: 48px; color: var(--primary); margin-bottom: 16px;"></i>
                            <h2>AI Review</h2>
                            <p style="color: var(--gray-600);">Analyzing your submission...</p>
                            <div class="loading-spinner" style="margin: 20px auto;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Add AI review button to reflection form
        const reflectionActions = document.querySelector('#weeklyReflectionForm .form-actions');
        if (reflectionActions) {
            const aiBtn = document.createElement('button');
            aiBtn.type = 'button';
            aiBtn.className = 'btn btn-secondary';
            aiBtn.innerHTML = '<i class="fas fa-robot"></i> AI Review';
            aiBtn.style.cssText = 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none;';
            aiBtn.addEventListener('click', () => requestAIFeedback('reflection'));
            reflectionActions.insertBefore(aiBtn, reflectionActions.firstChild);
        }

        // Add CSS for AI feedback display
        const style = document.createElement('style');
        style.textContent = `
            .ai-score-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
            .ai-score-label { width: 110px; font-size: 13px; font-weight: 500; }
            .ai-score-track { flex: 1; height: 8px; background: var(--gray-200); border-radius: 4px; overflow: hidden; }
            .ai-score-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
            .ai-score-value { width: 30px; text-align: right; font-size: 13px; font-weight: 600; }
            .ai-level-badge { display: inline-block; font-size: 32px; font-weight: 700; width: 56px; height: 56px; line-height: 56px; text-align: center; border-radius: 12px; }
            .ai-level-A { background: #e8f5e9; color: #2e7d32; }
            .ai-level-B { background: #e3f2fd; color: #1565c0; }
            .ai-level-C { background: #fff3e0; color: #e65100; }
            .ai-level-D { background: #fce4ec; color: #c62828; }
            .ai-section { margin-bottom: 16px; }
            .ai-section h4 { margin-bottom: 8px; font-size: 14px; color: var(--gray-700); }
            .ai-improvement { padding: 8px 12px; background: var(--gray-50); border-left: 3px solid var(--primary); margin-bottom: 6px; border-radius: 0 4px 4px 0; font-size: 13px; }
            .ai-example-box { padding: 12px; background: #f0f7ff; border: 1px solid #c2deff; border-radius: 8px; font-size: 13px; line-height: 1.6; }
        `;
        document.head.appendChild(style);
    });

    function requestAIFeedback(type, deliverableId) {
        const modal = document.getElementById('aiFeedbackModal');
        const contentEl = document.getElementById('aiFeedbackContent');

        // Show loading state
        contentEl.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-robot" style="font-size: 48px; color: #764ba2; margin-bottom: 16px; display: block;"></i>
                <h2 style="margin-bottom: 8px;">Analyzing Your Submission</h2>
                <p style="color: var(--gray-600); margin-bottom: 24px;">The AI is reviewing your work for specificity, detail, completeness, and insight...</p>
                <div style="width: 40px; height: 40px; border: 3px solid var(--gray-200); border-top-color: #764ba2; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        `;
        modal.classList.add('active');

        // Gather submission data
        let payload = { action: 'getAIFeedback', type, email: state.student?.email };

        if (type === 'reflection') {
            const data = getReflectionFormData();
            payload.week = data.week;
            payload.content = {
                contributions: data.contributions,
                challenges: data.challenges,
                solutions: data.solutions,
                goals: data.goals
            };
            payload.rubricScores = data.rubric;
        } else if (type === 'deliverable') {
            const deliverable = DELIVERABLES.find(d => d.id === deliverableId);
            payload.title = deliverable?.title || `Deliverable ${deliverableId}`;
            payload.week = deliverable?.week;
            payload.content = {
                text: document.getElementById('deliverableContent')?.value || ''
            };
        }

        // Call the backend
        fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(result => {
            if (result.error) {
                contentEl.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--danger); margin-bottom: 16px; display: block;"></i>
                        <h2>Unable to Get Feedback</h2>
                        <p style="color: var(--gray-600);">${result.error}</p>
                    </div>
                `;
                return;
            }
            displayAIFeedback(result.feedback, type);
        })
        .catch(err => {
            contentEl.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--danger); margin-bottom: 16px; display: block;"></i>
                    <h2>Connection Error</h2>
                    <p style="color: var(--gray-600);">Could not reach the server. Please try again.</p>
                </div>
            `;
        });
    }

    function displayAIFeedback(feedback, type) {
        const contentEl = document.getElementById('aiFeedbackContent');
        const scoreColors = { 1: '#c62828', 2: '#e65100', 3: '#1565c0', 4: '#2e7d32' };

        contentEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                <div class="ai-level-badge ai-level-${feedback.level}">${feedback.level}</div>
                <div>
                    <h2 style="margin: 0 0 4px 0;">AI Review</h2>
                    <p style="color: var(--gray-600); margin: 0; font-size: 14px;">${feedback.summary}</p>
                </div>
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-chart-bar"></i> Quality Scores</h4>
                ${['specificity', 'detail', 'completeness', 'insight'].map(key => `
                    <div class="ai-score-bar">
                        <span class="ai-score-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <div class="ai-score-track">
                            <div class="ai-score-fill" style="width: ${(feedback.scores[key] / 4) * 100}%; background: ${scoreColors[feedback.scores[key]] || '#999'};"></div>
                        </div>
                        <span class="ai-score-value">${feedback.scores[key]}/4</span>
                    </div>
                `).join('')}
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-star" style="color: #f9a825;"></i> Strengths</h4>
                ${feedback.strengths.map(s => `<div class="ai-improvement" style="border-left-color: var(--success);">${s}</div>`).join('')}
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-arrow-up" style="color: var(--primary);"></i> How to Improve</h4>
                ${feedback.improvements.map(i => `<div class="ai-improvement">${i}</div>`).join('')}
            </div>

            <div class="ai-section">
                <h4><i class="fas fa-edit"></i> Example Improvement</h4>
                <div class="ai-example-box">${feedback.example}</div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--gray-200);">
                <p style="color: var(--gray-500); font-size: 12px; margin-bottom: 12px;">Use this feedback to improve your submission, then submit when ready.</p>
                <button class="btn btn-secondary" onclick="document.getElementById('aiFeedbackModal').classList.remove('active')">
                    <i class="fas fa-arrow-left"></i> Back to Editing
                </button>
            </div>
        `;
    }

    // Patch the deliverable form to include AI review button
    const _originalOpenDeliverableForm = openDeliverableForm;
    openDeliverableForm = function(id) {
        _originalOpenDeliverableForm(id);
        // Inject AI review button into deliverable form actions
        const formActions = document.querySelector('#deliverableForm .form-actions');
        if (formActions) {
            const aiBtn = document.createElement('button');
            aiBtn.type = 'button';
            aiBtn.className = 'btn btn-secondary';
            aiBtn.innerHTML = '<i class="fas fa-robot"></i> AI Review';
            aiBtn.style.cssText = 'background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none;';
            aiBtn.addEventListener('click', () => requestAIFeedback('deliverable', id));
            formActions.insertBefore(aiBtn, formActions.firstChild);
        }
    };

    window.requestAIFeedback = requestAIFeedback;
}

// ============================================
// CLAW QUIZ PAGE
// ============================================

// Minimal metadata for results display — question text is fetched from backend (kept private)
const QUIZ_QUESTION_META = [
    { id: 'q1',    pts: 4, label: 'Question 1' },
    { id: 'q2',    pts: 4, label: 'Question 2' },
    { id: 'q3',    pts: 4, label: 'Question 3' },
    { id: 'q4',    pts: 4, label: 'Question 4' },
    { id: 'q5',    pts: 4, label: 'Question 5' },
    { id: 'q6',    pts: 6, label: 'Question 6' },
    { id: 'bonus', pts: 2, label: 'Bonus'       }
];

async function loadQuizPage() {
    const page = document.getElementById('quizPage');
    if (!page) return;

    // If we already have results in state, just render them
    if (state.quiz.submitted && state.quiz.grades) {
        renderQuizResults(page);
        return;
    }

    // Show loading while we check backend
    page.innerHTML = `
        <div class="page-header"><h1 class="page-title"><i class="fas fa-pencil-alt"></i> ${({claw:'Claw Project Quiz', final_exam:'Final Exam'})[state.config.quizKey] || 'Quiz'}</h1></div>
        <div style="text-align:center; padding: 60px 20px; color: var(--gray-500);">
            <i class="fas fa-spinner fa-spin" style="font-size:2rem; margin-bottom:16px;"></i>
            <p>Checking submission status…</p>
        </div>`;

    if (!state.quiz.loaded) {
        try {
            const res = await fetch(`${CONFIG.SHEETS_API_URL}?action=checkQuiz&email=${encodeURIComponent(state.student.email)}&quizId=${encodeURIComponent(state.config.quizKey || 'claw')}&_t=${Date.now()}`);
            const data = await res.json();
            state.quiz.loaded = true;
            if (data.submitted) {
                state.quiz.submitted = true;
                state.quiz.grades    = data.grades;
                state.quiz.aiTotal   = data.aiTotal;
                updateUI(); // re-run to keep nav item visible
            }
        } catch(e) {
            state.quiz.loaded = true; // treat as not submitted on error
        }
    }

    if (state.quiz.submitted && state.quiz.grades) {
        renderQuizResults(page);
        return;
    }

    // Fetch quiz meta (question text) from backend if not yet loaded
    if (!state.quiz.meta) {
        try {
            const res = await fetch(`${CONFIG.SHEETS_API_URL}?action=getQuizMeta&quizId=${encodeURIComponent(state.config.quizKey || 'claw')}&_t=${Date.now()}`);
            const data = await res.json();
            if (data.questions) state.quiz.meta = data;
            else state.quiz.metaError = data.error || 'Backend returned no questions.';
        } catch(e) {
            state.quiz.metaError = 'Network error: ' + (e.message || e);
        }
    }

    if (!state.quiz.meta) {
        const errDetail = state.quiz.metaError ? `<br><br><span style="font-size:12px; color:var(--gray-500);">Detail: ${escapeHtmlQuiz(state.quiz.metaError)}</span>` : '';
        page.innerHTML = `
            <div class="page-header"><h1 class="page-title"><i class="fas fa-pencil-alt"></i> ${({claw:'Claw Project Quiz', final_exam:'Final Exam'})[state.config.quizKey] || 'Quiz'}</h1></div>
            <div class="card" style="color:var(--danger); padding:20px;">
                Unable to load quiz questions. Please refresh the page or notify Mr. Bombich.${errDetail}
            </div>`;
        return;
    }

    renderQuizForm(page);
}

function renderQuizForm(page) {
    const questions = state.quiz.meta?.questions || [];
    const quizName  = state.quiz.meta?.name || 'Quiz';
    const maxPts    = state.quiz.meta?.maxPoints;
    const isMC      = questions.length > 0 && questions.every(q => q.type === 'mc');
    let questionsHtml = '';
    questions.forEach((q) => {
        const isBonus = q.id === 'bonus';
        const cardStyle = isBonus
            ? 'border: 1px solid var(--success); background: rgba(16,185,129,0.04);'
            : 'border: 1px solid var(--gray-200);';
        let inputHtml;
        if (q.type === 'mc' && q.options) {
            inputHtml = `<div style="display:flex; flex-direction:column; gap:10px; margin-top:4px;">` +
                q.options.map(opt => {
                    const val = opt.charAt(0);
                    return `<label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px; color:var(--gray-700); padding:10px 14px; border:1px solid var(--gray-200); border-radius:6px; transition:background 0.15s;" onmouseover="this.style.background='var(--gray-50)'" onmouseout="this.style.background=''">
                        <input type="radio" name="ans-${q.id}" value="${val}" style="width:16px; height:16px; cursor:pointer; accent-color:var(--primary);" onchange="onQuizAnswerInput('${q.id}', false)">
                        ${escapeHtmlQuiz(opt)}
                    </label>`;
                }).join('') +
                `</div>`;
        } else {
            inputHtml = `<textarea id="ans-${q.id}" rows="4"
                    placeholder="${isBonus ? 'Optional — write your answer here…' : 'Write your answer here…'}"
                    style="width:100%; padding:12px; border:1px solid var(--gray-300); border-radius:6px; font-family:inherit; font-size:14px; resize:vertical; line-height:1.6; transition: border-color 0.2s;"
                    oninput="onQuizAnswerInput('${q.id}', ${isBonus})"
                    onblur="saveQuizDraft()"
                ></textarea>`;
        }
        questionsHtml += `
            <div class="card" id="qcard-${q.id}" style="${cardStyle} margin-bottom: 20px; padding: 24px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                    <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:${isBonus ? 'var(--success)' : 'var(--gray-400)'};">${q.label}</span>
                    <span style="font-size:12px; font-weight:700; color: var(--primary); background: var(--primary-light, rgba(99,102,241,0.1)); padding: 2px 10px; border-radius:12px;">${q.pts} pt${q.pts !== 1 ? 's' : ''}</span>
                </div>
                <p style="font-size:15px; line-height:1.65; margin-bottom:14px; color: var(--gray-700);">${q.text}</p>
                ${inputHtml}
            </div>`;
    });

    const ptsLabel = maxPts != null ? `${maxPts} pts` : '';
    const noticeHtml = isMC
        ? `<div class="card" style="border-left: 4px solid var(--warning, #f59e0b); background: rgba(245,158,11,0.05); margin-bottom:24px; padding:16px 20px;">
            <p style="font-size:14px; color:var(--gray-600); line-height:1.6;">
                <strong style="color:var(--warning, #b45309);">No other browser tabs. No AI tools.</strong>
                Select the best answer for each question.
                You have <strong>one attempt</strong> — once you submit, the exam is locked.
            </p>
           </div>`
        : `<div class="card" style="border-left: 4px solid var(--warning, #f59e0b); background: rgba(245,158,11,0.05); margin-bottom:24px; padding:16px 20px;">
            <p style="font-size:14px; color:var(--gray-600); line-height:1.6;">
                <strong style="color:var(--warning, #b45309);">No notes, no devices, no AI.</strong>
                Answer all required questions in your own words.
                You have <strong>one attempt</strong> — once you submit, the quiz is locked.
                After submitting you will receive AI-generated feedback.
                Mr. Bombich reviews all responses and <strong>has final say on your grade</strong>.
            </p>
           </div>`;

    page.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fas fa-pencil-alt"></i> ${escapeHtmlQuiz(quizName)}</h1>
            <p style="color:var(--gray-500); margin-top:6px;">${isMC ? (ptsLabel || '') : (ptsLabel ? `No notes permitted · ${ptsLabel}` : 'No notes permitted')}</p>
        </div>
        ${noticeHtml}

        <div id="quizSaveIndicator" style="font-size:13px; color:var(--success, #10b981); margin-bottom:14px; min-height:18px; font-weight:600;"></div>

        <form id="quizForm">
            ${questionsHtml}
            <button type="submit" class="btn btn-primary" style="width:100%; padding:14px; font-size:16px; margin-top:8px;">
                <i class="fas fa-paper-plane"></i> Submit ${isMC ? 'Exam' : 'Quiz'}
            </button>
        </form>`;

    document.getElementById('quizForm').addEventListener('submit', submitQuiz);

    // Restore any draft saved from a previous session before the page was lost
    restoreQuizDraft();

    // Warn before closing/refreshing if quiz has typed content (and is not yet submitted)
    if (!quizUnloadHandlerInstalled) {
        window.addEventListener('beforeunload', function(e) {
            if (state.quiz.submitted) return;
            const formExists = !!document.getElementById('quizForm');
            if (!formExists) return;
            const activeQs = state.quiz.meta?.questions || QUIZ_QUESTION_META;
            const hasContent = activeQs.some(q => {
                if (q.type === 'mc') return !!document.querySelector(`input[name="ans-${q.id}"]:checked`);
                const el = document.getElementById('ans-' + q.id);
                return el && el.value.trim().length > 0;
            });
            if (hasContent) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
        quizUnloadHandlerInstalled = true;
    }
}

let quizUnloadHandlerInstalled = false;

// ── Quiz draft autosave (defends against tab close, hard refresh, browser crash) ──
const QUIZ_DRAFT_KEY_PREFIX = 'clawQuizDraft_';

function quizDraftKey() {
    return QUIZ_DRAFT_KEY_PREFIX + (state.student?.email || 'pending');
}

function onQuizAnswerInput(qid, isBonus) {
    const card = document.getElementById('qcard-' + qid);
    if (card) {
        const radio = document.querySelector(`input[name="ans-${qid}"]:checked`);
        const ta = document.getElementById('ans-' + qid);
        const hasAnswer = radio ? true : (ta ? !!ta.value.trim() : false);
        card.style.borderColor = hasAnswer
            ? 'var(--primary)'
            : (isBonus ? 'var(--success)' : 'var(--gray-200)');
    }
    saveQuizDraft();
}
window.onQuizAnswerInput = onQuizAnswerInput;

function saveQuizDraft() {
    const draft = {};
    (state.quiz.meta?.questions || QUIZ_QUESTION_META).forEach(q => {
        if (q.type === 'mc') {
            // Capture the selected radio value (e.g. "A"). Radio state does NOT
            // survive a page reload — without this, MC drafts were always empty.
            const radio = document.querySelector(`input[name="ans-${q.id}"]:checked`);
            if (radio) draft[q.id] = radio.value;
        } else {
            const el = document.getElementById('ans-' + q.id);
            if (el) draft[q.id] = el.value;
        }
    });
    const json = JSON.stringify(draft);
    const key = quizDraftKey();
    try { localStorage.setItem(key, json); }   catch(e) {}
    try { sessionStorage.setItem(key, json); } catch(e) {}
    const indicator = document.getElementById('quizSaveIndicator');
    if (indicator) {
        const t = new Date();
        const hh = String(t.getHours()).padStart(2,'0');
        const mm = String(t.getMinutes()).padStart(2,'0');
        const ss = String(t.getSeconds()).padStart(2,'0');
        indicator.textContent = `✓ Draft saved at ${hh}:${mm}:${ss} — your answers are safe if the page reloads`;
    }
}
window.saveQuizDraft = saveQuizDraft;

function restoreQuizDraft() {
    try {
        const key = quizDraftKey();
        const pending = QUIZ_DRAFT_KEY_PREFIX + 'pending';
        const raw = sessionStorage.getItem(key) || localStorage.getItem(key)
                 || sessionStorage.getItem(pending) || localStorage.getItem(pending);
        if (!raw) return;
        const draft = JSON.parse(raw);
        (state.quiz.meta?.questions || QUIZ_QUESTION_META).forEach(q => {
            if (!draft[q.id]) return;
            if (q.type === 'mc') {
                const radio = document.querySelector(`input[name="ans-${q.id}"][value="${draft[q.id]}"]`);
                if (radio) {
                    radio.checked = true;
                    onQuizAnswerInput(q.id, false);
                }
            } else {
                const el = document.getElementById('ans-' + q.id);
                if (el) {
                    el.value = draft[q.id];
                    onQuizAnswerInput(q.id, q.id === 'bonus');
                }
            }
        });
        const indicator = document.getElementById('quizSaveIndicator');
        if (indicator) indicator.textContent = '↩ Draft restored from your last session — keep typing.';
    } catch(e) {}
}

function clearQuizDraft() {
    const key = quizDraftKey();
    try { localStorage.removeItem(key); }   catch(e) {}
    try { sessionStorage.removeItem(key); } catch(e) {}
}

async function submitQuiz(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type=submit]');
    if (btn.disabled) return;

    const quizQuestions = state.quiz.meta?.questions || QUIZ_QUESTION_META;
    const required = quizQuestions.filter(q => q.id !== 'bonus');
    const missing = required.filter(q => {
        if (q.type === 'mc') return !document.querySelector(`input[name="ans-${q.id}"]:checked`);
        return !document.getElementById('ans-' + q.id)?.value.trim();
    }).map(q => q.id);
    if (missing.length) {
        showToast(`Please answer all required questions (${missing.map(s => s.toUpperCase()).join(', ')})`, 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Grading your answers…';

    const payload = {
        action:    'submitQuiz',
        quizId:    state.config.quizKey || 'claw',
        email:     state.student.email,
        name:      state.student.name,
        timestamp: new Date().toLocaleString()
    };
    quizQuestions.forEach(q => {
        if (q.type === 'mc') {
            payload[q.id] = document.querySelector(`input[name="ans-${q.id}"]:checked`)?.value || '';
        } else {
            payload[q.id] = document.getElementById('ans-' + q.id)?.value || '';
        }
    });

    try {
        const res = await fetch(CONFIG.SHEETS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' }, // Required for Google Apps Script CORS
            body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (data.success) {
            state.quiz.submitted      = true;
            state.quiz.grades         = data.grades;
            state.quiz.aiTotal        = data.aiTotal;
            state.quiz.gradingPending = !!data.gradingPending;
            state.quiz.loaded         = true;
            clearQuizDraft();
            updateUI();
            renderQuizResults(document.getElementById('quizPage'));
            showToast(data.gradingPending
                ? 'Quiz submitted! AI grading unavailable — Mr. Bombich will grade manually.'
                : 'Quiz submitted!', data.gradingPending ? 'warning' : 'success');
        } else if (data.error === 'already_submitted') {
            state.quiz.submitted = true;
            state.quiz.loaded    = true;
            clearQuizDraft();
            showToast('Already submitted — reload to see your results.', 'warning');
        } else {
            throw new Error(data.error || 'Submission failed');
        }
    } catch(err) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Quiz';
        showToast('Submission error: ' + err.message + ' — screenshot your answers and notify Mr. Bombich.', 'error');
    }
}

function renderQuizResults(page) {
    const grades   = state.quiz.grades || {};
    const aiTotal        = state.quiz.aiTotal ?? '—';
    const gradingPending = state.quiz.gradingPending;

    function badgeStyle(score, max) {
        const pct = score / max;
        if (pct >= 1.0)  return 'background:#d1fae5; color:#065f46;';
        if (pct >= 0.75) return 'background:#fef3c7; color:#92400e;';
        if (pct >= 0.5)  return 'background:#fed7aa; color:#9a3412;';
        return 'background:#fee2e2; color:#991b1b;';
    }

    const resultQuestions = state.quiz.meta?.questions || QUIZ_QUESTION_META;
    const quizMaxPts = state.quiz.meta?.maxPoints;
    let cardsHtml = '';
    resultQuestions.forEach(q => {
        const g = grades[q.id] || { score: null, feedback: '' };
        const scoreNull = g.score === null || g.score === undefined || g.score === '';
        const score = scoreNull ? null : Math.min(Number(g.score) || 0, q.pts);
        const badgePart = scoreNull
            ? `<span style="font-size:13px; font-weight:700; padding:3px 12px; border-radius:12px; background:#f3f4f6; color:#6b7280;">Pending</span>`
            : `<span style="font-size:13px; font-weight:700; padding:3px 12px; border-radius:12px; ${badgeStyle(score, q.pts)}">${score} / ${q.pts}</span>`;
        const answerBlock = g.answer
            ? `<p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--gray-400); margin-bottom:6px;">Your Answer</p>
               <p style="font-size:14px; color:var(--gray-700); line-height:1.65; background:#f8fafc; border-radius:6px; padding:12px 14px; border-left:3px solid var(--gray-300); margin-bottom:12px; white-space:pre-wrap;">${escapeHtmlQuiz(g.answer)}</p>`
            : '';
        const feedbackLabel = q.type === 'mc' ? 'Result' : 'AI Feedback';
        const feedbackBlock = g.feedback
            ? `<p style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:var(--gray-400); margin-bottom:6px;">${feedbackLabel}</p>
               <p style="font-size:14px; color:var(--gray-600); line-height:1.65; background:var(--gray-50); border-radius:6px; padding:12px 14px; border-left:3px solid var(--primary);">${escapeHtmlQuiz(g.feedback)}</p>`
            : '';
        cardsHtml += `
            <div class="card" style="margin-bottom:18px; padding:22px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                    <span style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--gray-400);">${q.label}</span>
                    ${badgePart}
                </div>
                <p style="font-size:14px; color:var(--gray-400); font-style:italic; line-height:1.6; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--gray-100);">${q.text}</p>
                ${answerBlock}
                ${feedbackBlock}
            </div>`;
    });

    const disclaimerHtml = gradingPending
        ? `<div class="card" style="border-left:4px solid #ef4444; background:rgba(239,68,68,0.05); margin-bottom:24px; padding:18px 22px;">
            <p style="font-size:14px; line-height:1.65; color:var(--gray-600);">
                <strong style="color:#b91c1c;">AI grading is temporarily unavailable.</strong>
                Your answers were saved successfully. Mr. Bombich will grade your quiz manually.
            </p>
           </div>`
        : `<div class="card" style="border-left:4px solid #f59e0b; background:rgba(245,158,11,0.05); margin-bottom:24px; padding:18px 22px;">
            <p style="font-size:14px; line-height:1.65; color:var(--gray-600);">
                <strong style="color:#b45309;">About these scores:</strong>
                The scores and feedback below were generated by AI to give you immediate insight into your answers.
                <strong>Mr. Bombich will review every response</strong> and has final say on your grade.
                Your official grade may differ from the AI score — you will be notified when grading is complete.
            </p>
           </div>`;

    const totalHtml = gradingPending ? '' : `
        <div class="card" style="text-align:center; padding:30px; background: linear-gradient(135deg, rgba(99,102,241,0.05), rgba(99,102,241,0.1)); border:2px solid var(--primary);">
            <p style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:var(--gray-400); margin-bottom:8px;">AI-Generated Score</p>
            <p style="font-family:monospace; font-size:3rem; font-weight:900; color:var(--primary); line-height:1;">${aiTotal}</p>
            <p style="font-size:13px; color:var(--gray-400); margin-top:6px;">out of ${quizMaxPts || '—'} points</p>
            <p style="font-size:13px; color:var(--gray-500); margin-top:12px;">This is a starting point for teacher review, not your official grade.</p>
        </div>`;

    page.innerHTML = `
        <div class="page-header">
            <h1 class="page-title"><i class="fas fa-check-circle" style="color:var(--success);"></i> Quiz Submitted</h1>
        </div>
        ${disclaimerHtml}
        ${cardsHtml}
        ${totalHtml}`;
}

function escapeHtmlQuiz(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
