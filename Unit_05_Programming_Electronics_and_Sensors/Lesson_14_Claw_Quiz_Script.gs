// ============================================================
// Claw Project Quiz — Google Apps Script Backend
// Unit 5, Lesson 14 | Vicksburg High School
//
// SETUP:
//   1. Create a new Google Sheet (any name you like)
//   2. Copy the Sheet ID from its URL and paste below
//   3. Go to Extensions > Apps Script, paste this file
//   4. Add your Gemini key:
//        Extensions > Apps Script > Project Settings > Script Properties
//        Property: GEMINI_API_KEY  |  Value: (your key from aistudio.google.com)
//   5. Deploy > New Deployment
//        Type: Web App | Execute as: Me | Access: Anyone
//   6. Copy the deployment URL into Lesson_14_Claw_Quiz.html
// ============================================================

const SPREADSHEET_ID = 'REPLACE_WITH_YOUR_SPREADSHEET_ID';
const SHEET_NAME     = 'Claw Quiz Submissions';
const GEMINI_MODEL   = 'gemini-1.5-flash';

// ── Sheet columns (1-indexed) ────────────────────────────────
// A  Timestamp       B  Email           C  Name
// D  Q1 Answer       E  Q1 AI Score     F  Q1 AI Feedback
// G  Q2 Answer       H  Q2 AI Score     I  Q2 AI Feedback
// J  Q3 Answer       K  Q3 AI Score     L  Q3 AI Feedback
// M  Q4 Answer       N  Q4 AI Score     O  Q4 AI Feedback
// P  Q5 Answer       Q  Q5 AI Score     R  Q5 AI Feedback
// S  Q6 Answer       T  Q6 AI Score     U  Q6 AI Feedback
// V  Bonus Answer    W  Bonus AI Score  X  Bonus AI Feedback
// Y  AI Total        Z  Teacher Final Score  (you fill this in)
// ─────────────────────────────────────────────────────────────

// ── Grading config — question text + rubric per question ─────
const GRADING_CONFIG = [
  {
    id: 'q1',
    maxPts: 4,
    question: 'In your own words, what is PWM? How does the pulse width physically cause the servo to move to a different position?',
    rubric: `Award 0–4 points:
1 pt — Correctly identifies PWM as Pulse Width Modulation (or describes repeated on/off pulses at fixed frequency).
1 pt — Explains duty cycle: the ratio of on-time to total period (how long the pulse stays high each cycle).
1 pt — Connects duty cycle or pulse width to servo angle (e.g., longer pulse = specific angular position).
1 pt — Explanation is in the student's own words showing genuine understanding (not copied from a textbook).
Penalize: confusing PWM with simple analog voltage, or not connecting back to servo position.`
  },
  {
    id: 'q2',
    maxPts: 4,
    question: 'Describe in plain English how your code knows the claw has touched an object without being able to see it. Why is this better than just closing the claw all the way every time?',
    rubric: `Award 0–4 points:
2 pts — Correctly explains the detection mechanism: the potentiometer (feedback) ADC reading stalls or stops changing when the claw contacts an object because the servo stalls against resistance. The code detects contact when the value stops increasing despite the motor still trying to close.
2 pts — Explains why this is better than full-close: prevents crushing fragile or soft objects, adapts grip pressure to the object size, avoids motor stall damage.
Accept any explanation that shows understanding that ADC feedback reveals physical contact.`
  },
  {
    id: 'q3',
    maxPts: 4,
    question: 'Look at this line from the slip detection function: if (abs(currentFeedback - holdFeedback) > 15) — Part a: What does abs() do and why is it needed here? Part b: What real-world event does this line detect?',
    rubric: `Award 0–4 points (2 pts per part):
Part a (2 pts): abs() returns the absolute value — it removes the sign so the result is always non-negative. It is needed because the feedback value could increase or decrease when slip occurs depending on direction of movement, so we need the magnitude of change regardless of sign.
Part b (2 pts): The line detects an object slipping in the claw's grip. If the held object moves, the claw position shifts, changing the potentiometer reading by more than 15 units from its initial hold value (holdFeedback).`
  },
  {
    id: 'q4',
    maxPts: 4,
    question: 'What controls how fast your claw closes — what determines the speed of each small servo step? Point to the specific line, value, or variable responsible, and explain what would happen if you changed it.',
    rubric: `Award 0–4 points:
2 pts — Student identifies something specific and concrete: a delay() call value (e.g., "delay(20) between steps"), a step-size variable or increment amount (e.g., "I add 1 to servo position each iteration"), or a millis() interval. Vague answers like "the loop controls it" without specifics earn 0–1 pt.
2 pts — Correctly explains the effect of changing the value: larger delay or smaller step = slower close; smaller delay or larger step = faster close. Must demonstrate understanding of the relationship between the parameter and speed.`
  },
  {
    id: 'q5',
    maxPts: 4,
    question: 'Which specific line or lines in your code read the potentiometer and compare the result against your contact threshold? Write the line out (or reconstruct it) and explain what each part does.',
    rubric: `Award 0–4 points:
1 pt — Includes an analogRead() call (or equivalent ADC read function).
1 pt — Stores or uses the returned value correctly (assigned to a variable or used in an expression).
1 pt — Includes a comparison against a threshold (>, >=, <, etc.) with a numeric or named constant.
1 pt — Can explain what each part does: what analogRead returns (0–1023 ADC count), what the threshold represents (the ADC value at which contact is considered detected).
Accept reasonable variations in variable names, syntax, or approach. The core concept is: read ADC → compare to contact threshold.`
  },
  {
    id: 'q6',
    maxPts: 6,
    question: 'What is blocking code? Using delay() as an example, explain why a blocking approach would have made it impossible to close the claw and check for contact at the same time — and describe how your program was structured to avoid this problem.',
    rubric: `Award 0–6 points:
2 pts — Correctly defines blocking code: code that halts all program execution until it finishes. delay(1000) is a perfect example — the CPU does nothing else for one full second.
2 pts — Explains the specific problem for this project: if delay() were called between servo steps to pace the closing motion, the analogRead() contact check cannot run during that pause, so contact could be missed entirely (the claw could crush an object between checks).
2 pts — Describes a working non-blocking approach they used: incrementing the servo position by a small amount each loop() pass without any delay, checking ADC on every iteration; or using millis() to time steps instead of delay(); or similar. Must be specific to their actual implementation, not just generic.`
  },
  {
    id: 'bonus',
    maxPts: 2,
    question: 'What does "active low" mean for the RGB LED on the RP2040 Connect? Why does it matter when you write code to turn on a specific color?',
    rubric: `Award 0–2 points:
1 pt — Explains active-low: the LED illuminates when the pin is driven LOW (0V / logic 0), not HIGH.
1 pt — Explains the practical consequence for coding: to turn a color ON, you write LOW (or 0) to that pin — the opposite of what you might expect. Writing HIGH turns the LED OFF.`
  }
];

// ── Helpers ──────────────────────────────────────────────────
function corsResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp', 'Email', 'Name',
      'Q1 Answer', 'Q1 AI Score', 'Q1 AI Feedback',
      'Q2 Answer', 'Q2 AI Score', 'Q2 AI Feedback',
      'Q3 Answer', 'Q3 AI Score', 'Q3 AI Feedback',
      'Q4 Answer', 'Q4 AI Score', 'Q4 AI Feedback',
      'Q5 Answer', 'Q5 AI Score', 'Q5 AI Feedback',
      'Q6 Answer', 'Q6 AI Score', 'Q6 AI Feedback',
      'Bonus Answer', 'Bonus AI Score', 'Bonus AI Feedback',
      'AI Total', 'Teacher Final Score'
    ]);
    sheet.setFrozenRows(1);
    // Answer columns wider for readability
    [4, 7, 10, 13, 16, 19, 22].forEach(c => sheet.setColumnWidth(c, 340));
    // Feedback columns
    [6, 9, 12, 15, 18, 21, 24].forEach(c => sheet.setColumnWidth(c, 280));
    // Score columns
    [5, 8, 11, 14, 17, 20, 23, 25, 26].forEach(c => sheet.setColumnWidth(c, 100));
  }

  return sheet;
}

function emailAlreadySubmitted(sheet, email) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]).toLowerCase().trim() === email) return true;
  }
  return false;
}

// ── Gemini grading ───────────────────────────────────────────
function gradeWithGemini(answers) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new Error('GEMINI_API_KEY not set in Script Properties.');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  let prompt = `You are grading a high school robotics quiz about embedded systems programming.
The project: students built a claw (servo motor + potentiometer feedback) controlled by an Arduino-compatible microcontroller.
Grade each answer using only the rubric provided. Be fair but strict.

Respond ONLY with a valid JSON array — no markdown fences, no explanation outside the JSON.
Each element: {"id": "<question id>", "score": <integer>, "feedback": "<1-2 sentences: what they got right AND what was missing or wrong>"}

QUESTIONS:\n`;

  for (const q of GRADING_CONFIG) {
    const answer = (answers[q.id] || '').trim() || '(no answer provided)';
    prompt += `
---
id: ${q.id}
max_points: ${q.maxPts}
question: ${q.question}
rubric: ${q.rubric}
student_answer: "${answer.replace(/"/g, "'")}"
`;
  }

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 2048 }
  };

  const resp = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const raw = JSON.parse(resp.getContentText());

  if (raw.error) throw new Error('Gemini error: ' + raw.error.message);

  const text = raw.candidates[0].content.parts[0].text;
  // Strip markdown code fences if Gemini adds them despite instructions
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

// ── GET — check for prior submission ─────────────────────────
function doGet(e) {
  if (e.parameter.action === 'checkSubmission') {
    const email = (e.parameter.email || '').toLowerCase().trim();
    if (!email) return corsResponse({ error: 'Missing email' });
    const submitted = emailAlreadySubmitted(getSheet(), email);
    return corsResponse({ submitted });
  }
  return corsResponse({ error: 'Unknown action' });
}

// ── POST — grade + store submission ──────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action !== 'submitQuiz') {
      return corsResponse({ success: false, error: 'Unknown action' });
    }

    const email = (data.email || '').toLowerCase().trim();
    if (!email) return corsResponse({ success: false, error: 'Missing email' });

    const sheet = getSheet();

    // Server-side duplicate guard
    if (emailAlreadySubmitted(sheet, email)) {
      return corsResponse({ success: false, error: 'already_submitted' });
    }

    // Grade with Gemini
    const grades = gradeWithGemini(data);

    // Build a lookup map by id
    const gradeMap = {};
    grades.forEach(g => { gradeMap[g.id] = g; });

    // Calculate AI total
    let aiTotal = 0;
    GRADING_CONFIG.forEach(q => {
      const g = gradeMap[q.id];
      if (g) aiTotal += Math.min(g.score, q.maxPts);
    });

    // Append to sheet
    const row = [
      data.timestamp || new Date().toLocaleString(),
      email,
      data.name || ''
    ];

    GRADING_CONFIG.forEach(q => {
      const g = gradeMap[q.id] || { score: 0, feedback: 'Grading error' };
      row.push(
        (data[q.id] || '').trim(),
        Math.min(g.score, q.maxPts),
        g.feedback || ''
      );
    });

    row.push(aiTotal, ''); // AI Total, Teacher Final Score (blank)
    sheet.appendRow(row);

    // Return grades to frontend
    return corsResponse({ success: true, grades: gradeMap, aiTotal });

  } catch (err) {
    console.error(err);
    return corsResponse({ success: false, error: err.toString() });
  }
}
