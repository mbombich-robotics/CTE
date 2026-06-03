/**
 * PRIVATE — Do not commit to version control.
 * This file is listed in .gitignore.
 *
 * SETUP: In the Apps Script editor, create a second script file named "quiz-content"
 * and paste the contents of this file into it. The main google-apps-script.js file
 * will reference QUIZ_REGISTRY automatically.
 *
 * To add a new quiz, add a new key to QUIZ_REGISTRY with the same structure.
 */

const QUIZ_REGISTRY = {

  claw: {
    name: 'Claw Quiz',
    sheetName: 'Claw Quiz',
    maxPoints: 28,  // 26 required + 2 bonus
    context: 'servo claws and potentiometer feedback on an Arduino-compatible microcontroller (RP2040)',
    questions: [
      {
        id: 'q1', label: 'Question 1', maxPts: 4,
        question: 'In your own words, what is PWM? How does the pulse width physically cause the servo to move to a different position?',
        rubric: `Award 0–4:
1 pt – Identifies PWM as Pulse Width Modulation (or describes on/off pulses at fixed frequency).
1 pt – Explains duty cycle: ratio of on-time to total period.
1 pt – Connects duty cycle/pulse width to a specific servo angle.
1 pt – Explanation is in the student's own words showing real understanding, not a copy-paste.`
      },
      {
        id: 'q2', label: 'Question 2', maxPts: 4,
        question: 'Describe in plain English how your code knows the claw has touched an object — without being able to see it. Why is this better than just closing the claw all the way every time?',
        rubric: `Award 0–4:
2 pts – Explains that the potentiometer ADC reading stalls/stops changing when the claw contacts resistance. Code detects contact when the value stops increasing despite the motor still trying to close.
2 pts – Explains why better than full-close: prevents crushing fragile objects, adapts to different sizes, avoids motor stall damage.`
      },
      {
        id: 'q3', label: 'Question 3', maxPts: 4,
        question: 'Given: if (abs(currentFeedback - oldFeedback) > 15) — a) What does abs() do and why is it needed here? b) What real-world event does this line detect?',
        rubric: `Award 0–4 (2 per part):
Part a: abs() returns absolute value. Needed because feedback could increase OR decrease depending on slip direction — we need the magnitude regardless of sign.
Part b: Detects an object slipping in the grip. Object movement shifts the claw ADC value more than 15 units from its hold position.`
      },
      {
        id: 'q4', label: 'Question 4', maxPts: 4,
        question: 'What controls how fast your claw closes? Point to the specific line, value, or variable in your code that is responsible, and explain what would happen if you changed it.',
        rubric: `Award 0–4:
2 pts – Identifies something specific: a delay() value between servo steps, a step-size increment, or a millis() interval. Vague "the loop" answers earn 0–1.
2 pts – Correctly explains effect of changing it: larger delay/smaller step = slower; smaller delay/larger step = faster.`
      },
      {
        id: 'q5', label: 'Question 5', maxPts: 4,
        question: 'Which specific line(s) in your code read the potentiometer and compare against your contact threshold? Write the line out (or reconstruct it) and explain what each part does.',
        rubric: `Award 0–4:
1 pt – Includes analogRead() call.
1 pt – Stores/uses the returned value correctly.
1 pt – Includes a comparison against a threshold (>, >=, etc.).
1 pt – Can explain what each part does (what analogRead returns, what the threshold represents).`
      },
      {
        id: 'q6', label: 'Question 6', maxPts: 6,
        question: 'What is blocking code? Using delay() as an example, explain why a blocking approach would have made it impossible to close the claw and check for contact at the same time — and describe how your program avoided this problem.',
        rubric: `Award 0–6:
2 pts – Correctly defines blocking code: halts all execution until finished (delay(1000) = CPU does nothing for 1 second).
2 pts – Explains the specific problem: delay() between servo steps would prevent analogRead() contact checks from running, so contact could be missed entirely.
2 pts – Describes their non-blocking solution: small servo increments each loop() pass, checking ADC every iteration, using millis() instead of delay(), or similar. Must be specific to their code.`
      },
      {
        id: 'bonus', label: 'Bonus', maxPts: 2,
        question: 'What does "active low" mean for the RGB LED on the RP2040 Connect? Why does it matter when you write code to turn on a specific color?',
        rubric: `Award 0–2:
1 pt – Active-low means LED turns ON when pin is driven LOW (0V), not HIGH.
1 pt – Practical consequence: to turn a color ON you write LOW (0) to that pin — opposite of what most expect. Writing HIGH turns it OFF.`
      }
    ]
  }

,

  final_exam: {
    name: 'Final Exam',
    sheetName: 'Final Exam',
    maxPoints: 20,
    context: 'applied engineering, CAD, rapid prototyping, shop safety, and Arduino programming',
    questions: [
      // ── Unit 1: Engineering Design Process ──────────────────────────────
      {
        id: 'q1', label: 'Question 1', maxPts: 1, type: 'mc',
        question: 'What is the FIRST step of the Engineering Design Process?',
        options: ['A) Create a prototype', 'B) Ask — define the problem', 'C) Test your solution', 'D) Research existing solutions'],
        correctAnswer: 'B'
      },
      {
        id: 'q2', label: 'Question 2', maxPts: 1, type: 'mc',
        question: 'In the 7-step EDP, what happens during the "Improve" step?',
        options: ['A) Build the final product', 'B) Research what others have done', 'C) Reflect on test results and revise the design', 'D) Identify the problem to solve'],
        correctAnswer: 'C'
      },
      {
        id: 'q3', label: 'Question 3', maxPts: 1, type: 'mc',
        question: 'What is the purpose of a design brief?',
        options: ['A) Document the final solution after it\'s built', 'B) Define the problem, constraints, and criteria before designing', 'C) List the materials needed for construction', 'D) Grade the finished project'],
        correctAnswer: 'B'
      },
      {
        id: 'q4', label: 'Question 4', maxPts: 1, type: 'mc',
        question: 'During the "Imagine" step of the EDP, a team should:',
        options: ['A) Select one idea and begin building immediately', 'B) Test the prototype against criteria', 'C) Generate multiple possible solutions without judging them', 'D) Write the final report'],
        correctAnswer: 'C'
      },
      // ── Unit 2: CAD Fundamentals ─────────────────────────────────────────
      {
        id: 'q5', label: 'Question 5', maxPts: 1, type: 'mc',
        question: 'In CAD software, what does a sketch "constraint" do?',
        options: ['A) Sets the material properties of the part', 'B) Adds color or texture to the model', 'C) Locks the position or relationship between sketch elements', 'D) Exports the file for 3D printing'],
        correctAnswer: 'C'
      },
      {
        id: 'q6', label: 'Question 6', maxPts: 1, type: 'mc',
        question: 'What does the Extrude tool do in CAD?',
        options: ['A) Adds color or material to a 3D body', 'B) Copies and mirrors a shape across an axis', 'C) Turns a 2D sketch profile into a 3D solid by extending it along an axis', 'D) Creates a 2D drawing from a 3D model'],
        correctAnswer: 'C'
      },
      {
        id: 'q7', label: 'Question 7', maxPts: 1, type: 'mc',
        question: 'Why is it important to fully constrain a sketch before extruding?',
        options: ['A) Unconstrained sketches use more memory', 'B) The software won\'t render colors on unconstrained geometry', 'C) Unconstrained geometry can shift or change dimensions unexpectedly', 'D) Constraints are only required for assembly files'],
        correctAnswer: 'C'
      },
      {
        id: 'q8', label: 'Question 8', maxPts: 1, type: 'mc',
        question: 'Before sending a 3D model to a printer, what must you do with the file?',
        options: ['A) Convert it to a PDF for documentation', 'B) Run it through a slicer to generate the tool paths the printer follows', 'C) Export it as a 2D engineering drawing', 'D) Compress it to reduce file size'],
        correctAnswer: 'B'
      },
      // ── Unit 3: Rapid Prototyping & Manufacturing ────────────────────────
      {
        id: 'q9', label: 'Question 9', maxPts: 1, type: 'mc',
        question: 'What does iterative design mean?',
        options: ['A) Building one perfect prototype and submitting it', 'B) Designing, testing, finding problems, and revising — repeatedly', 'C) Simulating the design before building anything', 'D) Having multiple students work on the same design simultaneously'],
        correctAnswer: 'B'
      },
      {
        id: 'q10', label: 'Question 10', maxPts: 1, type: 'mc',
        question: 'Which is a key advantage of 3D printing for prototyping?',
        options: ['A) It produces stronger parts than CNC machining in all cases', 'B) Parts are available instantly with no setup time', 'C) Complex shapes can be produced quickly without custom tooling', 'D) All materials can be 3D printed on the same printer'],
        correctAnswer: 'C'
      },
      {
        id: 'q11', label: 'Question 11', maxPts: 1, type: 'mc',
        question: 'When measuring a part, "tolerance" means:',
        options: ['A) The total weight the part can support', 'B) The acceptable range of variation from the nominal dimension', 'C) The hardness rating of the material', 'D) The maximum temperature the part can withstand'],
        correctAnswer: 'B'
      },
      {
        id: 'q12', label: 'Question 12', maxPts: 1, type: 'mc',
        question: 'What is the purpose of a CNC machine\'s "home" position?',
        options: ['A) Where the machine parks when powered off for shipping', 'B) A known reference point the machine uses to calculate all movement coordinates', 'C) Where the spindle runs at maximum speed', 'D) The location of the emergency stop button'],
        correctAnswer: 'B'
      },
      // ── Unit 4: Shop Safety ───────────────────────────────────────────────
      {
        id: 'q13', label: 'Question 13', maxPts: 1, type: 'mc',
        question: 'If a machine behaves unexpectedly while you\'re operating it, what should you do FIRST?',
        options: ['A) Call a classmate to come look at it', 'B) Finish the cut since you\'ve already started', 'C) Stop the machine immediately using the nearest stop control', 'D) Continue and report the issue after class'],
        correctAnswer: 'C'
      },
      {
        id: 'q14', label: 'Question 14', maxPts: 1, type: 'mc',
        question: 'Why must bystanders — not just the operator — wear eye protection in the shop?',
        options: ['A) Eye protection is only required for the machine operator', 'B) Debris and chips can travel across the room and injure bystanders', 'C) Eye protection improves vision near bright work lights', 'D) It is only required when handling chemicals'],
        correctAnswer: 'B'
      },
      {
        id: 'q15', label: 'Question 15', maxPts: 1, type: 'mc',
        question: 'What is the purpose of a machine\'s safety guard?',
        options: ['A) To prevent the operator from seeing the cutting area', 'B) To reduce the noise level in the shop', 'C) To shield the operator from flying debris and accidental contact with moving parts', 'D) To hold the workpiece in place during cutting'],
        correctAnswer: 'C'
      },
      // ── Unit 5: Programming & Electronics ───────────────────────────────
      {
        id: 'q16', label: 'Question 16', maxPts: 1, type: 'mc',
        question: 'An ultrasonic distance sensor measures distance by:',
        options: ['A) Detecting changes in light reflected off a surface', 'B) Emitting a sound pulse and measuring the time it takes for the echo to return', 'C) Measuring electrical resistance between two probes', 'D) Counting the number of wheel rotations'],
        correctAnswer: 'B'
      },
      {
        id: 'q17', label: 'Question 17', maxPts: 1, type: 'mc',
        question: 'What is the key difference between a digital pin and an analog pin on an Arduino?',
        options: ['A) Digital pins can only be inputs; analog pins can only be outputs', 'B) Digital pins read/write only HIGH or LOW (0 V or 5 V); analog pins read a range of voltages (0–5 V mapped to 0–1023)', 'C) Digital pins are faster but analog pins are more accurate', 'D) There is no functional difference — the names are just labels'],
        correctAnswer: 'B'
      },
      {
        id: 'q18', label: 'Question 18', maxPts: 1, type: 'mc',
        question: 'On an Arduino, when you call analogWrite(pin, 128), what does the pin actually output?',
        options: ['A) A true 2.5 V analog voltage', 'B) A PWM signal that is HIGH 50% of the time, averaging roughly 2.5 V', 'C) A constant 128 mV signal', 'D) Nothing — analogWrite() only works on analog input pins'],
        correctAnswer: 'B'
      },
      {
        id: 'q19', label: 'Question 19', maxPts: 1, type: 'mc',
        question: 'Why is millis() preferred over delay() when a program needs to do multiple things at once?',
        options: ['A) millis() is more precise than delay() for timing', 'B) delay() only works on analog pins', 'C) delay() blocks ALL other code from running during the wait; millis() lets loop() keep executing', 'D) millis() uses less memory than delay()'],
        correctAnswer: 'C'
      },
      {
        id: 'q20', label: 'Question 20', maxPts: 1, type: 'mc',
        question: 'A potentiometer is useful as a position sensor because:',
        options: ['A) It generates its own voltage from mechanical movement', 'B) Its resistance — and therefore output voltage — changes proportionally as the shaft rotates', 'C) It can directly drive a servo motor without a microcontroller', 'D) It measures temperature and converts it to a voltage'],
        correctAnswer: 'B'
      }
    ]
  }

};
