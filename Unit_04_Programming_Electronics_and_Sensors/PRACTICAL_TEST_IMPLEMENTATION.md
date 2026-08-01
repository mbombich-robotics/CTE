# Practical Test Implementation Summary

## Overview
This document summarizes the fully automated practical coding test that has been added to the Unit 5 Quiz.

## Test Structure

### Part A: Multiple Choice (20 points)
- 20 questions covering Lessons 2-5
- Instant feedback with explanations
- Auto-scored

### Part B: Practical Debugging Test (10 points)
- Students receive buggy Arduino code
- Must find and fix 5 intentional bugs
- Test code on Arduino Uno
- Submit corrected code
- **Fully auto-graded with detailed feedback**

**Total**: 30 points

## Bug List (Part B Starter Code)

| Bug # | Type | Concept Tested | Lesson |
|-------|------|----------------|--------|
| 1 | Missing `Serial.begin(9600);` | Serial Monitor setup | Lesson 3 |
| 2 | `pinMode(9, INPUT)` instead of `OUTPUT` | pinMode configuration | Lesson 2 |
| 3 | Missing semicolon + wrong variable name | Syntax + Variables | Lessons 2 & 3 |
| 4 | `analogWrite(9, 300)` - PWM out of range | PWM limits (0-255) | Lesson 5 |
| 5 | `Serial.println(300)` should be `255` | PWM max value | Lesson 5 |

## Auto-Grading Rubric

| Check | Points | Criteria |
|-------|--------|----------|
| Serial.begin(9600) | 2 | Must be present in setup() |
| pinMode(9, OUTPUT) | 2 | Correct pin mode |
| Variable & Semicolons | 2 | pwmValue used correctly, all semicolons present |
| PWM Range | 2 | No values > 255, final value is 255 |
| analogWrite() Usage | 2 | Correct function calls in loop |
| **Total** | **10** | 70% (7/10) to pass |

## Student Workflow

1. **Copy Starter Code**
   - Click green "Copy Code" button in quiz

2. **Paste into Arduino IDE**
   - Open Arduino IDE
   - Press Ctrl+A to select all
   - Press Ctrl+V to paste

3. **Debug & Fix**
   - Try to compile - see errors
   - Fix bugs one by one
   - Upload to Arduino Uno
   - Verify Serial Monitor output matches expected output

4. **Submit**
   - Copy corrected code from IDE
   - Paste into quiz text box
   - Submit quiz

5. **Get Instant Feedback**
   - See total score (Part A + Part B)
   - View detailed feedback on code:
     - ✓ Serial.begin(9600) present (2 pts)
     - ✓ pinMode(9, OUTPUT) correct (2 pts)
     - etc.

## Expected Serial Monitor Output

```
Motor Speed: 0
Motor Speed: 25
Motor Speed: 50
Motor Speed: 75
Motor Speed: 100
Motor Speed: 125
Motor Speed: 150
Motor Speed: 175
Motor Speed: 200
Motor Speed: 225
Motor Speed: 255
```

## Files Created/Modified

### New Files:
1. `Practical_Test_Starter_Code.ino` - Buggy code for students
2. `Practical_Test_Correct_Solution.ino` - Correct solution for reference
3. `Auto_Grading_Logic.js` - Standalone grading logic reference

### Modified Files:
1. `Lesson_06_Quiz_Graded.html`
   - Added Part B section with instructions
   - Added buggy code block with copy button
   - Added textarea for code submission
   - Integrated auto-grading logic
   - Updated results display to show Part A/B breakdown

2. `GoogleAppsScript_QuizSubmission.js`
   - Added Part A Score, Part B Score, Total Score columns
   - Added Code Feedback and Submitted Code columns
   - Updated color-coding for 30-point scale
   - Stores detailed grading feedback

## Google Sheets Output

### Columns:
| Column | Data |
|--------|------|
| Timestamp | Submission time |
| Email | Student email |
| Name | Student name |
| Part A Score | /20 points (multiple choice) |
| Part B Score | /10 points (coding test) |
| Total Score | /30 points |
| Percentage | % of total |
| Attempt # | 1 or 2 |
| Q1-Q20 | Individual question results (1=correct, 0=incorrect) |
| Code Feedback | Auto-grader feedback (newline-separated) |
| Submitted Code | Full student code submission |

### Color Coding:
- **Total Score**: Green (≥90%), Yellow (≥80%), Orange (≥70%), Red (<70%)
- **Part A Score**: Green (≥18/20), Yellow (≥16/20), Orange (≥14/20), Red (<14/20)
- **Part B Score**: Green (≥9/10), Yellow (≥8/10), Orange (≥7/10), Red (<7/10)
- **Individual Questions**: Green (correct), Red (incorrect)

## Prerequisites for Students

Students MUST complete Lessons 1-5 which cover:

✅ **Lesson 1**: Microcontroller fundamentals, Arduino IDE introduction, copy-paste workflow
✅ **Lesson 2**: pinMode(), digitalWrite(), setup() and loop()
✅ **Lesson 3**: Variables, Serial.begin(), Serial.print/println()
✅ **Lesson 4**: Digital I/O, if/else statements
✅ **Lesson 5**: analogWrite(), PWM (0-255 range), motor speed control

## Next Steps (TODO)

- [ ] Review Lessons 2-5 to ensure debugging practice is included
- [ ] Add debugging exercises to any lessons that need them
- [ ] Test the full quiz workflow end-to-end
- [ ] Deploy updated Google Apps Script
- [ ] Update quiz instructions if needed

## Time Estimates

- **Part A (Multiple Choice)**: 15-20 minutes
- **Part B (Practical Test)**: 10-20 minutes
- **Total Quiz Time**: 25-40 minutes

## Grading Philosophy

The auto-grader is **lenient and educational**:
- Partial credit awarded (e.g., 1/2 points for some checks)
- Detailed feedback shows exactly what was found/missing
- 70% passing threshold (21/30 total points)
- Students get immediate feedback to learn from mistakes
- Two attempts allowed

## Technical Implementation Details

### Auto-Grading Logic:
- Uses regex pattern matching on student code
- Removes comments and normalizes whitespace
- Checks for required functions/values
- No actual code compilation/execution (pattern-based only)
- Returns structured feedback object with score, percentage, and detailed feedback array

### Security:
- Code is never executed
- Only pattern matching performed
- No access to file system or network
- Submitted code stored in Google Sheets for manual review if needed

---

**Created**: December 2024
**Author**: Claude Code
**Purpose**: Unit 5 Practical Assessment
