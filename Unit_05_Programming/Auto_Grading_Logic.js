/*
  AUTO-GRADING LOGIC FOR PRACTICAL TEST

  This function grades submitted Arduino code and returns a score out of 10 points.

  Checks performed:
  1. Serial.begin(9600) present - 2 points
  2. pinMode(9, OUTPUT) correct - 2 points
  3. Missing semicolon fixed / correct variable used - 2 points
  4. PWM values in valid range (0-255) - 2 points
  5. analogWrite() usage correct - 2 points
*/

function gradeCode(submittedCode) {
  let score = 0;
  let feedback = [];
  const maxScore = 10;

  // Clean up code for analysis (remove comments and extra whitespace)
  const cleanCode = submittedCode
    .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove block comments
    .replace(/\/\/.*/g, '')             // Remove line comments
    .replace(/\s+/g, ' ')               // Normalize whitespace
    .trim();

  // ===== CHECK 1: Serial.begin(9600) - 2 points =====
  if (/Serial\.begin\s*\(\s*9600\s*\)/.test(cleanCode)) {
    score += 2;
    feedback.push('✓ Serial.begin(9600) present (2 pts)');
  } else {
    feedback.push('✗ Serial.begin(9600) missing or incorrect (0 pts)');
  }

  // ===== CHECK 2: pinMode(9, OUTPUT) - 2 points =====
  if (/pinMode\s*\(\s*9\s*,\s*OUTPUT\s*\)/.test(cleanCode)) {
    score += 2;
    feedback.push('✓ pinMode(9, OUTPUT) correct (2 pts)');
  } else {
    feedback.push('✗ pinMode(9, OUTPUT) missing or incorrect (0 pts)');
  }

  // ===== CHECK 3: Variable usage & semicolons - 2 points =====
  // Check that pwmValue is used correctly in Serial.println
  const hasPwmValuePrint = /Serial\.println\s*\(\s*pwmValue\s*\)\s*;/.test(cleanCode);
  const hasProperSemicolons = !/(Serial\.print|Serial\.println)\s*\([^)]*\)\s*(?!;)/.test(cleanCode);

  if (hasPwmValuePrint && hasProperSemicolons) {
    score += 2;
    feedback.push('✓ Correct variable usage and semicolons (2 pts)');
  } else if (hasPwmValuePrint || hasProperSemicolons) {
    score += 1;
    feedback.push('⚠ Partial credit: variable or semicolon issues (1 pt)');
  } else {
    feedback.push('✗ Variable usage or semicolons incorrect (0 pts)');
  }

  // ===== CHECK 4: PWM values in range (0-255) - 2 points =====
  // Check that 300 has been changed to 255
  const has300 = /analogWrite\s*\([^,]+,\s*300\s*\)/.test(cleanCode) ||
                 /println\s*\(\s*300\s*\)/.test(cleanCode);
  const has255 = /analogWrite\s*\([^,]+,\s*255\s*\)/.test(cleanCode) &&
                 /println\s*\(\s*255\s*\)/.test(cleanCode);

  if (!has300 && has255) {
    score += 2;
    feedback.push('✓ PWM values corrected to valid range (2 pts)');
  } else if (has255) {
    score += 1;
    feedback.push('⚠ PWM partially corrected (1 pt)');
  } else {
    feedback.push('✗ PWM values still out of range (0 pts)');
  }

  // ===== CHECK 5: analogWrite() usage - 2 points =====
  const analogWriteCount = (cleanCode.match(/analogWrite\s*\(/g) || []).length;
  const hasLoopAnalogWrite = /analogWrite\s*\(\s*9\s*,\s*pwmValue\s*\)/.test(cleanCode);

  if (analogWriteCount >= 2 && hasLoopAnalogWrite) {
    score += 2;
    feedback.push('✓ analogWrite() used correctly (2 pts)');
  } else if (analogWriteCount >= 1) {
    score += 1;
    feedback.push('⚠ analogWrite() partially correct (1 pt)');
  } else {
    feedback.push('✗ analogWrite() usage incorrect (0 pts)');
  }

  return {
    score: score,
    maxScore: maxScore,
    percentage: Math.round((score / maxScore) * 100),
    feedback: feedback,
    passed: score >= 7  // 70% to pass
  };
}

// ===== EXAMPLE USAGE =====
/*
const studentCode = `
void setup() {
  Serial.begin(9600);
  pinMode(9, OUTPUT);
}

void loop() {
  int motorSpeed = 0;

  for (int i = 0; i <= 10; i++) {
    int pwmValue = i * 25;

    Serial.print("Motor Speed: ");
    Serial.println(pwmValue);

    analogWrite(9, pwmValue);
    delay(500);
  }

  analogWrite(9, 255);
  Serial.print("Motor Speed: ");
  Serial.println(255);

  delay(5000);
}
`;

const result = gradeCode(studentCode);
console.log('Score:', result.score + '/' + result.maxScore);
console.log('Percentage:', result.percentage + '%');
console.log('Passed:', result.passed);
console.log('Feedback:');
result.feedback.forEach(item => console.log('  ' + item));
*/
