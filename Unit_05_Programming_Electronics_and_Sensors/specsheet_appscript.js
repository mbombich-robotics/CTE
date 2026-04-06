/**
 * Claw Project Spec Sheet Template Builder
 * ─────────────────────────────────────────
 * HOW TO USE:
 *   1. Open your Google Doc
 *   2. Extensions → Apps Script
 *   3. Delete any existing code in the editor
 *   4. Paste this entire script
 *   5. Click Run (▶) — authorize if prompted
 *   6. Return to your Doc — the template is ready
 *
 * NOTE: This will CLEAR the document before building the template.
 */

function buildSpecSheetTemplate() {
  var doc  = DocumentApp.getActiveDocument();
  var body = doc.getBody();

  body.clear();

  // ── Title & student info ──
  var titlePara = body.appendParagraph('Claw Project — Engineering Spec Sheet');
  titlePara.setHeading(DocumentApp.ParagraphHeading.TITLE);

  var subPara = body.appendParagraph('Unit 5 · Lesson 14  |  Applied Engineering & Robotics');
  subPara.editAsText().setForegroundColor('#666666').setItalic(true).setFontSize(11);

  body.appendParagraph('');

  body.appendParagraph(
    'Name: ________________________________     Period: _________     Date: _______________'
  ).editAsText().setFontSize(11);

  body.appendHorizontalRule();
  body.appendParagraph('');

  // ── Section 1: Project Overview ──
  addH1(body, '1. Project Overview');
  addNote(body,
    'Write 2–3 sentences describing what your project does and what problem it solves. ' +
    'Example: "This project uses a Pololu micro gripper servo and the RP2040 Connect to ' +
    'classify the size of an unknown object by detecting when the claw stalls against it, ' +
    'then indicates the result with a colored LED."'
  );
  addBlankLines(body, 4);

  // ── Section 2: Bill of Materials ──
  addH1(body, '2. Bill of Materials');
  addNote(body, 'List every component used. Use AI to help find datasheet links — log that prompt in Section 8.');

  appendStyledTable(body, [
    ['Component',                       'Description',                                    'Datasheet / Link',        'Qty'],
    ['Pololu Micro Gripper Kit #3551',  'Servo-driven claw with feedback potentiometer',  'pololu.com/product/3551', '1'],
    ['Arduino Nano RP2040 Connect',     'Microcontroller with WiFi and onboard RGB LED',  '[find and paste link]',   '1'],
    ['[add component]',                 '',                                                '',                        ''],
    ['[add component]',                 '',                                                '',                        ''],
    ['[add component]',                 '',                                                '',                        ''],
  ]);

  // ── Section 3: Hardware Setup ──
  addH1(body, '3. Hardware Setup');
  addNote(body, 'Document how everything is wired. Describe the connections in your own words below the table.');

  appendStyledTable(body, [
    ['Signal',                 'RP2040 Pin', 'Notes'],
    ['Servo PWM signal',       '19 (GRIPPER_SERVO)', 'claw.writeMicroseconds() — range 500 to 2400'],
    ['Feedback potentiometer', 'A0 (GRIPPER_FBK)',   'analogRead() returns 0–1023'],
    ['Red LED',                'LEDR',       'Active low — write LOW to turn ON, HIGH to turn OFF'],
    ['Green LED',              'LEDG',       'Active low — write LOW to turn ON, HIGH to turn OFF'],
    ['Blue LED',               'LEDB',       'Active low — write LOW to turn ON, HIGH to turn OFF'],
  ]);

  addNote(body, 'Wiring description (in your own words):');
  addBlankLines(body, 3);

  // ── Section 4: Key Concepts ──
  addH1(body, '4. Key Concepts');
  addNote(body,
    'Write all explanations in YOUR OWN WORDS — not copied or pasted from AI. ' +
    'This section is what the quiz is based on. If you cannot write it yourself, that is a ' +
    'signal to keep asking AI to explain it until you understand it well enough to do so.'
  );
  body.appendParagraph('');

  addH2(body, 'PWM (Pulse Width Modulation)');
  addNote(body,
    'Explain: What is PWM? How does the width of the pulse physically cause the servo to rotate? ' +
    'What pulse width values does this servo use, and what position does each value correspond to?'
  );
  addBlankLines(body, 4);

  addH2(body, 'Analog Feedback / ADC');
  addNote(body,
    'Explain: What does the feedback wire on the Pololu claw do? What voltage range does it output ' +
    'and what do the min/max voltages mean physically? What is an ADC? ' +
    'Why does the RP2040 Connect use a 3.3V reference instead of 5V, and how does that change ' +
    'your expected ADC values? Show the formula and your calculated values in the table below.'
  );
  addBlankLines(body, 2);

  appendStyledTable(body, [
    ['Calculation',                        'Formula',                  'Your Result'],
    ['ADC when fully open (~0.5V)',         '(0.5 / 3.3) x 1023 =',    ''],
    ['ADC when fully closed (~2.2V)',       '(2.2 / 3.3) x 1023 =',    ''],
    ['Your measured open value (Day 3)',    '—',                        ''],
    ['Your measured closed value (Day 3)', '—',                        ''],
  ]);

  addBlankLines(body, 2);

  addH2(body, 'Feedback-Controlled Loop');
  addNote(body,
    'Explain: How does your code detect when the claw has touched an object without being able to ' +
    'see it? Why does the feedback value stop changing when the servo stalls against an object? ' +
    'Why is this better than simply closing the claw all the way every time?'
  );
  addBlankLines(body, 4);

  // ── Section 5: Algorithm ──
  addH1(body, '5. Algorithm');
  addNote(body,
    'Describe your algorithm as a numbered list or written flowchart. ' +
    'Every step should be clear enough that someone else could re-create your code from this description alone. ' +
    'Draw your flowchart on paper first (Day 4), then transcribe it here.'
  );
  addBlankLines(body, 6);

  addH2(body, 'Classification Thresholds');
  addNote(body, 'Fill in your calibrated ADC values from Day 3. Do not leave these as guesses.');

  appendStyledTable(body, [
    ['Object Category', 'Feedback ADC Range',                  'LED Color',         'Your Threshold Value'],
    ['Large',           'below LARGE_THRESHOLD',               'Green',             'LARGE_THRESHOLD = '],
    ['Medium',          'LARGE_THRESHOLD to SMALL_THRESHOLD',  'Blue',              '—'],
    ['Small',           'above SMALL_THRESHOLD',               'Red',               'SMALL_THRESHOLD = '],
    ['No object',       'loop closes fully without stalling',   'Blue — 3x flash',  '—'],
    ['Slip detected',   'grip held, feedback drifts > 15',      'Yellow — 3x flash','SLIP_DELTA = 15 (adjust if needed)'],
  ]);

  // ── Section 6: Annotated Code ──
  addH1(body, '6. Annotated Code');
  addNote(body,
    'Paste your final code here. Every meaningful line must have a comment written by you — not AI. ' +
    'Use Insert > Building blocks > Code block for monospace formatting, or paste as plain text.'
  );
  body.appendParagraph('');
  body.appendParagraph('// Paste your final, fully-annotated code here.')
      .editAsText().setFontFamily('Courier New').setFontSize(10).setForegroundColor('#333333');
  body.appendParagraph('');

  // ── Section 7: Testing Results ──
  addH1(body, '7. Testing Results');
  addNote(body,
    'Test with at least 5 different objects. Record results honestly — unexpected outcomes ' +
    'are just as valuable as correct ones. Explain any anomalies in the Notes column.'
  );

  appendStyledTable(body, [
    ['Object Tested', 'Expected Category', 'Actual LED', 'Slip Detected?', 'Notes'],
    ['Tennis ball',   'Large',             '',           '',               ''],
    ['Marker',        'Medium',            '',           '',               ''],
    ['Pencil',        'Small',             '',           '',               ''],
    ['Paper cup',     'Medium',            '',           '',               ''],
    ['[your choice]', '',                  '',           '',               ''],
    ['[your choice]', '',                  '',           '',               ''],
  ]);

  // ── Section 8: AI Conversation Log ──
  addH1(body, '8. AI Conversation Log');
  addNote(body,
    'Document every significant AI interaction. Paste the exact prompt you used, a key excerpt ' +
    'of the response, and a note about what you used, changed, or rejected. ' +
    'Minimum: 3 prompts for Week 1 checkpoint. Minimum: 6 prompts for final submission.'
  );

  appendStyledTable(body, [
    ['#', 'My Prompt (paste exactly)', 'AI Response — key excerpt', 'What I did with it'],
    ['1', '', '', ''],
    ['2', '', '', ''],
    ['3', '', '', ''],
    ['4', '', '', ''],
    ['5', '', '', ''],
    ['6', '', '', ''],
  ]);

  // ── Section 9: Challenges & Solutions ──
  addH1(body, '9. Challenges & Solutions');
  addNote(body,
    'Describe at least two problems you encountered and how you solved them. ' +
    'At least one must involve AI — either something AI got wrong, something you had to verify, ' +
    'or a case where AI helped you understand something you were stuck on.'
  );
  body.appendParagraph('');

  addH2(body, 'Challenge 1');
  addNote(body, 'Describe the problem:');
  addBlankLines(body, 2);
  addNote(body, 'How you solved it:');
  addBlankLines(body, 2);

  addH2(body, 'Challenge 2');
  addNote(body, 'Describe the problem:');
  addBlankLines(body, 2);
  addNote(body, 'How you solved it:');
  addBlankLines(body, 2);

  DocumentApp.getUi().alert('Spec sheet template created successfully!');
}


// ════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════

function addH1(body, text) {
  var p = body.appendParagraph(text);
  p.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  return p;
}

function addH2(body, text) {
  var p = body.appendParagraph(text);
  p.setHeading(DocumentApp.ParagraphHeading.HEADING2);
  return p;
}

function addNote(body, text) {
  var p = body.appendParagraph(text);
  p.editAsText().setFontSize(10).setItalic(true).setForegroundColor('#666666');
  return p;
}

function addBlankLines(body, count) {
  for (var i = 0; i < count; i++) {
    body.appendParagraph('').editAsText().setFontSize(11);
  }
}

function appendStyledTable(body, data) {
  var table = body.appendTable(data);

  // Header row — dark blue background, white bold text
  var headerRow = table.getRow(0);
  for (var c = 0; c < headerRow.getNumCells(); c++) {
    var cell = headerRow.getCell(c);
    cell.setBackgroundColor('#1a56a0');
    cell.editAsText().setForegroundColor('#ffffff').setBold(true).setFontSize(10);
  }

  // Data rows — alternating row shading
  for (var r = 1; r < table.getNumRows(); r++) {
    var row = table.getRow(r);
    var bg  = (r % 2 === 0) ? '#f0f4fa' : '#ffffff';
    for (var col = 0; col < row.getNumCells(); col++) {
      var cell = row.getCell(col);
      cell.setBackgroundColor(bg);
      cell.editAsText().setFontSize(10);
    }
  }

  body.appendParagraph('');
  return table;
}
