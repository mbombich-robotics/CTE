# Unit 5: Introduction to Programming

This unit covers the fundamentals of Arduino programming and microcontroller concepts. Students will learn the basics of coding, hardware control, and debugging.

## Contents

### Lessons (HTML Presentations)

1. **Lesson_01_Microcontroller_Fundamentals.html**
   - What is a microcontroller?
   - CPU, memory, and I/O pins
   - Arduino boards explained
   - Motor controllers and power amplification
   - Duration: 50 minutes

2. **Lesson_02_Arduino_Introduction.html**
   - setup() and loop() structure
   - pinMode() and digitalWrite()
   - Creating blink patterns
   - Uploading code to Arduino
   - Duration: 50 minutes

3. **Lesson_03_Variables_Serial_Monitor.html**
   - Declaring variables (int, float, boolean)
   - Serial.begin() and Serial.println()
   - Reading analog sensors
   - Debugging with Serial Monitor
   - Duration: 44 minutes

4. **Lesson_04_Digital_Input_Control.html**
   - digitalRead() and INPUT_PULLUP
   - if/else statements
   - Comparison operators (==, !=, <, >)
   - For loops and while loops
   - Button-controlled LEDs
   - Duration: 50 minutes

5. **Lesson_05_Analog_PWM.html**
   - analogRead() 0-1023 values
   - analogWrite() PWM control
   - map() function for conversion
   - Fading LEDs and motor speed control
   - Duration: 50 minutes

### Assessment

6. **Lesson_06_Quiz.html** (Practice Quiz)
   - 20 multiple choice questions
   - Unlimited attempts
   - Instant feedback with explanations
   - No submission required
   - Duration: 25-30 minutes

7. **Lesson_06_Quiz_Graded.html** (Graded Quiz)
   - 20 multiple choice questions (same as practice)
   - Google Sign-In authentication required
   - Shuffled answer options
   - 2 attempts maximum per student
   - Auto-submits to Google Sheets
   - Duration: 25-30 minutes

### Backend & Documentation

- **GoogleAppsScript_QuizSubmission.js**
  - Backend code for Google Sheets integration
  - Receives quiz submissions via POST
  - Formats and color-codes gradebook
  - Deploy to Google Apps Script

- **QUIZ_SETUP_INSTRUCTIONS.md**
  - Complete step-by-step setup guide
  - Google Sheets setup
  - Google OAuth configuration
  - Deployment instructions
  - Troubleshooting tips

- **QUIZ_QUICK_REFERENCE.md**
  - Quick reference for teachers
  - Student instructions
  - Common questions
  - Gradebook interpretation
  - Export instructions

## How to Use

### For Students:
1. Start with Lesson 1 and progress sequentially through Lesson 5
2. Practice with **Lesson_06_Quiz.html** as many times as needed
3. When ready, take **Lesson_06_Quiz_Graded.html** (requires Google sign-in)

### For Teachers:
1. Share lesson HTML files via Google Classroom, web hosting, or shared drive
2. Set up the graded quiz following **QUIZ_SETUP_INSTRUCTIONS.md**
3. Monitor student progress in Google Sheets gradebook
4. Use **QUIZ_QUICK_REFERENCE.md** for day-to-day operations

## Learning Objectives

By the end of Unit 5, students will be able to:
- Explain what a microcontroller is and how it works
- Write basic Arduino programs using setup() and loop()
- Use variables to store and manipulate data
- Read digital and analog inputs from sensors
- Control outputs using digitalWrite() and analogWrite()
- Use if/else statements for decision-making
- Use for loops and while loops to repeat code
- Debug programs using the Serial Monitor
- Apply the map() function for sensor value conversion
- Understand PWM and its applications

## Next Steps

After completing Unit 5, students will be ready to:
- Apply programming concepts to robot control
- Implement tank drive motor control
- Add sensors for autonomous navigation
- Build more complex interactive projects

---

**Applied Engineering & Robotics** | Control Freak
